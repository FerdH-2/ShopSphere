const container = document.querySelector("main")
container.innerHTML = " "

const storedCart = localStorage.getItem("cart")
const cart = JSON.parse(storedCart) || []

const data = [
  {
    "id": 0,
    "image": "/public/images/image-baklava-desktop.jpg",
    "name": "Spaghetti Carbonara",
    "description": "Creamy, rich pasta",
    "price": 12.99,
    "quantity": 1
  },
  {
    "id": 1,
    "image": "/public/images/image-brownie-desktop.jpg",
    "name": "Cheeseburger Deluxe",
    "description": "Juicy beef patty",
    "price": 9.49,
    "quantity": 1
  },
  {
    "id": 2,
    "image": "/public/images/image-cake-desktop.jpg",
    "name": "Chicken Caesar Salad",
    "description": "Crisp, fresh greens",
    "price": 8.99,
    "quantity": 1
  },
  {
    "id": 3,
    "image": "/public/images/image-creme-brulee-desktop.jpg",
    "name": "Margarita Pizza",
    "description": "Classic, thin crust",
    "price": 10.75,
    "quantity": 1
  },
  {
    "id": 4,
    "image": "/public/images/image-macaron-desktop.jpg",
    "name": "Sushi Platter",
    "description": "Fresh, assorted sushi",
    "price": 18.50,
    "quantity": 1
  },
  {
    "id": 5,
    "image": "/public/images/image-meringue-desktop.jpg",
    "name": "Beef Tacos",
    "description": "Spicy, flavorful filling",
    "price": 7.99,
    "quantity": 1
  },
  {
    "id": 6,
    "image": "/public/images/image-panna-cotta-desktop.jpg",
    "name": "Pancake Stack",
    "description": "Fluffy, buttery pancakes",
    "price": 6.49,
    "quantity": 1
  },
  {
    "id": 7,
    "image": "/public/images/image-tiramisu-desktop.jpg",
    "name": "Avocado Toast",
    "description": "Creamy, wholesome meal",
    "price": 5.99,
    "quantity": 1
  },
  {
    "id": 8,
    "image": "/public/images/image-waffle-desktop.jpg",
    "name": "Chocolate Brownie",
    "description": "Rich, fudgy dessert",
    "price": 4.25,
    "quantity": 1
  }
]

data.forEach(product => {
  const card = document.createElement("div")
  card.classList.add("card")
  card.setAttribute("card-product-class", product.id)

  card.innerHTML = `
    <figure class="figure">
      <img class="img" src=${product.image} alt=${product.name}>
      <div class="cartButton">
        <img alt="add-to-cart" src="/public/images/icon-add-to-cart.svg">
        <p>Add to cart</p>
      </div>
      <div class="cartButton active">
        <img src="/public/images/icon-decrement-quantity.svg" alt="icon-decrement-quantity" class="decrementButton">
        <p class="quantity">1</p>
        <img src="/public/images/icon-increment-quantity.svg" alt="icon-increment-quantity" class="incrementButton">
      </div>
    </figure>
    <div class="textContainer">
      <p>${product.name}</p>
      <p>${product.description}</p>
      <p>$${product.price}</p>
    </div>
  `
  container.append(card)
  const cartButton = card.querySelector(".cartButton")
  const cartBtnActive = card.querySelector(".cartButton.active")
  const incrementButton = card.querySelector('.incrementButton');
  const decrementButton = card.querySelector('.decrementButton');
  const quantityElement = card.querySelector('.quantity');

  if (cart.some(cartItem => cartItem.id === product.id)) {
    cartBtnActive.style.zIndex = 5;
  }

  const cartItem = cart.find(item => item.id === product.id)
  if (cartItem) {
    cartBtnActive.style.zIndex = 5;
    quantityElement.textContent = cartItem.quantity
  } else {
    quantityElement.textContent = 1
  }

  cartButton.addEventListener("click", () => {
    cartBtnActive.style.zIndex = 5
    addToCart(product)
    renderCart()
    showCartLength()
  })

  let quantity = parseInt(quantityElement.textContent)

  incrementButton.addEventListener('click', () => {
    quantity++;
    quantityElement.textContent = quantity;
    addToCart(product)
  });

  decrementButton.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityElement.textContent = quantity;
      removeFromCart(product)
    } else {
      cartBtnActive.style.zIndex = -1
      removeFromCart(product)
    }
  });

});

