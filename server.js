const express = require('express');
const connectDB = require('./conn');
const mongoose = require('mongoose')

const app = express();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express')


app.use(express.json());

// Schema definition for the book collection
const bookSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

// Model based on the book schema
const Book = mongoose.model('Book', bookSchema);



// this code is for swagger title
const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Node Js API for mongodb an swagger',
            version: '2.0.0'
        },
        servers: [
            {
                url: 'http://localhost:8000/'
            }
        ]
    },
    apis: ['./server.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

/**
 * @swagger
 * /:
 *  get: 
 *      summary: This api is used to check if get method is working or not.
 *      decription: This api is just for checking the working
 *      responses:
 *          200: 
 *              description: Testing Get method
 */
app.get('/', (req, res) => {
    res.send('Welcome my friends welcome');
})



/**
 * @swagger
 * /api/books:
 *  get:
 *    summary: To get all books from MongoDB
 *    description: This API is used to fetch data from MongoDB
 *    responses:
 *      '200':
 *        description: Success response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Book'
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         id:
 *           type: integer
 */


app.get('/api/books', (req, res) => {
    Book.find({})
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            throw err;
        });
});



/**
 * @swagger
 * /api/books/{id}:
 *  get:
 *    summary: To get all books from MongoDB
 *    description: This API is used to fetch data from MongoDB
 *    parameters: 
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Success response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Book'
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         id:
 *           type: integer
 */

app.get('/api/books/:id', (req, res) => {
    Book.find({ _id: req.params.id })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            throw err;
        });
});

// app.get('/api/books/id', (req, res) => {
//     Book.find({ id: req.params.id }) 
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             throw err;
//         });
// });


/**
 * @swagger
 * /api/books/addBook:
 *  post: 
 *      summary: This api is used to insert data in mongodb.
 *      description: Post API test
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/Book'
 *      responses:
 *          200: 
 *              description: Added Successfully.
 */

app.post('/api/books/addBook', async (req, res) => {
    try {
        const lastBook = await Book.findOne().sort('-id').exec();
        const newBook = new Book({
            id: lastBook ? lastBook.id + 1 : 1,
            title: req.body.title
        });
        await newBook.save();
        res.send("Added Successfully");
    } catch (err) {
        res.status(500).send(err);
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *  put:
 *    summary: Update book data
 *    description: Update a book record in MongoDB
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      '200':
 *        description: Updated Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 */

app.put('/api/books/:id', async (req, res) => {
    try {
      const updatedBook = {
        title: req.body.title
      };
      const updatedBookDocument = await Book.findOneAndUpdate(
        { _id: req.params.id },
        updatedBook,
        { new: true }
      ).exec();
  
      if (!updatedBookDocument) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      res.json(updatedBookDocument);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
/**
 * @swagger
 * /api/books/{id}:
 *  delete:
 *    summary: To delete book from MongoDB
 *    description: This API is used to fetch data from MongoDB
 *    parameters: 
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Deleted Successfully
 */
app.delete('/api/books/:id', async (req, res) => {
    try {
        await Book.findOneAndDelete({ _id: req.params.id }).exec();
        res.send('Book is deleted');
    } catch (err) {
        res.status(500).send(err);
    }
});


// Connecting to the database
connectDB()
    .then(() => {
        app.listen(8000, () => {
            console.log(`Server is running on port: http://localhost:8000`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });


