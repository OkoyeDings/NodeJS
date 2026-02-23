// =============================
// GLOBAL VARIABLES
// =============================
let products = [];
let cartItems = [];
const cart_n = document.getElementById('cart_n');

// Product containers
const fruitDIV = document.getElementById("fruitDIV");
const juiceDIV = document.getElementById("juiceDIV");
const saladDIV = document.getElementById("saladDIV");

// =============================
// PRODUCT DATA
// =============================
const FRUIT = [
    { name: 'Apple', price: 1 },
    { name: 'Orange', price: 1 },
    { name: 'Cherry', price: 1 },
    { name: 'Strawberry', price: 1 },
    { name: 'Kiwi', price: 1 },
    { name: 'Banana', price: 1 },
];

const JUICE = [
    { name: 'Juice #1', price: 10 },
    { name: 'Juice #2', price: 11 },
    { name: 'Juice #3', price: 12 },
];

const SALAD = [
    { name: 'Salad #1', price: 11 },
    { name: 'Salad #2', price: 12 },
    { name: 'Salad #3', price: 13 },
];

// =============================
// HTML GENERATORS
// =============================
function productCardHTML(product, URL, btnId) {
    return `
    <div class="col-md-4 product-card">
        <div class="card mb-4 shadow-sm">
            <img class="card-img-top" style="height:16rem;" src="${URL}" alt="card">
            <div class="card-body">
                <i style="color:orange;" class="fa fa-star"></i>
                <i style="color:orange;" class="fa fa-star"></i>
                <i style="color:orange;" class="fa fa-star"></i>
                <i style="color:orange;" class="fa fa-star"></i>
                <i style="color:orange;" class="fa fa-star"></i>
                <p class="card-text">${product.name}</p>
                <p class="card-text">Price: ${product.price}.00</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <button type="button" onclick="addToCart('${product.name}', ${product.price}, '${URL}', '${btnId}', true, this)" class="btn btn-sm btn-outline-secondary">
                            Buy
                        </button>
                        <button id="${btnId}" type="button" onclick="addToCart('${product.name}', ${product.price}, '${URL}', '${btnId}', true, this)" class="btn btn-sm btn-outline-secondary">
                            Add to cart
                        </button>
                    </div>
                    <small class="text-muted">Free shipping</small>
                </div>
            </div>
        </div>
    </div>
    `;
}

function HTMLfruitProduct(index) {
    const product = FRUIT[index - 1];
    const URL = `../img/fruits/fruit${index}.jpeg`;
    const btnId = `btnFruit${index}`;
    return productCardHTML(product, URL, btnId);
}

function HTMLjuiceProduct(index) {
    const product = JUICE[index - 1];
    const URL = `../img/juice/juice${index}.jpeg`;
    const btnId = `btnJuice${index}`;
    return productCardHTML(product, URL, btnId);
}

function HTMLsaladProduct(index) {
    const product = SALAD[index - 1];
    const URL = `../img/salads/salad${index}.jpeg`;
    const btnId = `btnSalad${index}`;
    return productCardHTML(product, URL, btnId);
}

// =============================
// SWEETALERT2 TOAST
// =============================
function showToast(message = 'Added to cart!') {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    });
}

// =============================
// FLY TO CART ANIMATION
// =============================
function flyToCart(imgElement) {
    const cartIcon = document.getElementById('cart_n');

    const imgClone = imgElement.cloneNode(true);
    const rect = imgElement.getBoundingClientRect();
    imgClone.style.position = 'fixed';
    imgClone.style.top = rect.top + 'px';
    imgClone.style.left = rect.left + 'px';
    imgClone.style.width = rect.width + 'px';
    imgClone.style.height = rect.height + 'px';
    imgClone.style.transition = 'all 0.8s ease-in-out';
    imgClone.style.zIndex = 1000;
    imgClone.style.pointerEvents = 'none';
    document.body.appendChild(imgClone);

    const cartRect = cartIcon.getBoundingClientRect();

    requestAnimationFrame(() => {
        imgClone.style.top = cartRect.top + 'px';
        imgClone.style.left = cartRect.left + 'px';
        imgClone.style.width = '0px';
        imgClone.style.height = '0px';
        imgClone.style.opacity = 0.5;
    });

    imgClone.addEventListener('transitionend', () => {
        imgClone.remove();
    });
}

// =============================
// ADD TO CART FUNCTION
// =============================
function addToCart(name, price, url, btnId, showToastMessage, buttonElement) {
    const item = { name, price, url };
    cartItems.push(item);

    // Save to localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    storedCart.push(item);
    localStorage.setItem("cart", JSON.stringify(storedCart));

    // Update cart counter
    products = JSON.parse(localStorage.getItem("cart"));
    cart_n.innerHTML = `[${products.length}]`;

    // Hide "Add to cart" button
    if (btnId) {
        const btn = document.getElementById(btnId);
        if (btn) btn.style.display = "none";
    }

    // Trigger toast
    if (showToastMessage) showToast();

    // Trigger fly animation
    if (buttonElement) {
        const cardImg = buttonElement.closest('.card').querySelector('img');
        if (cardImg) flyToCart(cardImg);
    }
}

// =============================
// INITIALIZE PRODUCTS AND CART
// =============================
(function init() {
    // Load fruits
    for (let i = 1; i <= FRUIT.length; i++) {
        fruitDIV.innerHTML += HTMLfruitProduct(i);
    }
    // Load juices
    for (let i = 1; i <= JUICE.length; i++) {
        juiceDIV.innerHTML += HTMLjuiceProduct(i);
    }
    // Load salads
    for (let i = 1; i <= SALAD.length; i++) {
        saladDIV.innerHTML += HTMLsaladProduct(i);
    }

    // Initialize cart counter
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length) {
        products = storedCart;
        cart_n.innerHTML = `[${products.length}]`;
    }
})();