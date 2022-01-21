const { Router } = require('express')
const router = Router()
const Book = require('../models/Book')


const mapedCart = (cart) => {
    // console.log(cart);
    return cart.map(c => ({
        ...c.bookId._doc,
        id: c.bookId.id,
        count: c.count
    }))
}

const colculatePrice = (books) => {
    return books.reduce((total, c) => {
        // console.log(total);
        // console.log('total', total);
        // console.log('bookObject', c);
        return total += +c.price * +c.count
    }, 0)  /* ikkinchi parametr totalni boshlang'ich qiymati */
}

router.post('/buy', async (req, res) => {
    const book = await Book.findById(req.body.id)
    await req.user.addToCart(book)
    res.redirect('/card')
})

router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.bookId', 'title price')  // bazadan ma'lumotlar olib keladi

    const books = mapedCart(user.cart.items)

    res.render('card', {
        books,
        price: colculatePrice(books),
        isCard:true
    })

    // res.json({ test: true })
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.deleteItem(req.params.id)
    const user = await req.user.populate('cart.items.bookId', 'count title price')
    const books = mapedCart(user.cart.items)

    res.status(200).json({ books, price: colculatePrice(books) })  // yangi hosil bo'lgan cartani klientga qaytardik
})

module.exports = router