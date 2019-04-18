const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}, existingProduct, updatedProduct,
                existingProductIndex;
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            existingProductIndex = cart.products.findIndex(prod => id === prod.id);
            existingProduct = cart.products[existingProductIndex];

            if (existingProduct) {
                existingProduct.qty += 1;
            } else {
                updatedProduct = {id: id, price: productPrice, qty: 1};
                cart.products.push(updatedProduct);
            }

            cart.totalPrice += +productPrice;

            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id) {
        fs.readFile(p, (err, fileContent) => {
            let cart, existingItem;
            if (!err) {
                cart = JSON.parse(fileContent);
                existingItem = cart.products.find(item => item.id === id);
                if (!existingItem) {
                    return;
                }
                cart.products = cart.products.filter(item => item.id !== id);
                cart.totalPrice -= existingItem.price*existingItem.qty;
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    console.log(err);
                });
            } else {
                console.log(err);
                return;
            }
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                cb(JSON.parse(fileContent));
            } else {
                cb([]);
            }
        })
    }
}
