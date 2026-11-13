const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/wildwood.json', 'utf8'));
const userId = 'e10e2968-fc98-4730-aa7c-fa5089a29091';
const now = new Date().toISOString();

const mat1 = '962aca5a-3eb8-42b0-9eae-ddf623f3fe24'; // Day 1
const mat2 = '90c1b2b8-ee13-4819-9664-b92ad95fdd6e'; // Day 2
const mat3 = '49514498-11f3-4a8a-8044-3dd372c0a922'; // Day 3

const c1 = '8c99f94b-0771-43f2-b48c-4126d420557a';
const c2 = 'e56acc91-bef4-45b2-bb5f-283c2c371bb3';
const c3 = '04c2d9a7-dc3c-44c3-aa2e-4c16c3c5d141';

const ppt1Cards = `## 🎴 Flashcards: How Software Works & Meet the Stack (Day 1)
> *10 Mastery Flashcards covering Client, Network, Server, and Database.*

### Card 1: The 4 Core Architectural Layers
**Category:** System Architecture
**Front:** What are the four primary physical layers every modern web or mobile app operates across?
**Back:** 1. **Client (Device):** Web browser or native mobile app formulating HTTP requests.
2. **Network (Internet):** DNS resolvers, fiber cables, and TCP/IP routing packets.
3. **Web & App Server:** Backend compute runtime (Node.js, Python, Go) executing business logic.
4. **Database & Storage:** ACID-compliant persistent database storing records to disk.

### Card 2: HTTP Methods & Idempotency
**Category:** Protocols
**Front:** What is the technical difference between GET, POST, PUT, and DELETE, and which are idempotent?
**Back:** - **GET:** Retrieves data without altering state. Safe & Idempotent.
- **POST:** Submits new data to create a resource. Not idempotent.
- **PUT / PATCH:** Replaces or modifies an existing entity. Idempotent.
- **DELETE:** Removes a resource from the server. Idempotent.

### Card 3: HTTPS & TLS Encryption
**Category:** Security
**Front:** How does HTTPS protect sensitive user data compared to plain HTTP?
**Back:** HTTPS wraps HTTP in Transport Layer Security (TLS) cryptographic encryption. It encrypts request headers, paths, cookies, and payloads, preventing eavesdropping and packet tampering by intermediate routers.

### Card 4: Cookies vs Sessions vs JWT
**Category:** State Management
**Front:** How do web applications maintain authentication state when HTTP is inherently stateless?
**Back:** - **Cookies:** Small strings stored by the browser and automatically sent on every request.
- **Sessions:** Server stores session data in memory/Redis and gives client a unique session ID.
- **JWT (JSON Web Token):** Cryptographically signed token held by client containing user claims; server verifies signature without database lookup.

### Card 5: CSR vs SSR vs SSG
**Category:** Front-End Architecture
**Front:** When should a product team choose Client-Side Rendering (CSR), Server-Side Rendering (SSR), or Static Generation (SSG)?
**Back:** - **CSR:** Browser downloads blank HTML + JS bundle; client builds UI. Ideal for internal dashboards.
- **SSR:** Server pre-renders complete HTML per request. Crucial for public SEO and real-time feeds.
- **SSG:** Pages compiled into HTML files at build time. Ideal for docs, blogs, and marketing landing pages.

### Card 6: Monolith vs Microservices
**Category:** Backend Architecture
**Front:** What are the trade-offs between a Monolithic codebase and a Microservices architecture?
**Back:** - **Monolith:** Single codebase, simple local testing and atomic transactions; hard to scale individual modules independently.
- **Microservices:** Decoupled domain services communicating via REST/gRPC; independent deployments and fault isolation, but higher operational and networking complexity.

### Card 7: CDNs & Edge Caching
**Category:** Performance
**Front:** What is a Content Delivery Network (CDN) and how does it reduce latency for global users?
**Back:** A CDN (Cloudflare, CloudFront) caches static assets (images, CSS, JS bundles) at geographically distributed point-of-presence (PoP) edge servers, serving responses in <30ms without hitting the origin backend.

### Card 8: Relational (SQL) vs Document (NoSQL)
**Category:** Data Storage
**Front:** Under what conditions should a Product Manager recommend PostgreSQL (SQL) vs MongoDB (NoSQL)?
**Back:** - **SQL (PostgreSQL):** Fixed schema, ACID transactions, complex JOIN queries. Best for financial ledgers, orders, and structured relational domains.
- **NoSQL (MongoDB):** Flexible schema, JSON documents, horizontal clustering. Best for unstructured catalogs, real-time telemetry, and rapidly evolving data schemas.

### Card 9: Push Notifications Anatomy
**Category:** Mobile Platforms
**Front:** How do push notifications travel from a company's backend to an end user's locked iPhone?
**Back:** Company server -> Apple Push Notification Service (APNs) gateway -> Persistent OS socket on device -> iOS displays alert banner. The app itself does not need to be open.

### Card 10: Stack Choice as a Business Decision
**Category:** Product Management
**Front:** Why is technology stack selection a critical business and product decision rather than purely technical?
**Back:** Stack choices dictate engineering hiring speed, ecosystem libraries, cloud infrastructure bills, maintainability, and ability to pivot quickly without rewriting the foundation.`;

