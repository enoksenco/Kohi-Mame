// ===============================
// DATA (du kan bruke dine egne)
// ===============================
const products = [
  {
    id: "umi-latte",
    name: "Umi Latte",
    description: "Latte med et hint av havsaltkaramell.",
    price: 69,
    category: "Japansk",
    image: "images/umiLatte.png",
    favorite: false,
  },
  {
    id: "matcha-mame",
    name: "Matcha Mame",
    description: "Mild matcha latte med kaffebase.",
    price: 69,
    category: "Japansk",
    image: "images/matchaMame.png",
    favorite: false,
  },
  {
    id: "matcha-usucha",
    name: "Matcha Usucha",
    description: "Lett, skummende matcha, tradisjonelt vispet.",
    price: 69,
    category: "Japansk",
    image: "images/matchaUsucha.png",
    favorite: false,
  },
  {
    id: "sakura-cha",
    name: "Sakura Cha",
    description: "Grønn te med syllede kirsebærblomster.",
    price: 69,
    category: "Japansk",
    image: "images/sakuraCha.png",
    favorite: false,
  },

  {
    id: "midnattsol",
    name: "Midnattsol",
    description: "Latte med kardemomme og honning.",
    price: 69,
    category: "Nordisk",
    image: "images/midnattsol.png",
    favorite: false,
  },
  {
    id: "isbre-tonic",
    name: "Isbre Tonic",
    description: "Espresso med tonic og sitrus.",
    price: 69,
    category: "Nordisk",
    image: "images/isbreTonic.png",
    favorite: false,
  },
  {
    id: "nordlys-infusjon",
    name: "Nordlys Infusjon",
    description: "Urte-te med kamille, mynte og lavendel.",
    price: 69,
    category: "Nordisk",
    image: "images/nordlysInfusjon.png",
    favorite: false,
  },
  {
    id: "rabarbra-fizz",
    name: "Rabarbra Fizz",
    description: "Perlende drikk med rabarbra og sitron.",
    price: 69,
    category: "Nordisk",
    image: "images/rabarbraFizz.png",
    favorite: false,
  },

  {
    id: "americano",
    name: "Americano",
    description: "Svart kaffe laget ved å tilsette varmt vann til espresso.",
    price: 49,
    category: "Varme",
    image: "images/americano.png",
    favorite: false,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Espresso med like deler steamet melk og melkeskum.",
    price: 49,
    category: "Varme",
    image: "images/cappuccino.png",
    favorite: false,
  },
  {
    id: "flat-white",
    name: "Flat white",
    description: "Silkemyk espresso med tynn, kremet melk.",
    price: 49,
    category: "Varme",
    image: "images/flatWhite.png",
    favorite: false,
  },
  {
    id: "haven-blend",
    name: "Haven blend",
    description: "En myk latte med hint av ristet bygg og vanilje.",
    price: 49,
    category: "Varme",
    image: "images/havenBlend.png",
    favorite: false,
  },

  {
    id: "iced-latte",
    name: "Iced latte",
    description: "Espresso med kald melk og isbiter.",
    price: 49,
    category: "Kalde",
    image: "images/icedLatte.png",
    favorite: false,
  },
  {
    id: "cold-brew",
    name: "Cold brew",
    description: "Langsomt kaldbrygget, mild og rund.",
    price: 49,
    category: "Kalde",
    image: "images/coldBrew.png",
    favorite: false,
  },
  {
    id: "iced-americano",
    name: "Iced americano",
    description: "Espresso toppet med kaldt vann og is.",
    price: 49,
    category: "Kalde",
    image: "images/icedAmericano.png",
    favorite: false,
  },
  {
    id: "kiri-mist",
    name: "Kiri mist",
    description: "Kald drikk med yuzu og epleblomst.",
    price: 49,
    category: "Kalde",
    image: "images/kiriMist.png",
    favorite: false,
  },
];

const categoryOrder = ["Japansk", "Nordisk", "Varme", "Kalde"];

// ===============================
// HJELPERE
// ===============================
const NOK = (n) =>
  new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(n);

function sectionIdForCategory(category) {
  switch (category) {
    case "Japansk":
      return "japansk-inspirerte-drikker";
    case "Nordisk":
      return "nordisk-inspirerte-drikker";
    case "Varme":
      return "varme-drikker";
    case "Kalde":
      return "kalde-drikker";
    default:
      return category.toLowerCase().replace(/\s+/g, "-");
  }
}

// ===============================
// KURV-STATE (med localStorage)
// ===============================
const cart = { items: {}, count: 0, total: 0 };

(function loadCart() {
  try {
    const raw = localStorage.getItem("cart-v1");
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data && typeof data === "object") Object.assign(cart, data);
  } catch {}
})();
function saveCart() {
  try {
    localStorage.setItem("cart-v1", JSON.stringify(cart));
  } catch {}
}

