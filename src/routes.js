const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/books', controller.getBooks);
router.get('/books/:id', controller.getBookById);
router.get('/books/category/:categoryName', controller.getBookByCategory);
router.post('/books', controller.addBookWithExistingPublisher);
router.post('/books/new-publisher', controller.addBookWithNewPublisher);
router.put('/books/:id', controller.updateBook);
router.delete('/books/:id', controller.deleteBook);
router.get('/books/search/:keyword', controller.searchBook);
router.get('/wishlist/:customerName', controller.getWishlistByCustomer);
router.post('/wishlist', controller.addBookToWishlist);
router.delete('/wishlist/:customerName/:bookName', controller.removeBookFromWishlist);
router.post("/book-query", controller.buildQuery);

module.exports = router;