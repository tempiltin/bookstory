const price = document.querySelectorAll('.price'); // massiv
const bookPrice = document.querySelectorAll('.bookPrice'); // massiv

const toCurrency = (price) => {
    return new Intl.NumberFormat('en-EN', {
        currency: 'usd',
        style: 'currency'
    }).format(price)
}

price.forEach(p => {  // map bilan tekshiramiz
    p.textContent = toCurrency(p.textContent)
})

bookPrice.forEach(p => {  // map bilan tekshiramiz
    p.textContent = toCurrency(p.textContent)
})

const $card = document.querySelector('#card');

if ($card) {
    $card.addEventListener('click', event => {
        // console.log(event);
        const contain = event.target.classList.contains('js-remove')  // boolean true // false
        // console.log(contain);
        if (contain) {
            const id = event.target.dataset.id // id ni oldik
            // console.log(id);

            fetch('/card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
                .then(data => {
                    // console.log(data);  { books: [{title, count, price}, {}], price: 0}

                    if (data.books.length) {
                        const html = data.books.map(b => {
                            return `
                            <tr>
                            <td>${b.title}</td>
                            <td>${b.count}</td>
                            <td>
                                <p class="bookPrice">${toCurrency(b.price)}</p>
                            </td>
                            <td>
                                <button class="btn js-remove" data-id="${b.id}">Delete</button>
                            </td>
                            </tr> 
                            `
                        }).join('')

                        $card.querySelector('tbody').innerHTML = html
                        $card.querySelector('.price').textContent = toCurrency(data.price) // yangilangan price
                    } else {
                        $card.innerHTML = '<div class="container"><p>Shopping card is empty </p></div>'
                    }
                })
        }

    })
}