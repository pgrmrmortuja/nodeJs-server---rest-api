# Node.js + TypeScript REST API — Complete Questions & Answers

## ১. Raw Node.js ও HTTP সার্ভার নিয়ে প্রশ্ন

### ক) `http.createServer` কীভাবে কাজ করে এবং `req` (`IncomingMessage`) ও `res` (`ServerResponse`) বলতে কী বোঝায়?

- **কী ও কীভাবে কাজ করে:** Node.js-এর বিল্ট-ইন `http` মডিউলের `createServer((req, res) => { ... })` ফাংশনটি একটি HTTP সার্ভার অবজেক্ট তৈরি করে। যখনই Browser বা Postman থেকে কোনো HTTP রিকোয়েস্ট আসে, তখন ভেতরের কাস্টম হ্যান্ডলার ফাংশনটি স্বয়ংক্রিয়ভাবে চালু হয়।
- **`req` (`IncomingMessage`):** ক্লায়েন্ট (Browser বা Postman) থেকে সার্ভারে আসা রিকোয়েস্টের অবজেক্ট। এতে URL (`req.url`), HTTP মেথড (`req.method`), হেডার (`req.headers`), এবং রিকোয়েস্ট বডির স্ট্রিম থাকে।
- **`res` (`ServerResponse`):** সার্ভার থেকে ক্লায়েন্টে রেসপন্স ফেরত পাঠানোর অবজেক্ট। এর মাধ্যমে স্ট্যাটাস কোড, হেডার (`res.writeHead`) এবং রেসপন্স ডেটা (`res.end`) পাঠানো হয়।
- **উদাহরণ:** অফিসের একটি প্রজেক্টে Postman থেকে `GET http://localhost:5000/products` পাঠালে `req` দিয়ে পাওয়া যায় `/products` ও `GET`, আর `res` দিয়ে প্রোডাক্টের লিস্ট ফেরত পাঠানো হয়।
- **ছোট কোড:**

  ```typescript
  import { createServer, IncomingMessage, ServerResponse } from "http";

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ method: req.method, url: req.url }));
  });
  ```

### খ) `res.writeHead(...)` ও `res.end(...)-এর কাজ কী, এবং `res.end()`-এ সরাসরি JavaScript object দিলে কেন এরর আসে?

- **`res.writeHead(statusCode, headers)`:** রেসপন্সের HTTP স্ট্যাটাস কোড (যেমন `200`, `201`, `404`) এবং হেডার (যেমন `"content-type": "application/json"`) সেট করে, যাতে Browser বা Postman বুঝতে পারে রেসপন্সটি সফল কি না এবং কোন ফরম্যাটে আছে।
- **`res.end(data)`:** রেসপন্সের মূল ডেটা পাঠায় এবং সার্ভারকে জানায় যে এই রিকোয়েস্টের রেসপন্স পাঠানো শেষ।
- **সরাসরি JavaScript object দিলে কেন এরর আসে?** Node.js-এর `res.end()` আশা করে `string` বা `Buffer`। সরাসরি `{ message: "OK" }` দিলে `TypeError [ERR_INVALID_ARG_TYPE]` আসে, কারণ স্ট্রিম/নেটওয়ার্কে পাঠানোর জন্য ডেটাকে টেক্সট (JSON string) বা বাইটে রূপান্তর করতে হয়।
- **ছোট কোড:**

  ```typescript
  // সঠিক: অবজেক্টকে JSON string বানিয়ে পাঠানো
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ message: "Success" }));
  ```

### গ) `ERR_STREAM_WRITE_AFTER_END` কখন হয় এবং কেন `return` না দিলে এমন হতে পারে?

- **কখন হয়:** একটি রিকোয়েস্টের রেসপন্সে একবার `res.end()` কল হয়ে যাওয়ার পর ওই একই `res` অবজেক্টে আবার `res.write()` বা `res.end()` চালাতে গেলে `ERR_STREAM_WRITE_AFTER_END` এরর হয় (কারণ স্ট্রিম আগেই শেষ/বন্ধ হয়ে গেছে)।
- **কেন `return` না দিলে এমন হতে পারে:** ধরো কোনো প্রোডাক্ট না পেলে `if (!product)` ব্লকে তুমি রেসপন্স পাঠালে, কিন্তু `return` লেখোনি। তখন ফাংশন থামবে না—কোড নিচের লাইনে গিয়ে আরেকটি রেসপন্স (`res.end(...)`) পাঠাতে চাইবে, আর তখনই এই এরর দিয়ে সার্ভার ক্র্যাশ করবে।
- **উদাহরণ:** Postman থেকে `/products/999` পাঠালে `404` রেসপন্স যাওয়ার পর `return` না থাকলে নিচের `200` রেসপন্স লাইনে গিয়ে এরর দেবে।
- **ছোট কোড:**

  ```typescript
  if (!product) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Not found" }));
    return; // এখানে return না দিলে নিচের res.end() গিয়ে এরর আসবে
  }
  ```

