var baseUrl = "/contarbn-be/";
var rowBackgroundVerde = '#96ffb2';
var rowBackgroundRosa = '#fcd1ff';
var rowBackgroundGiallo = '#fffca3';

$(document).ready(function() {

	$('#fatturaAccompagnatoriaArticoliTable').DataTable({
		"searching": false,
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				//"previous": "<i class=\"fa fa-backward\" aria-hidden=\"true\"></i>"
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

	$('#fatturaAccompagnatoriaTotaliTable').DataTable({
		"ajax": {
			"url": baseUrl + "aliquote-iva",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertFattureContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle aliquote iva</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFattureAccompagnatorie').empty().append(alertContent);
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

	$.fn.createFatturaAccompagnatoria = function(print){

		var alertContent = '<div id="alertFattureAccompagnatorieContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		/*
        var validLotto = $.fn.validateLotto();
        if(!validLotto){
            $('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', "Compilare tutti i dati 'Lotto'").replace('@@alertResult@@', 'danger'));
            return false;
        }
         */
		var validDataTrasporto = $.fn.validateDataTrasporto();
		if(!validDataTrasporto){
			$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', "'Data trasporto' non può essere precedente alla data della Fattura Accompagnatoria").replace('@@alertResult@@', 'danger'));
			return false;
		}

		var fatturaAccompagnatoria = {};
		fatturaAccompagnatoria.progressivo = $('#progressivo').val();
		fatturaAccompagnatoria.anno = $('#anno').val();
		fatturaAccompagnatoria.data = $('#data').val();

		var cliente = {};
		cliente.id = $('#cliente option:selected').val();
		fatturaAccompagnatoria.cliente = cliente;

		var puntoConsegna = {};
		puntoConsegna.id = $('#puntoConsegna option:selected').val();
		fatturaAccompagnatoria.puntoConsegna = puntoConsegna;

		var causale = {};
		causale.id = $('#causale option:selected').val();
		fatturaAccompagnatoria.causale = causale;

		var fatturaAccompagnatoriaArticoliLength = $('.rowArticolo').length;
		if(fatturaAccompagnatoriaArticoliLength != null && fatturaAccompagnatoriaArticoliLength !== 0){
			var fatturaAccompagnatoriaArticoli = [];
			$('.rowArticolo').each(function(i, item){
				var articoloId = $(this).attr('data-id');

				var fatturaAccompagnatoriaArticolo = {};
				var fatturaAccompagnatoriaArticoloId = {};
				fatturaAccompagnatoriaArticoloId.articoloId = articoloId;
				fatturaAccompagnatoriaArticolo.id = fatturaAccompagnatoriaArticoloId;

				fatturaAccompagnatoriaArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
				fatturaAccompagnatoriaArticolo.scadenza = $(this).children().eq(2).children().eq(0).val();
				fatturaAccompagnatoriaArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
				fatturaAccompagnatoriaArticolo.numeroPezzi = $(this).children().eq(5).children().eq(0).val();
				fatturaAccompagnatoriaArticolo.prezzo = $(this).children().eq(6).children().eq(0).val();
				fatturaAccompagnatoriaArticolo.sconto = $(this).children().eq(7).children().eq(0).val();

				fatturaAccompagnatoriaArticoli.push(fatturaAccompagnatoriaArticolo);
			});
			fatturaAccompagnatoria.fatturaAccompagnatoriaArticoli = fatturaAccompagnatoriaArticoli;
		}
		var fatturaAccompagnatoriaTotaliLength = $('.rowTotaliByIva').length;
		if(fatturaAccompagnatoriaTotaliLength != null && fatturaAccompagnatoriaTotaliLength !== 0){
			var fatturaAccompagnatoriaTotali = [];
			$('.rowTotaliByIva').each(function(i, item){
				var aliquotaIvaId = $(this).attr('data-id');

				var fatturaAccompagnatoriaTotale = {};
				var fatturaAccompagnatoriaTotaleId = {};
				fatturaAccompagnatoriaTotaleId.aliquotaIvaId = aliquotaIvaId;
				fatturaAccompagnatoriaTotale.id = fatturaAccompagnatoriaTotaleId;

				fatturaAccompagnatoriaTotale.totaleIva = $(this).find('td').eq(1).text();
				fatturaAccompagnatoriaTotale.totaleImponibile = $(this).find('td').eq(2).text();

				fatturaAccompagnatoriaTotali.push(fatturaAccompagnatoriaTotale);
			});
			fatturaAccompagnatoria.fatturaAccompagnatoriaTotali = fatturaAccompagnatoriaTotali;
		}

		fatturaAccompagnatoria.numeroColli = $('#colli').val();
		fatturaAccompagnatoria.tipoTrasporto = $('#tipoTrasporto option:selected').val();
		fatturaAccompagnatoria.dataTrasporto = $('#dataTrasporto').val();

		var regex = /:/g;
		var oraTrasporto = $('#oraTrasporto').val();
		if(oraTrasporto != null && oraTrasporto !== ''){
			var count = oraTrasporto.match(regex);
			count = (count) ? count.length : 0;
			if(count === 1){
				fatturaAccompagnatoria.oraTrasporto = oraTrasporto + ':00';
			} else {
				fatturaAccompagnatoria.oraTrasporto = oraTrasporto;
			}
		}
		var trasportatoreId = $('#trasportatore option:selected').val();
		if(trasportatoreId != null && trasportatoreId !== ''){
			var trasportatore = {};
			trasportatore.id = trasportatoreId;
			fatturaAccompagnatoria.trasportatore = trasportatore;
		}
		fatturaAccompagnatoria.note = $('#note').val();

		var fatturaAccompagnatoriaJson = JSON.stringify(fatturaAccompagnatoria);

		$.ajax({
			url: baseUrl + "fatture-accompagnatorie",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: fatturaAccompagnatoriaJson,
			success: function(result) {
				var idFatturaAccompagnatoria = result.id;

				$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@','Fattura accompagnatoria creata con successo').replace('@@alertResult@@', 'success'));

				$('#newFatturaAccompagnatoriaButton').attr("disabled", true);

				// Update ordini clienti
				var articoliOrdiniClienti = [];
				$('.ordineClienteArticolo').each(function(i, item){
					var idArticolo = $(this).attr('data-id-articolo');
					var idsOrdiniClienti = $(this).attr('data-ids-ordini');
					var numeroPezziDaEvadere = $(this).parent().parent().attr('data-num-pezzi-evasi');

					var articoloOrdiniClienti = {};
					articoloOrdiniClienti.idArticolo = idArticolo;
					articoloOrdiniClienti.numeroPezziDaEvadere = numeroPezziDaEvadere;
					articoloOrdiniClienti.idsOrdiniClienti = idsOrdiniClienti;

					articoliOrdiniClienti.push(articoloOrdiniClienti);
				});

				if(articoliOrdiniClienti.length !== 0){

					var articoliOrdiniClientiJson = JSON.stringify(articoliOrdiniClienti);

					$.ajax({
						url: baseUrl + "ordini-clienti/aggregate",
						type: 'POST',
						contentType: "application/json",
						dataType: 'json',
						data: articoliOrdiniClientiJson,
						success: function(result) {
							$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@','Fattura accompagnatoria creata con successo. Ordini clienti aggiornati con successo.').replace('@@alertResult@@', 'success'));

							// Returns to the same page
							setTimeout(function() {
								window.location.href = "fatture-accompagnatorie-new.html?dt="+fatturaAccompagnatoria.dataTrasporto+"&ot="+oraTrasporto;
							}, 1000);

							if(print){
								window.open(baseUrl + "stampe/fatture-accompagnatorie/"+idFatturaAccompagnatoria, '_blank');
							}
						},
						error: function(jqXHR, textStatus, errorThrown) {
							$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', "Fattura accompagnatoria creata con successo. Errore nell aggiornamento degli ordini clienti.").replace('@@alertResult@@', 'warning'));
						}
					});

				} else {
					$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@','Fattura accompagnatoria creata con successo').replace('@@alertResult@@', 'success'));

					// Returns to the same page
					setTimeout(function() {
						window.location.href = "fatture-accompagnatorie-new.html?dt="+fatturaAccompagnatoria.dataTrasporto+"&ot="+oraTrasporto;
					}, 1000);

					if(print){
						window.open(baseUrl + "stampe/fatture-accompagnatorie/"+idFatturaAccompagnatoria, '_blank');
					}
				}

			},
			error: function(jqXHR) {
				var errorMessage = 'Errore nella creazione della fattura accompagnatoria';
				if(jqXHR != null){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson !== ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage !== '' && jqXHRResponseJsonMessage.indexOf('con progressivo') !== -1){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	}

	if($('#newFatturaAccompagnatoriaButton') != null && $('#newFatturaAccompagnatoriaButton') != undefined && $('#newFatturaAccompagnatoriaButton').length > 0){

		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('submit','#newFatturaAccompagnatoriaForm', function(event){
			event.preventDefault();

			$.fn.createFatturaAccompagnatoria(false);

		});
	}

	if($('#newAndPrintFatturaAccompagnatoriaButton') != null && $('#newAndPrintFatturaAccompagnatoriaButton') != undefined && $('#newAndPrintFatturaAccompagnatoriaButton').length > 0){
		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('click','#newAndPrintFatturaAccompagnatoriaButton', function(event){
			event.preventDefault();

			$.fn.createFatturaAccompagnatoria(true);
		});
	}

	$(document).on('change','#cliente', function(){
		$('#articolo option[value=""]').prop('selected', true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var alertContent = '<div id="alertFatturaAccompagnatoriaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertFattureAccompagnatorie').empty();

		$.fn.emptyArticoli();

		var cliente = $('#cliente option:selected').val();
		var idListino = $('#cliente option:selected').attr('data-id-listino');
		var hasNoteDocumenti = $('#cliente option:selected').attr('data-has-note-documenti');
		if(cliente != null && cliente != ''){
			$.ajax({
				url: baseUrl + "clienti/"+cliente+"/punti-consegna",
				type: 'GET',
				dataType: 'json',
				success: function(result) {
					if(result != null && result != undefined && result != ''){
						$('#puntoConsegna').empty();
						$.each(result, function(i, item){
							var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+' ('+item.provincia+')';
							$('#puntoConsegna').append('<option value="'+item.id+'">'+label+'</option>');
						});
					} else {
						$('#puntoConsegna').empty();
					}
					$('#puntoConsegna').removeAttr('disabled');

					// load the prices of the Listino associated to the Cliente
					if(idListino != null && idListino != undefined && idListino != '-1'){
						$.ajax({
							url: baseUrl + "listini/"+idListino+"/listini-prezzi",
							type: 'GET',
							dataType: 'json',
							success: function(result) {
								$.each(result, function(i, item){
									var articoloId = item.articolo.id;
									var prezzoListino = item.prezzo;
									$("#articolo option").each(function(i){
										var articoloOptionId = $(this).val();
										if(articoloOptionId == articoloId){
											$(this).attr('data-prezzo-listino', prezzoListino);
										}
									});
								});
							},
							error: function(jqXHR, textStatus, errorThrown) {
								$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento dei prezzi di listino').replace('@@alertResult@@', 'danger'));
							}
						});
					} else {
						$("#articolo option").each(function(i){
							var prezzoBase = $(this).attr('data-prezzo-base');
							$(this).attr('data-prezzo-listino', prezzoBase);
						});
					}

					// load Sconti associated to the Cliente
					var data = $('#data').val();
					if(data != null && data != undefined && data != ''){
						$.fn.loadScontiArticoli(data, cliente);
					}

					$.fn.getArticoli(cliente);

					$.fn.loadArticoliFromOrdiniClienti();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
				}
			});

			$.fn.handleClienteNoteDocumenti(hasNoteDocumenti);

			$('#articolo').removeAttr('disabled');
			$('#articolo').selectpicker('refresh');

		} else {
			$('#updateClienteNoteDocumenti').attr('hidden', true);
			$('#puntoConsegna').empty();
			$('#puntoConsegna').attr('disabled', true);
			$('#articolo').attr('disabled', true);
			$('#articolo').selectpicker('refresh');
		}
	});

	$(document).on('change','#articolo', function(){
		var articolo = $('#articolo option:selected').val();
		if(articolo != null && articolo != ''){
			var udm = $('#articolo option:selected').attr('data-udm');
			var iva = $('#articolo option:selected').attr('data-iva');
			var quantita = $('#articolo option:selected').attr('data-qta');
			var prezzoBase = $('#articolo option:selected').attr('data-prezzo-base');
			var prezzoListino = $('#articolo option:selected').attr('data-prezzo-listino');
			var prezzo;
			if(prezzoListino != null && prezzoListino != undefined && prezzoListino != ''){
				prezzo = prezzoListino;
			} else {
				prezzo = prezzoBase;
			}
			var sconto = $('#articolo option:selected').attr('data-sconto');

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

	$(document).on('click','#addArticolo', function(event){
		event.preventDefault();

		var articoloId = $('#articolo option:selected').val();

		if(articoloId == null || articoloId == undefined || articoloId == ''){
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Seleziona un articolo\n' +
				'              </div>';

			$('#addFatturaAccompagnatoriaArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addFatturaAccompagnatoriaArticoloAlert').empty();
		}

		var pezzi = $('#pezzi').val();
		if(pezzi == null || pezzi == undefined || pezzi == ''){
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Inserisci il numero di pezzi\n' +
				'              </div>';

			$('#addFatturaAccompagnatoriaArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addFatturaAccompagnatoriaArticoloAlert').empty();
		}

		var articolo = $('#articolo option:selected').text();
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#scadenza').val();
		var quantita = $('#quantita').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#iva').val();
		var codiceFornitore = $('#articolo option:selected').attr("data-codice-fornitore");
		var lottoRegExp = $('#articolo option:selected').attr("data-lotto-regexp");
		var dataScadenzaRegExp = $('#articolo option:selected').attr("data-scadenza-regexp");
		var scadenzaGiorniAllarme = $('#articolo option:selected').attr("data-scadenza-giorni-allarme");

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
		var currentIdOrdineCliente;
		var currentIdArticolo;
		var currentLotto;
		var currentPrezzo;
		var currentSconto;
		var currentScadenza;
		var currentQuantita = 0;
		var currentPezzi = 0;
		var currentPezziDaEvadere = 0;

		var fatturaAccompagnatoriaArticoliLength = $('.rowArticolo').length;
		if(fatturaAccompagnatoriaArticoliLength != null && fatturaAccompagnatoriaArticoliLength != undefined && fatturaAccompagnatoriaArticoliLength != 0) {
			$('.rowArticolo').each(function(i, item){

				if(found != 1){
					currentRowIndex = $(this).attr('data-row-index');
					currentIdArticolo = $(this).attr('data-id');
					currentLotto = $(this).children().eq(1).children().eq(0).val();
					currentScadenza = $(this).children().eq(2).children().eq(0).val();
					currentPrezzo = $(this).children().eq(6).children().eq(0).val();
					currentSconto = $(this).children().eq(7).children().eq(0).val();

					if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(articoloId)
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

		var table = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
		if(found >= 1){

			var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));
			var newPezzi = pezzi + $.fn.parseValue(currentPezzi,'int');

			var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale gnore-barcode-scanner" value="'+$.fn.fixDecimalPlaces(newQuantita, 3)+'">';
			var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';

			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+currentLotto+'" data-codice-fornitore="'+codiceFornitore+'">';
			var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(currentScadenza).format('YYYY-MM-DD')+'">';

			var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+currentPrezzo+'">';
			var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+currentSconto+'">';

			if($.fn.isVersionClient()){
				prezzoHtml = prezzoHtml.replace('>', ' disabled>');
			}

			var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
			rowData[1] = lottoHtml;
			rowData[2] = scadenzaHtml;
			rowData[4] = newQuantitaHtml;
			rowData[5] = newPezziHtml;
			rowData[6] = prezzoHtml;
			rowData[7] = scontoHtml;
			rowData[8] = totale;
			table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();

		} else {
			var deleteLink = '<a class="deleteFatturaAccompagnatoriaArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowsCount = table.rows().count();

			if($.fn.isVersionClient()){
				prezzoHtml = prezzoHtml.replace('>', ' disabled>');
			}

			var rowNode = table.row.add( [
				articolo,
				lottoHtml,
				scadenzaHtml,
				udm,
				quantitaHtml,
				pezziHtml,
				prezzoHtml,
				scontoHtml,
				totale,
				iva,
				deleteLink
			] ).draw( false ).node();
			$(rowNode).css('text-align', 'center').css('color','#080707');
			$(rowNode).addClass('rowArticolo');
			$(rowNode).attr('data-id', articoloId);
			$(rowNode).attr('data-scadenza-giorni-allarme', scadenzaGiorniAllarme);
			$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);

		}
		$.fn.computeTotale();

		$.fn.checkPezziOrdinati();

		$.fn.checkProdottiScadenza();

		$('#articolo option[value=""]').prop('selected',true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		$('#articolo').focus();
		$('#articolo').selectpicker('refresh');
	});

	$(document).on('click','.deleteFatturaAccompagnatoriaArticolo', function(){
		$('#fatturaAccompagnatoriaArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#fatturaAccompagnatoriaArticoliTable').focus();

		$.fn.computeTotale();

		$.fn.checkPezziOrdinati();

		$.fn.checkProdottiScadenza();
	});

	$.fn.loadScontiArticoli = function(data, cliente){
		$.ajax({
			url: baseUrl + "sconti?idCliente="+cliente+"&data="+moment(data.data).format('YYYY-MM-DD'),
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				$.each(result, function(i, item){
					var articoloId = item.articolo.id;
					var valore = item.valore;
					$("#articolo option").each(function(i){
						var articoloOptionId = $(this).val();
						if(articoloOptionId == articoloId){
							$(this).attr('data-sconto', valore);
						}
					});
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli sconti').replace('@@alertResult@@', 'danger'));
			}
		});
	}

});

$.fn.preloadFields = function(dataTrasporto, oraTrasporto){
	$.ajax({
		url: baseUrl + "fatture-accompagnatorie/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				//$('#progressivo').attr('value', result.progressivo);
				$('#anno').attr('value', result.anno);
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

				$('#cliente').focus();

				var uri = window.location.toString();
				if (uri.indexOf("?") > 0) {
					var clean_uri = uri.substring(0, uri.indexOf("?"));
					window.history.replaceState({}, document.title, clean_uri);
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getClienti = function(){
	$.ajax({
		url: baseUrl + "clienti?bloccaDdt=false&privato=false",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = '';
					if(item.dittaIndividuale){
						label += item.cognome + ' - ' + item.nome;
					} else {
						label += item.ragioneSociale;
					}
					label += ' - ' + item.indirizzo + ' ' + item.citta + ', ' + item.cap + ' (' + item.provincia + ')';

					var agente = item.agente;
					var idAgente = '-1';
					if(agente != null && agente != undefined) {
						idAgente = agente.id;
					}
					var listino = item.listino;
					var idListino = '-1';
					if(listino != null && listino != undefined){
						idListino = listino.id;
					}
					var hasNoteDocumenti = 0;
					if(!$.fn.checkVariableIsNull(item.noteDocumenti)){
						hasNoteDocumenti = 1;
					}
					$('#cliente').append('<option value="'+item.id+'" data-id-agente="'+idAgente+'" data-id-listino="'+idListino+'" data-has-note-documenti='+hasNoteDocumenti+'>'+label+'</option>');

					$('#cliente').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getCausali = function(){
	$.ajax({
		url: baseUrl + "causali",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					if(item != null && item !== ''){
						if(item.descrizione === 'Vendita'){
							$('#causale').append('<option value="'+item.id+'" selected>'+item.descrizione+'</option>');
						} else{
							$('#causale').append('<option value="'+item.id+'">'+item.descrizione+'</option>');
						}
					}
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticoli = function(idCliente){

	$('#articolo').empty().append('<option value=""></option>');

	$.ajax({
		url: baseUrl + "articoli?attivo=true&idCliente="+idCliente,
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
					var scadenzaGiorniAllarme = 0;
					if(item.scadenzaGiorniAllarme !== null){
						scadenzaGiorniAllarme = item.scadenzaGiorniAllarme;
					}

					$('#articolo').append('<option value="'+item.id+'" ' +
						'data-udm="'+dataUdm+'" ' +
						'data-iva="'+dataIva+'" ' +
						'data-qta="'+dataQta+'" ' +
						'data-prezzo-base="'+dataPrezzoBase+'" ' +
						'data-codice-fornitore="'+item.fornitore.codice+'" ' +
						'data-lotto-regexp="'+lottoRegexp+'" ' +
						'data-scadenza-regexp="'+dataScadenzaRegexp+'" ' +
						'data-scadenza-giorni-allarme="'+scadenzaGiorniAllarme+'" ' +
						'>'+item.codice+' '+item.descrizione+'</option>');

					$('#articolo').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
