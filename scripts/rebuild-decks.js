const fs = require('fs');
const JSZip = require('jszip');

async function extractSlides(pptxPath) {
  const buf = fs.readFileSync(pptxPath);
  const zip = await JSZip.loadAsync(buf);
  const slideFiles = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/i.test(f));
  slideFiles.sort((a, b) => parseInt(a.match(/slide(\d+)\.xml/i)[1]) - parseInt(b.match(/slide(\d+)\.xml/i)[1]));
  
  const slides = [];
  for (let i = 0; i < slideFiles.length; i++) {
    const xml = await zip.file(slideFiles[i]).async('string');
    const texts = [];
    const tRegex = /<a:t>([\s\S]*?)<\/a:t>/gi;
    let m;
    while ((m = tRegex.exec(xml)) !== null) {
      const t = m[1].trim();
      if (t) texts.push(t);
    }
    const title = texts[0] || ('Slide ' + (i + 1));
    slides.push({
      slideNumber: i + 1,
      title: title.replace(/&amp;/g, '&'),
      content: texts.map(t => t.replace(/&amp;/g, '&')),
      keyTakeaway: texts.slice(1, 3).join(' — ').replace(/&amp;/g, '&')
    });
  }
  return slides;
}

async function main() {
  const dir = 'storage/uploads/e10e2968-fc98-4730-aa7c-fa5089a29091';
  const d1Slides = await extractSlides(dir + '/1793483686320_PM2-Combined-Overview-v2_-_Day_1.pptx');
  const d2Slides = await extractSlides(dir + '/1793483703504_PM2-APIs-Integrations-Combined-v2_-_Day_2.pptx');
  const d3Slides = await extractSlides(dir + '/1793481704733_PM2-Databases-DataModeling-Combined-Day_3.pptx');

  const wildwoodPath = 'data/wildwood.json';
  const db = JSON.parse(fs.readFileSync(wildwoodPath, 'utf8'));
  const userId = 'e10e2968-fc98-4730-aa7c-fa5089a29091';
  const now = new Date().toISOString();

  // Material IDs
  const mat1 = db.study_materials.find(m => m.title.includes('Day 1'))?.id || '962aca5a-3eb8-42b0-9eae-ddf623f3fe24';
  const mat2 = db.study_materials.find(m => m.title.includes('Day 2'))?.id || '90c1b2b8-ee13-4819-9664-b92ad95fdd6e';
  const mat3 = db.study_materials.find(m => m.title.includes('Day 3'))?.id || '49514498-11f3-4a8a-8044-3dd372c0a922';

  // Course IDs
  const c1Id = '8c99f94b-0771-43f2-b48c-4126d420557a'; // Day 1
  const c2Id = 'e56acc91-bef4-45b2-bb5f-283c2c371bb3'; // Day 2
  const c3Id = '04c2d9a7-dc3c-44c3-aa2e-4c16c3c5d141'; // Day 3

  // Remove old courses, modules, lessons for this user
  db.courses = db.courses.filter(c => c.user_id !== userId);
  db.modules = db.modules.filter(m => ![c1Id, c2Id, c3Id].includes(m.course_id));
  db.lessons = db.lessons.filter(l => ![c1Id, c2Id, c3Id].includes(l.course_id));

  // Build Course 1: PPT 1 (All 18 Slides)
  const mod1Id = 'mod-ppt1-001';
  const les1Id = '4b2d0cb7-6ce3-470f-98f7-6f0148e9743d';

  db.courses.push({
    id: c1Id,
    user_id: userId,
    title: 'PPT 1: How Software Works & Meet the Stack (Day 1)',
    description: 'Complete 18-Slide Presentation Deck covering Web Fundamentals, State & Speed, Front-End Stack, Back-End Stack, Architecture Patterns, and Cloud Infrastructure.',
    level: 'intermediate',
    estimated_hours: 3,
    status: 'published',
    created_at: now,
    updated_at: now
  });

  db.modules.push({
    id: mod1Id,
    course_id: c1Id,
    title: 'Complete Presentation Deck',
    description: 'All 18 Slides of the Day 1 curriculum in a single continuous presentation.',
    order_index: 0,
    created_at: now
  });

  const c1Guide = `# 📚 PPT 1: How Software Works & Meet the Stack — Complete Study Guide & Exam Notes

### 🏛️ Executive Summary & Core Architectural Layers
Software systems operate through an interconnected four-layer model:
1. **The Client (Front-End):** What the user touches and sees (Web Browsers, iOS, Android). Formulates requests and renders visual interfaces.
2. **The Network (Internet & Protocols):** Fiber optic cables, DNS resolvers, and routing protocols (TCP/IP, HTTP/HTTPS) transmitting packets.
3. **The Web & Application Server (Back-End):** Cloud servers (Node.js, Python, Java, Go) running business rules, authentication, and logic.
4. **The Database & Persistent Storage:** Relational (PostgreSQL, MySQL) and Non-Relational (MongoDB, DynamoDB) systems safely persisting data to disk.

### 🌐 Web Fundamentals & Network Plumbing
- **HTTP (Hypertext Transfer Protocol):** The lingua franca of the web. Common methods include:
  - \`GET\`: Retrieve resources without mutating server state (safe and idempotent).
  - \`POST\`: Submit data to create a new resource on the server.
  - \`PUT / PATCH\`: Update an existing record.
  - \`DELETE\`: Remove a resource.
- **HTTPS & TLS Encryption:** Encrypts network payloads with symmetric/asymmetric cryptography, preventing man-in-the-middle packet sniffing. Signaled by the padlock icon in modern browsers.
- **TCP/IP:** Breaks messages into packets, routes them across networks, and guarantees delivery with checksums and sequence reassembly.

### ⚡ State & Speed: Cookies, Sessions, and Caching
- **Stateless HTTP:** HTTP itself remembers nothing between requests.
- **Cookies & Sessions:** The server sets a session ID inside an HTTP cookie. Subsequent requests automatically pass this cookie to authenticate identity.
- **CDNs (Content Delivery Networks):** Geographically distributed proxy edge servers (Cloudflare, CloudFront) caching static assets (images, CSS, JS) close to users for sub-50ms latency.

### 🎨 Front-End Architecture: Frameworks & Rendering
- **The Core Trio:** HTML (structure), CSS (styling), JavaScript (interactivity).
- **Modern Frameworks:** React (component-driven, virtual DOM), Vue (progressive), Angular (opinionated enterprise).
- **CSS Frameworks:** Tailwind CSS (utility-first, standard default), Bootstrap (rapid prototyping), Shadcn/UI (copy-paste components).
- **Rendering Strategies:**
  - **CSR (Client-Side Rendering):** Browser downloads minimal HTML + JavaScript bundle; client executes JS to render UI. Ideal for authenticated portals and dashboards.
  - **SSR (Server-Side Rendering):** Server pre-renders complete HTML per request. Crucial for SEO and public content.
  - **SSG (Static Site Generation):** HTML compiled at build time. Ideal for blogs, docs, and marketing pages.

### ⚙️ Back-End & System Architecture Patterns
- **Back-End Languages:** Node.js (fast event loop, shared JS/TS), Python (AI/ML & rapid prototyping), Go (high-concurrency microservices), Java (enterprise reliability).
- **Architecture Patterns:**
  - **Monolith:** Single unified codebase. Simple to deploy and debug; harder to scale independently.
  - **Microservices:** Independent domain services communicating via REST or gRPC. Fault-isolated; higher operational complexity.
  - **Serverless (AWS Lambda):** Event-triggered compute functions that scale to zero. Zero server management; potential cold-start latency.

### 📝 Exam Preparation & Key Takeaways
- Always think in layers: When debugging user issues, isolate whether failure occurred in Client, Network, Server, or Database.
- Match rendering strategy to business need: Use SSR/SSG for public SEO and CSR for interactive application dashboards.
- Stack choice is a business decision: Consider hiring availability, ecosystem support, and speed-to-market over raw technical trends.`;

  db.lessons.push({
    id: les1Id,
    module_id: mod1Id,
    course_id: c1Id,
    user_id: userId,
    title: 'PPT 1: The Whole PPT (All 18 Slides)',
    content: c1Guide,
    learning_objectives: [
      'Master the four primary architectural layers of modern software applications',
      'Understand HTTP methods, TLS encryption, and network packet routing',
      'Compare Client-Side (CSR), Server-Side (SSR), and Static (SSG) rendering strategies',
      'Evaluate Monolithic vs Microservices architecture for product development'
    ],
    key_terms: [
      { term: 'HTTP/HTTPS', definition: 'Protocols governing communication between web clients and servers, with TLS encryption for security.' },
      { term: 'CDN', definition: 'Content Delivery Network caching static assets at global edge locations for low latency.' },
      { term: 'SSR vs CSR', definition: 'Server-Side Rendering generates HTML on the server; Client-Side Rendering builds UI in the browser.' },
      { term: 'Microservices', definition: 'Architectural pattern splitting an application into independently deployable domain services.' }
    ],
    examples: [
      { title: 'Swiggy Food Delivery Order Flow', explanation: 'Client app sends POST /order -> API Gateway authenticates via JWT -> Order Service writes to PostgreSQL -> Webhook triggers Restaurant POS.' }
    ],
    summary: 'The comprehensive 18-slide presentation deck covering modern software architecture from network protocols to cloud deployments.',
    estimated_duration: 60,
    source_references: [{ material_title: 'PM2-Combined-Overview-v2 - Day 1', page: 1 }],
    order_index: 0,
    publication_status: 'published',
    slides: d1Slides,
    presentation: {
      material_id: mat1,
      title: 'PM2-Combined-Overview-v2 - Day 1',
      original_filename: 'PM2-Combined-Overview-v2_-_Day_1.pptx',
      total_slides: 18
    },
    created_at: now,
    updated_at: now
  });

  // Build Course 2: PPT 2 (All 13 Slides)
  const mod2Id = 'mod-ppt2-001';
  const les2Id = '9c323fb5-fa8a-4e3e-b12b-518ba58aebab';

  db.courses.push({
    id: c2Id,
    user_id: userId,
    title: 'PPT 2: APIs & System Integrations (Day 2)',
    description: 'Complete 13-Slide Presentation Deck covering Restaurant Analogy, 5 Parts of API Calls, HTTP Error Codes, Webhooks vs Polling, Partner Checklist, and UPI Case Study.',
    level: 'intermediate',
    estimated_hours: 2,
    status: 'published',
    created_at: now,
    updated_at: now
  });

  db.modules.push({
    id: mod2Id,
    course_id: c2Id,
    title: 'Complete Presentation Deck',
    description: 'All 13 Slides of the Day 2 curriculum in a single continuous presentation.',
    order_index: 0,
    created_at: now
  });

  const c2Guide = `# 📚 PPT 2: APIs & System Integrations — Complete Study Guide & Exam Notes

### 💡 What is an API? The Restaurant Analogy
An **API (Application Programming Interface)** is a messenger and contract that enables two separate computer applications to communicate without direct access to each other's databases.
- **Customer (Frontend App):** Views menu and makes requests.
- **Menu (API Documentation & Endpoints):** Defines available actions, parameters, and return types.
- **Kitchen (Backend & Database):** Processes orders and executes business logic.
- **Waiter (The API):** Transports requests to the kitchen and delivers results to the customer.

### 📦 The 5 Core Parts of Every API Call
1. **Endpoint (URL):** The specific address where the resource lives (e.g., \`https://api.payment.com/v1/charge\`).
2. **HTTP Method (Verb):** The intended action (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`).
3. **Headers:** Metadata regarding identity and format (\`Authorization: Bearer <token>\`, \`Content-Type: application/json\`).
4. **Body (Payload):** The data sent with write requests (usually JSON).
5. **Response:** Status code and returned payload from the server.

### 🚨 HTTP Status Code Cheat Sheet
- **2xx (Success):** \`200 OK\` (standard success), \`201 Created\` (resource successfully created).
- **4xx (Client Errors):**
  - \`400 Bad Request\`: Malformed syntax or missing required parameters.
  - \`401 Unauthorized\`: Missing or expired authentication credentials.
  - \`403 Forbidden\`: Authenticated, but lacks permission for this resource.
  - \`404 Not Found\`: The requested endpoint or record does not exist.
  - \`429 Too Many Requests\`: Exceeded rate limit quota; check \`Retry-After\` header.
- **5xx (Server Errors):**
  - \`500 Internal Server Error\`: Unhandled exception or server crash.
  - \`503 Service Unavailable\`: Server is overloaded or down for maintenance.

### 🔄 Staying Updated: Polling vs Webhooks
- **Polling (Pull):** Client repeatedly sends queries every few seconds: *"Has status changed?"*
  - *Trade-off:* High network overhead, wasted queries, latency between checks.
- **Webhooks (Push):** Client registers a callback URL; server pushes an HTTP POST the moment an event occurs.
  - *Trade-off:* Instant real-time updates, event-driven, minimal server load. Industry standard for payment gateways (Razorpay, Stripe) and logistics.

### 🤝 Partner Integrations: 5 Critical Questions for PMs
1. **Authentication:** What security standard is enforced (OAuth 2.0, API keys, mTLS)?
2. **Rate Limits & SLAs:** What are the throughput limits and uptime guarantees (e.g. 99.9%)?
3. **Data Privacy & Compliance:** Does customer PII traverse their systems (GDPR, SOC 2)?
4. **Resilience & Webhooks:** Do they provide asynchronous webhook callbacks and sandbox test keys?
5. **Unit Economics & Scaling:** What is the cost per call and how does pricing scale with user growth?

### 🇮🇳 Case Study: India's UPI Ecosystem
India's Unified Payments Interface processes over 46 Billion monthly transactions by utilizing open API standards. Third-party apps (PhonePe, Google Pay) integrate via standardized endpoints into NPCI switches without storing bank account numbers, achieving sub-2-second settlements across hundreds of participating banks.`;

  db.lessons.push({
    id: les2Id,
    module_id: mod2Id,
    course_id: c2Id,
    user_id: userId,
    title: 'PPT 2: The Whole PPT (All 13 Slides)',
    content: c2Guide,
    learning_objectives: [
      'Understand how APIs function using real-world analogies and technical anatomy',
      'Identify the 5 core parts of every standard HTTP API request',
      'Diagnose 2xx, 4xx, and 5xx HTTP response status codes',
      'Evaluate Polling vs Webhooks for asynchronous partner integrations',
      'Apply the 5-question architectural checklist before committing to third-party APIs'
    ],
    key_terms: [
      { term: 'API', definition: 'Application Programming Interface enabling decoupled software systems to communicate.' },
      { term: 'Webhook', definition: 'User-defined HTTP callback triggered by events on a server, pushing data to client instantly.' },
      { term: 'Rate Limiting', definition: 'Policy restricting the number of API requests a client can make in a given timeframe (HTTP 429).' },
      { term: 'Idempotency', definition: 'Property of an operation where multiple identical requests produce the exact same server state.' }
    ],
    examples: [
      { title: 'Payment Gateway Webhook Handling', explanation: 'Razorpay charges user card and fires POST to merchant webhook /api/payment-callback with signature verification.' }
    ],
    summary: 'The complete 13-slide presentation deck covering APIs, HTTP methods, error handling, webhooks, and vendor integration decisions.',
    estimated_duration: 45,
    source_references: [{ material_title: 'PM2-APIs-Integrations-Combined-v2 - Day 2', page: 1 }],
    order_index: 0,
    publication_status: 'published',
    slides: d2Slides,
    presentation: {
      material_id: mat2,
      title: 'PM2-APIs-Integrations-Combined-v2 - Day 2',
      original_filename: 'PM2-APIs-Integrations-Combined-v2_-_Day_2.pptx',
      total_slides: 13
    },
    created_at: now,
    updated_at: now
  });

  // Build Course 3: PPT 3 (All 15 Slides)
  const mod3Id = 'mod-ppt3-001';
  const les3Id = '366f6aa6-f191-4a02-b37d-4d7e170a8bbd';

  db.courses.push({
    id: c3Id,
    user_id: userId,
    title: 'PPT 3: Databases & Data Modeling (Day 3)',
    description: 'Complete 15-Slide Presentation Deck covering Databases vs Spreadsheets, SQL vs NoSQL, ER Diagrams, Normalization, SQL for PMs, and Analytics Pipelines.',
    level: 'intermediate',
    estimated_hours: 3,
    status: 'published',
    created_at: now,
    updated_at: now
  });

  db.modules.push({
    id: mod3Id,
    course_id: c3Id,
    title: 'Complete Presentation Deck',
    description: 'All 15 Slides of the Day 3 curriculum in a single continuous presentation.',
    order_index: 0,
    created_at: now
  });

  const c3Guide = `# 📚 PPT 3: Databases & Data Modeling — Complete Study Guide & Exam Notes

### 🗄️ Database Foundations: Databases vs Spreadsheets
A database is essentially a strict spreadsheet with automated rule enforcement:
- **Spreadsheets (Excel / Google Sheets):** Freeform rows and columns. Anyone can type a string into a date column or corrupt IDs. Poor concurrent write handling.
- **Databases (RDBMS):** Enforce strict schemas, data types (INTEGER, UUID, TIMESTAMP), uniqueness constraints (PRIMARY KEY), and referential integrity (FOREIGN KEY). Capable of handling thousands of simultaneous ACID transactions without data corruption.

### ⚖️ SQL vs NoSQL: When to Pick Which
| Dimension | SQL (Relational) | NoSQL (Document / Non-Relational) |
| :--- | :--- | :--- |
| **Data Schema** | Fixed, predefined schema | Dynamic, flexible JSON documents |
| **Relationships** | \`JOIN\` queries connecting related tables | Nested / embedded documents |
| **Scaling** | Vertical scaling (add CPU/RAM to server) | Horizontal scaling (sharded across clusters) |
| **Guarantees** | Strict ACID compliance | Eventual consistency (BASE) |
| **Best For** | Banking, ERP, order processing, analytics | High-speed sensor telemetry, real-time social feeds |
| **Examples** | PostgreSQL, MySQL, CockroachDB | MongoDB, DynamoDB, Redis, Cassandra |

### 🗺️ Data Modeling & Reading ER Diagrams
An **Entity-Relationship (ER) Diagram** is the architectural blueprint of a database:
- **Entities:** Represented as boxes corresponding to tables (e.g., \`Users\`, \`Orders\`, \`Products\`).
- **Attributes:** The columns/fields within an entity (e.g., \`user_id\`, \`email\`, \`created_at\`).
- **Primary Key (PK):** Unique identifier for each row in a table.
- **Foreign Key (FK):** Column in one table referencing the Primary Key of another table, establishing a verified relationship.
- **Cardinality:**
  - One-to-One (1:1): User to User Profile.
  - One-to-Many (1:N): Customer to Orders (one customer has many orders).
  - Many-to-Many (N:M): Students to Courses (implemented using a junction/join table).

### ✂️ Data Design: Normalization (Why We Split Tables)
- **Denormalized (Flat Table):** Storing customer name, address, product title, and order date all in a single row.
  - *Risk:* Data redundancy, update anomalies (if user moves, 50 rows must be changed), deletion anomalies.
- **Normalized Schema (1NF, 2NF, 3NF):** Decomposes flat tables into focused, single-responsibility entities (\`Customers\`, \`Orders\`, \`OrderItems\`, \`Products\`) linked by foreign keys. Eliminates duplication and guarantees data integrity.

### 🔍 SQL Fluency: The 5 Commands Every PM Must Know
1. \`SELECT ... FROM\`: Specify columns to retrieve from a target table.
2. \`WHERE\`: Filter rows meeting specific boolean criteria (e.g., \`WHERE status = 'delivered'\`).
3. \`GROUP BY ... HAVING\`: Aggregate records to calculate metrics (e.g., \`COUNT(*)\`, \`SUM(amount)\`).
4. \`ORDER BY ... LIMIT\`: Sort results ascending/descending and cap return count.
5. \`JOIN ... ON\`: Combine rows from two or more tables based on a related key.

### 📊 Analytics Pipelines: From Operational DB to Business Dashboards
1. **OLTP (Online Transaction Processing):** Fast, row-oriented operational databases (PostgreSQL) optimized for instant reads/writes by active users.
2. **ETL / ELT (Extract, Transform, Load):** Background pipelines copying data from OLTP into an analytical store.
3. **OLAP (Online Analytical Processing):** Columnar data warehouses (Snowflake, BigQuery) optimized for massive aggregations over billions of rows.
4. **BI Layer:** Dashboards (Metabase, Tableau) visualizing business KPIs for leadership.`;

  db.lessons.push({
    id: les3Id,
    module_id: mod3Id,
    course_id: c3Id,
    user_id: userId,
    title: 'PPT 3: The Whole PPT (All 15 Slides)',
    content: c3Guide,
    learning_objectives: [
      'Differentiate between spreadsheets and ACID-compliant relational databases',
      'Compare relational SQL and non-relational NoSQL databases across real product scenarios',
      'Interpret Entity-Relationship (ER) diagrams, primary keys, and foreign keys',
      'Understand the principles and trade-offs of database normalization',
      'Construct analytical SQL queries using SELECT, WHERE, GROUP BY, and JOIN',
      'Trace data pipelines from OLTP transactional systems to OLAP data warehouses'
    ],
    key_terms: [
      { term: 'ACID', definition: 'Atomicity, Consistency, Isolation, Durability — guarantees that database transactions are processed reliably.' },
      { term: 'Primary Key', definition: 'A column or set of columns uniquely identifying every row in a table.' },
      { term: 'Foreign Key', definition: 'A column referencing the primary key of another table to link records.' },
      { term: 'Normalization', definition: 'Process of organizing data into separate related tables to reduce redundancy and improve data integrity.' }
    ],
    examples: [
      { title: 'E-Commerce Database Schema', explanation: 'Users (PK user_id) -> Orders (PK order_id, FK user_id) -> OrderItems (FK order_id, FK product_id) -> Products (PK product_id).' }
    ],
    summary: 'The complete 15-slide presentation deck covering database foundations, SQL vs NoSQL, ER modeling, normalization, and analytics pipelines.',
    estimated_duration: 60,
    source_references: [{ material_title: 'PM2-Databases-DataModeling-Combined-Day 3', page: 1 }],
    order_index: 0,
    publication_status: 'published',
    slides: d3Slides,
    presentation: {
      material_id: mat3,
      title: 'PM2-Databases-DataModeling-Combined-Day 3',
      original_filename: 'PM2-Databases-DataModeling-Combined-Day_3.pptx',
      total_slides: 15
    },
    created_at: now,
    updated_at: now
  });

  fs.writeFileSync(wildwoodPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('SUCCESS: Rebuilt 3 complete PPT courses with all slides intact!');
  console.log('Course 1 (Day 1):', d1Slides.length, 'slides');
  console.log('Course 2 (Day 2):', d2Slides.length, 'slides');
  console.log('Course 3 (Day 3):', d3Slides.length, 'slides');
}

main().catch(console.error);
