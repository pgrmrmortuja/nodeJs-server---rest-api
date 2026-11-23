import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    const urlParams = url?.split("/"); // ["" , "products", "1"]
    const id = urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

    //Get All Products
    if (url === "/products" && method === "GET") {

        const products = productService();

        if (!products) {
            res.writeHead(404, {
                "content-type": "application/json"
            })

            res.end(JSON.stringify({
                "message": "Product not found."
            }))
        }

        res.writeHead(200, {
            "content-type": "application/json"
        });

        res.end(JSON.stringify({
            "message": "This is Product Route.",
            data: products
        }))
    }
    //Get Single Product
    else if (method === "GET" && id !== null) {
        const products = productService();
        const product = products.find((p: IProduct) => p.id === id);
        // console.log("Single product: ", product)

        if (!product) {
            res.writeHead(404, {
                "content-type": "application/json"
            })

            res.end(JSON.stringify({
                "message": "Product not found."
            }))
        }

        res.writeHead(200, {
            "content-type": "application/json"
        });

        res.end(JSON.stringify({
            "message": "This is single Product Route",
            data: product
        }))
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

        res.writeHead(201, {
            "content-type": "application/json"
        });

        res.end(JSON.stringify({
            "message": "Product created successfully.",
            data: newProduct
        }))
    }
    // PUT
    else if (method === "PUT" && id !== null) {
        const body = await bodyParser(req);
        const products = productService();

        const index = products.findIndex((p: IProduct) => p.id === id);
        // console.log(index);

        if (index < 0) {
            res.writeHead(404, {
                "content-type": "application/json"
            })
            res.end(JSON.stringify({
                "message": "Product not found."
            }))
        }

        products[index] = {
            id: products[index].id,
            ...body
        }

        createProduct(products);

        res.writeHead(200, {
            "content-type": "application/json"
        });

        res.end(JSON.stringify({
            "message": "Product updated successfully.",
            data: products[index]
        }))
    }
    //DELETE
    else if (method === "DELETE" && id !== null) {
        const products = productService();

        const index = products.findIndex((p: IProduct) => p.id === id);

        if (index < 0) {
            res.writeHead(404, {
                "content-type": "application/json"
            })

            res.end(JSON.stringify({
                "message": "Product not found."
            }))
        }

        products.splice(index, 1);

        createProduct(products);

        res.writeHead(200, {
            "content-type": "application/json"
        })

        res.end(JSON.stringify({
            "message": "Product deleted successfully."
        }))
    }
};

export default productController;