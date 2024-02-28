var baseUrl = "/contarbn-be/";

$.fn.loadPagamentiTable = function(url) {
	$('#pagamentiTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertPagamentoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei pagamenti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertPagamento').empty().append(alertContent);
			}
		},
		"language": {
			//"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun pagamento disponibile",
			"zeroRecords": "Nessun pagamento disponibile"
		},
		"searching":false,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc']
		],
		"columns": [
			{"name": "dataHidden", "data": "data", "visible": false},
			{"name": "data", "data": null, "width":"5%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "cliente", "data": "cliente", "width":"8%"},
			{"name": "fornitore", "data": "fornitore", "width":"8%"},
			{"name": "descrizione", "data": "descrizione", "width":"12%"},
			{"name": "tipoPagamento", "data": "tipoPagamento", "width":"5%"},
			{"name": "note", "data": null, "width": "12%", render: function ( data, type, row ) {
				var note = data.note;
				if(note == null || note == undefined){
					note = "";
				}
				var noteTrunc = note;
				var noteHtml = '<div>'+noteTrunc+'</div>';
				if(note != null && note != undefined && note != "" && note.length > 100){
					noteTrunc = note.substring(0, 100)+'...';
					noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';
				}

				return noteHtml;
			}},
			{"name": "importo", "data": null, "width":"5%", render: function ( data, type, row ) {
				return $.fn.formatNumber(data.importo);
			}},
			{"data": null, "orderable":false, "width":"2%", render: function ( data, type, row ) {
				var links = '<a class="deletePagamento" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"initComplete": function( settings, json ) {
			$('[data-toggle="tooltip"]').tooltip();
		},
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px').addClass('rowPagamento');
			$(row).attr('data-id-pagamento', data.id);
			$(cells[7]).css('text-align','right').css('font-weight','bold');
			//$(cells[3]).css('text-align','right');
		}
	});
}

