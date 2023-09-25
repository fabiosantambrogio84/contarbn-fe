var baseUrl = "/contarbn-be/";

$(document).ready(function() {
    if($('#authorizationModal') !=  null && $('#authorizationModal') != undefined && $('#authorizationModal').length != 0){

        var token = $('body').attr('data-auth');
        if(token != null && token != undefined && token != ""){
            var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
            var auth = bytes.toString(CryptoJS.enc.Utf8);

            $.fn.loadConfigurazioneClientTable(auth);
        } else {
            $('#authorizationModal').modal('show');
        }
    }
});

$(document).on('click','.annullaAuthorizationModal', function(){
    $('#authorizationModal').modal('hide');

    var alertContent = '<div id="alertParametroContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent = alertContent + '<strong>Accesso negato</strong>\n' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertProprieta').empty().append(alertContent);
});

$(document).on('submit','#authorizationForm', function(event){
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();
    var auth = "Basic " + btoa(username + ":" + password);

    $.fn.loadConfigurazioneClientTable(auth);
});

$.fn.loadConfigurazioneClientTable = function(auth){
    $('#configurazioneClientTable').DataTable({
        "ajax": {
            "url": baseUrl + "configurazione/app-client",
            "type": "GET",
            "content-type": "json",
            "cache": false,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            "dataSrc": function(data) {
                $('#authorizationModal').modal('hide');
                $('#configurazioneClientMainDiv').removeClass('d-none');
                return data;
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.status+', '+textStatus+', '+errorThrown);

                $('#authorizationModal').modal('hide');

                var alertContent = '<div id="alertConfigurazioneClientContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Accesso negato</strong>\n' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertConfigurazioneClient').empty().append(alertContent);
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
            "emptyTable": "Nessuna configurazione disponibile",
            "zeroRecords": "Nessuna configurazione disponibile"
        },
        "pageLength": 20,
        "lengthChange": false,
        "info": false,
        "autoWidth": false,
        "order": [
            [0, 'asc']
        ],
        "columns": [
            {"name": "descrizione", "data": "descrizione"},
            {"name": "abilitato", "data": null, "width":"5%", render: function ( data, type, row ) {
                if($.fn.checkVariableIsNull(data.abilitato)){
                    return 'No';
                }
                return 'Si';
            }},
            {"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
                /*
                // Encrypt
                var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

                // Decrypt
                var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
                var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                */
                var token = CryptoJS.AES.encrypt(auth, 'contarbn');
                var links = '<a class="updateConfigurazioneClient pr-2" data-id="'+data.id+'" href="app-client-edit.html?idConfigurazione=' + data.id + '&token=' + token +'"><i class="far fa-edit"></i></a>';
                return links;
            }}
        ]
    });
}

$.fn.extractIdConfigurazioneFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idConfigurazione') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getConfigurazione = function(idConfigurazione, token){
    var alertContent = '<div id="alertConfigurazioneClientContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent = alertContent +  '<strong>Errore nel recupero della configurazione.</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/app-client/" + idConfigurazione,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function (result) {
            if (result != null && result != undefined && result != '') {

                $('#hiddenIdConfigurazioneClient').attr('value', result.id);
                $('#descrizione').val(result.descrizione);
                if(result.abilitato === true){
                    $('#abilitato').prop('checked', true);
                }

                $('#annullaConfigurazioneClientButton').attr('data-auth', token);
            };
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertConfigurazioneClient').append(alertContent);
            $('#updateConfigurazioneClientButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$(document).on('click','#annullaConfigurazioneClientButton', function(event){
    event.preventDefault();

    window.location = 'app-client.html?token=' + $(this).attr('data-auth');
    //$.fn.loadParametriTable(auth);
});

$(document).on('submit','#updateConfigurazioneClientForm', function(event) {
    event.preventDefault();

    var token = $('#annullaConfigurazioneClientButton').attr('data-auth');
    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    var configurazione = new Object();
    configurazione.id = $('#hiddenIdConfigurazioneClient').val();
    configurazione.descrizione = $('#descrizione').val();
    if($('#abilitato').prop('checked') === true){
        configurazione.abilitato = true;
    }else{
        configurazione.abilitato = false;
    }

    var configurazioneJson = JSON.stringify(configurazione);

    var alertContent = '<div id="alertConfigurazioneClientContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
    alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "configurazione/app-client/" + $('#hiddenIdConfigurazioneClient').val(),
        type: 'PUT',
        contentType: "application/json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        dataType: 'json',
        data: configurazioneJson,
        success: function(result) {
            $('#alertConfigurazioneClient').empty().append(alertContent.replace('@@alertText@@','Configurazione modificata con successo').replace('@@alertResult@@', 'success'));

            // Returns to the list page
            setTimeout(function() {
                window.location.href = "app-client.html?token=" + token;
            }, 1000);

        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertConfigurazioneClient').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della configurazione').replace('@@alertResult@@', 'danger'));
        }
    });
});
