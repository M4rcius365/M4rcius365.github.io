// Martynas Siaurys – kontaktų forma ir atminties kortelių žaidimas

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
  initMemoryGame();
});

/* ----------------------------------------------------------
   KONTAKTŲ FORMA
---------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const resultBox = document.querySelector("#form-result");
  const submitBtn = form.querySelector('button[type="submit"]');

  const fields = {
    firstName: form.querySelector("#firstName"),
    lastName: form.querySelector("#lastName"),
    email: form.querySelector("#email"),
    phone: form.querySelector("#phone"),
    address: form.querySelector("#address"),
    q1: form.querySelector("#question1"),
    q2: form.querySelector("#question2"),
    q3: form.querySelector("#question3"),
  };

  function setFieldError(input, message) {
    const group =
      input.closest(".form-group") ||
      input.closest(".col-md-6") ||
      input.closest(".col-12");

    const msgEl = group ? group.querySelector(".field-error") : null;

    if (message) {
      input.classList.add("is-invalid");
      if (msgEl) msgEl.textContent = message;
    } else {
      input.classList.remove("is-invalid");
      if (msgEl) msgEl.textContent = "";
    }
  }

  const nameRegex =
    /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s-]+$/;

  function validateName(input) {
    const value = input.value.trim();
    if (!value) return "Laukas negali būti tuščias";
    if (!nameRegex.test(value)) return "Naudok tik raides";
    return "";
  }

  function validateEmail(input) {
    const value = input.value.trim();
    if (!value) return "Įvesk el. paštą";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return "Neteisingas el. pašto formatas";
    return "";
  }

  function validateAddress(input) {
    const value = input.value.trim();
    if (!value) return "Įvesk adresą";
    return "";
  }

  function validateRating(input) {
    const value = input.value.trim();
    if (!value) return "Įvesk įvertinimą (1–10)";
    const num = Number(value);
    if (Number.isNaN(num) || num < 1 || num > 10) {
      return "Skaičius turi būti tarp 1 ir 10";
    }
    return "";
  }

  // ----- Telefonas: +370 6xx xxxxx -----

  function getPhoneDigits(input) {
    let digits = input.value.replace(/\D/g, "");

    if (digits.startsWith("370")) {
      digits = digits.slice(3);
    }

    digits = digits.slice(0, 8); // 6xx xxxxx
    return digits;
  }

  function formatLithuanianPhone(input) {
    const digits = getPhoneDigits(input);

    if (!digits.length) {
      input.value = "";
      return digits;
    }

    let formatted = "+370";

    if (digits.length >= 1) {
      formatted += " " + digits[0];
    }
    if (digits.length >= 2) {
      formatted += digits.slice(1, 3);
    }
    if (digits.length >= 4) {
      formatted += " " + digits.slice(3);
    }

    input.value = formatted;
    return digits;
  }

  function validatePhone(input) {
    const digits = formatLithuanianPhone(input);

    if (!digits.length) return "Įvesk telefono numerį";
    if (digits.length !== 8) return "Numeris turi būti 8 skaitmenų";
    if (digits[0] !== "6") return "Numeris turi prasidėti skaitmeniu 6";
    return "";
  }

  // ----- Bendra validacija -----

  function validateField(name) {
    const input = fields[name];
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        error = validateName(input);
        break;
      case "email":
        error = validateEmail(input);
        break;
      case "address":
        error = validateAddress(input);
        break;
      case "phone":
        error = validatePhone(input);
        break;
      case "q1":
      case "q2":
      case "q3":
        error = validateRating(input);
        break;
    }

    setFieldError(input, error);
    return !error;
  }

  function validateAllFields() {
    let ok = true;
    Object.keys(fields).forEach((name) => {
      if (!validateField(name)) ok = false;
    });
    return ok;
  }

  function updateSubmitState() {
    submitBtn.disabled = !validateAllFields();
  }

  Object.keys(fields).forEach((name) => {
    const input = fields[name];

    if (name === "phone") {
      input.addEventListener("input", () => {
        validateField("phone");
        updateSubmitState();
      });
    } else {
      input.addEventListener("input", () => {
        validateField(name);
        updateSubmitState();
      });
    }
  });

  submitBtn.disabled = true;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      updateSubmitState();
      return;
    }

    const data = {
      firstName: fields.firstName.value.trim(),
      lastName: fields.lastName.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      address: fields.address.value.trim(),
      q1: Number(fields.q1.value),
      q2: Number(fields.q2.value),
      q3: Number(fields.q3.value),
    };

    console.log("Kontaktų formos duomenys:", data);

    const avg = ((data.q1 + data.q2 + data.q3) / 3).toFixed(1);

    if (resultBox) {
      resultBox.innerHTML = `
        <div class="profile-card contact-result-card">
          <p>Vardas: <strong>${data.firstName}</strong></p>
          <p>Pavardė: <strong>${data.lastName}</strong></p>
          <p>El. paštas: <strong>${data.email}</strong></p>
          <p>Tel. numeris: <strong>${data.phone}</strong></p>
          <p>Adresas: <strong>${data.address}</strong></p>
          <p>Klausimų įverčiai: ${data.q1}, ${data.q2}, ${data.q3}</p>
          <p><strong>${data.firstName} ${data.lastName}: vidurkis ${avg}</strong></p>
        </div>
      `;
    }

    alert("Duomenys pateikti sėkmingai!");
  });
}

/* ----------------------------------------------------------
   ATMINTIES KORTELIŲ ŽAIDIMAS
---------------------------------------------------------- */
function initMemoryGame() {
  const board = document.querySelector("#game-board");
  const difficultySelect = document.querySelector("#game-difficulty");
  const startBtn = document.querySelector("#game-start");
  const resetBtn = document.querySelector("#game-reset");
  const movesEl = document.querySelector("#game-moves");
  const matchesEl = document.querySelector("#game-matches");
  const timeEl = document.querySelector("#game-time");
  const messageEl = document.querySelector("#game-message");
  const bestEasyEl = document.querySelector("#best-easy");
  const bestHardEl = document.querySelector("#best-hard");

  if (!board || !difficultySelect) return;

  const symbols = [
    "⚡",
    "🌍",
    "💡",
    "🔌",
    "🔋",
    "⚙️",
    "🌱",
    "🚗",
    "📡",
    "💻",
    "📘",
    "🛰️",
  ];

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let totalPairs = 0;

  let currentDifficulty = "easy";
  let seconds = 0;
  let timerId = null;
  let gameStarted = false;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getSymbolsForDifficulty(diff) {
    if (diff === "easy") {
      totalPairs = 6; // 4x3
      return symbols.slice(0, 6);
    } else {
      totalPairs = 12; // 6x4
      return symbols.slice(0, 12);
    }
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateStatsUI() {
    movesEl.textContent = moves;
    matchesEl.textContent = `${matches} / ${totalPairs}`;
    timeEl.textContent = formatTime(seconds);
  }

  function loadBestResults() {
    const bestEasy = localStorage.getItem("memoryBest_easy");
    const bestHard = localStorage.getItem("memoryBest_hard");

    bestEasyEl.textContent = bestEasy ? `${bestEasy} ėjimai` : "–";
    bestHardEl.textContent = bestHard ? `${bestHard} ėjimai` : "–";
  }

  function saveBestResult() {
    const key =
      currentDifficulty === "easy"
        ? "memoryBest_easy"
        : "memoryBest_hard";

    const stored = localStorage.getItem(key);
    if (!stored || moves < Number(stored)) {
      localStorage.setItem(key, String(moves));
    }
    loadBestResults();
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    seconds = 0;
    updateStatsUI();

    timerId = setInterval(() => {
      seconds++;
      timeEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function resetSelection() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function handleWin() {
    stopTimer();
    gameStarted = false;
    messageEl.textContent = `Laimėjote! Ėjimai: ${moves}, laikas: ${formatTime(
      seconds
    )}`;
    saveBestResult();
  }

  function onCardClick(e) {
    const card = e.currentTarget;

    if (!gameStarted) return;
    if (lockBoard) return;
    if (card.classList.contains("matched")) return;
    if (card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;
    moves++;
    movesEl.textContent = moves;

    const isMatch =
      firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matches++;
      matchesEl.textContent = `${matches} / ${totalPairs}`;
      resetSelection();

      if (matches === totalPairs) {
        handleWin();
      }
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetSelection();
      }, 1000);
    }
  }

  function createCard(symbol) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.dataset.symbol = symbol;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front"></div>
        <div class="card-face card-back">${symbol}</div>
      </div>
    `;
    card.addEventListener("click", onCardClick);
    return card;
  }

  function buildBoard() {
    const diff = currentDifficulty;
    const set = getSymbolsForDifficulty(diff);
    const cardsData = shuffle([...set, ...set]); // poros

    board.innerHTML = "";
    board.classList.remove("easy-grid", "hard-grid");
    board.classList.add(diff === "easy" ? "easy-grid" : "hard-grid");

    cardsData.forEach((symbol) => {
      const card = createCard(symbol);
      board.appendChild(card);
    });
  }

  function resetGame(startTimerImmediately) {
    stopTimer();
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matches = 0;
    messageEl.textContent = "";
    updateStatsUI();
    buildBoard();

    if (startTimerImmediately) {
      gameStarted = true;
      startTimer();
    } else {
      gameStarted = false;
    }
  }

  // mygtukai ir įvykiai

  startBtn.addEventListener("click", () => {
    currentDifficulty = difficultySelect.value;
    resetGame(true); // naujas žaidimas ir startuoja laikmatis
  });

  resetBtn.addEventListener("click", () => {
    resetGame(true); // atnaujina ir iškart paleidžia iš naujo
  });

  difficultySelect.addEventListener("change", () => {
    currentDifficulty = difficultySelect.value;
    resetGame(false); // paruošia naują lentą, bet laikmatis startuos tik kai paspaus Start
  });

  // inicialiai – lenta pagal default sudėtingumą, be veikiančio laikmačio
  loadBestResults();
  resetGame(false);
}