}
// Ambil parameter dari URL
const urlParams = new URLSearchParams(window.location.search);
const company = urlParams.get("company");
const table = urlParams.get("table");

document.getElementById("company").textContent = company;
document.getElementById("table").textContent = table;

const listDiv = document.getElementById("recipient-list");
if (recipientData[company]) {
  recipientData[company].forEach(name => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.onclick = () => submitRecipient(name);
    listDiv.appendChild(btn);
  });
} else {
  listDiv.innerHTML = "<p>Tidak ada recipient terdaftar</p>";
}

// Submit manual
document.getElementById("submitManual").onclick = () => {
  const manual = document.getElementById("manualRecipient").value.trim();
  if (manual) {
    submitRecipient(manual);
  } else {
    alert("Masukkan nama recipient terlebih dahulu!");
  }
};

// Kirim ke Google Form
function submitRecipient(recipient) {
  const formData = new FormData();
  formData.append("entry.1730041639", recipient); // kolom recipient
  formData.append("entry.403681205", company + " - " + table); // info tambahan company+table

  fetch("https://docs.google.com/forms/d/e/1FAIpQLScU5G2UO2TKcVffDQEjSZdQuXfq43Ldgfq-lJW9DedgRmQbqg/formResponse", {
    method: "POST",
    body: formData,
    mode: "no-cors"
  }).then(() => {
    alert("Kehadiran " + recipient + " berhasil dicatat!");
  }).catch(() => {
    alert("Gagal mencatat data, coba lagi.");
  });
}
