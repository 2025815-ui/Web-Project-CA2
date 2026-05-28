
document.addEventListener('DOMContentLoaded', fetchProducts);

function getSession() {
    let sid = localStorage.getItem('session_id');
    if (!sid) {
        sid = 'sess_' + Math.random().toString(36).substr(2, 11);
        localStorage.setItem('session_id', sid); 
    }
    return sid;
}

// ══════════════════════════════════════
// Product PAGE (index.html)
// ══════════════════════════════════════
async function fetchProducts() {
    const productDiv = document.getElementById('content');
      if (!productDiv) return;
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        productDiv.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>€${product.price}</p>
                <button onclick="addToBasket(${product.id})">Add To Cart</button>
            `;
            productDiv.appendChild(card);
        });
    } catch (err) {
        console.log(err);
    }
}

async function loadCategory(category) {
    const url = category
        ? `/api/products?category=${encodeURIComponent(category)}`
        : `/api/products`;
    const res = await fetch(url);
    const games = await res.json();
    renderGames(games);
}

function renderGames(games) {
    const container = document.getElementById('content');
    container.innerHTML = '';
    games.forEach(game => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${game.image}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>€${game.price}</p>
            <button onclick="addToBasket(${game.id})">Add To Cart</button>
        `;
        container.appendChild(card); 
    });
}   

// ── ADD TO BASKET ──
async function addToBasket(productId) {
    try {
        const response = await fetch('/api/basket/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: getSession(),
                product_id: productId,
                quantity: 1
            })
        });

        if (!response.ok) throw new Error('Failed to add item');

        alert('Item added to basket!');

    } catch (err) {
        console.log(err);
        alert('Could not add item to basket.');
    }
}

// ══════════════════════════════════════
// BASKET PAGE (basket.html)
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('basket-items')) {
        loadBasket();
    }
});

async function loadBasket() {
    const container = document.getElementById('basket-items');
    const totalEl = document.getElementById('basket-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!container) return;

    try {
        const response = await fetch(`/api/basket/${getSession()}`);

        if (!response.ok) throw new Error('Failed to fetch basket');

        const items = await response.json();

        container.innerHTML = '';
        let total = 0;

        if (items.length === 0) {
            container.innerHTML = '<p>Your basket is empty.</p>';
            totalEl.textContent = '';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            return;
        }

        if (checkoutBtn) checkoutBtn.style.display = 'inline-block';

        items.forEach(item => {
            const subtotal = (item.price * item.quantity).toFixed(2);
            total += parseFloat(subtotal);

            container.innerHTML += `
                <div class="basket-row">
                    <img src="${item.image}" alt="${item.name}" style="width:60px; border-radius:4px"/>
                    <div class="basket-info">
                        <span class="basket-name">${item.name}</span>
                        <span class="basket-category">${item.category}</span>
                        ${item.isNewRelease ? '<span class="badge">New Release</span>' : ''}
                    </div>
                    <span class="basket-qty">Qty: ${item.quantity}</span>
                    <span class="basket-price">€${subtotal}</span>
                    <button class="btn btn-remove" onclick="removeItem(${item.id})">Remove</button>
                </div>`;
        });

        totalEl.textContent = `Total: €${total.toFixed(2)}`;

    } catch (err) {
        console.log(err);
    }
}
//Remove item from basket
async function removeItem(id){
    try{
        const response = await fetch (`/api/basket/remove/${id}`,{
            method : 'DELETE'
        });

        if(!response.ok) throw new Error ("Failed to remove item.");
        loadBasket();
    }catch(err){
        console.log(err);
        
    }
}

// ══════════════════════════════════════
// CHECKOUT (inside basket.html)
// ══════════════════════════════════════

function showCheckout(){
    const totalText = document.getElementById('basket-total').textContent;
    const basketItems = document.getElementById('basket-items').innerHTML;

    document.getElementById('order-summary').innerHTML = `
        <div class="summary-box">
            <h3>Order Summary</h3>
            ${basketItems}
            <strong>${totalText}</strong>
        </div>`;

    document.getElementById('basket-section').style.display = 'none';
    document.getElementById('checkout-section').style.display = 'block';
}

//hide checkout
function hideCheckout(){
    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('basket-section').style.display = 'block';
}

//place order 
document.addEventListener('DOMContentLoaded', () => {
    const checkoutFrom = document.getElementById('checkout-form');

    if(!checkoutFrom) return;

    checkoutFrom.addEventListener('submit', async function(e){
        e.preventDefault();

        try{
            const response = await fetch(`/api/basket/clear/${getSession()}`, {
                method : 'DELETE'
            });

            if(!response.ok) throw new Error("Failed to remove item");

            document.getElementById('checkout-section').style.display = 'none';
            document.getElementById('confirmation-section').style.display = 'block';
        }catch(err){
            console.log(err);
            
        }
    })
})

//form validation
async function checkoutValidation() {
    // ── GET INPUT VALUES ──
    let fullName = document.getElementById('full-name').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;
    let card = document.getElementById('card').value;

    // ── CLEAR PREVIOUS ERROR MESSAGES ──
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('addressError').textContent = '';
    document.getElementById('cardError').textContent = '';

    let isValid = true;

    // ── VALIDATE FULL NAME ──
    let namePattern = /^[a-zA-Z\s]+$/;
    if (fullName === '') {
        document.getElementById('nameError').textContent = 'Full name must be filled.';
        isValid = false;
    } else if (fullName.length < 3) {
        document.getElementById('nameError').textContent = 'Name must be at least 3 characters.';
        isValid = false;
    } else if (!namePattern.test(fullName)) {
        document.getElementById('nameError').textContent = 'Name can only contain letters.';
        isValid = false;
    }

    // ── VALIDATE EMAIL ──
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        document.getElementById('emailError').textContent = 'Email address is required.';
        isValid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Email address is invalid.';
        isValid = false;
    }

    // ── VALIDATE ADDRESS ──
    if (address === '') {
        document.getElementById('addressError').textContent = 'Address is required.';
        isValid = false;
    } else if (address.length < 10) {
        document.getElementById('addressError').textContent = 'Please enter a full address.';
        isValid = false;
    }

    // ── VALIDATE CARD ──
    let cardPattern = /^\d{16}$/;
    if (card === '') {
        document.getElementById('cardError').textContent = 'Card number is required.';
        isValid = false;
    } else if (!cardPattern.test(card.replace(/\s/g, ''))) {
        document.getElementById('cardError').textContent = 'Card number must be 16 digits.';
        isValid = false;
    }

    // ── STOP IF INVALID ──
    if (!isValid) return false;

    // ── SUBMIT IF VALID ──
    try {
        const response = await fetch(`/api/basket/clear/${getSession()}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to clear basket');

        document.getElementById('checkout-section').style.display = 'none';
        document.getElementById('confirmation-section').style.display = 'block';

    } catch (err) {
        console.log(err);
        alert('Something went wrong. Please try again.');
    }

    return false; // ← prevents page reload
}