import mongoose from "mongoose"

const Schema = mongoose.Schema({
    userId: String,
    product: Array,
    sum: Number
})



const pendingOrders = mongoose.model("pending_Orders", Schema)

export default pendingOrders