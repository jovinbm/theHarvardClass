$(document).ready(function () {
    var socket = io.connect('//' + window.location.hostname);
    //my custom form validator plugin
    $('.emailForm').goValidate();

    /*the redirect url for logout
     the logout URL for temp production and development purposes(uncomment one)*/
    var logoutURL = "//" + window.location.hostname;
    //var logoutURL = "//" + window.location.hostname + ":3000";


    //INTERACTIONS

    //using bootstrap validator for form validation
    $("#studentLoginForm").bootstrapValidator();

    $('.logoutHarvardLogin').click(function () {
        sendLogoutHarvardLogin();
    });

    //FUNCTIONS

    //js for logout from harvard ID
    function sendLogoutHarvardLogin() {
        $.ajax({
            url: "/logoutHarvardLogin",
            type: "POST",
            success: function () {
                window.location = logoutURL;
            }
        });
    }
});