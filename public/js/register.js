
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
        $("#btnId").addClass("actif");
        $("#btnPro").removeClass("actif");
    }

    function gotoProfil() {
        $("#account").hide();
        $("#btnId2").hide();
        $("#profil").show();
        $("#btnPro2").show();
        $("#btnPro").addClass("actif");
        $("#btnId").removeClass("actif");
    }

    $("#formAccount").validate({
        rules: {
            email: {
                required: true,
                email: true,
                remote: "/existuser"
            },
            password: {
                required: true,
                minlength:6
            },
            confirm_password: {
                required: true,
                equalTo: "#password",
                minlength:6
            }
        },
        messages: {
            password: {
                required: "Veuillez renseigner un mot de passe",
                minlength: "Ce champ doit dépasser 6 characters."
            },
            confirm_password: {
                required: "Veuillez renseigner un mot de passe",
                equalTo: "Les mots de passe ne sont pas identiques",
                minlength: "Ce champ doit dépasser 6 characters."
            },
            email: {
                required : "Veuillez renseigner une adresse mail valide",
                email : "Veuillez renseigner une adresse mail",
                remote : "Cet email est déjà utilisé."
            }
        }
    });

    $("#formRegister").validate({
        rules: {
            prenom: "required",
            nom: "required",
            date_naissance: "required",
            lieu_naissance: "required",
            adresse: "required",
            code_postal: "required",
            telephone: "required"
        }
    });

});