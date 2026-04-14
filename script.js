/* ============================================================
   KAMPUR MEDICAL — DEMO 2  |  script.js
   ============================================================ */

const WA_NUMBER = "919876543210";

/* ── MOBILE NAV ─────────────────────────────────────────────── */
function toggleMenu() {
  document.getElementById("mobileNav").classList.toggle("open");
}

/* ── NAV ACTIVE STATE ON SCROLL ─────────────────────────────── */
(function initScrollSpy() {
  const sections  = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute("id");
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }, { passive: true });
})();

/* ── PRODUCT SEARCH & FILTER ────────────────────────────────── */
(function initProducts() {
  const cards     = document.querySelectorAll(".product-card");
  const tabs      = document.querySelectorAll(".filter-tab");
  const searchEl  = document.getElementById("productSearch");
  const noResults = document.getElementById("noResults");
  let activeCat   = "all";

  function applyFilter() {
    const query = searchEl ? searchEl.value.trim().toLowerCase() : "";
    let visible = 0;

    cards.forEach((card) => {
      const cat   = card.dataset.cat || "all";
      const name  = card.querySelector(".product-name")?.textContent.toLowerCase() || "";
      const desc  = card.querySelector(".product-desc")?.textContent.toLowerCase() || "";

      const catMatch   = activeCat === "all" || cat === activeCat;
      const queryMatch = !query || name.includes(query) || desc.includes(query);

      const show = catMatch && queryMatch;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });

    if (noResults) noResults.classList.toggle("visible", visible === 0);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeCat = tab.dataset.filter;
      applyFilter();
    });
  });

  if (searchEl) {
    searchEl.addEventListener("input", applyFilter);
  }
})();

/* ── FAQ ACCORDION ──────────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      // close all
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));

      // toggle clicked
      if (!isOpen) item.classList.add("open");
    });
  });
})();

/* ── FORM HELPERS ───────────────────────────────────────────── */
function getField(id)     { return document.getElementById(id); }
function setError(id, msg) {
  const group = getField(id)?.closest(".form-group");
  if (!group) return;
  group.classList.add("has-error");
  const errEl = group.querySelector(".field-error");
  if (errEl) errEl.textContent = msg;
}
function clearError(id) {
  const group = getField(id)?.closest(".form-group");
  if (!group) return;
  group.classList.remove("has-error");
}
function clearAllErrors(ids) { ids.forEach(clearError); }

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""));
}

/* ── CONTACT FORM → WHATSAPP (with validation + modal) ──────── */
let pendingWAUrl = "";

function sendWA() {
  const name  = getField("ctName");
  const phone = getField("ctPhone");
  const type  = getField("ctType");
  const msg   = getField("ctMsg");

  clearAllErrors(["ctName", "ctPhone", "ctType", "ctMsg"]);
  let valid = true;

  if (!name?.value.trim()) {
    setError("ctName", "Please enter your name."); valid = false;
  }
  if (!phone?.value.trim()) {
    setError("ctPhone", "Please enter your phone number."); valid = false;
  } else if (!isValidPhone(phone.value.trim())) {
    setError("ctPhone", "Enter a valid 10-digit mobile number."); valid = false;
  }
  if (!type?.value) {
    setError("ctType", "Please select a query type."); valid = false;
  }
  if (!msg?.value.trim()) {
    setError("ctMsg", "Please enter your message."); valid = false;
  }

  if (!valid) return;

  const text = `Hello Kampur Medical!\n\nName: ${name.value.trim()}\nPhone: ${phone.value.trim()}\nQuery: ${type.value}\n\n${msg.value.trim()}`;
  pendingWAUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  // Populate modal preview
  const preview = document.getElementById("modalPreview");
  if (preview) {
    preview.innerHTML =
      `<strong>Name:</strong> ${name.value.trim()}<br>` +
      `<strong>Phone:</strong> ${phone.value.trim()}<br>` +
      `<strong>Query:</strong> ${type.value}<br>` +
      `<strong>Message:</strong> ${msg.value.trim()}`;
  }

  openModal();
}

function confirmSend() {
  if (pendingWAUrl) window.open(pendingWAUrl, "_blank");
  closeModal();
  // Reset form
  ["ctName", "ctPhone", "ctMsg"].forEach((id) => {
    const el = getField(id);
    if (el) el.value = "";
  });
  const sel = getField("ctType");
  if (sel) sel.selectedIndex = 0;
}

/* ── MEDICINE ENQUIRY FORM → WHATSAPP ───────────────────────── */
function sendEnquiry() {
  const med   = getField("enqMed");
  const phone = getField("enqPhone");
  const note  = getField("enqNote");
  let valid = true;

  [med, phone].forEach((el) => {
    if (el) el.style.borderColor = "";
  });

  if (!med?.value.trim()) {
    if (med) med.style.borderColor = "var(--red)";
    valid = false;
  }
  if (!phone?.value.trim() || !isValidPhone(phone.value.trim())) {
    if (phone) phone.style.borderColor = "var(--red)";
    valid = false;
  }

  if (!valid) {
    alert("Please fill in the medicine name and a valid phone number.");
    return;
  }

  const text =
    `Medicine Availability Enquiry\n\n` +
    `Medicine: ${med.value.trim()}\n` +
    `Phone: ${phone.value.trim()}` +
    (note?.value.trim() ? `\nNote: ${note.value.trim()}` : "");

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
}

/* ── MODAL CONTROLS ─────────────────────────────────────────── */
function openModal() {
  const overlay = document.getElementById("confirmModal");
  if (overlay) overlay.classList.add("open");
}
function closeModal() {
  const overlay = document.getElementById("confirmModal");
  if (overlay) overlay.classList.remove("open");
  pendingWAUrl = "";
}

// Close modal on overlay click
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("confirmModal");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // clear errors on input
  document.querySelectorAll(".form-group input, .form-group textarea, .form-group select").forEach((el) => {
    el.addEventListener("input", () => {
      el.closest(".form-group")?.classList.remove("has-error");
    });
  });
});