function getQty(id) {
  return cart.items[id] || 0;
}
function addOne(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  cart.items[id] = (cart.items[id] || 0) + 1;
  cart.count += 1;
  cart.total += Number(p.price) || 0;
  saveCart();
}
function removeOne(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  const curr = cart.items[id] || 0;
  if (curr <= 0) return;
  cart.items[id] = curr - 1;
  cart.count = Math.max(0, cart.count - 1);
  cart.total = Math.max(0, cart.total - (Number(p.price) || 0));
  if (cart.items[id] === 0) delete cart.items[id];
  saveCart();
}

function updateOrderBar() {
  const bar = document.querySelector(".order-bar");
  const priceEl = document.querySelector(".order-bar__price");
  const labelEl = document.querySelector(".order-bar__label");
  if (!bar || !priceEl || !labelEl) return;

  const priceText = cart.total > 0 ? NOK(cart.total) : "0 kr";
  priceEl.textContent = priceText;
  labelEl.textContent =
    cart.count > 0 ? `Se din bestilling (${cart.count})` : "Se din bestilling";
  bar.setAttribute("aria-label", `Se din bestilling – ${priceText}`);

  // SKJUL NÅR TOM:
  bar.style.display = cart.count > 0 ? "block" : "none";
}

// ===============================
// UI: actions-markup
// ===============================
function actionsHTML(id) {
  const qty = getQty(id);
  if (qty <= 0) {
    return `<button class="add-btn" data-id="${id}">Legg til</button>`;
  }
  return `
    <div class="stepper" data-id="${id}">
      <button class="stepper__btn stepper__minus" aria-label="Fjern én" data-id="${id}">−</button>
      <span class="stepper__qty" aria-live="polite">${qty}</span>
      <button class="stepper__btn stepper__plus" aria-label="Legg til én" data-id="${id}">+</button>
    </div>
  `;
}

// ===============================
// RENDER MENY
// ===============================
const menu = document.getElementById("menu");

function renderMenu() {
  if (!menu) return;
  menu.innerHTML = "";

  categoryOrder.forEach((category) => {
    const items = products.filter((p) => p.category === category);
    if (!items.length) return;

    const headingText =
      category === "Japansk"
        ? "Japansk inspirerte drikker"
        : category === "Nordisk"
        ? "Nordisk inspirerte drikker"
        : `${category} drikker`;

    const section = document.createElement("section");
    section.id = sectionIdForCategory(category);
    section.innerHTML = `
      <h2>${headingText}</h2>
      <div class="product-grid"></div>
    `;
    const grid = section.querySelector(".product-grid");

    items.forEach((product) => {
      const isFav = !!product.favorite;
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.fav = String(isFav);

      card.innerHTML = `
        <figure class="product-img">
          <img src="${product.image}" alt="${product.name}" />
          <button class="fav-btn ${isFav ? "is-fav" : ""}" data-id="${
        product.id
      }" aria-pressed="${
        isFav ? "true" : "false"
      }" title="Favoritt" aria-label="Legg til som favoritt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="bi bi-heart-fill" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
            </svg>
          </button>
        </figure>

        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>

        <div class="product-footer">
          <span class="price">${product.price} kr</span>
          <div class="footer-actions" data-actions="${product.id}">
            ${actionsHTML(product.id)}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    menu.appendChild(section);
  });

  updateOrderBar();
}

// ===============================
// EVENT-DELEGERING (robust når UI byttes)
// ===============================
menu?.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-btn");
  const plusBtn = e.target.closest(".stepper__plus");
  const minusBtn = e.target.closest(".stepper__minus");
  const favBtn = e.target.closest(".fav-btn");

  if (addBtn) {
    const id = addBtn.dataset.id;
    addOne(id);
    refreshActions(id);
    updateOrderBar();
  }
  if (plusBtn) {
    const id = plusBtn.dataset.id;
    addOne(id);
    refreshActions(id);
    updateOrderBar();
  }
  if (minusBtn) {
    const id = minusBtn.dataset.id;
    removeOne(id);
    refreshActions(id);
    updateOrderBar();
  }
  if (favBtn) {
    const id = favBtn.dataset.id;
    const product = products.find((p) => p.id === id);
    if (!product) return;
    product.favorite = !product.favorite;
    favBtn.classList.toggle("is-fav", product.favorite);
    favBtn.setAttribute("aria-pressed", product.favorite ? "true" : "false");
    alert(
      product.favorite ? "Lagt til i favoritter!" : "Fjernet fra favoritter."
    );
  }
});

function refreshActions(id) {
  const actions = document.querySelector(
    `.footer-actions[data-actions="${id}"]`
  );
  if (!actions) return;
  actions.innerHTML = actionsHTML(id);
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  // Order-bar click (valgfritt)
  document.querySelector(".order-bar")?.addEventListener("click", () => {
    // Åpne handlekurv / gå til checkout
  });
});
