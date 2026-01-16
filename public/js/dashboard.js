const API = "/api/leads";
const token = localStorage.getItem("token");

// 🔐 Redirect if not logged in
if (!token) {
  window.location.href = "/login.html";
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

/* ================= ADD LEAD ================= */
document.getElementById("addLeadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    companyName: companyName.value,
    contactPerson: contactPerson.value,
    email: email.value,
    phone: phone.value,
    dealValue: Number(dealValue.value),
  };

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    e.target.reset();
    loadLeads();
  } else {
    alert("Add lead failed");
  }
});

/* ================= LOAD LEADS ================= */
async function loadLeads() {
  const res = await fetch(API, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const leads = await res.json();
  renderLeads(leads);
}

/* ================= RENDER LEADS ================= */
function renderLeads(leads) {
  // Clear pipeline columns
  document.querySelectorAll("[data-stage]").forEach(col => col.innerHTML = "");

  let totalDeal = 0;
  let totalWon = 0;
  let totalLoss = 0;

  leads.forEach(lead => {
    totalDeal += lead.dealValue;
    if (lead.stage === "Won") totalWon += lead.dealValue;
    if (lead.stage === "Lost") totalLoss += lead.dealValue;

    const card = document.createElement("div");
    card.className = "lead-card";

    card.innerHTML = `
      <h4>${lead.companyName} — ₹${lead.dealValue}</h4>
      <p>${lead.contactPerson}</p>
      <p>${lead.email || "-"}</p>
      <p>${lead.phone || "-"}</p>

      <select onchange="updateStage('${lead._id}', this.value)">
        ${["Lead","Contacted","Qualified","Proposal","Won","Lost"]
          .map(s => `<option ${s===lead.stage?"selected":""}>${s}</option>`)
          .join("")}
      </select>

      <button onclick="deleteLead('${lead._id}')">Delete</button>
    `;

    document
      .querySelector(`[data-stage="${lead.stage}"]`)
      .appendChild(card);
  });

  // Update totals
  document.getElementById("totalDealAmount").innerText = "₹" + totalDeal;
  document.getElementById("totalWonAmount").innerText = "₹" + totalWon;
  document.getElementById("totalLossAmount").innerText = "₹" + totalLoss;
}

/* ================= UPDATE STAGE ================= */
async function updateStage(id, stage) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ stage }),
  });

  loadLeads();
}

/* ================= DELETE LEAD ================= */
async function deleteLead(id) {
  if (!confirm("Delete this lead?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  loadLeads();
}

/* ================= INIT ================= */
loadLeads();
