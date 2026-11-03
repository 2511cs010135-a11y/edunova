const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'data', 'db.json'));
const db = low(adapter);

const initialEvents = [
  {
    id: 'evt-001',
    title: 'EduNova Winter Hackathon 2026',
    type: 'hackathon',
    mode: 'Hybrid',
    location: 'Hyderabad, IN + Online',
    startDate: '2026-09-12T09:00:00.000Z',
    endDate: '2026-09-14T18:00:00.000Z',
    registrationDeadline: '2026-09-05T23:59:00.000Z',
    capacity: 300,
    tags: ['AI/ML', 'Web3', 'Open Innovation'],
    description:
      'A 48-hour build sprint for student teams. Ship a working prototype around any of the three tracks and pitch it to a panel of industry mentors.',
    prize: '₹1,50,000 prize pool',
    organizer: 'EduNova Community'
  },
  {
    id: 'evt-002',
    title: 'DSA Speed Circuit Sprint',
    type: 'contest',
    mode: 'Online',
    location: 'Online',
    startDate: '2026-08-02T14:00:00.000Z',
    endDate: '2026-08-02T17:00:00.000Z',
    registrationDeadline: '2026-08-02T13:30:00.000Z',
    capacity: 1000,
    tags: ['DSA', 'Competitive Programming'],
    description:
      'A timed 3-hour problem-solving contest across arrays, graphs and dynamic programming. Leaderboard resets every season.',
    prize: 'Top 10 get EduNova Pro for a year',
    organizer: 'EduNova Community'
  },
  {
    id: 'evt-003',
    title: 'Frontend Systems & Performance Meetup',
    type: 'tech-talk',
    mode: 'Offline',
    location: 'Bengaluru, IN',
    startDate: '2026-08-20T11:00:00.000Z',
    endDate: '2026-08-20T14:00:00.000Z',
    registrationDeadline: '2026-08-18T23:59:00.000Z',
    capacity: 120,
    tags: ['Frontend', 'Design Systems'],
    description:
      'Engineers from three product companies walk through how they scaled their component libraries past 200 components and optimized Core Web Vitals.',
    prize: null,
    organizer: 'EduNova x Campus Partners'
  },
  {
    id: 'evt-004',
    title: 'Global Generative AI Innovation Challenge',
    type: 'hackathon',
    mode: 'Online',
    location: 'Global Online',
    startDate: '2026-10-01T00:00:00.000Z',
    endDate: '2026-10-05T23:59:00.000Z',
    registrationDeadline: '2026-09-25T23:59:00.000Z',
    capacity: 2000,
    tags: ['GenAI', 'LLMs', 'PyTorch', 'Agents'],
    description:
      'Build autonomous AI agents, multimodal search tools, or fine-tuned Domain-Specific LLM applications using modern open-source models.',
    prize: '$10,000 in Cloud Credits + Mentorship',
    organizer: 'EduNova AI Lab'
  },
  {
    id: 'evt-005',
    title: 'Full-Stack Web3 & DeFi Buildathon',
    type: 'hackathon',
    mode: 'Hybrid',
    location: 'Delhi, IN + Remote',
    startDate: '2026-10-15T10:00:00.000Z',
    endDate: '2026-10-17T18:00:00.000Z',
    registrationDeadline: '2026-10-10T23:59:00.000Z',
    capacity: 500,
    tags: ['Solidity', 'Ethereum', 'Smart Contracts', 'React'],
    description:
      'Create decentralized finance applications, NFT utility platforms, or zero-knowledge proof identity verification protocols.',
    prize: '₹2,50,000 bounty pool',
    organizer: 'EduNova Web3 Collective'
  },
  {
    id: 'evt-006',
    title: 'Open-Source Summer Code Sprint',
    type: 'hackathon',
    mode: 'Online',
    location: 'Online',
    startDate: '2026-08-10T09:00:00.000Z',
    endDate: '2026-08-25T18:00:00.000Z',
    registrationDeadline: '2026-08-08T23:59:00.000Z',
    capacity: 1500,
    tags: ['Open Source', 'GitHub', 'Python', 'TypeScript'],
    description:
      'A two-week open-source contribution marathon. Resolve issues, submit Pull Requests to top developer tools, and earn digital badges.',
    prize: 'Swag kits + Industry references',
    organizer: 'EduNova OSS Initiative'
  },
  {
    id: 'evt-007',
    title: 'Cross-Platform Mobile App Challenge',
    type: 'hackathon',
    mode: 'Online',
    location: 'Online',
    startDate: '2026-11-05T09:00:00.000Z',
    endDate: '2026-11-07T18:00:00.000Z',
    registrationDeadline: '2026-11-01T23:59:00.000Z',
    capacity: 400,
    tags: ['Flutter', 'React Native', 'Mobile UX', 'Firebase'],
    description:
      'Design and deploy intuitive iOS and Android mobile applications tackling real-world student utility, healthcare, or productivity challenges.',
    prize: '₹1,00,000 + App Store publishing grant',
    organizer: 'EduNova Mobile Guild'
  }
];

