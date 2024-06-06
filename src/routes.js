const { Router } = require('express');
const controller = require('./controller');

const router = Router();

// get
router.get('/books', controller.getBooks);
router.get('/books/:id', controller.getBookById);
router.get('/books/category/:categoryName', controller.getBookByCategory);
router.get('/books/search/:keyword', controller.searchBook);
router.get('/wishlist/:customerName', controller.getWishlistByCustomer);

// post
router.post('/books', controller.addBookWithExistingPublisher);
router.post('/books/new-publisher', controller.addBookWithNewPublisher);
router.post('/wishlist', controller.addBookToWishlist);
router.post("/book-query", controller.buildQuery);
router.post('/multiple-books', controller.addMultipleNewBooks);
router.post('/multiple-wishlist', controller.addMultipleBooksToWishlist);

// put
router.put('/books/:id', controller.updateBook);
router.put('/multiple-books', controller.updateMultipleBooks);

//delete
router.delete('/books/:id', controller.deleteBook);
router.delete('/wishlist/:customerName/:bookName', controller.removeBookFromWishlist);

module.exports = router;