### ঘ) `tsx watch` দিয়ে সার্ভার চালালে কী সুবিধা পাওয়া যায় এবং `package.json`-এর স্ক্রিপ্ট কীভাবে কাজ করে?

- **`tsx watch`-এর সুবিধা:** VS Code-এ `.ts` ফাইল সেভ করলেই `tsx` স্বয়ংক্রিয়ভাবে TypeScript চালিয়ে সার্ভার রিস্টার্ট করে—প্রতিবার Terminal-এ ম্যানুয়ালি কমান্ড দিয়ে সার্ভার বন্ধ ও চালু করতে হয় না।
- **`package.json`-এর স্ক্রিপ্ট কীভাবে কাজ করে:** `"scripts"`-এর ভেতরে তুমি শর্টকাট কমান্ডের নাম (যেমন `"dev"`) লিখে তার পাশে আসল কমান্ড রাখো। Terminal-এ `npm run dev` লিখলে npm ওই নাম খুঁজে পাশে থাকা কমান্ডটি চালায়। (ভুল করে `npm run deb` লিখলে স্ক্রিপ্ট না পেয়ে এরর দেয়।)
- **ছোট কোড:**

  ```json
  {
    "scripts": {
      "dev": "tsx watch ./src/server.ts"
    }
  }
  ```

---

## ২. Stream, `chunk`, `Buffer` ও JSON নিয়ে প্রশ্ন

### ক) HTTP রিকোয়েস্ট বডি পড়ার জন্য `req.on("data", ...)` আর `req.on("end", ...)` কেন ব্যবহার করা হয়? Express ছাড়া Raw Node.js-এ বডি কীভাবে আসে?

- **Raw Node.js-এ বডি কীভাবে আসে:** Express.js-এর মতো middleware আগে থেকে `req.body` বানিয়ে দেয় না। Raw Node.js-এ `req` একটি **Readable Stream**, তাই নেটওয়ার্ক দিয়ে ডেটা ছোট ছোট অংশে ধারাবাহিকভাবে আসে।
- **কেন `req.on("data")` ও `req.on("end")` লাগে:**
  - `"data"` ইভেন্টে প্রতিবার নতুন এক টুকরো ডেটা (`chunk`) এলে সেটি `body` স্ট্রিংয়ে জমা করা হয়।
  - `"end"` ইভেন্ট ফায়ার হলে বোঝা যায় সব ডেটা আসা শেষ—তখন পুরো `body`-কে পার্স করা নিরাপদ।
- **উদাহরণ:** Postman থেকে `POST` বডিতে `{ "name": "Keyboard", "price": 1200 }` পাঠালে `"data"` দিয়ে টুকরোগুলো জমে এবং `"end"`-এ গিয়ে সম্পূর্ণ JSON পাওয়া যায়।
- **ছোট কোড:**

  ```typescript
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const parsed = JSON.parse(body);
    console.log(parsed);
  });
  ```

### খ) `Readable Stream`, `chunk`, আর `Buffer`-এর মধ্যে পার্থক্য কী?

- **`Readable Stream`:** যেখান থেকে ডেটা ধাপে ধাপে পড়া যায়, সেই প্রবাহ বা ব্যবস্থা (যেমন `req`)।
- **`chunk`:** স্ট্রিম দিয়ে আসা ডেটার একেকটি খণ্ড বা টুকরো।
- **`Buffer`:** মেমোরিতে থাকা বাইনারি/বাইট ডেটার একটি অবজেক্ট, যা Node.js কাঁচা ডেটা বা ফাইল/নেটওয়ার্ক বাইট সামলাতে ব্যবহার করে। (`fs.readFileSync(path)`-এ `"utf-8"` না দিলে `Buffer` পাওয়া যায়।)
- **ছোট কোড:**

  ```typescript
  // req হলো Readable Stream
  req.on("data", (chunk: Buffer | string) => {
    // chunk হলো স্ট্রিমের এক-একটা অংশ; প্রয়োজনে Buffer হতে পারে
    console.log(chunk.toString());
  });
  ```

