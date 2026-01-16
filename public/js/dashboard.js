let leads = [];

const totalDealEl = document.getElementById("totalDeal");
const totalWonEl = document.getElementById("totalWon");
const totalLossEl = document.getElementById("totalLoss");

const statuses = ["Lead", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "login.html";
};

document.getElementById("addLeadBtn").onclick = () => {
  const lead = {
    id: Date.now(),
    company: companyName.value,
    person: contactPerson.value,
    email: email.value,
    phone: phone.value,
    value: Number(dealValue.value),
    status: "Lead"
  };
  leads.push(lead);
  render();
};

function render() {
  statuses.forEach(s => {
    const col = document.getElementById(`lead-${s}`);
    if (col) col.innerHTML = "";
  });

  let total = 0, won = 0, lost = 0;

  leads.forEach(lead => {
    total += lead.value;
    if (lead.status === "Won") won += lead.value;
    if (lead.status === "Lost") lost += lead.value;

    const card = document.createElement("div");
    card.className = "lead-card";

    card.innerHTML = `
      <h4>${lead.company} — ₹${lead.value}</h4>
      <p>${lead.person}</p>
      <p>${lead.email}</p>
      <p>${lead.phone}</p>

      <select>
        ${statuses.map(s => `<option ${s===lead.status?"selected":""}>${s}</option>`).join("")}
      </select>

      <button>Delete</button>
    `;

    card.querySelector("select").onchange = e => {
      lead.status = e.target.value;
      render();
    };

    card.querySelector("button").onclick = () => {
      leads = leads.filter(l => l.id !== lead.id);
      render();
    };

    const column = document.getElementById(`lead-${lead.status}`);
    if (column) column.appendChild(card);
  });

  totalDealEl.textContent = `₹${total}`;
  totalWonEl.textContent = `₹${won}`;
  totalLossEl.textContent = `₹${lost}`;
}
