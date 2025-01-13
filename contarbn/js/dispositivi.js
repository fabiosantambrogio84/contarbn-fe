var baseUrl = "/contarbn-be/";

$(document).ready(function() {
    let authorizationModalElement = $('#authorizationModal');
    if(authorizationModalElement != null && authorizationModalElement.length !== 0){

        var token = $('body').attr('data-auth');
        if(token != null && token !== ""){
            var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
            var auth = bytes.toString(CryptoJS.enc.Utf8);

            $.fn.loadDispositiviTable(auth);
        } else {
            authorizationModalElement.modal('show');
        }
    }
});

$(document).on('click','.annullaAuthorizationModal', function(){
    $('#authorizationModal').modal('hide');

    var alertContent = '<div id="alertDispositivoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent += '<strong>Accesso negato</strong>\n' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertDispositivo').empty().append(alertContent);
});

$(document).on('submit','#authorizationForm', function(event){
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();
    var auth = "Basic " + btoa(username + ":" + password);

    $.fn.loadDispositiviTable(auth);
});

$.fn.loadDispositiviTable = function(auth){
    $('#dispositiviTable').DataTable({
        "ajax": {
            "url": baseUrl + "configurazione/dispositivi",
            "type": "GET",
            "content-type": "json",
            "cache": false,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            "dataSrc": function(data) {
                $('#authorizationModal').modal('hide');
                $('#dispositiviMainDiv').removeClass('d-none');
                return data;
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.status+', '+textStatus+', '+errorThrown);

                $('#authorizationModal').modal('hide');

                var alertContent = '<div id="alertDispositivoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent += '<strong>Accesso negato</strong>\n' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertDispositivo').empty().append(alertContent);
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
            "emptyTable": "Nessun dispositivo disponibile",
            "zeroRecords": "Nessun dispositivo disponibile"
        },
        "pageLength": 20,
        "lengthChange": false,
        "info": false,
        "autoWidth": false,
        "order": [
            [0, 'desc'],
            [1, 'asc'],
            [2, 'asc']
        ],
        "columns": [
            {"name": "attivo", "data": "attivo", "visible":false},
            {"name": "tipo", "data": "tipo"},
            {"name": "nome", "data": "nome"},
            {"name": "descrizione", "data": "descrizione"},
            {"name": "ip", "data": "ip"},
            {"name": "porta", "data": "porta"},
            {"name": "predefinito", "data": null, "width":"5%", render: function (data) {
                if(data.predefinito){
                    return 'Si';
                } else {
                    return 'No';
                }
            }},
            {"data": null, "orderable":false, "width":"8%", render: function (data) {
                let token = CryptoJS.AES.encrypt(auth, 'contarbn');
                let links = '<a class="updateDispositivo pr-2" data-id="' + data.id + '" href="dispositivi-edit.html?idDispositivo=' + data.id + '&token=' + token + '"><i class="far fa-edit"></i></a>';
                if(data.ip != null && data.ip !== ''){
                    links += '<a class="pingDispositivo pr-2" data-id="'+ data.id +'" data-token='+token+' href="#" title="Test connettività"><i class="fa fa-plug"></i></a>';
                }
                return links;
            }}
        ],
        "createdRow": function(row, data){
            $('body').attr('data-auth',CryptoJS.AES.encrypt(auth, 'contarbn'));
            if(!data.attivo){
                $(row).css('background-color', '#d2d4d2');
            }
        }
    });
}

$.fn.getTipologieDispositivi = function(){

    $.ajax({
        url: baseUrl + "utils/tipologie-dispositivi",
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            if(result != null && result !== ''){
                $.each(result, function(i, item){
                    $('#tipo').append('<option value="'+item+'">'+item+'</option>');
                });
            }
        },
        error: function(jqXHR) {
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.getDispositivo = function(idDispositivo){
    var alertContent = '<div id="alertDispositivoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent += '<strong>Errore nel recupero del dispositivo.</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    let token = $('body').attr('data-auth');

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/dispositivi/" + idDispositivo,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function (result) {
            if (result != null && result !== '') {

                $('#hiddenIdDispositivo').attr('value', result.id);
                $('#tipo').attr('value', result.tipo);
                $('#nome').attr('value', result.nome);
                $('#descrizione').val(result.descrizione);
                $('#ip').attr('value', result.ip);
                $('#porta').attr('value', result.porta);
                if(result.predefinito === true){
                    $('#predefinito').prop('checked', true);
                }
                if(result.attivo === true){
                    $('#attivo').prop('checked', true);
                }

                $('#annullaDispositivoButton').attr('data-auth', token);
            }
        },
        error: function(jqXHR) {
            $('#alertDispositivo').append(alertContent);
            $('#updateDispositivoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$(document).on('click','#annullaDispositivoButton', function(event){
    event.preventDefault();

    let token = $(this).attr('data-auth');
    if(token == null || token === ''){
        token = $('body').attr('data-auth');
    }
    window.location = 'dispositivi.html?token=' + token;
});

$(document).on('click','#newDispositivoLink', function(){

    let token = $('body').attr('data-auth');
    $('#newDispositivoLink').attr('href', 'dispositivi-new.html?token='+token);
});

$(document).on('click','.pingDispositivo', function(){
    var token = $(this).attr('data-token');
    var idDispositivo = $(this).attr('data-id');
    $('#confirmPingDispositivo').attr('data-token', token).attr('data-id', idDispositivo);
    $('#pingDispositivoModal').modal('show');
});

$(document).on('click','#confirmPingDispositivo', function(){
    $('#pingDispositivoModal').modal('hide');
    var token = $(this).attr('data-token');
    var id = $(this).attr('data-id');

    var alertContent = '<div id="alertDispositivoContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
    alertContent += '<strong>Test connettività dispositivo in corso (attendere un paio di minuti)...</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertDispositivo').empty().append(alertContent);

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/dispositivi/"+id+"/ping",
        type: 'HEAD',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function() {
            var alertContent = '<div id="alertDispositivoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
            alertContent += '<strong>Dispositivo connesso e raggiungibile.</strong>\n' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertDispositivo').empty().append(alertContent);

            $('#dispositiviTable').DataTable().ajax.reload();
        },
        error: function() {
            var alertContent = '<div id="alertDispositivoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
            alertContent += '<strong>Dispositivo non connesso e/o non raggiungibile</strong>' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertDispositivo').empty().append(alertContent);

            $('#dispositiviTable').DataTable().ajax.reload();
        }
    });
});

