
document.addEventListener('DOMContentLoaded', fetchProducts);

function getSession() {
    let sid = localStorage.getItem('session_id');
    if (!sid) {
        sid = 'session' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('session_id', sid); 
    }
    return sid;
}

async function fetchProducts() {
    const productDiv = document.getElementById('content');
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
                <button>Add To Cart</button>
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
            <button>Add To Cart</button>
        `;
        container.appendChild(card); 
    });
}   

