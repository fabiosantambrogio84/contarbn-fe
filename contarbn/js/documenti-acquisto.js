var baseUrl = "/contarbn-be/";
var tipoDocumentoDdtAcquisto = "DDT acquisto";
var tipoDocumentoFatturaAcquisto = "Fattura acquisto";
var tipoDocumentoFatturaAccompagnatoriaAcquisto = "Fattura accompagnatoria acquisto";
var rowBackgroundAzzurro = '#afe5fa';

$.fn.loadDocumentoAcquistoTable = function(url) {
	$('#documentoAcquistoTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "data",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertDocumentoAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei documenti acquisto</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertDocumentoAcquisto').empty().append(alertContent);
			}
		},
		"language": {
			// "search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun documento acquisto disponibile",
			"zeroRecords": "Nessun documento acquisto disponibile",
			"info": "_TOTAL_ elementi",
			"infoEmpty": "0 elementi"
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
			[3, 'desc'],
			[4, 'asc'],
			[2, 'asc'],
			[1, 'desc']
		],
		"columns": [
			//{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
			//	var checkboxHtml = '<input type="checkbox" id="checkbox_'+data.id+'" data-id="'+data.id+'" data-tipo-documento="'+data.tipoDocumento+'" data-id-documento="'+data.idDocumento+'" data-partita-iva="'+data.partitaIvaFornitore+'" data-fatturato="'+data.fatturato+'" data-id-fornitore="'+data.idFornitore+'" class="documentoAcquistoCheckbox">';
			//	return checkboxHtml;
			//}},
			{"name": "fatturato", "data": null, "width":"5%", render: function ( data, type, row ) {
				if(data.fatturato){
					return 'Si';
				} else {
					return 'No';
				}
			}},
			{"name": "num_documento", "data": "numDocumento", "width":"3%"},
			{"name": "tipo_documento", "data": "tipoDocumento", "width":"8%"},
			{"name": "data_documento", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.dataDocumento);
				var contentHtml = '<span class="d-none">'+data.data+'</span>'+a.format('DD/MM/YYYY');
				return contentHtml;
			}},
			{"name": "ragione_sociale_fornitore", "data": "ragioneSocialeFornitore", "width":"10%"},
			{"name": "totale_imponibile", "data": null, "width":"5%", render: function ( data, type, row ) {
				if($.fn.checkVariableIsNull(data.totaleImponibile)){
					return '0';
				}
				return $.fn.formatNumber(data.totaleImponibile);
			}},
			{"name": "totale_iva", "data": null, "width":"5%", render: function ( data, type, row ) {
				var totaleIva = data.totaleIva;
				if($.fn.checkVariableIsNull(totaleIva)){
					return '0';
				}
				return $.fn.formatNumber(totaleIva);
			}},
			{"name": "totale", "data": null, "width":"8%",render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totale);
			}},
			{"data": null, "orderable":false, "width":"5%", render: function ( data, type, row ) {
				var acconto = data.totaleAcconto;
				if(acconto == null || acconto == undefined || acconto == ''){
					acconto = 0;
				}
				var totale = data.totale;
				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var links = '';
				if(data.tipoDocumento === tipoDocumentoDdtAcquisto){
					links += '<a class="detailsDdtAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
					if(data.stato === 'DA_PAGARE'){
						links += '<a class="updateDdtAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="ddt-acquisto-edit.html?idDdtAcquisto=' + data.idDocumento + '" title="Modifica"><i class="far fa-edit"></i></a>';
					}
					if((totale - acconto) != 0){
						links += '<a class="payDdtAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="pagamenti-new.html?idDdtAcquisto=' + data.idDocumento + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
					}
					links += '<a class="printDdtAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
					if(data.stato === 'DA_PAGARE'){
						links += '<a class="deleteDdtAcquisto" data-id-documento="'+data.idDocumento+'" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
					}
				} else if(data.tipoDocumento === tipoDocumentoFatturaAcquisto){
					links += '<a class="detailsFatturaAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
					//links += '<a class="updateFatturaAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="fatture-acquisto-edit.html?idFatturaAcquisto=' + data.idDocumento + '" title="Modifica"><i class="far fa-edit"></i></a>';
					if((totale - acconto) != 0){
						links += '<a class="payFatturaAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="pagamenti-new.html?idFatturaAcquisto=' + data.idDocumento + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
					}
					links += '<a class="printFatturaAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
					if(data.stato === 'DA_PAGARE') {
						links += '<a class="deleteFatturaAcquisto" data-id-documento="' + data.idDocumento + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
					}
				} else if(data.tipoDocumento === tipoDocumentoFatturaAccompagnatoriaAcquisto){
					links += '<a class="detailsFatturaAccompagnatoriaAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
					if(data.stato === 'DA_PAGARE') {
						links += '<a class="updateFatturaAccompagnatoriaAcquisto pr-1" data-id-documento="' + data.idDocumento + '" href="fatture-accompagnatorie-acquisto-edit.html?idFatturaAccompagnatoriaAcquisto=' + data.idDocumento + '" title="Modifica"><i class="far fa-edit"></i></a>';
					}
					if((totale - acconto) != 0){
						links += '<a class="payFatturaAccompagnatoriaAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="pagamenti-new.html?idFatturaAccompagnatoriaAcquisto=' + data.idDocumento + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
					}
					links += '<a class="printFatturaAccompagnatoriaAcquisto pr-1" data-id-documento="'+data.idDocumento+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
					if(data.stato === 'DA_PAGARE') {
						links += '<a class="deleteFatturaAccompagnatoriaAcquisto" data-id-documento="' + data.idDocumento + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
					}
				}
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
			$(cells[0]).css('text-align','left');
			$(cells[2]).css('font-weight','bold');
			$(cells[5]).css('text-align','right');
			$(cells[6]).css('text-align','right');
			$(cells[7]).css('text-align','right').css('font-weight','bold');
			//if(data.fatturato){
			//	$(row).css('background-color', rowBackgroundAzzurro);
			//}
			if(data.stato != null){
				var backgroundColor = '';
				if(data.tipoDocumento === tipoDocumentoDdtAcquisto){
					if(data.stato == 'DA_PAGARE'){
						backgroundColor = '#fcf456';
					} else if(data.stato == 'PARZIALMENTE_PAGATO'){
						backgroundColor = '#fcc08b';
					} else {
						backgroundColor = 'trasparent';
					}

					//if(data.fatturato){
					//	$(row).css('text-decoration', 'underline');
					//}

				} else if(data.tipoDocumento === tipoDocumentoFatturaAcquisto || data.tipoDocumento === tipoDocumentoFatturaAccompagnatoriaAcquisto){
					if(data.stato == 'DA_PAGARE'){
						backgroundColor = '#fcf456';
					} else if(data.stato == 'PARZIALMENTE_PAGATA'){
						backgroundColor = '#fcc08b';
					} else {
						backgroundColor = 'trasparent';
					}
				}
				$(row).css('background-color', backgroundColor);
			}
		}
		//"infoCallback": function( settings, start, end, max, total, pre ) {
		//	var api = this.api();
		//	var pageInfo = api.page.info();

		//	return '<div style="font-size:16px; font-weight:bold;" id="ddtAcquistoInfoElements" data-num-records="'+pageInfo.recordsTotal+'">'+'0 elementi selezionati di '+pageInfo.recordsTotal+'</div>';
		//}
	});
}

