// Run fetchProducts() once the HTML page has fully loaded
document.addEventListener('DOMContentLoaded', fetchProducts);

// ─────────────────────────────────────
// CREATE / GET USER SESSION
// ─────────────────────────────────────
function getSession() {

    // Check if a session already exists in localStorage
    let sid = localStorage.getItem('session_id');

    // If no session exists, create a new one
    if (!sid) {

        // Generate random session ID
        sid = 'sess_' + Math.random().toString(36).substr(2, 11);

        // Save session ID in browser storage
        localStorage.setItem('session_id', sid); 
    }

    // Return session ID
    return sid;
}

// ══════════════════════════════════════
// PRODUCT PAGE (index.html)
// ══════════════════════════════════════

// Fetch all products from the API
async function fetchProducts() {

    // Get the container where products will be displayed
    const productDiv = document.getElementById('content');

    // Stop function if container doesn't exist
    if (!productDiv) return;

    try {

        // Request products from backend API
        const response = await fetch('/api/products');

        // Throw error if response fails
        if (!response.ok) throw new Error('Network response was not ok');

        // Convert response into JSON
        const products = await response.json();

        // Clear existing products before rendering
        productDiv.innerHTML = '';

        // Loop through all products
        products.forEach(product => {

            // Create product card
            const card = document.createElement('div');

            // Add card styling class
            card.classList.add('card');

            // Insert product data into card
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>€${product.price}</p>
                <button onclick="addToBasket(${product.id})">Add To Cart</button>
            `;

            // Add card to page
            productDiv.appendChild(card);
        });

    } catch (err) {

        // Display errors in console
        console.log(err);
    }
}

// Load products by category
async function loadCategory(category) {

    // Build API URL depending on category selection
    const url = category
        ? `/api/products?category=${encodeURIComponent(category)}`
        : `/api/products`;

    // Fetch products
    const res = await fetch(url);

    // Convert to JSON
    const games = await res.json();

    // Render products on page
    renderGames(games);
}

// Display product cards on screen
function renderGames(games) {

    // Get product container
    const container = document.getElementById('content');

    // Clear old products
    container.innerHTML = '';

    // Loop through all products
    games.forEach(game => {

        // Create product card
        const card = document.createElement('div');

        // Add styling class
        card.classList.add('card');

        // Insert product information
        card.innerHTML = `
            <img src="${game.image}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>€${game.price}</p>
            <button onclick="addToBasket(${game.id})">Add To Cart</button>
        `;

        // Add card to page
        container.appendChild(card); 
    });
}   

// ─────────────────────────────────────
// ADD PRODUCT TO BASKET
// ─────────────────────────────────────
async function addToBasket(productId) {

    try {

        // Send POST request to basket API
        const response = await fetch('/api/basket/add', {

            method: 'POST',

            // Send JSON data
            headers: { 'Content-Type': 'application/json' },

            // Convert data into JSON string
            body: JSON.stringify({
                session_id: getSession(),
                product_id: productId,
                quantity: 1
            })
        });

        // Error handling
        if (!response.ok) throw new Error('Failed to add item');

        // Success message
        alert('Item added to basket!');

    } catch (err) {

        // Log errors
        console.log(err);

        // Error alert
        alert('Could not add item to basket.');
    }
}

// ══════════════════════════════════════
// BASKET PAGE (basket.html)
// ══════════════════════════════════════

// Load basket when basket page opens
document.addEventListener('DOMContentLoaded', () => {

    // Check if basket section exists
    if (document.getElementById('basket-items')) {

        // Load basket data
        loadBasket();
    }
});

// Fetch basket items from backend
async function loadBasket() {

    // Get HTML elements
    const container = document.getElementById('basket-items');
    const totalEl = document.getElementById('basket-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Stop if basket container doesn't exist
    if (!container) return;

    try {

        // Fetch basket items using session ID
        const response = await fetch(`/api/basket/${getSession()}`);

        // Handle failed request
        if (!response.ok) throw new Error('Failed to fetch basket');

        // Convert response to JSON
        const items = await response.json();

        // Clear old basket items
        container.innerHTML = '';

        // Basket total variable
        let total = 0;

        // Show empty basket message
        if (items.length === 0) {

            container.innerHTML = '<p>Your basket is empty.</p>';

            totalEl.textContent = '';

            // Hide checkout button if basket is empty
            if (checkoutBtn) checkoutBtn.style.display = 'none';

            return;
        }

        // Show checkout button if basket has items
        if (checkoutBtn) checkoutBtn.style.display = 'inline-block';

        // Loop through basket items
        items.forEach(item => {

            // Calculate subtotal for each item
            const subtotal = (item.price * item.quantity).toFixed(2);

            // Add subtotal to total
            total += parseFloat(subtotal);

            // Display basket item
            container.innerHTML += `
                <div class="basket-row">
                    <img src="${item.image}" alt="${item.name}" style="width:60px; border-radius:4px"/>
                    <div class="basket-info">
                        <span class="basket-name">${item.name}</span>
                        <span class="basket-category">${item.category}</span>

                        <!-- Show badge if game is new release -->
                        ${item.isNewRelease ? '<span class="badge">New Release</span>' : ''}
                    </div>

                    <span class="basket-qty">Qty: ${item.quantity}</span>
                    <span class="basket-price">€${subtotal}</span>

                    <!-- Remove button -->
                    <button class="btn btn-remove" onclick="removeItem(${item.id})">
                        Remove
                    </button>
                </div>`;
        });

        // Display total basket cost
        totalEl.textContent = `Total: €${total.toFixed(2)}`;

    } catch (err) {

        // Log errors
        console.log(err);
    }
}

// ─────────────────────────────────────
// REMOVE ITEM FROM BASKET
// ─────────────────────────────────────
async function removeItem(id){

    try{

        // Send DELETE request
        const response = await fetch(`/api/basket/remove/${id}`,{
            method : 'DELETE'
        });

        // Error handling
        if(!response.ok) throw new Error ("Failed to remove item.");

        // Reload basket after deletion
        loadBasket();

    }catch(err){

        console.log(err);
    }
}

// ══════════════════════════════════════
// CHECKOUT SECTION
// ══════════════════════════════════════

// Show checkout page
function showCheckout(){

    // Get basket total text
    const totalText = document.getElementById('basket-total').textContent;

    // Get basket items HTML
    const basketItems = document.getElementById('basket-items').innerHTML;

    // Create order summary
    document.getElementById('order-summary').innerHTML = `
        <div class="summary-box">
            <h3>Order Summary</h3>
            ${basketItems}
            <strong>${totalText}</strong>
        </div>`;

    // Hide basket section
    document.getElementById('basket-section').style.display = 'none';

    // Show checkout section
    document.getElementById('checkout-section').style.display = 'block';
}

// Hide checkout and return to basket
function hideCheckout(){

    // Hide checkout section
    document.getElementById('checkout-section').style.display = 'none';

    // Show basket section
    document.getElementById('basket-section').style.display = 'block';
}

// ─────────────────────────────────────
// PLACE ORDER
// ─────────────────────────────────────

// Wait until page loads
document.addEventListener('DOMContentLoaded', () => {

    // Get checkout form
    const checkoutFrom = document.getElementById('checkout-form');

    // Stop if form doesn't exist
    if(!checkoutFrom) return;

    // Listen for form submission
    checkoutFrom.addEventListener('submit', async function(e){

        // Prevent page refresh
        e.preventDefault();

        try{

            // Clear basket after successful order
            const response = await fetch(`/api/basket/clear/${getSession()}`, {
                method : 'DELETE'
            });

            // Error handling
            if(!response.ok) throw new Error("Failed to remove item");

            // Hide checkout section
            document.getElementById('checkout-section').style.display = 'none';

            // Show confirmation message
            document.getElementById('confirmation-section').style.display = 'block';

        }catch(err){

            console.log(err);
        }
    })
})

// ══════════════════════════════════════
// FORM VALIDATION
// ══════════════════════════════════════

async function checkoutValidation() {

    // ── GET FORM VALUES ──
    let fullName = document.getElementById('full-name').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;
    let card = document.getElementById('card').value;

    // ── CLEAR OLD ERRORS ──
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('addressError').textContent = '';
    document.getElementById('cardError').textContent = '';

    // Validation status
    let isValid = true;

    // ─────────────────────────────────
    // VALIDATE FULL NAME
    // ─────────────────────────────────
    let namePattern = /^[a-zA-Z\s]+$/;

    if (fullName === '') {

        document.getElementById('nameError').textContent =
            'Full name must be filled.';

        isValid = false;

    } else if (fullName.length < 3) {

        document.getElementById('nameError').textContent =
            'Name must be at least 3 characters.';

        isValid = false;

    } else if (!namePattern.test(fullName)) {

        document.getElementById('nameError').textContent =
            'Name can only contain letters.';

        isValid = false;
    }

    // ─────────────────────────────────
    // VALIDATE EMAIL
    // ─────────────────────────────────
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {

        document.getElementById('emailError').textContent =
            'Email address is required.';

        isValid = false;

    } else if (!emailPattern.test(email)) {

        document.getElementById('emailError').textContent =
            'Email address is invalid.';

        isValid = false;
    }

    // ─────────────────────────────────
    // VALIDATE ADDRESS
    // ─────────────────────────────────
    if (address === '') {

        document.getElementById('addressError').textContent =
            'Address is required.';

        isValid = false;

    } else if (address.length < 10) {

        document.getElementById('addressError').textContent =
            'Please enter a full address.';

        isValid = false;
    }

    // ─────────────────────────────────
    // VALIDATE CARD NUMBER
    // ─────────────────────────────────
    let cardPattern = /^\d{16}$/;

    if (card === '') {

        document.getElementById('cardError').textContent =
            'Card number is required.';

        isValid = false;

    } else if (!cardPattern.test(card.replace(/\s/g, ''))) {

        document.getElementById('cardError').textContent =
            'Card number must be 16 digits.';

        isValid = false;
    }

    // Stop form submission if invalid
    if (!isValid) return false;

    // ─────────────────────────────────
    // SUBMIT ORDER IF VALID
    // ─────────────────────────────────
    try {

        // Clear basket
        const response = await fetch(`/api/basket/clear/${getSession()}`, {
            method: 'DELETE'
        });

        // Error handling
        if (!response.ok) throw new Error('Failed to clear basket');

        // Hide checkout section
        document.getElementById('checkout-section').style.display = 'none';

        // Show confirmation section
        document.getElementById('confirmation-section').style.display = 'block';

    } catch (err) {

        // Log errors
        console.log(err);

        // Show error message
        alert('Something went wrong. Please try again.');
    }

    // Prevent page reload
    return false;
}