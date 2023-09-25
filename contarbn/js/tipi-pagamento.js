var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#tipiPagamentoTable').DataTable({
		"ajax": {
			"url": baseUrl + "tipi-pagamento",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertTipoPagamentoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei tipi di pagamento</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTipoPagamento').empty().append(alertContent);
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
			"emptyTable": "Nessun tipo di pagamento disponibile",
			"zeroRecords": "Nessun tipo di pagamento disponibile"
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
			{"name": "scadenzaGiorni", "data": "scadenzaGiorni"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateTipoPagamento pr-2" data-id="'+data.id+'" href="tipi-pagamento-edit.html?idTipoPagamento=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteTipoPagamento" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteTipoPagamento', function(){
		var idTipoPagamento = $(this).attr('data-id');
		$('#confirmDeleteTipoPagamento').attr('data-id', idTipoPagamento);
		$('#deleteTipoPagamentoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteTipoPagamento', function(){
		$('#deleteTipoPagamentoModal').modal('hide');
		var idTipoPagamento = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "tipi-pagamento/" + idTipoPagamento,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertTipoPagamentoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Tipo pagamento</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTipoPagamento').empty().append(alertContent);

				$('#tipiPagamentoTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertTipoPagamentoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione del tipo pagamento' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertTipoPagamento').empty().append(alertContent);

                $('#tipiPagamentoTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateTipoPagamentoButton') != null && $('#updateTipoPagamentoButton') != undefined){
		$(document).on('submit','#updateTipoPagamentoForm', function(event){
			event.preventDefault();

			var tipoPagamento = new Object();
			tipoPagamento.id = $('#hiddenIdTipoPagamento').val();
			tipoPagamento.descrizione = $('#descrizione').val();
			tipoPagamento.scadenzaGiorni = $('#scadenzaGiorni').val();

			var tipoPagamentoJson = JSON.stringify(tipoPagamento);

			var alertContent = '<div id="alertTipoPagamentoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "tipi-pagamento/" + $('#hiddenIdTipoPagamento').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: tipoPagamentoJson,
				success: function(result) {
					$('#alertTipoPagamento').empty().append(alertContent.replace('@@alertText@@','Tipo pagamento modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertTipoPagamento').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del tipo pagamento').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newTipoPagamentoButton') != null && $('#newTipoPagamentoButton') != undefined){
		$(document).on('submit','#newTipoPagamentoForm', function(event){
			event.preventDefault();

			var tipoPagamento = new Object();
			tipoPagamento.descrizione = $('#descrizione').val();
			tipoPagamento.scadenzaGiorni = $('#scadenzaGiorni').val();

			var tipoPagamentoJson = JSON.stringify(tipoPagamento);

			var alertContent = '<div id="alertTipoPagamentoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "tipi-pagamento",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: tipoPagamentoJson,
				success: function(result) {
					$('#alertTipoPagamento').empty().append(alertContent.replace('@@alertText@@','Tipo pagamento creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertTipoPagamento').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del tipo pagamento').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdTipoPagamentoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idTipoPagamento') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getTipoPagamento = function(idTipoPagamento){

	var alertContent = '<div id="alertTipoPagamentoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del tipo pagamento.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "tipi-pagamento/" + idTipoPagamento,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdTipoPagamento').attr('value', result.id);
			$('#descrizione').attr('value', result.descrizione);
			$('#scadenzaGiorni').attr('value', result.scadenzaGiorni);

          } else{
            $('#alertTipoPagamento').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertTipoPagamento').empty().append(alertContent);
            $('#updateTipoPagamentoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
