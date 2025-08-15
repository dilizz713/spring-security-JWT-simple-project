function togglePassword() {
    const pwd = document.getElementById("password");
    pwd.type = (pwd.type === "password") ? "text" : "password";
}

$(document).ready(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();

        const username = $("#username").val().trim();
        const password = $("#password").val();

        if (!username || !password) {
            alert("Please fill in all fields.");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/auth/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username, password }),
            xhrFields: { withCredentials: true },
            success: function (res) {
                const data = res.data || {};
                const name = data.userName;
                const role = data.role;

                if (!name || !role) {
                    alert("Login successful, but missing required data.");
                    return;
                }

                sessionStorage.setItem("username", name);
                sessionStorage.setItem("role", role);

                window.location.href = "dashboard.html";
            },
            error: function (xhr) {
                let msg = "Login failed. Please try again.";
                if (xhr.responseJSON?.message) msg = xhr.responseJSON.message;

                if (xhr.status === 401 || xhr.status === 403) {
                    alert("Username or password incorrect. Please try again.");
                } else if (xhr.status === 404 || msg.toLowerCase().includes("not found")) {
                    alert("User not found. Redirecting to signup...");
                    setTimeout(() => location.href = "signup.html", 1200);
                } else {
                    alert(msg);
                }
            }
        });
    });
});