### গ) `JSON.parse()` এবং `JSON.stringify()` কখন কোনটা ব্যবহার করা হয় এবং না করলে কী সমস্যা হতে পারে?

- **`JSON.parse(str)`:** বাইরে থেকে আসা বা ফাইল থেকে পড়া **JSON string**-কে কোডের ভেতরে **JavaScript object/array** বানাতে ব্যবহার হয়। না করলে `body.name` বা `...body` (spread) প্রত্যাশিত object প্রপার্টি হিসেবে কাজ করবে না।
- **`JSON.stringify(val)`:** কোডের ভেতরের **JavaScript object/array**-কে **JSON string** বানাতে ব্যবহার হয়—যাতে `res.end(...)` বা `fs.writeFileSync(...)`-এ পাঠানো যায়। না করলে `res.end()`-এ object দিলে এরর আসবে, অথবা `db.json`-এ পড়ার মতো JSON লেখা যাবে না।
- **ছোট কোড:**

  ```typescript
  const incomingText = '{"id":1,"name":"Laptop"}';
  const productObj = JSON.parse(incomingText); // string -> JS object
  const outgoingText = JSON.stringify(productObj); // JS object -> JSON string
  ```

### ঘ) `Promise` ও `async / await` কীভাবে কাজ করে, এবং `try / catch` দিয়ে `await` কল না ধরলে কী হতে পারে?

- **`Promise`:** ভবিষ্যতে শেষ হবে এমন কোনো কাজের ফলাফল সামলানোর অবজেক্ট—কাজ সফল হলে `resolve(...)` হয়, ব্যর্থ হলে `reject(...)` হয়।
- **`async / await`:** `async` ফাংশনের ভেতরে `await` লিখলে সেই `Promise` শেষ হওয়া পর্যন্ত কোড অপেক্ষা করে এবং ফলাফল ফিরিয়ে দেয়—এতে asynchronous কোড পড়তে সহজ লাগে।
- **`try / catch` দিয়ে না ধরলে কী হতে পারে:** `await` করা `Promise` যদি `reject` হয় (যেমন Postman থেকে ভাঙা JSON পাঠানোয় `bodyParser` reject করল), আর সেটি `try / catch`-এর ভেতরে না থাকে, তবে **Unhandled Promise Rejection** হয়ে Node.js প্রসেস ক্র্যাশ করতে পারে এবং ক্লায়েন্টকে পরিষ্কার `500` রেসপন্স পাঠানো যাবে না।
- **ছোট কোড:**

  ```typescript
  const handlePost = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const data = await bodyParser(req);
      res.writeHead(201, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: true, data }));
    } catch (error) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Invalid JSON body" }));
    }
  };
  ```

---

## ৩. REST API, Routing ও CRUD অপারেশন নিয়ে প্রশ্ন

### ক) REST API কী, এবং `GET`, `POST`, `PUT`, `PATCH`, `DELETE` মেথডগুলোর কাজ ও পার্থক্য কী?

- **REST API কী:** **Representational State Transfer Application Programming Interface**। সহজ কথায়, এটি ক্লায়েন্ট (যেমন Browser, React app, বা Postman) এবং সার্ভারের (যেমন তোমার Raw Node.js সার্ভার) মধ্যে ডেটা আদান-প্রদান করার একটি নিয়ম বা কাঠামো—যেখানে URL (ঠিকানা), HTTP মেথড (কাজের ধরন), আর সাধারণত JSON ফরম্যাট ব্যবহার করা হয়।
- **কেন লাগে:** একটি অফিস সফটওয়্যার প্রজেক্টে ওয়েব Browser আর মোবাইল অ্যাপ—দুটোতেই একই প্রোডাক্ট ডেটা লাগলে একটি পরিষ্কার REST API থাকলে সবাই একই নিয়মে সার্ভারের সাথে কথা বলতে পারে।
- **HTTP মেথডগুলোর কাজ ও পার্থক্য:**
  - **`GET`:** সার্ভার থেকে ডেটা **পড়া বা আনা** (যেমন `/products` দিয়ে সব প্রোডাক্ট বা `/products/1` দিয়ে একটি প্রোডাক্ট দেখা)। এটি ডেটা বদলায় না।
  - **`POST`:** সার্ভারে **নতুন ডেটা তৈরি করা** (যেমন `/products`-এ JSON বডি পাঠিয়ে নতুন প্রোডাক্ট যোগ করা)।
  - **`PUT`:** বিদ্যমান কোনো ডেটাকে **আপডেট করা** (সাধারণত পুরো রিসোর্স/অবজেক্টের তথ্য বদলানো বা প্রতিস্থাপন করার ধারণায় ব্যবহৃত হয়)।
  - **`PATCH`:** বিদ্যমান কোনো ডেটার **আংশিক আপডেট করা** (যেমন পুরো প্রোডাক্ট না বদলে শুধু `price` বা `name` বদলানো)।
  - **`DELETE`:** সার্ভার থেকে বিদ্যমান কোনো ডেটা **মুছে ফেলা** (যেমন `/products/2` পাঠিয়ে `id: 2` প্রোডাক্ট ডিলিট করা)।
