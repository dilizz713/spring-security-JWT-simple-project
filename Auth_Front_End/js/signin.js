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
            success: function (response) {
                const token = response.accessToken || response.data?.accessToken;
                const role = response.role || response.data?.role;
                const name = response.userName || response.data?.userName;

                if (!token || !role || !name) {
                    alert("Login successful, but missing required data.");
                    return;
                }


                localStorage.setItem("accessToken", token);
                localStorage.setItem("username", name);
                localStorage.setItem("role", role);

                console.log(token);
                console.log(name);
                console.log(role);

                alert("Login successful!");
                window.location.href = "dashboard.html";
            },
            error: function (xhr) {
                let errorMsg = "Login failed. Please try again.";

                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else if (xhr.responseText) {
                    try {
                        const json = JSON.parse(xhr.responseText);
                        errorMsg = json.message || errorMsg;
                    } catch (err) {

                    }
                }

                if (xhr.status === 401 || xhr.status === 403 || errorMsg.toLowerCase().includes("invalid")) {
                    alert("Username or password incorrect. Please try again.");
                } else if (xhr.status === 404 || errorMsg.toLowerCase().includes("not found")) {
                    alert("User not found. Redirecting to signup...");
                    setTimeout(() => {
                        window.location.href = "signup.html";
                    }, 1500);
                } else {
                    alert(errorMsg);
                }
            }
        });
    });
});
