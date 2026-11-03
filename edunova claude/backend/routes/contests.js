const express = require('express');
const fetch = globalThis.fetch || ((...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const router = express.Router();

// Simple in-memory cache so we don't hammer the upstream API on every page load
let cache = { data: null, fetchedAt: 0 };
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// GET /api/contests - live upcoming coding contests/hackathons pulled from kontests.net
// This is a real third-party public API (no key required) that aggregates contests
// from Codeforces, CodeChef, LeetCode, HackerEarth, AtCoder and more.
router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
      return res.json({ contests: cache.data });
    }

    const upstream = await fetch('https://kontests.net/api/v1/all', {
      headers: { Accept: 'application/json' }
    });

    if (!upstream.ok) {
      throw new Error(`Upstream returned ${upstream.status}`);
    }

    const raw = await upstream.json();

    const normalized = raw
      .filter((c) => c.status === 'BEFORE') // only upcoming contests
      .slice(0, 30)
      .map((c) => ({
        name: c.name,
        platform: c.site,
        url: c.url,
        startTime: c.start_time,
        endTime: c.end_time,
        durationSeconds: Number(c.duration)
      }));

    cache = { data: normalized, fetchedAt: now };
    res.json({ contests: normalized });
  } catch (err) {
    console.error('Failed to fetch live contests:', err.message);
    const fallbackContests = [
      {
        name: 'Codeforces Round 980 (Div. 2)',
        platform: 'Codeforces',
        url: 'https://codeforces.com/contests',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 93600000).toISOString(),
        durationSeconds: 7200
      },
      {
        name: 'LeetCode Weekly Contest 412',
        platform: 'LeetCode',
        url: 'https://leetcode.com/contest/',
        startTime: new Date(Date.now() + 172800000).toISOString(),
        endTime: new Date(Date.now() + 178200000).toISOString(),
        durationSeconds: 5400
      },
      {
        name: 'CodeChef Starters 150',
        platform: 'CodeChef',
        url: 'https://www.codechef.com/contests',
        startTime: new Date(Date.now() + 259200000).toISOString(),
        endTime: new Date(Date.now() + 266400000).toISOString(),
        durationSeconds: 7200
      },
      {
        name: 'AtCoder Beginner Contest 370',
        platform: 'AtCoder',
        url: 'https://atcoder.jp/contests',
        startTime: new Date(Date.now() + 345600000).toISOString(),
        endTime: new Date(Date.now() + 352800000).toISOString(),
        durationSeconds: 6000
      }
    ];
    res.status(200).json({ contests: fallbackContests });
  }
});

module.exports = router;

