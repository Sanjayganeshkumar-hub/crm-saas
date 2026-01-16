const API_URL = "/api/leads";
const token = localStorage.getItem("token");

if (!token) {
  alert("No token found. Please login again.");
  window.location.href = "/login.html";
}

// Handle Add Lead
document.getElementById("addLeadForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔥 STOP PAGE RELOAD

  const leadData = {
    companyName: e.target.companyName.value,
    contactPerson: e.target.contactPerson.value,
    email: e.target.email.value,
    phone: e.target.phone.value,
    dealValue: e.target.dealValue.value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(leadData)
    });

    if (!res.ok) throw new Error("Add lead failed");

    e.target.reset();
    loadLeads();
  } catch (err) {
    alert("Add lead failed");
  }
});

// Load Leads
async function loadLeads() {
  const res = await fetch(API_URL, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const leads = await res.json();
  const container = document.getElementById("leads");
  container.innerHTML = "";

  leads.forEach(lead => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${lead.companyName}</h4>
      <p>${lead.contactPerson}</p>
      <p>${lead.email}</p>
      <p>${lead.phone}</p>
      <p>₹${lead.dealValue}</p>
      <hr/>
    `;
    container.appendChild(div);
  });
}

loadLeads();
