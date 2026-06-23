/* ============================================================
   main.js — Genel site davranışları
   - Mobil menü açma/kapama
   - Sayfa kaydırıldığında header'ın arka planını koyulaştırma
   - Sayfa içi animasyonlar (elemanlar görünüme girince belirir)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- MOBİL MENÜ ----------
     Küçük ekranlarda hamburger (☰) ikonuna tıklanınca
     navigasyon menüsü açılır/kapanır                     */
  var menuToggle = document.getElementById("menu-toggle");
  var navLinks   = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      /* İkon değişimi: ☰ açıkken ✕ göster */
      menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
    });

    /* Menüdeki bir linke tıklanınca menüyü kapat */
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.textContent = "☰";
      });
    });
  }

  /* ---------- HEADER SCROLL ETKİSİ ----------
     Kullanıcı sayfayı aşağı kaydırdığında header
     biraz daha koyu ve gölgeli olur                */
  var header = document.getElementById("main-header");
  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  /* ---------- GÖRÜNÜME GİRİNCE BELİR ANİMASYONU ----------
     data-animate özelliği olan elemanlar, ekrana girince
     "visible" sınıfı alır ve CSS ile yavaşça belirir       */
  var animElements = document.querySelectorAll("[data-animate]");

  if (animElements.length > 0 && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); /* Bir kez tetiklenince yeter */
        }
      });
    }, { threshold: 0.15 });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Eski tarayıcılar için animasyonsuz göster */
    animElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- AKTİF SAYFA LİNKİ ----------
     Hangi sayfada olduğunu algıla ve o linki
     navigasyonda "aktif" olarak işaretle         */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#nav-links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

});
