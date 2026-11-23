import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    const urlParams = url?.split("/"); // ["" , "products", "1"]
    const id = urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

    //Get All Products
    if (url === "/products" && method === "GET") {

        const products = productService();

        // if (!products) {
        //     res.writeHead(500, {
        //         "content-type": "application/json"
        //     })

        //     res.end(JSON.stringify({
        //         "message": "Products not found."
        //     }))
        // }

        if (!products) {
            return sendResponse(res, false, 404, "Products not found");
        }

        // res.writeHead(200, {
        //     "content-type": "application/json"
        // });

        // res.end(JSON.stringify({
        //     "message": "Product catch successfully.",
        //     data: products
        // }))

        try {
            sendResponse(res, true, 200, "Product catch successfully.", products);
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error.");
        }
    }
    //Get Single Product
    else if (method === "GET" && id !== null) {
        const products = productService();
        const product = products.find((p: IProduct) => p.id === id);
        // console.log("Single product: ", product)

        if (!product) {
            return sendResponse(res, false, 404, "Product not found.")
        }

        try {
            sendResponse(res, true, 200, "Product found successfully.", product);
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error.");
        }
    }
    // Post
    else if (url === "/products" && method === "POST") {
        const body = await bodyParser(req);
        const newProduct = {
            id: Date.now(),
            ...body
        }
        // console.log("new product: ", newProduct);

        const products = productService();
        products.push(newProduct);

        createProduct(products);

        try {
            sendResponse(res, true, 201, "Product created successfully.", newProduct);
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error.");
        }
    }
    // PUT
    else if (method === "PUT" && id !== null) {
        const body = await bodyParser(req);
        const products = productService();

        const index = products.findIndex((p: IProduct) => p.id === id);
        // console.log(index);

        if (index < 0) {
            return sendResponse(res, false, 404, "Product not found.");
        }

        products[index] = {
            id: products[index].id,
            ...body
        }

        createProduct(products);

        try {
            sendResponse(res, true, 200, "Product updated successfully.", products[index]);
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error.");
        }
    }
    //DELETE
    else if (method === "DELETE" && id !== null) {
        const products = productService();

        const index = products.findIndex((p: IProduct) => p.id === id);

        if (index < 0) {
            return sendResponse(res, false, 404, "Product not found.");
        }

        products.splice(index, 1);

        createProduct(products);

        try {
            sendResponse(res, true, 200, "Product deleted successfully.");
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error.");
        }
    }
};

export default productController;