var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#categorieRicetteTable').DataTable({
		"ajax": {
			"url": baseUrl + "categorie-ricette",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertCategoriaRicetteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle categorie ricette</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertCategoriaRicette').empty().append(alertContent);
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
			"emptyTable": "Nessuna categoria ricette disponibile",
			"zeroRecords": "Nessuna categoria ricette disponibile"
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
			{"name": "ordine", "data": "ordine"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateCategoriaRicette pr-2" data-id="'+data.id+'" href="categorie-ricette-edit.html?idCategoriaRicette=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteCategoriaRicette" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteCategoriaRicette', function(){
		var idCategoriaRicette = $(this).attr('data-id');
		$('#confirmDeleteCategoriaRicette').attr('data-id', idCategoriaRicette);
		$('#deleteCategoriaRicetteModal').modal('show');
	});

	$(document).on('click','#confirmDeleteCategoriaRicette', function(){
		$('#deleteCategoriaRicetteModal').modal('hide');
		var idCategoriaRicette = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "categorie-ricette/" + idCategoriaRicette,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertCategoriaRicetteContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Categoria ricette</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertCategoriaRicette').empty().append(alertContent);

				$('#categorieRicetteTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateCategoriaRicetteButton') != null && $('#updateCategoriaRicetteButton') != undefined){
		$(document).on('click','#updateCategoriaRicetteButton', function(event){
			event.preventDefault();

			var categoriaRicette = new Object();
			categoriaRicette.id = $('#hiddenIdCategoriaRicette').val();
			categoriaRicette.nome = $('#nome').val();
			categoriaRicette.ordine = $('#ordine').val();

			var categoriaRicetteJson = JSON.stringify(categoriaRicette);

			var alertContent = '<div id="alertCategoriaRicetteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "categorie-ricette/" + $('#hiddenIdCategoriaRicette').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: categoriaRicetteJson,
				success: function(result) {
					$('#alertCategoriaRicette').empty().append(alertContent.replace('@@alertText@@','Categoria ricette modificata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCategoriaRicette').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della categoria ricette').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newCategoriaRicetteButton') != null && $('#newCategoriaRicetteButton') != undefined){
		$(document).on('click','#newCategoriaRicetteButton', function(event){
			event.preventDefault();

			var categoriaRicette = new Object();
			categoriaRicette.nome = $('#nome').val();
			categoriaRicette.ordine = $('#ordine').val();

			var categoriaRicetteJson = JSON.stringify(categoriaRicette);

			var alertContent = '<div id="alertCategoriaRicetteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "categorie-ricette",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: categoriaRicetteJson,
				success: function(result) {
					$('#alertCategoriaRicette').empty().append(alertContent.replace('@@alertText@@','Categoria ricette creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCategoriaRicette').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della categoria ricette').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdCategoriaRicetteFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idCategoriaRicette') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getCategoriaRicette = function(idCategoriaRicette){

	var alertContent = '<div id="alertCategoriaRicetteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero della categoria ricette.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "categorie-ricette/" + idCategoriaRicette,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdCategoriaRicette').attr('value', result.id);
			$('#nome').attr('value', result.nome);
            $('#ordine').attr('value', result.ordine);

          } else{
            $('#alertCategoriaRicette').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertCategoriaRicette').empty().append(alertContent);
            $('#updateCategoriaRicetteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
