var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#allergeniTable').DataTable({
		"ajax": {
			"url": baseUrl + "allergeni",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertAllergeneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero degli allergeni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAllergene').empty().append(alertContent);
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
			"emptyTable": "Nessun allergene disponibile",
			"zeroRecords": "Nessun allergene disponibile"
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
				var links = '<a class="updateAllergene pr-2" data-id="'+data.id+'" href="allergeni-edit.html?idAllergene=' + data.id + '"><i class="far fa-edit"></i></a>';
				links += '<a class="deleteAllergene" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteAllergene', function(){
		var idAllergene = $(this).attr('data-id');
		$('#confirmDeleteAllergene').attr('data-id', idAllergene);
		$('#deleteAllergeneModal').modal('show');
	});

	$(document).on('click','#confirmDeleteAllergene', function(){
		$('#deleteAllergeneModal').modal('hide');
		var idAllergene = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "allergeni/" + idAllergene,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertAllergeneContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Allergene</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAllergene').empty().append(alertContent);

				$('#allergeniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertAllergeneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione dell\'allergene' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertAllergene').empty().append(alertContent);

                $('#allergeniTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateAllergeneButton') != null && $('#updateAllergeneButton') != undefined){
		$(document).on('submit','#updateAllergeneForm', function(event){
			event.preventDefault();

			var allergene = new Object();
			allergene.id = $('#hiddenIdAllergene').val();
			allergene.nome = $('#nome').val();

			var allergeneJson = JSON.stringify(allergene);

			var alertContent = '<div id="alertAllergeneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "allergeni/" + $('#hiddenIdAllergene').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: allergeneJson,
				success: function(result) {
					$('#alertAllergene').empty().append(alertContent.replace('@@alertText@@','Allergene modificato con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
						window.location.href = "allergeni.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertAllergene').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell\' allergene').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newAllergeneButton') != null && $('#newAllergeneButton') != undefined){
		$(document).on('submit','#newAllergeneForm', function(event){
			event.preventDefault();

			var allergene = new Object();
			allergene.nome = $('#nome').val();

			var allergeneJson = JSON.stringify(allergene);

			var alertContent = '<div id="alertAllergeneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "allergeni",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: allergeneJson,
				success: function(result) {
					$('#alertAllergene').empty().append(alertContent.replace('@@alertText@@','Allergene creato con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
						window.location.href = "allergeni.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertAllergene').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell\' allergene').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdAllergeneFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idAllergene') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getAllergene = function(idAllergene){

	var alertContent = '<div id="alertAllergeneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell\' allergene.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "allergeni/" + idAllergene,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdAllergene').attr('value', result.id);
			$('#nome').attr('value', result.nome);

          } else{
            $('#alertAllergene').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertAllergene').empty().append(alertContent);
            $('#updateAllergeneButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
