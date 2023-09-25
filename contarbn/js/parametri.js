var baseUrl = "/contarbn-be/";

$(document).ready(function() {
    if($('#authorizationModal') !=  null && $('#authorizationModal') != undefined && $('#authorizationModal').length != 0){

        var token = $('body').attr('data-auth');
        if(token != null && token != undefined && token != ""){
            var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
            var auth = bytes.toString(CryptoJS.enc.Utf8);

            $.fn.loadParametriTable(auth);
        } else {
            $('#authorizationModal').modal('show');
        }
    }
});

$(document).on('click','.annullaAuthorizationModal', function(){
    $('#authorizationModal').modal('hide');

    var alertContent = '<div id="alertParametroContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent = alertContent + '<strong>Accesso negato</strong>\n' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertParametro').empty().append(alertContent);
});

$(document).on('submit','#authorizationForm', function(event){
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();
    var auth = "Basic " + btoa(username + ":" + password);

    $.fn.loadParametriTable(auth);
});

$.fn.loadParametriTable = function(auth){
    $('#parametriTable').DataTable({
        "ajax": {
            "url": baseUrl + "configurazione/parametri",
            "type": "GET",
            "content-type": "json",
            "cache": false,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            "dataSrc": function(data) {
                $('#authorizationModal').modal('hide');
                $('#parametriMainDiv').removeClass('d-none');
                return data;
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.status+', '+textStatus+', '+errorThrown);

                $('#authorizationModal').modal('hide');

                var alertContent = '<div id="alertParametroContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Accesso negato</strong>\n' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertParametro').empty().append(alertContent);
            }
        },
        "language": {
            "search": "Cerca",
            "paginate": {
                "first": "Inizio",
                "last": "Fine",
                "next": "Succ.",
                "previous": "Prec."
            },
            "emptyTable": "Nessun parametro disponibile",
            "zeroRecords": "Nessun parametro disponibile"
        },
        "pageLength": 20,
        "lengthChange": false,
        "info": false,
        "autoWidth": false,
        "order": [
            [0, 'asc']
        ],
        "columns": [
            {"name": "nome", "data": "nome"},
            {"name": "descrizione", "data": "descrizione"},
            {"name": "valore", "data": "valore"},
            {"name": "unitaDiMisura", "data": "unitaDiMisura"},
            {"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
                /*
                // Encrypt
                var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

                // Decrypt
                var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
                var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                */
                var token = CryptoJS.AES.encrypt(auth, 'contarbn');
                var links = '<a class="updateParametro pr-2" data-id="'+data.id+'" href="parametri-edit.html?idParametro=' + data.id + '&token=' + token +'"><i class="far fa-edit"></i></a>';
                return links;
            }}
        ]
    });
}

$.fn.extractIdParametroFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idParametro') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getParametro = function(idParametro, token){
    var alertContent = '<div id="alertParametroContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent = alertContent +  '<strong>Errore nel recupero del parametro.</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);
    console.log(auth);

    // remove the token parameter from the url
    /*var uri = window.location.toString();
    if (uri.indexOf("&token") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("&token"));
        window.history.replaceState({}, document.title, clean_uri);
    }*/

    $.ajax({
        url: baseUrl + "configurazione/parametri/" + idParametro,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function (result) {
            if (result != null && result != undefined && result != '') {

                $('#hiddenIdParametro').attr('value', result.id);
                $('#nome').attr('value', result.nome);
                $('#valore').attr('value', result.valore);
                $('#unitaDiMisura').attr('value', result.unitaDiMisura);
                $('#descrizione').val(result.descrizione);

                $('#annullaParametroButton').attr('data-auth', token);
            };
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertParametro').append(alertContent);
            $('#updateParametroButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$(document).on('click','#annullaParametroButton', function(event){
    event.preventDefault();

    window.location = 'parametri.html?token=' + $(this).attr('data-auth');
    //$.fn.loadParametriTable(auth);
});

$(document).on('submit','#updateParametroForm', function(event) {
    event.preventDefault();

    var token = $('#annullaParametroButton').attr('data-auth');
    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    var parametro = new Object();
    parametro.id = $('#hiddenIdParametro').val();
    parametro.nome = $('#nome').val();
    parametro.descrizione = $('#descrizione').val();
    parametro.unitaDiMisura = $('#unitaDiMisura').val();
    parametro.valore = $('#valore').val();

    var parametroJson = JSON.stringify(parametro);

    var alertContent = '<div id="alertParametroContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
    alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "configurazione/parametri/" + $('#hiddenIdParametro').val(),
        type: 'PUT',
        contentType: "application/json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        dataType: 'json',
        data: parametroJson,
        success: function(result) {
            $('#alertParametri').empty().append(alertContent.replace('@@alertText@@','Parametro modificato con successo').replace('@@alertResult@@', 'success'));

            // Returns to the list page
            setTimeout(function() {
                window.location.href = "parametri.html?token=" + token;
            }, 1000);

        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertParametri').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del parametro').replace('@@alertResult@@', 'danger'));
        }
    });
});
