const { Router } = require('express')
const router = Router()
const Book = require('../models/Book')

router.get('/', async (req, res) => {
    const books = await Book.find().populate('userId', 'email name').select('title price img')/* find ma'lumotlarni topadi */
    res.render('books', {
        title: 'All books',
        books,
        isBoks:true
    })
})

router.get('/view/:id', async (req, res) => {
    const book = await Book.findById(req.params.id) //obyekt

    res.render('book', {
        title: book.title,
        img: book.img,
        price: book.price,
        id: book.id,
    })
})

router.get('/add/book', (req, res) => {
    res.render('addBook', {
        title: 'Create new book'
    })
})

router.get('/update/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)  // id si bo'yicha topadi

    res.render('updateBook', {
        title: book.title,
        price: book.price,
        img: book.img,
        id: book.id
    })
})

router.post('/update', async (req, res) => {
    const { id } = req.body
    await Book.findByIdAndUpdate(id, req.body)

    delete req.body.id

    res.redirect('/books')
})

router.post('/delete', async (req, res) => {
    await Book.findByIdAndDelete(req.body.id)
    res.redirect('/books')
})

router.post('/add/book', async (req, res) => {
    // console.log(req.body);  // obyekt {bookName: '', ....}
    const { title, price, img } = req.body

    const book = new Book({
        title,
        price,
        img,
        userId: req.user /* id o'zi topa oladi */
    })
    await book.save()
    res.redirect('/books')
})

module.exports = router