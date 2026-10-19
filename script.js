
document.addEventListener("DOMContentLoaded", function () {

    const cartKey = "urbanFitCart";

    // 1. Cart data read karo
    function getCart() {
        return JSON.parse(localStorage.getItem(cartKey)) || [];
    }

    // 2. Cart counter update karo
    function updateCartCount() {
        const cart = getCart();

        const totalItems = cart.reduce(function (total, item) {
            return total + item.quantity;
        }, 0);

        document.querySelectorAll(".cart-count").forEach(function (counter) {
            counter.textContent = totalItems;
        });
    }

    // 3. Product ko cart mein add karo
    function addToCart(name, price) {
        const cart = getCart();

        const existingProduct = cart.find(function (item) {
            return item.name === name;
        });

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: Number(price),
                quantity: 1
            });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));

        updateCartCount();

        alert(name + " added to your bag!");
    }

    // 4. Add to Bag button ka click handle karo
    document.addEventListener("click", function (event) {

        const button = event.target.closest(".add-to-cart-btn");

        if (!button) {
            return;
        }

        console.log("Add to Bag clicked!");

        const name = button.dataset.name;
        const price = button.dataset.price;

        if (!name || !price) {
            console.error("Product name ya price missing hai.");
            return;
        }

        addToCart(name, price);

    });

    // 5. Page load par counter update karo
    updateCartCount();

});

/* ===== CART PAGE FUNCTIONALITY ===== */

function renderCartPage() {
    const cartContainer = document.getElementById("cart-items");

    // Agar cart page nahi hai, function stop karo
    if (!cartContainer) return;

    const cart = JSON.parse(
        localStorage.getItem("urbanFitCart")
    ) || [];

    // Empty cart
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your bag is empty.</h2>
                <p>Discover something you'll love.</p>
                <a href="shop.html" class="btn btn-dark">
                    SHOP NOW
                </a>
            </div>
        `;

        document.getElementById("cart-subtotal").textContent = "₹0";
        document.getElementById("cart-total").textContent = "₹0";
        return;
    }

    // Products display karo
    cartContainer.innerHTML = cart.map(function (item, index) {
        return `
            <div class="cart-item">

                <div class="cart-item-info">
                    <h3>${item.name}</h3>

                    <p class="cart-item-price">
                        ₹${Number(item.price).toLocaleString("en-IN")}
                    </p>

                    <label>
                        Quantity:
                        <input
                            class="cart-quantity"
                            type="number"
                            min="1"
                            max="20"
                            value="${item.quantity}"
                            data-index="${index}">
                    </label>

                    <button
                        type="button"
                        class="remove-item"
                        data-index="${index}">
                        Remove
                    </button>
                </div>

                <strong>
                    ₹${(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>

            </div>
        `;
    }).join("");

    // Total calculate karo
    const subtotal = cart.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);

    document.getElementById("cart-subtotal").textContent =
        "₹" + subtotal.toLocaleString("en-IN");

    document.getElementById("cart-total").textContent =
        "₹" + subtotal.toLocaleString("en-IN");
}

// Remove aur quantity changes handle karo
document.addEventListener("click", function (event) {
    const button = event.target.closest(".remove-item");

    if (!button) return;

    const index = Number(button.dataset.index);

    const cart = JSON.parse(
        localStorage.getItem("urbanFitCart")
    ) || [];

    cart.splice(index, 1);

    localStorage.setItem("urbanFitCart", JSON.stringify(cart));

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    renderCartPage();
});

document.addEventListener("change", function (event) {
    if (!event.target.matches(".cart-quantity")) return;

    const index = Number(event.target.dataset.index);
    const quantity = Math.max(
        1,
        Math.min(20, Number(event.target.value) || 1)
    );

    const cart = JSON.parse(
        localStorage.getItem("urbanFitCart")
    ) || [];

    if (!cart[index]) return;

    cart[index].quantity = quantity;

    localStorage.setItem("urbanFitCart", JSON.stringify(cart));

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    renderCartPage();
});

// Page load hone par cart render karo
document.addEventListener("DOMContentLoaded", renderCartPage);

// Demo checkout
document.addEventListener("click", function (event) {
    if (event.target.id === "checkout-button") {
        alert("Checkout demo only. No real order or payment is processed.");
    }
});
