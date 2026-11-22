import path from "path";
import fs from "fs";
import type { IProduct } from "../types/product";

const filePath = path.join(process.cwd(), "./src/database/db.json");

// GET
export const productService = () => {
    // console.log(process.cwd());
    // console.log(filePath);

    // const result = fs.readFileSync(filePath);
    // console.log(result); //Buffer

    const result = fs.readFileSync(filePath , "utf-8");
    // console.log(result);

    // return result;

    return JSON.parse(result);
    
};

//PUSH
export const createProduct = (payLoad: IProduct[]) => {
    fs.writeFileSync(filePath , JSON.stringify(payLoad));
}