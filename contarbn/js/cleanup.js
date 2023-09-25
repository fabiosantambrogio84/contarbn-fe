var baseUrl = "/contarbn-be/";

$(document).ready(function() {
    if($('#authorizationModal') !=  null && $('#authorizationModal') != undefined && $('#authorizationModal').length != 0){

        var token = $('body').attr('data-auth');
        if(token != null && token != undefined && token != ""){
            var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
            var auth = bytes.toString(CryptoJS.enc.Utf8);

            $.fn.loadCleanupTable(auth);
        } else {
            $('#authorizationModal').modal('show');
        }
    }
});

$(document).on('click','.annullaAuthorizationModal', function(){
    $('#authorizationModal').modal('hide');

    var alertContent = '<div id="alertParametroContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent = alertContent + '<strong>Accesso negato</strong>\n' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertCleanup').empty().append(alertContent);
});

$(document).on('submit','#authorizationForm', function(event){
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();
    var auth = "Basic " + btoa(username + ":" + password);

    $.fn.loadCleanupTable(auth);
});

$.fn.loadCleanupTable = function(auth){
    $('#cleanupTable').DataTable({
        "ajax": {
            "url": baseUrl + "configurazione/cleanup",
            "type": "GET",
            "content-type": "json",
            "cache": false,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            "dataSrc": function(data) {
                $('#authorizationModal').modal('hide');
                $('#cleanupMainDiv').removeClass('d-none');
                return data;
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.status+', '+textStatus+', '+errorThrown);

                $('#authorizationModal').modal('hide');

                var alertContent = '<div id="alertProprietaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Accesso negato</strong>\n' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertCleanup').empty().append(alertContent);
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
            {"data": null, "orderable":false, "width":"5%", render: function ( data, type, row ) {

                var token = CryptoJS.AES.encrypt(auth, 'contarbn');
                var links = '<a class="runAction pr-2" data-action="'+data.action+'" data-token='+token+' href="#"><i class="fas fa-play"></i></a>';
                return links;
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
    } else if(action === 'DELETE_ETICHETTE'){
        $('#confirmDeleteEtichette').attr('data-token', token);
        $('#deleteOrdiniClientiModal').modal('hide');
        $('#deleteEtichetteModal').modal('show');
    }
});

$(document).on('click','#confirmDeleteOrdiniClienti', function(){
    $('#deleteOrdiniClientiModal').modal('hide');
    var token = $(this).attr('data-token');
    var days = $("input[id='numeroGiorni']").val();

    var alertContent = '<div id="alertCleanupContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
    alertContent = alertContent +  '<strong>Cancellazione Ordini Clienti in corso...</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertCleanup').empty().append(alertContent);

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/cleanup/ordini-clienti/evasi-expired?days="+days,
        type: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function() {
            var alertContent = '<div id="alertCleanupContent" class="alert alert-success alert-dismissible fade show" role="alert">';
            alertContent = alertContent + '<strong>Ordini Clienti</strong> cancellati con successo.\n' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertCleanup').empty().append(alertContent);

            $('#cleanupTable').DataTable().ajax.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Response text: ' + jqXHR.responseText);

            var alertContent = '<div id="alertCausaleContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
            alertContent = alertContent + '<strong>Errore</strong> nella cancellazione degli Ordini Clienti' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertCleanup').empty().append(alertContent);

            $('#cleanupTable').DataTable().ajax.reload();
        }
    });
});

$(document).on('click','#confirmDeleteEtichette', function(){
    $('#deleteEtichetteModal').modal('hide');
    var token = $(this).attr('data-token');
    var days = $("input[id='numeroGiorni']").val();

    var alertContent = '<div id="alertCleanupContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
    alertContent = alertContent +  '<strong>Cancellazione Etichette in corso...</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertCleanup').empty().append(alertContent);

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contarbn');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/cleanup/etichette?days="+days,
        type: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function() {
            var alertContent = '<div id="alertCleanupContent" class="alert alert-success alert-dismissible fade show" role="alert">';
            alertContent = alertContent + '<strong>Etichette</strong> cancellate con successo.\n' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertCleanup').empty().append(alertContent);

            $('#cleanupTable').DataTable().ajax.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Response text: ' + jqXHR.responseText);

            var alertContent = '<div id="alertCausaleContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
            alertContent = alertContent + '<strong>Errore</strong> nella cancellazione delle Etichette' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertCleanup').empty().append(alertContent);

            $('#cleanupTable').DataTable().ajax.reload();
        }
    });
});
