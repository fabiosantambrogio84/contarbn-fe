var baseUrl = "/contarbn-be/";
var rowBackgroundVerde = '#96ffb2';
var rowBackgroundRosa = '#fcd1ff';
var rowBackgroundGiallo = '#fffca3';

$.fn.loadFatturaAccompagnatoriaAcquistoProdottiTable = function() {
	$('#fatturaAccompagnatoriaAcquistoProdottiTable').DataTable({
		"searching": false,
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "",
			"zeroRecords": ""
		},
		"pageLength": 50,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"columns": [
			{ "width": "12%" },
			{ "width": "12%" },
			{ "width": "5%" },
			{ "width": "3%" },
			{ "width": "8%" },
			{ "width": "5%" },
			{ "width": "5%" },
			{ "width": "5%" },
			{ "width": "5%" },
			{ "width": "4%" },
			{ "width": "2%" }
		],
		"order": [
			[0, 'asc']
		]
	});
}

$.fn.loadFatturaAccompagnatoriaAcquistoTotaliTable = function() {
	$('#fatturaAccompagnatoriaAcquistoTotaliTable').DataTable({
		"ajax": {
			"url": baseUrl + "aliquote-iva",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertFattureAccompagnatorieAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle aliquote iva</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent);
			}
		},
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna aliquota iva disponibile",
			"zeroRecords": "Nessuna aliquota iva disponibile"
		},
		"searching": false,
		"responsive":true,
		"paging": false,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "valore", "data": null, "width":"8%", render: function ( data, type, row ) {
					return data.valore;
				}},
			{"name": "totaleIva", "data": null, "width":"8%", render: function ( data, type, row ) {
					return ''
				}},
			{"name": "totaleImponibile", "data": null, "width":"8%", render: function ( data, type, row ) {
					return ''
				}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).attr('data-id', data.id);
			$(row).attr('data-valore', data.valore);
			$(row).addClass('rowTotaliByIva');
			$(cells[0]).css('text-align','center');
			$(cells[1]).css('text-align','center');
			$(cells[2]).css('text-align','center');
		}
	});
}

