const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

// PREVENT FORM RELOAD
document.getElementById("addLeadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const lead = {
    company: company.value,
    contactPerson: contactPerson.value,
    email: email.value,
    phone: phone.value,
    value: value.value
  };

  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(lead)
  });

  if (res.ok) {
    loadLeads();
    e.target.reset();
  } else {
    alert("Add lead failed");
  }
});

async function loadLeads() {
  const res = await fetch("/api/leads", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();
  const container = document.getElementById("leads");
  container.innerHTML = "";

  data.forEach(l => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${l.company}</h4>
      <p>${l.contactPerson}</p>
      <p>₹${l.value}</p>
      <hr/>
    `;
    container.appendChild(div);
  });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

loadLeads();
