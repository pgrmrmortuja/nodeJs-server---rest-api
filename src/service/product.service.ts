import path from "path";
import fs from "fs";

const filePath = path.join(process.cwd(), "./src/database/db.json");

export const productService = () => {
    // console.log(process.cwd());
    // console.log(filePath);

    // const result = fs.readFileSync(filePath);
    // console.log(result); //Buffer

    const result = fs.readFileSync(filePath , "utf-8");
    console.log(result);

    // return result;

    return JSON.parse(result);
    
};