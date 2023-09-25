var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#causaliTable').DataTable({
		"ajax": {
			"url": baseUrl + "causali",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertCausaleContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle causali</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertCausale').empty().append(alertContent);
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
			"emptyTable": "Nessuna causale disponibile",
			"zeroRecords": "Nessuna causale disponibile"
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
			{"name": "predefinito", "data": null, "width":"5%", render: function ( data, type, row ) {
				if(data.predefinito){
					return 'Si';
				} else {
					return 'No';
				}
			}},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateCausale pr-2" data-id="'+data.id+'" href="causali-edit.html?idCausale=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteCausale" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteCausale', function(){
		var idCausale = $(this).attr('data-id');
		$('#confirmDeleteCausale').attr('data-id', idCausale);
		$('#deleteCausaleModal').modal('show');
	});

	$(document).on('click','#confirmDeleteCausale', function(){
		$('#deleteCausaleModal').modal('hide');
		var idCausale = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "causali/" + idCausale,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertCausaleContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Causale</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertCausale').empty().append(alertContent);

				$('#causaliTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertCausaleContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione della causale' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertCausale').empty().append(alertContent);

                $('#causaliTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateCausaleButton') != null && $('#updateCausaleButton') != undefined){
		$(document).on('submit','#updateCausaleForm', function(event){
			event.preventDefault();

			var causale = new Object();
			causale.id = $('#hiddenIdCausale').val();
			causale.descrizione = $('#descrizione').val();
			if($('#predefinito').prop('checked') === true){
				causale.predefinito = true;
			}else{
				causale.predefinito = false;
			}

			var causaleJson = JSON.stringify(causale);

			var alertContent = '<div id="alertCausaleContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "causali/" + $('#hiddenIdCausale').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: causaleJson,
				success: function(result) {
					$('#alertCausale').empty().append(alertContent.replace('@@alertText@@','Causale modificata con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
                        window.location.href = "causali.html";
                    }, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCausale').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della causale').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newCausaleButton') != null && $('#newCausaleButton') != undefined){
		$(document).on('submit','#newCausaleForm', function(event){
			event.preventDefault();

			var causale = new Object();
			causale.descrizione = $('#descrizione').val();
			if($('#predefinito').prop('checked') === true){
				causale.predefinito = true;
			}else{
				causale.predefinito = false;
			}

			var causaleJson = JSON.stringify(causale);

			var alertContent = '<div id="alertCausaleContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "causali",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: causaleJson,
				success: function(result) {
					$('#alertCausale').empty().append(alertContent.replace('@@alertText@@','Causale creata con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
                        window.location.href = "causali.html";
                    }, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCausale').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della causale').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdCausaleFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idCausale') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getCausale = function(idCausale){

	var alertContent = '<div id="alertCausaleContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero della causale.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "causali/" + idCausale,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdCausale').attr('value', result.id);
				$('#descrizione').attr('value', result.descrizione);
				if(result.predefinito === true){
					$('#predefinito').prop('checked', true);
				}

			} else{
				$('#alertCausale').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertCausale').empty().append(alertContent);
			$('#updateCausaleButton').attr('disabled', true);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
