// ==============================
// AUTH TOKEN (VERY IMPORTANT)
// ==============================
const token = localStorage.getItem("token");

if (!token) {
    alert("Please login again");
    window.location.href = "/login.html";
}

// ==============================
// DOM ELEMENTS
// ==============================
const addLeadForm = document.getElementById("addLeadForm");
const companyNameInput = document.getElementById("companyName");
const contactPersonInput = document.getElementById("contactPerson");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dealValueInput = document.getElementById("dealValue");

const leadColumn = document.getElementById("leadColumn");
const contactedColumn = document.getElementById("contactedColumn");
const qualifiedColumn = document.getElementById("qualifiedColumn");
const proposalColumn = document.getElementById("proposalColumn");
const wonColumn = document.getElementById("wonColumn");
const lostColumn = document.getElementById("lostColumn");

const totalDealAmountEl = document.getElementById("totalDealAmount");
const totalWonEl = document.getElementById("totalWon");
const totalLossEl = document.getElementById("totalLoss");

// ==============================
// LOAD LEADS ON PAGE LOAD
// ==============================
document.addEventListener("DOMContentLoaded", loadLeads);

// ==============================
// ADD NEW LEAD
// ==============================
addLeadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const leadData = {
        companyName: companyNameInput.value,
        contactPerson: contactPersonInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        dealValue: dealValueInput.value
    };

    const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(leadData)
    });

    if (!res.ok) {
        alert("Add lead failed");
        return;
    }

    addLeadForm.reset();
    loadLeads();
});

// ==============================
// LOAD LEADS FROM SERVER
// ==============================
async function loadLeads() {
    clearColumns();

    const res = await fetch("/api/leads", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!res.ok) {
        alert("Failed to load leads");
        return;
    }

    const leads = await res.json();
    let totalDeal = 0;
    let totalWon = 0;
    let totalLoss = 0;

    leads.forEach(lead => {
        totalDeal += lead.dealValue;

        if (lead.status === "Won") totalWon += lead.dealValue;
        if (lead.status === "Lost") totalLoss += lead.dealValue;

        const card = createLeadCard(lead);

        if (lead.status === "Lead") leadColumn.appendChild(card);
        if (lead.status === "Contacted") contactedColumn.appendChild(card);
        if (lead.status === "Qualified") qualifiedColumn.appendChild(card);
        if (lead.status === "Proposal") proposalColumn.appendChild(card);
        if (lead.status === "Won") wonColumn.appendChild(card);
        if (lead.status === "Lost") lostColumn.appendChild(card);
    });

    totalDealAmountEl.innerText = "₹" + totalDeal;
    totalWonEl.innerText = "₹" + totalWon;
    totalLossEl.innerText = "₹" + totalLoss;
}

// ==============================
// CREATE LEAD CARD
// ==============================
function createLeadCard(lead) {
    const div = document.createElement("div");
    div.className = "lead-card";

    div.innerHTML = `
        <strong>${lead.companyName}</strong><br>
        ${lead.contactPerson}<br>
        ₹${lead.dealValue}<br><br>

        <select onchange="updateStatus('${lead._id}', this.value)">
            <option ${lead.status === "Lead" ? "selected" : ""}>Lead</option>
            <option ${lead.status === "Contacted" ? "selected" : ""}>Contacted</option>
            <option ${lead.status === "Qualified" ? "selected" : ""}>Qualified</option>
            <option ${lead.status === "Proposal" ? "selected" : ""}>Proposal</option>
            <option ${lead.status === "Won" ? "selected" : ""}>Won</option>
            <option ${lead.status === "Lost" ? "selected" : ""}>Lost</option>
        </select>

        <br><br>
        <button onclick="deleteLead('${lead._id}')" class="delete-btn">Delete</button>
    `;

    return div;
}

// ==============================
// UPDATE LEAD STATUS
// ==============================
async function updateStatus(id, status) {
    await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ status })
    });

    loadLeads();
}

// ==============================
// DELETE LEAD
// ==============================
async function deleteLead(id) {
    if (!confirm("Delete this lead?")) return;

    await fetch(`/api/leads/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadLeads();
}

// ==============================
// CLEAR UI COLUMNS
// ==============================
function clearColumns() {
    leadColumn.innerHTML = "";
    contactedColumn.innerHTML = "";
    qualifiedColumn.innerHTML = "";
    proposalColumn.innerHTML = "";
    wonColumn.innerHTML = "";
    lostColumn.innerHTML = "";
}
