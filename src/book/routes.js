const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/books', controller.getBooks);
router.get('/books/:id', controller.getBookById);

module.exports = router;