const stepData = [
  {
    icon: "🎟️",
    title: "Gyors jegyvásárlás",
    desc: "Válasszon jegyet indulási és érkezési állomás között mindössze 3 kattintással. Azonnali visszaigazolás e-mailben és SMS-ben.",
  },
  {
    icon: "🛡️",
    title: "Késési biztosítás",
    desc: "Automatikus kártérítés már 5 perc késés esetén is. A rendszer mindent intéz Ön helyett.",
  },
  {
    icon: "📱",
    title: "Könnyed használat",
    desc: "Mobilbarát felület, egyszerű és intuitív kezelőfelület. Regisztráció nélkül is használható.",
  },
  {
    icon: "⚡",
    title: "Gyorsabb betöltés",
    desc: "Optimalizált oldal, amely minden eszközön és hálózaton villámgyorsan betöltődik.",
  },
];

let currentStep = 0;
const cycleTime = 6500;
let timerInterval = null;

function activateStep(index) {
  const steps = document.querySelectorAll(".step");
  if (!steps.length) return; // Ha nem a főoldalon vagyunk

  steps.forEach((step) => step.classList.remove("active"));
  const activeStep = document.querySelector(`.step[data-step="${index + 1}"]`);
  if (activeStep) activeStep.classList.add("active");

  const iconEl = document.getElementById("dynamic-icon");
  const titleEl = document.getElementById("dynamic-title");
  const descEl = document.getElementById("dynamic-desc");

  if (iconEl) iconEl.textContent = stepData[index].icon;
  if (titleEl) titleEl.textContent = stepData[index].title;
  if (descEl) descEl.textContent = stepData[index].desc;

  currentStep = index;

  const progress = document.getElementById("main-progress");
  if (progress) {
    progress.style.transition = "none";
    progress.style.width = "0%";
    setTimeout(() => {
      progress.style.transition = `width ${cycleTime}ms linear`;
      progress.style.width = "100%";
    }, 50);
  }
}

function startAutoCycle() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    let next = (currentStep + 1) % stepData.length;
    activateStep(next);
  }, cycleTime);
}

// Inicializálás betöltéskor
window.onload = () => {
  // Csak ha a főoldalon (index.html) vagyunk, indítjuk az animációt
  if (document.querySelector(".step")) {
    activateStep(0);
    startAutoCycle();

    document.querySelectorAll(".step").forEach((step, index) => {
      step.addEventListener("click", () => {
        clearInterval(timerInterval);
        activateStep(index);
        startAutoCycle();
      });
    });
  }
};

// Hírek adatai (ezt bővítheted)
const newsContent = {
  0: {
    title: "Tavaszi menetrendi változások",
    img: "https://picsum.photos/id/1033/600/300",
    text: "Részletes tájékoztató: Március 1-től a Budapest-Győr vonalon reggelente 10 perccel sűrűbben járnak a vonatok. A délutáni időszakban az InterCity járatok plusz kocsikkal közlekednek a megnövekedett utasforgalom miatt."
  },
  1: {
    title: "Pályakarbantartás a Nyugati vonalán",
    img: "https://picsum.photos/id/1070/600/300",
    text: "Figyelem! A hétvégi karbantartás érinti a Nyugati pályaudvarról induló összes zónázó vonatot. Kérjük, használják a kijelölt pótlóbuszokat, amelyek a vasútállomás melletti parkolóból indulnak."
  },
  2: {
    title: "Megújult a VÁM applikáció",
    img: "https://picsum.photos/id/119/600/300",
    text: "Az új 2.0-ás verzióban elérhetővé vált az Apple Pay és Google Pay fizetés, valamint mostantól élő térképen követheti a vonatok pontos helyzetét és esetleges késését."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("news-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.querySelector(".close-modal");

  // Az összes "Elolvasom" gomb megkeresése
  document.querySelectorAll('.read-more').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = newsContent[index];
      
      // Tartalom összeállítása
      modalBody.innerHTML = `
        <img src="${data.img}" alt="Hír kép">
        <h2>${data.title}</h2>
        <p>${data.text}</p>
        <button class="dynamic-btn" style="margin-top:20px; width:100%" onclick="document.getElementById('news-modal').style.display='none'">Bezárás</button>
      `;
      
      modal.style.display = "block";
    });
  });

  // Bezárás gombra vagy a modál mellé kattintva
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
  };
});

// Új tartalom az ajánlatokhoz
const offerContent = {
  0: {
    title: "Országbérlet és Vármegyebérlet",
    img: "https://picsum.photos/id/15/600/300",
    text: "Az Országbérlettel Magyarország teljes területén, a Vármegyebérlettel pedig az adott vármegyében utazhat korlátlanul a MÁV-START, a Volánbusz, a MÁV-HÉV és a GYSEV járatain. A teljes árú bérletek mellett a nappali és esti tagozatos diákok 90%-os kedvezménnyel válthatják ki bérleteiket."
  },
  1: {
    title: "Kerékpárszállítási szabályok",
    img: "https://picsum.photos/id/250/600/300",
    text: "Kerékpár csak az arra kijelölt kocsikban vagy a peronon szállítható, amennyiben nem zavarja az utasforgalmat. Bizonyos vonatokon (pl. InterCity) kerékpárhelyfoglalás is kötelező. A kerékpárjegy ára a megtett távolságtól függ, de váltható Kerékpár Országbérlet is."
  },
  2: {
    title: "Kisállat szállítás",
    img: "https://picsum.photos/id/237/600/300",
    text: "Kistestű állatok zárt hordozóban díjmentesen szállíthatók. Kutyák pórázon és szájkosárral, élőállat-jegy megváltása mellett utazhatnak. Egy utas maximum két kutyát vihet magával. Kérjük, mindig tartsa be a higiéniai és biztonsági előírásokat!"
  }
};

// Ezt a részt a DOMContentLoaded-en belülre tedd (a hírek kezelője mellé):
document.querySelectorAll('.offer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById("news-modal");
    const modalBody = document.getElementById("modal-body");
    const index = btn.getAttribute('data-index');
    const data = offerContent[index];

    modalBody.innerHTML = `
      <img src="${data.img}" alt="Ajánlat kép">
      <h2>${data.title}</h2>
      <p>${data.text}</p>
      <button class="dynamic-btn" style="margin-top:20px; width:100%" onclick="document.getElementById('news-modal').style.display='none'">Bezárás</button>
    `;
    modal.style.display = "block";
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const loginTrigger = document.getElementById('login-trigger');
  const loginDropdown = document.getElementById('login-dropdown');

  if (loginTrigger && loginDropdown) {
    loginTrigger.addEventListener('click', (e) => {
      e.stopPropagation(); // Megakadályozza, hogy az esemény továbbmenjen a window-ra
      loginDropdown.classList.toggle('active');
    });

    // Bezárás, ha máshová kattintasz az oldalon
    window.addEventListener('click', (e) => {
      if (!loginDropdown.contains(e.target) && e.target !== loginTrigger) {
        loginDropdown.classList.remove('active');
      }
    });
  }
});