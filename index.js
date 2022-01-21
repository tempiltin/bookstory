const express = require('express')
const app = express()
const exhbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/User')

require('dotenv').config()

// Importing routers 
const homeRouter = require('./routers/home')
const booksRouter = require('./routers/books')
const cardRouter = require('./routers/card')
const orderRouter = require('./routers/order')

// Using exhbs
const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    req.user = await User.findById('61dd9b3ab0b79ad2d15af481')  // id orqali userni topib beradi
    next()
})

// Watching public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))

// Using routers
app.use('/', homeRouter)
app.use('/books', booksRouter)
app.use('/card', cardRouter)
app.use('/orders', orderRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI)

        const candidate = await User.findOne() // bitta ma'lumot olib beradi // foydalanuvchi bor bo'lsa userga tushadi

        if (!candidate) {
            const user = new User({
                email: 'temurbekshukurov0707@gmail.com',
                name: 'temurbek',
                cart: { items: [] }  // userni korzinasi default bo'sh
            })

            await user.save()  // userni saqladik
        }

        // Listening port
        const port = process.env.PORT
        const host = process.env.HOST
        app.listen(port, host, () => {
            console.log(`Server watching ${host} ${port}...`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()

