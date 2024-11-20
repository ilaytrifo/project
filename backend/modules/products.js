import mongoose from "mongoose"

const Schema = mongoose.Schema({
 name: String,
 price: Number
})

const productModel = mongoose.model("Products", Schema)

export default productModel