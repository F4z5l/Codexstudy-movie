/* ==========================================================================
   CODEXSTUDYS — install.js (PWA install button + service worker)
   ========================================================================== */
(function () {
  "use strict";

  let deferredPrompt = null;

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function showToast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(window.__cxToastTimer);
    window.__cxToastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function showIOSHelp() {
    let modal = document.getElementById("ios-install-modal");
    if (modal) { modal.classList.add("open"); return; }
    modal = document.createElement("div");
    modal.id = "ios-install-modal";
    modal.className = "modal-backdrop open";
    modal.innerHTML = `
      <div class="modal" style="max-width:380px;">
        <div class="modal-body" style="padding:26px 24px;margin-top:0;">
          <h2 class="modal-title" style="font-size:19px;">Install CODEXSTUDYS</h2>
          <p class="modal-desc" style="margin-bottom:6px;">
            Tap the <strong>Share</strong> icon in Safari's toolbar, then choose
            <strong>Add to Home Screen</strong>.
          </p>
          <div class="modal-actions">
            <button class="btn btn-primary btn-sm" id="ios-install-ok">Got it</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
    document.getElementById("ios-install-ok").addEventListener("click", () => modal.classList.remove("open"));
  }

  function setButtonsState(state) {
    // state: 'available' | 'installed' | 'unsupported'
    document.querySelectorAll("[data-install-btn]").forEach((btn) => {
      btn.classList.remove("is-installed");
      const label = btn.querySelector("[data-install-label]");
      if (state === "installed") {
        btn.classList.add("is-installed");
        if (label) label.textContent = "Installed";
      } else if (label) {
        label.textContent = "Install App";
      }
    });
  }

  function handleInstallClick() {
    if (isStandalone()) {
      showToast("CODEXSTUDYS is already installed");
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          showToast("Installing CODEXSTUDYS…");
        }
        deferredPrompt = null;
      });
      return;
    }
    if (isIOS()) {
      showIOSHelp();
      return;
    }
    showToast("Your browser doesn't support installing this app");
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    setButtonsState("installed");
    showToast("CODEXSTUDYS installed");
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (isStandalone()) setButtonsState("installed");
    document.querySelectorAll("[data-install-btn]").forEach((btn) => {
      btn.addEventListener("click", handleInstallClick);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  });
})();
