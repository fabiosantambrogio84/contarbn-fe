
var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$(document).on('click','.deleteArticoloImmagine', function(){
		var idArticoloImmagine = $(this).attr('data-id');
		$('#confirmDeleteArticoloImmagine').attr('data-id', idArticoloImmagine);
		$('#deleteArticoloImmagineModal').modal('show');
	});

	$(document).on('click','#confirmDeleteArticoloImmagine', function(){
		$('#deleteArticoloImmagineModal').modal('hide');
		var idArticoloImmagine = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "articoli-immagini/" + idArticoloImmagine,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertArticoloImmagineContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Immagine articolo</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticoloImmagine').empty().append(alertContent);

				$('#articoliImmaginiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#newArticoloImmagineButton') != null && $('#newArticoloImmagineButton') != undefined){
		$(document).on('submit','#newArticoloImmagineForm', function(event){
			event.preventDefault();

            var alertContent = '<div id="alertArticoloImmagineContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
            			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
            				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

            var idArticolo = $('#hiddenIdArticolo').val();
            var immagine = $('#immagine')[0].files[0];

            var data = new FormData();
            data.append('articoloId', idArticolo);
            data.append('file', immagine);

            $.ajax({
            	url: baseUrl + "articoli-immagini",
            	type: 'POST',
            	data: data,
                cache: false,
                contentType: false,
                processData: false,
            	success: function(result) {
            		$('#alertArticoloImmagine').empty().append(alertContent.replace('@@alertText@@','Immagine articolo caricata con successo').replace('@@alertResult@@', 'success'));
            	},
            	error: function(jqXHR, textStatus, errorThrown) {
            		$('#alertArticoloImmagine').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dell immagine articolo').replace('@@alertResult@@', 'danger'));
            	}
            });

		});
	}
});

$.fn.saveIdArticoloInPage = function(idArticolo){
    $('#hiddenIdArticolo').attr('value', idArticolo);
    $('#annullaArticoloImmagine').attr('href','articolo-immagini.html?idArticolo='+idArticolo);
}

$.fn.getArticoloForImmagine = function(idArticolo){
	var alertContent = '<div id="alertArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell articolo.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "articoli/" + idArticolo,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != '') {
                var data = moment(result.data);

				var articoloRow = '<td>'+result.codice+'</td>';
				articoloRow = articoloRow + '<td>'+result.descrizione+'</td>';
				articoloRow = articoloRow + '<td>'+result.categoria.nome+'</td>';
				articoloRow = articoloRow + '<td>'+result.fornitore.ragioneSociale+'</td>';
				articoloRow = articoloRow + '<td>'+data.format('DD/MM/YYYY')+'</td>';

				$('#articoloRow').append(articoloRow);

				$('#hiddenIdArticolo').val(idArticolo);
				$('#annullaArticoloImmagine').attr('href','articolo-immagini.html?idArticolo='+idArticolo);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertArticoloImmagine').empty().append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getImmagini = function(idArticolo){

	var nuovoLink = 'articolo-immagini-new.html?idArticolo='+idArticolo;
	$('#nuovoLink').attr('href', nuovoLink);

	$('#articoliImmaginiTable').DataTable({
		"ajax": {
			"url": baseUrl + "articoli-immagini",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				//console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertArticoloImmagineContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle immagini articolo</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticoloImmagine').empty().append(alertContent);
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
			"emptyTable": "Nessuna immagine disponibile",
			"zeroRecords": "Nessuna immagine disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "fileName", "data": "fileName"},
			{"name": "filePath", "data": null, render: function ( data, type, row ) {
				var link = '<a class="showArticoloImmagine" data-path="'+data.filePath+'" data-name="'+data.fileName+'" href="#"><i class="far fa-image fa-2x"></i></a>';
				return link;
			}},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var links = '<a class="deleteArticoloImmagine" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});
}

$(document).on('click','.showArticoloImmagine', function(){
    var fileName = $(this).attr('data-name');
    var filePath = $(this).attr('data-path');

    var contentDetails = '<img class="imagePreview" src="'+filePath+'" alt="'+fileName+'">';

    $('#showArticoloImmagineModalMainDiv').empty().append(contentDetails);

    $('#showArticoloImmagineModal').modal('show');

});

