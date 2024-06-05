const express = require("express")
const bookRoutes = require("./src/book/routes")

const app = express()
const port = 3000

app.use(express.json())

app.get("/", (req, res) => { 
    res.send("Hello World!") 
})

app.use("/api/v1/books", bookRoutes)

app.listen(port, () => console.log(`Server is running on port ${port}`))