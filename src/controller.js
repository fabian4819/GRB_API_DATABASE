const pool = require('../db')
const queries = require('./queries')

// get all books
const getBooks = (req, res) => {
    pool.query(queries.getBooks, (error, results) => {
        if (error)
            throw error
        res.status(200).json(results.rows)
    })
}

// get book by id
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

// get books by category
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

// add book with existing publisher
const addBookWithExistingPublisher = (req, res) => {
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

// add book with new publisher
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

// update book
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

// delete book
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

// search book by keyword
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

// add book to wishlist
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

// get wishlist by customer
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

// remove book from wishlist
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

// Dynamic SQL Query Builder --> Constructs and executes SQL queries based on user input
const buildQuery = (req, res) => {
    const { filters, sort, limit, offset } = req.body;
    const { column, direction } = sort || {};

    let query = 'SELECT * FROM public."Book"';
    let queryParams = [];
    let queryConditions = [];

    // Build WHERE clause for filters
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === "object") {
                Object.entries(value).forEach(([condition, filterValue]) => {
                    const paramIndex = queryParams.length + 1;
                    switch (condition) {
                        case "gte":
                            queryConditions.push(`"${key}" >= $${paramIndex}`);
                            queryParams.push(filterValue);
                            break;
                        case "lte":
                            queryConditions.push(`"${key}" <= $${paramIndex}`);
                            queryParams.push(filterValue);
                            break;
                    }
                });
            } else {
                const paramIndex = queryParams.length + 1;
                queryConditions.push(`"${key}" = $${paramIndex}`);
                queryParams.push(value);
            }
        });
    }

    // Combine conditions with WHERE clause
    if (queryConditions.length > 0) {
        query += ` WHERE ${queryConditions.join(" AND ")}`;
    }

    // Add ORDER BY clause
    if (column && direction) {
        query += ` ORDER BY "${column}" ${direction}`;
    }

    // Add LIMIT and OFFSET clauses
    if (limit) {
        queryParams.push(limit);
        query += ` LIMIT $${queryParams.length}`;
    }
    if (offset) {
        queryParams.push(offset);
        query += ` OFFSET $${queryParams.length}`;
    }

    // Execute the Built Query
    pool.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Error executing query:', error.message);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.status(200).json(results.rows);
    });
};


// TCL - transaction control language
// add multiple new books with existing publishers with transaction
const addMultipleNewBooks = async (req, res) => {
    const { books } = req.body;

    // check if book data exists
    if (!books || books.length === 0) {
        res.status(400).json({ error: "No books provided" });
        return;
    }

    // check each book to make sure there are no NULL grades
    for (let book of books) {
        if (!book.bookName || !book.publicationYear || !book.pages || !book.price || !book.publisherName) {
            res.status(400).json({ error: "All fields are required for each book" });
            return;
        }
    }

    // all validations are successful, proceed with the addition of books
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (let book of books) {
            const { bookName, publicationYear, pages, price, publisherName } = book;
            await client.query(queries.addBook, [bookName, publicationYear, pages, price, publisherName]);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Books added successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding books:', error);
        res.status(500).json({ error: 'Failed to add books' });
    } finally {
        client.release();
    }
};

// add multiple books to wishlist with transaction
const addMultipleBooksToWishlist = async (req, res) => {
    const { books } = req.body;

    // Create a client from the pool
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Begin transaction

        // Insert each book to wishlist
        for (let book of books) {
            const { customerName, bookName } = book;
            await client.query(queries.addBookToWishlist, [customerName, bookName]);
        }

        await client.query('COMMIT'); // Commit transaction

        res.status(201).json({ message: 'Books added to wishlist successfully' });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error adding books to wishlist:', error);
        res.status(500).json({ error: 'Failed to add books to wishlist' });
    } finally {
        client.release(); // Release the client back to the pool
    }
}

// update multiple books with transaction
const updateMultipleBooks = async (req, res) => {
    const { bookIds, books } = req.body;

    // Create a client from the pool
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Begin transaction

        // Update each book
        for (let i = 0; i < books.length; i++) {
            const { bookName, publicationYear, pages, price, publisherName } = books[i];
            const bookId = bookIds[i];

            await client.query(queries.updateBook, [bookName, publicationYear, pages, price, publisherName, bookId]);
        }

        await client.query('COMMIT'); // Commit transaction

        res.status(200).json({ message: 'Books updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error updating books:', error);
        res.status(500).json({ error: 'Failed to update books' });
    } finally {
        client.release(); // Release the client back to the pool
    }
};


module.exports = {
    getBooks,
    getBookById,
    getBookByCategory,
    addBookWithExistingPublisher,
    addBookWithNewPublisher,
    updateBook,
    deleteBook,
    searchBook,
    getWishlistByCustomer,
    addBookToWishlist,
    removeBookFromWishlist,
    buildQuery,
    addMultipleNewBooks,
    addMultipleBooksToWishlist,
    updateMultipleBooks
}   