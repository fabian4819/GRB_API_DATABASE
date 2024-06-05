const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/books', controller.getBooks);
router.get('/books/:id', controller.getBookById);
router.get('/books/category/:category', controller.getBookByCategory);

module.exports = router;