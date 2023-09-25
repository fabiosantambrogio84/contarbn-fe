var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#aliquoteIvaTable').DataTable({
		"ajax": {
			"url": baseUrl + "aliquote-iva",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertAliquotaIvaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle aliquote iva</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAliquotaIva').empty().append(alertContent);
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
			"emptyTable": "Nessuna aliquota iva disponibile",
			"zeroRecords": "Nessuna aliquota iva disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "valore", "data": "valore"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateAliquotaIva pr-2" data-id="'+data.id+'" href="aliquote-iva-edit.html?idAliquotaIva=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteAliquotaIva" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteAliquotaIva', function(){
		var idAliquotaIva = $(this).attr('data-id');
		$('#confirmDeleteAliquotaIva').attr('data-id', idAliquotaIva);
		$('#deleteAliquotaIvaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteAliquotaIva', function(){
		$('#deleteAliquotaIvaModal').modal('hide');
		var idAliquotaIva = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "aliquote-iva/" + idAliquotaIva,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertAliquotaIvaContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Aliquota iva</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAliquotaIva').empty().append(alertContent);

				$('#aliquoteIvaTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertAliquotaIvaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione dell\'aliquota iva' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertAliquotaIva').empty().append(alertContent);

                $('#aliquoteIvaTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateAliquotaIvaButton') != null && $('#updateAliquotaIvaButton') != undefined){
		$(document).on('submit','#updateAliquotaIvaForm', function(event){
			event.preventDefault();

			var aliquotaIva = new Object();
			aliquotaIva.id = $('#hiddenIdAliquotaIva').val();
			aliquotaIva.valore = $('#valore').val();

			var aliquotaIvaJson = JSON.stringify(aliquotaIva);

			var alertContent = '<div id="alertAliquotaIvaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "aliquote-iva/" + $('#hiddenIdAliquotaIva').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: aliquotaIvaJson,
				success: function(result) {
					$('#alertAliquotaIva').empty().append(alertContent.replace('@@alertText@@','Aliquota iva modificata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertAliquotaIva').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell\' aliquota iva').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newAliquotaIvaButton') != null && $('#newAliquotaIvaButton') != undefined){
		$(document).on('submit','#newAliquotaIvaForm', function(event){
			event.preventDefault();

			var aliquotaIva = new Object();
			aliquotaIva.valore = $('#valore').val();

			var aliquotaIvaJson = JSON.stringify(aliquotaIva);

			var alertContent = '<div id="alertAliquotaIvaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "aliquote-iva",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: aliquotaIvaJson,
				success: function(result) {
					$('#alertAliquotaIva').empty().append(alertContent.replace('@@alertText@@','Aliquota iva creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertAliquotaIva').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell\' aliquota iva').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdAliquotaIvaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idAliquotaIva') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getAliquotaIva = function(idAliquotaIva){

	var alertContent = '<div id="alertAliquotaIvaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell\' aliquota iva.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "aliquote-iva/" + idAliquotaIva,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdAliquotaIva').attr('value', result.id);
			$('#valore').attr('value', result.valore);

          } else{
            $('#alertAliquotaIva').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertAliquotaIva').empty().append(alertContent);
            $('#updateAliquotaIvaButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
