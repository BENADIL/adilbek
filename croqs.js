jQuery(document).ready(function () {
    var html = '<link rel="stylesheet" href="https://croqsapp.firebaseapp.com/css/croqs.css"><div id="croqs"><div id="croqs-wraper"><div id="croqs-container"><div id="croqs-screen" class="croqs-screen"></div><div id="croqs-close" onclick="croqs.exit()"></div></div></div><script type="text/html" id="croqs-identification"><form onsubmit="croqs.convert(event); return false;"><div id="croqs-error" class="croqs-error"></div><div class="croqs-row"><div id="croqs-first-wraper" class="croqs-field-wraper"><label class="croqs-field-label">%first%</label><div id="croqs-field-first" class="croqs-field"><input type="text" id="croqs-first" class="croqs-input" placeholder="%first%" tabindex="1" /><div class="croqs-field-icon croqs-icon-first"></div></div><div id="croqs-first-message" class="croqs-field-message"></div></div><div id="croqs-last-wraper" class="croqs-field-wraper"><label class="croqs-field-label">%last%</label><div id="croqs-field-last" class="croqs-field"><input type="text" id="croqs-last" class="croqs-input" placeholder="%last%" tabindex="2" /><div class="croqs-field-icon croqs-icon-last"></div></div><div id="croqs-last-message" class="croqs-field-message"></div></div></div><div class="croqs-row"><div id="croqs-email-wraper" class="croqs-field-wraper"><label class="croqs-field-label">%email%</label><div id="croqs-field-email" class="croqs-field"><input type="email" id="croqs-email" class="croqs-input" placeholder="%email%" tabindex="3" /><div class="croqs-field-icon croqs-icon-email"></div></div><div id="croqs-email-message" class="croqs-field-message"></div></div><div id="croqs-phone-wraper" class="croqs-field-wraper"><label class="croqs-field-label">%phone%</label><div id="croqs-field-phone" class="croqs-field"><input type="tel" id="croqs-phone" class="croqs-input" onkeypress="return croqs.isNumeric(event)" tabindex="4" /><div class="croqs-field-icon croqs-icon-phone"></div></div><div id="croqs-phone-message" class="croqs-field-message"></div></div></div><div id="croqs-accept-wraper" class="croqs-field-wraper"><div id="croqs-accept" class="croqs-accept"><div id="croqs-checkbox" class="croqs-checkbox" onclick="croqs.accept()" tabindex="5"></div>%conditions%</div><div id="croqs-accept-message" class="croqs-field-message"></div></div><div id="croqs-submit-wraper" class="croqs-field-wraper"><input type="submit" class="croqs-action" value="%submit%" tabindex="6" /></div><label class="croqs-small-label">%footer%</label></form></script><script type="text/html" id="croqs-confirmation"><div class="croqs-h1">%message%</div><div class="croqs-confirmation"><img src="https://croqsapp.firebaseapp.com/img/confirmation.png" width="128" height="128" alt="" /></div></script></div>';
    jQuery("body").append(html);
    croqs.init();
    setTimeout(croqs.failsafe, 2000);
});
function croqs(data,success,error) {
    croqs.data = data;
    croqs.successCallback = success || function () { };
    croqs.errorCallback = error || function () { };
};
croqs.init = function () {
    croqs.$screen = jQuery("#croqs-screen");
    croqs.$wraper = jQuery("#croqs-wraper");
    croqs.txt = croqs.labels[croqs.language];
    croqs.ready = true;
    croqs.show();
};
croqs.show = function () {
    if (croqs.ready && croqs.data && croqs.geoip) {
        var html = jQuery("#croqs-identification").html()
            .replace(/%first%/g, croqs.txt.first)
            .replace(/%last%/g, croqs.txt.last)
            .replace(/%email%/g, croqs.txt.email)
            .replace(/%phone%/g, croqs.txt.phone)
            .replace("%conditions%", croqs.txt.conditions)
            .replace("%submit%", croqs.txt.submit)
            .replace("%footer%", croqs.txt.footer);
        croqs.screen(html);
        croqs.initFirst();
        croqs.initLast();
        croqs.initEmail();
        croqs.initPhone();
        croqs.initAccept();
        croqs.$first.focus();
        if (!croqs.emailEnabled) {
            jQuery("#croqs-email-wraper").hide();
            croqs.emailRequired = false;
            croqs.inline = false;
        }
        if (!croqs.phoneEnabled) {
            jQuery("#croqs-phone-wraper").hide();
            croqs.phoneRequired = false;
            croqs.inline = false;
        }
        if (croqs.accepted) {
            jQuery("#croqs-accept").parent().hide();
        }
        if (croqs.inline) {
            jQuery(".croqs-row").children().addClass("croqs-inline");
        }
    }
};
croqs.failsafe = function () {
    if (croqs.data) {
        if (!croqs.ready || !croqs.geoip) {
            croqs.ready = croqs.geoip = true;
            croqs.show();
        }
    }
};
croqs.countryCode = "MA";
croqs.language = "fr";
croqs.accepted = false;
croqs.popup = true;
croqs.ready = false;
croqs.geoip = false;
croqs.inline = false;
croqs.emailRequired = true;
croqs.emailEnabled = true;
croqs.phoneRequired = true;
croqs.phoneEnabled = true;
croqs.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
croqs.gup = function (param) {
    return decodeURIComponent((new RegExp('[?|&]' + param + '=([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || "";
};
croqs.visit = {
    source: croqs.gup("utm_source"),
    campaign: croqs.gup("utm_campaign"),
    medium: croqs.gup("utm_medium"),
    term: croqs.gup("utm_term"),
    content: croqs.gup("utm_content"),
    _srvc: "visit"
};
jQuery.post("https://apicult.net/v1/describe", function () { }, "json").always(function (ip) {
    if (ip) {
        croqs.visit.country = croqs.countryCode = ip.country;
        croqs.visit.ip = ip.ip;
        croqs.visit.city = ip.city;
        croqs.visit.region = ip.region_name;
    }
    croqs({});
    //croqs.ajax(croqs.visit, "text", function (response) { croqs.visit.id = response; });
    croqs.geoip = true;
    croqs.show();
});
croqs.accept = function () {
    croqs.accepted = !croqs.accepted;
    if (croqs.accepted) {
        jQuery("#croqs-checkbox").addClass("croqs-checked");
    } else {
        jQuery("#croqs-checkbox").removeClass("croqs-checked");
    }
};
croqs.convert = function (event) {
    if (event) {
        event.preventDefault();
    }
    croqs.hideProgress();
    if (!croqs.first_valid) {
        croqs.message(croqs.txt.fill_first, "first");
        croqs.$first.focus();
    } else if (!croqs.last_valid) {
        croqs.message(croqs.txt.fill_last, "last");
        croqs.$last.focus();
    } else if (croqs.emailRequired && !croqs.email_valid) {
        croqs.message(croqs.txt.fill_email, "email");
        croqs.$email.focus();
    } else if (croqs.phoneRequired && !croqs.phone_valid) {
        croqs.message(croqs.txt.fill_phone, "phone");
        croqs.$phone.focus();
    } else if (!croqs.accepted) {
        croqs.message(croqs.txt.fill_accept, "accept");
        jQuery("#croqs-accept").focus();
    } else {
        croqs.showProgress();
        croqs.data._srvc = "submit";
        croqs.data.first = croqs.first;
        croqs.data.last = croqs.last;
        croqs.data.email = croqs.email;
        croqs.data.phone = croqs.phone;
        croqs.data.source = croqs.visit.source;
        croqs.data.campaign = croqs.visit.campaign;
        croqs.data.medium = croqs.visit.medium;
        croqs.data.term = croqs.visit.term;
        croqs.data.content = croqs.visit.content;
        croqs.data.ip = croqs.visit.ip;
        croqs.data.ip_city = croqs.visit.city;
        croqs.data.ip_region = croqs.visit.region;
        croqs.data.ip_country = croqs.visit.country;
        croqs.ajax(croqs.data, "text", croqs.convertSuccess, croqs.convertError);
    }
    return false;
};
croqs.convertSuccess = function () {
    var html = jQuery("#croqs-confirmation").html()
            .replace("%message%", croqs.txt.convert_success)
            .replace("%profile%", croqs.txt.profile)
            .replace("%signout%", croqs.txt.signout);
    croqs.screen(html);
    croqs.successCallback();
    croqs.first = croqs.last = croqs.email = croqs.phone = "";
    delete croqs.data;
};
croqs.convertError = function (jqXHR, textStatus, errorThrown) {
    croqs.error(jqXHR.responseText);
    croqs.errorCallback();
};
//-------------------------------------------------------INIT FIELDS--------------------------------------------------------
croqs.initEmail = function () {
    croqs.$emailField = jQuery("#croqs-field-email");
    croqs.$emailLabel = croqs.$emailField.siblings("label");
    croqs.$email = jQuery("#croqs-email");
    croqs.$email.val(croqs.email);
    croqs.$email.on("change keyup input paste", function () {
        var newval = jQuery.trim(croqs.$email.val());
        if(croqs.email == newval) return;
        croqs.email = newval;
        croqs.email_valid = croqs.emailRegex.test(croqs.email);
        if (croqs.email_valid) {
            croqs.$emailField.addClass("croqs-field-success");
            jQuery("#croqs-email-message").html("");
        } else {
            croqs.$emailField.removeClass("croqs-field-success");
        }
        if (croqs.email.length > 0) {
            croqs.$emailLabel.addClass("croqs-field-label-visible");
        } else {
            croqs.$emailLabel.removeClass("croqs-field-label-visible");
        }
    });
    croqs.$email.blur(function () {
        if (!croqs.email_valid) {
            croqs.$emailField.addClass("croqs-field-error");
        }
    });
    croqs.$email.change();
};
croqs.initFirst = function () {
    croqs.$firstField = jQuery("#croqs-field-first");
    croqs.$firstLabel = croqs.$firstField.siblings("label");
    croqs.$first = jQuery("#croqs-first");
    croqs.$first.val(croqs.first);
    croqs.$first.on("change keyup input paste", function () {
        var newval = jQuery.trim(croqs.$first.val()).toUpperCase();
        if(croqs.first == newval) return;
        croqs.first = newval;
    	croqs.first_valid = false;
        if (croqs.first.length > 1) {
            croqs.$firstField.removeClass("croqs-field-error").addClass("croqs-field-success");
            jQuery("#croqs-first-message").html("");
            croqs.first_valid = true;
        } else {
            croqs.$firstField.removeClass("croqs-field-success");
            croqs.first_valid = false;
        }
        if (croqs.first.length > 0) {
            croqs.$firstLabel.addClass("croqs-field-label-visible");
        } else {
            croqs.$firstLabel.removeClass("croqs-field-label-visible");
        }
    });
    croqs.$first.blur(function () {
        if (croqs.first.length > 0 && croqs.first.length < 2) {
            croqs.$firstField.addClass("croqs-field-error");
        }
    });
    croqs.$first.change();
};
croqs.initLast = function () {
    croqs.$lastField = jQuery("#croqs-field-last");
    croqs.$lastLabel = croqs.$lastField.siblings("label");
    croqs.$last = jQuery("#croqs-last");
    croqs.$last.val(croqs.last);
    croqs.$last.on("change keyup input paste", function () {
        var newval = jQuery.trim(croqs.$last.val()).toUpperCase();
        if(croqs.last == newval) return;
        croqs.last = newval;
        croqs.last_valid = false;
        if (croqs.last.length > 1) {
            croqs.$lastField.removeClass("croqs-field-error").addClass("croqs-field-success");
            jQuery("#croqs-last-message").html("");
            croqs.last_valid = true;
        } else {
            croqs.$lastField.removeClass("croqs-field-success");
            croqs.last_valid = false;
        }
        if (croqs.last.length > 0) {
            croqs.$lastLabel.addClass("croqs-field-label-visible");
        } else {
            croqs.$lastLabel.removeClass("croqs-field-label-visible");
        }
    });
    croqs.$last.blur(function () {
        if (croqs.last.length > 0 && croqs.last.length < 2) {
            croqs.$lastField.addClass("croqs-field-error");
        }
    });
    croqs.$last.change();
};
croqs.initPhone = function () {
    croqs.$phoneField = jQuery("#croqs-field-phone");
    croqs.$phoneLabel = croqs.$phoneField.siblings("label");
    croqs.$phone = jQuery("#croqs-phone");
    croqs.$phone.intlTelInput({
        formatOnDisplay: true,
        initialCountry: croqs.countryCode,
        preferredCountries: [],
        separateDialCode: true
    });
    if(croqs.phone && croqs.phone.length > 0)
        croqs.$phone.intlTelInput("setNumber",croqs.phone);
    croqs.$phone.on("change keyup input paste", function () {
        var newval = croqs.$phone.intlTelInput("getNumber");
        if(croqs.phone == newval) return;
        croqs.phone = newval;
        croqs.phone_valid = croqs.$phone.intlTelInput("isValidNumber");
        if (croqs.phone_valid) {
            croqs.$phoneField.removeClass("croqs-field-error").addClass("croqs-field-success");
            jQuery("#croqs-phone-message").html("");
        } else {
            croqs.$phoneField.removeClass("croqs-field-success");
        }
        if (croqs.$phone.val().length > 0) {
            croqs.$phoneLabel.addClass("croqs-field-label-visible");
        } else {
            croqs.$phoneLabel.removeClass("croqs-field-label-visible");
        }
    });
    croqs.$phone.blur(function () {
        if (croqs.phone && croqs.phone.length > 0 && !croqs.phone_valid) {
            croqs.$phoneField.addClass("croqs-field-error");
        }
    });
    croqs.$phone.change();
};
croqs.initAccept = function () {
    if (croqs.accepted) {
        jQuery("#croqs-checkbox").addClass("croqs-checked");
    } else {
        jQuery("#croqs-checkbox").removeClass("croqs-checked");
    }
    jQuery("#croqs-checkbox").keydown(function (event) {
        if (event.which == 32) {
            event.preventDefault();
            croqs.accept();
        }
    });
}
//-------------------------------------------------------UTILS--------------------------------------------------------
croqs.ajax = function (data, type, success, error) {
    //https://croqsapp.appspot.com/app
	jQuery.ajax({
        url: "http://localhost:8080/croqs/app",
        data: data,
        success: success,
        error: (error || croqs.ajaxError),
        dataType: (type || "text"),
        type: "POST",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    });
};
croqs.ajaxError = function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status == 0) {
        croqs.error(croqs.txt.no_connection);
    } else {
        croqs.error("Erreur " + jqXHR.status + " : " + jqXHR.responseText);
    }
    croqs.hideProgress();
};
croqs.showProgress = function () {
    jQuery(".croqs-action").addClass("croqs-action-progress").attr('disabled', 'disabled');
    clearTimeout(croqs.progressHandle);
    croqs.progressHandle = setTimeout(croqs.hideProgress, 30000);
};
croqs.hideProgress = function () {
    clearTimeout(croqs.progressHandle);
    jQuery(".croqs-action").removeClass("croqs-action-progress").removeAttr('disabled');
};
croqs.exit = function () {
    croqs.$wraper.hide();
};
croqs.error = function (error) {
    jQuery("#croqs-error").html(error);
};
croqs.message = function (text,field) {
    jQuery("#croqs-" + field + "-message").html(text);
};
croqs.screen = function (html) {
    if (jQuery("#croqs-form").length) {
        croqs.$screen.appendTo('#croqs-form');
        croqs.popup = false;
    } else {
        croqs.$screen.appendTo('#croqs-container');
        croqs.popup = true;
    }
    croqs.$screen.html(html);
    if (croqs.popup) croqs.$wraper.show();
    croqs.error("");
};
croqs.isNumeric = function (event) {
    var keyCode = (event.which) ? event.which : event.keyCode
    keyChar = String.fromCharCode(keyCode);
    if (keyCode > 31 && "0123456789+".indexOf(keyChar) == -1) return false;
    return true;
};
croqs.set = function (options) {
    if (!options) return;
    if (options.hasOwnProperty("country")) croqs.countryCode = options.country;
    if (options.hasOwnProperty("language")) croqs.language = options.language;
    if (options.hasOwnProperty("inline")) croqs.inline = options.inline;
    if (options.hasOwnProperty("accepted")) croqs.accepted = options.accepted;
    if (options.labels) {
        for (var label in options.labels) {
            croqs.labels[options.language][label] = options.labels[label];
        }
        croqs.txt = croqs.labels[croqs.language];
    }
};
croqs.labels = {
    fr: {
        fill_first: "Veuillez saisir votre prénom",
        fill_last: "Veuillez saisir votre nom de famille",
        fill_email: "Veuillez renseigner une adresse email valide",
        fill_phone: "Veuillez renseigner un numéro de téléphone valide",
        fill_accept: "Veuillez cocher l'acceptation des conditions d'utilisation",
        first: "PRÉNOM",
        last: "NOM DE FAMILLE",
        email: "ADRESSE EMAIL",
        phone: "TÉLÉPHONE",
        conditions: "J'accepte la <a href='/privacy.html' target='_blank'>politique de confidentialité</a>.",
        no_connection: "Pas de connexion internet. Veuillez verifier vos paramètres de connexion",
        convert_success: "Vos informations ont bien été enregistré",
        submit: "Confirmer",
        footer: ""
        },
    en: {
        fill_first: "Please fill in your first name",
        fill_last: "Please fill in your last name",
        fill_email: "Please fill in a valid email address",
        fill_phone: "Please fill in a valid phone number",
        fill_accept: "Please accept the privacy policy",
        first: "FIRST NAME",
        last: "LAST NAME",
        email: "EMAIL ADDRESS",
        phone: "PHONE",
        conditions: "I accept the <a href='/privacy.html' target='_blank'>privacy policy</a>",
        no_connection: "No internet connection. Please check your settings",
        convert_success: "Your personal data was saved.",
        submit: "Submit",
        footer: ""
    }
};
croqs.countries = {
    "": " ",
    "AF": "Afghanistan",
    "ZA": "Afrique du Sud",
    "AL": "Albanie",
    "DZ": "Algérie",
    "DE": "Allemagne",
    "AD": "Andorre",
    "AO": "Angola",
    "AI": "Anguilla",
    "SA": "Arabie saoudite",
    "AR": "Argentine",
    "AM": "Arménie",
    "AW": "Aruba",
    "AU": "Australie",
    "AT": "Autriche",
    "AZ": "Azerbaïdjan",
    "BS": "Bahamas",
    "BH": "Bahreïn",
    "BD": "Bangladesh",
    "BB": "Barbade",
    "BY": "Bélarus",
    "BE": "Belgique",
    "BZ": "Belize",
    "BJ": "Bénin",
    "BM": "Bermudes",
    "BT": "Bhoutan",
    "BO": "Bolivie",
    "BA": "Bosnie-Herzégovine",
    "BW": "Botswana",
    "BR": "Brésil",
    "BN": "Brunei Darussalam",
    "BG": "Bulgarie",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "KH": "Cambodge",
    "CM": "Cameroun",
    "CA": "Canada",
    "CV": "Cap-Vert",
    "CL": "Chili",
    "CN": "Chine",
    "CY": "Chypre",
    "CO": "Colombie",
    "KM": "Comores",
    "CG": "Congo",
    "CD": "Congo  (RDC)",
    "KP": "Corée du Nord",
    "KR": "Corée du Sud",
    "CR": "Costa Rica",
    "CI": "Côte d'Ivoire",
    "HR": "Croatie",
    "CU": "Cuba",
    "DK": "Danemark",
    "DJ": "Djibouti",
    "DM": "Dominique",
    "EG": "Égypte",
    "SV": "El Salvador",
    "AE": "Émirats arabes unis",
    "EC": "Équateur",
    "ER": "Érythrée",
    "ES": "Espagne",
    "EE": "Estonie",
    "US": "États-Unis",
    "ET": "Éthiopie",
    "FJ": "Fidji",
    "FI": "Finlande",
    "FR": "France",
    "GA": "Gabon",
    "GM": "Gambie",
    "GE": "Géorgie",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Grèce",
    "GD": "Grenade",
    "GL": "Groenland",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GN": "Guinée",
    "GQ": "Guinée équatoriale",
    "GW": "Guinée-Bissau",
    "GY": "Guyana",
    "GF": "Guyane française",
    "HT": "Haïti",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hongrie",
    "IN": "Inde",
    "ID": "Indonésie",
    "IQ": "Irak",
    "IR": "Iran",
    "IE": "Irlande",
    "IS": "Islande",
    "IL": "Israël",
    "IT": "Italie",
    "JM": "Jamaïque",
    "JP": "Japon",
    "JO": "Jordanie",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KG": "Kirghizistan",
    "KI": "Kiribati",
    "XK": "Kosovo",
    "KW": "Koweït",
    "LA": "Laos",
    "LS": "Lesotho",
    "LV": "Lettonie",
    "LB": "Liban",
    "LR": "Libéria",
    "LY": "Libye",
    "LI": "Liechtenstein",
    "LT": "Lituanie",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MK": "Macédoine",
    "MG": "Madagascar",
    "MY": "Malaisie",
    "MW": "Malawi",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malte",
    "MA": "Maroc",
    "MQ": "Martinique",
    "MU": "Maurice",
    "MR": "Mauritanie",
    "YT": "Mayotte",
    "MX": "Mexique",
    "FM": "Micronésie",
    "MD": "Moldavie",
    "MC": "Monaco",
    "MN": "Mongolie",
    "ME": "Monténégro",
    "MS": "Montserrat",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibie",
    "NR": "Nauru",
    "NP": "Népal",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NO": "Norvège",
    "NC": "Nouvelle-Calédonie",
    "NZ": "Nouvelle-Zélande",
    "OM": "Oman",
    "UG": "Ouganda",
    "UZ": "Ouzbékistan",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine",
    "PA": "Panama",
    "PG": "Papouasie-Nouvelle-Guinée",
    "PY": "Paraguay",
    "NL": "Pays-Bas",
    "PE": "Pérou",
    "PH": "Philippines",
    "PL": "Pologne",
    "PF": "Polynésie française",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "CF": "République centrafricaine",
    "DO": "République dominicaine",
    "CZ": "République tchèque",
    "RE": "Réunion",
    "RO": "Roumanie",
    "GB": "Royaume-Uni",
    "RU": "Russie",
    "RW": "Rwanda",
    "WS": "Samoa",
    "AS": "Samoa américaine",
    "ST": "Sao Tomé-et-Principe",
    "SN": "Sénégal",
    "RS": "Serbie",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapour",
    "SK": "Slovaquie",
    "SI": "Slovénie",
    "SO": "Somalie",
    "SD": "Soudan",
    "SS": "Soudan du Sud",
    "LK": "Sri Lanka",
    "SE": "Suède",
    "CH": "Suisse",
    "SR": "Suriname",
    "SZ": "Swaziland",
    "SY": "Syrie",
    "TJ": "Tadjikistan",
    "TW": "Taïwan",
    "TZ": "Tanzanie",
    "TD": "Tchad",
    "TH": "Thaïlande",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinité-et-Tobago",
    "TN": "Tunisie",
    "TM": "Turkménistan",
    "TR": "Turquie",
    "TV": "Tuvalu",
    "UA": "Ukraine",
    "UY": "Uruguay",
    "VU": "Vanuatu",
    "VA": "Vatican",
    "VE": "Venezuela",
    "VN": "Vietnam",
    "YE": "Yémen",
    "ZM": "Zambie",
    "ZW": "Zimbabwe"
};

(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], function ($) {
            factory($, window, document);
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"), window, document);
    } else {
        factory(jQuery, window, document);
    }
})(function ($, window, document, undefined) {
    "use strict";
    var pluginName = "intlTelInput",
        id = 1,
        defaults = {
            allowDropdown: true,
            autoHideDialCode: true,
            autoPlaceholder: "polite",
            customPlaceholder: null,
            dropdownContainer: "",
            excludeCountries: [],
            formatOnDisplay: true,
            geoIpLookup: null,
            initialCountry: "",
            nationalMode: true,
            onlyCountries: [],
            placeholderNumberType: "MOBILE",
            preferredCountries: [],
            separateDialCode: false,
            utilsScript: "https://croqsapp.firebaseapp.com/js/utils.js"
        },
        keys = {
            UP: 38,
            DOWN: 40,
            ENTER: 13,
            ESC: 27,
            PLUS: 43,
            A: 65,
            Z: 90,
            SPACE: 32,
            TAB: 9
        },
        regionlessNanpNumbers = ["800", "822", "833", "844", "855", "866", "877", "880", "881", "882", "883", "884", "885", "886", "887", "888", "889"];
    $(window).on("load", function () {
        $.fn[pluginName].windowLoaded = true;
    });

    function Plugin(element, options) {
        this.telInput = $(element);
        this.options = $.extend({}, defaults, options);
        this.ns = "." + pluginName + id++;
        this.isGoodBrowser = Boolean(element.setSelectionRange);
        this.hadInitialPlaceholder = Boolean($(element).attr("placeholder"));
    }
    Plugin.prototype = {
        _init: function () {
            if (this.options.nationalMode) {
                this.options.autoHideDialCode = false;
            }
            if (this.options.separateDialCode) {
                this.options.autoHideDialCode = this.options.nationalMode = false;
            }
            this.isMobile = /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (this.isMobile) {
                $("body").addClass("iti-mobile");
                if (!this.options.dropdownContainer) {
                    this.options.dropdownContainer = "body";
                }
            }
            this.autoCountryDeferred = new $.Deferred();
            this.utilsScriptDeferred = new $.Deferred();
            this.selectedCountryData = {};
            this._processCountryData();
            this._generateMarkup();
            this._setInitialState();
            this._initListeners();
            this._initRequests();
            return [this.autoCountryDeferred, this.utilsScriptDeferred];
        },
        _processCountryData: function () {
            this._processAllCountries();
            this._processCountryCodes();
            this._processPreferredCountries();
        },
        _addCountryCode: function (iso2, dialCode, priority) {
            if (!(dialCode in this.countryCodes)) {
                this.countryCodes[dialCode] = [];
            }
            var index = priority || 0;
            this.countryCodes[dialCode][index] = iso2;
        },
        _filterCountries: function (countryArray, processFunc) {
            var i;
            for (i = 0; i < countryArray.length; i++) {
                countryArray[i] = countryArray[i].toLowerCase();
            }
            this.countries = [];
            for (i = 0; i < allCountries.length; i++) {
                if (processFunc($.inArray(allCountries[i].iso2, countryArray))) {
                    this.countries.push(allCountries[i]);
                }
            }
        },
        _processAllCountries: function () {
            if (this.options.onlyCountries.length) {
                this._filterCountries(this.options.onlyCountries, function (arrayPos) {
                    return arrayPos > -1;
                });
            } else if (this.options.excludeCountries.length) {
                this._filterCountries(this.options.excludeCountries, function (arrayPos) {
                    return arrayPos == -1;
                });
            } else {
                this.countries = allCountries;
            }
        },
        _processCountryCodes: function () {
            this.countryCodes = {};
            for (var i = 0; i < this.countries.length; i++) {
                var c = this.countries[i];
                this._addCountryCode(c.iso2, c.dialCode, c.priority);
                if (c.areaCodes) {
                    for (var j = 0; j < c.areaCodes.length; j++) {
                        this._addCountryCode(c.iso2, c.dialCode + c.areaCodes[j]);
                    }
                }
            }
        },
        _processPreferredCountries: function () {
            this.preferredCountries = [];
            for (var i = 0; i < this.options.preferredCountries.length; i++) {
                var countryCode = this.options.preferredCountries[i].toLowerCase(),
                    countryData = this._getCountryData(countryCode, false, true);
                if (countryData) {
                    this.preferredCountries.push(countryData);
                }
            }
        },
        _generateMarkup: function () {
            this.telInput.attr("autocomplete", "off");
            var parentClass = "intl-tel-input";
            if (this.options.allowDropdown) {
                parentClass += " allow-dropdown";
            }
            if (this.options.separateDialCode) {
                parentClass += " separate-dial-code";
            }
            this.telInput.wrap($("<div>", {
                "class": parentClass
            }));
            this.flagsContainer = $("<div>", {
                "class": "flag-container"
            }).insertBefore(this.telInput);
            var selectedFlag = $("<div>", {
                "class": "selected-flag"
            });
            selectedFlag.appendTo(this.flagsContainer);
            this.selectedFlagInner = $("<div>", {
                "class": "iti-flag"
            }).appendTo(selectedFlag);
            if (this.options.separateDialCode) {
                this.selectedDialCode = $("<div>", {
                    "class": "selected-dial-code"
                }).appendTo(selectedFlag);
            }
            if (this.options.allowDropdown) {
                selectedFlag.attr("tabindex", "0");
                $("<div>", {
                    "class": "iti-arrow"
                }).appendTo(selectedFlag);
                this.countryList = $("<ul>", {
                    "class": "country-list hide"
                });
                if (this.preferredCountries.length) {
                    this._appendListItems(this.preferredCountries, "preferred");
                    $("<li>", {
                        "class": "divider"
                    }).appendTo(this.countryList);
                }
                this._appendListItems(this.countries, "");
                this.countryListItems = this.countryList.children(".country");
                if (this.options.dropdownContainer) {
                    this.dropdown = $("<div>", {
                        "class": "intl-tel-input iti-container"
                    }).append(this.countryList);
                } else {
                    this.countryList.appendTo(this.flagsContainer);
                }
            } else {
                this.countryListItems = $();
            }
        },
        _appendListItems: function (countries, className) {
            var tmp = "";
            for (var i = 0; i < countries.length; i++) {
                var c = countries[i];
                tmp += "<li class='country " + className + "' data-dial-code='" + c.dialCode + "' data-country-code='" + c.iso2 + "'>";
                tmp += "<div class='flag-box'><div class='iti-flag " + c.iso2 + "'></div></div>";
                tmp += "<span class='country-name'>" + c.name + "</span>";
                tmp += "<span class='dial-code'>+" + c.dialCode + "</span>";
                tmp += "</li>";
            }
            this.countryList.append(tmp);
        },
        _setInitialState: function () {
            var val = this.telInput.val();
            if (this._getDialCode(val) && !this._isRegionlessNanp(val)) {
                this._updateFlagFromNumber(val);
            } else if (this.options.initialCountry !== "auto") {
                if (this.options.initialCountry) {
                    this._setFlag(this.options.initialCountry.toLowerCase());
                } else {
                    this.defaultCountry = this.preferredCountries.length ? this.preferredCountries[0].iso2 : this.countries[0].iso2;
                    if (!val) {
                        this._setFlag(this.defaultCountry);
                    }
                }
                if (!val && !this.options.nationalMode && !this.options.autoHideDialCode && !this.options.separateDialCode) {
                    this.telInput.val("+" + this.selectedCountryData.dialCode);
                }
            }
            if (val) {
                this._updateValFromNumber(val);
            }
        },
        _initListeners: function () {
            this._initKeyListeners();
            if (this.options.autoHideDialCode) {
                this._initFocusListeners();
            }
            if (this.options.allowDropdown) {
                this._initDropdownListeners();
            }
        },
        _initDropdownListeners: function () {
            var that = this;
            var label = this.telInput.closest("label");
            if (label.length) {
                label.on("click" + this.ns, function (e) {
                    if (that.countryList.hasClass("hide")) {
                        that.telInput.focus();
                    } else {
                        e.preventDefault();
                    }
                });
            }
            var selectedFlag = this.selectedFlagInner.parent();
            selectedFlag.on("click" + this.ns, function (e) {
                if (that.countryList.hasClass("hide") && !that.telInput.prop("disabled") && !that.telInput.prop("readonly")) {
                    that._showDropdown();
                }
            });
            this.flagsContainer.on("keydown" + that.ns, function (e) {
                var isDropdownHidden = that.countryList.hasClass("hide");
                if (isDropdownHidden && (e.which == keys.UP || e.which == keys.DOWN || e.which == keys.SPACE || e.which == keys.ENTER)) {
                    e.preventDefault();
                    e.stopPropagation();
                    that._showDropdown();
                }
                if (e.which == keys.TAB) {
                    that._closeDropdown();
                }
            });
        },
        _initRequests: function () {
            var that = this;
            if (this.options.utilsScript) {
                if ($.fn[pluginName].windowLoaded) {
                    $.fn[pluginName].loadUtils(this.options.utilsScript, this.utilsScriptDeferred);
                } else {
                    $(window).on("load", function () {
                        $.fn[pluginName].loadUtils(that.options.utilsScript, that.utilsScriptDeferred);
                    });
                }
            } else {
                this.utilsScriptDeferred.resolve();
            }
            if (this.options.initialCountry === "auto") {
                this._loadAutoCountry();
            } else {
                this.autoCountryDeferred.resolve();
            }
        },
        _loadAutoCountry: function () {
            var that = this;
            if ($.fn[pluginName].autoCountry) {
                this.handleAutoCountry();
            } else if (!$.fn[pluginName].startedLoadingAutoCountry) {
                $.fn[pluginName].startedLoadingAutoCountry = true;
                if (typeof this.options.geoIpLookup === "function") {
                    this.options.geoIpLookup(function (countryCode) {
                        $.fn[pluginName].autoCountry = countryCode.toLowerCase();
                        setTimeout(function () {
                            $(".intl-tel-input input").intlTelInput("handleAutoCountry");
                        });
                    });
                }
            }
        },
        _initKeyListeners: function () {
            var that = this;
            this.telInput.on("keyup" + this.ns, function () {
                if (that._updateFlagFromNumber(that.telInput.val())) {
                    that._triggerCountryChange();
                }
            });
            this.telInput.on("cut" + this.ns + " paste" + this.ns, function () {
                setTimeout(function () {
                    if (that._updateFlagFromNumber(that.telInput.val())) {
                        that._triggerCountryChange();
                    }
                });
            });
        },
        _cap: function (number) {
            var max = this.telInput.attr("maxlength");
            return max && number.length > max ? number.substr(0, max) : number;
        },
        _initFocusListeners: function () {
            var that = this;
            this.telInput.on("mousedown" + this.ns, function (e) {
                if (!that.telInput.is(":focus") && !that.telInput.val()) {
                    e.preventDefault();
                    that.telInput.focus();
                }
            });
            this.telInput.on("focus" + this.ns, function (e) {
                if (!that.telInput.val() && !that.telInput.prop("readonly") && that.selectedCountryData.dialCode) {
                    that.telInput.val("+" + that.selectedCountryData.dialCode);
                    that.telInput.one("keypress.plus" + that.ns, function (e) {
                        if (e.which == keys.PLUS) {
                            that.telInput.val("");
                        }
                    });
                    setTimeout(function () {
                        var input = that.telInput[0];
                        if (that.isGoodBrowser) {
                            var len = that.telInput.val().length;
                            input.setSelectionRange(len, len);
                        }
                    });
                }
            });
            var form = this.telInput.prop("form");
            if (form) {
                $(form).on("submit" + this.ns, function () {
                    that._removeEmptyDialCode();
                });
            }
            this.telInput.on("blur" + this.ns, function () {
                that._removeEmptyDialCode();
            });
        },
        _removeEmptyDialCode: function () {
            var value = this.telInput.val(),
                startsPlus = value.charAt(0) == "+";
            if (startsPlus) {
                var numeric = this._getNumeric(value);
                if (!numeric || this.selectedCountryData.dialCode == numeric) {
                    this.telInput.val("");
                }
            }
            this.telInput.off("keypress.plus" + this.ns);
        },
        _getNumeric: function (s) {
            return s.replace(/\D/g, "");
        },
        _showDropdown: function () {
            this._setDropdownPosition();
            var activeListItem = this.countryList.children(".active");
            if (activeListItem.length) {
                this._highlightListItem(activeListItem);
                this._scrollTo(activeListItem);
            }
            this._bindDropdownListeners();
            this.selectedFlagInner.children(".iti-arrow").addClass("up");
        },
        _setDropdownPosition: function () {
            var that = this;
            if (this.options.dropdownContainer) {
                this.dropdown.appendTo(this.options.dropdownContainer);
            }
            this.dropdownHeight = this.countryList.removeClass("hide").outerHeight();
            if (!this.isMobile) {
                var pos = this.telInput.offset(),
                    inputTop = pos.top,
                    windowTop = $(window).scrollTop(),
                    dropdownFitsBelow = inputTop + this.telInput.outerHeight() + this.dropdownHeight < windowTop + $(window).height(),
                    dropdownFitsAbove = inputTop - this.dropdownHeight > windowTop;
                this.countryList.toggleClass("dropup", !dropdownFitsBelow && dropdownFitsAbove);
                if (this.options.dropdownContainer) {
                    var extraTop = !dropdownFitsBelow && dropdownFitsAbove ? 0 : this.telInput.innerHeight();
                    this.dropdown.css({
                        top: inputTop + extraTop,
                        left: pos.left
                    });
                    $(window).on("scroll" + this.ns, function () {
                        that._closeDropdown();
                    });
                }
            }
        },
        _bindDropdownListeners: function () {
            var that = this;
            this.countryList.on("mouseover" + this.ns, ".country", function (e) {
                that._highlightListItem($(this));
            });
            this.countryList.on("click" + this.ns, ".country", function (e) {
                that._selectListItem($(this));
            });
            var isOpening = true;
            $("html").on("click" + this.ns, function (e) {
                if (!isOpening) {
                    that._closeDropdown();
                }
                isOpening = false;
            });
            var query = "",
                queryTimer = null;
            $(document).on("keydown" + this.ns, function (e) {
                e.preventDefault();
                if (e.which == keys.UP || e.which == keys.DOWN) {
                    that._handleUpDownKey(e.which);
                } else if (e.which == keys.ENTER) {
                    that._handleEnterKey();
                } else if (e.which == keys.ESC) {
                    that._closeDropdown();
                } else if (e.which >= keys.A && e.which <= keys.Z || e.which == keys.SPACE) {
                    if (queryTimer) {
                        clearTimeout(queryTimer);
                    }
                    query += String.fromCharCode(e.which);
                    that._searchForCountry(query);
                    queryTimer = setTimeout(function () {
                        query = "";
                    }, 1e3);
                }
            });
        },
        _handleUpDownKey: function (key) {
            var current = this.countryList.children(".highlight").first();
            var next = key == keys.UP ? current.prev() : current.next();
            if (next.length) {
                if (next.hasClass("divider")) {
                    next = key == keys.UP ? next.prev() : next.next();
                }
                this._highlightListItem(next);
                this._scrollTo(next);
            }
        },
        _handleEnterKey: function () {
            var currentCountry = this.countryList.children(".highlight").first();
            if (currentCountry.length) {
                this._selectListItem(currentCountry);
            }
        },
        _searchForCountry: function (query) {
            for (var i = 0; i < this.countries.length; i++) {
                if (this._startsWith(this.countries[i].name, query)) {
                    var listItem = this.countryList.children("[data-country-code=" + this.countries[i].iso2 + "]").not(".preferred");
                    this._highlightListItem(listItem);
                    this._scrollTo(listItem, true);
                    break;
                }
            }
        },
        _startsWith: function (a, b) {
            return a.substr(0, b.length).toUpperCase() == b;
        },
        _updateValFromNumber: function (number) {
            if (this.options.formatOnDisplay && window.intlTelInputUtils && this.selectedCountryData) {
                var format = !this.options.separateDialCode && (this.options.nationalMode || number.charAt(0) != "+") ? intlTelInputUtils.numberFormat.NATIONAL : intlTelInputUtils.numberFormat.INTERNATIONAL;
                number = intlTelInputUtils.formatNumber(number, this.selectedCountryData.iso2, format);
            }
            number = this._beforeSetNumber(number);
            this.telInput.val(number);
        },
        _updateFlagFromNumber: function (number) {
            if (number && this.options.nationalMode && this.selectedCountryData.dialCode == "1" && number.charAt(0) != "+") {
                if (number.charAt(0) != "1") {
                    number = "1" + number;
                }
                number = "+" + number;
            }
            var dialCode = this._getDialCode(number),
                countryCode = null,
                numeric = this._getNumeric(number);
            if (dialCode) {
                var countryCodes = this.countryCodes[this._getNumeric(dialCode)],
                    alreadySelected = $.inArray(this.selectedCountryData.iso2, countryCodes) > -1,
                    isNanpAreaCode = dialCode == "+1" && numeric.length >= 4,
                    nanpSelected = this.selectedCountryData.dialCode == "1";
                if (!(nanpSelected && this._isRegionlessNanp(numeric)) && (!alreadySelected || isNanpAreaCode)) {
                    for (var j = 0; j < countryCodes.length; j++) {
                        if (countryCodes[j]) {
                            countryCode = countryCodes[j];
                            break;
                        }
                    }
                }
            } else if (number.charAt(0) == "+" && numeric.length) {
                countryCode = "";
            } else if (!number || number == "+") {
                countryCode = this.defaultCountry;
            }
            if (countryCode !== null) {
                return this._setFlag(countryCode);
            }
            return false;
        },
        _isRegionlessNanp: function (number) {
            var numeric = this._getNumeric(number);
            if (numeric.charAt(0) == "1") {
                var areaCode = numeric.substr(1, 3);
                return $.inArray(areaCode, regionlessNanpNumbers) > -1;
            }
            return false;
        },
        _highlightListItem: function (listItem) {
            this.countryListItems.removeClass("highlight");
            listItem.addClass("highlight");
        },
        _getCountryData: function (countryCode, ignoreOnlyCountriesOption, allowFail) {
            var countryList = ignoreOnlyCountriesOption ? allCountries : this.countries;
            for (var i = 0; i < countryList.length; i++) {
                if (countryList[i].iso2 == countryCode) {
                    return countryList[i];
                }
            }
            if (allowFail) {
                return null;
            } else {
                throw new Error("No country data for '" + countryCode + "'");
            }
        },
        _setFlag: function (countryCode) {
            var prevCountry = this.selectedCountryData.iso2 ? this.selectedCountryData : {};
            this.selectedCountryData = countryCode ? this._getCountryData(countryCode, false, false) : {};
            if (this.selectedCountryData.iso2) {
                this.defaultCountry = this.selectedCountryData.iso2;
            }
            this.selectedFlagInner.attr("class", "iti-flag " + countryCode);
            var title = countryCode ? this.selectedCountryData.name + ": +" + this.selectedCountryData.dialCode : "Unknown";
            this.selectedFlagInner.parent().attr("title", title);
            if (this.options.separateDialCode) {
                var dialCode = this.selectedCountryData.dialCode ? "+" + this.selectedCountryData.dialCode : "",
                    parent = this.telInput.parent();
                if (prevCountry.dialCode) {
                    parent.removeClass("iti-sdc-" + (prevCountry.dialCode.length + 1));
                }
                if (dialCode) {
                    parent.addClass("iti-sdc-" + dialCode.length);
                }
                this.selectedDialCode.text(dialCode);
            }
            this._updatePlaceholder();
            this.countryListItems.removeClass("active");
            if (countryCode) {
                this.countryListItems.find(".iti-flag." + countryCode).first().closest(".country").addClass("active");
            }
            return prevCountry.iso2 !== countryCode;
        },
        _updatePlaceholder: function () {
            var shouldSetPlaceholder = this.options.autoPlaceholder === "aggressive" || !this.hadInitialPlaceholder && (this.options.autoPlaceholder === true || this.options.autoPlaceholder === "polite");
            if (window.intlTelInputUtils && shouldSetPlaceholder) {
                var numberType = intlTelInputUtils.numberType[this.options.placeholderNumberType],
                    placeholder = this.selectedCountryData.iso2 ? intlTelInputUtils.getExampleNumber(this.selectedCountryData.iso2, this.options.nationalMode, numberType) : "";
                placeholder = this._beforeSetNumber(placeholder);
                if (typeof this.options.customPlaceholder === "function") {
                    placeholder = this.options.customPlaceholder(placeholder, this.selectedCountryData);
                }
                this.telInput.attr("placeholder", placeholder);
            }
        },
        _selectListItem: function (listItem) {
            var flagChanged = this._setFlag(listItem.attr("data-country-code"));
            this._closeDropdown();
            this._updateDialCode(listItem.attr("data-dial-code"), true);
            this.telInput.focus();
            if (this.isGoodBrowser) {
                var len = this.telInput.val().length;
                this.telInput[0].setSelectionRange(len, len);
            }
            if (flagChanged) {
                this._triggerCountryChange();
            }
        },
        _closeDropdown: function () {
            this.countryList.addClass("hide");
            this.selectedFlagInner.children(".iti-arrow").removeClass("up");
            $(document).off(this.ns);
            $("html").off(this.ns);
            this.countryList.off(this.ns);
            if (this.options.dropdownContainer) {
                if (!this.isMobile) {
                    $(window).off("scroll" + this.ns);
                }
                this.dropdown.detach();
            }
        },
        _scrollTo: function (element, middle) {
            var container = this.countryList,
                containerHeight = container.height(),
                containerTop = container.offset().top,
                containerBottom = containerTop + containerHeight,
                elementHeight = element.outerHeight(),
                elementTop = element.offset().top,
                elementBottom = elementTop + elementHeight,
                newScrollTop = elementTop - containerTop + container.scrollTop(),
                middleOffset = containerHeight / 2 - elementHeight / 2;
            if (elementTop < containerTop) {
                if (middle) {
                    newScrollTop -= middleOffset;
                }
                container.scrollTop(newScrollTop);
            } else if (elementBottom > containerBottom) {
                if (middle) {
                    newScrollTop += middleOffset;
                }
                var heightDifference = containerHeight - elementHeight;
                container.scrollTop(newScrollTop - heightDifference);
            }
        },
        _updateDialCode: function (newDialCode, hasSelectedListItem) {
            var inputVal = this.telInput.val(),
                newNumber;
            newDialCode = "+" + newDialCode;
            if (inputVal.charAt(0) == "+") {
                var prevDialCode = this._getDialCode(inputVal);
                if (prevDialCode) {
                    newNumber = inputVal.replace(prevDialCode, newDialCode);
                } else {
                    newNumber = newDialCode;
                }
            } else if (this.options.nationalMode || this.options.separateDialCode) {
                return;
            } else {
                if (inputVal) {
                    newNumber = newDialCode + inputVal;
                } else if (hasSelectedListItem || !this.options.autoHideDialCode) {
                    newNumber = newDialCode;
                } else {
                    return;
                }
            }
            this.telInput.val(newNumber);
        },
        _getDialCode: function (number) {
            var dialCode = "";
            if (number.charAt(0) == "+") {
                var numericChars = "";
                for (var i = 0; i < number.length; i++) {
                    var c = number.charAt(i);
                    if ($.isNumeric(c)) {
                        numericChars += c;
                        if (this.countryCodes[numericChars]) {
                            dialCode = number.substr(0, i + 1);
                        }
                        if (numericChars.length == 4) {
                            break;
                        }
                    }
                }
            }
            return dialCode;
        },
        _getFullNumber: function () {
            var val = $.trim(this.telInput.val()),
                dialCode = this.selectedCountryData.dialCode,
                prefix, numericVal = this._getNumeric(val),
                normalizedVal = numericVal.charAt(0) == "1" ? numericVal : "1" + numericVal;
            if (this.options.separateDialCode) {
                prefix = "+" + dialCode;
            } else if (val.charAt(0) != "+" && val.charAt(0) != "1" && dialCode && dialCode.charAt(0) == "1" && dialCode.length == 4 && dialCode != normalizedVal.substr(0, 4)) {
                prefix = dialCode.substr(1);
            } else {
                prefix = "";
            }
            return prefix + val;
        },
        _beforeSetNumber: function (number) {
            if (this.options.separateDialCode) {
                var dialCode = this._getDialCode(number);
                if (dialCode) {
                    if (this.selectedCountryData.areaCodes !== null) {
                        dialCode = "+" + this.selectedCountryData.dialCode;
                    }
                    var start = number[dialCode.length] === " " || number[dialCode.length] === "-" ? dialCode.length + 1 : dialCode.length;
                    number = number.substr(start);
                }
            }
            return this._cap(number);
        },
        _triggerCountryChange: function () {
            this.telInput.trigger("countrychange", this.selectedCountryData);
        },
        handleAutoCountry: function () {
            if (this.options.initialCountry === "auto") {
                this.defaultCountry = $.fn[pluginName].autoCountry;
                if (!this.telInput.val()) {
                    this.setCountry(this.defaultCountry);
                }
                this.autoCountryDeferred.resolve();
            }
        },
        handleUtils: function () {
            if (window.intlTelInputUtils) {
                if (this.telInput.val()) {
                    this._updateValFromNumber(this.telInput.val());
                }
                this._updatePlaceholder();
            }
            this.utilsScriptDeferred.resolve();
        },
        destroy: function () {
            if (this.allowDropdown) {
                this._closeDropdown();
                this.selectedFlagInner.parent().off(this.ns);
                this.telInput.closest("label").off(this.ns);
            }
            if (this.options.autoHideDialCode) {
                var form = this.telInput.prop("form");
                if (form) {
                    $(form).off(this.ns);
                }
            }
            this.telInput.off(this.ns);
            var container = this.telInput.parent();
            container.before(this.telInput).remove();
        },
        getExtension: function () {
            if (window.intlTelInputUtils) {
                return intlTelInputUtils.getExtension(this._getFullNumber(), this.selectedCountryData.iso2);
            }
            return "";
        },
        getNumber: function (format) {
            if (window.intlTelInputUtils) {
                return intlTelInputUtils.formatNumber(this._getFullNumber(), this.selectedCountryData.iso2, format);
            }
            return "";
        },
        getNumberType: function () {
            if (window.intlTelInputUtils) {
                return intlTelInputUtils.getNumberType(this._getFullNumber(), this.selectedCountryData.iso2);
            }
            return -99;
        },
        getSelectedCountryData: function () {
            return this.selectedCountryData;
        },
        getValidationError: function () {
            if (window.intlTelInputUtils) {
                return intlTelInputUtils.getValidationError(this._getFullNumber(), this.selectedCountryData.iso2);
            }
            return -99;
        },
        isValidNumber: function () {
            var val = $.trim(this._getFullNumber()),
                countryCode = this.options.nationalMode ? this.selectedCountryData.iso2 : "";
            return window.intlTelInputUtils ? intlTelInputUtils.isValidNumber(val, countryCode) : null;
        },
        setCountry: function (countryCode) {
            countryCode = countryCode.toLowerCase();
            if (!this.selectedFlagInner.hasClass(countryCode)) {
                this._setFlag(countryCode);
                this._updateDialCode(this.selectedCountryData.dialCode, false);
                this._triggerCountryChange();
            }
        },
        setNumber: function (number) {
            var flagChanged = this._updateFlagFromNumber(number);
            this._updateValFromNumber(number);
            if (flagChanged) {
                this._triggerCountryChange();
            }
        }
    };
    $.fn[pluginName] = function (options) {
        var args = arguments;
        if (options === undefined || typeof options === "object") {
            var deferreds = [];
            this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    var instance = new Plugin(this, options);
                    var instanceDeferreds = instance._init();
                    deferreds.push(instanceDeferreds[0]);
                    deferreds.push(instanceDeferreds[1]);
                    $.data(this, "plugin_" + pluginName, instance);
                }
            });
            return $.when.apply(null, deferreds);
        } else if (typeof options === "string" && options[0] !== "_") {
            var returns;
            this.each(function () {
                var instance = $.data(this, "plugin_" + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === "function") {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === "destroy") {
                    $.data(this, "plugin_" + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
    $.fn[pluginName].getCountryData = function () {
        return allCountries;
    };
    $.fn[pluginName].loadUtils = function (path, utilsScriptDeferred) {
        if (!$.fn[pluginName].loadedUtilsScript) {
            $.fn[pluginName].loadedUtilsScript = true;
            $.ajax({
                type: "GET",
                url: path,
                complete: function () {
                    $(".intl-tel-input input").intlTelInput("handleUtils");
                },
                dataType: "script",
                cache: true
            });
        } else if (utilsScriptDeferred) {
            utilsScriptDeferred.resolve();
        }
    };
    $.fn[pluginName].defaults = defaults;
    $.fn[pluginName].version = "11.0.7";
    var allCountries = [
         ["Afghanistan", "af", "93"],
         ["Afrique du Sud", "za", "27"],
         ["Albanie", "al", "355"],
         ["Algérie", "dz", "213"],
         ["Allemagne", "de", "49"],
         ["Andorre", "ad", "376"],
         ["Angola", "ao", "244"],
         ["Anguilla", "ai", "1264"],
         ["Arabie saoudite", "sa", "966"],
         ["Argentine", "ar", "54"],
         ["Arménie", "am", "374"],
         ["Aruba", "aw", "297"],
         ["Australie", "au", "61"],
         ["Autriche", "at", "43"],
         ["Azerbaïdjan", "az", "994"],
         ["Bahamas", "bs", "1242"],
         ["Bahreïn", "bh", "973"],
         ["Bangladesh", "bd", "880"],
         ["Barbade", "bb", "1246"],
         ["Bélarus", "by", "375"],
         ["Belgique", "be", "32"],
         ["Belize", "bz", "501"],
         ["Bénin", "bj", "229"],
         ["Bermudes", "bm", "1441"],
         ["Bhoutan", "bt", "975"],
         ["Bolivie", "bo", "591"],
         ["Bosnie-Herzégovine", "ba", "387"],
         ["Botswana", "bw", "267"],
         ["Brésil", "br", "55"],
         ["Brunei Darussalam", "bn", "673"],
         ["Bulgarie", "bg", "359"],
         ["Burkina Faso", "bf", "226"],
         ["Burundi", "bi", "257"],
         ["Cambodge", "kh", "855"],
         ["Cameroun", "cm", "237"],
         ["Canada", "ca", "1", 1, ["204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]],
         ["Cap-Vert", "cv", "238"],
         ["Chili", "cl", "56"],
         ["Chine", "cn", "86"],
         ["Chypre", "cy", "357"],
         ["Colombie", "co", "57"],
         ["Comores", "km", "269"],
         ["Congo", "cg", "242"],
         ["Congo  (RDC)", "cd", "243"],
         ["Corée du Nord", "kp", "850"],
         ["Corée du Sud", "kr", "82"],
         ["Costa Rica", "cr", "506"],
         ["Côte d'Ivoire", "ci", "225"],
         ["Croatie", "hr", "385"],
         ["Cuba", "cu", "53"],
         ["Danemark", "dk", "45"],
         ["Djibouti", "dj", "253"],
         ["Dominique", "dm", "1767"],
         ["Égypte", "eg", "20"],
         ["El Salvador", "sv", "503"],
         ["Émirats arabes unis", "ae", "971"],
         ["Équateur", "ec", "593"],
         ["Érythrée", "er", "291"],
         ["Espagne", "es", "34"],
         ["Estonie", "ee", "372"],
         ["États-Unis", "us", "1", 0],
         ["Éthiopie", "et", "251"],
         ["Fidji", "fj", "679"],
         ["Finlande", "fi", "358"],
         ["France", "fr", "33"],
         ["Gabon", "ga", "241"],
         ["Gambie", "gm", "220"],
         ["Géorgie", "ge", "995"],
         ["Ghana", "gh", "233"],
         ["Gibraltar", "gi", "350"],
         ["Grèce", "gr", "30"],
         ["Grenade", "gd", "1473"],
         ["Groenland", "gl", "299"],
         ["Guadeloupe", "gp", "590"],
         ["Guam", "gu", "1671"],
         ["Guatemala", "gt", "502"],
         ["Guinée", "gn", "224"],
         ["Guinée équatoriale", "gq", "240"],
         ["Guinée-Bissau", "gw", "245"],
         ["Guyana", "gy", "592"],
         ["Guyane française", "gf", "594"],
         ["Haïti", "ht", "509"],
         ["Honduras", "hn", "504"],
         ["Hong Kong", "hk", "852"],
         ["Hongrie", "hu", "36"],
         ["Inde", "in", "91"],
         ["Indonésie", "id", "62"],
         ["Irak", "iq", "964"],
         ["Iran", "ir", "98"],
         ["Irlande", "ie", "353"],
         ["Islande", "is", "354"],
         ["Israël", "il", "972"],
         ["Italie", "it", "39", 0],
         ["Jamaïque", "jm", "1876"],
         ["Japon", "jp", "81"],
         ["Jordanie", "jo", "962"],
         ["Kazakhstan", "kz", "7", 1],
         ["Kenya", "ke", "254"],
         ["Kirghizistan", "kg", "996"],
         ["Kiribati", "ki", "686"],
         ["Kosovo", "xk", "383"],
         ["Koweït", "kw", "965"],
         ["Laos", "la", "856"],
         ["Lesotho", "ls", "266"],
         ["Lettonie", "lv", "371"],
         ["Liban", "lb", "961"],
         ["Libéria", "lr", "231"],
         ["Libye", "ly", "218"],
         ["Liechtenstein", "li", "423"],
         ["Lituanie", "lt", "370"],
         ["Luxembourg", "lu", "352"],
         ["Macao", "mo", "853"],
         ["Macédoine", "mk", "389"],
         ["Madagascar", "mg", "261"],
         ["Malaisie", "my", "60"],
         ["Malawi", "mw", "265"],
         ["Maldives", "mv", "960"],
         ["Mali", "ml", "223"],
         ["Malte", "mt", "356"],
         ["Maroc", "ma", "212"],
         ["Martinique", "mq", "596"],
         ["Maurice", "mu", "230"],
         ["Mauritanie", "mr", "222"],
         ["Mayotte", "yt", "262", 1],
         ["Mexique", "mx", "52"],
         ["Micronésie", "fm", "691"],
         ["Moldavie", "md", "373"],
         ["Monaco", "mc", "377"],
         ["Mongolie", "mn", "976"],
         ["Monténégro", "me", "382"],
         ["Montserrat", "ms", "1664"],
         ["Mozambique", "mz", "258"],
         ["Myanmar", "mm", "95"],
         ["Namibie", "na", "264"],
         ["Nauru", "nr", "674"],
         ["Népal", "np", "977"],
         ["Nicaragua", "ni", "505"],
         ["Niger", "ne", "227"],
         ["Nigeria", "ng", "234"],
         ["Niue", "nu", "683"],
         ["Norvège", "no", "47"],
         ["Nouvelle-Calédonie", "nc", "687"],
         ["Nouvelle-Zélande", "nz", "64"],
         ["Oman", "om", "968"],
         ["Ouganda", "ug", "256"],
         ["Ouzbékistan", "uz", "998"],
         ["Pakistan", "pk", "92"],
         ["Palau", "pw", "680"],
         ["Palestine", "ps", "970"],
         ["Panama", "pa", "507"],
         ["Papouasie-Nouvelle-Guinée", "pg", "675"],
         ["Paraguay", "py", "595"],
         ["Pays-Bas", "nl", "31"],
         ["Pérou", "pe", "51"],
         ["Philippines", "ph", "63"],
         ["Pologne", "pl", "48"],
         ["Polynésie française", "pf", "689"],
         ["Portugal", "pt", "351"],
         ["Puerto Rico", "pr", "1", 3, ["787", "939"]],
         ["Qatar", "qa", "974"],
         ["République centrafricaine", "cf", "236"],
         ["République dominicaine", "do", "1", 2, ["809", "829", "849"]],
         ["République tchèque", "cz", "420"],
         ["Réunion", "re", "262", 0],
         ["Roumanie", "ro", "40"],
         ["Royaume-Uni", "gb", "44"],
         ["Russie", "ru", "7", 0],
         ["Rwanda", "rw", "250"],
         ["Samoa", "ws", "685"],
         ["Samoa américaine", "as", "1684"],
         ["Sao Tomé-et-Principe", "st", "239"],
         ["Sénégal", "sn", "221"],
         ["Serbie", "rs", "381"],
         ["Seychelles", "sc", "248"],
         ["Sierra Leone", "sl", "232"],
         ["Singapour", "sg", "65"],
         ["Slovaquie", "sk", "421"],
         ["Slovénie", "si", "386"],
         ["Somalie", "so", "252"],
         ["Soudan", "sd", "249"],
         ["Soudan du Sud", "ss", "211"],
         ["Sri Lanka", "lk", "94"],
         ["Suède", "se", "46"],
         ["Suisse", "ch", "41"],
         ["Suriname", "sr", "597"],
         ["Swaziland", "sz", "268"],
         ["Syrie", "sy", "963"],
         ["Tadjikistan", "tj", "992"],
         ["Taïwan", "tw", "886"],
         ["Tanzanie", "tz", "255"],
         ["Tchad", "td", "235"],
         ["Thaïlande", "th", "66"],
         ["Timor-Leste", "tl", "670"],
         ["Togo", "tg", "228"],
         ["Tokelau", "tk", "690"],
         ["Tonga", "to", "676"],
         ["Trinité-et-Tobago", "tt", "1868"],
         ["Tunisie", "tn", "216"],
         ["Turkménistan", "tm", "993"],
         ["Turquie", "tr", "90"],
         ["Tuvalu", "tv", "688"],
         ["Ukraine", "ua", "380"],
         ["Uruguay", "uy", "598"],
         ["Vanuatu", "vu", "678"],
         ["Vatican", "va", "39", 1],
         ["Venezuela", "ve", "58"],
         ["Vietnam", "vn", "84"],
         ["Yémen", "ye", "967"],
         ["Zambie", "zm", "260"],
         ["Zimbabwe", "zw", "263"]
    ];
    for (var i = 0; i < allCountries.length; i++) {
        var c = allCountries[i];
        allCountries[i] = {
            name: c[0],
            iso2: c[1],
            dialCode: c[2],
            priority: c[3] || 0,
            areaCodes: c[4] || null
        };
    }
});