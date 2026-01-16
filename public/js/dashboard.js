const API = "/api/leads";
const token = localStorage.getItem("token");

if (!token) {
  location.href = "/login.html";
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("token");
  location.href = "/login.html";
}

/* ================= LOAD LEADS ================= */
async function loadLeads() {
  const res = await fetch(API, {
    headers: { Authorization: token }
  });
  const leads = await res.json();

  const stages = ["Lead", "Contacted", "Qualified", "Proposal", "Won", "Lost"];
  const containers = {};
  stages.forEach(s => containers[s] = "");

  let totalDeal = 0, totalWon = 0, totalLoss = 0;

  leads.forEach(l => {
    totalDeal += l.dealValue || 0;
    if (l.stage === "Won") totalWon += l.dealValue || 0;
    if (l.stage === "Lost") totalLoss += l.dealValue || 0;

    containers[l.stage] += `
      <div class="lead-card">
        <b>${l.companyName} — ₹${l.dealValue}</b><br>
        👤 ${l.contactPerson}<br>
        📧 ${l.email}<br>
        📞 ${l.phone}<br>

        <select onchange="updateStage('${l._id}', this.value)">
          ${stages.map(s => `
            <option ${l.stage === s ? "selected" : ""}>${s}</option>
          `).join("")}
        </select>

        <button onclick="deleteLead('${l._id}')">Delete</button>
        <hr>
      </div>
    `;
  });

  document.getElementById("totalDeal").innerText = "₹" + totalDeal;
  document.getElementById("totalWon").innerText = "₹" + totalWon;
  document.getElementById("totalLoss").innerText = "₹" + totalLoss;

  stages.forEach(s => {
    document.getElementById(s.toLowerCase()).innerHTML = containers[s];
  });
}

/* ================= ADD LEAD ================= */
document.getElementById("addLeadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(data)
  });

  e.target.reset();
  loadLeads();
});

/* ================= UPDATE STAGE ================= */
async function updateStage(id, stage) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
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
    headers: { Authorization: token }
  });

  loadLeads();
}

loadLeads();
