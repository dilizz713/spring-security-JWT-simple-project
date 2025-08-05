function togglePassword() {
    const pwd = document.getElementById("password");
    pwd.type = (pwd.type === "password") ? "text" : "password";
}

$(document).ready(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();

        const username = $("#username").val().trim();
        const password = $("#password").val();
        const role = $("#role").val();

        if (!username || !password || !role) {
            alert("Please fill in all fields.");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/auth/register",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                password: password,
                role: role
            }),
            success: function (response) {
                alert(response.message);
                $("form")[0].reset();
                window.location.href = "signin.html";
            },
            error: function (xhr) {
                const errorMsg = xhr.responseJSON?.message || "Registration failed.";
                alert(errorMsg);
            }
        });
    });
});