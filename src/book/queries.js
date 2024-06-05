//query for get all books
const getBooks = 'SELECT * FROM public."Book"'


//query for get book by id
const getBookById = 'SELECT * FROM public."Book" WHERE "Book Number" = $1'

module.exports = {
    getBooks,
    getBookById,
}