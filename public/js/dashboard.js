const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

async function loadLeads() {
  const res = await fetch("/api/leads", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  const leadsDiv = document.getElementById("leads");
  leadsDiv.innerHTML = "";

  let total = 0, won = 0, lost = 0;

  data.forEach(l => {
    total += l.dealValue || 0;
    if (l.stage === "Won") won += l.dealValue || 0;
    if (l.stage === "Lost") lost += l.dealValue || 0;

    const div = document.createElement("div");
    div.innerHTML = `
      <b>${l.companyName}</b><br>
      ${l.contactPerson}<br>
      ₹${l.dealValue}
    `;
    leadsDiv.appendChild(div);
  });

  document.getElementById("totalDeal").innerText = "₹" + total;
  document.getElementById("totalWon").innerText = "₹" + won;
  document.getElementById("totalLost").innerText = "₹" + lost;
}

document.getElementById("addLeadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const body = {
    companyName: companyName.value,
    contactPerson: contactPerson.value,
    email: email.value,
    phone: phone.value,
    dealValue: dealValue.value
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
    e.target.reset();
    loadLeads();
  } else {
    alert("Add lead failed");
  }
});

loadLeads();
