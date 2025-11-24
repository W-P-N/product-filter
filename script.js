(async function () {
    const state = {
        allProducts: [],
        filteredProducts: [],
        filters: {
            searchText: '',
            selectedCategory: 'all',
            sortValue: 'default'
        },
        isLoading: true
    };

    // Get all constant files
    const productGrid = document.getElementById('productGrid');
    const searchProduct = document.getElementById('searchProduct');
    const selectCategory = document.getElementById('selectCategory');
    const sortFilter = document.getElementById('sortFilter');
    const loader = document.querySelector('.loader');

    // Add listeners
    const debouncedRender = debounce(applyFilters, 300);
    searchProduct.addEventListener('input', debouncedRender);
    selectCategory.addEventListener('change', function() {
        applyFilters();
    });
    sortFilter.addEventListener('change', function() {
        applyFilters();
    });

    // Debounce
    function debounce(func, delay) {
        let timeout;
        return () => {
            clearInterval(timeout);
            timeout = setTimeout(func, delay);
        };
    };

    async function loadProducts() {
        // Get products
        try {
            const resp = await fetch('./store_data.json');
            if(!resp.ok) {
                throw new Error('Error fetching JSON ' + resp.status);
            };
            state.allProducts = await resp.json();
            console.log("Got products");
        } catch (error) {
            console.log("An error occurred while fetching the JSON file: ", error);
        };
    };

    document.addEventListener('DOMContentLoaded', async() => {
        loader.style.display = 'block';
        await loadProducts();
        loader.style.display = 'none';
        displayProducts(state.allProducts);
        updateCategories();
    });

    // Update categories:
    function updateCategories() {
        const uniqueCategories = [];
        state.allProducts.forEach(product => {
            let category = product.category;
            if(!uniqueCategories.includes(category)) {
                uniqueCategories.push(category);
            };
        });
        const categoryOptionsHTML = uniqueCategories.map(category => {
            return `<option>${category.toLowerCase()}</option>`;
        }).join('');
        selectCategory.innerHTML += categoryOptionsHTML;
    };

    // Function to display products on products grid
    function displayProducts(products) {
        // Remove all children
        productGrid.replaceChildren();
        // Show for no products
        if(products?.length === 0){
            productGrid.innerHTML = '<h3>No products found</h3>';
            return;
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
        state.filters.searchText = searchProduct.value;
        state.filters.selectedCategory = selectCategory.value;
        state.filters.sortValue = sortFilter.value;
        
        state.filteredProducts = [...state.allProducts];
        if(state.filters.searchText) {
            state.filteredProducts = state.filteredProducts.filter(product => product?.name.toLowerCase().includes(state.filters.searchText.toLowerCase()));
        };
        if(state.filters.selectedCategory !== 'all') {
            state.filteredProducts = state.filteredProducts.filter(product => product?.category.toLowerCase() === state.filters.selectedCategory.toLowerCase());
        };
        
        switch(state.filters.sortValue) {
            case 'low-to-high':
                state.filteredProducts = state.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'high-to-low':
                state.filteredProducts = state.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        };
        displayProducts(state.filteredProducts); 
    };


}) ();


