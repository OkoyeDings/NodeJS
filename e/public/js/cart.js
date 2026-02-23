// cart.js

var products = JSON.parse(localStorage.getItem('cart')) || [];
var cart_n = document.getElementById('cart_n');
var table = document.getElementById('table');
var total = 0;

// =============================
// HTML TEMPLATE
// =============================

function tableHTML(i) {
    return `
        <tr>
            <th scope="row">${i + 1}</th>
            <th><img style="width:90px;" src="${products[i].url}"></th>
            <td>${products[i].name}</td>
            <td>1</td>
            <td>${products[i].price}</td>
        </tr>
    `;
}

// =============================
// CLEAN CART
// =============================

function clean() {
    localStorage.clear();
    total = 0;
    table.innerHTML = `
        <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    `;
    cart_n.innerHTML = '';
    document.getElementById("btnBuy").style.display = "none";
    document.getElementById("btnClean").style.display = "none";
}

// =============================
// BUILD TABLE
// =============================

(()=>{
    if (products.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Your cart is empty.</td>
            </tr>
        `;
        cart_n.innerHTML = '[0]';
        return;
    }

    for (let index = 0; index < products.length; index++) {
        table.innerHTML += tableHTML(index);
        total += parseInt(products[index].price);
    }

    table.innerHTML += `
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Total: $${total}.00</th>
        </tr>
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">
                <button id="btnClean" onClick="clean()" class="btn text-white btn-warning">
                    Clean Shopping Cart
                </button>
            </th>
            <th scope="col">
                <form id="form1" action="/cart" method="POST" autocomplete="off">
                    <input type="hidden" name="total" value="${total}">
                    <input type="hidden" name="_id" value="">
                    <button id="submitbtn" type="button" class="btn btn-success">Buy</button>
                </form>
            </th>
        </tr>
    `;

    cart_n.innerHTML = `[${products.length}]`;

    // =============================
    // SUBMIT HANDLER
    // =============================

    var form = document.getElementById('form1');

    document.getElementById('submitbtn').addEventListener('click', () => {
        localStorage.clear();
        cart_n.innerHTML = '[0]';
        setTimeout(() => {
            form.submit();
        }, 1000);
    });

})();