function deactivateCartButton(productId) {
  const resId = productId
  const productCard = document.querySelector(`[card-product-class='${resId}']`)
  const cartBtnActive = productCard.querySelector(".cartButton.active")
  cartBtnActive.style.zIndex = -5
}

function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
    cart.reverse()
  }
  localStorage.setItem("cart", JSON.stringify(cart))
  renderCart()
}

function removeFromCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      const index = cart.indexOf(existingItem);
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    renderCart();
  }
}

function renderCart() {
  const nocart = document.querySelector(".nocart")
  const sidebarContent = document.querySelector(".sidebar-content");
  sidebarContent.innerHTML = "";

  cart.forEach((res) => {
    const article = document.createElement("article");
    article.classList.add("sidebar-card");

    article.innerHTML = `
      <img src="${res.image}" alt="${res.name}" class="side-img">
      <p class="side-name">Item name: ${res.name}</p>
      <p class="side-name">Item price: $${res.price}</p>
      <p class="side-name">Item quantity: ${res.quantity}</p>
      <hr class="hr">
      <p class="total">Total: $${(res.price * res.quantity).toFixed(2)}</p>
      <button> Remove ${res.name} </button>
      `;

    sidebarContent.append(article);
    const button = article.querySelector("button")

    button.addEventListener("click", () => {
      const existingItem = cart.find((cartItem) => cartItem.id === res.id);
      if (existingItem) {
        const index = cart.indexOf(existingItem);
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart))
        renderCart()
        showCartLength()
        deactivateCartButton(res.id)
      }
    })
  });

  if (cart.length > 0) {
    const button = document.createElement("button")
    button.classList.add("CO")
    button.textContent = "Confirm Order"
    sidebarContent.append(button)
    button.addEventListener("click", () => {
      const grandTotal = cart.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0);
      document.querySelector(".overallTotal").textContent = `$${grandTotal.toFixed(2)}`
      document.querySelector(".modal").style.display = "flex"
      document.querySelector(".modal").style.zIndex = 10
      document.querySelector(".cancel").addEventListener("click", () => document.querySelector(".modal").style.zIndex = -10)
      const items = document.querySelector(".items")
      items.innerHTML = " "
      cart.forEach(item => {
        const total = item.price * item.quantity.toFixed(2)
        const orderItem = document.createElement("div")
        orderItem.classList.add("item")
        orderItem.innerHTML = `
          <div class="header">
            <img src="${item.image}" alt="${item.name}"/>
            <div class="itemContents">
              <p>${item.name}</p>
              <div>
                <span class="quan">${item.quantity}x</span>   <span>$${item.price}</span>
              </div>
            </div>
          </div>
          <div class="totalOrderPrice">
            <p>$${total.toFixed(2)}</p>
          </div>
        `
        items.append(orderItem)
        console.log(items)
      })
    })
  }

  cart.length > [] ? nocart.style.display = "none" : nocart.style.display = "block"
}
renderCart()

function showCartLength() {
  const heading_length = document.querySelector(".heading_length")
  const cartLength = cart.length
  heading_length.textContent = cartLength
}
showCartLength()

emailjs.init('FuiBXgAJsqo18WcEf');

const form = document.querySelector("#orderForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let cartItems = '';
  cart.forEach((item) => {
    cartItems += `Item: ${item.name}\nPrice: ${item.price}\nQuantity: ${item.quantity}\n\n`;
  });

  let params = {
    name: document.querySelector("#username").value,
    email: document.querySelector("#email").value,
    whatsapp: document.querySelector("#wnumber").value,
    phonenumber: document.querySelector("#pnumber").value,
    cart: cartItems
  }

  emailjs.send('service_1475_shopsphere', 'template_2fbshch', params)
    .then((response) => {
      alert('Your message has been sent successfully!');
    })
    .catch((error) => {
      alert('There was an error sending your message. Please try again.');
      console.error('EmailJS error:', error);
    });

  document.querySelector(".modal").style.display = "none"
  document.querySelector(".modal").style.zIndex = 10
  localStorage.clear();
});