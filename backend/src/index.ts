import { app } from "./server.js"


app.listen(process.env.PORT || '8000', () => {
    console.log("server running")
})