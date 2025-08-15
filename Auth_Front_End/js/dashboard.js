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

$(async function () {
    $.ajax({
        url: "http://localhost:8080/auth/validate",
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (res) {
            const data = res.data || {};
            const username = data.userName;
            const role = (data.role || "").toUpperCase();

            if (!username || !role) {
                redirectToLogin();
                return;
            }

            $(".welcome").text(`Welcome, ${username}`);
            $(".role").text(role);


            if (role === "USER") {
                const $settings = $(".icon-settings").closest("a,button");
                $settings.addClass("disabled").attr("aria-disabled", "true").css({
                    pointerEvents: "none",
                    opacity: 0.5
                }).attr("title", "Settings are restricted to ADMIN");
            }
        },
        error: function () {
            redirectToLogin();
        }
    });

    $("#logoutForm").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            url: "http://localhost:8080/auth/logout",
            type: "POST",
            xhrFields: { withCredentials: true },
            complete: function () {
                sessionStorage.clear();
                redirectToLogin();
            }
        });
    });
});

function redirectToLogin() {
    alert("You are not logged in. Redirecting to sign in...");
    window.location.href = "signin.html";
}


function confirmLogout() {
    if (confirm("Are you sure you want to log out?")) {
        $("#logoutForm").trigger("submit");
    }
}

