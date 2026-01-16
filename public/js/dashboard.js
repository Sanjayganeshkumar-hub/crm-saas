const API = "/api/leads";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

/* LOAD LEADS */
async function loadLeads() {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const leads = await res.json();

  ["Lead","Contacted","Qualified","Proposal","Won","Lost"].forEach(
    s => document.getElementById(s).innerHTML = ""
  );

  let total = 0, won = 0, lost = 0;

  leads.forEach(lead => {
    total += lead.dealValue;
    if (lead.stage === "Won") won += lead.dealValue;
    if (lead.stage === "Lost") lost += lead.dealValue;

    document.getElementById(lead.stage).appendChild(renderLead(lead));
  });

  document.getElementById("totalDeal").innerText = "₹" + total;
  document.getElementById("totalWon").innerText = "₹" + won;
  document.getElementById("totalLost").innerText = "₹" + lost;
}

/* RENDER CARD */
function renderLead(lead) {
  const div = document.createElement("div");
  div.className = "lead-card";

  div.innerHTML = `
    <h4>${lead.companyName} — ₹${lead.dealValue}</h4>
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

  return div;
}

/* ADD LEAD */
document.getElementById("addLeadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const body = {
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
    body: JSON.stringify(body)
  });

  if (!res.ok) return alert("Add lead failed");

  e.target.reset();
  loadLeads();
});

/* UPDATE STAGE */
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

/* DELETE */
async function deleteLead(id) {
  if (!confirm("Delete this lead?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  loadLeads();
}

loadLeads();
