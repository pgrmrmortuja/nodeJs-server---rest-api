# Node.js Server REST API

A RESTful API built from scratch using **Node.js, TypeScript, and the native HTTP module**. This project demonstrates how to build a structured backend application with routing, controllers, services, request body parsing, environment configuration, and file-based data persistence.

The API supports complete CRUD (Create, Read, Update, Delete) operations for product management.

## 🚀 Features

- **Raw HTTP Server:** Built using Node.js native `http` module without Express.js.
- **TypeScript:** Strong typing and structured development using TypeScript.
- **ES Modules:** Modern JavaScript module system using `import` and `export`.
- **Modular Architecture:** Organized into routes, controllers, services, configurations, utilities, types, and database.
- **Dynamic Routing:** Supports dynamic product IDs through URL parameters.
- **Request Body Parsing:** Handles incoming JSON request bodies using Node.js Readable Streams.
- **Environment Configuration:** Uses `.env` files and `dotenv` for environment variables.
- **Standardized Responses:** Centralized JSON response handling.
- **File-Based Persistence:** Stores product data in a JSON file.
- **CRUD Operations:** Supports GET, POST, PUT, and DELETE requests.
- **Development Watch Mode:** Automatically restarts the server when source files change.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| TypeScript | Static typing and type safety |
| HTTP Module | Creating the native HTTP server |
| ES Modules | Import and export functionality |
| tsx | Running TypeScript files directly |
| dotenv | Managing environment variables |
| File System (fs) | Reading and writing files |
| Path | Handling file and directory paths |
| npm | Package management |

## 📁 Project Structure

```text
NodeJs-Server-Rest-Api/
│
├── dist/                          # Compiled JavaScript output
│
├── node_modules/                  # Installed dependencies
│
├── src/
│   │
│   ├── config/
│   │   └── index.ts               # Environment configuration
│   │
│   ├── controllers/
│   │   └── product.controller.ts  # Product request handling
│   │
│   ├── database/
│   │   └── db.json                # Product data storage
│   │
│   ├── routes/
│   │   └── route.ts               # API routing
│   │
│   ├── service/
│   │   └── product.service.ts    # Product data operations
│   │
│   ├── types/
│   │   └── product.ts             # Product interface
│   │
│   ├── utils/
│   │   ├── parseBody.ts           # Request body parser
│   │   └── sendResponse.ts        # Standardized JSON response
│   │
│   └── server.ts                  # Application entry point
│
├── .env                           # Environment variables
├── .gitignore                     # Git ignored files
├── package-lock.json              # Dependency lock file
├── package.json                   # Project configuration
└── tsconfig.json                  # TypeScript configuration
```

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the Project Directory

```bash
cd NodeJs-Server-Rest-Api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on the configured port.

```text
Server running on port 5000
```

### 6. Access the API

```text
http://localhost:5000
```

## 📡 API Endpoints

The API provides the following endpoints for product management.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check server status |
| GET | `/products` | Retrieve all products |
| GET | `/products/:id` | Retrieve a single product |
| POST | `/products` | Create a new product |
| PUT | `/products/:id` | Update an existing product |
| DELETE | `/products/:id` | Delete a product |

### 1. GET - Retrieve All Products

**Endpoint:**

```http
GET /products
```

Retrieves all products stored in the database file.

### 2. GET - Retrieve a Single Product

**Endpoint:**

```http
GET /products/1
```

Retrieves a specific product using its ID.

### 3. POST - Create a New Product

**Endpoint:**

```http
POST /products
```

**Request Body:**

```json
{
  "name": "Wireless Mouse",
  "price": 500
}
```

Creates a new product with a unique ID generated using `Date.now()`.

**Success Status:** `201 Created`

### 4. PUT - Update an Existing Product

**Endpoint:**

```http
PUT /products/1
```

**Request Body:**

```json
{
  "name": "Gaming Mouse",
  "price": 1200
}
```

Updates an existing product using its ID.

**Success Status:** `200 OK`

### 5. DELETE - Delete a Product

**Endpoint:**

```http
DELETE /products/1
```

Deletes a specific product using its ID.

**Success Status:** `200 OK`

### Error Handling

- `404 Not Found` – Returned when a requested route or product does not exist.
- Invalid product IDs are checked before performing update or delete operations.
- A missing product does not cause an unintended array modification.

## 🏗️ Application Architecture

The project follows a modular Controller-Service architecture to separate responsibilities and keep the application organized.

```text
Client (Browser / Postman)
          |
          v
      server.ts
          |
          v
   routes/route.ts
          |
          v
controllers/product.controller.ts
          |
          v
service/product.service.ts
          |
          v
   database/db.json
