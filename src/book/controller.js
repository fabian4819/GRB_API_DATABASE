const pool = require('../../db')
const queries = require('./queries')

const getBooks = (req, res) => {
    pool.query(queries.getBooks, (error, results) => {
        if (error) 
            throw error
        res.status(200).json(results.rows)
    })
}

const getBookById = (req, res) => {
    const { id } = req.params;
    pool.query(queries.getBookById, [id], (error, results) => {
        if (error) {
            console.error(error.message)
            res.status(500).send("Server Error")
            return
        }
        if (results.rows.length === 0) {
            res.status(404).send("Book not found")
            return
        }
        res.status(200).json(results.rows[0])
    })
}


module.exports = {
    getBooks,
    getBookById,
}   