- **ছোট কোড:**

  ```typescript
  if (url === "/products" && method === "GET") {
    // সব প্রোডাক্ট আনা
  } else if (url === "/products" && method === "POST") {
    // নতুন প্রোডাক্ট তৈরি করা
  } else if (method === "PUT" && id !== null) {
    // নির্দিষ্ট প্রোডাক্ট আপডেট করা
  } else if (method === "DELETE" && id !== null) {
    // নির্দিষ্ট প্রোডাক্ট ডিলিট করা
  }
  ```

### খ) `200`, `201`, `400`, `404`, `500`—এই HTTP স্ট্যাটাস কোডগুলো কখন ব্যবহার করা হয়?

- **কেন লাগে:** রেসপন্সের বডির পাশাপাশি একটি নির্দিষ্ট সংখ্যার কোড দিয়ে দ্রুত বোঝানো যায় রিকোয়েস্টের কী হলো—যাতে Browser, Postman, বা ফ্রন্টএন্ড কোড সহজে সিদ্ধান্ত নিতে পারে।
- **কখন কোনটা ব্যবহার করা হয়:**
  - **`200` (`OK`):** সাধারণ রিকোয়েস্ট সফল হলে—যেমন `GET` দিয়ে ডেটা পাওয়া, `PUT`/`PATCH` দিয়ে সফলভাবে আপডেট করা, বা `DELETE` সফল হওয়া।
  - **`201` (`Created`):** সার্ভারে নতুন কোনো রিসোর্স/ডেটা সফলভাবে তৈরি হলে—যেমন `POST /products` করে নতুন প্রোডাক্ট সেভ করার পর।
  - **`400` (`Bad Request`):** ক্লায়েন্টের পাঠানো রিকোয়েস্ট বা ইনপুটে ভুল থাকলে—যেমন Postman থেকে ভাঙা/অবৈধ JSON বডি পাঠানো বা অসংখ্যা `id` (`/products/abc`) দেওয়া।
  - **`404` (`Not Found`):** যে URL বা রিসোর্স খোঁজা হচ্ছে, সেটি না পেলে—যেমন ভুল রুটে গেলে বা `/products/999` দিলে যেখানে `id: 999` প্রোডাক্টটি নেই।
  - **`500` (`Internal Server Error`):** সার্ভারের ভেতরে অপ্রত্যাশিত কোনো সমস্যা বা এরর হলে—যেমন ফাইল পড়া/লেখা বা পার্সিংয়ে অনাকাঙ্ক্ষিত গোলযোগ হলে।
- **ছোট কোড:**

  ```typescript
  // 201: নতুন প্রোডাক্ট তৈরি
  res.writeHead(201, { "content-type": "application/json" });
  res.end(JSON.stringify({ success: true, message: "Created" }));

  // 404: প্রোডাক্ট বা রুট না পাওয়া গেলে
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ success: false, message: "Not found" }));
  ```

### গ) URL থেকে dynamic `id` বের করলে `Number(...)` কেন লাগে, আর ভুল `id` (যেমন `/products/abc` বা `/products/999`) এলে কী কী চেক করা উচিত?