const initialFlashcards = [
  {
    id: 'deck-web-1',
    title: 'React & Modern Frontend Patterns',
    category: 'Web Development',
    description: 'Essential hooks, virtual DOM concepts, performance optimization, and state management rules.',
    cards: [
      {
        id: 'fc-1',
        front: 'When should you use `useCallback` vs `useMemo` in React?',
        back: '`useCallback(fn, deps)` memoizes a function instance across renders, while `useMemo(() => value, deps)` memoizes the computed result value of an expensive operation.'
      },
      {
        id: 'fc-2',
        front: 'What causes infinite re-render loops in `useEffect`?',
        back: 'Updating state inside `useEffect` without specifying a dependency array, or including an object/function dependency that is re-created on every render cycle.'
      },
      {
        id: 'fc-3',
        front: 'What is the purpose of React SyntheticEvents?',
        back: 'A cross-browser wrapper around native DOM events, ensuring consistent event property behaviors across all modern web browsers.'
      },
      {
        id: 'fc-4',
        front: 'What is React Server Components (RSC)?',
        back: 'Components that run exclusively on the server, producing zero JavaScript bundle sent to the browser, reducing initial load time.'
      }
    ]
  },
  {
    id: 'deck-dsa-1',
    title: 'DSA Patterns & Algorithmic Complexities',
    category: 'Data Structures',
    description: 'Two pointers, sliding window, graph traversals, and dynamic programming state transitions.',
    cards: [
      {
        id: 'fc-5',
        front: 'How do you detect a cycle in a Linked List in O(1) space complexity?',
        back: 'Floyd’s Cycle Finding Algorithm (Tortoise and Hare technique) using slow (1 step) and fast (2 steps) pointers.'
      },
      {
        id: 'fc-6',
        front: 'What is the worst-case time complexity of QuickSort?',
        back: 'O(N²) when the pivot selected is consistently the minimum or maximum element in an already sorted array. Average complexity is O(N log N).'
      },
      {
        id: 'fc-7',
        front: 'What is the key difference between BFS and DFS for Graph Traversal?',
        back: 'BFS uses a Queue and explores neighbor by neighbor (level-order, shortest path in unweighted graphs). DFS uses a Stack/Recursion and explores deep down a branch before backtracking.'
      },
      {
        id: 'fc-8',
        front: 'What is the Sliding Window pattern used for?',
        back: 'Optimizing continuous subarray or substring problems from O(N²) down to O(N) by maintaining a dynamic window range.'
      }
    ]
  },
  {
    id: 'deck-aiml-1',
    title: 'Machine Learning & Deep Learning Essentials',
    category: 'AI / ML',
    description: 'Loss functions, activation functions, backpropagation, and transformer architectures.',
    cards: [
      {
        id: 'fc-9',
        front: 'What is Vanishing Gradient in deep neural networks?',
        back: 'When gradients during backpropagation shrink towards 0 in early layers, preventing weights from updating effectively during training.'
      },
      {
        id: 'fc-10',
        front: 'What is Self-Attention in Transformer models?',
        back: 'A mechanism that allows each token in a sequence to calculate attention weights with every other token in the sequence simultaneously.'
      },
      {
        id: 'fc-11',
        front: 'What is the difference between Precision and Recall?',
        back: 'Precision = True Positives / (True Positives + False Positives). Recall = True Positives / (True Positives + False Negatives).'
      }
    ]
  },
  {
    id: 'deck-sys-1',
    title: 'System Design & Distributed Systems',
    category: 'System Design',
    description: 'Load balancing, caching strategies, database sharding, and CAP theorem.',
    cards: [
      {
        id: 'fc-12',
        front: 'What does the CAP Theorem state?',
        back: 'A distributed data store can simultaneously provide at most 2 out of 3 guarantees: Consistency, Availability, and Partition Tolerance.'
      },
      {
        id: 'fc-13',
        front: 'What is the difference between Horizontal and Vertical Scaling?',
        back: 'Vertical scaling (Scale Up) adds more RAM/CPU to an existing machine. Horizontal scaling (Scale Out) adds more server nodes to the pool.'
      },
      {
        id: 'fc-14',
        front: 'What is a Cache-Aside (Lazy Loading) pattern?',
        back: 'The application first reads from cache; if missing, it reads from the database, writes the data to cache, and returns it.'
      }
    ]
  },
  {
    id: 'deck-devops-1',
    title: 'Cloud Native, Docker & Kubernetes',
    category: 'DevOps & Cloud',
    description: 'Containers, Kubernetes pods, ingress controllers, CI/CD pipelines, and infrastructure as code.',
    cards: [
      {
        id: 'fc-15',
        front: 'What is the difference between a Docker Image and a Docker Container?',
        back: 'A Docker Image is a read-only immutable blueprint/template. A Docker Container is a running isolated instance of that image.'
      },
      {
        id: 'fc-16',
        front: 'What is a Kubernetes Pod?',
        back: 'The smallest deployable computing unit in Kubernetes, wrapping one or more co-located container instances sharing network and storage.'
      },
      {
        id: 'fc-17',
        front: 'What is the purpose of Kubernetes Ingress?',
        back: 'An API object that manages external HTTP/HTTPS access to services within a cluster, providing load balancing, SSL termination, and name-based virtual hosting.'
      }
    ]
  },
  {
    id: 'deck-sec-1',
    title: 'Cybersecurity & Web App Defense',
    category: 'Security',
    description: 'OWASP vulnerabilities, cryptography fundamentals, JWTs, CORS, and network security protocols.',
    cards: [
      {
        id: 'fc-18',
        front: 'What is Cross-Site Scripting (XSS) and how is it prevented?',
        back: 'XSS allows attackers to inject malicious scripts into web pages viewed by users. Prevented by context-aware output encoding, sanitizing input, and implementing Content Security Policy (CSP).'
      },
      {
        id: 'fc-19',
        front: 'What is the difference between Symmetric and Asymmetric Encryption?',
        back: 'Symmetric encryption uses a single shared secret key for both encryption and decryption (AES). Asymmetric encryption uses a public/private key pair (RSA/ECC).'
      },
      {
        id: 'fc-20',
        front: 'Why should passwords never be stored using simple hashing like MD5 or SHA-256?',
        back: 'Fast hash functions are vulnerable to dictionary attacks and rainbow tables. Always use salted, adaptive key-stretching algorithms like bcrypt, Argon2, or PBKDF2.'
      }
    ]
  }
];

