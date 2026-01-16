// =======================
// AUTH CHECK
// =======================
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "/login.html";
}

// =======================
// LOGOUT (FIXED)
// =======================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

// =======================
// LOAD LEADS
// =======================
async function loadLeads() {
  const res = await fetch("/api/leads", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();
  const leadsDiv = document.getElementById("leads");
  leadsDiv.innerHTML = "";

  data.forEach(lead => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>${lead.companyName}</b></p>
      <p>${lead.contactPerson}</p>
      <p>${lead.email}</p>
      <p>${lead.phone}</p>
      <p>₹${lead.dealValue}</p>
      <hr/>
    `;
    leadsDiv.appendChild(div);
  });
}

// =======================
// ADD LEAD
// =======================
document.getElementById("addLeadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    companyName: document.getElementById("companyName").value,
    contactPerson: document.getElementById("contactPerson").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    dealValue: document.getElementById("dealValue").value
  };

  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    document.getElementById("addLeadForm").reset();
    loadLeads();
  } else {
    alert("Add lead failed");
  }
});

// =======================
// INITIAL LOAD
// =======================
loadLeads();
