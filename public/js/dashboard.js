const API = "/api/leads";
const token = localStorage.getItem("token");

if (!token) location.href = "/login.html";

/* DOM */
const leadsDiv = document.getElementById("leads");
const totalDeal = document.getElementById("totalDeal");
const totalWon = document.getElementById("totalWon");
const totalLoss = document.getElementById("totalLoss");

/* LOGOUT */
function logout() {
  localStorage.removeItem("token");
  location.href = "/login.html";
}

/* LOAD LEADS */
async function loadLeads() {
  const res = await fetch(API, {
    headers: { Authorization: "Bearer " + token }
  });

  if (!res.ok) {
    alert("Load failed");
    return;
  }

  const leads = await res.json();
  renderLeads(leads);
  calculateTotals(leads);
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
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    alert("Add lead failed");
    return;
  }

  e.target.reset();
  loadLeads();
});

/* RENDER */
function renderLeads(leads) {
  leadsDiv.innerHTML = "";

  leads.forEach(l => {
    leadsDiv.innerHTML += `
      <div style="border:1px solid #aaa;padding:10px;margin:10px">
        <b>${l.companyName}</b> — ₹${l.dealValue}<br>
        👤 ${l.contactPerson}<br>
        📧 ${l.email || "-"}<br>
        📞 ${l.phone || "-"}<br>

        <select onchange="updateStage('${l._id}', this.value)">
          ${["Lead","Contacted","Qualified","Proposal","Won","Lost"]
            .map(s => `<option ${s===l.stage?"selected":""}>${s}</option>`)
            .join("")}
        </select>

        <button onclick="deleteLead('${l._id}')">Delete</button>
      </div>
    `;
  });
}

/* UPDATE STAGE */
async function updateStage(id, stage) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
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
    headers: { Authorization: "Bearer " + token }
  });

  loadLeads();
}

/* TOTALS */
function calculateTotals(leads) {
  let total = 0, won = 0, loss = 0;

  leads.forEach(l => {
    total += l.dealValue;
    if (l.stage === "Won") won += l.dealValue;
    if (l.stage === "Lost") loss += l.dealValue;
  });

  totalDeal.innerText = "₹" + total;
  totalWon.innerText = "₹" + won;
  totalLoss.innerText = "₹" + loss;
}

loadLeads();
