var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$(document).on('click','#resetBorderoButton', function(event){
		event.preventDefault();

		$('#searchBorderoForm :input').val(null);
		$('#searchBorderoForm select option[value=""]').attr('selected', true);

		$('#borderoTable').DataTable().destroy();
		$('#borderoMainDiv').addClass('d-none');
	});

	$(document).on('click','.deleteBorderoRiga', function(){
		var table = $('#borderoTable').DataTable();

		var riga = $(this).closest('tr');

		var indice = table.row(riga).index();

		var idBorderoRiga = $(this).attr('data-id-bordero-riga');
		$('#confirmDeleteBorderoRiga').attr('data-id-bordero-riga', idBorderoRiga).attr('data-indice', indice);
		$('#deleteBorderoRigaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteBorderoRiga', function(){
		$('#deleteBorderoRigaModal').modal('hide');
		var idBorderoRiga = $(this).attr('data-id-bordero-riga');

		var alertContent = '<div id="alertBorderoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "bordero/righe/" + idBorderoRiga,
			type: 'DELETE',
			success: function() {

				$('#alertBordero').empty().append(alertContent.replace('@@alertText@@', 'Borderò riga</strong> cancellata con successo.').replace('@@alertResult@@', 'success'));

				var table = $('#borderoTable').DataTable();

				var riga = $(this).closest('tr');

				table.row(riga).remove().draw(false);

			},
			error: function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
				$('#alertBordero').empty().append(alertContent.replace('@@alertText@@', 'Errore nella cancellazione della riga Borderò').replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('input','.progressivo', function(){
		var progressivo = $(this).val();
		var idBorderoRiga = $(this).attr("data-id-bordero-riga");

		var borderoRigaPatched = {};
		borderoRigaPatched.uuid = idBorderoRiga;
		borderoRigaPatched.progressivo = progressivo;

		var borderoRigaPatchedJson = JSON.stringify(borderoRigaPatched);

		var alertContent = '<div id="alertBorderoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "bordero/righe/" + idBorderoRiga,
			type: 'PATCH',
			contentType: "application/json",
			dataType: 'json',
			data: borderoRigaPatchedJson,
			success: function() {
				$('#alertBordero').empty().append(alertContent.replace('@@alertText@@','Progressivo modificato con successo').replace('@@alertResult@@', 'success'));
				$('#borderoTable').DataTable().ajax.reload();
			},
			error: function() {
				$('#alertBordero').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del progressivo').replace('@@alertResult@@', 'danger'));
				$('#borderoTable').DataTable().ajax.reload();
			}
		});
	});

	$(document).on('submit','#searchBorderoForm', function(event){
		event.preventDefault();

		var borderoTable = $('#borderoTable');

		borderoTable.DataTable().destroy();
		$('#borderoMainDiv').removeClass('d-none');

		var alertContent = '<div id="alertBorderoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var autistaSelected = $('#autista option:selected');
		var dataConsegna = $('#dataConsegna').val();
		if(autistaSelected == null){
			$('#alertBordero').empty().append(alertContent.replace('@@alertText@@', "Selezionare un autista/trasportatore").replace('@@alertResult@@', 'danger'));
			return;
		}
		if(dataConsegna == null){
			$('#alertBordero').empty().append(alertContent.replace('@@alertText@@', "Selezionare una data consegna").replace('@@alertResult@@', 'danger'));
			return;
		}

		var idAutistaTrasportatore = autistaSelected.val();
		var tipoAutista = autistaSelected.attr('data-tipo');

		var params = {};
		if(idAutistaTrasportatore != null && idAutistaTrasportatore !== ''){
			params.autista = tipoAutista + '_' + idAutistaTrasportatore;
		}
		params.dataConsegna = dataConsegna;

		var url = baseUrl + "bordero/genera?" + $.param(params);

		borderoTable.DataTable({
			"ajax": {
				"url": url,
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "data",
				"error": function(jqXHR) {
					console.log('Response text: ' + jqXHR.responseText);
					var alertContent = '<div id="alertBorderoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent += '<strong>Errore nella generazione del borderò</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertBordero').empty().append(alertContent);
					$('.dataTables_processing').hide();
				}
			},
			"language": {
				"paginate": {
					"first": "Inizio",
					"last": "Fine",
					"next": "Succ.",
					"previous": "Prec."
				},
				"emptyTable": "Nessuna riga disponibile",
				"zeroRecords": "Nessuna riga disponibile",
				"info": "Da _START_ a _END_ di _TOTAL_ risultati"
			},
			"searching": false,
			"responsive":true,
			"pageLength": 20,
			"lengthChange": false,
			"processing": true,
			"serverSide": true,
			"info": true,
			"dom": '<"top"p>rt<"bottom"ip>',
			"autoWidth": false,
			"order": [
				[1, 'asc'],
				[2, 'asc'],
				[3, 'asc']
			],
			"columns": [
				{"name":"uuid", "data": "uuid", "width":"5%", "visible": false},
				{"name":"progressivo", "data": null, "width":"8%", render: function(data) {
					return '<input type="number" class="form-control form-control-sm progressivo" data-id-bordero-riga="'+data.uuid+'" min="1">';
				}},
				{"name":"cliente_fornitore", "data": "clienteFornitore", "width":"15%"},
				{"name":"punto_consegna", "data": "puntoConsegna", "width":"15%"},
				{"name":"telefono", "data": "telefono", "width":"10%"},
				{"name":"note", "data": "note", "width":"15%"},
				{"data": null, "orderable":false, "width":"5%", render: function (data) {
					return '<a class="deleteBorderoRiga pr-1" data-id-bordero-riga="'+data.uuid+'" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				}}
			],
			"createdRow": function(row){
				$(row).css('font-size', '12px');
			}
		});

	});

});

$.fn.preloadSearchFields = function(){
	return $.ajax({
		url: baseUrl + "autisti?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#autista').append('<option value="'+item.id+'" data-tipo="autista">'+item.cognome + ' ' + item.nome+'</option>');
				});

				$.ajax({
					url: baseUrl + "trasportatori",
					type: 'GET',
					async: false,
					dataType: 'json',
					success: function(result2) {
						if(result2 != null && result2 !== ''){
							$('#autista').append('<option disabled>_________</option>');
							$.each(result2, function(i, item2){
								$('#autista').append('<option value="'+item2.id+'" data-tipo="trasportatore">'+item2.cognome + ' ' + item2.nome+'</option>');
							});
						}
					},
					error: function(jqXHR) {
						console.log('Response text: ' + jqXHR.responseText);
					}
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