$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();

	$.fn.loadPagamentiTable(baseUrl + "pagamenti/search");

	$(document).on('click','#resetSearchPagamentoButton', function(){
		$('#searchPagamentoForm :input').val(null);
		$('#searchPagamentoForm select option[value=""]').attr('selected', true);

		$('#pagamentiTable').DataTable().destroy();
		$.fn.loadPagamentiTable(baseUrl + "pagamenti/search");
	});

	$(document).on('click','.deletePagamento', function(){
		var idPagamento = $(this).attr('data-id');
		$('#confirmDeletePagamento').attr('data-id', idPagamento);
		$('#deletePagamentoModal').modal('show');
	});

	$(document).on('click','#confirmDeletePagamento', function(){
		$('#deletePagamentoModal').modal('hide');
		var idPagamento = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "pagamenti/" + idPagamento,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertPagamentoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Pagamento</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertPagamento').empty().append(alertContent);

				$('#pagamentiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertPagamentoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione del pagamento' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertPagamento').empty().append(alertContent);

                $('#pagamentiTable').DataTable().ajax.reload();
			}
		});
	});

	$(document).on('click','#printPagamenti', function(event){
		event.preventDefault();

		var ids = "";

		$(".rowPagamento").each(function(i, item){
			var id = $(this).attr('data-id-pagamento');
			ids += id+",";
		});

		window.open(baseUrl + "stampe/pagamenti?ids="+ids, '_blank');

	});

	if($('#searchPagamentoButton') != null && $('#searchPagamentoButton') != undefined) {
		$(document).on('submit', '#searchPagamentoForm', function (event) {
			event.preventDefault();

			var dataDa = $('#searchDataFrom').val();
			var dataA = $('#searchDataTo').val();
			var cliente = $('#searchCliente').val();
			var fornitore = $('#searchFornitore').val();
			var importo = $('#searchImporto').val();
			var tipologia = $('#searchTipologia option:selected').val();

			var params = {};
			if(dataDa != null && dataDa != undefined && dataDa != ''){
				params.dataDa = dataDa;
			}
			if(dataA != null && dataA != undefined && dataA != ''){
				params.dataA = dataA;
			}
			if(cliente != null && cliente != undefined && cliente != ''){
				params.cliente = cliente;
			}
			if(fornitore != null && fornitore != undefined && fornitore != ''){
				params.fornitore = fornitore;
			}
			if(importo != null && importo != undefined && importo != ''){
				params.importo = importo;
			}
			if(tipologia != null && tipologia != undefined && tipologia != ''){
				params.tipologia = tipologia;
			}
			var url = baseUrl + "pagamenti/search?" + $.param( params );

			$('#pagamentiTable').DataTable().destroy();
			$.fn.loadPagamentiTable(url);
		});
	}

	if($('#newPagamentoButton') != null && $('#newPagamentoButton') != undefined){
		$(document).on('submit','#newPagamentoForm', function(event){
			event.preventDefault();

			var idDdt = $('#hiddenIdDdt').val();
			var idDdtAcquisto = $('#hiddenIdDdtAcquisto').val();
			var idNotaAccredito = $('#hiddenIdNotaAccredito').val();
			var idNotaReso = $('#hiddenIdNotaReso').val();
			var idRicevutaPrivato = $('#hiddenIdRicevutaPrivato').val();
			var idFattura = $('#hiddenIdFattura').val();
			var idFatturaAccompagnatoria = $('#hiddenIdFatturaAccompagnatoria').val();
			var idFatturaAcquisto = $('#hiddenIdFatturaAcquisto').val();
			var idFatturaAccompagnatoriaAcquisto = $('#hiddenIdFatturaAccompagnatoriaAcquisto').val();

			var pagamento = new Object();
			pagamento.data = $('#data').val();
			pagamento.descrizione = $('#descrizione').val();

			var tipoPagamento = new Object();
			tipoPagamento.id = $('#tipoPagamento option:selected').val();
			pagamento.tipoPagamento = tipoPagamento;

			var tipologia;

			var ddt = new Object();
			if(idDdt != null && idDdt != ""){
				ddt.id = idDdt;
				tipologia = "DDT";
			}
			pagamento.ddt = ddt;

			var ddtAcquisto = new Object();
			if(idDdtAcquisto != null && idDdtAcquisto != ""){
				ddtAcquisto.id = idDdtAcquisto;
				tipologia = "DDT_ACQUISTO";
			}
			pagamento.ddtAcquisto = ddtAcquisto;

			var notaAccredito = new Object();
			if(idNotaAccredito != null && idNotaAccredito != ""){
				notaAccredito.id = idNotaAccredito;
				tipologia = "NOTA_ACCREDITO";
			}
			pagamento.notaAccredito = notaAccredito;

			var notaReso = new Object();
			if(idNotaReso != null && idNotaReso != ""){
				notaReso.id = idNotaReso;
				tipologia = "NOTA_RESO_FORNITORE";
			}
			pagamento.notaReso = notaReso;

			var ricevutaPrivato = new Object();
			if(idRicevutaPrivato != null && idRicevutaPrivato != ""){
				ricevutaPrivato.id = idRicevutaPrivato;
				tipologia = "RICEVUTA_PRIVATO";
			}
			pagamento.ricevutaPrivato = ricevutaPrivato;

			var fattura = new Object();
			if(idFattura != null && idFattura != ""){
				fattura.id = idFattura;
				tipologia = "FATTURA";
			}
			pagamento.fattura = fattura;

			var fatturaAccompagnatoria = new Object();
			if(idFatturaAccompagnatoria != null && idFatturaAccompagnatoria != ""){
				fatturaAccompagnatoria.id = idFatturaAccompagnatoria;
				tipologia = "FATTURA_ACCOMPAGNATORIA";
			}
			pagamento.fatturaAccompagnatoria = fatturaAccompagnatoria;

			var fatturaAcquisto = new Object();
			if(idFatturaAcquisto != null && idFatturaAcquisto != ""){
				fatturaAcquisto.id = idFatturaAcquisto;
				tipologia = "FATTURA_ACQUISTO";
			}
			pagamento.fatturaAcquisto = fatturaAcquisto;

			var fatturaAccompagnatoriaAcquisto = new Object();
			if(idFatturaAccompagnatoriaAcquisto != null && idFatturaAccompagnatoriaAcquisto != ""){
				fatturaAccompagnatoriaAcquisto.id = idFatturaAccompagnatoriaAcquisto;
				tipologia = "FATTURA_ACCOMPAGNATORIA_ACQUISTO";
			}
			pagamento.fatturaAccompagnatoriaAcquisto = fatturaAccompagnatoriaAcquisto;

			pagamento.tipologia = tipologia;
			pagamento.importo = $('#importo').val();
			pagamento.note = $('#note').val();

			var pagamentoJson = JSON.stringify(pagamento);

			var alertContent = '<div id="alertPagamentoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "pagamenti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: pagamentoJson,
				success: function(result) {
					$('#alertPagamento').empty().append(alertContent.replace('@@alertText@@','Pagamento creato con successo').replace('@@alertResult@@', 'success'));

					$('#newPagamentoButton').attr("disabled", true);

					var returnPage = "ddt.html";
					if(idNotaAccredito != null && idNotaAccredito != ""){
						returnPage = 'note-accredito.html';
					} else if(idNotaReso != null && idNotaReso != ""){
						returnPage = 'note-reso.html';
					} else if(idRicevutaPrivato != null && idRicevutaPrivato != ""){
						returnPage = 'ricevute-privati.html';
					} else if((idFattura != null && idFattura != "") || (idFatturaAccompagnatoria != null && idFatturaAccompagnatoria != "")){
						returnPage = 'fatture.html';
					} else if((idFatturaAcquisto != null && idFatturaAcquisto != "") || (idDdtAcquisto != null && idDdtAcquisto != "") || (idFatturaAccompagnatoriaAcquisto != null && idFatturaAccompagnatoriaAcquisto != "")){
						returnPage = 'documenti-acquisto.html';
					}

					setTimeout(function() {
						window.location.href = returnPage;
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione del pagamento';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('importo del pagamento') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertPagamento').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.preloadSearchFields = function(){

	$.ajax({
		url: baseUrl + "utils/tipologie-pagamenti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchTipologia').append('<option value="'+item.value+'" >'+item.label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

}

$.fn.extractIdDdtAcquistoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idDdtAcquisto') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractIdNotaAccreditoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idNotaAccredito') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractIdNotaResoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idNotaReso') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractIdRicevutaPrivatoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idRicevutaPrivato') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractIdFatturaFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idFattura') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractIdFatturaAccompagnatoriaFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idFatturaAccompagnatoria') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractIdFatturaAcquistoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idFatturaAcquisto') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractIdFatturaAccompagnatoriaAcquistoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idFatturaAccompagnatoriaAcquisto') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.getTipiPagamento = function(){
	$.ajax({
		url: baseUrl + "tipi-pagamento",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = item.descrizione;
					$('#tipoPagamento').append('<option value="'+item.id+'" >'+label+'</option>');
				});

			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getDdt = function(idDdt){
	$.ajax({
		url: baseUrl + "ddts/" + idDdt,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var cliente = result.cliente;
				if(cliente != null && cliente != undefined && cliente != ''){
					if(cliente.dittaIndividuale){
						$('#cliente').val(cliente.nome + ' ' + cliente.cognome);
					} else {
						$('#cliente').val(cliente.ragioneSociale);
					}
					$('#clienteDiv').removeClass('d-none');
					$('#fornitoreDiv').addClass('d-none');

					var clienteTipoPagamento = cliente.tipoPagamento;
					if(clienteTipoPagamento != null && clienteTipoPagamento != undefined && clienteTipoPagamento != ''){
						$('#tipoPagamento option[value="' + clienteTipoPagamento.id +'"]').attr('selected', true);
					}
				}

				var descrizione = "Pagamento DDT n. "+result.progressivo+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#hiddenIdDdt').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'ddt.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getDdtAcquisto = function(idDdtAcquisto){
	$.ajax({
		url: baseUrl + "ddts-acquisto/" + idDdtAcquisto,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var fornitore = result.fornitore;
				if(fornitore != null && fornitore != undefined && fornitore != ''){
					$('#fornitore').val(fornitore.ragioneSociale);
					$('#clienteDiv').addClass('d-none');
					$('#fornitoreDiv').removeClass('d-none');
				}

				var descrizione = "Pagamento DDT ACQUISTO n. "+result.numero+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#hiddenIdDdtAcquisto').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'documenti-acquisto.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getNotaAccredito = function(idNotaAccredito){
	$.ajax({
		url: baseUrl + "note-accredito/" + idNotaAccredito,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var cliente = result.cliente;
				if(cliente != null && cliente != undefined && cliente != ''){
					if(cliente.dittaIndividuale){
						$('#cliente').val(cliente.nome + ' ' + cliente.cognome);
					} else {
						$('#cliente').val(cliente.ragioneSociale);
					}
					$('#clienteDiv').removeClass('d-none');
					$('#fornitoreDiv').addClass('d-none');
				}

				var descrizione = "Pagamento NOTA ACCREDITO n. "+result.progressivo+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#tipoPagamento').parent().remove();

				$('#hiddenIdNotaAccredito').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'note-accredito.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getNotaReso = function(idNotaReso){
	$.ajax({
		url: baseUrl + "note-reso/" + idNotaReso,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var fornitore = result.fornitore;
				if(fornitore != null && fornitore != undefined && fornitore != ''){
					$('#fornitore').val(fornitore.ragioneSociale);
					$('#clienteDiv').addClass('d-none');
					$('#fornitoreDiv').removeClass('d-none');
				}

				var descrizione = "Pagamento NOTA RESO FORNITORE n. "+result.progressivo+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#tipoPagamento').parent().remove();

				$('#hiddenIdNotaReso').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'note-reso.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getRicevutaPrivato = function(idRicevutaPrivato){
	$.ajax({
		url: baseUrl + "ricevute-privati/" + idRicevutaPrivato,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var cliente = result.cliente;
				if(cliente != null && cliente != undefined && cliente != ''){
					$('#cliente').val(cliente.nome + ' ' + cliente.cognome);
					$('#clienteDiv').removeClass('d-none');
					$('#fornitoreDiv').addClass('d-none');

					var clienteTipoPagamento = cliente.tipoPagamento;
					if(clienteTipoPagamento != null && clienteTipoPagamento != undefined && clienteTipoPagamento != ''){
						$('#tipoPagamento option[value="' + clienteTipoPagamento.id +'"]').attr('selected', true);
					}
				}

				var descrizione = "Pagamento RICEVUTA a PRIVATO n. "+result.progressivo+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#hiddenIdRicevutaPrivato').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'ricevute-privati.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getFattura = function(idFattura){
	$.ajax({
		url: baseUrl + "fatture/" + idFattura,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var cliente = result.cliente;
				if(cliente != null && cliente != undefined && cliente != ''){
					if(cliente.dittaIndividuale){
						$('#cliente').val(cliente.nome + ' ' + cliente.cognome);
					} else {
						$('#cliente').val(cliente.ragioneSociale);
					}
					$('#clienteDiv').removeClass('d-none');
					$('#fornitoreDiv').addClass('d-none');

					var clienteTipoPagamento = cliente.tipoPagamento;
					if(clienteTipoPagamento != null && clienteTipoPagamento != undefined && clienteTipoPagamento != ''){
						$('#tipoPagamento option[value="' + clienteTipoPagamento.id +'"]').attr('selected', true);
					}
				}

				var descrizione = "Pagamento FATTURA n. "+result.progressivo+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#hiddenIdFattura').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'fatture.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getFatturaAccompagnatoria = function(idFatturaAccompagnatoria){
	$.ajax({
		url: baseUrl + "fatture-accompagnatorie/" + idFatturaAccompagnatoria,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var cliente = result.cliente;
				if(cliente != null && cliente != undefined && cliente != ''){
					if(cliente.dittaIndividuale){
						$('#cliente').val(cliente.nome + ' ' + cliente.cognome);
					} else {
						$('#cliente').val(cliente.ragioneSociale);
					}
					$('#clienteDiv').removeClass('d-none');
					$('#fornitoreDiv').addClass('d-none');

					var clienteTipoPagamento = cliente.tipoPagamento;
					if(clienteTipoPagamento != null && clienteTipoPagamento != undefined && clienteTipoPagamento != ''){
						$('#tipoPagamento option[value="' + clienteTipoPagamento.id +'"]').attr('selected', true);
					}
				}

				var descrizione = "Pagamento FATTURA ACCOM. n. "+result.progressivo+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#hiddenIdFatturaAccompagnatoria').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'fatture.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getFatturaAcquisto = function(idFatturaAcquisto){
	$.ajax({
		url: baseUrl + "fatture-acquisto/" + idFatturaAcquisto,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var fornitore = result.fornitore;
				if(fornitore != null && fornitore != undefined && fornitore != ''){
					$('#fornitore').val(fornitore.ragioneSociale);
					$('#clienteDiv').addClass('d-none');
					$('#fornitoreDiv').removeClass('d-none');
				}

				var descrizione = "Pagamento FATTURA ACQUISTO n. "+result.numero+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#hiddenIdFatturaAcquisto').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'documenti-acquisto.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getFatturaAccompagnatoriaAcquisto = function(idFatturaAccompagnatoriaAcquisto){
	$.ajax({
		url: baseUrl + "fatture-accompagnatorie-acquisto/" + idFatturaAccompagnatoriaAcquisto,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var fornitore = result.fornitore;
				if(fornitore != null && fornitore != undefined && fornitore != ''){
					$('#fornitore').val(fornitore.ragioneSociale);
					$('#clienteDiv').addClass('d-none');
					$('#fornitoreDiv').removeClass('d-none');
				}

				var descrizione = "Pagamento FATTURA ACCOM. ACQUISTO n. "+result.numero+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#hiddenIdFatturaAccompagnatoriaAcquisto').val(result.id);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#annullaPagamentoButton').attr('href', 'documenti-acquisto.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}