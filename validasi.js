// ========================
// Konfigurasi Google Form
// ========================
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScU5G2UO2TKcVffDQEjSZdQuXfq43Ldgfq-lJW9DedgRmQbqg/formResponse";
const RECIPIENT1_FIELD = "entry.1730041639";
const RECIPIENT2_FIELD = "entry.403681205";

// ========================
// Helper Functions
// ========================
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function normalizeName(name) {
  if (!name) return "";
  return decodeURIComponent(name)
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function setStatus(msg, isError = false) {
  const el = document.getElementById("status");
  if (el) {
    el.innerText = msg;
    el.style.color = isError ? "red" : "green";
  }
  console[isError ? "error" : "log"](msg);
}

// ========================
// Submit ke Google Form
// ========================
async function submitRecipient(recipient1, recipient2) {
  if (window._submitted) {
    setStatus("ℹ️ Data sudah pernah dikirim untuk QR ini.");
    return;
  }

  const formData = new FormData();
  formData.append(RECIPIENT1_FIELD, recipient1 || "-");
  formData.append(RECIPIENT2_FIELD, recipient2 || "-");

  try {
    await fetch(FORM_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    });
    setStatus("✅ Data recipient berhasil dicatat!");
    window._submitted = true;
  } catch (err) {
    console.error("Fetch gagal:", err);

    // fallback: hidden form submit
    try {
      const form = document.createElement("form");
      form.action = FORM_URL;
      form.method = "POST";
      form.style.display = "none";

      const in1 = document.createElement("input");
      in1.name = RECIPIENT1_FIELD;
      in1.value = recipient1 || "-";

      const in2 = document.createElement("input");
      in2.name = RECIPIENT2_FIELD;
      in2.value = recipient2 || "-";

      form.appendChild(in1);
      form.appendChild(in2);
      document.body.appendChild(form);

      form.submit();
      setStatus("✅ Data recipient dicatat (via fallback form).");
      window._submitted = true;
    } catch (e) {
      setStatus("❌ Gagal mengirim data recipient", true);
    }
  }
}

// ========================
// Main Logic
// ========================
window.onload = function () {
  const companyRaw = getQueryParam("company") || "";
  const table = getQueryParam("table") || "-";
  const companyKey = normalizeName(companyRaw);

  // Tampilkan company & table
  document.getElementById("companyName").innerText = "Company: " + (companyRaw || "-");
  document.getElementById("tableNumber").innerText = "Table: " + table;

  // Pastikan recipients sudah ada
  if (!window.recipients || Object.keys(window.recipients).length === 0) {
    setStatus("⚠️ Data recipient belum tersedia (recipient.js error).", true);
    return;
  }

  // Normalisasi semua key recipients
  const normalizedMap = {};
  for (const k of Object.keys(window.recipients)) {
    normalizedMap[normalizeName(k)] = window.recipients[k];
  }

  // Cari recipient
  const found = normalizedMap[companyKey];
  if (found) {
    const recipient1 = found[0] || "-";
    const recipient2 = found[1] || "-";

    document.getElementById("recipient1").innerText = "Recipient 1: " + recipient1;
    document.getElementById("recipient2").innerText = "Recipient 2: " + recipient2;

    setStatus("🔄 Mengirim data ke Google Form...");
    submitRecipient(recipient1, recipient2);
  } else {
    document.getElementById("recipient1").innerText = "Recipient 1: -";
    document.getElementById("recipient2").innerText = "Recipient 2: -";
    setStatus("⚠️ Data recipient tidak ditemukan!", true);
  }
};
