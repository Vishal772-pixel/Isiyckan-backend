require('dotenv').config();  // Load environment variables from .env file
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const async = require('async');  // Handle concurrency

// Configure Cloudinary with the environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,  // Product category (optional)
  EAN: String,  // European Article Number
  packaging: String,  // Imballo (Packaging)
  piecesPerCarton: Number,  // Pezzi x collo
  dimensions: {
    base: Number,  // Base dimension (cm)
    width: Number,  // Largezza (width, cm)
    height: Number,  // Altezza (height, cm)
  },
  weight: {
    gross: Number,  // Lordo (gross weight, kg)
    net: Number,  // Netto (net weight, kg)
  },
  volume: Number,  // Volume (optional)
  customsCode: String,  // Codice doganale (customs code)
  customerPriceList: Number,  // Listino cliente (customer price list)
  warranty: String,  // Garanzia (warranty)
  imageLink: String,  // Cloudinary image URL
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

// Function to upload image to Cloudinary and return the URL
async function uploadImageToCloudinary(imageUrl) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    });
    return result.secure_url;  // Return the Cloudinary image URL
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Sample product data (using the data you provided)
const products = [
  {
    name: "Poltrona SI-SI' Telaio Zincato Verniciato Antracite",
    description: "Poltrona Si-Si' con telaio zincato, verniciato antracite",
    price: 171.00,
    category: "Armchair", // Adjust category as needed
    EAN: "8005733250236",
    packaging: "Cartone",
    piecesPerCarton: 2,
    dimensions: { base: 62.0, width: 60.0, height: 43.5 },
    weight: { gross: 9.550, net: 8.400 },
    volume: 162,
    customsCode: "94017900",
    customerPriceList: 171.00,
    warranty: "24",
    imageLink: "https://ordini.scab.it/images/articles/2502_ZA.jpg",  // Image URL
  },
  {
    name: "Poltrona SI-SI' Telaio Zincato Verniciato Terracotta",
    description: "Poltrona Si-Si' con telaio zincato, verniciato terracotta",
    price: 171.00,
    category: "Armchair",
    EAN: "8005733250243",
    packaging: "Cartone",
    piecesPerCarton: 2,
    dimensions: { base: 62.0, width: 60.0, height: 43.5 },
    weight: { gross: 9.550, net: 8.400 },
    volume: 162,
    customsCode: "94017900",
    customerPriceList: 171.00,
    warranty: "24",
    imageLink: "https://ordini.scab.it/images/articles/2502_ZE.jpg",  // Image URL
  },
  {
    name: "Poltrona SI-SI' Telaio Zincato Verniciato Lino",
    description: "Poltrona Si-Si' con telaio zincato, verniciato lino",
    price: 171.00,
    category: "Armchair",
    EAN: "8005733250212",
    packaging: "Cartone",
    piecesPerCarton: 2,
    dimensions: { base: 62.0, width: 60.0, height: 43.5 },
    weight: { gross: 9.550, net: 8.400 },
    volume: 162,
    customsCode: "94017900",
    customerPriceList: 171.00,
    warranty: "24",
    imageLink: "https://ordini.scab.it/images/articles/2502_ZL.jpg",  // Image URL
  },
  {
    name: "Poltrona SI-SI' Telaio Zincato Verniciato Avio",
    description: "Poltrona Si-Si' con telaio zincato, verniciato avio",
    price: 171.00,
    category: "Armchair",
    EAN: "8005733250250",
    packaging: "Cartone",
    piecesPerCarton: 2,
    dimensions: { base: 62.0, width: 60.0, height: 43.5 },
    weight: { gross: 9.550, net: 8.400 },
    volume: 162,
    customsCode: "94017900",
    customerPriceList: 171.00,
    warranty: "24",
    imageLink: "https://ordini.scab.it/images/articles/2502_ZO.jpg",  // Image URL
  },
  {
    name: "Poltrona SI-SI' Telaio Zincato Verniciato Tortora",
    description: "Poltrona Si-Si' con telaio zincato, verniciato tortora",
    price: 171.00,
    category: "Armchair",
    EAN: "8005733250229",
    packaging: "Cartone",
    piecesPerCarton: 2,
    dimensions: { base: 62.0, width: 60.0, height: 43.5 },
    weight: { gross: 9.550, net: 8.400 },
    volume: 162,
    customsCode: "94017900",
    customerPriceList: 171.00,
    warranty: "24",
    imageLink: "https://ordini.scab.it/images/articles/2502_ZT.jpg",  // Image URL
  }
];

// Function to bulk upload and save products to MongoDB
async function bulkUploadAndSave() {
  try {
    // Connect to MongoDB using your MongoDB Atlas URI
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const batchSize = 500; // Process in batches of 500
    const concurrencyLimit = 10; // Limit concurrency to 10 requests at once

    // Split the products into batches of batchSize
    const productBatches = [];
    for (let i = 0; i < products.length; i += batchSize) {
      productBatches.push(products.slice(i, i + batchSize));
    }

    // Upload products in batches
    for (const batch of productBatches) {
      await async.eachLimit(batch, concurrencyLimit, async (product) => {
        const uploadedImageUrl = await uploadImageToCloudinary(product.imageLink);

        if (uploadedImageUrl) {
          const newProduct = new Product({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            EAN: product.EAN,
            packaging: product.packaging,
            piecesPerCarton: product.piecesPerCarton,
            dimensions: product.dimensions,
            weight: product.weight,
            volume: product.volume,
            customsCode: product.customsCode,
            customerPriceList: product.customerPriceList,
            warranty: product.warranty,
            imageLink: uploadedImageUrl,  // Cloudinary URL
          });

          await newProduct.save();
          console.log(`Uploaded and saved: ${product.name}`);
        } else {
          console.log(`Failed to upload image for: ${product.name}`);
        }
      });
    }

    console.log('All products uploaded and saved!');
  } catch (error) {
    console.error('Error during bulk upload:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Start the bulk upload and save process
bulkUploadAndSave();