$(document).ready(function() {

	$.fn.loadDocumentoAcquistoTable(baseUrl + "documenti-acquisto/search");

	/*
	var documentiAcquistoToPrint = [];

	$(document).on('click','.documentoAcquistoCheckbox', function(){
		var uuidDocumentoAcquisto = $(this).attr('data-id');
		var toPrint = $(this).prop("checked");

		documentiAcquistoToPrint = $.grep(documentiAcquistoToPrint, function(value) {
			return value != uuidDocumentoAcquisto;
		});

		if(toPrint){
			documentiAcquistoToPrint.push(uuidDocumentoAcquisto);
		}
	});
	*/

	$(document).on('click','.detailsDdtAcquisto', function(){
		var idDdtAcquisto = $(this).attr('data-id-documento');

		var alertContent = '<div id="alertDocumentoAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero del DDT acquisto.</strong></div>';

		$.ajax({
			url: baseUrl + "ddts-acquisto/" + idDdtAcquisto,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#detailsDdtAcquistoMainDiv').removeClass("d-none");
					$('#detailsFatturaAcquistoMainDiv').addClass("d-none");
					$('#detailsFatturaAccompagnatoriaAcquistoMainDiv').addClass("d-none");

					$('#detailsDocumentoAcquistoModalTitle').text("Dettagli DDT acquisto");
					$('#ddtAcquistoNumero').text(result.numero);
					$('#ddtAcquistoData').text(moment(result.data).format('DD/MM/YYYY'));
					var stato = result.statoDdt;
					if(stato != null && stato != undefined && stato != ''){
						$('#ddtAcquistoStato').text(stato.descrizione);
					}
					var fornitore = result.fornitore;
					if(fornitore != null && fornitore != undefined && fornitore != ''){
						$('#ddtAcquistoFornitore').text(fornitore.ragioneSociale);
					}
					$('#ddtAcquistoColli').text(result.numeroColli);
					$('#ddtAcquistoTotaleImponibile').text(result.totaleImponibile);
					$('#ddtAcquistoTotale').text(result.totale);
					$('#ddtAcquistoNote').text(result.note);
					$('#ddtAcquistoDataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#ddtAcquistoDataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}

					$('#detailsDdtAcquistoArticoliModalTable').DataTable().destroy();
					$('#detailsDdtAcquistoIngredientiModalTable').DataTable().destroy();
					$('#detailsDdtAcquistoPagamentiModalTable').DataTable().destroy();

					if(result.ddtAcquistoArticoli != null && result.ddtAcquistoArticoli != undefined){
						if(result.ddtAcquistoArticoli.length){

							$('#spaceArticoli').removeClass("d-none");
							$('#detailsDdtAcquistoArticoliModalDiv').removeClass("d-none");

							$('#detailsDdtAcquistoArticoliModalTable').DataTable({
								"retrieve": true,
								"data": result.ddtAcquistoArticoli,
								"language": {
									"paginate": {
										"first": "Inizio",
										"last": "Fine",
										"next": "Succ.",
										"previous": "Prec."
									},
									"search": "Cerca",
									"emptyTable": "Nessun articolo presente",
									"zeroRecords": "Nessun articolo presente"
								},
								"pageLength": 20,
								"lengthChange": false,
								"info": false,
								"order": [
									[0, 'asc'],
									[1, 'desc']
								],
								"autoWidth": false,
								"columns": [
									{"name": "articolo", "data": null, render: function (data, type, row) {
										var result = '';
										if (data.articolo != null) {
											result = data.articolo.codice+' - '+data.articolo.descrizione;
										}
										return result;
									}},
									{"name": "lotto", "data": "lotto"},
									{"name": "quantita", "data": "quantita"},
									{"name": "dataScadenza", "data": null, "width":"8%", render: function ( data, type, row ) {
										var dataScadenza = data.dataScadenza;
										if(!$.fn.checkVariableIsNull(dataScadenza)){
											var a = moment(data.dataScadenza);
											return a.format('DD/MM/YYYY');
										}
										return '';
									}},
									{"name": "prezzo", "data": "prezzo"},
									{"name": "sconto", "data": "sconto"},
									{"name": "imponibile", "data": "imponibile"}
								]
							});
						}
					}

					if(result.ddtAcquistoIngredienti != null && result.ddtAcquistoIngredienti != undefined){
						if(result.ddtAcquistoIngredienti.length){

							$('#spaceIngredienti').removeClass("d-none");
							$('#detailsDdtAcquistoIngredientiModalDiv').removeClass("d-none");

							$('#detailsDdtAcquistoIngredientiModalTable').DataTable({
								"retrieve": true,
								"data": result.ddtAcquistoIngredienti,
								"language": {
									"paginate": {
										"first": "Inizio",
										"last": "Fine",
										"next": "Succ.",
										"previous": "Prec."
									},
									"search": "Cerca",
									"emptyTable": "Nessun ingrediente presente",
									"zeroRecords": "Nessun ingrediente presente"
								},
								"pageLength": 20,
								"lengthChange": false,
								"info": false,
								"order": [
									[0, 'asc'],
									[1, 'desc']
								],
								"autoWidth": false,
								"columns": [
									{"name": "ingrediente", "data": null, render: function (data, type, row) {
										var result = '';
										if (data.ingrediente != null) {
											result = data.ingrediente.codice+' - '+data.ingrediente.descrizione;
										}
										return result;
									}},
									{"name": "lotto", "data": "lotto"},
									{"name": "quantita", "data": "quantita"},
									{"name": "dataScadenza", "data": null, "width":"8%", render: function ( data, type, row ) {
										var dataScadenza = data.dataScadenza;
										if(!$.fn.checkVariableIsNull(dataScadenza)){
											var a = moment(data.dataScadenza);
											return a.format('DD/MM/YYYY');
										}
										return '';
									}},
									{"name": "prezzo", "data": "prezzo"},
									{"name": "sconto", "data": "sconto"},
									{"name": "imponibile", "data": "imponibile"}
								]
							});
						}
					}

					if(result.ddtAcquistoPagamenti != null && result.ddtAcquistoPagamenti != undefined){
						$('#detailsDdtAcquistoPagamentiModalTable').DataTable({
							"retrieve": true,
							"data": result.ddtAcquistoPagamenti,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun pagamento presente",
								"zeroRecords": "Nessun pagamento presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'desc'],
								[1, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "data", "data": null, "width":"8%", render: function (data, type, row) {
									var a = moment(data.data);
									return a.format('DD/MM/YYYY');
								}},
								{"name": "descrizione", "data": "descrizione", "width":"15%"},
								{"name": "importo", "data": null, "width":"8%", render: function ( data, type, row ) {
									return $.fn.formatNumber(data.importo);
								}},
								{"name": "tipoPagamento", "data": null, "width":"12%", render: function ( data, type, row ) {
									var tipoPagamento = data.tipoPagamento;
									if(tipoPagamento != null && tipoPagamento != undefined && tipoPagamento != ''){
										return tipoPagamento.descrizione;
									}
									return '';
								}},
								{"name": "note", "data": null, "width":"15%", render: function ( data, type, row ) {
									var note = data.note;
									var noteTrunc = note;
									var noteHtml = '<div>'+noteTrunc+'</div>';
									if(note.length > 100){
										noteTrunc = note.substring(0, 100)+'...';
										noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';
									}

									return noteHtml;
								}}
							]
						});
					}

				} else{
					$('#detailsDdtAcquistoMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsDdtAcquistoMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsDocumentoAcquistoModal').modal('show');
	});

	$(document).on('click','.detailsFatturaAcquisto', function(){
		var idFatturaAcquisto = $(this).attr('data-id-documento');

		var alertContent = '<div id="alertDocumentoAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della Fattura acquisto.</strong></div>';

		$.ajax({
			url: baseUrl + "fatture-acquisto/" + idFatturaAcquisto,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#detailsDdtAcquistoMainDiv').addClass("d-none");
					$('#detailsFatturaAcquistoMainDiv').removeClass("d-none");
					$('#detailsFatturaAccompagnatoriaAcquistoMainDiv').addClass("d-none");

					$('#detailsDocumentoAcquistoModalTitle').text("Dettagli Fattura acquisto");
					$('#fatturaAcquistoNumero').text(result.numero);
					$('#fatturaAcquistoData').text(moment(result.data).format('DD/MM/YYYY'));
					var fornitore = result.fornitore;
					if(fornitore != null && fornitore != undefined && fornitore != ''){
						$('#fatturaAcquistoFornitore').text(fornitore.ragioneSociale);
					}
					$('#fatturaAcquistoTotaleAcconto').text(result.totaleAcconto);
					$('#fatturaAcquistoTotale').text(result.totale);
					var stato = result.statoFattura;
					if(stato != null && stato != undefined && stato != ''){
						$('#fatturaAcquistoStato').text(stato.descrizione);
					}
					var causale = result.causale;
					if(causale != null && causale != undefined && causale != ''){
						$('#fatturaAcquistoCausale').text(causale.descrizione);
					}
					$('#fatturaAcquistoNote').text(result.note);
					$('#fatturaAcquistoDataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#fatturaAcquistoDataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}

					$('#detailsFatturaAcquistoDdtAcquistoModalTable').DataTable().destroy();
					$('#detailsFatturaAcquistoPagamentiModalTable').DataTable().destroy();

					if(result.fatturaAcquistoDdtAcquisti != null && result.fatturaAcquistoDdtAcquisti != undefined){
						$('#detailsFatturaAcquistoDdtAcquistoModalTable').DataTable({
							"data": result.fatturaAcquistoDdtAcquisti,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun DDT acquisto presente",
								"zeroRecords": "Nessun DDT acquisto presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'asc'],
								[1, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "numero", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddtAcquisto != null) {
										result = data.ddtAcquisto.numero;
									}
									return result;
								}},
								{"name": "data", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddtAcquisto != null) {
										result = moment(data.ddtAcquisto.data).format('DD/MM/YYYY');
									}
									return result;
								}},
								{"name": "acconto", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddtAcquisto != null) {
										result = data.ddtAcquisto.totaleAcconto;
									}
									return $.fn.formatNumber(result);
								}},
								{"name": "importo", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddtAcquisto != null) {
										result = data.ddtAcquisto.totale;
									}
									return $.fn.formatNumber(result);
								}},
								{"name": "imponibile", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddtAcquisto != null) {
										result = data.ddtAcquisto.totaleImponibile;
									}
									return $.fn.formatNumber(result);
								}}
							]
						});
					}

					if(result.fatturaAcquistoPagamenti != null && result.fatturaAcquistoPagamenti != undefined){
						$('#detailsFatturaAcquistoPagamentiModalTable').DataTable({
							"retrieve": true,
							"data": result.fatturaAcquistoPagamenti,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun pagamento presente",
								"zeroRecords": "Nessun pagamento presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'desc'],
								[1, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "data", "data": null, "width":"8%", render: function (data, type, row) {
									var a = moment(data.data);
									return a.format('DD/MM/YYYY');
								}},
								{"name": "descrizione", "data": "descrizione", "width":"15%"},
								{"name": "importo", "data": null, "width":"8%", render: function ( data, type, row ) {
									return $.fn.formatNumber(data.importo);
								}},
								{"name": "tipoPagamento", "data": null, "width":"12%", render: function ( data, type, row ) {
									var tipoPagamento = data.tipoPagamento;
									if(tipoPagamento != null && tipoPagamento != undefined && tipoPagamento != ''){
										return tipoPagamento.descrizione;
									}
									return '';
								}},
								{"name": "note", "data": null, "width":"15%", render: function ( data, type, row ) {
									var note = data.note;
									var noteTrunc = note;
									var noteHtml = '<div>'+noteTrunc+'</div>';
									if(note.length > 100){
										noteTrunc = note.substring(0, 100)+'...';
										noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';
									}

									return noteHtml;
								}}
							]
						});
					}

				} else{
					$('#detailsFatturaAcquistoMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsFatturaAcquistoMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsDocumentoAcquistoModal').modal('show');
	});

	$(document).on('click','.detailsFatturaAccompagnatoriaAcquisto', function(){
		var idFatturaAccompagnatoriaAcquisto = $(this).attr('data-id-documento');

		var alertContent = '<div id="alertDocumentoAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della Fattura accompagnatoria acquisto.</strong></div>';

		$.ajax({
			url: baseUrl + "fatture-accompagnatorie-acquisto/" + idFatturaAccompagnatoriaAcquisto,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#detailsDdtAcquistoMainDiv').addClass("d-none");
					$('#detailsFatturaAcquistoMainDiv').addClass("d-none");
					$('#detailsFatturaAccompagnatoriaAcquistoMainDiv').removeClass("d-none");

					$('#detailsDocumentoAcquistoModalTitle').text("Dettagli Fattura accompagnatoria acquisto");
					$('#fatturaAccompagnatoriaAcquistoNumero').text(result.numero);
					$('#fatturaAccompagnatoriaAcquistoData').text(moment(result.data).format('DD/MM/YYYY'));
					$('#fatturaAccompagnatoriaAcquistoDataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#fatturaAccompagnatoriaAcquistoDataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}
					var stato = result.statoFattura;
					if(stato != null && stato != undefined && stato != ''){
						$('#fatturaAccompagnatoriaAcquistoStato').text(stato.descrizione);
					}
					var tipo = result.tipoFattura;
					if(tipo != null && tipo != undefined && tipo != ''){
						$('#fatturaAccompagnatoriaAcquistoTipo').text(tipo.descrizione);
					}
					var fornitore = result.fornitore;
					if(fornitore != null && fornitore != undefined && fornitore != ''){
						var label = fornitore.ragioneSociale + ' - ' + fornitore.indirizzo + ' ' + fornitore.citta + ', ' + fornitore.cap + ' (' + fornitore.provincia + ')';
						$('#fatturaAccompagnatoriaAcquistoFornitore').text(label);
					}
					var causale = result.causale;
					if(causale != null && causale != undefined && causale != ''){
						$('#fatturaAccompagnatoriaAcquistoCausale').text(causale.descrizione);
					}
					$('#fatturaAccompagnatoriaAcquistoNote').text(result.note);
					$('#fatturaAccompagnatoriaAcquistoTotaleImponibile').text(result.totaleImponibile);
					$('#fatturaAccompagnatoriaAcquistoTotaleIva').text(result.totaleIva);
					$('#fatturaAccompagnatoriaAcquistoTotaleAcconto').text(result.totaleAcconto);
					$('#fatturaAccompagnatoriaAcquistoTotale').text(result.totale);

					if(result.fatturaAccompagnatoriaAcquistoArticoli != null && result.fatturaAccompagnatoriaAcquistoArticoli != undefined){

						if(result.fatturaAccompagnatoriaAcquistoArticoli.length){
							$('#fatturaAccompagnatoriaAcquistoSpaceArticoli').removeClass("d-none");
							$('#detailsFatturaAccompagnatoriaAcquistoArticoliModalDiv').removeClass("d-none");

							$('#detailsFattureAccompagnatorieAcquistoArticoliModalTable').DataTable({
								"data": result.fatturaAccompagnatoriaAcquistoArticoli,
								"language": {
									"paginate": {
										"first": "Inizio",
										"last": "Fine",
										"next": "Succ.",
										"previous": "Prec."
									},
									"search": "Cerca",
									"emptyTable": "Nessun articolo presente",
									"zeroRecords": "Nessun articolo presente"
								},
								"pageLength": 20,
								"lengthChange": false,
								"info": false,
								"order": [
									[0, 'asc'],
									[1, 'asc']
								],
								"autoWidth": false,
								"columns": [
									{"name": "articolo", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.articolo != null) {
												result = data.articolo.codice+' - '+data.articolo.descrizione;
											}
											return result;
										}},
									{"name": "lotto", "data": "lotto"},
									{"name": "scadenza", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.scadenza != null) {
												result = moment(data.scadenza).format('DD/MM/YYYY');
											}
											return result;
										}},
									{"name": "quantita", "data": "quantita"},
									{"name": "pezzi", "data": "numeroPezzi"},
									{"name": "prezzo", "data": "prezzo"},
									{"name": "sconto", "data": "sconto"},
									{"name": "imponibile", "data": "imponibile"},
									{"name": "costo", "data": "costo"}
								]
							});
						}
					}

					if(result.fatturaAccompagnatoriaAcquistoIngredienti != null && result.fatturaAccompagnatoriaAcquistoIngredienti != undefined){

						if(result.fatturaAccompagnatoriaAcquistoIngredienti.length){
							$('#fatturaAccompagnatoriaAcquistoSpaceIngredienti').removeClass("d-none");
							$('#detailsFatturaAccompagnatoriaAcquistoIngredientiModalDiv').removeClass("d-none");

							$('#detailsFattureAccompagnatorieAcquistoIngredientiModalTable').DataTable({
								"data": result.fatturaAccompagnatoriaAcquistoIngredienti,
								"language": {
									"paginate": {
										"first": "Inizio",
										"last": "Fine",
										"next": "Succ.",
										"previous": "Prec."
									},
									"search": "Cerca",
									"emptyTable": "Nessun ingrediente presente",
									"zeroRecords": "Nessun ingrediente presente"
								},
								"pageLength": 20,
								"lengthChange": false,
								"info": false,
								"order": [
									[0, 'asc'],
									[1, 'asc']
								],
								"autoWidth": false,
								"columns": [
									{"name": "ingrediente", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.ingrediente != null) {
												result = data.ingrediente.codice+' - '+data.ingrediente.descrizione;
											}
											return result;
										}},
									{"name": "lotto", "data": "lotto"},
									{"name": "scadenza", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.scadenza != null) {
												result = moment(data.scadenza).format('DD/MM/YYYY');
											}
											return result;
										}},
									{"name": "quantita", "data": "quantita"},
									{"name": "pezzi", "data": "numeroPezzi"},
									{"name": "prezzo", "data": "prezzo"},
									{"name": "sconto", "data": "sconto"},
									{"name": "imponibile", "data": "imponibile"},
									{"name": "costo", "data": "costo"}
								]
							});
						}
					}

					if(result.fatturaAccompagnatoriaAcquistoTotali != null && result.fatturaAccompagnatoriaAcquistoTotali != undefined){
						$('#detailsFattureAccompagnatorieAcquistoTotaliModalTable').DataTable({
							"data": result.fatturaAccompagnatoriaAcquistoTotali,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun totale presente",
								"zeroRecords": "Nessun totale presente"
							},
							"paging": false,
							"searching": false,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "aliquotaIva", "data": null, render: function (data, type, row) {
										var result = '';
										if (data.aliquotaIva != null) {
											result = data.aliquotaIva.valore;
										}
										return result;
									}},
								{"name": "totaleIva", "data": "totaleIva"},
								{"name": "totaleImponibile", "data": "totaleImponibile"}
							]
						});
					}

				} else{
					$('#detailsFatturaAccompagnatoriaAcquistoMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsFatturaAccompagnatoriaAcquistoMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsDocumentoAcquistoModal').modal('show');
	});

	$(document).on('click','.closeDocumentoAcquisto', function(){
		$('#detailsDocumentoAcquistoArticoliModalTable').DataTable().destroy();
		$('#detailsDocumentoAcquistoModal').modal('hide');
	});

	$(document).on('click','.deleteDdtAcquisto', function(){
		var idDdtAcquisto = $(this).attr('data-id-documento');
		$('#confirmDeleteDocumentoAcquisto').attr('data-id-documento', idDdtAcquisto).attr('data-tipo-documento',tipoDocumentoDdtAcquisto);
		$('#deleteDocumentoAcquistoModal').modal('show');
	});

	$(document).on('click','.deleteFatturaAcquisto', function(){
		var idFatturaAcquisto = $(this).attr('data-id-documento');
		$('#confirmDeleteDocumentoAcquisto').attr('data-id-documento', idFatturaAcquisto).attr('data-tipo-documento',tipoDocumentoFatturaAcquisto);
		$('#deleteDocumentoAcquistoModal').modal('show');
	});

	$(document).on('click','.deleteFatturaAccompagnatoriaAcquisto', function(){
		var idFatturaAccompagnatoriaAcquisto = $(this).attr('data-id-documento');
		$('#confirmDeleteDocumentoAcquisto').attr('data-id-documento', idFatturaAccompagnatoriaAcquisto).attr('data-tipo-documento',tipoDocumentoFatturaAccompagnatoriaAcquisto);
		$('#deleteDocumentoAcquistoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteDocumentoAcquisto', function(){
		$('#deleteDocumentoAcquistoModal').modal('hide');
		var idDocumento = $(this).attr('data-id-documento');
		var tipoDocumento = $(this).attr('data-tipo-documento');
		var modificaGiacenze = $("input[name='modificaGiacenze']:checked").val();

		if(tipoDocumento === tipoDocumentoDdtAcquisto){
			var url = baseUrl + "ddts-acquisto/" + idDocumento;
			if(modificaGiacenze != null && modificaGiacenze != ''){
				if(modificaGiacenze == 'si'){
					url += "?modificaGiacenze=true";
				} else {
					url += "?modificaGiacenze=false";
				}
			} else {
				url += "?modificaGiacenze=false";
			}

			$.ajax({
				url: url,
				type: 'DELETE',
				success: function() {
					var alertContent = '<div id="alertDocumentoAcquistoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>DDT acquisto</strong> cancellato con successo.\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertDocumentoAcquisto').empty().append(alertContent);

					$('#documentoAcquistoTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
				}
			});
		} else if(tipoDocumento === tipoDocumentoFatturaAcquisto){
			var url = baseUrl + "fatture-acquisto/" + idDocumento;
			if(modificaGiacenze != null && modificaGiacenze != ''){
				if(modificaGiacenze == 'si'){
					url += "?modificaGiacenze=true";
				} else {
					url += "?modificaGiacenze=false";
				}
			} else {
				url += "?modificaGiacenze=false";
			}

			$.ajax({
				url: url,
				type: 'DELETE',
				success: function() {
					var alertContent = '<div id="alertDocumentoAcquistoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Fattura acquisto</strong> cancellata con successo.\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertDocumentoAcquisto').empty().append(alertContent);

					$('#documentoAcquistoTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
				}
			});
		} else if(tipoDocumento === tipoDocumentoFatturaAccompagnatoriaAcquisto){
			var url = baseUrl + "fatture-accompagnatorie-acquisto/" + idDocumento;
			if(modificaGiacenze != null && modificaGiacenze != ''){
				if(modificaGiacenze == 'si'){
					url += "?modificaGiacenze=true";
				} else {
					url += "?modificaGiacenze=false";
				}
			} else {
				url += "?modificaGiacenze=false";
			}

			$.ajax({
				url: url,
				type: 'DELETE',
				success: function() {
					var alertContent = '<div id="alertDocumentoAcquistoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Fattura accompagnatoria acquisto</strong> cancellata con successo.\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertDocumentoAcquisto').empty().append(alertContent);

					$('#documentoAcquistoTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
				}
			});
		}
	});

	$(document).on('click','.printDdtAcquisto', function(){
		var idDdtAcquisto = $(this).attr('data-id-documento');
		window.open(baseUrl + "stampe/ddts-acquisto/"+idDdtAcquisto, '_blank');
	});

	$(document).on('click','.printFatturaAcquisto', function(){
		var idFatturaAcquisto = $(this).attr('data-id-documento');
		window.open(baseUrl + "stampe/fatture-acquisto/"+idFatturaAcquisto, '_blank');
	});

	$(document).on('click','.printFatturaAccompagnatoriaAcquisto', function(){
		var idFatturaAccompagnatoriaAcquisto = $(this).attr('data-id-documento');
		window.open(baseUrl + "stampe/fatture-accompagnatorie-acquisto/"+idFatturaAccompagnatoriaAcquisto, '_blank');
	});

	$.fn.createUrlSearch = function(path){
		var numDocumento = $('#searchNumero').val();
		var fornitore = $('#searchFornitore').val();
		var tipoDocumento = $('#searchTipo option:selected').val();
		var dataDa = $('#searchDataFrom').val();
		var dataA = $('#searchDataTo').val();

		var params = {};
		if(numDocumento != null && numDocumento != undefined && numDocumento != ''){
			params.numDocumento = numDocumento;
		}
		if(fornitore != null && fornitore != undefined && fornitore != ''){
			params.fornitore = fornitore;
		}
		if(tipoDocumento != null && tipoDocumento != undefined && tipoDocumento != ''){
			params.tipoDocumento = tipoDocumento;
		}
		if(dataDa != null && dataDa != undefined && dataDa != ''){
			params.dataDa = dataDa;
		}
		if(dataA != null && dataA != undefined && dataA != ''){
			params.dataA = dataA;
		}
		return baseUrl + path + $.param( params );
	};

	if($('#searchDocumentoAcquistoButton') != null && $('#searchDocumentoAcquistoButton') != undefined) {
		$(document).on('submit', '#searchDocumentoAcquistoForm', function (event) {
			event.preventDefault();

			var url = $.fn.createUrlSearch("documenti-acquisto/search?");

			$('#documentoAcquistoTable').DataTable().destroy();
			$.fn.loadDocumentoAcquistoTable(url);

		});

		$(document).on('click','#resetSearchDocumentoAcquistoButton', function(){
			$('#searchDocumentoAcquistoForm :input').val(null);
			$('#searchDocumentoAcquistoForm select option[value=""]').attr('selected', true);

			$('#documentoAcquistoTable').DataTable().destroy();
			$.fn.loadDocumentoAcquistoTable(baseUrl + "documenti-acquisto/search");
		});

		$(document).on('click','#creaDistinta', function(event) {
			event.preventDefault();
			var url = $.fn.createUrlSearch("stampe/documenti-acquisto/distinta?");
			window.open(url, '_blank');
		});
	}
});