const ppt3Cards = `## 🎴 Flashcards: Databases & Data Modeling (Day 3)
> *10 Mastery Flashcards covering Normalization, SQL, ER Diagrams, and Pipelines.*

### Card 1: Databases vs Spreadsheets
**Category:** Core Foundations
**Front:** Why can an enterprise application not simply rely on Excel or Google Sheets as its primary data store?
**Back:** Databases enforce strict data typing, primary key uniqueness, foreign key integrity constraints, and concurrent ACID transactions, preventing corruption when thousands of users write simultaneously.

### Card 2: What is ACID Compliance?
**Category:** Relational Databases
**Front:** What do the four letters in ACID stand for, and why is ACID vital for financial transactions?
**Back:** - **A (Atomicity):** All steps in a transaction succeed or all roll back (no partial transfers).
- **C (Consistency):** Data must conform to all declared schema rules and constraints.
- **I (Isolation):** Concurrent transactions execute without interfering with one another.
- **D (Durability):** Once committed, writes survive server crashes and power loss.

### Card 3: Primary Keys vs Foreign Keys
**Category:** Data Modeling
**Front:** What is the technical difference and purpose of a Primary Key (PK) versus a Foreign Key (FK)?
**Back:** - **Primary Key (PK):** A unique identifier column (e.g. user_id) ensuring every row in a table is distinct.
- **Foreign Key (FK):** A column in a table that points to the Primary Key of another table, enforcing referential relationships (e.g. orders.user_id -> users.id).

### Card 4: Normalization (Why We Split Tables)
**Category:** Schema Design
**Front:** What is database normalization, and what problems occur in a flat (denormalized) table?
**Back:** Normalization (1NF, 2NF, 3NF) separates flat data into distinct logical entities linked by keys. It eliminates data redundancy, update anomalies (editing user address in 100 orders), and deletion anomalies.

### Card 5: The 5 Essential SQL Commands for PMs
**Category:** SQL Fluency
**Front:** What are the five foundational SQL clauses every Product Manager should understand?
**Back:** 1. SELECT ... FROM: Pick columns and target table.
2. WHERE: Filter rows by boolean condition.
3. GROUP BY ... HAVING: Aggregate rows (COUNT, SUM, AVG) by dimension.
4. ORDER BY ... LIMIT: Sort results and cap output count.
5. JOIN ... ON: Combine rows from multiple tables using foreign keys.

### Card 6: Reading ER Diagram Cardinalities
**Category:** Data Modeling
**Front:** What do 1:1, 1:N, and N:M relationships mean in an Entity-Relationship (ER) diagram?
**Back:** - **One-to-One (1:1):** One user has exactly one profile.
- **One-to-Many (1:N):** One customer has many orders.
- **Many-to-Many (N:M):** Students enroll in many courses; courses have many students. Requires a junction join table.

### Card 7: OLTP vs OLAP
**Category:** Data Pipelines
**Front:** What is the core difference between an OLTP database and an OLAP data warehouse?
**Back:** - **OLTP (Online Transaction Processing):** Row-oriented operational database (PostgreSQL) optimized for sub-millisecond single-row reads and writes.
- **OLAP (Online Analytical Processing):** Columnar data warehouse (BigQuery, Snowflake) optimized for aggregations across billions of historical rows.

### Card 8: Database Indexing Trade-offs
**Category:** Performance
**Front:** How does an index speed up queries, and what is the cost of adding too many indexes?
**Back:** Indexes act like a book index (B-tree) allowing O(log N) lookups instead of scanning every row (full table scan). The cost: Every write, insert, and update takes longer because all indexes must be rebuilt on disk.

### Card 9: Event vs Property in Analytics
**Category:** Product Analytics
**Front:** What is the difference between an Event and a Property in analytics instrumentation (Mixpanel, Amplitude)?
**Back:** - **Event:** The action a user performed (e.g. Order Placed, Button Clicked).
- **Property:** Contextual metadata attached to the event (e.g. item_count: 3, order_value: 450, payment_mode: 'UPI').

### Card 10: Real-World Case: DynamoDB on Prime Day
**Category:** Case Study
**Front:** Why did Amazon migrate from Oracle relational databases to DynamoDB NoSQL for shopping cart checkouts?
**Back:** Relational databases hit scaling bottlenecks during Prime Day traffic spikes (100M+ concurrent writes). DynamoDB partitions data across thousands of server nodes horizontally, maintaining single-digit millisecond latency at unlimited scale.`;

