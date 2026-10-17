# ITStep Academy — Coursework & Project Collection

A consolidated monorepo containing coursework, homework assignments, and projects developed during studies at ITStep Academy. Spans system/network programming in C# (.NET 9), modern JavaScript (ES6+, DOM/BOM, APIs), full-stack frontend with React 19, Python projects, and foundational computer science coursework.

---

## 🏛️ Monorepo Structure

```
itstep/
├── csharp-net/          # System & Network Programming (.NET 9)
├── javascript/          # Modern JavaScript, DOM/BOM & Browser APIs
├── react/               # React 19 + TypeScript + Vite Applications
├── html-css/            # Responsive HTML5 & CSS3 Layout Projects
├── course-work/         # Term Coursework Project (Python GUI)
├── archive-homework/    # Foundational Coursework (C++, Python, HTML/CSS)
└── materials/           # Assignment briefs, specifications, and catalogs
```

---

## ⚡ Modules Overview

### 1. C# & .NET 9 System & Network Programming (`csharp-net/`)
High-performance asynchronous networking, low-level sockets, multithreading, and atomic synchronization.

| Directory | Topic & Key Features |
| :--- | :--- |
| `01-LockSynchronization` | Thread-safe bank account and counter operations using `lock` monitor |
| `02-ParallelProcessing` | Data parallelism with `Parallel.For`, `Parallel.ForEach`, `Parallel.Invoke`, and PLINQ |
| `03-MultithreadingDll` | Modular computational library with background task scheduling |
| `04-InterlockedOperations` | Lock-free thread synchronization (`Increment`, `Add`, `CompareExchange`) |
| `05-FileStreamOperations` | High-throughput buffered file I/O with `FileStream`, `StreamWriter`, and `StreamReader` |
| `06-IpProtocolBasics` | Network diagnostics, IP addressing, DNS resolution, and ICMP Ping latency analysis |
| `07-SocketClientServer` | Low-level TCP socket client and server with message framing and ping-pong ACK |
| `08-TcpClientServerApp` | Multi-client connection pooling with `TcpListener` and `TcpClient` |
| `09-InteractiveClientServer` | Structured JSON request-response protocol over TCP |
| `10-ChatClientServer` | Multi-client broadcast chat server with private whisper messaging |
| `11-AsyncNetworkApp` | High-throughput asynchronous TCP server using modern `async`/`await` pipelines |
| `12-NewsAndQuoteServer` | Live quote distribution engine with local disk caching and keyword search |
| `13-NetworkExamProject` | Final Network Programming Exam: File distribution hub with SHA-256 integrity verification |

---

### 2. JavaScript & Browser Engineering (`javascript/`)
Interactive single-page applications built with vanilla modern JavaScript and responsive layouts.

| Directory | Topic & Key Features |
| :--- | :--- |
| `01-algorithms` | Numerical algorithms: prime numbers, Fibonacci, min/max statistics visualizer |
| `02-strings-and-objects` | Object collections: laptop catalog, gym attendance tracking, inventory valuation |
| `03-oop-basics` | ES6 Class architecture: `BankAccount`, `Student`, `Car`, `Book` systems |
| `04-gui-calculators` | Interactive calculators: shipping fee, room dimensions, tiered volume discounts |
| `05-client-scripting` | Dynamic DOM events: hex color generator, mouse coordinates, category tabs |
| `06-dom-bom-explorer` | Browser environment telemetry: navigator attributes, viewport metrics, node manipulation |
| `07-advanced-events` | Drag-and-drop workflow, modal overlay dialogs, input debounce engine |
| `08-landing-shop-6items` | Landing page store: 6-product catalog with interactive cart and order calculation |
| `09-json-processing` | JSON parsing, inventory filtering, order totals, and search engine |
| `10-localstorage-planner` | Course registration with auth validation, homework task manager, weekly schedule |
| `11-api-integration` | Asynchronous REST client with query filtering, loading states, and offline fallback |
| `12-comprehensive-exam` | JavaScript Final Exam: Student gradebook with averages and CRM inquiry pipeline |
| `13-developer-portfolio` | Software engineer portfolio: project filters, skills showcase, contact form validation |
| `14-json-schema-validator` | Deep JSON syntax formatting, schema validation, and config export |
| `15-oop-cinema-booking` | Seat reservation system with private class fields (`#isOccupied`) and receipts |

---

### 3. React 19 Applications (`react/`)
Modern React applications developed with TypeScript, React 19, and Vite.

| Directory | Topic & Key Features | Stack / Demo |
| :--- | :--- | :--- |
| [`GameCatalog`](./react/GameCatalog/) | Full game discovery store with cart mechanics, search, and local persistence | [**Live Demo**](https://frontys.github.io/itstep/) · React 19, Vite |
| `react-10-06-26` | Basket counter, state management, and side effects with `useEffect` | React 19, TS, Vite |
| `react-10-07-26` | Operator telemetry dashboard and order tracking with `AbortController` | React 19, TS, Vite |
| `components-and-props` | Structured component hierarchies, typed props validation, and state lifting | React 19, TS, Vite |
| `usereducer-useref` | Predictable state machine with `useReducer` and mutable tracking via `useRef` | React 19, TS, Vite |
| `react-forms` | Controlled form inputs with multi-field validation, error states, and live review | React 19, TS, Vite |
| `bookstore-app` | Comprehensive bookstore application with genre tabs, author search, and checkout | React 19, TS, Vite |
| `shop-cart` | Product store with quantity management, cart totals, and item increments | React 19, TS, Vite |
| `shop-cart-extended` | Extended store with coupon code validation, tax calculation, and `localStorage` sync | React 19, TS, Vite |

---

### 4. HTML5 & CSS3 Web Layouts (`html-css/`)
Collection of 5 responsive, cross-browser web layout projects.

| Directory | Project & Focus | Stack |
| :--- | :--- | :--- |
| `bookstore` | Multi-page bookstore showcase with book previews and hero grid | HTML5, CSS3 |
| `fitness-club` | Fitness center landing with pricing plans, trainer cards, and schedule | HTML5, CSS3, Flexbox |
| `medical-clinic` | Healthcare clinic portal with doctor appointments and service directory | HTML5, CSS3, Grid |
| `ecommerce-shop` | Multi-category eCommerce storefront with product filters | HTML5, CSS3, Flexbox |
| `crm-requests` | Service request and client application CRM dashboard | HTML5, CSS3, JS |

---

### 5. Coursework & Archives (`course-work/` & `archive-homework/`)
- **`course-work/`**: Final coursework project featuring Python application logic and GUI automation.
- **`archive-homework/`**: Historical coursework archive covering C++ object-oriented fundamentals, Python algorithms, and introductory HTML/CSS layouts.

---

## 🚀 Running Projects Locally

### C# / .NET 9 Projects:
```bash
cd csharp-net/01-LockSynchronization
dotnet build
dotnet run
```

### React Projects:
```bash
cd react/GameCatalog
npm install
npm run dev
```

### JavaScript Projects:
Simply open `index.html` in any modern web browser or serve with any static HTTP server:
```bash
cd javascript/08-landing-shop-6items
python -m http.server 8080
```

---

## 👤 Author

- GitHub: [@frontys](https://github.com/frontys)

## 📄 License

MIT