$(document).on('submit','#newDispositivoForm', function(event) {
    event.preventDefault();

    var token = $('body').attr('data-auth');
    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    let dispositivo = {};
    dispositivo.tipo = $('#tipo').val();
    dispositivo.nome = $('#nome').val();
    dispositivo.descrizione = $('#descrizione').val();
    dispositivo.ip = $('#ip').val();
    dispositivo.porta = $('#porta').val();
    dispositivo.predefinito = $('#predefinito').prop('checked') === true;
    dispositivo.attivo = $('#attivo').prop('checked') === true;

    var dispositivoJson = JSON.stringify(dispositivo);

    var alertContent = '<div id="alertDispositivoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
    alertContent += '<strong>@@alertText@@</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "configurazione/dispositivi",
        type: 'POST',
        contentType: "application/json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        dataType: 'json',
        data: dispositivoJson,
        success: function() {
            $('#alertDispositivo').empty().append(alertContent.replace('@@alertText@@','Dispositivo creato con successo').replace('@@alertResult@@', 'success'));

            setTimeout(function() {
                window.location.href = "dispositivi.html?token=" + token;
            }, 1000);

        },
        error: function(jqXHR) {
            var errorMessage = 'Errore nella creazione del dispositivo';
            if(jqXHR != null){
                var jqXHRResponseJson = jqXHR.responseJSON;
                if(jqXHRResponseJson != null && jqXHRResponseJson !== ''){
                    var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
                    if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage !== '' && jqXHRResponseJsonMessage.indexOf('Dispositivo') !== -1){
                        errorMessage = jqXHRResponseJsonMessage;
                    }
                }
            }
            $('#alertDispositivo').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
        }
    });
});

$(document).on('submit','#updateDispositivoForm', function(event) {
    event.preventDefault();

    var token = $('#annullaDispositivoButton').attr('data-auth');
    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    let dispositivo = {};
    dispositivo.id = $('#hiddenIdDispositivo').val();
    dispositivo.tipo = $('#tipo').val();
    dispositivo.nome = $('#nome').val();
    dispositivo.descrizione = $('#descrizione').val();
    dispositivo.ip = $('#ip').val();
    dispositivo.porta = $('#porta').val();
    dispositivo.predefinito = $('#predefinito').prop('checked') === true;
    dispositivo.attivo = $('#attivo').prop('checked') === true;

    var dispositivoJson = JSON.stringify(dispositivo);

    var alertContent = '<div id="alertDispositivoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
    alertContent += '<strong>@@alertText@@</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "configurazione/dispositivi/" + dispositivo.id,
        type: 'PUT',
        contentType: "application/json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        dataType: 'json',
        data: dispositivoJson,
        success: function() {
            $('#alertDispositivo').empty().append(alertContent.replace('@@alertText@@','Dispositivo modificato con successo').replace('@@alertResult@@', 'success'));

            setTimeout(function() {
                window.location.href = "dispositivi.html?token=" + token;
            }, 1000);

        },
        error: function(jqXHR) {
            var errorMessage = 'Errore nella modifica del dispositivo';
            if(jqXHR != null){
                var jqXHRResponseJson = jqXHR.responseJSON;
                if(jqXHRResponseJson != null && jqXHRResponseJson !== ''){
                    var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
                    if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage !== '' && jqXHRResponseJsonMessage.indexOf('Dispositivo') !== -1){
                        errorMessage = jqXHRResponseJsonMessage;
                    }
                }
            }
            $('#alertDispositivo').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
        }
    });
});
