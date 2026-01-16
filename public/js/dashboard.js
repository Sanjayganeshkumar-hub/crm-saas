/* ================= CHECK LOGIN ================= */
const token = localStorage.getItem("token");

if (!token) {
  alert("Login required");
  window.location.href = "/login.html";
}

/* ================= ADD LEAD ================= */
const form = document.getElementById("addLeadForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault(); // ⛔ STOP PAGE REFRESH

  const lead = {
    companyName: document.querySelector("input[name='companyName']").value,
    contactPerson: document.querySelector("input[name='contactPerson']").value,
    email: document.querySelector("input[name='email']").value,
    phone: document.querySelector("input[name='phone']").value,
    dealValue: document.querySelector("input[name='dealValue']").value
  };

  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(lead)
  });

  if (res.ok) {
    form.reset();   // ✅ clear form
    loadLeads();    // ✅ reload leads
  } else {
    alert("Add lead failed");
  }
});

/* ================= LOAD LEADS ================= */
async function loadLeads() {
  const res = await fetch("/api/leads", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const leads = await res.json();
  console.log("Leads loaded:", leads);
}

loadLeads();
