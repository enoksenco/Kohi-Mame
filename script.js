// ===============================
// DATA
// ===============================
const products = [
  // Oppretter en konstant array som inneholder alle produktene

  {
    // Første produktobjekt i arrayen, og de restende følger samme struktur
    id: "umi-latte", // Unik nøkkel for produktet (brukes i logikk/DOM)
    name: "Umi Latte", // Visningsnavn for produktet
    description: "Latte med et hint av havsaltkaramell.", // Beskrivelse av produktet
    price: 69, // Pris i norske kroner
    category: "Japansk", // Kategori produktet tilhører
    image: "images/umiLatte.png", // Bildebane for produktbildet
    favorite: false, // Bolean som styrer hjerteaikonet (favorittstatus)
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

const categoryOrder = ["Japansk", "Nordisk", "Varme", "Kalde"]; // Bestemmer rekkefølgen på kategoriene i menyen

// ===============================
// HJELPERE
// ===============================
const NOK = (
  n // NOK er en formatteringsfunksjon (arrow funksjon)
) =>
  new Intl.NumberFormat("no-NO", {
    // Bruker Intl.NumberFormat for norsk språk
    style: "currency", // Setter stilen til currency (valuta)
    currency: "NOK", // Setter valutaen til norske kroner
    maximumFractionDigits: 0, // Gjør at vi viser hele kroner (ingen desimaler)
  }).format(n); // Kaller .format med tallet n og returnerer f.eks "kr 69"

function sectionIdForCategory(category) {
  // Hjelpefunksjon som oversetter kategorinavn til ID-er brukt på seksjoner
  switch (
    category // Returnerer en streng basert på kategorinavnet for å matche ankere i menyen
  ) {
    case "Japansk":
      return "japansk-inspirerte-drikker";
    case "Nordisk":
      return "nordisk-inspirerte-drikker";
    case "Varme":
      return "varme-drikker";
    case "Kalde":
      return "kalde-drikker";
    default: // Lager en generell ID ved å gjøre om til små bokstaver og erstatte mellomrom med bindestreker
      return category.toLowerCase().replace(/\s+/g, "-");
  }
}

// ===============================
// KURV-STATE (med localStorage)
// ===============================
const cart = { items: {}, count: 0, total: 0 }; // Oppretter et objekt for handlekurven med varer, antall og totalpris

(function loadCart() {
  // En umiddelbart kalt funksjon for å laste inn kurvdata fra localStorage ved oppstart
  try {
    const raw = localStorage.getItem("cart-v1"); // Henter tidligere lagret kurvdata fra localStorage
    if (!raw) return; // Hvis ingen data finnes, avslutter funksjonen
    const data = JSON.parse(raw); // Prøver å parse JSON-strengen til et objekt
    if (data && typeof data === "object") Object.assign(cart, data); // Hvis data er et objekt, kopieres det inn i eksisterende cart-objekt
  } catch {} // try/catch {} fanger og ignorerer eventuelle feil under parsing eller henting
})(); // () på slutten kaller funksjonen umiddelbart
function saveCart() {
  // Funksjon for å lagre gjeldende kurvdata til localStorage
  try {
    localStorage.setItem("cart-v1", JSON.stringify(cart));
  } catch {}
}

function getQty(id) {
  // Henter antall for et gitt produkt-ID fra kurven, eller 0 hvis det ikke er i cart
  return cart.items[id] || 0;
}
function addOne(id) {
  // Legger til en enhet av produktet med gitt ID i kurven
  const p = products.find((x) => x.id === id); // Finner produktet i products-arrayen basert på ID
  if (!p) return; // Hvis produktet ikke finnes, avslutter funksjonen
  cart.items[id] = (cart.items[id] || 0) + 1; // Øker antallet for produktet i cart.items
  cart.count += 1; // Øker totalantallet i kurven
  cart.total += Number(p.price) || 0; // Øker totalprisen i kurven med produktets pris
  saveCart(); // Lagrer den oppdaterte kurven til localStorage
}
function removeOne(id) {
  // Fjerner en enhet av produktet med gitt ID fra kurven
  const p = products.find((x) => x.id === id); // Finner produktet i products-arrayen basert på ID
  if (!p) return; // Hvis produktet ikke finnes, avslutter funksjonen
  const curr = cart.items[id] || 0; // Henter nåværende antall av produktet i kurven
  if (curr <= 0) return; // Hvis antallet er 0 eller mindre, avslutter funksjonen
  cart.items[id] = curr - 1; // Reduserer antallet for produktet i cart.items med 1
  cart.count = Math.max(0, cart.count - 1); // Reduserer totalantallet i kurven, men ikke under 0
  cart.total = Math.max(0, cart.total - (Number(p.price) || 0)); // Reduserer totalprisen i kurven, men ikke under 0
  if (cart.items[id] === 0) delete cart.items[id]; // Fjerner produktet fra cart.items hvis antallet er 0
  saveCart(); // Lagrer den oppdaterte kurven til localStorage
}

function updateOrderBar() {
  // Henter elementene i den flytende bestillingsbaren og oppdaterer innholdet basert på kurvens tilstand
  const bar = document.querySelector(".order-bar"); // Henter bestillingsbar-elementet
  const priceEl = document.querySelector(".order-bar__price"); // Henter pris-elementet i bestillingsbaren
  const labelEl = document.querySelector(".order-bar__label"); // Henter label-elementet i bestillingsbaren
  if (!bar || !priceEl || !labelEl) return; // Hvis noen av elementene mangler, avslutter funksjonen

  const priceText = cart.total > 0 ? NOK(cart.total) : "0 kr"; // Formaterer totalprisen i NOK eller viser "0 kr" hvis totalen er 0
  priceEl.textContent = priceText; // Oppdaterer pris-elementets tekstinnhold
  labelEl.textContent =
    cart.count > 0 ? `Se din bestilling (${cart.count})` : "Se din bestilling"; // Oppdaterer label-elementets tekst basert på antall varer i kurven
  bar.setAttribute("aria-label", `Se din bestilling – ${priceText}`); // Setter talende aria-label på knappen for skjermlesere

  // SKJUL NÅR TOM:
  bar.style.display = cart.count > 0 ? "block" : "none"; // Viser eller skjuler bestillingsbaren basert på om det er varer i kurven
}

// ===============================
// UI: actions-markup
// ===============================
function actionsHTML(id) {
  // Genererer HTML for handlingsknappene (legg til/stepper) basert på antall i kurven
  const qty = getQty(id); // Henter antall for produktet med gitt ID fra kurven
  if (qty <= 0) {
    return `<button class="add-btn" data-id="${id}">Legg til</button>`; // Hvis antallet er 0 eller mindre, returnerer en "Legg til"-knapp
  }
  return ` 
    <div class="stepper" data-id="${id}"> 
      <button class="stepper__btn stepper__minus" aria-label="Fjern én" data-id="${id}">−</button>
      <span class="stepper__qty" aria-live="polite">${qty}</span>
      <button class="stepper__btn stepper__plus" aria-label="Legg til én" data-id="${id}">+</button>
    </div>
  `;
} // Hvis antallet er større enn 0, returnerer en stepper med minus- og plus-knapper samt antall i midten med aria-atributter og data-id for event-delegering

// ===============================
// RENDER MENY
// ===============================
const menu = document.getElementById("menu"); // Referanse til <main id="menu"> i HTML-dokumentet

function renderMenu() {
  // Funksjon for å rendre menyen basert på produktene og deres kategorier
  if (!menu) return; // Hvis meny-elementet ikke finnes, avslutter funksjonen
  menu.innerHTML = ""; // Tømmer menyens innhold før rendering

  categoryOrder.forEach((category) => {
    // Går gjennom hver kategori i den definerte rekkefølgen
    const items = products.filter((p) => p.category === category); // Filtrerer produktene for å få de som tilhører den nåværende kategorien
    if (!items.length) return; // Hvis det ikke finnes produkter i denne kategorien, hopper vi over til neste

    const headingMap = {
      Japansk: "Japansk inspirerte drikker",
      Nordisk: "Nordisk inspirerte drikker",
      Varme: "Varme drikker",
      Kalde: "Kalde",
    };

    const headingText = headingMap[category] ?? `${category} drikker`;
    // Bestemmer overskriftsteksten basert på kategorinavnet

    const section = document.createElement("section"); // Oppretter et nytt seksjonselement for kategorien
    section.id = sectionIdForCategory(category); // Setter ID-en for seksjonen basert på kategorien
    section.innerHTML = ` 
      <h2>${headingText}</h2>
      <div class="product-grid"></div>
    `; // Setter inn overskriften og en tom produktgrid i seksjonen
    const grid = section.querySelector(".product-grid"); // Referanse til produktgrid-elementet i seksjonen

    items.forEach((product) => {
      // Går gjennom hvert produkt i den nåværende kategorien
      const isFav = !!product.favorite; // Sjekker om produktet er merket som favoritt
      const card = document.createElement("article"); // Oppretter et nytt artikkelelement for produktkortet
      card.className = "product-card"; // Setter klassen til produktkortet
      card.dataset.fav = String(isFav); // Setter data-attributtet for favorittstatus

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
      `; // Setter inn produktbildet, favorittknappen, navn, beskrivelse, pris og handlingsknapper i produktkortet
      grid.appendChild(card); // Legger til produktkortet i produktgrid-en
    });

    menu.appendChild(section); // Legger til seksjonen i menyen
  });

  updateOrderBar(); // Oppdaterer bestillingsbaren etter at menyen er rendret
}

// ===============================
// EVENT-DELEGERING
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
      product.favorite ? "Lagt til i favoritter ❤️" : "Fjernet fra favoritter."
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