const initialCheatsheets = [
  {
    id: 'cs-js-array',
    title: 'JavaScript Array Methods Quick Cheat Sheet',
    category: 'Web Development',
    tags: ['JavaScript', 'ES6', 'Functional'],
    description: 'Essential high-order array methods for immutably transforming, filtering, and reducing data arrays.',
    code: `// 1. Map: Transform elements
const doubled = [1, 2, 3].map(n => n * 2); // [2, 4, 6]

// 2. Filter: Keep matching elements
const evens = [1, 2, 3, 4].filter(n => n % 2 === 0); // [2, 4]

// 3. Reduce: Accumulate into single result
const sum = [10, 20, 30].reduce((acc, curr) => acc + curr, 0); // 60

// 4. Find: Return first matching element
const user = users.find(u => u.id === 'usr-1');`
  },
  {
    id: 'cs-pytorch-tensor',
    title: 'PyTorch Essentials & Model Training Loop',
    category: 'AI / ML',
    tags: ['PyTorch', 'Deep Learning', 'Python'],
    description: 'Standard PyTorch neural network training loop boilerplate with loss calculation & backward pass.',
    code: `import torch
import torch.nn as nn

# Standard Training Loop
for epoch in range(num_epochs):
    model.train()
    optimizer.zero_grad()        # Clear previous gradients
    outputs = model(inputs)       # Forward pass
    loss = criterion(outputs, targets) # Compute loss
    loss.backward()              # Backpropagation
    optimizer.step()             # Update weights`
  },
  {
    id: 'cs-react-hooks',
    title: 'React Hooks Cheat Sheet & Common Use Cases',
    category: 'Web Development',
    tags: ['React', 'Hooks', 'State'],
    description: 'Complete reference for useState, useEffect, useRef, useMemo, and custom hooks.',
    code: `import { useState, useEffect, useRef, useMemo } from 'react';

// State & Ref
const [count, setCount] = useState(0);
const inputRef = useRef(null);

// Effect with Dependencies
useEffect(() => {
  document.title = \`Count: \${count}\`;
  return () => { /* cleanup */ };
}, [count]);

// Memoized calculation
const expensiveCalc = useMemo(() => count * 1000, [count]);`
  },
  {
    id: 'cs-sql-joins',
    title: 'SQL Queries, Joins & Aggregations Reference',
    category: 'Databases',
    tags: ['SQL', 'PostgreSQL', 'Joins'],
    description: 'Essential SQL syntax for INNER JOIN, LEFT JOIN, GROUP BY, and HAVING queries.',
    code: `-- INNER JOIN: Matching rows in both tables
SELECT u.name, o.total 
FROM users u 
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN: All left table rows + matching right rows
SELECT u.name, COUNT(o.id) as order_count 
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id 
GROUP BY u.id 
HAVING COUNT(o.id) > 2;`
  },
  {
    id: 'cs-git-workflow',
    title: 'Git & GitHub Essential Command Line Cheat Sheet',
    category: 'DevOps & Tools',
    tags: ['Git', 'CLI', 'Version Control'],
    description: 'Common Git commands for branching, stashing, rebasing, and committing.',
    code: `# Create and switch branch
git checkout -b feature/new-module

# Stash uncommitted changes
git stash save "WIP feature"
git stash pop

# Rebase feature onto main
git fetch origin
git rebase origin/main

# Undo last commit keeping changes staged
git reset --soft HEAD~1`
  },
  {
    id: 'cs-docker-cli',
    title: 'Docker CLI & Container Management Cheat Sheet',
    category: 'DevOps & Tools',
    tags: ['Docker', 'Containers', 'DevOps'],
    description: 'Essential commands for container lifecycle, building images, networks, and Docker Compose.',
    code: `# Build image with tag
docker build -t edunova-app:v1 .

# Run container with port forwarding & env var
docker run -d -p 5000:5000 --name edunova-srv --env PORT=5000 edunova-app:v1

# Inspect running logs & shell exec
docker logs -f edunova-srv
docker exec -it edunova-srv sh

# Docker Compose shortcuts
docker compose up -d --build
docker compose down -v`
  },
  {
    id: 'cs-postgres-indexing',
    title: 'PostgreSQL Indexing & Query Optimization Cheat Sheet',
    category: 'Databases',
    tags: ['SQL', 'PostgreSQL', 'Performance', 'Indexes'],
    description: 'Creating B-Tree / Partial / Composite indexes and analyzing query performance with EXPLAIN ANALYZE.',
    code: `-- Composite Index for multi-column queries
CREATE INDEX idx_users_college_created 
ON users(college, created_at DESC);

-- Partial Index for specific filtered subsets
CREATE INDEX idx_active_teams 
ON teams(created_at) WHERE status = 'Open';

-- Analyze Execution Plan & Query Costs
EXPLAIN ANALYZE 
SELECT u.name, COUNT(r.id) 
FROM users u 
JOIN registrations r ON u.id = r.user_id 
GROUP BY u.id;`
  },
  {
    id: 'cs-linux-bash',
    title: 'Linux Shell Commands & System Admin Cheat Sheet',
    category: 'DevOps & Tools',
    tags: ['Linux', 'Bash', 'CLI', 'SysAdmin'],
    description: 'Process inspection, text manipulation (grep/awk/sed), file permissions, and network sockets.',
    code: `# Find processes listening on port 5000
lsof -i :5000   # or: netstat -tulpn | grep 5000

# Grep search recursively with line numbers
grep -rnw './src' -e 'useAuth'

# Change ownership & permissions
chmod 755 script.sh
chown -R www-data:www-data /var/www

# System resource monitor
top -o %MEM   # or: htop`
  }
];

