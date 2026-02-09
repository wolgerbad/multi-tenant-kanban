import { error_handler } from "./middleware/error.js";
import { app } from "./server.js"
import dotenv from "dotenv";

app.listen(process.env.PORT || '8000', () => {
    console.log("server running")
})