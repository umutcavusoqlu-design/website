/* ============================================================
   lang.js — Dil değiştirme sistemi (EN / TR)
   Nasıl çalışır:
   - HTML'deki her metin elemanına data-en ve data-tr özelliği eklenir
   - Bu dosya, aktif dile göre tüm metinleri değiştirir
   - Seçilen dil tarayıcıya kaydedilir (localStorage), sayfa
     yenilendiğinde veya başka sayfaya geçildiğinde hatırlanır
   ============================================================ */

/* Sayfa yüklendiğinde çalıştır */
document.addEventListener("DOMContentLoaded", function () {
  /* Kaydedilmiş dili oku, yoksa varsayılan İngilizce */
  var savedLang = localStorage.getItem("rau-lang") || "en";
  applyLanguage(savedLang);
  updateButtons(savedLang);
});

/* Dili uygula: tüm data-en / data-tr özellikli elemanları güncelle */
function applyLanguage(lang) {
  var elements = document.querySelectorAll("[data-en]");
  elements.forEach(function (el) {
    /* Elemanın içeriği HTML (örn. <br> içeriyorsa) mi düz metin mi? */
    if (el.hasAttribute("data-html")) {
      el.innerHTML = el.getAttribute("data-" + lang);
    } else {
      el.textContent = el.getAttribute("data-" + lang);
    }
  });

  /* Placeholder metinleri de değiştir (input alanları için) */
  var placeholders = document.querySelectorAll("[data-placeholder-en]");
  placeholders.forEach(function (el) {
    el.placeholder = el.getAttribute("data-placeholder-" + lang);
  });

  /* <html> etiketinin lang özelliğini güncelle (erişilebilirlik için) */
  document.documentElement.lang = lang;

  /* Seçimi kaydet */
  localStorage.setItem("rau-lang", lang);
}

/* EN / TR butonlarının aktif görünümünü güncelle */
function updateButtons(lang) {
  var enBtn = document.getElementById("lang-en");
  var trBtn = document.getElementById("lang-tr");
  if (!enBtn || !trBtn) return;

  if (lang === "en") {
    enBtn.classList.add("active");
    trBtn.classList.remove("active");
  } else {
    trBtn.classList.add("active");
    enBtn.classList.remove("active");
  }
}

/* Dil butonuna tıklandığında çağrılan fonksiyon */
function switchLang(lang) {
  applyLanguage(lang);
  updateButtons(lang);
}