- **`Number(...)` কেন লাগে:** URL থেকে `.split("/")` করলে `"/products/2"` থেকে `"2"` পাওয়া যায়, যেটা একটি **`string`**। কিন্তু আমাদের প্রোডাক্ট ডেটায় `id` হলো **`number`** (যেমন `2`)। `===` (strict equality) দিয়ে তুলনা করলে `"2" === 2` হয় `false`; তাই `Number("2")` দিয়ে সংখ্যায় (`2`) রূপান্তর করা লাগে।
- **না করলে কী হতো:** `p.id === id` কখনোই `true` হতো না, ফলে `GET /products/2`, `PUT /products/2`, বা `DELETE /products/2` কোনো প্রোডাক্টই খুঁজে পেত না।
- **ভুল `id` এলে কী কী চেক করা উচিত:**
  1. **`/products/abc`-এর মতো অসংখ্যা/ভুল `id` এলে:** `Number("abc")` হয় `NaN`। তাই `Number.isNaN(id)` (বা `id <= 0`) চেক করে সাথে সাথে `400` (`Invalid product ID`) বা `404` পাঠানো উচিত। (`NaN !== null` যেহেতু `true` হয়, তাই শুধু `id !== null` চেক করলে `NaN` আটকায় না।)
  2. **`/products/999`-এর মতো সংখ্যা কিন্তু অস্তিত্বহীন `id` এলে:** প্রোডাক্ট অ্যারেতে খুঁজে না পেলে (`!product` বা `index < 0`) `404` (`Product not found`) পাঠিয়ে `return` করা উচিত।
- **ছোট কোড:**

  ```typescript
  const rawId = urlParams?.[2]; // যেমন "abc" বা "999" বা "2"
  const id = rawId !== undefined ? Number(rawId) : null;

  if (id === null || Number.isNaN(id)) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Invalid ID" }));
    return;
  }
  ```

### ঘ) `.find()`, `.findIndex()`, `.filter()`, আর `.splice()`-এর মধ্যে কোনটা কখন ব্যবহার করবে, এবং `.splice(index, 1)`-এর আগে `index < 0` চেক কেন জরুরি?

- **কোনটা কখন ব্যবহার করবে:**
  - **`.find(...)`:** শর্ত মেলে এমন **প্রথম আইটেম (object)** নিজে পেতে—যেমন `GET /products/:id`-এ একটি প্রোডাক্ট দেখার জন্য। না পেলে `undefined` দেয়।
  - **`.findIndex(...)`:** শর্ত মেলে এমন **প্রথম আইটেমের ইনডেক্স নম্বর (`0, 1, 2...`)** পেতে—যেমন `PUT` বা `DELETE`-এ অ্যারের কোন জায়গায় আইটেমটি আছে তা জানতে। না পেলে `-1` দেয়।
  - **`.filter(...)`:** শর্ত মেলে এমন **সব আইটেম নিয়ে একটি নতুন Array** তৈরি করতে—যেমন কোনো নির্দিষ্ট আইটেম বাদ দিয়ে বাকিগুলো রেখে নতুন অ্যারে বানাতে (`p.id !== id`)। মূল অ্যারে বদলায় না।
  - **`.splice(index, 1)`:** মূল অ্যারের **ভেতরেই নির্দিষ্ট ইনডেক্স থেকে আইটেম কেটে বাদ দিতে**—যেমন `DELETE`-এ `index` নম্বর পজিশন থেকে `1`টি প্রোডাক্ট সরাতে। এটি মূল অ্যারে পরিবর্তন করে।
- **`.splice(index, 1)`-এর আগে `index < 0` চেক কেন জরুরি:**
  - প্রোডাক্ট না পেলে `findIndex` রিটার্ন করে **`-1`**।
  - `index < 0` চেক না করে সরাসরি `products.splice(-1, 1)` চালালে JavaScript পেছন থেকে গুনতে শুরু করে **অ্যারের শেষ প্রোডাক্টটি ডিলিট করে ফেলবে**!
  - তাই আগে `if (index < 0)` চেক করে `404` রেসপন্স পাঠিয়ে **`return`** করতে হয়।
- **ছোট কোড:**

  ```typescript
  const products = [
    { id: 1, name: "Mouse", price: 500 },
    { id: 2, name: "Keyboard", price: 1200 },
  ];

  // 1. একটি প্রোডাক্ট পাওয়া
  const one = products.find((p) => p.id === 2);

  // 2. ইনডেক্স পাওয়া ও নিরাপদে ডিলিট করা
  const index = products.findIndex((p) => p.id === 999);
  if (index < 0) {
    // -1 হলে splice চলবে না, তাই শেষ আইটেম সুরক্ষিত থাকবে
    console.log("Not found, skipping splice");
  } else {
    products.splice(index, 1);
  }

  // 3. নতুন অ্যারে তৈরি (id !== 1 রেখে)
  const remaining = products.filter((p) => p.id !== 1);
  ```

