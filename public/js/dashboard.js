document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addLeadForm");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    window.location.href = "/login.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      companyName: document.getElementById("companyName").value,
      contactPerson: document.getElementById("contactPerson").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      dealValue: document.getElementById("dealValue").value,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`   // 🔴 THIS WAS MISSING EARLIER
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      alert("Lead added successfully");
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Add lead failed");
    }
  });
});
