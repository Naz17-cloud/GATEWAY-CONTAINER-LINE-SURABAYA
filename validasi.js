// ========================
// Konfigurasi Google Form
// ========================
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScU5G2UO2TKcVffDQEjSZdQuXfq43Ldgfq-lJW9DedgRmQbqg/formResponse";
const RECIPIENT1_FIELD = "entry.1730041639";
const RECIPIENT2_FIELD = "entry.403681205";
const COMPANY_FIELD = "entry.2006319974"; // opsional kalau mau kirim nama perusahaan
const TABLE_FIELD = "entry.931928333"; // opsional kalau mau kirim nomor meja

// ========================
// Helper Functions
// ========================
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function normalizeName(name) {
  if (!name) return "";
  return decodeURIComponent(name).trim().replace(/\s+/g, " ").toUpperCase();
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
async function submitRecipient(company, table, recipient1, recipient2) {
  if (window._submitted) {
    setStatus("ℹ️ Data sudah pernah dikirim untuk QR ini.");
    return;
  }

  const formData = new FormData();
  formData.append(COMPANY_FIELD, company || "-");
  formData.append(TABLE_FIELD, table || "-");
  formData.append(RECIPIENT1_FIELD, recipient1 || "-");
  formData.append(RECIPIENT2_FIELD, recipient2 || "-");

  try {
    await fetch(FORM_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
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

      const addInput = (name, value) => {
        const input = document.createElement("input");
        input.name = name;
        input.value = value || "-";
        form.appendChild(input);
      };

      addInput(COMPANY_FIELD, company);
      addInput(TABLE_FIELD, table);
      addInput(RECIPIENT1_FIELD, recipient1);
      addInput(RECIPIENT2_FIELD, recipient2);

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
  if (document.getElementById("companyName"))
    document.getElementById("companyName").innerText =
      "Company: " + (companyRaw || "-");

  if (document.getElementById("tableNumber"))
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

    if (document.getElementById("recipient1"))
      document.getElementById("recipient1").innerText =
        "Recipient 1: " + recipient1;
    if (document.getElementById("recipient2"))
      document.getElementById("recipient2").innerText =
        "Recipient 2: " + recipient2;

    setStatus("🔄 Mengirim data ke Google Form...");
    submitRecipient(companyRaw, table, recipient1, recipient2);
  } else {
    if (document.getElementById("recipient1"))
      document.getElementById("recipient1").innerText = "Recipient 1: -";
    if (document.getElementById("recipient2"))
      document.getElementById("recipient2").innerText = "Recipient 2: -";
    setStatus("⚠️ Data recipient tidak ditemukan!", true);
  }
};