---

## ৪. File System (`fs`), `path`, `.env` ও Config নিয়ে প্রশ্ন

### ক) `process.cwd()` এবং `path.join()` বা `path.resolve()` কেন ব্যবহার করা হয়? হার্ডকোডেড পাথ লিখলে কী সমস্যা হতে পারে?

- **`process.cwd()`:** যে ফোল্ডার থেকে তুমি Terminal-এ কমান্ড চালিয়েছো (সাধারণত প্রজেক্টের রুট ফোল্ডার), সেটার পাথ রিটার্ন করে।
- **`path.join()` ও `path.resolve()`:** ফোল্ডার ও ফাইলের নামগুলো মিলিয়ে সঠিক ও নিরাপদ ফাইল পাথ তৈরি করে। `path.join(...)` অংশগুলো জোড়া লাগায়, আর `path.resolve(...)` শুরু থেকে পূর্ণ (absolute) পাথ তৈরি করে।
- **কেন ব্যবহার করা হয় / হার্ডকোডেড পাথ লিখলে কী সমস্যা হতে পারে:**
  - ধরো তুমি কোডে হার্ডকোড করে লিখে দিলে `"D:\\projects\\my-api\\src\\database\\db.json"` বা `"./src/database/db.json"`।
  - অন্য ল্যাপটপে বা Linux/Mac সার্ভারে `D:\\...` পাথ কাজ করবে না; আবার অন্য কোনো ফোল্ডার থেকে কমান্ড চালালে আপেক্ষিক পাথ ভুল জায়গায় খুঁজতে পারে। Windows-এ `\` আর Linux/Mac-এ `/` স্ল্যাশের পার্থক্যও `path` মডিউল সহজে সামলে নেয়।
- **ছোট কোড:**

  ```typescript
  import path from "path";

  const dbPath = path.join(process.cwd(), "src", "database", "db.json");
  const envPath = path.resolve(process.cwd(), ".env");
  ```

### খ) `fs.readFileSync` ও `fs.writeFileSync` কীভাবে কাজ করে, `"utf-8"` না দিলে কী আসে, আর `Sync` মেথড বড় প্রোডাকশন সার্ভারে কেন সীমাবদ্ধতা তৈরি করে?

- **`fs.readFileSync(filePath, "utf-8")`:** নির্ধারিত ফাইল থেকে ডেটা পড়ে এবং রিটার্ন করে। `"utf-8"` দিলে বাইটগুলো ডিকোড হয়ে পঠনযোগ্য **text (`string`)** হিসেবে পাওয়া যায়।
- **`fs.writeFileSync(filePath, content)`:** ফাইলে `string` বা `Buffer` আকারে ডেটা লেখে (ফাইল থাকলে ওভাররাইট করে, না থাকলে তৈরি করে)।
- **`"utf-8"` না দিলে কী আসে:** এনকোডিং না বললে `fs.readFileSync` একটি **`Buffer`** অবজেক্ট রিটার্ন করে (যা বাইনারি/বাইটের কাঁচা রূপ), সরাসরি JSON বা সাধারণ টেক্সট স্ট্রিং হিসেবে ব্যবহার করা যায় না।
- **`Sync` মেথড বড় প্রোডাকশন সার্ভারে কেন সীমাবদ্ধতা তৈরি করে:** `Sync` মানে **Synchronous**—ফাইল পড়া বা লেখা শেষ না হওয়া পর্যন্ত Node.js-এর মূল থ্রেড (Event Loop) সেখানে আটকে থাকে। বড় ফাইল বা হাজারো রিকোয়েস্ট আসা প্রোডাকশন সার্ভারে বারবার `Sync` চললে অন্য ইউজারদের রিকোয়েস্টও আটকে গিয়ে সার্ভার স্লো হয়ে যেতে পারে।
- **ছোট কোড:**

  ```typescript
  import fs from "fs";

  const rawText = fs.readFileSync("db.json", "utf-8"); // string আসে
  fs.writeFileSync("db.json", JSON.stringify([{ id: 1, name: "Mouse" }], null, 2));
  ```

### গ) একাধিক ইউজার একসাথে রিকোয়েস্ট করলে `db.json`-এর মতো ফাইলে লিখতে গেলে কী সমস্যা হতে পারে, এবং কেন বাস্তব প্রজেক্টে ডেটাবেস লাগে?

- **একাধিক ইউজার একসাথে লিখলে কী সমস্যা হতে পারে:**
  - ধরো ইউজার A এবং ইউজার B প্রায় একই সময়ে `POST /products` পাঠাল। দুজনেই পুরোনো `db.json` পড়ে নিজের প্রোডাক্ট যোগ করল এবং একে অপরের ওপর `writeFileSync` দিয়ে লিখে দিল—তাহলে একজনের ডেটা হারিয়ে যেতে পারে (**race condition / data overwrite**)।
  - এছাড়া একসাথে লিখতে গেলে ফাইল আধভাঙা বা করাপ্ট হওয়ার ঝুঁকি থাকে, আর সার্ভার রিস্টার্ট বা নতুন ডিপ্লয়মেন্টে লোকাল ফাইল হারিয়ে যেতে পারে।
- **কেন বাস্তব প্রজেক্টে ডেটাবেস লাগে:** একটি অফিস সফটওয়্যার প্রজেক্টে হাজারো ইউজার, সার্চ, ফিল্টার, রিলেশন, ট্রানজ্যাকশন, আর নিরাপদ একযোগে (concurrent) রিড/রাইট সামলানোর জন্য ডেটাবেস (যেমন PostgreSQL, MySQL, বা MongoDB) অনেক বেশি নির্ভরযোগ্য ও দ্রুত।
- **ছোট কোড:**

  ```typescript
  // লোকাল ফাইলে পড়ার পর বদলে আবার পুরো ফাইল লেখা হয় (ছোট প্রজেক্ট/শেখার জন্য ঠিক, বড় স্কেলে DB লাগে)
  const list = JSON.parse(fs.readFileSync("db.json", "utf-8"));
  list.push({ id: Date.now(), name: "Keyboard" });
  fs.writeFileSync("db.json", JSON.stringify(list));
  ```

### ঘ) `.env` ফাইল ও `dotenv` কেন ব্যবহার করা হয়, `process.env.PORT`-কে কেন `Number(...)` দিয়ে রূপান্তর করা হয়, আর `.env` কেন GitHub-এ রাখা উচিত নয়?

- **`.env` ও `dotenv` কেন ব্যবহার করা হয়:** পোর্ট (`5000`), ডেটাবেস URL, বা API key কোডে hardcoded না রেখে পরিবেশ অনুযায়ী আলাদা রাখতে `.env` ব্যবহার করা হয়। `dotenv.config(...)` সেই ফাইল পড়ে Node.js-এর `process.env`-এ ভেরিয়েবলগুলো বসিয়ে দেয়।
- **`process.env.PORT`-কে কেন `Number(...)` দিয়ে রূপান্তর করা হয়:** `process.env`-এর সব মান **string** (যেমন `"5000"`) হিসেবে থাকে। পোর্ট হিসেবে সংখ্যা (`5000`) নিশ্চিত করতে `Number(process.env.PORT)` ব্যবহার করা হয়।
- **`.env` কেন GitHub-এ রাখা উচিত নয়:** `.env` ফাইলে অনেক সময় ডেটাবেস পাসওয়ার্ড বা secret key থাকে। পাবলিক বা শেয়ার্ড GitHub রিপোজিটরিতে `.env` (এবং `.gitignore`-এ না রাখলে) push করলে সংবেদনশীল তথ্য ফাঁস হয়ে নিরাপত্তা ঝুঁকি তৈরি হতে পারে।
- **ছোট কোড:**

  ```typescript
  import dotenv from "dotenv";
  dotenv.config();

  const port: number = Number(process.env.PORT) || 5000;
  ```

---

## ৫. TypeScript ও প্রজেক্ট আর্কিটেকচার নিয়ে প্রশ্ন

### ক) TypeScript-এ `interface` বা `type` কেন ব্যবহার করা হয়, এবং `tsconfig.json`-এর `rootDir`, `outDir`, `module`, `target` কী কাজ করে?

- **`interface` বা `type` কেন ব্যবহার করা হয়:** কোনো অবজেক্ট বা ডেটার কাঠামো (কোন প্রপার্টি থাকবে এবং সেগুলোর টাইপ কী হবে) আগে থেকেই বলে দেওয়ার জন্য। VS Code-এ কোড লেখার সময়ই ভুল টাইপ বা মিসিং প্রপার্টি থাকলে সাথে সাথে লাল দাগ দিয়ে ধরিয়ে দেয়।
- **`tsconfig.json`-এর মূল অপশনগুলোর কাজ:**
  - **`rootDir`:** তোমার মূল TypeScript সোর্স ফাইলগুলো কোন ফোল্ডারে আছে (যেমন `./src`) তা নির্ধারণ করে।
  - **`outDir`:** কম্পাইল হয়ে তৈরি হওয়া JavaScript ফাইলগুলো কোন ফোল্ডারে রাখা হবে (যেমন `./dist`) তা নির্ধারণ করে।
  - **`module`:** কম্পাইল হওয়া কোডে কোন মডিউল সিস্টেম ব্যবহার হবে (যেমন ES Module বা CommonJS) তা ঠিক করে।
  - **`target`:** TypeScript কোডকে কোন JavaScript ভার্সনের উপযোগী করে রূপান্তর করা হবে (যেমন `esnext` বা আধুনিক ES ভার্সন) তা নির্ধারণ করে।
- **ছোট কোড:**

  ```typescript
  export interface IProduct {
    id: number;
    name: string;
    price: number;
  }

  const product: IProduct = {
    id: 1,
    name: "Monitor",
    price: 15000,
  };
  ```

### খ) `Route`, `Controller`, `Service`, ও `Utils`-এ কোড ভাগ করে লেখার সুবিধা কী? সব কোড এক ফাইলে (`server.ts`) রাখলে কী সমস্যা হতো?

- **কোড ভাগ করে লেখার সুবিধা:** প্রতিটি ফাইলের দায়িত্ব পরিষ্কার থাকে (**Separation of Concerns**):
  - `Route`: কোন URL ও মেথড কোথায় যাবে তা ঠিক করে।
  - `Controller`: `req` থেকে ইনপুট/বডি নেয়, কাজ করায়, আর `res` দিয়ে রেসপন্স পাঠায়।
  - `Service`: ফাইল বা ডেটাবেসের সাথে ডেটা পড়া/লেখার মূল কাজ করে।
  - `Utils`: `bodyParser` বা `sendResponse`-এর মতো পুনর্ব্যবহারযোগ্য সহায়ক ফাংশন রাখে।
- **সব কোড এক ফাইলে (`server.ts`) রাখলে কী সমস্যা হতো:** প্রজেক্ট বড় হলে `server.ts` হাজার লাইনের জগাখিচুড়ি হয়ে যেত—কোনো বাগ খুঁজতে বা নতুন ফিচার (যেমন Users বা Orders রাউট) যোগ করতে গেলে পুরো ফাইল ঘাঁটতে হতো এবং এক জায়গার পরিবর্তনে অন্য জায়গা ভেঙে যাওয়ার ঝুঁকি বাড়ত।
- **ছোট কোড:**

  ```typescript
  // server.ts -> শুধু সার্ভার চালু করে routeHandler-এ পাঠায়
  // route.ts -> "/products" দেখলে productController-এ পাঠায়
  // product.controller.ts -> req/res সামলে product.service.ts-এর ফাংশন কল করে
  ```

### গ) `sendResponse`-এর মতো কমন ইউটিলিটি ফাংশন ব্যবহার করলে কোড মেইনটেইন করা কীভাবে সহজ হয়?

- **কীভাবে সহজ হয়:** প্রতিটি রাউটে বারবার `res.writeHead(...)` আর `res.end(JSON.stringify(...))` লিখতে হয় না—সব রেসপন্সের কাঠামো (`success`, `message`, `data`) এক জায়গা থেকেই নিয়ন্ত্রণ করা যায়।
- **সুবিধা:** ভবিষ্যতে রেসপন্সের ফরম্যাট বা হেডার বদলাতে হলে ৫০ জায়গায় না বদলে শুধু `sendResponse.ts` ফাইলেই পরিবর্তন করলেই পুরো API-তে সেটা কার্যকর হয়, আর টাইপের কারণে ভুল স্ট্যাটাস কোড বা হেডার দেওয়ার ঝুঁকিও কমে।
- **ছোট কোড:**

  ```typescript
  import type { ServerResponse } from "http";

  export const sendResponse = (
    res: ServerResponse,
    success: boolean,
    statusCode: number,
    message: string,
    data?: unknown
  ) => {
    res.writeHead(statusCode, { "content-type": "application/json" });
    res.end(JSON.stringify({ success, message, data }));
  };
  ```
