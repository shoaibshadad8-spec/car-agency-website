const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const searchInput = document.getElementById("searchInput");
const brandSelect = document.getElementById("brandSelect");
const priceSelect = document.getElementById("priceSelect");
const sortSelect = document.getElementById("sortSelect");
const favOnlyBox = document.getElementById("favOnly");
const carsGrid = document.getElementById("carsGrid");
const carsCount = document.getElementById("carsCount");
const carModal = document.getElementById("carModal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

// بيانات السيارات (أمثلة للتجربة)
const cars = [
  { id: 1, name: "تويوتا كورولا", brand: "تويوتا", year: 2024, price: 1100000, type: "سيدان", engine: "1600 سي سي", fuel: "بنزين", seats: 5, desc: "سيارة سيدان عملية ومريحة للاستخدام اليومي والعائلة." },
  { id: 2, name: "هيونداي إلنترا", brand: "هيونداي", year: 2024, price: 950000, type: "سيدان", engine: "1600 سي سي", fuel: "بنزين", seats: 5, desc: "تصميم عصري وتجهيزات كويسة بسعر مناسب." },
  { id: 3, name: "كيا سبورتاج", brand: "كيا", year: 2023, price: 1450000, type: "SUV", engine: "1600 سي سي", fuel: "بنزين", seats: 5, desc: "سيارة دفع رباعي صغيرة بمساحة كبيرة وارتفاع مريح." },
  { id: 4, name: "نيسان صني", brand: "نيسان", year: 2023, price: 620000, type: "سيدان", engine: "1500 سي سي", fuel: "بنزين", seats: 5, desc: "اقتصادية في البنزين ومناسبة للمدينة." },
  { id: 5, name: "شيفروليه أوبترا", brand: "شيفروليه", year: 2022, price: 540000, type: "سيدان", engine: "1600 سي سي", fuel: "بنزين", seats: 5, desc: "خيار اقتصادي بصيانة سهلة وقطع غيار متوفرة." },
  { id: 6, name: "كيا بيكانتو", brand: "كيا", year: 2024, price: 420000, type: "هاتشباك", engine: "1200 سي سي", fuel: "بنزين", seats: 5, desc: "صغيرة وسهلة في الركن، مناسبة لأول سيارة." },
  { id: 7, name: "تويوتا RAV4", brand: "تويوتا", year: 2024, price: 2100000, type: "SUV", engine: "2000 سي سي", fuel: "بنزين", seats: 5, desc: "سيارة SUV كبيرة ومريحة للسفر والرحلات." },
  { id: 8, name: "هيونداي i10", brand: "هيونداي", year: 2023, price: 480000, type: "هاتشباك", engine: "1200 سي سي", fuel: "بنزين", seats: 5, desc: "سيارة صغيرة وعملية بمصروف قليل." },
];

// نسب الفايدة حسب عدد السنين
const rates = { 1: 0.10, 2: 0.18, 3: 0.29, 4: 0.38, 5: 0.49, 7: 0.79 };

let searchText = "";
let brandFilter = "all";
let priceFilter = "all";
let sortBy = "default";
let onlyFav = false;
let favorites = JSON.parse(localStorage.getItem("favCars")) || [];

function formatNumber(num) {
  return Number(num).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

// ملء قايمة الماركات من البيانات
function fillBrands() {
  const brands = [];
  cars.forEach(function (car) {
    if (!brands.includes(car.brand)) {
      brands.push(car.brand);
    }
  });

  brands.forEach(function (brand) {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

function getFilteredCars() {
  const list = cars.filter(function (car) {
    const text = (car.name + car.brand).toLowerCase();

    if (searchText !== "" && !text.includes(searchText)) return false;
    if (brandFilter !== "all" && car.brand !== brandFilter) return false;

    if (priceFilter === "low" && car.price >= 600000) return false;
    if (priceFilter === "mid" && (car.price < 600000 || car.price > 1200000)) return false;
    if (priceFilter === "high" && car.price <= 1200000) return false;

    if (onlyFav && !favorites.includes(car.id)) return false;

    return true;
  });

  if (sortBy === "low") {
    list.sort(function (a, b) { return a.price - b.price; });
  } else if (sortBy === "high") {
    list.sort(function (a, b) { return b.price - a.price; });
  } else if (sortBy === "year") {
    list.sort(function (a, b) { return b.year - a.year; });
  }

  return list;
}

function showCars() {
  const list = getFilteredCars();
  carsGrid.innerHTML = "";
  carsCount.textContent = "عدد النتائج: " + list.length;

  if (list.length === 0) {
    carsGrid.innerHTML = '<p class="empty">مفيش سيارات مطابقة للبحث</p>';
    return;
  }

  list.forEach(function (car) {
    const isFav = favorites.includes(car.id);
    const card = document.createElement("div");
    card.className = "car-card";

    card.innerHTML =
      '<div class="car-img color' + (car.id % 4) + '"><i class="fa-solid fa-car-side"></i></div>' +
      '<div class="car-info">' +
        "<h3>" + car.name + "</h3>" +
        '<p class="car-meta">' + car.type + " · " + car.year + "</p>" +
        '<p class="car-price">' + formatNumber(car.price) + " ج.م</p>" +
        '<div class="car-actions">' +
          '<button class="details-btn" data-action="details" data-id="' + car.id + '">التفاصيل</button>' +
          '<button class="fav-btn ' + (isFav ? "active" : "") + '" data-action="fav" data-id="' + car.id + '">' +
            '<i class="' + (isFav ? "fa-solid" : "fa-regular") + ' fa-heart"></i>' +
          "</button>" +
        "</div>" +
      "</div>";

    carsGrid.appendChild(card);
  });
}

function findCar(id) {
  return cars.find(function (car) {
    return car.id === Number(id);
  });
}

function toggleFav(id) {
  id = Number(id);

  if (favorites.includes(id)) {
    favorites = favorites.filter(function (f) { return f !== id; });
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favCars", JSON.stringify(favorites));
  showCars();
}

function openModal(id) {
  const car = findCar(id);
  if (!car) return;

  modalContent.innerHTML =
    '<div class="car-img color' + (car.id % 4) + '"><i class="fa-solid fa-car-side"></i></div>' +
    '<div class="modal-body">' +
      "<h3>" + car.name + "</h3>" +
      "<p>" + car.desc + "</p>" +
      '<div class="specs">' +
        "<div><span>الماركة</span>" + car.brand + "</div>" +
        "<div><span>الموديل</span>" + car.year + "</div>" +
        "<div><span>النوع</span>" + car.type + "</div>" +
        "<div><span>المحرك</span>" + car.engine + "</div>" +
        "<div><span>الوقود</span>" + car.fuel + "</div>" +
        "<div><span>عدد المقاعد</span>" + car.seats + "</div>" +
      "</div>" +
      '<p class="car-price">' + formatNumber(car.price) + " ج.م</p>" +
      '<button class="details-btn" data-action="calc" data-id="' + car.id + '">احسب قسط السيارة دي</button>' +
    "</div>";

  carModal.classList.add("open");
}

function closeModal() {
  carModal.classList.remove("open");
}

// نبعت سعر السيارة للحاسبة
function useInCalculator(id) {
  const car = findCar(id);
  if (!car) return;

  document.getElementById("carPrice").value = car.price;
  document.getElementById("depositAmount").value = Math.round(car.price * 0.25);

  closeModal();
  calculate();
  document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
}

/* ===== الحاسبة ===== */
function calculate() {
  const price = Number(document.getElementById("carPrice").value);
  const deposit = Number(document.getElementById("depositAmount").value);
  const years = Number(document.getElementById("durationYears").value);
  const errorBox = document.getElementById("calcError");

  errorBox.textContent = "";

  if (price <= 0) {
    errorBox.textContent = "اكتب سعر السيارة";
    return;
  }

  if (deposit < 0) {
    errorBox.textContent = "المقدم مينفعش يكون بالسالب";
    return;
  }

  if (deposit >= price) {
    errorBox.textContent = "المقدم لازم يكون أقل من سعر السيارة";
    return;
  }

  const loanAmount = price - deposit;
  const profitRate = rates[years];

  const totalProfit = loanAmount * profitRate;
  const netTotal = loanAmount + totalProfit;
  const totalMonths = years * 12;
  const monthlyPayment = netTotal / totalMonths;

  document.getElementById("outLoan").textContent = formatNumber(loanAmount);
  document.getElementById("outRate").textContent = Math.round(profitRate * 100) + "%";
  document.getElementById("outProfit").textContent = formatNumber(totalProfit);
  document.getElementById("outTotal").textContent = formatNumber(netTotal);
  document.getElementById("outMonths").textContent = totalMonths;
  document.getElementById("outMonthly").textContent = monthlyPayment.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  document.getElementById("summaryPanel").style.display = "block";
}

function clearData() {
  document.getElementById("carPrice").value = "";
  document.getElementById("depositAmount").value = "";
  document.getElementById("calcError").textContent = "";
  document.getElementById("summaryPanel").style.display = "none";
}

/* ===== فورم التواصل ===== */
function sendForm(e) {
  e.preventDefault();

  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const message = document.getElementById("userMessage").value.trim();
  const errorBox = document.getElementById("formError");
  const successBox = document.getElementById("formSuccess");

  errorBox.textContent = "";
  successBox.textContent = "";

  if (name.length < 3) {
    errorBox.textContent = "اكتب اسمك (3 حروف على الأقل)";
    return;
  }

  // رقم موبايل مصري: 11 رقم ويبدأ بـ 01
  if (!/^01[0-9]{9}$/.test(phone)) {
    errorBox.textContent = "رقم الموبايل غير صحيح";
    return;
  }

  if (message.length < 5) {
    errorBox.textContent = "اكتب رسالتك";
    return;
  }

  successBox.textContent = "تم إرسال رسالتك يا " + name + "، هنتواصل معاك قريب.";
  document.getElementById("contactForm").reset();
}

/* ===== الأحداث ===== */
menuBtn.addEventListener("click", function () {
  nav.classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach(function (link) {
  link.addEventListener("click", function () {
    nav.classList.remove("open");
  });
});

searchInput.addEventListener("input", function () {
  searchText = searchInput.value.trim().toLowerCase();
  showCars();
});

brandSelect.addEventListener("change", function () {
  brandFilter = brandSelect.value;
  showCars();
});

priceSelect.addEventListener("change", function () {
  priceFilter = priceSelect.value;
  showCars();
});

sortSelect.addEventListener("change", function () {
  sortBy = sortSelect.value;
  showCars();
});

favOnlyBox.addEventListener("change", function () {
  onlyFav = favOnlyBox.checked;
  showCars();
});

carsGrid.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.action === "details") openModal(btn.dataset.id);
  if (btn.dataset.action === "fav") toggleFav(btn.dataset.id);
});

modalContent.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (btn && btn.dataset.action === "calc") useInCalculator(btn.dataset.id);
});

modalClose.addEventListener("click", closeModal);

carModal.addEventListener("click", function (e) {
  if (e.target === carModal) closeModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

document.getElementById("calcBtn").addEventListener("click", calculate);
document.getElementById("resetBtn").addEventListener("click", clearData);
document.getElementById("contactForm").addEventListener("submit", sendForm);

fillBrands();
showCars();
