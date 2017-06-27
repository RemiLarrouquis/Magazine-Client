
$(function() {
    $("#btnPro,#suivant").on('click', function() {
        if ($("#formAccount").valid()) {
            copyAccountInfo();
            gotoProfil();
        }

    });
    $("#btnId,#precedent").on('click', function() {
        gotoAccount();
    });

    $("#submit").on('click', function() {
        if ($("#formRegister").valid()) {
            $("#formRegister").submit();
        }
    });

    function copyAccountInfo() {
        $("#accountEmail").val($("#email").val());
        $("#accountPassword").val($("#password").val());
        $("#accountConfirmPassword").val($("#confirm_password").val());
    }

    function gotoAccount() {
        $("#account").show();
        $("#btnId2").show();
        $("#profil").hide();
        $("#btnPro2").hide();
        $("#btnId").addClass("active");
        $("#btnPro").removeClass("active");
    }

    function gotoProfil() {
        $("#account").hide();
        $("#btnId2").hide();
        $("#profil").show();
        $("#btnPro2").show();
        $("#btnPro").addClass("active");
        $("#btnId").removeClass("active");
    }

    $("#formAccount").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            },
            confirm_password: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            password: {
                required: "Veuillez renseigner un mot de passe"
            },
            confirm_password: {
                required: "Veuillez renseigner un mot de passe",
                equalTo: "Les mots de passe ne sont pas identiques"
            },
            email: {
                required : "Veuillez renseigner une adresse mail valide",
                email : "Veuillez renseigner une adresse mail"
            }
        }
    });

    $("#formRegister").validate({
        rules: {
            prenom: "required",
            nom: "required",
            date_naissance: "required",
            lieu_naissance: "required"
        },
        messages: {
            prenom: 'Please enter your firstname',
            nom: 'Please enter your lastname',
            date_naissance: 'Please enter your lastname',
            lieu_naissance: 'Please enter your lastname'
        }
    });

});