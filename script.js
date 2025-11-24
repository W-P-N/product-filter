(async function () {
    // Get all constant files
    const productGrid = document.getElementById('productGrid');
    const searchProduct = document.getElementById('searchProduct');
    const selectCategory = document.getElementById('selectCategory');
    const sortFilter = document.getElementById('sortFilter');

    // Add listeners
    searchProduct.addEventListener('change', function() {
        applyFilters();
    });
    selectCategory.addEventListener('change', function() {
        applyFilters();
    });
    sortFilter.addEventListener('change', function() {
        applyFilters();
    });

    let products = [];

    async function loadProducts() {
        // Get products
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
    };

    document.addEventListener('DOMContentLoaded', async() => {
        await loadProducts();
        displayProducts(products);
        updateCategories();
    });

    // Update categories:
    function updateCategories() {
        const uniqueCategories = [];
        products.forEach(product => {
            let category = product.category;
            if(!uniqueCategories.includes(category)) {
                uniqueCategories.push(category);
            };
        });
        // Loop over unique categories to update categories in html
        uniqueCategories.forEach(category => {
            let childNode = `<option>${category.toLowerCase()}</option>`;
            selectCategory.innerHTML+= childNode;
        });
    };

    // Function to display products on products grid
    function displayProducts(products) {
        // Remove all children
        productGrid.replaceChildren();
        // Show for no products
        if(products.length === 0){
            productGrid.innerHTML = '<h3>No products found</h3>'
        };
        // Map over products to create array of HTML strings
        const productsHTML = products.map((product, idx) => {
            return `
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
        }).join('');  // Join array into single string;
        
        // Set innerHTML
        productGrid.innerHTML = productsHTML;
    };

    // Central function to apply any filters/ searches and sorting.
    function applyFilters() {
        const searchText = searchProduct.value;
        const selectedCategory = selectCategory.value;
        const sortValue = sortFilter.value;
        
        let filteredProducts = [...products];
        if(searchText) {
            filteredProducts = filteredProducts.filter(product => product?.name.toLowerCase().includes(searchText.toLowerCase()));
        };
        if(selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product?.category.toLowerCase() === selectedCategory.toLowerCase());
        };
        
        switch(sortValue) {
            case 'low-to-high':
                filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'high-to-low':
                filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        };
        displayProducts(filteredProducts); 
    };


}) ();