$(document).ready(function() {

	$.fn.loadFatturaAccompagnatoriaAcquistoProdottiTable();

	$.fn.loadFatturaAccompagnatoriaAcquistoTotaliTable();

	$.fn.createFatturaAccompagnatoriaAcquisto = function(print){

		var alertContent = '<div id="alertFattureAccompagnatorieAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var validDataTrasporto = $.fn.validateDataTrasporto();
		if(!validDataTrasporto){
			$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@', "'Data trasporto' non può essere precedente alla data della Fattura Accompagnatoria Acquisto").replace('@@alertResult@@', 'danger'));
			return false;
		}

		var fatturaAccompagnatoriaAcquisto = new Object();
		fatturaAccompagnatoriaAcquisto.numero = $('#numero').val();
		fatturaAccompagnatoriaAcquisto.data = $('#data').val();

		var fornitore = new Object();
		fornitore.id = $('#fornitore option:selected').val();
		fatturaAccompagnatoriaAcquisto.fornitore = fornitore;

		var causale = new Object();
		causale.id = $('#causale option:selected').val();
		fatturaAccompagnatoriaAcquisto.causale = causale;

		var prodottoTable = $('#fatturaAccompagnatoriaAcquistoProdottiTable').DataTable();
		var fatturaAccompagnatoriaAcquistoProdottiLength = prodottoTable.rows().nodes().length;

		if(fatturaAccompagnatoriaAcquistoProdottiLength != null && fatturaAccompagnatoriaAcquistoProdottiLength != undefined && fatturaAccompagnatoriaAcquistoProdottiLength != 0){

			var fatturaAccompagnatoriaAcquistoArticoli = [];
			var fatturaAccompagnatoriaAcquistoIngredienti = [];

			prodottoTable.rows().nodes().each(function(i, item){
				var tipo = $(i).attr('data-tipo');
				var prodottoId = $(i).attr('data-id');

				if(tipo == 'articolo'){
					var fatturaAccompagnatoriaAcquistoArticolo = {};
					var fatturaAccompagnatoriaAcquistoArticoloId = new Object();
					fatturaAccompagnatoriaAcquistoArticoloId.articoloId = prodottoId;
					fatturaAccompagnatoriaAcquistoArticolo.id = fatturaAccompagnatoriaAcquistoArticoloId;

					fatturaAccompagnatoriaAcquistoArticolo.lotto = $(i).children().eq(1).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoArticolo.scadenza = $(i).children().eq(2).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoArticolo.quantita = $(i).children().eq(4).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoArticolo.numeroPezzi = $(i).children().eq(5).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoArticolo.prezzo = $(i).children().eq(6).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoArticolo.sconto = $(i).children().eq(7).children().eq(0).val();

					fatturaAccompagnatoriaAcquistoArticoli.push(fatturaAccompagnatoriaAcquistoArticolo);

				} else if(tipo == 'ingrediente'){
					var fatturaAccompagnatoriaAcquistoIngrediente = {};
					var fatturaAccompagnatoriaAcquistoIngredienteId = new Object();
					fatturaAccompagnatoriaAcquistoIngredienteId.ingredienteId = prodottoId;
					fatturaAccompagnatoriaAcquistoIngrediente.id = fatturaAccompagnatoriaAcquistoIngredienteId;

					fatturaAccompagnatoriaAcquistoIngrediente.lotto = $(i).children().eq(1).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoIngrediente.scadenza = $(i).children().eq(2).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoIngrediente.quantita = $(i).children().eq(4).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoIngrediente.numeroPezzi = $(i).children().eq(5).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoIngrediente.prezzo = $(i).children().eq(6).children().eq(0).val();
					fatturaAccompagnatoriaAcquistoIngrediente.sconto = $(i).children().eq(7).children().eq(0).val();

					fatturaAccompagnatoriaAcquistoIngredienti.push(fatturaAccompagnatoriaAcquistoIngrediente);
				}
				if(Array.isArray(fatturaAccompagnatoriaAcquistoArticoli) && fatturaAccompagnatoriaAcquistoArticoli.length){
					fatturaAccompagnatoriaAcquisto.fatturaAccompagnatoriaAcquistoArticoli = fatturaAccompagnatoriaAcquistoArticoli;
				}
				if(Array.isArray(fatturaAccompagnatoriaAcquistoIngredienti) && fatturaAccompagnatoriaAcquistoIngredienti.length){
					fatturaAccompagnatoriaAcquisto.fatturaAccompagnatoriaAcquistoIngredienti = fatturaAccompagnatoriaAcquistoIngredienti;
				}

			});
		}

		var fatturaAccompagnatoriaAcquistoTotaliLength = $('.rowTotaliByIva').length;
		if(fatturaAccompagnatoriaAcquistoTotaliLength != null && fatturaAccompagnatoriaAcquistoTotaliLength != undefined && fatturaAccompagnatoriaAcquistoTotaliLength != 0){
			var fatturaAccompagnatoriaAcquistoTotali = [];
			$('.rowTotaliByIva').each(function(i, item){
				var aliquotaIvaId = $(this).attr('data-id');

				var fatturaAccompagnatoriaAcquistoTotale = {};
				var fatturaAccompagnatoriaAcquistoTotaleId = new Object();
				fatturaAccompagnatoriaAcquistoTotaleId.aliquotaIvaId = aliquotaIvaId;
				fatturaAccompagnatoriaAcquistoTotale.id = fatturaAccompagnatoriaAcquistoTotaleId;

				fatturaAccompagnatoriaAcquistoTotale.totaleIva = $(this).find('td').eq(1).text();
				fatturaAccompagnatoriaAcquistoTotale.totaleImponibile = $(this).find('td').eq(2).text();

				fatturaAccompagnatoriaAcquistoTotali.push(fatturaAccompagnatoriaAcquistoTotale);
			});
			fatturaAccompagnatoriaAcquisto.fatturaAccompagnatoriaAcquistoTotali = fatturaAccompagnatoriaAcquistoTotali;
		}

		fatturaAccompagnatoriaAcquisto.numeroColli = $('#colli').val();
		fatturaAccompagnatoriaAcquisto.tipoTrasporto = $('#tipoTrasporto option:selected').val();
		fatturaAccompagnatoriaAcquisto.dataTrasporto = $('#dataTrasporto').val();

		var regex = /:/g;
		var oraTrasporto = $('#oraTrasporto').val();
		if(oraTrasporto != null && oraTrasporto != ''){
			var count = oraTrasporto.match(regex);
			count = (count) ? count.length : 0;
			if(count == 1){
				fatturaAccompagnatoriaAcquisto.oraTrasporto = $('#oraTrasporto').val() + ':00';
			} else {
				fatturaAccompagnatoriaAcquisto.oraTrasporto = $('#oraTrasporto').val();
			}
		}
		fatturaAccompagnatoriaAcquisto.trasportatore = $('#trasportatore').val();
		fatturaAccompagnatoriaAcquisto.note = $('#note').val();

		var fatturaAccompagnatoriaAcquistoJson = JSON.stringify(fatturaAccompagnatoriaAcquisto);

		$.ajax({
			url: baseUrl + "fatture-accompagnatorie-acquisto",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: fatturaAccompagnatoriaAcquistoJson,
			success: function(result) {
				var idFatturaAccompagnatoriaAcquisto = result.id;

				$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@','Fattura accompagnatoria acquisto creata con successo').replace('@@alertResult@@', 'success'));

				$('#newFatturaAccompagnatoriaAcquistoButton').attr("disabled", true);

				// Returns to the same page
				setTimeout(function() {
					window.location.href = "fatture-accompagnatorie-acquisto-new.html?dt="+fatturaAccompagnatoriaAcquisto.dataTrasporto+"&ot="+oraTrasporto;
				}, 1000);

				if(print){
					window.open(baseUrl + "stampe/fatture-accompagnatorie-acquisto/"+idFatturaAccompagnatoriaAcquisto, '_blank');
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione della fattura accompagnatoria acquisto';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	}

	if($('#newFatturaAccompagnatoriaAcquistoButton') != null && $('#newFatturaAccompagnatoriaAcquistoButton') != undefined && $('#newFatturaAccompagnatoriaAcquistoButton').length > 0){

		$('#prodotto').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('submit','#newFatturaAccompagnatoriaAcquistoForm', function(event){
			event.preventDefault();

			$.fn.createFatturaAccompagnatoriaAcquisto(false);

		});
	}

	if($('#newAndPrintFatturaAccompagnatoriaAcquistoButton') != null && $('#newAndPrintFatturaAccompagnatoriaAcquistoButton') != undefined && $('#newAndPrintFatturaAccompagnatoriaAcquistoButton').length > 0){
		$('#prodotto').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('click','#newAndPrintFatturaAccompagnatoriaAcquistoButton', function(event){
			event.preventDefault();

			$.fn.createFatturaAccompagnatoriaAcquisto(true);
		});
	}

	if($('#updateFatturaAccompagnatoriaAcquistoButton') != null && $('#updateFatturaAccompagnatoriaAcquistoButton') != undefined && $('#updateFatturaAccompagnatoriaAcquistoButton').length > 0){

		$(document).on('submit','#updateFatturaAccompagnatoriaAcquistoForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertFattureAccompagnatorieAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var fatturaAccompagnatoriaAcquisto = new Object();
			fatturaAccompagnatoriaAcquisto.id = parseInt($('#hiddenIdFatturaAccompagnatoriaAcquisto').val());
			fatturaAccompagnatoriaAcquisto.numero = $('#numero').val();
			fatturaAccompagnatoriaAcquisto.data = $('#data').val();
			fatturaAccompagnatoriaAcquisto.note = $('#note').val();

			var fatturaAccompagnatoriaAcquistoJson = JSON.stringify(fatturaAccompagnatoriaAcquisto);

			$.ajax({
				url: baseUrl + "fatture-accompagnatorie-acquisto/" + fatturaAccompagnatoriaAcquisto.id,
				type: 'PATCH',
				contentType: "application/json",
				dataType: 'json',
				data: fatturaAccompagnatoriaAcquistoJson,
				success: function(result) {
					$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@','Fattura accompagnatoria acquisto modificata con successo').replace('@@alertResult@@', 'success'));

					$('#updateFatturaAccompagnatoriaAcquistoButton').attr("disabled", true);

					// Returns to the same page
					setTimeout(function() {
						window.location.href = "documenti-acquisto.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica della fattura accompagnatoria acquisto';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('change','#fornitore', function(){
		$.fn.preloadArticoloOrIngredienteSection();
	});

	$(document).on('change','#prodotto', function(){
		var prodotto = $('#prodotto option:selected').val();
		if(prodotto != null && prodotto != ''){
			var tipo = $('#prodotto option:selected').attr('data-tipo');
			var udm = $('#prodotto option:selected').attr('data-udm');
			var iva = $('#prodotto option:selected').attr('data-iva');
			var quantita = $('#prodotto option:selected').attr('data-qta');
			var prezzo;
			if(tipo === 'articolo'){
				var prezzoBase = $('#prodotto option:selected').attr('data-prezzo-base');
				var prezzoListino = $('#prodotto option:selected').attr('data-prezzo-listino');
				if(prezzoListino != null && prezzoListino != undefined && prezzoListino != ''){
					prezzo = prezzoListino;
				} else {
					prezzo = prezzoBase;
				}
			} else {
				prezzo = $('#prodotto option:selected').attr('data-prezzo-acquisto');
			}

			var sconto = $('#prodotto option:selected').attr('data-sconto');

			$('#udm').val(udm);
			$('#iva').val(iva);
			$('#lotto').val('');
			$('#scadenza').val('');
			$('#quantita').val(quantita);
			$('#pezzi').val('');
			$('#prezzo').val(prezzo);
			$('#sconto').val(sconto);
		} else {
			$('#udm').val('');
			$('#iva').val('');
			$('#lotto').val('');
			$('#scadenza').val('');
			$('#quantita').val('');
			$('#pezzi').val('');
			$('#prezzo').val('');
			$('#sconto').val('');
		}
	});

	$(document).on('change','.compute-totale', function(){
		$.row = $(this).parent().parent();
		var quantita = $.row.children().eq(4).children().eq(0).val();
		quantita = $.fn.parseValue(quantita, 'float');
		var prezzo = $.row.children().eq(6).children().eq(0).val();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $.row.children().eq(7).children().eq(0).val();
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		var totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		$.row.children().eq(8).text(totale);

		$.fn.computeTotale();
	});

	$(document).on('change','.scadenza', function(){
		$.fn.checkProdottiScadenza();
	});

	$(document).on('click','#addProdotto', function(event){
		event.preventDefault();

		var prodottoId = $('#prodotto option:selected').val();

		if(prodottoId == null || prodottoId == undefined || prodottoId == ''){
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Seleziona un prodotto\n' +
				'              </div>';

			$('#addFatturaAccompagnatoriaAcquistoProdottoAlert').empty().append(alertContent);
			return;
		} else {
			$('#addFatturaAccompagnatoriaAcquistoProdottoAlert').empty();
		}

		var pezzi = $('#pezzi').val();
		if(pezzi == null || pezzi == undefined || pezzi == ''){
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Inserisci il numero di pezzi\n' +
				'              </div>';

			$('#addFatturaAccompagnatoriaAcquistoProdottoAlert').empty().append(alertContent);
			return;
		} else {
			$('#addFatturaAccompagnatoriaAcquistoProdottoAlert').empty();
		}

		var prodotto = $('#prodotto option:selected').text();
		var tipo = $('#prodotto option:selected').attr('data-tipo');
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#scadenza').val();
		var quantita = $('#quantita').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#iva').val();
		var codiceFornitore = $('#prodotto option:selected').attr("data-codice-fornitore");
		var lottoRegExp = $('#prodotto option:selected').attr("data-lotto-regexp");
		var dataScadenzaRegExp = $('#prodotto option:selected').attr("data-scadenza-regexp");
		var scadenzaGiorni = $('#prodotto option:selected').attr("data-scadenza-giorni");

		if(lotto != null && lotto != undefined && lotto != ''){
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
		} else {
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
		}
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';

		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(quantita, 3) +'">';
		var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+pezzi+'">';
		var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+sconto+'">';

		// check if a same articolo was already added
		var found = 0;
		var currentRowIndex;
		var currentIdProdotto;
		var currentLotto;
		var currentPrezzo;
		var currentSconto;
		var currentScadenza;
		var currentQuantita = 0;
		var currentPezzi = 0;
		var currentPezziDaEvadere = 0;

		var fatturaAccompagnatoriaAcquistoProdottiLength = $('.rowArticolo').length;
		if(fatturaAccompagnatoriaAcquistoProdottiLength != null && fatturaAccompagnatoriaAcquistoProdottiLength != undefined && fatturaAccompagnatoriaAcquistoProdottiLength != 0) {
			$('.rowArticolo').each(function(i, item){

				if(found != 1){
					currentRowIndex = $(this).attr('data-row-index');
					currentIdProdotto = $(this).attr('data-id');
					currentLotto = $(this).children().eq(1).children().eq(0).val();
					currentScadenza = $(this).children().eq(2).children().eq(0).val();
					currentPrezzo = $(this).children().eq(6).children().eq(0).val();
					currentSconto = $(this).children().eq(7).children().eq(0).val();
					if(currentSconto == '0'){
						currentSconto = '';
					}

					if($.fn.normalizeIfEmptyOrNullVariable(currentIdProdotto) == $.fn.normalizeIfEmptyOrNullVariable(prodottoId)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentLotto) == $.fn.normalizeIfEmptyOrNullVariable(lotto)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentPrezzo) == $.fn.normalizeIfEmptyOrNullVariable(prezzo)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentSconto) == $.fn.normalizeIfEmptyOrNullVariable(sconto)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentScadenza) == $.fn.normalizeIfEmptyOrNullVariable(scadenza)){
						found = 1;
						currentQuantita = $(this).children().eq(4).children().eq(0).val();
						currentPezzi = $(this).children().eq(5).children().eq(0).val();
					}
				}
			});
		}

		var totale = 0;
		quantita = $.fn.parseValue(quantita, 'float');
		prezzo = $.fn.parseValue(prezzo, 'float');
		sconto = $.fn.parseValue(sconto, 'float');
		pezzi = $.fn.parseValue(pezzi, 'int');

		var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var table = $('#fatturaAccompagnatoriaAcquistoProdottiTable').DataTable();
		if(found >= 1){

			// aggiorno la riga
			$.fn.aggiornaRigaProdotto(table,currentRowIndex,currentIdProdotto,currentQuantita,currentPezzi,currentLotto,currentScadenza,currentPrezzo,currentSconto,quantita,pezzi,codiceFornitore,lottoRegExp,dataScadenzaRegExp,totale);

		} else {
			// inserisco nuova riga
			$.fn.inserisciRigaProdotto(table,prodottoId,prodotto,lottoHtml,scadenzaHtml,udm,quantitaHtml,pezziHtml,prezzoHtml,scontoHtml,totale,iva,tipo,scadenzaGiorni);

		}
		$.fn.computeTotale();

		$.fn.checkProdottiScadenza();

		$('#prodotto option[value=""]').prop('selected',true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		$('#prodotto').focus();
		$('#prodotto').selectpicker('refresh');
	});

	$(document).on('click','.deleteDdtProdotto', function(){
		$('#fatturaAccompagnatoriaAcquistoProdottiTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#fatturaAccompagnatoriaAcquistoProdottiTable').focus();

		$.fn.computeTotale();

		$.fn.checkProdottiScadenza();

	});

});

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

$.fn.preloadFields = function(dataTrasporto, oraTrasporto){
	$('#colli').attr('value', 1);
	$('#data').val(moment().format('YYYY-MM-DD'));

	if(dataTrasporto != null && dataTrasporto != undefined && dataTrasporto != ''){
		$('#dataTrasporto').val(dataTrasporto);
	} else {
		$('#dataTrasporto').val(moment().format('YYYY-MM-DD'));
	}

	if(oraTrasporto != null && oraTrasporto != undefined && oraTrasporto != ''){
		$('#oraTrasporto').val(oraTrasporto);
	} else {
		$('#oraTrasporto').val(moment().format('HH:mm'));
	}

	$('#fornitore').focus();

	var uri = window.location.toString();
	if (uri.indexOf("?") > 0) {
		var clean_uri = uri.substring(0, uri.indexOf("?"));
		window.history.replaceState({}, document.title, clean_uri);
	}
}

$.fn.preloadArticoloOrIngredienteSection = function(){
	$('#prodotto option[value=""]').prop('selected', true);
	$('#udm').val('');
	$('#iva').val('');
	$('#lotto').val('');
	$('#scadenza').val('');
	$('#quantita').val('');
	$('#prezzo').val('');
	$('#sconto').val('');

	var fornitore = $('#fornitore option:selected').val();
	if(fornitore != null && fornitore != ''){
		var tipoFornitore = $('#fornitore option:selected').attr("data-tipo");
		if(tipoFornitore == 'FORNITORE_ARTICOLI'){
			$('#aggiungiTitle').text('Aggiungi articolo');
			$('#prodottoLabel').text('Articolo');
			$('#tableHeaderProdotto').text('Articolo');

			$.fn.getArticoli(fornitore);

		} else if(tipoFornitore == 'FORNITORE_INGREDIENTI'){
			$('#aggiungiTitle').text('Aggiungi ingrediente');
			$('#prodottoLabel').text('Ingrediente');
			$('#tableHeaderProdotto').text('Ingrediente');

			$.fn.getIngredienti(fornitore);
		}

	} else {
		$('#prodotto').empty();
	}
}

$.fn.getFornitori = function(){
	$.ajax({
		url: baseUrl + "fornitori?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = item.ragioneSociale;
					label += ' - ' + item.indirizzo + ' ' + item.citta + ', ' + item.cap + ' (' + item.provincia + ')';

					$('#fornitore').append('<option value="'+item.id+'" data-tipo="'+item.tipoFornitore.codice+'">'+label+'</option>');
					$('#fornitore').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getTipologieTrasporto = function(){
	$.ajax({
		url: baseUrl + "utils/tipologie-trasporto-ddt",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var tipologiaTrasporto = item;
					if(item != null && item != '' && item == 'Mittente'){
						$('#tipoTrasporto').append('<option value="'+item+'" selected>'+item+'</option>');
					} else {
						$('#tipoTrasporto').append('<option value="'+item+'">'+item+'</option>');
					}

				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getCausali = function(dataTrasporto, oraTrasporto){
	$.ajax({
		url: baseUrl + "causali",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					if(item != null && item != ''){
						if(item.descrizione == 'Vendita'){
							$('#causale').append('<option value="'+item.id+'" selected>'+item.descrizione+'</option>');
						} else{
							$('#causale').append('<option value="'+item.id+'">'+item.descrizione+'</option>');
						}
					}
				});
				$.fn.preloadFields(dataTrasporto, oraTrasporto);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticoli = function(idFornitore){
	$.ajax({
		url: baseUrl + "articoli?attivo=true&idFornitore="+idFornitore,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var dataUdm = '';
					var udm = item.unitaMisura;
					if(udm != null && udm != undefined){
						dataUdm = udm.etichetta;
					}
					var dataIva = '';
					var iva = item.aliquotaIva;
					if(iva != null && iva != undefined){
						dataIva = iva.valore;
					}
					var dataQta = item.quantitaPredefinita;
					var dataPrezzoBase = item.prezzoListinoBase;
					var lottoRegexp = $.fn.getLottoRegExp(item);
					var dataScadenzaRegexp = $.fn.getDataScadenzaRegExp(item);
					var scadenzaGiorni = 0;
					if(item.scadenzaGiorni !== null){
						scadenzaGiorni = item.scadenzaGiorni;
					}

					$('#prodotto').append('<option value="'+item.id+'" ' +
						'data-tipo="articolo" ' +
						'data-udm="'+dataUdm+'" ' +
						'data-iva="'+dataIva+'" ' +
						'data-qta="'+dataQta+'" ' +
						'data-prezzo-base="'+dataPrezzoBase+'" ' +
						'data-codice-fornitore="'+item.fornitore.codice+'" ' +
						'data-lotto-regexp="'+lottoRegexp+'" ' +
						'data-scadenza-regexp="'+dataScadenzaRegexp+'" ' +
						'data-scadenza-giorni="'+scadenzaGiorni+'" ' +
						'>'+item.codice+' '+item.descrizione+'</option>');

					$('#prodotto').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
			var alertContent = '<div id="alertFattureAccompagnatorieAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli articoli').replace('@@alertResult@@', 'danger'));
		}
	});
}

$.fn.getIngredienti = function(idFornitore){
	$.ajax({
		url: baseUrl + "ingredienti?attivo=true&idFornitore="+idFornitore,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			$('#prodotto').empty().append('<option value=""></option>');
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var dataUdm = '';
					var udm = item.unitaMisura;
					if(udm != null && udm != undefined){
						dataUdm = udm.etichetta;
					}
					var dataIva = '';
					var iva = item.aliquotaIva;
					if(iva != null && iva != undefined){
						dataIva = iva.valore;
					}
					var scadenzaGiorni = 0;
					if(item.scadenzaGiorni !== null){
						scadenzaGiorni = item.scadenzaGiorni;
					}
					$('#prodotto').append('<option value="'+item.id+'" ' +
						'data-tipo="ingrediente" ' +
						'data-udm="'+dataUdm+'" ' +
						'data-iva="'+dataIva+'" ' +
						'data-qta="" ' +
						'data-prezzo-acquisto="'+item.prezzo+'"' +
						'data-scadenza-giorni="'+scadenzaGiorni+'" ' +
						'>'+item.codice+' '+item.descrizione+'</option>');

					$('#prodotto').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
			var alertContent = '<div id="alertFattureAccompagnatorieAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli ingredienti').replace('@@alertResult@@', 'danger'));
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
				$('#hiddenIdFatturaAccompagnatoriaAcquisto').attr('value', result.id);
				$('#numero').attr('value', result.numero);
				$('#data').attr('value', result.data);
				$('#note').val(result.note);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}