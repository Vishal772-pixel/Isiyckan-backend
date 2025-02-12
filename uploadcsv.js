// import fs from "fs";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import {Product }from "./src/models/product.model.js"; // Ensure your Product model file uses ESM
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// // Get the directory name (needed for __dirname equivalent in ESM)
// const __dirname = dirname(fileURLToPath(import.meta.url));

// // Read JSON File
// fs.readFile(`${__dirname}/products.json`, "utf8", async (err, data) => {
//   if (err) {
//     console.error("Error reading file:", err);
//     return;
//   }

//   try {
//     const products = JSON.parse(data);

//     // Insert into MongoDB
//     await Product.insertMany(products);
//     console.log("Data successfully inserted!");
//   } catch (error) {
//     console.error("Error inserting data:", error);
//   }
// });