const existingCards2 = db.notes.find(n => n.id === '250e47b0-f12e-47d8-9e33-367cb35982f1')?.content || '';

db.notes = [
  {
    id: 'note-ppt1-cards',
    user_id: userId,
    study_material_id: mat1,
    course_id: c1,
    title: 'PPT 1 Flashcards: How Software Works & Stack',
    content: ppt1Cards,
    user_edited_content: ppt1Cards,
    note_type: 'ai_generated',
    note_format: 'flashcards',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'note-ppt2-cards',
    user_id: userId,
    study_material_id: mat2,
    course_id: c2,
    title: 'PPT 2 Flashcards: APIs & System Integrations',
    content: existingCards2,
    user_edited_content: existingCards2,
    note_type: 'ai_generated',
    note_format: 'flashcards',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'note-ppt3-cards',
    user_id: userId,
    study_material_id: mat3,
    course_id: c3,
    title: 'PPT 3 Flashcards: Databases & Data Modeling',
    content: ppt3Cards,
    user_edited_content: ppt3Cards,
    note_type: 'ai_generated',
    note_format: 'flashcards',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'note-ppt1-guide',
    user_id: userId,
    study_material_id: mat1,
    course_id: c1,
    title: 'PPT 1 Exam Guide: How Software Works & Stack',
    content: db.lessons.find(l => l.course_id === c1)?.content || '',
    user_edited_content: db.lessons.find(l => l.course_id === c1)?.content || '',
    note_type: 'ai_generated',
    note_format: 'detailed',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'note-ppt2-guide',
    user_id: userId,
    study_material_id: mat2,
    course_id: c2,
    title: 'PPT 2 Exam Guide: APIs & System Integrations',
    content: db.lessons.find(l => l.course_id === c2)?.content || '',
    user_edited_content: db.lessons.find(l => l.course_id === c2)?.content || '',
    note_type: 'ai_generated',
    note_format: 'detailed',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'note-ppt3-guide',
    user_id: userId,
    study_material_id: mat3,
    course_id: c3,
    title: 'PPT 3 Exam Guide: Databases & Data Modeling',
    content: db.lessons.find(l => l.course_id === c3)?.content || '',
    user_edited_content: db.lessons.find(l => l.course_id === c3)?.content || '',
    note_type: 'ai_generated',
    note_format: 'detailed',
    created_at: now,
    updated_at: now,
  }
];

fs.writeFileSync('data/wildwood.json', JSON.stringify(db, null, 2), 'utf8');
console.log('SUCCESS: Generated complete flashcard decks & exam guides for all 3 PPTs!');
