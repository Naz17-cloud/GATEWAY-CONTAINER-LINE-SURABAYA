const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScU5G2UO2TKcVffDQEjSZdQuXfq43Ldgfq-lJW9DedgRmQbqg/formResponse";
const RECIPIENT1_FIELD = "entry.1730041639";
const RECIPIENT2_FIELD = "entry.403681205";

// Fungsi ambil parameter dari URL
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function submitRecipient(company, table, recipient1, recipient2) {
  const formData = new FormData();
  formData.append(RECIPIENT1_FIELD, recipient1 || "-");
  formData.append(RECIPIENT2_FIELD, recipient2 || "-");

  try {
    await fetch(FORM_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    });
    document.getElementById("status").innerText = "✅ Data recipient berhasil dicatat!";
  } catch (err) {
    document.getElementById("status").innerText = "❌ Gagal kirim data recipient";
  }
}

window.onload = function() {
  const company = getQueryParam("company");
  const table = getQueryParam("table");

  document.getElementById("companyName").innerText = "Company: " + (company || "-");
  document.getElementById("tableNumber").innerText = "Table: " + (table || "-");

  if (company && recipients[company]) {
    const [recipient1, recipient2] = recipients[company];

    document.getElementById("recipient1").innerText = "Recipient 1: " + recipient1;
    document.getElementById("recipient2").innerText = "Recipient 2: " + recipient2;

    // langsung kirim data recipient ke Google Form
    submitRecipient(company, table, recipient1, recipient2);
  } else {
    document.getElementById("status").innerText = "⚠️ Data recipient tidak ditemukan!";
  }
};
