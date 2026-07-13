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

    /* Menüdeki bir linke tıklanınca menüyü kapat
       (mega trigger linkleri hariç — onlar mobilde accordion aç/kapa yapıyor,
       .mega-source .mega-grid içindeki gerçek alt linkler istisna DEĞİL) */
    navLinks.querySelectorAll("a").forEach(function (link) {
      var isMegaTrigger = link.parentElement &&
        link.parentElement.classList.contains("nav-dropdown") &&
        link.parentElement.classList.contains("mega");
      if (isMegaTrigger) return;

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
    function updateHeaderScrolled() {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    window.addEventListener("scroll", updateHeaderScrolled);
    updateHeaderScrolled();
    window.addEventListener("load", updateHeaderScrolled);
    setTimeout(updateHeaderScrolled, 100);
    setTimeout(updateHeaderScrolled, 400);
  }

  /* ---------- MEGA MENU: TEK PANEL, İÇERİK DEĞİŞİMİ ----------
     Tedarik/Kalite arasında panel kapanıp açılmaz, sadece içerik
     ve yükseklik yumuşakça değişir (Apple tarzı davranış) */
  var megaTriggers = document.querySelectorAll('.nav-dropdown.mega');
  var megaOverlay = document.getElementById('megaOverlay');
  var megaPanel = document.getElementById('megaPanelShared');
  var megaGridContent = document.getElementById('megaGridContent');

  if (megaTriggers.length && megaPanel && megaGridContent && megaOverlay) {
    var closeTimer = null;
    var isOpen = false;

    function cancelClose() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    function closeNow() {
      cancelClose();
      megaPanel.style.height = '0px';
      megaOverlay.classList.remove('active');
      if (header && window.scrollY <= 50) {
        header.classList.remove('scrolled');
      }
      isOpen = false;
    }

    function openWithContent(sourceGridEl) {
      cancelClose();
      var startHeight = megaPanel.offsetHeight;

      var doSwap = function () {
        megaGridContent.innerHTML = sourceGridEl.innerHTML;
        var targetHeight = megaGridContent.scrollHeight;

        megaPanel.style.height = startHeight + 'px';

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            megaPanel.style.height = targetHeight + 'px';
            megaGridContent.style.opacity = '1';
          });
        });

        if (!isOpen) {
          megaOverlay.classList.add('active');
          if (header) header.classList.add('scrolled');
          isOpen = true;
        }
      };

      if (isOpen) {
        /* Panel zaten açık: önce mevcut metni kısaca soldur,
           sonra içeriği değiştirip yeniden belirt */
        megaGridContent.style.opacity = '0';
        setTimeout(doSwap, 150);
      } else {
        /* İlk açılış: doğrudan soluk başlayıp belirsin */
        megaGridContent.style.opacity = '0';
        doSwap();
      }
    }

    function scheduleClose() {
      cancelClose();
      closeTimer = setTimeout(closeNow, 200);
    }

    megaTriggers.forEach(function (trigger) {
      var sourceGrid = trigger.querySelector('.mega-source .mega-grid');
      if (!sourceGrid) return;

      trigger.addEventListener('mouseenter', function () {
        openWithContent(sourceGrid);
      });
      trigger.addEventListener('mouseleave', function () {
        scheduleClose();
      });
    });

    megaPanel.addEventListener('mouseenter', function () {
      cancelClose();
    });
    megaPanel.addEventListener('mouseleave', function () {
      scheduleClose();
    });

    megaOverlay.addEventListener('click', function () {
      closeNow();
    });

    megaGridContent.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      closeNow();
    });

    /* Mobilde Tedarik/Kalite başlığına tıklayınca aç/kapa (accordion) */
    megaTriggers.forEach(function (trigger) {
      var link = trigger.querySelector('a');
      if (!link) return;
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          trigger.classList.toggle('open');
        }
      });
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

});
