const pool = require('../db')
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

const getBookByCategory = (req, res) => {
    const { categoryName } = req.params;
    pool.query(queries.getBookByCategory, [categoryName], (error, results) => {
        if (error) {
            console.error(error.message)
            res.status(500).send("Server Error")
            return
        }
        if (results.rows.length === 0) {
            res.status(404).send("Book not found")
            return
        }
        res.status(200).json(results.rows)
    })
}

const addBook = (req, res) => {
    const { bookName, publicationYear, pages, price, publisherName } = req.body;
    pool.query(queries.addBook, [bookName, publicationYear, pages, price, publisherName], (error, results) => {
        if (error) {
            console.error(error.message)
            res.status(500).send("Server Error")
            return
        }
        res.status(201).send("Book added successfully")
    })
}

const addBookWithNewPublisher = async (req, res) => {
    const { bookName, publicationYear, pages, price, publisherName, city, country, telephone, yearFounded } = req.body;

    // Create a client from the pool
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Begin transaction

        // Insert the publisher if it doesn't exist
        await client.query(queries.addPublisher, [publisherName, city, country, telephone, yearFounded]);

        // Insert the book
        await client.query(queries.addBook, [bookName, publicationYear, pages, price, publisherName]);

        await client.query('COMMIT'); // Commit transaction

        res.status(201).json({ message: 'Book and publisher added successfully' });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error adding book and publisher:', error);
        res.status(500).json({ error: 'Failed to add book and publisher' });
    } finally {
        client.release(); // Release the client back to the pool
    }
}

const updateBook = (req, res) => {
    const { id } = req.params;
    const { bookName, publicationYear, pages, price, publisherName } = req.body;
    pool.query(queries.updateBook, [bookName, publicationYear, pages, price, publisherName, id], (error, results) => {
        if (error) {
            console.error('Error updating book:', error.message);
            res.status(500).send("Server Error");
            return;
        }
        if (results.rowCount === 0) {
            res.status(404).send("Book not found");
            return;
        }
        res.status(200).send("Book updated successfully");
    })
}

const deleteBook = (req, res) => {
    const { id } = req.params;
    pool.query(queries.deleteBook, [id], (error, results) => {
        if (error) {
            console.error('Error deleting book:', error.message);
            res.status(500).send("Server Error");
            return;
        }
        if (results.rowCount === 0) {
            res.status(404).send("Book not found");
            return;
        }
        res.status(200).send("Book deleted successfully");
    })
}

const searchBook = (req, res) => {
    const { keyword } = req.params;
    pool.query(queries.searchBook, [`%${keyword}%`], (error, results) => {
        if (error) {
            console.error('Error searching book:', error.message);
            res.status(500).send("Server Error");
            return;
        }
        if (results.rows.length === 0) {
            res.status(404).send("Book not found");
            return;
        }
        res.status(200).json(results.rows);
    })
}

const getWishlistByCustomer = (req, res) => {
    const { customerName } = req.params;
    pool.query(queries.getWishlistByCustomer, [customerName], (error, results) => {
        if (error) {
            console.error('Error getting wishlist:', error.message);
            res.status(500).send("Server Error");
            return;
        }
        if (results.rows.length === 0) {
            res.status(404).send("Wishlist not found");
            return;
        }
        res.status(200).json(results.rows);
    })
}

const addBookToWishlist = (req, res) => {
    const { customerName, bookName } = req.body;
    pool.query(queries.addBookToWishlist, [customerName, bookName], (error, results) => {
        if (error) {
            console.error('Error adding book to wishlist:', error.message);
            res.status(500).send("Server Error");
            return;
        }
        res.status(201).send("Book added to wishlist successfully");
    })
}

const removeBookFromWishlist = (req, res) => {
    const { customerName, bookName } = req.params;
    pool.query(queries.removeBookFromWishlist, [customerName, bookName], (error, results) => {
        if (error) {
            console.error('Error removing book from wishlist:', error.message);
            res.status(500).send("Server Error");
            return;
        }
        res.status(200).send("Book removed from wishlist successfully");
    })
}



module.exports = {
    getBooks,
    getBookById,
    getBookByCategory,
    addBook,
    addBookWithNewPublisher,
    updateBook,
    deleteBook,
    searchBook,
    getWishlistByCustomer,
    addBookToWishlist,
    removeBookFromWishlist
}   