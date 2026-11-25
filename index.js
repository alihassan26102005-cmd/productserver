import cors from "cors";
import express from "express";
import Product from "./model/Product.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const app=express();

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(cors(
    {
        origin:"*",
        methods:["GET","POST","PUT","DELETE"]
    }
));
app.use(express.json());

async function ConnectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    }
    catch (error){
        console.error("MongoDB connection error:", error);
    }
}
ConnectDB();

app.get("/products", async (req,res) =>{
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching products"});
    }
});

app.post("/products", async (req,res)=> {
    try{
        const newProductFields = req.body;
      const newProduct = new Product(newProductFields);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error });
    }
});


app.delete("/products/:id", async (req, res)=>{
    try{
        const { id } = req.params;
        await Product.findOneAndDelete({ id });
        res.status(200).send({ message: "Delete"});
    } catch(error) {
        res.status(500).json({ message: "Error deleting product"});
    }
});

app.put("/products/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const updatedProductFields = req.body;
        const updatedProduct = await Product.findOneAndUpdate(
            { id },
            updatedProductFields,
            { new: true },
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product"});
    }
});

app.listen(5050,()=>{
    console.log("server is running at port 5050")
});