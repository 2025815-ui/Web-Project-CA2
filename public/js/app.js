
document.addEventListener('DOMContentLoaded', fetchProducts)

async function fetchProducts(){
    const productDiv = document.getElementById('content');

    try{
        const response = await fetch('/api/products');

        if(!response.ok){
            throw new Error('Network response was not ok');
        }

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


    }catch(err){
        console.log(err);
        
    }
}
   
        