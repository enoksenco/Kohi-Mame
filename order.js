/*For å få til overlayet har jeg brukt en guide fra https://www.w3schools.com/howto/howto_css_modals.asp? og https://dev.to/rajatamil/make-pop-up-modal-window-in-vanilla-javascript-4dd2? som inspirasjon*/

// order.js
document.addEventListener("DOMContentLoaded", () => {
  // --------- NAV / BURGERMENY ---------
  const burgerKnapp = document.getElementById("overlay");
  const menyOverlay = document.querySelector(".overlay-content");
  const lukkMenyKnapp = document.getElementById("close-overlay");

  function åpneMeny() {
    if (!menyOverlay) return;
    menyOverlay.style.display = "block";
    menyOverlay.setAttribute("aria-hidden", "false");
    if (burgerKnapp) {
      burgerKnapp.setAttribute("aria-expanded", "true");
    }
  }

  function lukkMeny() {
    if (!menyOverlay) return;
    menyOverlay.style.display = "none";
    menyOverlay.setAttribute("aria-hidden", "true");
    if (burgerKnapp) {
      burgerKnapp.setAttribute("aria-expanded", "false");
    }
  }

  if (burgerKnapp && menyOverlay && lukkMenyKnapp) {
    burgerKnapp.addEventListener("click", åpneMeny);
    lukkMenyKnapp.addEventListener("click", lukkMeny);

    menyOverlay.addEventListener("click", (event) => {
      if (event.target === menyOverlay) {
        lukkMeny();
      }
    });
  }

  // --------- HENTEMÅTE (TA MED / HOS OSS) ---------
  const hentemåteKnapper = document.querySelectorAll(".pickup-btn");
  const hentemåteSlider = document.querySelector(".pickup-slider");

  hentemåteKnapper.forEach((knapp) => {
    knapp.addEventListener("click", () => {
      hentemåteKnapper.forEach((k) => k.classList.remove("is-active"));
      knapp.classList.add("is-active");

      const type = knapp.getAttribute("data-pick");
      if (!hentemåteSlider) return;

      // enkel venstre/høyre animering
      if (type === "take") {
        hentemåteSlider.style.transform = "translateX(0%)";
      } else {
        hentemåteSlider.style.transform = "translateX(100%)";
      }
    });
  });

  // --------- PRODUKTER / SUMMER ---------
  const oppsummeringSumEl = document.getElementById("summary-total-amount");
  const betalingSumEl = document.getElementById("payment-total-amount");
  const rabattInfoEl = document.getElementById("discount-info");

  let aktivRabattkode = null; // f.eks "KAFFE10"

  function hentTallFraPris(tekst) {
    const bareTall = tekst.replace(/[^\d]/g, "");
    return Number(bareTall) || 0;
  }

  function formatPris(beløp) {
    return `${beløp} kr`;
  }

  function hentSubtotal() {
    const linjer = document.querySelectorAll(".product-line");
    let sum = 0;

    linjer.forEach((linje) => {
      const antallEl = linje.querySelector(".product-line-counter p");
      const unitAttr = linje.getAttribute("data-unit-price");

      let enhetspris = 0;

      if (unitAttr) {
        enhetspris = Number(unitAttr);
      } else {
        const prisNode = linje.querySelector(".product-line-price p");
        enhetspris = prisNode ? hentTallFraPris(prisNode.textContent) : 0;
      }

      const antall = antallEl ? Number(antallEl.textContent) || 0 : 0;
      sum += enhetspris * antall;
    });

    return sum;
  }

  function oppdaterSummer() {
    const subtotal = hentSubtotal();
    let rabattBeløp = 0;

    if (aktivRabattkode === "KAFFE10") {
      rabattBeløp = Math.round(subtotal * 0.1);
    } else if (aktivRabattkode === "STUDENT20") {
      rabattBeløp = 20;
    }

    const total = Math.max(subtotal - rabattBeløp, 0);

    if (oppsummeringSumEl) {
      oppsummeringSumEl.textContent = formatPris(total);
    }
    if (betalingSumEl) {
      betalingSumEl.textContent = formatPris(total);
    }

    if (rabattInfoEl) {
      if (rabattBeløp > 0 && aktivRabattkode) {
        rabattInfoEl.textContent =
          `Rabatt (${aktivRabattkode}): -` + formatPris(rabattBeløp);
      } else {
        rabattInfoEl.textContent = "";
      }
    }
  }

  const produktLinjer = document.querySelectorAll(".product-line");

  produktLinjer.forEach((linje) => {
    const antallEl = linje.querySelector(".product-line-counter p");
    const prisEl = linje.querySelector(".product-line-price p");
    const minusKnapp = linje.querySelector('button[data-type="minus"]');
    const plussKnapp = linje.querySelector('button[data-type="plus"]');

    if (!antallEl || !prisEl) return;

    const unitAttr = linje.getAttribute("data-unit-price");
    const enhetspris = unitAttr
      ? Number(unitAttr)
      : hentTallFraPris(prisEl.textContent);

    function settLinjePris(antall) {
      prisEl.textContent = formatPris(enhetspris * antall);
      oppdaterSummer();
    }

    function visSlettValg() {
      linje.innerHTML = `
        <div class="product-delete">
          <p></p>
          <button class="delete-btn">
            <img src="/Assets/ikoner/trash.png" alt="Slett produkt" />
            <span>Slett</span>
          </button>
        </div>
      `;

      const slettKnapp = linje.querySelector(".delete-btn");
      if (!slettKnapp) return;

      slettKnapp.addEventListener("click", () => {
        linje.classList.add("fade-out");
        setTimeout(() => {
          linje.remove();
          oppdaterSummer();
        }, 300);
      });
    }

    if (minusKnapp) {
      minusKnapp.addEventListener("click", () => {
        let antall = Number(antallEl.textContent) || 0;

        if (antall > 1) {
          antall--;
          antallEl.textContent = antall;
          settLinjePris(antall);
        } else {
          // fra 1 → 0: tilby å slette i stedet
          visSlettValg();
          oppdaterSummer();
        }
      });
    }

    if (plussKnapp) {
      plussKnapp.addEventListener("click", () => {
        let antall = Number(antallEl.textContent) || 0;
        antall++;
        antallEl.textContent = antall;
        settLinjePris(antall);
      });
    }
  });

  oppdaterSummer();

  // --------- BETALINGSMÅTE ---------
  const betalingsValg = document.querySelectorAll(".payment-option");

  function markerValgtBetaling() {
    betalingsValg.forEach((valg) => valg.classList.remove("is-selected"));
    const valgtRadio = document.querySelector(
      '.payment-option input[type="radio"]:checked'
    );
    if (!valgtRadio) return;

    const wrapper = valgtRadio.closest(".payment-option");
    if (wrapper) wrapper.classList.add("is-selected");
  }

  betalingsValg.forEach((valg) => {
    const radio = valg.querySelector('input[type="radio"]');
    if (!radio) return;

    valg.addEventListener("click", () => {
      radio.checked = true;
      markerValgtBetaling();
    });

    radio.addEventListener("change", markerValgtBetaling);
  });

  markerValgtBetaling();

  // --------- RABATTKODE ---------
  const rabattSkjema = document.querySelector(".discount form");
  const rabattInput = document.getElementById("discount-code");

  if (rabattSkjema && rabattInput) {
    rabattSkjema.addEventListener("submit", (e) => {
      e.preventDefault();

      const skrevet = rabattInput.value.trim();
      const kode = skrevet.toUpperCase();

      rabattInput.classList.remove("error");

      if (!skrevet) {
        rabattInput.classList.add("error");
        alert("Skriv inn en rabattkode før du trykker Bruk.");
        return;
      }

      if (kode === "KAFFE10" || kode === "STUDENT20") {
        aktivRabattkode = kode;
        alert(`Rabattkode "${kode}" er aktivert.`);
        oppdaterSummer();
      } else {
        aktivRabattkode = null;
        rabattInput.classList.add("error");
        alert("Ugyldig rabattkode.");
        oppdaterSummer();
      }
    });

    rabattInput.addEventListener("input", () => {
      rabattInput.classList.remove("error");
    });
  }

  // --------- SEND BESTILLING ---------
  const sendBestillingKnapp = document.querySelector(
    ".order-submit .primary-button"
  );
  const navnInput = document.getElementById("name");
  const epostInput = document.getElementById("email");
  const mobilInput = document.getElementById("phone");
  const vilkårCheckbox = document.getElementById("terms");

  if (sendBestillingKnapp) {
    sendBestillingKnapp.addEventListener("click", (e) => {
      e.preventDefault();

      if (!navnInput || !epostInput || !mobilInput) return;

      if (!navnInput.value.trim()) {
        alert("Vennligst fyll inn navn.");
        navnInput.focus();
        return;
      }

      if (!epostInput.value.trim()) {
        alert("Vennligst fyll inn e-post.");
        epostInput.focus();
        return;
      }

      if (!mobilInput.value.trim()) {
        alert("Vennligst fyll inn mobilnummer.");
        mobilInput.focus();
        return;
      }

      if (vilkårCheckbox && !vilkårCheckbox.checked) {
        alert("Du må godkjenne vilkårene før du går videre.");
        vilkårCheckbox.focus();
        return;
      }
    });
  }
});
