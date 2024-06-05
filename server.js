const express = require("express")
const bookRoutes = require("./src/book/routes")

const app = express()
const port = 3000

app.use(express.json())

app.use("/", bookRoutes)

app.listen(port, () => console.log(`Server is running on port ${port}`))