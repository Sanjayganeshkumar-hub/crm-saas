const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "/login.html";
}

const form = document.getElementById("addLeadForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        companyName: form.companyName.value,
        contactPerson: form.contactPerson.value,
        email: form.email.value,
        phone: form.phone.value,
        dealValue: form.dealValue.value
    };

    const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        location.reload();
    } else {
        alert("Add lead failed");
    }
});