const initialRoadmaps = [
  {
    id: 'rm-webdev',
    title: 'Full-Stack Web Development',
    summary: 'From semantic HTML to shipping a full-stack app with an API and a database.',
    level: 'Beginner → Advanced',
    milestones: [
      {
        id: 'wd-1',
        title: 'Foundations',
        items: ['Semantic HTML & accessibility basics', 'CSS layout: Flexbox & Grid', 'JavaScript fundamentals & DOM']
      },
      {
        id: 'wd-2',
        title: 'Frontend Engineering',
        items: ['Modern JS (ES6+) & async patterns', 'React fundamentals', 'State management & routing']
      },
      {
        id: 'wd-3',
        title: 'Backend & Data',
        items: ['Node.js & Express APIs', 'Relational databases & SQL', 'Auth (JWT/OAuth) & security basics']
      },
      {
        id: 'wd-4',
        title: 'Ship It',
        items: ['Testing (unit + integration)', 'CI/CD & deployment', 'Build a capstone project end-to-end']
      }
    ]
  },
  {
    id: 'rm-aiml',
    title: 'AI / Machine Learning',
    summary: 'Math foundations through training and deploying your own models.',
    level: 'Beginner → Advanced',
    milestones: [
      {
        id: 'ai-1',
        title: 'Math & Python Foundations',
        items: ['Linear algebra & probability basics', 'NumPy / Pandas', 'Data visualization']
      },
      {
        id: 'ai-2',
        title: 'Core Machine Learning',
        items: ['Supervised vs unsupervised learning', 'Scikit-learn model building', 'Model evaluation & tuning']
      },
      {
        id: 'ai-3',
        title: 'Deep Learning',
        items: ['Neural networks from scratch', 'PyTorch or TensorFlow', 'CNNs & transformers overview']
      },
      {
        id: 'ai-4',
        title: 'Applied AI',
        items: ['Fine-tuning & prompting LLMs', 'Deploying a model behind an API', 'Portfolio project + writeup']
      }
    ]
  },
  {
    id: 'rm-dsa',
    title: 'Data Structures & Algorithms',
    summary: 'The interview-and-contest track: build pattern recognition, not just memorized solutions.',
    level: 'Beginner → Advanced',
    milestones: [
      {
        id: 'dsa-1',
        title: 'Core Structures',
        items: ['Arrays, strings & hashing', 'Linked lists, stacks & queues', 'Recursion basics']
      },
      {
        id: 'dsa-2',
        title: 'Trees & Graphs',
        items: ['Binary trees & BSTs', 'Graph traversal (BFS/DFS)', 'Union-Find & shortest paths']
      },
      {
        id: 'dsa-3',
        title: 'Algorithmic Patterns',
        items: ['Sliding window & two pointers', 'Dynamic programming', 'Greedy & backtracking']
      },
      {
        id: 'dsa-4',
        title: 'Contest Ready',
        items: ['Timed mock contests', 'Editorial review habit', 'Track rating on Codeforces/CodeChef']
      }
    ]
  },
  {
    id: 'rm-appdev',
    title: 'Mobile App Development',
    summary: 'Design, build and ship a cross-platform mobile app.',
    level: 'Beginner → Advanced',
    milestones: [
      {
        id: 'app-1',
        title: 'Foundations',
        items: ['Mobile UI/UX principles', 'React Native or Flutter basics', 'Navigation & state']
      },
      {
        id: 'app-2',
        title: 'Device & Data',
        items: ['Local storage & device APIs', 'Networking & REST/GraphQL', 'Push notifications']
      },
      {
        id: 'app-3',
        title: 'Polish & Ship',
        items: ['Testing on real devices', 'App store submission basics', 'Analytics & crash reporting']
      }
    ]
  },
  {
    id: 'rm-devops',
    title: 'Cloud & DevOps Engineering',
    summary: 'Master containerization, Kubernetes, infrastructure as code, and CI/CD automation.',
    level: 'Intermediate → Advanced',
    milestones: [
      {
        id: 'dev-1',
        title: 'Linux & Networking',
        items: ['Linux command line & shell scripting', 'Networking protocols (TCP/IP, DNS, HTTP/S)', 'SSH key management & firewalls']
      },
      {
        id: 'dev-2',
        title: 'Containers & Orchestration',
        items: ['Docker containers & Dockerfiles', 'Kubernetes Pods, Deployments & Services', 'Helm charts & Ingress controllers']
      },
      {
        id: 'dev-3',
        title: 'Infrastructure & Automation',
        items: ['Terraform Infrastructure as Code', 'GitHub Actions & GitLab CI pipelines', 'Ansible configuration management']
      },
      {
        id: 'dev-4',
        title: 'Observability & SRE',
        items: ['Prometheus metrics & Grafana dashboards', 'Distributed logging with ELK/Loki', 'Incident response & Site Reliability Engineering']
      }
    ]
  },
  {
    id: 'rm-cyber',
    title: 'Cybersecurity & Ethical Hacking',
    summary: 'Learn web security, penetration testing, cryptography, and defensive auditing.',
    level: 'Beginner → Advanced',
    milestones: [
      {
        id: 'sec-1',
        title: 'Security Fundamentals',
        items: ['Networking fundamentals & packet analysis', 'Cryptography basics (RSA, AES, Hashing)', 'Linux & Windows security model']
      },
      {
        id: 'sec-2',
        title: 'Web Application Security',
        items: ['OWASP Top 10 vulnerabilities', 'SQL Injection & XSS exploitation', 'CSRF, SSRF & Authentication bypass']
      },
      {
        id: 'sec-3',
        title: 'Penetration Testing',
        items: ['Information gathering & Nmap scanning', 'Burp Suite proxy & Metasploit framework', 'Privilege escalation techniques']
      },
      {
        id: 'sec-4',
        title: 'Defensive Security',
        items: ['SIEM log analysis & threat hunting', 'Secure code review & SAST tools', 'Incident response & malware analysis overview']
      }
    ]
  },
  {
    id: 'rm-sysdesign',
    title: 'System Design & Distributed Systems',
    summary: 'Architect scalable, resilient distributed applications and high-throughput systems.',
    level: 'Advanced',
    milestones: [
      {
        id: 'sys-1',
        title: 'Scalability Foundations',
        items: ['Vertical vs Horizontal scaling', 'Load balancing algorithms & reverse proxies', 'Monolith to Microservices migration']
      },
      {
        id: 'sys-2',
        title: 'Data Tier Architecture',
        items: ['Database sharding & replication', 'Caching strategies (Redis/Memcached)', 'NoSQL vs SQL data modeling']
      },
      {
        id: 'sys-3',
        title: 'Asynchronous Processing',
        items: ['Message brokers (Kafka, RabbitMQ)', 'Event-driven architecture & pub/sub', 'Task queues & rate limiting']
      },
      {
        id: 'sys-4',
        title: 'Resilience & Operations',
        items: ['Circuit breaker pattern & retry policies', 'Consistent Hashing algorithms', 'Distributed tracing with Jaeger']
      }
    ]
  }
];

