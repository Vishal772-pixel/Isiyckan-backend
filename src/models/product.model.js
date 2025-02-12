import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  quantity:{
    type:Number,
    default:1
  },
  images: [{
    url: String,
    altText: String
  }],
  EAN: {
    type: String, // European Article Number
    required: false
  },
  packaging: {
    type: String, // Details about the packaging (Imballo)
    required: false
  },
  piecesPerCarton: {
    type: Number, // Pezzi x collo
    required: false
  },
  dimensions: {
    base: Number, // Base dimension
    width: Number, // Largezza
    height: Number // Altezza
  },
  weight: {
    gross: Number, // Lordo
    net: Number // Netto
  },
  volume: {
    type: Number, // Volume
    required: false
  },
  customsCode: {
    type: String, // Codice doganale
    required: false
  },
  warranty: {
    type: String, // Garanzia
    required: false
  },
  customerPriceList: {
    type: Number, // Listino cliente
    required: false
  },
  material: {
    type: String // Material specifications (from existing schema)
  },
  color: {
    type: String // Color of the product
  },
  imageLink: {
    type: String, // Link immagine
    required: false
  }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);

