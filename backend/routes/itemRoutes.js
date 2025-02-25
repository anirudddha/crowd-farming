const { Router } = require("express");
const Items = require("../models/Items");
const multer = require("multer");

const itemRouter = new Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

itemRouter.get("", async(req, res) =>{
    try{
        const response = await Items.find();
        res.status(200).json({message:"Data retrieved successfully", data: response});

    }catch(e){
        console.log(e);
        res.status(400).json({message:"Failed to retrieve data"});
    }

})

itemRouter.post("/add", upload.single("image"),async (req, res) =>{
    try{
        const {name, category, brand, variants}= req.body;
        if(!req.file){
            return res.status(400).json({message:"IImage is needed"});
        }

        const base64Image = req.file.buffer.toString("base64");


        let parsedVariants = [];
        if (typeof variants === "string") {
            parsedVariants  = JSON.parse(variants);
        } else {
            parsedVariants = variants;
        }

        const newItem = Items({
            name, 
            category,
            brand,
            image:{
                data:base64Image,
                contentType: req.file.mimetype
            },
            variants:parsedVariants
        });

        await newItem.save();
        res.status(201).json({message:"Item added successfully", data: newItem});
    }catch(e){
        console.log(e);
        res.status(400).json({ message: "Failed to add item" });
    }
})


module.exports = {itemRouter};