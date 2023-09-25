var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#categorieArticoliTable').DataTable({
		"ajax": {
			"url": baseUrl + "categorie-articoli",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertCategoriaArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle categorie articoli</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertCategoriaArticolo').empty().append(alertContent);
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
			"emptyTable": "Nessuna categoria articolo disponibile",
			"zeroRecords": "Nessuna categoria articolo disponibile"
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
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateCategoriaArticoli pr-2" data-id="'+data.id+'" href="categorie-articoli-edit.html?idCategoriaArticoli=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteCategoriaArticoli" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteCategoriaArticoli', function(){
		var idCategoriaArticoli = $(this).attr('data-id');
		$('#confirmDeleteCategoriaArticoli').attr('data-id', idCategoriaArticoli);
		$('#deleteCategoriaArticoliModal').modal('show');
	});

	$(document).on('click','#confirmDeleteCategoriaArticoli', function(){
		$('#deleteCategoriaArticoliModal').modal('hide');
		var idCategoriaArticoli = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "categorie-articoli/" + idCategoriaArticoli,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertCategoriaArticoliContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Categoria articoli</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertCategoriaArticolo').empty().append(alertContent);

				$('#categorieArticoliTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateCategoriaArticoloButton') != null && $('#updateCategoriaArticoloButton') != undefined){
		$(document).on('click','#updateCategoriaArticoloButton', function(event){
			event.preventDefault();

			var categoriaArticolo = new Object();
			categoriaArticolo.id = $('#hiddenIdCategoriaArticolo').val();
			categoriaArticolo.nome = $('#nome').val();

			var categoriaArticoloJson = JSON.stringify(categoriaArticolo);

			var alertContent = '<div id="alertCategoriaArticoloContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "categorie-articoli/" + $('#hiddenIdCategoriaArticolo').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: categoriaArticoloJson,
				success: function(result) {
					$('#alertCategoriaArticolo').empty().append(alertContent.replace('@@alertText@@','Categoria articoli modificata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCategoriaArticolo').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della categoria articoli').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newCategoriaArticoloButton') != null && $('#newCategoriaArticoloButton') != undefined){
		$(document).on('click','#newCategoriaArticoloButton', function(event){
			event.preventDefault();

			var categoriaArticolo = new Object();
			categoriaArticolo.nome = $('#nome').val();

			var categoriaArticoloJson = JSON.stringify(categoriaArticolo);

			var alertContent = '<div id="alertCategoriaArticoloContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "categorie-articoli",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: categoriaArticoloJson,
				success: function(result) {
					$('#alertCategoriaArticolo').empty().append(alertContent.replace('@@alertText@@','Categoria articoli creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCategoriaArticolo').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della categoria articoli').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdCategoriaArticoliFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idCategoriaArticoli') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getCategoriaArticoli = function(idCategoriaArticoli){

	var alertContent = '<div id="alertCategoriaArticoliContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero della categoria articoli.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "categorie-articoli/" + idCategoriaArticoli,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdCategoriaArticolo').attr('value', result.id);
			$('#nome').attr('value', result.nome);

          } else{
            $('#alertCategoriaArticolo').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertCategoriaArticolo').empty().append(alertContent);
            $('#updateCategoriaArticoloButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
