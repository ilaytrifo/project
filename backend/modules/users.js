import mongoose from "mongoose"

const Schema = mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const userModel = mongoose.model("users", Schema)

export default userModel