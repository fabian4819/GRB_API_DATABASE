//query for get all books
const getBooks = 'SELECT * FROM public."Book"'

//query for get book by id
const getBookById = 'SELECT * FROM public."Book" WHERE "Book Number" = $1'

//query for get book by category
const getBookByCategory = 'SELECT b.* FROM public."Book" b JOIN public."Book Category" bc ON b."Book Name" = bc."Book Name" WHERE bc."Category Name" = $1'

//query for add publisher
const addPublisher = 'INSERT INTO public."Publisher" ("Publisher Name", "City", "Country", "Telephone", "Year Founded") VALUES ($1, $2, $3, $4, $5)'

//query for add book
const addBook = 'INSERT INTO public."Book" ("Book Name", "Publication Year", "Pages", "Price", "Publisher Name") VALUES ($1, $2, $3, $4, $5)'

//query for update book
const updateBook = 'UPDATE public."Book" SET "Book Name" = $1, "Publication Year" = $2, "Pages" = $3, "Price" = $4, "Publisher Name" = $5 WHERE "Book Number" = $6'

//query for remove book
const deleteBook = 'DELETE FROM public."Book" WHERE "Book Number" = $1'

//query for search book by keyword
const searchBook = 'SELECT * FROM public."Book" WHERE "Book Name" LIKE $1 OR "Publisher Name" LIKE $1'

//query for get wishlist book by customer
const getWishlistByCustomer = 'SELECT b.* FROM public."Book" b JOIN public."Wishlist" bc ON b."Book Name" = bc."Book Name" WHERE bc."Customer Name" = $1'

//query for customer to add book to wishlist
const addBookToWishlist = 'INSERT INTO public."Wishlist" ("Customer Name", "Book Name") VALUES ($1, $2)'

//query for customer to remove book from wishlist
const removeBookFromWishlist = 'DELETE FROM public."Wishlist" WHERE "Customer Name" = $1 AND "Book Name" = $2'

module.exports = {
    getBooks,
    getBookById,
    getBookByCategory,
    addPublisher,
    addBook,
    updateBook,
    deleteBook,
    searchBook,
    getWishlistByCustomer,
    addBookToWishlist,
    removeBookFromWishlist
}