const API = "/api/leads";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

/* ================= LOAD LEADS ================= */
async function loadLeads() {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const leads = await res.json();
  const leadsDiv = document.getElementById("leads");

  leadsDiv.innerHTML = "";

  let totalDeal = 0;
  let totalWon = 0;
  let totalLoss = 0;

  leads.forEach(lead => {
    totalDeal += lead.dealValue || 0;
    if (lead.stage === "Won") totalWon += lead.dealValue || 0;
    if (lead.stage === "Lost") totalLoss += lead.dealValue || 0;

    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${lead.companyName} — ₹${lead.dealValue}</h3>
      <p>👤 ${lead.contactPerson}</p>
      <p>📧 ${lead.email || "-"}</p>
      <p>📞 ${lead.phone || "-"}</p>

      <select onchange="updateStage('${lead._id}', this.value)">
        ${["Lead","Contacted","Qualified","Proposal","Won","Lost"]
          .map(s => `<option ${s === lead.stage ? "selected" : ""}>${s}</option>`)
          .join("")}
      </select>

      <button onclick="deleteLead('${lead._id}')">Delete</button>
      <hr />
    `;
    leadsDiv.appendChild(div);
  });

  document.getElementById("totalDeal").innerText = `₹${totalDeal}`;
  document.getElementById("totalWon").innerText = `₹${totalWon}`;
  document.getElementById("totalLoss").innerText = `₹${totalLoss}`;
}

/* ================= ADD LEAD ================= */
document.getElementById("addLeadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
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
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    alert("Add lead failed");
    return;
  }

  e.target.reset();
  loadLeads();
});

/* ================= UPDATE STAGE ================= */
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

/* ================= DELETE ================= */
async function deleteLead(id) {
  if (!confirm("Delete this lead?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadLeads();
}

/* ================= INIT ================= */
loadLeads();
