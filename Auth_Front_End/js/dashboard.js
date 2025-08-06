$(document).ready(function () {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!token || !username || !role) {
        alert("You are not logged in. Redirecting to sign in...");
        window.location.href = "signin.html";
        return;
    }

    $(".welcome").text(`Welcome, ${username}`);
    $(".role").text(role.toUpperCase());


    if (role.toLowerCase() !== "admin") {
        $("#settingsIcon")
            .addClass("disabled")
            .css({
                "pointer-events": "none",
                "opacity": "0.5",
                "cursor": "not-allowed"
            })
            .attr("title", "You do not have access to settings");
    }

    $("#logoutForm").on("submit", function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "signin.html";
    });
});

function confirmLogout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.clear();
        window.location.href = "signin.html";
    }
}
