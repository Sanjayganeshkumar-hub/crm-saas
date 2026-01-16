const API = "/api/leads";
const token = localStorage.getItem("token");

/* ===== AUTH CHECK ===== */
if (!token) {
  alert("Login required");
  window.location.href = "/login.html";
}

/* ===== LOGOUT ===== */
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
};

/* ===== ADD LEAD ===== */
document.getElementById("addLeadForm").addEventListener("submit", async (e) => {
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
      "Authorization": "Bearer " + token
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

/* ===== LOAD LEADS ===== */
async function loadLeads() {
  const res = await fetch(API, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (!res.ok) {
    console.error("Unauthorized / API failed");
    return;
  }

  const leads = await res.json();

  if (!Array.isArray(leads)) {
    console.error("Invalid response:", leads);
    return;
  }

  ["lead","contacted","qualified","proposal","won","lost"]
    .forEach(id => document.getElementById(id).innerHTML = "");

  let totalDeal = 0, totalWon = 0, totalLoss = 0;

  leads.forEach(l => {
    totalDeal += l.dealValue;
    if (l.stage === "Won") totalWon += l.dealValue;
    if (l.stage === "Lost") totalLoss += l.dealValue;

    const div = document.createElement("div");
    div.innerHTML = `
      <b>${l.companyName} — ₹${l.dealValue}</b><br>
      👤 ${l.contactPerson}<br>
      📧 ${l.email || "-"}<br>
      📞 ${l.phone || "-"}<br>

      <select onchange="updateStage('${l._id}', this.value)">
        ${["Lead","Contacted","Qualified","Proposal","Won","Lost"]
          .map(s => `<option ${s===l.stage?"selected":""}>${s}</option>`)}
      </select>

      <button onclick="deleteLead('${l._id}')">Delete</button>
      <hr>
    `;

    document.getElementById(l.stage.toLowerCase()).appendChild(div);
  });

  totalDeal.innerText = "₹" + totalDeal;
  totalWon.innerText = "₹" + totalWon;
  totalLoss.innerText = "₹" + totalLoss;
}

/* ===== UPDATE STAGE ===== */
async function updateStage(id, stage) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ stage })
  });

  loadLeads();
}

/* ===== DELETE ===== */
async function deleteLead(id) {
  if (!confirm("Delete this lead?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  loadLeads();
}

/* INIT */
loadLeads();
