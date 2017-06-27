jQuery.extend(jQuery.validator.messages, {
    required: "Ce champ est requis.",
    remote: "Please fix this field.",
    email: "Veuillez renseigner une adresse mail valide.",
    url: "Veuillez entrer une URL valide.",
    date: "Veuillez entrer une date valide.",
    dateISO: "Veuillez entrer une date valide (ISO).",
    number: "Veuillez entrer un nombre.",
    digits: "Entrez seulement un chiffre.",
    creditcard: "Veuillez entrer un numéro de carte valide.",
    equalTo: "Veuillez entrer la même valeur.",
    accept: "Please enter a value with a valid extension.",
    maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
    minlength: jQuery.validator.format("Ce champ doit dépasser {0} characters."),
    rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
    range: jQuery.validator.format("Please enter a value between {0} and {1}."),
    max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
    min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});