const initialQuizzes = [
  {
    id: 'qz-web-01',
    title: 'Full-Stack Modern Web Engineering',
    category: 'Web Development',
    difficulty: 'Intermediate',
    timeLimit: 10,
    description: 'Test your knowledge of React hooks, REST APIs, asynchronous JavaScript, and CSS layout engines.',
    questions: [
      {
        id: 'q1',
        question: 'What is the primary advantage of React key prop when rendering a list of items?',
        options: [
          'It styles the component automatically',
          'It helps React identify which items have changed, been added, or removed',
          'It forces the entire DOM tree to re-render on every state change',
          'It acts as an automatic database primary key'
        ],
        correctIndex: 1,
        explanation: 'Keys help React identify which items have changed, are added, or are removed, enabling optimal virtual DOM reconciliation.'
      },
      {
        id: 'q2',
        question: 'Which HTTP status code signifies that a resource was successfully created on the server?',
        options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
        correctIndex: 1,
        explanation: '201 Created indicates that the request was successful and a new resource was created as a result.'
      },
      {
        id: 'q3',
        question: 'In CSS Flexbox, which property defines how flex items are aligned along the cross axis?',
        options: ['justify-content', 'align-items', 'flex-direction', 'place-content'],
        correctIndex: 1,
        explanation: 'align-items controls cross-axis alignment, while justify-content controls main-axis alignment.'
      },
      {
        id: 'q4',
        question: 'What does the JavaScript event loop do when an asynchronous microtask (e.g. Promise.then) resolves?',
        options: [
          'Executes it immediately after the current call stack clears, before render/macrotasks',
          'Schedules it for the next browser window tab focus event',
          'Runs it inside a web worker background thread',
          'Discards it if the call stack has more than 5 frames'
        ],
        correctIndex: 0,
        explanation: 'Microtasks (Promises, process.nextTick) are executed right after the current execution context finishes and before macrotasks (setTimeout).'
      }
    ]
  },
  {
    id: 'qz-aiml-01',
    title: 'Machine Learning & Neural Nets Core',
    category: 'AI / ML',
    difficulty: 'Advanced',
    timeLimit: 12,
    description: 'Evaluate fundamental concepts in supervised learning, gradient descent, loss functions, and deep learning architectures.',
    questions: [
      {
        id: 'q1',
        question: 'What problem occurs when a machine learning model learns noise in training data instead of general patterns?',
        options: ['Underfitting', 'Overfitting', 'Vanishing Gradient', 'Data Leakage'],
        correctIndex: 1,
        explanation: 'Overfitting occurs when a model models training data too closely, capturing noise and failing to generalize to new data.'
      },
      {
        id: 'q2',
        question: 'Which activation function outputs values in the range (0, 1), making it suitable for binary classification probability?',
        options: ['ReLU', 'Sigmoid', 'Leaky ReLU', 'Tanh'],
        correctIndex: 1,
        explanation: 'Sigmoid maps any real-valued number into a (0, 1) probability range.'
      },
      {
        id: 'q3',
        question: 'What is the purpose of regularisation techniques like L1 (Lasso) and L2 (Ridge)?',
        options: [
          'Increase model training speed',
          'Prevent overfitting by penalizing complex model weights',
          'Automatically generate synthetic datasets',
          'Convert regression models into neural nets'
        ],
        correctIndex: 1,
        explanation: 'Regularization adds a penalty to the loss function based on weight magnitudes, shrinking parameters to prevent overfitting.'
      }
    ]
  },
  {
    id: 'qz-dsa-01',
    title: 'Algorithmic Efficiency & Data Structures',
    category: 'Data Structures',
    difficulty: 'Beginner',
    timeLimit: 8,
    description: 'Basic to intermediate check on Big-O complexity, Trees, Graphs, and Dynamic Programming patterns.',
    questions: [
      {
        id: 'q1',
        question: 'What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctIndex: 1,
        explanation: 'In a balanced BST, each comparison halves the remaining search space, resulting in O(log N) average time complexity.'
      },
      {
        id: 'q2',
        question: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Priority Queue'],
        correctIndex: 1,
        explanation: 'A Stack operates on LIFO principles, where the last item pushed is the first to be popped.'
      },
      {
        id: 'q3',
        question: 'What algorithm strategy breaks a problem into smaller overlapping subproblems and stores their results?',
        options: ['Greedy', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking'],
        correctIndex: 2,
        explanation: 'Dynamic Programming optimizes recursion by storing (memoizing/tabulating) solutions to overlapping subproblems.'
      }
    ]
  },
  {
    id: 'qz-devops-01',
    title: 'DevOps, Docker & Cloud Native Orchestration',
    category: 'DevOps & Cloud',
    difficulty: 'Intermediate',
    timeLimit: 10,
    description: 'Test your understanding of containerization, Dockerfiles, Kubernetes deployments, and CI/CD pipelines.',
    questions: [
      {
        id: 'q1',
        question: 'What is the difference between Docker COPY and ADD instructions in a Dockerfile?',
        options: [
          'COPY is for local files, while ADD can also fetch remote URLs and extract tar archives',
          'ADD only works on Windows while COPY works on Linux',
          'COPY creates a new container layer while ADD does not',
          'They are exact aliases with no functional difference'
        ],
        correctIndex: 0,
        explanation: 'COPY copies local files/directories from the build context, while ADD supports fetching remote URLs and automatically extracting local tar files.'
      },
      {
        id: 'q2',
        question: 'In Kubernetes, what API object ensures a specified number of identical Pod replicas are running at any given time?',
        options: ['ConfigMap', 'Deployment / ReplicaSet', 'Ingress', 'PersistentVolume'],
        correctIndex: 1,
        explanation: 'A ReplicaSet (managed by a Deployment) maintains a stable set of replica Pods running at any given time.'
      },
      {
        id: 'q3',
        question: 'What is the primary goal of Infrastructure as Code (IaC) tools like Terraform?',
        options: [
          'To compile JavaScript code into native machine instructions',
          'To define and provision cloud infrastructure declaratively using version-controlled files',
          'To monitor CPU usage on physical servers',
          'To replace traditional relational databases'
        ],
        correctIndex: 1,
        explanation: 'IaC allows developers to manage cloud resources (servers, databases, networks) declaratively using code.'
      }
    ]
  },
  {
    id: 'qz-sec-01',
    title: 'Web Application Security & OWASP Defense',
    category: 'Security',
    difficulty: 'Intermediate',
    timeLimit: 10,
    description: 'Evaluate essential security concepts including SQL Injection, XSS, CSRF, and cryptographic hashing.',
    questions: [
      {
        id: 'q1',
        question: 'How do Parameterized Queries (Prepared Statements) prevent SQL Injection vulnerabilities?',
        options: [
          'By encrypting the entire SQL database on disk',
          'By treating user input strictly as data parameters rather than executable SQL command code',
          'By disabling DELETE commands on the server',
          'By running database queries inside a sandboxed Web Worker'
        ],
        correctIndex: 1,
        explanation: 'Prepared statements separate SQL code from data, ensuring user inputs cannot alter the structure of SQL commands.'
      },
      {
        id: 'q2',
        question: 'What type of attack forces an authenticated user to perform unauthorized actions on a web application?',
        options: ['Cross-Site Request Forgery (CSRF)', 'Buffer Overflow', 'Man-in-the-Middle', 'Directory Traversal'],
        correctIndex: 0,
        explanation: 'CSRF tricks an authenticated victim browser into submitting forged HTTP requests to a vulnerable web application.'
      },
      {
        id: 'q3',
        question: 'What is the primary difference between Authentication and Authorization?',
        options: [
          'Authentication verifies WHO you are; Authorization determines WHAT you are allowed to access',
          'Authorization happens before login; Authentication happens after login',
          'Authentication is only for admins; Authorization is for all users',
          'They refer to the exact same security concept'
        ],
        correctIndex: 0,
        explanation: 'Authentication proves identity (e.g. login credentials), while Authorization determines user permissions.'
      }
    ]
  },
  {
    id: 'qz-sys-01',
    title: 'System Design & High Availability Architecture',
    category: 'System Design',
    difficulty: 'Advanced',
    timeLimit: 15,
    description: 'Advanced check on distributed caching, database sharding, rate limiting, and CAP theorem trade-offs.',
    questions: [
      {
        id: 'q1',
        question: 'Under the CAP Theorem, if a network partition occurs in a distributed system, what trade-off must be made?',
        options: [
          'Choose between Availability (answering every request) and Consistency (returning latest data)',
          'Choose between CPU speed and Memory storage',
          'Choose between SQL and NoSQL databases',
          'Choose between HTTP/1.1 and HTTP/2'
        ],
        correctIndex: 0,
        explanation: 'During a network partition (P), a distributed system must choose either Consistency (CP) or Availability (AP).'
      },
      {
        id: 'q2',
        question: 'What cache eviction strategy removes the item that has not been accessed for the longest time?',
        options: ['First In First Out (FIFO)', 'Least Recently Used (LRU)', 'Random Eviction', 'Least Frequently Used (LFU)'],
        correctIndex: 1,
        explanation: 'LRU tracks usage history and discards the least recently accessed item when cache capacity is reached.'
      },
      {
        id: 'q3',
        question: 'What technique distributes database table rows across multiple database servers to overcome storage/throughput limits?',
        options: ['Database Sharding (Horizontal Partitioning)', 'Database Indexing', 'Normalisation', 'Soft Deletion'],
        correctIndex: 0,
        explanation: 'Sharding splits a large dataset horizontally across multiple independent database nodes.'
      }
    ]
  }
];

db.defaults({
  users: [],
  events: initialEvents,
  registrations: [],
  roadmaps: initialRoadmaps,
  progress: [],
  quizzes: initialQuizzes,
  quizResults: [],
  teams: [
    {
      id: 'team-001',
      title: 'Looking for ML Engineer & UI Designer for EduNova Winter Hackathon',
      eventId: 'evt-001',
      eventTitle: 'EduNova Winter Hackathon 2026',
      roleNeeded: 'ML Engineer, UI/UX Designer',
      skills: ['PyTorch', 'Figma', 'React', 'FastAPI'],
      description: 'We are building an AI-powered automated code reviewer for hackathon submissions. Need an ML developer for model integration and a designer for clean dashboard UI.',
      contact: 'discord: @alex_dev_99 | email: alex@example.com',
      userId: 'user-sample-01',
      userName: 'Alex Rivers',
      status: 'Open',
      createdAt: '2026-07-20T10:00:00.000Z',
      applicants: []
    },
    {
      id: 'team-002',
      title: 'DSA Speed Circuit Study Group & Practice Teammates',
      eventId: 'evt-002',
      eventTitle: 'DSA Speed Circuit Sprint',
      roleNeeded: 'Competitive Programmers',
      skills: ['C++', 'Python', 'DP Patterns', 'Graph Algorithms'],
      description: 'Forming a weekly practice sprint group to solve Codeforces Div 2 & LeetCode Hard problems together before the Speed Circuit contest.',
      contact: 'telegram: @dsasquad_lead',
      userId: 'user-sample-02',
      userName: 'Priya Sharma',
      status: 'Open',
      createdAt: '2026-07-22T15:30:00.000Z',
      applicants: []
    }
  ],
  flashcardDecks: initialFlashcards,
  cheatsheets: initialCheatsheets,
  focusLogs: []
}).write();

// Ensure existing db.json gets the new expanded events, roadmaps, quizzes, flashcardDecks, and cheatsheets
db.set('events', initialEvents).write();
db.set('roadmaps', initialRoadmaps).write();
db.set('quizzes', initialQuizzes).write();
db.set('flashcardDecks', initialFlashcards).write();
db.set('cheatsheets', initialCheatsheets).write();

module.exports = db;
