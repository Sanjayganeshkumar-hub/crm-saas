document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };

  // LOGOUT
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  };

  // LOAD LEADS
  async function loadLeads() {
    const res = await fetch("/api/leads", { headers });
    const leads = await res.json();
    renderLeads(leads);
  }

  function renderLeads(leads) {
    const stages = ["lead", "contacted", "qualified", "proposal", "won", "lost"];
    stages.forEach(s => document.getElementById(s).innerHTML = "");

    let total = 0, won = 0, loss = 0;

    leads.forEach(lead => {
      total += lead.dealValue;
      if (lead.stage === "Won") won += lead.dealValue;
      if (lead.stage === "Lost") loss += lead.dealValue;

      const card = document.createElement("div");
      card.className = "lead-card";

      card.innerHTML = `
        <h4>${lead.companyName} — ₹${lead.dealValue}</h4>
        <p>${lead.contactPerson}</p>
        <p>${lead.email || ""}</p>
        <p>${lead.phone || ""}</p>

        <select>
          ${["Lead","Contacted","Qualified","Proposal","Won","Lost"]
            .map(s => `<option ${s===lead.stage?"selected":""}>${s}</option>`).join("")}
        </select>

        <button>Delete</button>
      `;

      card.querySelector("select").onchange = async e => {
        await fetch(`/api/leads/${lead._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ stage: e.target.value })
        });
        loadLeads();
      };

      card.querySelector("button").onclick = async () => {
        await fetch(`/api/leads/${lead._id}`, {
          method: "DELETE",
          headers
        });
        loadLeads();
      };

      document.getElementById(lead.stage.toLowerCase()).appendChild(card);
    });

    document.getElementById("totalDeal").innerText = `₹${total}`;
    document.getElementById("totalWon").innerText = `₹${won}`;
    document.getElementById("totalLoss").innerText = `₹${loss}`;
  }

  // ADD LEAD
  document.getElementById("addLeadForm").onsubmit = async e => {
    e.preventDefault();

    await fetch("/api/leads", {
      method: "POST",
      headers,
      body: JSON.stringify({
        companyName: companyName.value,
        contactPerson: contactPerson.value,
        email: email.value,
        phone: phone.value,
        dealValue: Number(dealValue.value)
      })
    });

    e.target.reset();
    loadLeads();
  };

  loadLeads();
});
