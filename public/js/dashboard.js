const API = "/api/leads";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

/* ---------------- LOGOUT ---------------- */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

/* ---------------- LOAD LEADS ---------------- */
async function loadLeads() {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const leads = await res.json();

  // Clear columns
  ["Lead","Contacted","Qualified","Proposal","Won","Lost"].forEach(s => {
    document.getElementById(s).innerHTML = `<h3>${s}</h3>`;
  });

  let totalDeal = 0;
  let totalWon = 0;
  let totalLost = 0;

  leads.forEach(lead => {
    totalDeal += lead.dealValue || 0;
    if (lead.stage === "Won") totalWon += lead.dealValue || 0;
    if (lead.stage === "Lost") totalLost += lead.dealValue || 0;

    document.getElementById(lead.stage).appendChild(createCard(lead));
  });

  document.getElementById("totalDeal").innerText = `₹${totalDeal}`;
  document.getElementById("totalWon").innerText = `₹${totalWon}`;
  document.getElementById("totalLost").innerText = `₹${totalLost}`;
}

/* ---------------- CREATE CARD ---------------- */
function createCard(lead) {
  const card = document.createElement("div");
  card.className = "lead-card";

  card.innerHTML = `
    <strong>${lead.companyName} — ₹${lead.dealValue}</strong>
    <p>👤 ${lead.contactPerson}</p>
    <p>📧 ${lead.email || "-"}</p>
    <p>📞 ${lead.phone || "-"}</p>

    <select onchange="updateStage('${lead._id}', this.value)">
      ${["Lead","Contacted","Qualified","Proposal","Won","Lost"]
        .map(s => `<option ${s===lead.stage?"selected":""}>${s}</option>`)
        .join("")}
    </select>

    <button class="delete-btn" onclick="deleteLead('${lead._id}')">
      Delete
    </button>
  `;

  return card;
}

/* ---------------- ADD LEAD ---------------- */
document.getElementById("addLeadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const lead = {
    companyName: companyName.value,
    contactPerson: contactPerson.value,
    email: email.value,
    phone: phone.value,
    dealValue: Number(dealValue.value)
  };

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(lead)
  });

  if (!res.ok) {
    alert("Add lead failed");
    return;
  }

  e.target.reset();
  loadLeads();
});

/* ---------------- UPDATE STAGE ---------------- */
async function updateStage(id, stage) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ stage })
  });

  loadLeads();
}

/* ---------------- DELETE LEAD ---------------- */
async function deleteLead(id) {
  if (!confirm("Delete this lead?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadLeads();
}

/* ---------------- INIT ---------------- */
loadLeads();
