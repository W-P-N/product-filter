(async function () {
    // Get products
    let products = [];
    
    try {
        const resp = await fetch('./store_data.json');
        if(!resp.ok) {
            throw new Error('Error fetching JSON ' + resp.status);
        };
        products = await resp.json();
        console.log("Got products");
    } catch (error) {
        console.log("An error occurred while fetching the JSON file: ", error);
    };

    // Get all constant files
    const productGrid = document.getElementById('productGrid');

    // Function to display products on products grid
    function displayProducts(products) {
        // Remove all children
        productGrid.replaceChildren();
        // Map over products for showing data
        const productsArray = products.map((product, idx) => {
            const productCard = `
                <div class="productCard">
                    <figure>
                        <img src="${product?.imageUrl}" alt="${product?.name}" >
                        <figcaption>${product?.name}</figcaption>
                    </figure>
                    <h3>${product?.name}</h3>
                    <p>${product?.description}</p>
                    <p>${product?.price}</p>
                    <p>Category: ${product?.category}</p>
                </div>
            `;
            return productCard;
        });
        // Append to product grid
        productsArray.forEach((productCard) => productGrid.innerHTML += productCard);
    };

    displayProducts(products);



}) ();