```

### Responsibilities of Each Layer

| Layer | Responsibility |
|---|---|
| Server | Creates and starts the HTTP server |
| Routes | Determines which controller handles a request |
| Controllers | Handles HTTP methods, request parameters, and responses |
| Services | Handles product data and file operations |
| Database | Stores product information in JSON format |
| Config | Loads environment variables |
| Types | Defines TypeScript interfaces |
| Utils | Provides reusable helper functions |

## 🧠 Key Concepts Implemented

This project covers several important Node.js and TypeScript backend development concepts.

### 1. Node.js Project Setup & ES Modules

- Initializing a Node.js project using `npm init -y`.
- Understanding `package.json` and `package-lock.json`.
- Configuring `"type": "module"`.
- Using `import` and `export` syntax.

### 2. TypeScript Configuration

- Installing TypeScript and Node.js type definitions.
- Initializing `tsconfig.json` using `npx tsc --init`.
- Configuring `rootDir`, `outDir`, `target`, `module`, `moduleResolution`, `types`, `jsx`, `include`, and `exclude`.
- Understanding TypeScript compilation.
- Generating JavaScript output inside the `dist` directory.

### 3. Development Runner & Watch Mode

- Installing and using `tsx`.
- Running TypeScript files without manually compiling them first.
- Configuring development scripts.
- Using `tsx watch` for automatic server restarts.

### 4. Networking, Streams & Data Handling

- Understanding TCP sockets and network communication.
- Understanding Readable Streams.
- Working with data chunks and Buffers.
- Understanding binary data.
- Differentiating JSON strings and JavaScript objects.
- Using `JSON.parse()` and `JSON.stringify()`.

### 5. Routing & Dynamic Parameters

- Handling HTTP requests using URL and HTTP methods.
- Implementing dynamic routes.
- Extracting product IDs using `split()`.
- Converting string IDs into numbers using `Number()`.
- Handling unknown routes with 404 responses.

### 6. TypeScript Interfaces & Array Methods

- Defining product structures using the `IProduct` interface.
- Understanding object shapes and type safety.
- Using `.find()` to retrieve a specific product.
- Using `.findIndex()` to locate a product's array index.
- Using `.push()` and `.splice()` for array modifications.

### 7. File System & Data Persistence

- Working with Node.js `fs` and `path` modules.
- Understanding `process.cwd()` and `path.join()`.
- Reading files using `fs.readFileSync()`.
- Writing data using `fs.writeFileSync()`.
- Persisting product data inside `db.json`.

### 8. Request Body Parsing

- Understanding Node.js request streams.
- Handling `data` and `end` events.
- Collecting incoming chunks.
- Creating asynchronous operations using `Promise`.
- Parsing JSON request bodies.
- Handling parsing errors using `try...catch`.

### 9. Environment Variables & Response Handling

- Managing environment variables through `.env`.
- Loading variables using `dotenv.config()`.
- Resolving file paths using `path.resolve()`.
- Accessing environment variables through `process.env`.
- Converting environment variable values using `Number()`.
- Creating a reusable `sendResponse()` utility.
- Sending HTTP status codes and JSON responses using `res.writeHead()` and `res.end()`.

### 10. Complete CRUD Operations

- **Create:** Adding new products using POST.
- **Read:** Retrieving all products and individual products using GET.
- **Update:** Modifying existing products using PUT.
- **Delete:** Removing products using DELETE.
- Handling missing products with proper 404 responses.
- Using `return` to prevent unintended execution after error responses.

## 🧪 Testing

You can test the API endpoints using tools such as:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/)

Test the following operations:

1. Check server availability.
2. Retrieve all products.
3. Retrieve a product using its ID.
4. Create a new product.
5. Update an existing product.
6. Delete a product.
7. Test invalid routes and non-existent product IDs.

## 💾 Data Storage

This project uses a local JSON file (`src/database/db.json`) as its data storage system.

Product data is read from and written to this file using Node.js File System methods.

This approach demonstrates basic file-based data persistence without requiring an external database.

## 🎯 Learning Objectives

The primary goal of this project is to develop a practical understanding of backend development using Node.js and TypeScript.

Through this project, I have practiced:

- Building a backend server without Express.js.
- Understanding how Node.js handles HTTP requests and responses.
- Organizing backend code using a modular architecture.
- Working with streams, buffers, and asynchronous operations.
- Implementing dynamic API routes.
- Managing and validating data using TypeScript.
- Building reusable utilities and service functions.
- Implementing complete REST API CRUD functionality.
- Persisting application data using the file system.

---

**Project:** Node.js Server & REST API  
**Runtime:** Node.js  
**Language:** TypeScript  
**Architecture:** Controller-Service  
**Data Storage:** JSON File  
**API Style:** RESTful API