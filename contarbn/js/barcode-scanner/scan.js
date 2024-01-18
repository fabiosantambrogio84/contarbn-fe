
$.fn.getScontoArticolo = function(idArticolo, data, clienteOrFornitore){
	var sconto = null;

	var urlParam = "idCliente=";
	if($.fn.isDdtAcquisto()){
		urlParam = "idFornitore=";
	}

	$.ajax({
		url: baseUrl + "sconti?"+urlParam+clienteOrFornitore+"&data="+moment(data.data).format('YYYY-MM-DD'),
		type: 'GET',
		dataType: 'json',
		async: false,
		success: function(result) {
			$.each(result, function(i, item){
				var articoloId = item.articolo.id;
				if(articoloId == idArticolo){
					sconto = item.valore;
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Errore nel recupero dello sconto articolo');
		}
	});
	return sconto;
}

$.fn.getPrezzoListinoClienteArticolo = function(idArticolo, idListino){
	var prezzoListino = null;
	if(idListino != null && idListino != undefined && idListino != '-1'){
		$.ajax({
			url: baseUrl + "listini/"+idListino+"/listini-prezzi",
			type: 'GET',
			dataType: 'json',
			async: false,
			success: function(result) {
				$.each(result, function(i, item){
					var articoloId = item.articolo.id;
					if(articoloId == idArticolo){
						prezzoListino = item.prezzo;
						return false;
					}
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Errore nel recupero dei prezzi del listino cliente');
			}
		});
	}
	return prezzoListino;
}

$.fn.addArticoloFromScanner = function(articolo, numeroPezzi, quantita, lotto, scadenza, prezzoListino, sconto){
	var articoloId = articolo.id;

	var articoloLabel = articolo.codice + ' ' + articolo.descrizione;
	var udm;
	if(!$.fn.checkVariableIsNull(articolo.unitaMisura)){
		udm = articolo.unitaMisura.etichetta;
	}
	var lotto = lotto;
	var scadenza = scadenza;
	if(!$.fn.checkVariableIsNull(scadenza)){
		scadenza = moment(scadenza).format('YYYY-MM-DD');
	}
	var scadenzaGiorni = 0;
	if(articolo.scadenzaGiorni != null){
		scadenzaGiorni = articolo.scadenzaGiorni;
	}
	var quantita = quantita;
	var pezzi = numeroPezzi;
	//var pezziDaEvadere = '';
	var prezzo;
	if(!$.fn.checkVariableIsNull(prezzoListino)){
		prezzo = prezzoListino;
	} else {
		prezzo = articolo.prezzoListinoBase;
	}
	var sconto = sconto;
	var iva;
	if(!$.fn.checkVariableIsNull(articolo.aliquotaIva)){
		iva = articolo.aliquotaIva.valore;
	}
	var prezzoIva = Number(Math.round(($.fn.parseValue(prezzo, 'float') + ($.fn.parseValue(prezzo, 'float') * ($.fn.parseValue(iva, 'int')/100))) + 'e2') + 'e-2');
	var codiceFornitore = articolo.fornitore.codice;
	var lottoRegexp = $.fn.getLottoRegExp(articolo);
	var dataScadenzaRegexp = $.fn.getDataScadenzaRegExp(articolo);

	if(lotto != null && lotto != undefined && lotto != ''){
		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegexp+'" data-scadenza-regexp="'+dataScadenzaRegexp+'">';
	} else {
		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegexp+'" data-scadenza-regexp="'+dataScadenzaRegexp+'">';
	}
	var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+scadenza+'">';
	var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+quantita+'">';
	var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+pezzi+'">';
	//var pezziDaEvadereHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezziDaEvadere" value="'+pezziDaEvadere+'">';
	var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
	var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

	// check if a same Articolo was already added
	var found = 0;
	var currentRowIndex;
	//var currentIdOrdineCliente;
	var currentIdArticolo;
	var currentLotto;
	var currentPrezzo;
	var currentSconto;
	var currentScadenza;
	var currentPezzi = 0;
	//var currentPezziDaEvadere = 0;
	var currentQuantita= 0;

	var articoliLength = $('.rowArticolo').length;
	if(articoliLength != null && articoliLength != undefined && articoliLength != 0) {
		$('.rowArticolo').each(function(i, item){

			if(found != 1){
				currentRowIndex = $(this).attr('data-row-index');
				//currentIdOrdineCliente = $(this).attr('data-id-ordine-cliente');
				currentIdArticolo = $(this).attr('data-id');
				currentLotto = $(this).children().eq(1).children().eq(0).val();
				currentScadenza = $(this).children().eq(2).children().eq(0).val();
				//currentPezziDaEvadere = $(this).children().eq(6).children().eq(0).val();
				if($.fn.isRicevutaPrivato()){
					currentPrezzo = $(this).children().eq(6).children().eq(0).attr('data-prezzo');
				} else {
					currentPrezzo = $(this).children().eq(6).children().eq(0).val();
				}

				currentSconto = $(this).children().eq(7).children().eq(0).val();
				if(currentSconto == '0'){
					currentSconto = '';
				}

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

	var rowIndex;
	var totale = 0;
	var totaleConIva = 0;
	quantita = $.fn.parseValue(quantita, 'float');
	prezzo = $.fn.parseValue(prezzo, 'float');
	prezzoIva = $.fn.parseValue(prezzoIva, 'float');
	sconto = $.fn.parseValue(sconto, 'float');
	pezzi = $.fn.parseValue(pezzi, 'int');
	iva = $.fn.parseValue(iva, 'int');

	var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
	var scontoValue = (sconto/100)*quantitaPerPrezzo;
	totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

	var quantitaPerPrezzoIva = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzoIva);
	totaleConIva = Number(Math.round((quantitaPerPrezzoIva - scontoValue) + 'e2') + 'e-2');

	var table;
	if($.fn.isDdt()){
		table = $('#ddtArticoliTable').DataTable();
	} else if($.fn.isFatturaAccompagnatoria()){
		table = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
	} else if($.fn.isRicevutaPrivato()){
		table = $('#ricevutaPrivatoArticoliTable').DataTable();

		prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzoIva+'" data-prezzo="'+prezzo+'" data-totale="'+totale+'">';
	}

	if(found >= 1){
		// aggiorno la riga
		$.fn.aggiornaRigaArticolo(table,currentRowIndex,currentQuantita,currentPezzi,currentLotto,currentScadenza,currentPrezzo,currentPrezzoIva,currentSconto,
			quantita,pezzi,codiceFornitore,lottoRegexp,dataScadenzaRegexp,totale,totaleConIva);

		rowIndex = currentRowIndex;

	} else {
		// inserisco nuova riga
		$.fn.inserisciRigaArticolo(table,null,articoloId,articoloLabel,
			lottoHtml,scadenzaHtml,udm,quantitaHtml,pezziHtml,prezzoHtml,scontoHtml,
			totale,iva,totaleConIva,scadenzaGiorni);

		rowIndex = table.rows().count();
	}

	$.fn.computeTotale();

	$.fn.checkPezziOrdinati();

	$('tr[data-row-index='+rowIndex+']').children().eq(1).children().eq(0).focus();
}

$.fn.addProdottoFromScanner = function(articolo, numeroPezzi, quantita, lotto, scadenza, prezzoListino, sconto, iva){
	var articoloId = articolo.id;

	var articoloLabel = articolo.codice + ' ' + articolo.descrizione;
	var udm;
	if(!$.fn.checkVariableIsNull(articolo.unitaMisura)){
		udm = articolo.unitaMisura.etichetta;
	}
	var lotto = lotto;
	var scadenza = scadenza;
	if(!$.fn.checkVariableIsNull(scadenza)){
		scadenza = moment(scadenza).format('YYYY-MM-DD');
	}
	var scadenzaGiorni = 0;
	if(articolo.scadenzaGiorni != null){
		scadenzaGiorni = articolo.scadenzaGiorni;
	}
	var quantita = quantita;
	var pezzi = numeroPezzi;
	var prezzo;
	if(!$.fn.checkVariableIsNull(prezzoListino)){
		prezzo = prezzoListino;
	} else {
		prezzo = articolo.prezzoAcquisto;
	}
	var sconto = sconto;
	var iva;
	if(!$.fn.checkVariableIsNull(articolo.aliquotaIva)){
		iva = articolo.aliquotaIva.valore;
	}
	var codiceFornitore = articolo.fornitore.codice;
	var lottoRegexp = $.fn.getLottoRegExp(articolo);
	var dataScadenzaRegexp = $.fn.getDataScadenzaRegExp(articolo);

	if(lotto != null && lotto != undefined && lotto != ''){
		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegexp+'" data-scadenza-regexp="'+dataScadenzaRegexp+'">';
	} else {
		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegexp+'" data-scadenza-regexp="'+dataScadenzaRegexp+'">';
	}
	var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+scadenza+'">';
	var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+quantita+'">';
	var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+pezzi+'">';
	var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
	var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

	// check if a same Articolo was already added
	var found = 0;
	var currentRowIndex;
	var currentIdArticolo;
	var currentLotto;
	var currentPrezzo;
	var currentSconto;
	var currentScadenza;
	var currentQuantita= 0;
	var currentPezzi = 0;

	var ddtProdottiLength = $('.rowProdotto').length;
	if(ddtProdottiLength != null && ddtProdottiLength != undefined && ddtProdottiLength != 0) {
		$('.rowProdotto').each(function(i, item){

			if(found != 1){
				currentRowIndex = $(this).attr('data-row-index');
				//currentIdOrdineCliente = $(this).attr('data-id-ordine-cliente');
				currentIdArticolo = $(this).attr('data-id');
				currentLotto = $(this).children().eq(1).children().eq(0).val();
				currentScadenza = $(this).children().eq(2).children().eq(0).val();
				currentPrezzo = $(this).children().eq(6).children().eq(0).val();
				currentSconto = $(this).children().eq(7).children().eq(0).val();
				if(currentSconto == '0'){
					currentSconto = '';
				}

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

	var rowIndex;
	var totale = 0;
	quantita = $.fn.parseValue(quantita, 'float');
	prezzo = $.fn.parseValue(prezzo, 'float');
	sconto = $.fn.parseValue(sconto, 'float');
	pezzi = $.fn.parseValue(pezzi, 'int');

	var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
	var scontoValue = (sconto/100)*quantitaPerPrezzo;
	totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

	var table = $('#ddtAcquistoProdottiTable').DataTable();

	if(found >= 1){

		// aggiorno la riga
		$.fn.aggiornaRigaProdotto(table,currentRowIndex,currentIdArticolo,currentQuantita,currentPezzi,currentLotto,currentScadenza,currentPrezzo,currentSconto,quantita,pezzi,codiceFornitore,lottoRegexp,dataScadenzaRegexp,totale);

		rowIndex = currentRowIndex;

	} else {
		// inserisco nuova riga
		$.fn.inserisciRigaProdotto(table,articoloId,articoloLabel,lottoHtml,scadenzaHtml,udm,quantitaHtml,pezziHtml,prezzoHtml,scontoHtml,totale,iva,'articolo',scadenzaGiorni);

		rowIndex = table.rows().count();
	}

	$.fn.computeTotaleAndImponibile();

	//$.fn.checkPezziOrdinati();

	$('tr[data-row-index='+rowIndex+']').children().eq(1).children().eq(0).focus();
}

$(document).ready(function() {
	// https://github.com/axenox/onscan.js

	$(document).on('click','.closeOverlay', function(){
		$('#alertOverlay').empty().hide();
	});

	onScan.attachTo(document, {
		suffixKeyCodes: [13], // enter-key expected at the end of a scan
		reactToPaste: false, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
		ignoreIfFocusOn: '.ignore-barcode-scanner',
		onScan: function(barcode, numeroPezzi) { // Alternative to document.addEventListener('scan')
			console.log('Scanned: ' + numeroPezzi + ' - ' + barcode);
			//var $focused = $(':focus');

			var scannerLog = '--------------------------------------------------\n';
			scannerLog += 'Barcode: '+barcode+', numero pezzi: '+numeroPezzi+'\n';

			var alertOverlayContent = '<div id="alertOverlayContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertOverlayContent = alertOverlayContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close closeOverlay"><span aria-hidden="true">&times;</span></button></div>';

			var fornitore;
			var tipoFornitore;
			var cliente;
			if($.fn.isDdtAcquisto()){
				fornitore = $('#fornitore option:selected').val();
				if($.fn.checkVariableIsNull(fornitore)){
					var alertText = "Selezionare un fornitore prima di effettuare la lettura del barcode";
					$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'danger')).show();
					return;
				}
				tipoFornitore = $('#fornitore option:selected').attr('data-tipo');
				if(!$.fn.checkVariableIsNull(tipoFornitore) && tipoFornitore == 'FORNITORE_INGREDIENTI'){
					var alertText = "Lettura barcode non abilitata per fornitori di ingredienti";
					$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'danger')).show();
					return;
				}
			} else {
				cliente = $('#cliente option:selected').val();
				if($.fn.checkVariableIsNull(cliente)){
					var alertText = "Selezionare un cliente prima di effettuare la lettura del barcode";
					$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'danger')).show();
					return;
				}
			}

			/*
				Check length of barcode
			   	if length > 13 -> ean 128
			   	else -> ean 13

			*/

			var barcodeType = 'ean13';
			var barcodeToSearch = barcode;
			if(!$.fn.checkVariableIsNull(barcode) && barcode.length > 13){
				barcodeType = 'ean128';
				barcodeToSearch = barcode.substring(2, 16).trim();
			}

			scannerLog += 'Barcode type: '+barcodeType+'\n';
			scannerLog += 'Codice articolo: '+barcodeToSearch+'\n';

			// check if the scan is on a Lotto field or is for adding Articolo
			var isLottoFocused = $('.lotto').is(":focus");

			scannerLog += 'Focus lotto? '+isLottoFocused+'\n';

			if(isLottoFocused){

				//barcode = '01980259970004323103001208103203230015211214';
				//barcodeType = 'ean128';
				//barcode = '(02)18013554104994(15)220110(10)53161370002';

				var lottoFocused = $(':focus');
				//var codiceFornitore = lottoFocused.attr("data-codice-fornitore");
				var lottoRegexp = lottoFocused.attr("data-lotto-regexp");
				var dataScadenzaRegexp = lottoFocused.attr("data-scadenza-regexp");

				if(barcodeType == 'ean13') {

					scannerLog += 'Lotto: '+barcodeToSearch+'\n';

					lottoFocused.val(barcodeToSearch);
				} else {
					var lotto = new RegExp(lottoRegexp).exec(barcode)[1];
					var dataScadenza = new RegExp(dataScadenzaRegexp).exec(barcode)[1];
					dataScadenza = moment(dataScadenza, 'YYMMDD').format('YYYY-MM-DD');

					scannerLog += 'Lotto: '+lotto+'\n';
					scannerLog += 'Data scadenza: '+dataScadenza+'\n';
					/*
					if(codiceFornitore == '29') {
						// fornitore 'La Gastronomica'
						lotto = barcode.substring(28, 34).trim();
						lotto = lotto.substring(0,6);
						lotto = lotto.slice(3,6) + lotto.slice(0,3);

						scannerLog += 'Lotto: '+lotto+' (fornitore "La Gastronomica")\n';

					} else if(codiceFornitore == '30'){
						// fornitore 'EuroChef'
						lotto = barcode.substring(26, 31).trim();

						scannerLog += 'Lotto: '+lotto+' (fornitore "EuroChef")\n';
					}
					*/
					lottoFocused.parent().next().find("input").val(dataScadenza);
					lottoFocused.val(lotto);
				}
				lottoFocused.blur();

				if($.fn.isDdtAcquisto()){
					$.fn.groupProdottoRow(lottoFocused.parent().parent());
				} else {
					$.fn.groupArticoloRow(lottoFocused.parent().parent());
				}

				scannerLog += '--------------------------------------------------\n';
				$('#scannerLog').append(scannerLog);

			} else {
				var url = baseUrl + "articoli?attivo=true&barcode="+barcodeToSearch;
				if($.fn.isDdtAcquisto()){
					url = baseUrl + "articoli?attivo=true&barcode="+barcodeToSearch+"&idFornitore="+fornitore;
				}
				$.ajax({
					url: url,
					type: 'GET',
					dataType: 'json',
					success: function(result) {
						if(result != null && result != undefined && result.length!=0){
							$.each(result, function(i, item){
								var idArticolo = item.id;
								var dataIva = '';
								var iva = item.aliquotaIva;
								if(iva != null && iva != undefined){
									dataIva = iva.valore;
								}

								$('.bs-searchbox > input').val(null);
								$('#articolo').selectpicker('refresh');
								var mainArticoloDiv = $('#articolo').parent();
								mainArticoloDiv.find('.dropdown-item > span:empty').parent().click();

								// get sconto articolo
								var sconto;
								var data = $('#data').val();
								var cliente = $('#cliente option:selected').val();
								if(!$.fn.checkVariableIsNull(data) && !$.fn.checkVariableIsNull(cliente)){
									sconto = $.fn.getScontoArticolo(idArticolo, data, cliente);
									console.log('SCONTO: '+sconto);
								}

								// get articolo prezzo listino cliente
								var prezzoListino;
								var idListino = $('#cliente option:selected').attr('data-id-listino');
								if(!$.fn.checkVariableIsNull(idListino)){
									prezzoListino = $.fn.getPrezzoListinoClienteArticolo(idArticolo, idListino);
									console.log('PREZZO LISTINO: '+prezzoListino);
								}

								scannerLog += 'Articolo id: '+idArticolo+', sconto: '+sconto+', prezzo listino: '+prezzoListino+'\n';

								var quantita;
								var numPezzi = numeroPezzi;
								var lotto = item.lotto;
								var scadenza;

								if(barcodeType == 'ean13'){
									// check if articolo has barcode complete or not
									var barcodeComplete = item.completeBarcode;
									if(barcodeComplete){
										quantita = item.quantitaPredefinita;

										scannerLog += 'Barcode complete. Quantita: '+quantita+'\n';

									} else {
										var subBarcode = barcode.substring(7, barcode.length);
										console.log(subBarcode);
										quantita = parseFloat(subBarcode)/10000;

										scannerLog += 'Barcode non complete. (SubBarcode: '+subBarcode+'). Quantita: '+quantita+'\n';
									}

								} else {
									quantita = item.quantitaPredefinita;

									// get fornitore
									var fornitore = item.fornitore;
									if($.fn.checkVariableIsNull(fornitore)){
										var alertText = "Errore nel recupero del fornitore.";
										$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
										return;
									}
									var codiceFornitore = fornitore.codice;
									if($.fn.checkVariableIsNull(codiceFornitore)){
										var alertText = "Codice fornitore non presente. Impossibile gestire il barcode ean128.";
										$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
										return;
									}

									scannerLog += 'Codice fornitore: '+codiceFornitore+'\n';

									var startIndex = 0;
									var endIndex = 0;

									// check codice fornitore
									if(codiceFornitore == '29'){
										// fornitore 'La Gastronomica'

										// example: "01980259970213213193000278100980940015200427"
										/*
                                            Numero pezzi = 01
                                            Codice articolo = 98025997021321
                                            Peso = 000278 -> 0.278 kg
                                            Lotto = 098094 -> 094098
                                            Scadenza = 200427 -> 27/04/20
                                        */

										//numPezzi = barcode.substring(1, barcode.indexOf(")")).trim();
										numPezzi = barcode.substring(0, 2);
										if(numPezzi.indexOf('0') == 0){
											numPezzi = numPezzi.substring(1, numPezzi.length);
										}

										//startIndex = barcode.split(")", 2).join(")").length + 1;
										//endIndex = barcode.split("(", 3).join("(").length;
										startIndex = 20;
										endIndex = 26;

										quantita = parseInt(barcode.substring(startIndex, endIndex).trim()) / 1000;

										//startIndex = barcode.split(")", 3).join(")").length + 1;
										//endIndex = barcode.split("(", 4).join("(").length;
										startIndex = 28;
										endIndex = 34;

										lotto = barcode.substring(startIndex, endIndex).trim();
										lotto = lotto.substring(0,6);
										lotto = lotto.slice(3,6) + lotto.slice(0,3);

										//startIndex = barcode.split(")", 4).join(")").length + 1;
										scadenza = barcode.substring(barcode.length-6).trim();
										scadenza = moment(scadenza, 'YYMMDD');

										scannerLog += 'Fornitore "La Gastronomica". Numero pezzi: '+numPezzi+', quantita: '+quantita+', lotto: '+lotto+', scadenza: '+scadenza+'\n';

									} else if(codiceFornitore == '30'){
										// fornitore 'EuroChef'

										// example "0218013554100422152005251020700370002"
										/*
                                            Numero pezzi = 02 -> vengono ignorati
                                            Codice articolo = 18013554100422
                                            Scadenza = 200525 -> 25/05/20
                                            Lotto = 20700
                                        */
										//startIndex = barcode.split(")", 2).join(")").length + 1;
										//endIndex = barcode.split("(", 3).join("(").length;
										startIndex = 18;
										endIndex = 24;

										scadenza = barcode.substring(startIndex, endIndex).trim();
										scadenza = moment(scadenza, 'YYMMDD');

										//startIndex = barcode.split(")", 3).join(")").length + 1;
										//endIndex = barcode.split("(", 4).join("(").length;

										startIndex = 26;
										endIndex = 31;

										lotto = barcode.substring(startIndex, endIndex).trim();

										scannerLog += 'Fornitore "EuroChef". Lotto: '+lotto+', scadenza: '+scadenza+'\n';

									} else {
										var alertText = "Codice fornitore '"+codiceFornitore+"' non gestito.";
										$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
										return;
									}
								}

								quantita = $.fn.fixDecimalPlaces(quantita, 3);

								if($.fn.isDdtAcquisto()){
									// add prodotto to table
									$.fn.addProdottoFromScanner(item, numPezzi, quantita, lotto, scadenza, prezzoListino, sconto, dataIva);
								} else {
									// add articolo to table
									$.fn.addArticoloFromScanner(item, numPezzi, quantita, lotto, scadenza, prezzoListino, sconto);
								}

								scannerLog += '--------------------------------------------------\n';
								$('#scannerLog').append(scannerLog);
							});
						} else {
							var barcodeTruncate = barcode.substring(0, 6);
							var alertText = "Nessun articolo trovato con barcode completo '"+barcode+"' o barcode '"+barcodeTruncate+"'";
							$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();

							scannerLog += '--------------------------------------------------\n';
							$('#scannerLog').append(scannerLog);
						}

					},
					error: function(jqXHR, textStatus, errorThrown) {
						var barcodeTruncate = barcode.substring(0, 6);
						var alertText = "Nessun articolo trovato con barcode completo '"+barcode+"' o barcode '"+barcodeTruncate+"'";
						$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();

						scannerLog += '--------------------------------------------------\n';
						$('#scannerLog').append(scannerLog);
					}
				});

			}

		},
		onKeyDetect: function(iKeyCode){ // output all potentially relevant key events - great for debugging!
			//console.log('Pressed: ' + iKeyCode);
		}
	});

	$(document).on('keypress', function(event){
		if (event.keyCode === 13) {
			//console.log(event);

			if(event.target.nodeName == 'INPUT'){
				event.preventDefault();
				$(event.target).blur();

				if(event.target.classList.contains("lotto") || event.target.classList.contains("group")){
					// check if some rows could be grouped together
					var insertedRow = $(event.target).parent().parent();

					if($.fn.isDdtAcquisto()){
						$.fn.groupProdottoRow(insertedRow);
					} else {
						$.fn.groupArticoloRow(insertedRow);
					}
				}
			}
		}
	});
});


/*
	========================================
	TEST FUNCTIONS 06/12/2021
	========================================
 */

$(document).on('click', '#testScanLinkArticolo', function(){
	var barcode = '4032526700054';
	var numeroPezzi = '1';

	$.fn.testScan(barcode, numeroPezzi, false);
});

$(document).on('click', '#testScanLinkLotto', function(){
	var barcode = '01980259970004323103001208103203230015211214';
	var numeroPezzi = '1';

	$.fn.testScan(barcode, numeroPezzi, true);
});

$.fn.testScan = function(barcode, numeroPezzi, isLottoFocused){
	console.log('Scanned: ' + numeroPezzi + ' - ' + barcode);
	//var $focused = $(':focus');

	var scannerLog = '--------------------------------------------------\n';
	scannerLog += 'Barcode: '+barcode+', numero pezzi: '+numeroPezzi+'\n';

	var alertOverlayContent = '<div id="alertOverlayContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
	alertOverlayContent = alertOverlayContent + '<strong>@@alertText@@</strong>\n' +
		'<button type="button" class="close closeOverlay"><span aria-hidden="true">&times;</span></button></div>';

	var cliente = $('#cliente option:selected').val();
	if($.fn.checkVariableIsNull(cliente)){
		var alertText = "Selezionare un cliente prima di effettuare la lettura del barcode";
		$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'danger')).show();
		return;
	}

	/*
        Check length of barcode
           if length > 13 -> ean 128
           else -> ean 13

    */

	var barcodeType = 'ean13';
	var barcodeToSearch = barcode;
	if(!$.fn.checkVariableIsNull(barcode) && barcode.length > 13){
		barcodeType = 'ean128';
		barcodeToSearch = barcode.substring(2, 16).trim();
	}

	scannerLog += 'Barcode type: '+barcodeType+'\n';
	scannerLog += 'Codice articolo: '+barcodeToSearch+'\n';

	// check if the scan is on a Lotto field or is for adding Articolo
	//var isLottoFocused = $('.lotto').is(":focus");

	scannerLog += 'Focus lotto? '+isLottoFocused+'\n';

	if(isLottoFocused){

		//barcode = '01980259970004323103001208103203230015211214';
		//barcodeType = 'ean128';

		var lottoRows = $('.rowArticolo').length;
		var lottoFocused = $('.rowArticolo[data-row-index='+lottoRows+']').find('.lotto');
		//var codiceFornitore = lottoFocused.attr("data-codice-fornitore");
		var lottoRegexp = lottoFocused.attr("data-lotto-regexp");
		var dataScadenzaRegexp = lottoFocused.attr("data-scadenza-regexp");

		if(barcodeType == 'ean13') {

			scannerLog += 'Lotto: '+barcodeToSearch+'\n';

			lottoFocused.val(barcodeToSearch);
		} else {
			var lotto = new RegExp(lottoRegexp).exec(barcode)[1];
			var dataScadenza = new RegExp(dataScadenzaRegexp).exec(barcode)[1];
			dataScadenza = moment(dataScadenza, 'YYMMDD').format('YYYY-MM-DD');

			scannerLog += 'Lotto: '+lotto+'\n';
			scannerLog += 'Data scadenza: '+dataScadenza+'\n';
			/*
            if(codiceFornitore == '29') {
                // fornitore 'La Gastronomica'
                lotto = barcode.substring(28, 34).trim();
                lotto = lotto.substring(0,6);
                lotto = lotto.slice(3,6) + lotto.slice(0,3);

                scannerLog += 'Lotto: '+lotto+' (fornitore "La Gastronomica")\n';

            } else if(codiceFornitore == '30'){
                // fornitore 'EuroChef'
                lotto = barcode.substring(26, 31).trim();

                scannerLog += 'Lotto: '+lotto+' (fornitore "EuroChef")\n';
            }
            */
			lottoFocused.parent().next().find("input").val(dataScadenza);
			lottoFocused.val(lotto);
		}
		lottoFocused.blur();

		$.fn.groupArticoloRow(lottoFocused.parent().parent());

		scannerLog += '--------------------------------------------------\n';
		$('#scannerLog').append(scannerLog);

	} else {
		$.ajax({
			url: baseUrl + "articoli?attivo=true&barcode="+barcodeToSearch,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result.length!=0){
					$.each(result, function(i, item){
						var idArticolo = item.id;

						$('.bs-searchbox > input').val(null);
						$('#articolo').selectpicker('refresh');
						var mainArticoloDiv = $('#articolo').parent();
						mainArticoloDiv.find('.dropdown-item > span:empty').parent().click();

						// get sconto articolo
						var sconto;
						var data = $('#data').val();
						var cliente = $('#cliente option:selected').val();
						if(!$.fn.checkVariableIsNull(data) && !$.fn.checkVariableIsNull(cliente)){
							sconto = $.fn.getScontoArticolo(idArticolo, data, cliente);
							console.log('SCONTO: '+sconto);
						}

						// get articolo prezzo listino cliente
						var prezzoListino;
						var idListino = $('#cliente option:selected').attr('data-id-listino');
						if(!$.fn.checkVariableIsNull(idListino)){
							prezzoListino = $.fn.getPrezzoListinoClienteArticolo(idArticolo, idListino);
							console.log('PREZZO LISTINO: '+prezzoListino);
						}

						scannerLog += 'Articolo id: '+idArticolo+', sconto: '+sconto+', prezzo listino: '+prezzoListino+'\n';

						var quantita;
						var numPezzi = numeroPezzi;
						var lotto = item.lotto;
						var scadenza;

						if(barcodeType == 'ean13'){
							// check if articolo has barcode complete or not
							var barcodeComplete = item.completeBarcode;
							if(barcodeComplete){
								quantita = item.quantitaPredefinita;

								scannerLog += 'Barcode complete. Quantita: '+quantita+'\n';

							} else {
								var subBarcode = barcode.substring(7, barcode.length);
								console.log(subBarcode);
								quantita = parseFloat(subBarcode)/10000;

								scannerLog += 'Barcode non complete. (SubBarcode: '+subBarcode+'). Quantita: '+quantita+'\n';
							}

						} else {
							quantita = item.quantitaPredefinita;

							// get fornitore
							var fornitore = item.fornitore;
							if($.fn.checkVariableIsNull(fornitore)){
								var alertText = "Errore nel recupero del fornitore.";
								$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
								return;
							}
							var codiceFornitore = fornitore.codice;
							if($.fn.checkVariableIsNull(codiceFornitore)){
								var alertText = "Codice fornitore non presente. Impossibile gestire il barcode ean128.";
								$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
								return;
							}

							scannerLog += 'Codice fornitore: '+codiceFornitore+'\n';

							var startIndex = 0;
							var endIndex = 0;

							// check codice fornitore
							if(codiceFornitore == '29'){
								// fornitore 'La Gastronomica'

								// example: "01980259970213213193000278100980940015200427"
								/*
                                    Numero pezzi = 01
                                    Codice articolo = 98025997021321
                                    Peso = 000278 -> 0.278 kg
                                    Lotto = 098094 -> 094098
                                    Scadenza = 200427 -> 27/04/20
                                */

								//numPezzi = barcode.substring(1, barcode.indexOf(")")).trim();
								numPezzi = barcode.substring(0, 2);
								if(numPezzi.indexOf('0') == 0){
									numPezzi = numPezzi.substring(1, numPezzi.length);
								}

								//startIndex = barcode.split(")", 2).join(")").length + 1;
								//endIndex = barcode.split("(", 3).join("(").length;
								startIndex = 20;
								endIndex = 26;

								quantita = parseInt(barcode.substring(startIndex, endIndex).trim()) / 1000;

								//startIndex = barcode.split(")", 3).join(")").length + 1;
								//endIndex = barcode.split("(", 4).join("(").length;
								startIndex = 28;
								endIndex = 34;

								lotto = barcode.substring(startIndex, endIndex).trim();
								lotto = lotto.substring(0,6);
								lotto = lotto.slice(3,6) + lotto.slice(0,3);

								//startIndex = barcode.split(")", 4).join(")").length + 1;
								scadenza = barcode.substring(barcode.length-6).trim();
								scadenza = moment(scadenza, 'YYMMDD');

								scannerLog += 'Fornitore "La Gastronomica". Numero pezzi: '+numPezzi+', quantita: '+quantita+', lotto: '+lotto+', scadenza: '+scadenza+'\n';

							} else if(codiceFornitore == '30'){
								// fornitore 'EuroChef'

								// example "0218013554100422152005251020700370002"
								/*
                                    Numero pezzi = 02 -> vengono ignorati
                                    Codice articolo = 18013554100422
                                    Scadenza = 200525 -> 25/05/20
                                    Lotto = 20700
                                */
								//startIndex = barcode.split(")", 2).join(")").length + 1;
								//endIndex = barcode.split("(", 3).join("(").length;
								startIndex = 18;
								endIndex = 24;

								scadenza = barcode.substring(startIndex, endIndex).trim();
								scadenza = moment(scadenza, 'YYMMDD');

								//startIndex = barcode.split(")", 3).join(")").length + 1;
								//endIndex = barcode.split("(", 4).join("(").length;

								startIndex = 26;
								endIndex = 31;

								lotto = barcode.substring(startIndex, endIndex).trim();

								scannerLog += 'Fornitore "EuroChef". Lotto: '+lotto+', scadenza: '+scadenza+'\n';

							} else {
								var alertText = "Codice fornitore '"+codiceFornitore+"' non gestito.";
								$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
								return;
							}
						}

						quantita = $.fn.fixDecimalPlaces(quantita, 3);

						// add articolo to table
						$.fn.addArticoloFromScanner(item, numPezzi, quantita, lotto, scadenza, prezzoListino, sconto);

						scannerLog += '--------------------------------------------------\n';
						$('#scannerLog').append(scannerLog);

					});
				} else {
					var barcodeTruncate = barcode.substring(0, 6);
					var alertText = "Nessun articolo trovato con barcode completo '"+barcode+"' o barcode '"+barcodeTruncate+"'";
					//$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning'));
					$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();

					scannerLog += '--------------------------------------------------\n';
					$('#scannerLog').append(scannerLog);
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				var barcodeTruncate = barcode.substring(0, 6);
				var alertText = "Nessun articolo trovato con barcode completo '"+barcode+"' o barcode '"+barcodeTruncate+"'";
				$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();

				scannerLog += '--------------------------------------------------\n';
				$('#scannerLog').append(scannerLog);
			}
		});

	}
}
/*
	========================================
 */