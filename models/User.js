const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    cart: {  /* kart bu korzina user sotib olgan mahsulotlar */
        items: [
            {
                count: { type: Number, required: true, default: 1 },
                bookId: { type: Schema.Types.ObjectId, required: true, ref: 'book' }
            },
        ]
    }
})

userSchema.methods.addToCart = function (book) {
    // const clonedItems = this.cart.items.concat()  // clone

    const items = [...this.cart.items]  // clone

    const idx = items.findIndex(c => {  // 0 1 4 // -1
        return c.bookId.toString() === book._id.toString()
    })

    if (idx >= 0) {
        /// demak bu kitob korzinada bor uni sonini oshiramiz
        items[idx].count++
    } else {
        // demak bu kitob korzinada yo'q uni yaratamiz
        items.push({
            count: 1,
            bookId: book._id
        })
    }

    // const newCart = { items: clonedItems }  // yangi korzina hosil bo'ladi
    // this.cart = newCart

    this.cart = { items }

    return this.save()
}

userSchema.methods.deleteItem = function (id) {
    // const clonedItems = this.cart.items.concat()  // clone

    let items = [...this.cart.items]  // clone

    const idx = items.findIndex(c => {  // 0 1 4 // -1
        return c.bookId.toString() === id.toString()
    })

    if (items[idx].count === 1) {
        /// demak bu kitobni korzinadan to'liq o'chiramiz
        items = items.filter(c => c.bookId.toString() !== id.toString())
    } else {
        // demak bu kitobni sonini kamaytiramiz
        items[idx].count--
    }



    this.cart = { items }

    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] }
    return this.save()
}



module.exports = model('User', userSchema)