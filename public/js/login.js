$(document).ready(function () {
    //my custom form validator plugin
    $('.emailForm').goValidate();

    //using bootstrap validator for form validation
    $("#studentLoginForm").bootstrapValidator();

    $('.logoutHarvardLogin').click(function () {
        sendLogoutHarvardLogin();
    });

    //js for logout from harvard ID
    function sendLogoutHarvardLogin() {
        $.ajax({
            url: "/api/logoutHarvardLogin",
            type: "POST",
            success: function () {
                window.location = "//" + window.location.hostname + ":" + window.location.port;
            }
        });
    }
});