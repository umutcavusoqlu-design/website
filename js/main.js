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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = Array.from(el.parentElement.querySelectorAll('[data-animate]'));
          const index = siblings.indexOf(el);
          const existingDelay = el.style.animationDelay;
          const delay = existingDelay ? parseFloat(existingDelay) * 1000 : index * 150;
          setTimeout(() => {
            el.classList.add('visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0 });

    animElements.forEach(el => observer.observe(el));
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

  const scrollAnimElements = document.querySelectorAll('[data-scroll-anim]');

  if (scrollAnimElements.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    scrollAnimElements.forEach(el => scrollObserver.observe(el));
  }

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const speed = Math.abs(currentScroll - lastScroll);
    const duration = Math.max(0.3, 1.2 - speed * 0.01);
    document.querySelectorAll('[data-scroll-anim]:not(.scroll-visible)').forEach(el => {
      el.style.transitionDuration = duration + 's';
    });
    lastScroll = currentScroll;
  }, { passive: true });

});
