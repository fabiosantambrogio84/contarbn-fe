var baseUrl = "/contarbn-be/";

$(document).ready(function() {
    if($('#authorizationModal') !=  null && $('#authorizationModal') != undefined && $('#authorizationModal').length != 0){

        var token = $('body').attr('data-auth');
        if(token != null && token !== ""){
            var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
            var auth = bytes.toString(CryptoJS.enc.Utf8);

            $.fn.loadOperationsTable(auth);
        } else {
            $('#authorizationModal').modal('show');
        }
    }
});

$(document).on('click','.annullaAuthorizationModal', function(){
    $('#authorizationModal').modal('hide');

    var alertContent = '<div id="alertParametroContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent += '<strong>Accesso negato</strong>\n' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertOperations').empty().append(alertContent);
});

$(document).on('submit','#authorizationForm', function(event){
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();
    var auth = "Basic " + btoa(username + ":" + password);

    $.fn.loadOperationsTable(auth);
});

$.fn.loadOperationsTable = function(auth){
    $('#operationsTable').DataTable({
        "ajax": {
            "url": baseUrl + "configurazione/operations",
            "type": "GET",
            "content-type": "json",
            "cache": false,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            "dataSrc": function(data) {
                $('#authorizationModal').modal('hide');
                $('#operationsMainDiv').removeClass('d-none');
                return data;
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.status+', '+textStatus+', '+errorThrown);

                $('#authorizationModal').modal('hide');

                var alertContent = '<div id="alertOperationsContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent += '<strong>Accesso negato</strong>\n' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertOperations').empty().append(alertContent);
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
            "emptyTable": "Nessuna azione disponibile",
            "zeroRecords": "Nessuna azione disponibile"
        },
        "pageLength": 20,
        "lengthChange": false,
        "info": false,
        "autoWidth": false,
        "order": [
            [0, 'asc']
        ],
        "columns": [
            {"name": "label", "data": "label"},
            {"data": null, "orderable":false, "width":"5%", render: function (data) {
                var token = CryptoJS.AES.encrypt(auth, 'contarbn');
                return '<a class="runAction pr-2" data-action="'+data.action+'" data-token='+token+' href="#" title="Esegui"><i class="fas fa-play"></i></a>';
            }}
        ]
    });
}

$(document).on('click','.runAction', function(){
    var action = $(this).attr('data-action');
    var token = $(this).attr('data-token');
    if(action === 'DELETE_ORDINI_CLIENTI'){
        $('#confirmDeleteOrdiniClienti').attr('data-token', token);
        $('#deleteOrdiniClientiModal').modal('show');
        $('#deleteEtichetteModal').modal('hide');
        $('#computeGiacenzeArticoliModal').modal('hide');
    } else if(action === 'DELETE_ETICHETTE'){
        $('#confirmDeleteEtichette').attr('data-token', token);
        $('#deleteOrdiniClientiModal').modal('hide');
        $('#deleteEtichetteModal').modal('show');
        $('#computeGiacenzeArticoliModal').modal('hide');
    } else if(action === 'COMPUTE_GIACENZE_ARTICOLI'){
        $('#confirmComputeGiacenzeArticoli').attr('data-token', token);
        $('#deleteOrdiniClientiModal').modal('hide');
        $('#deleteEtichetteModal').modal('hide');
        $('#computeGiacenzeArticoliModal').modal('show');
    }
});

$(document).on('click','#confirmDeleteOrdiniClienti', function(){
    $('#deleteOrdiniClientiModal').modal('hide');
    var token = $(this).attr('data-token');
    var days = $("input[id='numeroGiorni']").val();

    var alertContent = '<div id="alertOperationsContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
    alertContent += '<strong>Cancellazione Ordini Clienti in corso...</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertOperations').empty().append(alertContent);

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/operations/cleanup/ordini-clienti/evasi-expired?days="+days,
        type: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function() {
            var alertContent = '<div id="alertOperationsContent" class="alert alert-success alert-dismissible fade show" role="alert">';
            alertContent = alertContent + '<strong>Ordini Clienti</strong> cancellati con successo.\n' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertOperations').empty().append(alertContent);

            $('#operationsTable').DataTable().ajax.reload();
        },
        error: function(jqXHR) {
            console.log('Response text: ' + jqXHR.responseText);

            var alertContent = '<div id="alertOperationsContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
            alertContent = alertContent + '<strong>Errore</strong> nella cancellazione degli Ordini Clienti' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertOperations').empty().append(alertContent);

            $('#operationsTable').DataTable().ajax.reload();
        }
    });
});

$(document).on('click','#confirmDeleteEtichette', function(){
    $('#deleteEtichetteModal').modal('hide');
    var token = $(this).attr('data-token');
    var days = $("input[id='numeroGiorni']").val();

    var alertContent = '<div id="alertOperationsContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
    alertContent = alertContent +  '<strong>Cancellazione Etichette in corso...</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertOperations').empty().append(alertContent);

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/operations/cleanup/etichette?days="+days,
        type: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function() {
            var alertContent = '<div id="alertOperationsContent" class="alert alert-success alert-dismissible fade show" role="alert">';
            alertContent += '<strong>Etichette</strong> cancellate con successo.\n' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertOperations').empty().append(alertContent);

            $('#operationsTable').DataTable().ajax.reload();
        },
        error: function(jqXHR) {
            console.log('Response text: ' + jqXHR.responseText);

            var alertContent = '<div id="alertOperationsContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
            alertContent += '<strong>Errore</strong> nella cancellazione delle Etichette' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertOperations').empty().append(alertContent);

            $('#operationsTable').DataTable().ajax.reload();
        }
    });
});

$(document).on('click','#confirmComputeGiacenzeArticoli', function(){
    $('#computeGiacenzeArticoliModal').modal('hide');
    var token = $(this).attr('data-token');
    var idArticoloFrom = $("input[id='idArticoloFrom']").val();
    var idArticoloTo = $("input[id='idArticoloTo']").val();

    var alertContent = '<div id="alertOperationsContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
    alertContent += '<strong>Calcolo giacenze articoli...</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertOperations').empty().append(alertContent);

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/operations/compute/giacenze-articoli?idArticoloFrom="+idArticoloFrom+"&idArticoloTo="+idArticoloTo,
        type: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function() {
            var alertContent = '<div id="alertOperationsContent" class="alert alert-success alert-dismissible fade show" role="alert">';
            alertContent += '<strong>Giacenze articoli</strong> ricalcolate con successo.\n' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertOperations').empty().append(alertContent);

            $('#operationsTable').DataTable().ajax.reload();
        },
        error: function(jqXHR) {
            console.log('Response text: ' + jqXHR.responseText);

            var alertContent = '<div id="alertOperationsContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
            alertContent += '<strong>Errore</strong> nel ricalcolo delle giacenze articoli' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertOperations').empty().append(alertContent);

            $('#operationsTable').DataTable().ajax.reload();
        }
    });
});