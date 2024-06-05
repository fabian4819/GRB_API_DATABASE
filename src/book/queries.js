//query for get all books
const getBooks = 'SELECT * FROM public."Book"'

//query for get book by id
const getBookById = 'SELECT * FROM public."Book" WHERE "Book Number" = $1'

//query for get book by category
const getBookByCategory = 'SELECT b.* FROM public."Book" b JOIN public."Book Category" bc ON b."Book Name" = bc."Book Name" WHERE bc."Category Name" = $1'

module.exports = {
    getBooks,
    getBookById,
    getBookByCategory,
}