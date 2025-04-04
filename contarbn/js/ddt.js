var baseUrl = "/contarbn-be/";
var rowBackgroundVerde = '#96ffb2';
var rowBackgroundRosa = '#fcd1ff';
var rowBackgroundGiallo = '#fffca3';


$.fn.loadDdtTable = function(url) {
	$.ajax({
		url: baseUrl + "autisti?attivo=true",
		type: 'GET',
		async: false,
		dataType: 'json',
		success: function(autistiResult) {
			$('#ddtTable').DataTable({
				"ajax": {
					"url": url,
					"type": "GET",
					"content-type": "json",
					"cache": false,
					"dataSrc": "data",
					"error": function(jqXHR) {
						console.log('Response text: ' + jqXHR.responseText);
						var alertContent = '<div id="alertDdtContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
						alertContent += '<strong>Errore nel recupero dei DDT</strong>\n' +
							'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
						$('#alertDdt').empty().append(alertContent);
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
					"emptyTable": "Nessun DDT disponibile",
					"zeroRecords": "Nessun DDT disponibile",
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
					[0, 'desc'],
					[2, 'desc']
				],
				"columns": [
					{"name":"anno_contabile", "data": "annoContabile", "width":"5%", "visible": false},
					{"data": null, "orderable":false, "width": "2%", render: function ( data) {
						return '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="checkDdt" >';
					}},
					{"name": "progressivo", "data": "progressivo", "width":"5%"},
					{"name": "data", "data": null, "width":"8%", render: function (data) {
						var a = moment(data.data);
						return a.format('DD/MM/YYYY');
					}},
					{"name": "fatturato", "data": null, "width":"5%", render: function (data) {
						if(data.fatturato){
							return 'Si';
						} else {
							return 'No';
						}
					}},
					{"name": "cliente", "data": null, "width":"10%", render: function (data) {
						return data.cliente;
					}},
					{"name": "agente", "data": null, "width":"10%", render: function (data) {
						return data.agente;
					}},
					{"name":"autista", "data": null, "width":"13%", render: function (data) {
						var ddtId = data.id;
						var selectId = "autista_" + ddtId;

						var autistaId = data.idAutista;

						var autistaSelect = '<select id="'+selectId+'" class="form-control form-control-sm autistaDdt" data-id="'+ddtId+'">';
						autistaSelect += '<option value=""> - </option>';
						if(autistiResult != null && autistiResult !== ''){
							$.each(autistiResult, function(i, item){
								var label = item.cognome + ' ' + item.nome;
								var optionHtml = '<option value="'+item.id+'"';
								if(autistaId != null){
									if(autistaId === item.id){
										optionHtml += ' selected';
									}
								}
								optionHtml += '>'+label+'</option>';
								autistaSelect += optionHtml;
							});
						}
						autistaSelect += '</select';
						return autistaSelect;
					}},
					{"name": "totale_imponibile", "data": null, "width":"8%", render: function (data) {
						return $.fn.formatNumber(data.totaleImponibile);
					}},
					{"name": "totale_costo", "data": null, "width":"8%", render: function (data) {
						return $.fn.formatNumber(data.totaleCosto);
					}},
					{"name": "guadagno", "data": null, "orderable":false, "width":"8%", render: function (data) {
						var guadagno = data.totaleImponibile - data.totaleCosto;
						return $.fn.formatNumber(guadagno);
					}},
					{"name": "totale_acconto", "data": null, "width":"8%", render: function (data) {
						return $.fn.formatNumber(data.totaleAcconto);
					}},
					{"name": "totale", "data": null, "width":"8%",render: function (data) {
						return $.fn.formatNumber(data.totale);
					}},
					{"data": null, "orderable":false, "width":"13%", render: function (data) {
						var acconto = data.totaleAcconto;
						if(acconto == null || acconto === ''){
							acconto = 0;
						}
						var totale = data.totale;
						if(totale == null || totale === ''){
							totale = 0;
						}
						var stato = data.stato;

						var links = '<a class="detailsDdt pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
						if(!data.fatturato && (stato != null && stato !== '' && stato === 'DA_PAGARE')){
							links += '<a class="updateDdt pr-1" data-id="'+data.id+'" href="ddt-edit.html?idDdt=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
						}
						if((totale - acconto) !== 0){
							links += '<a class="payDdt pr-1" data-id="'+data.id+'" href="pagamenti-new.html?idDdt=' + data.id + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
						}
						links += '<a class="printDdt pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
						var clienteEmail = data.clienteEmail;
						if(clienteEmail != null && clienteEmail !== ""){
							links += '<a class="emailDdt pr-1" data-id="'+data.id+'" data-email-to="'+clienteEmail+'" href="#" title="Invio email"><i class="fa fa-envelope"></i></a>';
						}
						if(!data.fatturato && (stato != null && stato !== '' && stato === 'DA_PAGARE')) {
							links += '<a class="deleteDdt" data-id="' + data.id + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
						}
						return links;
					}}
				],
				"createdRow": function(row, data, dataIndex,cells){
					$(row).css('font-size', '12px').addClass('rowDdt');
					$(row).attr('data-id-ddt', data.id);
					if(data.stato != null){
						var backgroundColor;
						if(data.stato === 'DA_PAGARE'){
							backgroundColor = '#fcf456';
						} else if(data.stato === 'PARZIALMENTE_PAGATO'){
							backgroundColor = '#fcc08b';
						} else {
							backgroundColor = 'trasparent';
						}
						$(row).css('background-color', backgroundColor);
					}
					$(cells[11]).css('padding-right','0px').css('padding-left','3px');
					$(cells[6]).css('text-align','right');
					$(cells[8]).css('text-align','right');
					$(cells[9]).css('text-align','right');
					$(cells[10]).css('text-align','right');
					$(cells[11]).css('text-align','right');
					$(cells[12]).css('text-align','right').css('font-weight','bold');
				},
				"initComplete": function() {
					var costoAbilitato = $.fn.getConfigurazioneItemClient('DDT_COSTO');
					var guadagnoAbilitato = $.fn.getConfigurazioneItemClient('DDT_GUADAGNO');

					var table = $('#ddtTable').DataTable();
					if(!costoAbilitato){
						table.column(9).visible(false);
						table.column(8).nodes().to$().css('font-weight','normal');
					} else {
						table.column(9).visible(true);
					}
					if(!guadagnoAbilitato){
						table.column(10).visible(false);
					} else {
						table.column(10).visible(true);
					}
				}
			});
		}
	});
}

$.fn.loadDdtArticoliTable = function() {
	$('#ddtArticoliTable').DataTable({
		"retrieve": true,
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

$(document).ready(function() {

	var ddtsToPrint = [];

	$.fn.loadDdtTable(baseUrl + "ddts/search");

	if(window.location.search.substring(1).indexOf('idDdt') === -1){
		$.fn.loadDdtArticoliTable();
	}

	$(document).on('click','.checkDdt', function(){
		var idDdt = $(this).attr('data-id');
		var toPrint = $(this).prop("checked");

		ddtsToPrint = $.grep(ddtsToPrint, function(value) {
			return value !== idDdt;
		});

		if(toPrint){
			ddtsToPrint.push(idDdt);
		}
	});

	$(document).on('click','#resetSearchDdtButton', function(){
		$('#searchDdtForm :input').val(null);
		$('#searchDdtForm select option[value=""]').attr('selected', true);

		$('#ddtTable').DataTable().destroy();
		$.fn.loadDdtTable(baseUrl + "ddts/search");
	});

	$(document).on('click','.detailsDdt', function(){
		var idDdt = $(this).attr('data-id');

		var alertContent = '<div id="alertDdtContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent += '<strong>Errore nel recupero del DDT.</strong></div>';

		$.ajax({
			url: baseUrl + "ddts/" + idDdt,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result !== '') {
					$('#numero').text(result.progressivo);
					$('#data').text(moment(result.data).format('DD/MM/YYYY'));
					var cliente = result.cliente;
					if(cliente != null && cliente !== ''){
						if(cliente.dittaIndividuale){
							$('#cliente').text(cliente.nome + ' ' + cliente.cognome);
						} else {
							$('#cliente').text(cliente.ragioneSociale);
						}
						var agente = cliente.agente;
						if(agente != null){
							$('#agente').text(agente.nome + ' ' + agente.cognome);
						}
					}
					var puntoConsegna = result.puntoConsegna;
					if(puntoConsegna != null && puntoConsegna !== ''){
						$('#puntoConsegna').text(puntoConsegna.nome);
					}
					var autista = result.autista;
					if(autista != null && autista !== ''){
						$('#autista').text(autista.nome+' '+autista.cognome);
					}
					var stato = result.statoDdt;
					if(stato != null && stato !== ''){
						$('#stato').text(stato.descrizione);
					}
					var causale = result.causale;
					if(causale != null && causale !== ''){
						$('#causale').text(causale.descrizione);
					}
					$('#tipoTrasporto').text(result.tipoTrasporto);
					$('#dataTrasporto').text(moment(result.dataTrasporto).format('DD/MM/YYYY'));
					$('#oraTrasporto').text(result.oraTrasporto);
					var trasportatore = result.trasportatore;
					if(trasportatore != null && trasportatore !== ''){
						$('#trasportatore').text(trasportatore.nome+' '+trasportatore.cognome);
					}
					$('#colli').text(result.numeroColli);
					$('#totaleImponibile').text(result.totaleImponibile);
					$('#totaleIva').text(result.totaleIva);
					$('#totaleCosto').text(result.totaleCosto);
					$('#totaleAcconto').text(result.totaleAcconto);
					$('#totale').text(result.totale);
					if(result.fatturato){
						$('#fatturato').text("Si");
					} else {
						$('#fatturato').text("No");
					}
					if(result.consegnato){
						$('#consegnato').text("Si");
					} else {
						$('#consegnato').text("No");
					}
					$('#note').text(result.note);
					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento !== ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}

					if(result.ddtArticoli != null){
						$('#detailsDdtArticoliModalTable').DataTable({
							"retrieve": true,
							"data": result.ddtArticoli,
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
								[3, 'desc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "articolo", "data": null, render: function (data) {
									var result = '';
									if (data.articolo != null) {
										result = data.articolo.codice+' - '+data.articolo.descrizione;
									}
									return result;
								}},
								{"name": "lotto", "data": "lotto"},
								{"name": "scadenza", "data": null, render: function (data) {
									if(!$.fn.checkVariableIsNull(data.scadenza)){
										var a = moment(data.scadenza);
										return a.format('DD/MM/YYYY');
									}
									return '';
								}},
								{"name": "quantita", "data": "quantita"},
								{"name": "pezzi", "data": "numeroPezzi"},
								{"name": "prezzo", "data": "prezzo"},
								{"name": "sconto", "data": "sconto"},
								{"name": "imponibile", "data": "imponibile"},
								{"name": "costo", "data": "costo"}
							],
							"initComplete": function() {
								var costoAbilitato = $.fn.getConfigurazioneItemClient('DDT_COSTO');

								var table = $('#detailsDdtArticoliModalTable').DataTable();
								if(!costoAbilitato){
									table.column(8).visible(false);
								} else {
									table.column(8).visible(true);
								}
							}
						});
					}

					if(result.ddtPagamenti != null){
						$('#detailsDdtPagamentiModalTable').DataTable({
							"retrieve": true,
							"data": result.ddtPagamenti,
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
								{"name": "data", "data": null, "width":"8%", render: function (data) {
									var a = moment(data.data);
									return a.format('DD/MM/YYYY');
								}},
								{"name": "descrizione", "data": "descrizione", "width":"15%"},
								{"name": "importo", "data": null, "width":"8%", render: function ( data ) {
									return $.fn.formatNumber(data.importo);
								}},
								{"name": "tipoPagamento", "data": null, "width":"12%", render: function ( data ) {
									var tipoPagamento = data.tipoPagamento;
									if(tipoPagamento != null && tipoPagamento !== ''){
										return tipoPagamento.descrizione;
									}
									return '';
								}},
								{"name": "note", "data": null, "width":"15%", render: function ( data ) {
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
					$('#detailsDdtMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR) {
				$('#detailsDdtMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsDdtModal').modal('show');
	});

	$(document).on('click','.closeDdt', function(){
		$('#detailsDdtArticoliModalTable').DataTable().destroy();
		$('#detailsDdtPagamentiModalTable').DataTable().destroy();
		$('#detailsDdtModal').modal('hide');
	});

	$(document).on('click','.deleteDdt', function(){
		var idDdt = $(this).attr('data-id');
		$('#confirmDeleteDdt').attr('data-id', idDdt);
		$('#deleteDdtModal').modal('show');
	});

	$(document).on('click','#confirmDeleteDdt', function(){
		$('#deleteDdtModal').modal('hide');
		var idDdt = $(this).attr('data-id');
		var modificaGiacenze = $("input[name='modificaGiacenze']:checked").val();

		var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var url = baseUrl + "ddts/" + idDdt;
		if(modificaGiacenze != null && modificaGiacenze !== ''){
			if(modificaGiacenze === 'si'){
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

				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'DDT</strong> cancellato con successo.').replace('@@alertResult@@', 'success'));

				$('#ddtTable').DataTable().ajax.reload();
			},
			error: function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Errore nella cancellazione del DDT').replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('click','.printDdt', function(){
		var idDdt = $(this).attr('data-id');

		window.open(baseUrl + "stampe/ddts/"+idDdt, '_blank');
	});

	$(document).on('click','#printDdts', function(event){
		event.preventDefault();

		var url = $.fn.createUrlSearch("stampe/ddts?");

		window.open(url, '_blank');
	});

	$(document).on('click','#printDdtsSelected', function(event){
		event.preventDefault();

		var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		if(ddtsToPrint != null && ddtsToPrint.length > 0){

			if(ddtsToPrint.length > 30){
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Selezionare al massimo 30 DDT').replace('@@alertResult@@', 'danger'));
			} else {

				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Generazione file in corso...').replace('@@alertResult@@', 'warning'));

				var url = baseUrl + "stampe/ddts/selected";

				var body = {};
				body.ddts = ddtsToPrint;

				$.ajax({
					type: "POST",
					url: url,
					contentType: "application/json",
					data: JSON.stringify(ddtsToPrint),
					xhr: function () {
						var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function () {
							if (xhr.readyState === 2) {
								if (xhr.status === 200) {
									xhr.responseType = "blob";
								} else {
									xhr.responseType = "text";
								}
							}
						};
						return xhr;
					},
					success: function (response) {

						var blob = new Blob([response], {type: "application/pdf"});
						var blobUrl = URL.createObjectURL(blob);

						window.open(blobUrl, '_blank');

						$('#alertDdt').empty();
						ddtsToPrint = [];
						$(".checkDdt").prop("checked", false);
					},
					error: function (jqXHR) {
						var errorMessage = 'Errore nella stampa dei DDT';
						if (jqXHR != null) {
							var jqXHRResponseJson = jqXHR.responseJSON;
							if (jqXHRResponseJson != null && jqXHRResponseJson !== '') {
								var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
								if (jqXHRResponseJsonMessage != null
									&& jqXHRResponseJsonMessage !== '') {
									errorMessage = jqXHRResponseJsonMessage;
								}
							}
						}
						$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
					}
				});

			}
		} else {
			$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Selezionare almeno un DDT.').replace('@@alertResult@@', 'danger'));
		}
	});

    $(document).on('click','.emailDdt', function(){
        var idDdt = $(this).attr('data-id');
        var email = $(this).attr('data-email-to');
        $('#confirmSendEmailDdt').attr('data-id', idDdt);
        $('#sendEmailDdtModalBody').html("Il DDT verrà inviato a <b>"+email+"</b>. Confermi?");
        $('#sendEmailDdtModal').modal('show');
    });

    $(document).on('click','#confirmSendEmailDdt', function(){
        $('#sendEmailDdtModal').modal('hide');
        var idDdt = $(this).attr('data-id');

        var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
        alertContent += '<strong>@@alertText@@\n' +
            '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

        var url = baseUrl + "emails/ddts/" + idDdt;

        $('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Invio email in corso...').replace('@@alertResult@@', 'warning'));

        $.ajax({
            url: url,
            type: 'GET',
            success: function() {
                $('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Email inviata con successo.').replace('@@alertResult@@', 'success'));
                $('#ddtTable').DataTable().ajax.reload();
            },
            error: function(jqXHR) {
                console.log('Response text: ' + jqXHR.responseText);
                $('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Errore nell'invio dell'email").replace('@@alertResult@@', 'danger'));
            }
        });
    });

	$(document).on('click','#addArticolo', function(event){
		event.preventDefault();

		var alertContent;

		var articoloField = $('#articolo option:selected');
		var articoloId = articoloField.val();

		if(articoloId == null || articoloId === ''){
			alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Seleziona un articolo\n' +
				'              </div>';

			$('#addDdtArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addDdtArticoloAlert').empty();
		}

		var pezzi = $('#pezzi').val();
		if(pezzi == null || pezzi === ''){
			alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Inserisci il numero di pezzi\n' +
				'              </div>';

			$('#addDdtArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addDdtArticoloAlert').empty();
		}

		var articolo = articoloField.text();
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#scadenza').val();
		var quantita = $('#quantita').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#iva').val();
		var codiceFornitore = articoloField.attr("data-codice-fornitore");
		var lottoRegExp = articoloField.attr("data-lotto-regexp");
		var dataScadenzaRegExp = articoloField.attr("data-scadenza-regexp");
		var scadenzaGiorniAllarme = articoloField.attr("data-scadenza-giorni-allarme");

		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
		if(lotto != null && lotto !== ''){
			lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
		}
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';

		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(quantita,3)+'">';
		var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+pezzi+'">';
		var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

		// check if a same articolo was already added
		var found = 0;
		var currentRowIndex;
		var currentIdArticolo;
		var currentLotto;
		var currentPrezzo;
		var currentSconto;
		var currentScadenza;
		var currentQuantita = 0;
		var currentPezzi = 0;

		if(!$.fn.DataTable.isDataTable( '#ddtArticoliTable' )){
			$.fn.loadDdtArticoliTable();
		}
		var articoliTable = $('#ddtArticoliTable').DataTable();
		var ddtArticoliLength = articoliTable.rows().nodes().length;

		if(ddtArticoliLength != null && ddtArticoliLength !== 0) {
			articoliTable.rows().nodes().each(function(i){

				if(found !== 1){
					currentRowIndex = $(i).attr('data-row-index');
					//currentIdOrdineCliente = $(this).attr('data-id-ordine-cliente');
					currentIdArticolo = $(i).attr('data-id');
					currentLotto = $(i).children().eq(1).children().eq(0).val();
					currentScadenza = $(i).children().eq(2).children().eq(0).val();
					currentPrezzo = $(i).children().eq(6).children().eq(0).val();
					currentSconto = $(i).children().eq(7).children().eq(0).val();
					if(currentSconto === '0'){
						currentSconto = '';
					}
					//currentPezziDaEvadere = $(this).children().eq(6).children().eq(0).val();

					if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) === $.fn.normalizeIfEmptyOrNullVariable(articoloId)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentLotto) === $.fn.normalizeIfEmptyOrNullVariable(lotto)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentPrezzo) === $.fn.normalizeIfEmptyOrNullVariable(prezzo)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentSconto) === $.fn.normalizeIfEmptyOrNullVariable(sconto)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentScadenza) === $.fn.normalizeIfEmptyOrNullVariable(scadenza)){
						found = 1;
						currentQuantita = $(i).children().eq(4).children().eq(0).val();
						currentPezzi = $(i).children().eq(5).children().eq(0).val();
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

		if(found >= 1){

			// aggiorno la riga
			$.fn.aggiornaRigaArticolo(articoliTable,currentRowIndex,currentQuantita,currentPezzi,currentLotto,currentScadenza,currentPrezzo,null,currentSconto,
				quantita,pezzi,codiceFornitore,lottoRegExp,dataScadenzaRegExp,totale,null);

		} else {
			// inserisco nuova riga
			$.fn.inserisciRigaArticolo(articoliTable,null,articoloId,articolo,
				lottoHtml,scadenzaHtml,udm,quantitaHtml,pezziHtml,prezzoHtml,scontoHtml,totale,iva,null,scadenzaGiorniAllarme);
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

	$(document).on('click','.deleteDdtArticolo', function(){
		var idArticolo = $(this).attr('data-id');
		var idDdt = $('#hiddenIdDdt').attr('value');

		$('#ddtArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#ddtArticoliTable').focus();

		$.fn.computeTotale();

		$.fn.checkPezziOrdinatiAfterArticoloDelete(idArticolo, idDdt);

		$.fn.checkProdottiScadenza();
	});

	$(document).on('change','.autistaDdt', function(){
		var idAutista = $(this).val();
		var ddtId = $(this).attr("data-id");

		var ddtPatched = {};
		ddtPatched.id = parseInt(ddtId);
		if(idAutista != null && idAutista !== ''){
			ddtPatched.idAutista = parseInt(idAutista);
		} else {
			ddtPatched.idAutista = null;
		}

		var ddtPatchedJson = JSON.stringify(ddtPatched);

		var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "ddts/" + ddtId,
			type: 'PATCH',
			contentType: "application/json",
			dataType: 'json',
			data: ddtPatchedJson,
			success: function() {
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Autista modificato con successo').replace('@@alertResult@@', 'success'));
				$('#ddtTable').DataTable().ajax.reload();
			},
			error: function() {
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell autista').replace('@@alertResult@@', 'danger'));
				$('#ddtTable').DataTable().ajax.reload();
			}
		});

	});

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

		var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertDdt').empty();

		$.fn.emptyArticoli();

		var clienteField = $('#cliente option:selected');
		var cliente = clienteField.val();

		if(cliente !== ''){
			var idListino = clienteField.attr('data-id-listino');
			var hasNoteDocumenti = clienteField.attr('data-has-note-documenti');

			$.ajax({
				url: baseUrl + "clienti/"+cliente+"/punti-consegna",
				type: 'GET',
				async: true,
				dataType: 'json',
				success: function(result) {
					if(result != null && result !== ''){
						$('#puntoConsegna').empty();
						$.each(result, function(i, item){
							var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+' ('+item.provincia+')';
							$('#puntoConsegna').append('<option value="'+item.id+'">'+label+'</option>');
						});
					} else {
						$('#puntoConsegna').empty();
					}
					$('#puntoConsegna').removeAttr('disabled');


					$.when($.fn.getArticoli(cliente, idListino)).then(function(f1){
						// load Sconti associated to the Cliente
						var data = $('#data').val();
						if(data != null && data !== ''){
							$.fn.loadScontiArticoli(data, cliente);
						}
					});

					$.fn.loadArticoliFromOrdiniClienti();
				},
				error: function() {
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
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

		//var totale = Number(Math.round(((quantita * prezzo) - sconto) + 'e2') + 'e-2');
		$.row.children().eq(8).text(totale);

		$.fn.computeTotale();
	});

	$(document).on('change','#data', function(){
		var data = $('#data').val();
		var annoContabile = $('#annoContabile').val();

		var anno = moment(data, 'YYYY-MM-DD').year()

		if(anno !== parseInt(annoContabile)){
			$('#annoContabile').val(anno);
			$('#progressivo').val(null);
		}
	});

	$(document).on('change','#articolo', function(){
		var articoloField = $('#articolo option:selected');
		var articolo = articoloField.val();
		if(articolo != null && articolo !== ''){
			var udm = articoloField.attr('data-udm');
			var iva = articoloField.attr('data-iva');
			var quantita = articoloField.attr('data-qta');
			var prezzoBase = articoloField.attr('data-prezzo-base');
			var prezzoListino = articoloField.attr('data-prezzo-listino');
			var prezzo;
			if(prezzoListino != null && prezzoListino !== ''){
				prezzo = prezzoListino;
			} else {
				prezzo = prezzoBase;
			}
			var sconto = articoloField.attr('data-sconto');

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

	$(document).on('change','.scadenza', function(){
		$.fn.checkProdottiScadenza();
	});

    $.fn.createUrlSearch = function(path){

		var dataDa = $('#searchDataFrom').val();
		var dataA = $('#searchDataTo').val();
		var progressivo = $('#searchProgressivo').val();
		var importo = $('#searchImporto').val();
		var tipoPagamento = $('#searchTipoPagamento option:selected').val();
		var cliente = $('#searchCliente').val();
		var agente = $('#searchAgente option:selected').val();
		var autista = $('#searchAutista option:selected').val();
		var articolo = $('#searchArticolo option:selected').val();
		var stato = $('#searchStato option:selected').val();

		var params = {};
		if(dataDa != null && dataDa !== ''){
			params.dataDa = dataDa;
		}
		if(dataA != null && dataA !== ''){
			params.dataA = dataA;
		}
		if(progressivo != null && progressivo !== ''){
			params.progressivo = progressivo;
		}
		if(importo != null && importo !== ''){
			params.importo = importo;
		}
		if(tipoPagamento != null && tipoPagamento !== ''){
			params.tipoPagamento = tipoPagamento;
		}
		if(cliente != null && cliente !== ''){
			params.cliente = cliente;
		}
		if(agente != null && agente !== ''){
			params.agente = agente;
		}
		if(autista != null && autista !== ''){
			params.autista = autista;
		}
		if(articolo != null && articolo !== ''){
			params.articolo = articolo;
		}
		if(stato != null && stato !== ''){
			params.stato = stato;
		}
		return baseUrl + path + $.param( params );
	}

	if($('#searchDdtButton') != null && $('#searchDdtButton') !== undefined) {
		$(document).on('submit', '#searchDdtForm', function (event) {
			event.preventDefault();

			var url = $.fn.createUrlSearch("ddts/search?");

			$('#ddtTable').DataTable().destroy();
			$.fn.loadDdtTable(url);
		});
	}

	$.fn.createDdt = function(print){

		var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var dataTrasporto = $('#dataTrasporto').val();
		if(!dataTrasporto){
			$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Inserire una data di trasporto").replace('@@alertResult@@', 'danger'));
			return false;
		}

		var validDataTrasporto = $.fn.validateDataTrasporto();
		if(!validDataTrasporto){
			$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "'Data trasporto' non può essere precedente alla data del DDT").replace('@@alertResult@@', 'danger'));
			return false;
		}
		var validCliente = $('#cliente option:selected').val();
		if(!validCliente){
			$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Selezionare un cliente").replace('@@alertResult@@', 'danger'));
			return false;
		}
		var validData = $('#data').val();
		if(!validData){
			$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Inserire una data").replace('@@alertResult@@', 'danger'));
			return false;
		}

		var numColli = $('#colli').val();
		if(!numColli){
			$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Inserire un numero colli").replace('@@alertResult@@', 'danger'));
			return false;
		}

		var oraTrasporto = $('#oraTrasporto').val();
		if(!oraTrasporto){
			$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Inserire un'ora di trasporto").replace('@@alertResult@@', 'danger'));
			return false;
		}

		var ddt = {};
		ddt.progressivo = $('#progressivo').val();
		ddt.annoContabile = $('#annoContabile').val();
		ddt.data = validData;

		var cliente = {};
		cliente.id = validCliente;
		ddt.cliente = cliente;

		var puntoConsegna = {};
		puntoConsegna.id = $('#puntoConsegna option:selected').val();
		ddt.puntoConsegna = puntoConsegna;

		var causale = {};
		causale.id = $('#causale option:selected').val();
		ddt.causale = causale;

		var autistaId = $('#autista option:selected').val();
		if(autistaId != null && autistaId !== ''){
			var autista = {};
			autista.id = autistaId;
			ddt.autista = autista;
		}

		var articoliTable = $('#ddtArticoliTable').DataTable();

		var ddtArticoliLength = articoliTable.rows().nodes().length;
		if(ddtArticoliLength != null && ddtArticoliLength !== 0){
			var ddtArticoli = [];
			articoliTable.rows().nodes().each(function(i){
				var articoloId = $(i).attr('data-id');

				var ddtArticolo = {};
				var ddtArticoloId = {};
				ddtArticoloId.articoloId = articoloId;
				ddtArticolo.id = ddtArticoloId;

				ddtArticolo.lotto = $(i).children().eq(1).children().eq(0).val();
				ddtArticolo.scadenza = $(i).children().eq(2).children().eq(0).val();
				ddtArticolo.quantita = $(i).children().eq(4).children().eq(0).val();
				ddtArticolo.numeroPezzi = $(i).children().eq(5).children().eq(0).val();
				ddtArticolo.prezzo = $(i).children().eq(6).children().eq(0).val();
				ddtArticolo.sconto = $(i).children().eq(7).children().eq(0).val();

				ddtArticoli.push(ddtArticolo);
			});
			ddt.ddtArticoli = ddtArticoli;
		}
		ddt.fatturato = false;
		ddt.numeroColli = numColli;
		ddt.tipoTrasporto = $('#tipoTrasporto option:selected').val();
		ddt.dataTrasporto = dataTrasporto;

		var regex = /:/g;
		if(oraTrasporto !== ''){
			var count = oraTrasporto.match(regex);
			count = (count) ? count.length : 0;
			if(count === 1){
				ddt.oraTrasporto = oraTrasporto + ':00';
			} else {
				ddt.oraTrasporto = oraTrasporto;
			}
		}
		var trasportatoreId = $('#trasportatore option:selected').val();
		if(trasportatoreId != null && trasportatoreId !== ''){
			var trasportatore = {};
			trasportatore.id = trasportatoreId;
			ddt.trasportatore = trasportatore;
		}
		ddt.note = $('#note').val();
		ddt.scannerLog = $('#scannerLog').val();

		var ddtJson = JSON.stringify(ddt);

		$.ajax({
			url: baseUrl + "ddts",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: ddtJson,
			success: function(result) {

				var idDdt = result.id;

				$('#newDdtButton').attr("disabled", true);
				$('#newAndPrintDdtButton').attr("disabled", true);

				// Update ordini clienti
				var articoliOrdiniClienti = [];
				var ordineClienteArticoliTable = $('#ordiniClientiArticoliTable').DataTable();
				ordineClienteArticoliTable.rows().nodes().each(function(i){
					var idArticolo = $(i).attr('data-id-articolo');
					var idsOrdiniClienti = $(i).attr('data-ids-ordini');
					var idsDdts = $(i).attr('data-ids-ddts');
					var setIdDdt = $(i).attr('data-set-id-ddt');

					if(setIdDdt === 'true'){
						if($.fn.checkVariableIsNull(idsDdts)){
							idsDdts = idDdt + ',';
						} else {
							if(idsDdts.indexOf(idDdt + ',') === -1){
								idsDdts += idDdt + ',';
							}
						}
					}

					var numeroPezziDaEvadere = $(i).attr('data-num-pezzi-evasi');

					var articoloOrdiniClienti = {};
					articoloOrdiniClienti.idArticolo = idArticolo;
					articoloOrdiniClienti.numeroPezziDaEvadere = numeroPezziDaEvadere;
					articoloOrdiniClienti.idsOrdiniClienti = idsOrdiniClienti;
					articoloOrdiniClienti.idsDdts = idsDdts;

					articoliOrdiniClienti.push(articoloOrdiniClienti);
				});

				if(articoliOrdiniClienti.length !== 0){

					$.ajax({
						url: baseUrl + "ordini-clienti/aggregate",
						type: 'POST',
						contentType: "application/json",
						dataType: 'json',
						data: JSON.stringify(articoliOrdiniClienti),
						success: function() {
							$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','DDT creato con successo. Ordini clienti aggiornati con successo.').replace('@@alertResult@@', 'success'));

							if(print){
								w = window.open(baseUrl + "stampe/ddts/"+idDdt, '_blank');
								w.focus();
								w.print();
							}

							setTimeout(function() {
								window.location.href = "ddt-new.html?dt="+ddt.dataTrasporto+"&ot="+oraTrasporto;
							}, 2000);

						},
						error: function() {
							$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "DDT creato con successo. Errore nell aggiornamento degli ordini clienti.").replace('@@alertResult@@', 'warning'));
						}
					});

				} else {
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','DDT creato con successo').replace('@@alertResult@@', 'success'));

					if(print){
						w = window.open(baseUrl + "stampe/ddts/"+idDdt, '_blank');
						w.focus();
						w.print();
					}

					setTimeout(function() {
						window.location.href = "ddt-new.html?dt="+ddt.dataTrasporto+"&ot="+oraTrasporto;
					}, 1000);
				}
			},
			error: function(jqXHR) {
				var errorMessage = 'Errore nella creazione del DDT';
				if(jqXHR != null){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson !== ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage !== '' && jqXHRResponseJsonMessage.indexOf('con progressivo') !== -1){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	}

	if($('#newDdtButton') != null && $('#newDdtButton') !== undefined && $('#newDdtButton').length > 0){

		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('click','#newDdtButton', function(event){
			if(!event.detail || event.detail === 1) {
				event.preventDefault();
				$.fn.createDdt(false);
			}
		});

	}

	if($('#newAndPrintDdtButton') != null && $('#newAndPrintDdtButton') !== undefined && $('#newAndPrintDdtButton').length > 0){
		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('click','#newAndPrintDdtButton', function(event){
			if(!event.detail || event.detail === 1) {
				event.preventDefault();
				$.fn.createDdt(true);
			}
		});
	}

	if($('#updateDdtButton') != null && $('#updateDdtButton') !== undefined && $('#updateDdtButton').length > 0){
		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('click','#updateDdtButton', function(event){
			if(!event.detail || event.detail === 1) {
				event.preventDefault();
				$('#updateDdtModal').modal('show');
			}
		});

		$(document).on('click','#confirmUpdateDdt', function(event){
			if(!event.detail || event.detail === 1) {
				var modificaGiacenze = $("input[name='modificaGiacenze']:checked").val();
				$('#hiddenModificaGiacenze').attr('value', modificaGiacenze);
				$('#updateDdtModal').modal('hide');
				$('#updateDdtForm').submit();
			}
		});

		$(document).on('submit','#updateDdtForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var dataTrasporto = $('#dataTrasporto').val();
			if(!dataTrasporto){
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Inserire una data di trasporto").replace('@@alertResult@@', 'danger'));
				return false;
			}

			var validDataTrasporto = $.fn.validateDataTrasporto();
			if(!validDataTrasporto){
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "'Data trasporto' non può essere precedente alla data del DDT").replace('@@alertResult@@', 'danger'));
				return false;
			}
			var validCliente = $('#cliente option:selected').val();
			if(!validCliente){
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Selezionare un cliente").replace('@@alertResult@@', 'danger'));
				return false;
			}
			var validData = $('#data').val();
			if(!validData){
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Inserire una data").replace('@@alertResult@@', 'danger'));
				return false;
			}

			var numColli = $('#colli').val();
			if(!numColli){
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Inserire un numero colli").replace('@@alertResult@@', 'danger'));
				return false;
			}

			var oraTrasporto = $('#oraTrasporto').val();
			if(!oraTrasporto){
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "Inserire un'ora di trasporto").replace('@@alertResult@@', 'danger'));
				return false;
			}

			var ddt = {};
			ddt.id = $('#hiddenIdDdt').val();
			ddt.progressivo = $('#progressivo').val();
			ddt.annoContabile = $('#annoContabile').val();
			ddt.data = validData;

			var cliente = {};
			cliente.id = validCliente;
			ddt.cliente = cliente;

			var puntoConsegna = {};
			puntoConsegna.id = $('#puntoConsegna option:selected').val();
			ddt.puntoConsegna = puntoConsegna;

			var causale = {};
			causale.id = $('#causale option:selected').val();
			ddt.causale = causale;

			var autistaId = $('#autista option:selected').val();
			if(autistaId != null && autistaId !== ''){
				var autista = {};
				autista.id = autistaId;
				ddt.autista = autista;
			}

			var articoliTable = $('#ddtArticoliTable').DataTable();

			var ddtArticoliLength = articoliTable.rows().nodes().length;
			if(ddtArticoliLength != null && ddtArticoliLength !== 0){
				var ddtArticoli = [];
				articoliTable.rows().nodes().each(function(i){
					var articoloId = $(i).attr('data-id');

					var ddtArticolo = {};
					var ddtArticoloId = {};
					ddtArticoloId.articoloId = articoloId;
					ddtArticolo.id = ddtArticoloId;

					ddtArticolo.lotto = $(i).children().eq(1).children().eq(0).val();
					ddtArticolo.scadenza = $(i).children().eq(2).children().eq(0).val();
					ddtArticolo.quantita = $(i).children().eq(4).children().eq(0).val();
					ddtArticolo.numeroPezzi = $(i).children().eq(5).children().eq(0).val();
					ddtArticolo.prezzo = $(i).children().eq(6).children().eq(0).val();
					ddtArticolo.sconto = $(i).children().eq(7).children().eq(0).val();

					ddtArticoli.push(ddtArticolo);
				});
				ddt.ddtArticoli = ddtArticoli;
			}
			ddt.fatturato = false;
			ddt.consegnato = $('#consegnato').prop('checked') === true;
			ddt.numeroColli = numColli;
			ddt.tipoTrasporto = $('#tipoTrasporto option:selected').val();
			ddt.dataTrasporto = dataTrasporto;

			var regex = /:/g;
			if(oraTrasporto !== ''){
				var count = oraTrasporto.match(regex);
				count = (count) ? count.length : 0;
				if(count === 1){
					ddt.oraTrasporto = oraTrasporto + ':00';
				} else {
					ddt.oraTrasporto = oraTrasporto;
				}
			}
			var trasportatoreId = $('#trasportatore option:selected').val();
			if(trasportatoreId != null && trasportatoreId !== ''){
				var trasportatore = {};
				trasportatore.id = trasportatoreId;
				ddt.trasportatore = trasportatore;
			}
			ddt.note = $('#note').val();
			ddt.scannerLog = $('#scannerLog').val();
			var modificaGiacenze = $('#hiddenModificaGiacenze').val();
			ddt.modificaGiacenze = modificaGiacenze != null && modificaGiacenze !== '' && modificaGiacenze === 'si';

			var ddtJson = JSON.stringify(ddt);

			$.ajax({
				url: baseUrl + "ddts/"+ddt.id,
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ddtJson,
				success: function() {
					var idDdt = ddt.id;

					$('#updateDdtButton').attr("disabled", true);

					// Update ordini clienti
					var articoliOrdiniClienti = [];
					var ordineClienteArticoliTable = $('#ordiniClientiArticoliTable').DataTable();
					ordineClienteArticoliTable.rows().nodes().each(function(i){
						var idArticolo = $(i).attr('data-id-articolo');
						var idsOrdiniClienti = $(i).attr('data-ids-ordini');
						var numeroPezziDaEvadere = $(i).attr('data-num-pezzi-evasi');
						var idsDdts = $(i).attr('data-ids-ddts');
						var setIdDdt = $(i).attr('data-set-id-ddt');

						if(!$.fn.checkVariableIsNull(idsDdts) && setIdDdt === 'true'){
							if($.fn.checkVariableIsNull(idsDdts)){
								idsDdts = idDdt + ',';
							} else {
								if(idsDdts.indexOf(idDdt + ',') === -1){
									idsDdts += idDdt + ',';
								}
							}
						}

						var articoloOrdiniClienti = {};
						articoloOrdiniClienti.idArticolo = idArticolo;
						articoloOrdiniClienti.numeroPezziDaEvadere = numeroPezziDaEvadere;
						articoloOrdiniClienti.idsOrdiniClienti = idsOrdiniClienti;
						articoloOrdiniClienti.idsDdts = idsDdts;

						articoliOrdiniClienti.push(articoloOrdiniClienti);
					});

					if(articoliOrdiniClienti.length !== 0){

						$.ajax({
							url: baseUrl + "ordini-clienti/aggregate",
							type: 'POST',
							contentType: "application/json",
							dataType: 'json',
							data: JSON.stringify(articoliOrdiniClienti),
							success: function() {
								$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','DDT aggiornato con successo. Ordini clienti aggiornati con successo.').replace('@@alertResult@@', 'success'));

								setTimeout(function() {
									window.location.href = "ddt.html";
								}, 1000);

							},
							error: function() {
								$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', "DDT aggiornato con successo. Errore nell aggiornamento degli ordini clienti.").replace('@@alertResult@@', 'warning'));
							}
						});

					} else {
						$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','DDT aggiornato con successo').replace('@@alertResult@@', 'success'));

						$('#updateDdtButton').attr("disabled", true);

						setTimeout(function() {
							window.location.href = "ddt.html";
						}, 1000);
					}

				},
				error: function(jqXHR) {
					var errorMessage = 'Errore nella modifica del DDT';
					if(jqXHR != null){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson !== ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage !== '' && jqXHRResponseJsonMessage.indexOf('con progressivo') !== -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$.fn.loadScontiArticoli = function(data, cliente){
		var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "sconti?idCliente="+cliente+"&data="+moment(data.data).format('YYYY-MM-DD'),
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				$.each(result, function(i, item){
					var articoloId = item.articolo.id;

					let articoloOption = $('#articolo option[value="'+articoloId+'"]');
					if(articoloOption != null){
						$(articoloOption).attr('data-sconto', item.valore);
					}

					/*
					$("#articolo option").each(function(){
						var articoloOptionId = $(this).val();
						if(articoloOptionId === articoloId){
							$(this).attr('data-sconto', valore);
						}
					});
					*/
				});
			},
			error: function() {
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli sconti').replace('@@alertResult@@', 'danger'));
			}
		});
	}

});

$.fn.preloadSearchFields = function(){
	$.ajax({
		url: baseUrl + "tipi-pagamento",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#searchTipoPagamento').append('<option value="'+item.id+'" >'+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "agenti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#searchAgente').append('<option value="'+item.id+'" >'+item.nome+' '+item.cognome+'</option>');
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "autisti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#searchAutista').append('<option value="'+item.id+'" >'+item.cognome+' '+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "articoli?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#searchArticolo').append('<option value="'+item.id+'" >'+item.codice+' '+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "stati-ddt",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#searchStato').append('<option value="'+item.id+'" >'+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.preloadFields = function(dataTrasporto, oraTrasporto){
	$.ajax({
		url: baseUrl + "ddts/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				//$('#progressivo').attr('value', result.progressivo);
				$('#annoContabile').attr('value', result.annoContabile);
				$('#colli').attr('value', 1);
				$('#data').val(moment().format('YYYY-MM-DD'));

				if(dataTrasporto != null && dataTrasporto !== ''){
					$('#dataTrasporto').val(dataTrasporto);
				} else {
					$('#dataTrasporto').val(moment().format('YYYY-MM-DD'));
				}

				if(oraTrasporto != null && oraTrasporto !== ''){
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
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.checkProgressiviDuplicates = function(){

	return	$.ajax({
		url: baseUrl + "ddts/progressivi-duplicates",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				var year= result.anno;
				var progressivi = result.progressivi;

				if(!$.fn.checkVariableIsNull(progressivi)){
					var alertContent = '<div id="alertDdtContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
					alertContent += "<strong>ATTENZIONE progressivi duplicati per l'anno "+year+":</strong>\n" + progressivi + '\n' +
						'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

					$('#alertDdt').empty().append(alertContent);
				}
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getClienti = function(){

	return $.ajax({
		url: baseUrl + "clienti?bloccaDdt=false&privato=false",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
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
					if(agente != null) {
						idAgente = agente.id;
					}
					var listino = item.listino;
					var idListino = '-1';
					if(listino != null){
						idListino = listino.id;
					}
					var hasNoteDocumenti = 0;
					if(!$.fn.checkVariableIsNull(item.noteDocumenti)){
						hasNoteDocumenti = 1;
					}
					$('#cliente').append('<option value="'+item.id+'" data-id-agente="'+idAgente+'" data-id-listino="'+idListino+'" data-nascondi-prezzi='+item.nascondiPrezzi+' data-has-note-documenti='+hasNoteDocumenti+'>'+label+'</option>');
				});
				$('#cliente').selectpicker('refresh');
				console.log("CLIENTI");
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getCausali = function(){

	return $.ajax({
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
			console.log("CAUSALI");
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticoli = function(idCliente, idListino){

	$('#articolo').empty().append('<option value=""></option>');

	$.ajax({
		url: baseUrl + "articoli?attivo=true&idCliente="+idCliente,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					var dataUdm = '';
					var udm = item.unitaMisura;
					if(udm != null){
						dataUdm = udm.etichetta;
					}
					var dataIva = '';
					var iva = item.aliquotaIva;
					if(iva != null){
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

				// load the prices of the Listino associated to the Cliente
				if(idListino != null && idListino !== '-1'){
					$.ajax({
						url: baseUrl + "listini/"+idListino+"/listini-prezzi",
						type: 'GET',
						async: true,
						dataType: 'json',
						success: function(result) {
							$.each(result, function(i, item){
								var articoloId = item.articolo.id;
								var prezzoListino = item.prezzo;
								let articoloOption = $('#articolo option[value="'+articoloId+'"]');
								if(articoloOption != null){
									$(articoloOption).attr('data-prezzo-listino', prezzoListino);
								}
							});
						},
						error: function() {
							var alertContent = '<div id="alertDdtContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
							alertContent += "Errore nel caricamento dei prezzi di listino" +
								'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

							$('#alertDdt').empty().append(alertContent);
						}
					});
				} else {
					$("#articolo option").each(function(){
						$(this).attr('data-prezzo-listino', $(this).attr('data-prezzo-base'));
					});
				}

				$('#articolo').selectpicker('refresh');
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getDdt = function(idDdt){

	let alertContent = '<div id="alertDdtContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent +=  '<strong>Errore nel recupero del DDT</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "ddts/" + idDdt,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){

				$('#hiddenIdDdt').val(result.id);
				$('#progressivo').val(result.progressivo);
				$('#annoContabile').val(result.annoContabile);
				$('#data').val(result.data);
				if(result.cliente != null){

					console.log("DDT");

					var clienteField = $('#cliente option[value="' + result.cliente.id +'"]');
					clienteField.attr('selected', true);

					let idListino = clienteField.attr('data-id-listino');

					$.ajax({
						url: baseUrl + "clienti/"+result.cliente.id+"/punti-consegna",
						type: 'GET',
						async: false,
						dataType: 'json',
						success: function(result2) {
							if(result2 != null && result2 !== ''){
								$.each(result2, function(i, item){
									var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+'('+item.provincia+')';
									var selected = '';
									if(result.puntoConsegna != null){
										if(result.puntoConsegna.id === item.id){
											selected = 'selected';
										}
									}
									$('#puntoConsegna').append('<option value="'+item.id+'" '+selected+'>'+label+'</option>');
								});
							}
							$('#puntoConsegna').removeAttr('disabled');
						},
						error: function() {
							$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
						}
					});

					$.fn.getArticoli(result.cliente.id, idListino);

					$('#cliente').selectpicker('refresh');
				}
				$('#causale option[value="' + result.causale.id +'"]').attr('selected', true);
				if(result.autista != null){
					$('#autista option[value="' + result.autista.id +'"]').attr('selected', true);
				}
				$('#colli').val(result.numeroColli);
				$('#dataTrasporto').val(result.dataTrasporto);
				$('#oraTrasporto').val(result.oraTrasporto);
				$('#tipoTrasporto option[value="' + result.tipoTrasporto +'"]').attr('selected', true);
				if(result.trasportatore != null){
					$('#trasportatore option[value="' + result.trasportatore.id +'"]').attr('selected', true);
				}
				$('#note').val(result.note);

				if(result.consegnato === true){
					$('#consegnato').prop('checked', true);
				}

				if(result.ddtArticoli != null && result.ddtArticoli.length !== 0){

					$.fn.loadDdtArticoliTable();
					let table = $('#ddtArticoliTable').DataTable();

					result.ddtArticoli.forEach(function(item){
						var articolo = item.articolo;
						var articoloId = item.id.articoloId;
						var articoloDesc = articolo.codice+' '+articolo.descrizione;
						var udm = articolo.unitaMisura.etichetta;
						var iva = articolo.aliquotaIva.valore;
						var pezzi = item.numeroPezzi;
						var quantita = item.quantita;
						var prezzo = item.prezzo;
						var sconto = item.sconto;
						var lotto = item.lotto;
						var scadenza = item.scadenza;
						var lottoRegexp = $.fn.getLottoRegExp(item);
						var dataScadenzaRegexp = $.fn.getDataScadenzaRegExp(item);
						var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+articolo.fornitore.codice+'" data-lotto-regexp="'+lottoRegexp+'" data-scadenza-regexp="'+dataScadenzaRegexp+'">';
						if(lotto != null && lotto !== ''){
							lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+articolo.fornitore.codice+'" data-lotto-regexp="'+lottoRegexp+'" data-scadenza-regexp="'+dataScadenzaRegexp+'">';
						}
						var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';
						var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+quantita+'">';
						var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+pezzi+'" data-start-num-pezzi="'+pezzi+'">';
						var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
						var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

						var totale = 0;
						quantita = $.fn.parseValue(quantita, 'float');
						prezzo = $.fn.parseValue(prezzo, 'float');
						sconto = $.fn.parseValue(sconto, 'float');
						var quantitaPerPrezzo = (quantita * prezzo);
						var scontoValue = (sconto/100)*quantitaPerPrezzo;
						totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

						var deleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

						var rowNode = table.row.add( [
							articoloDesc,
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

						$.fn.computeTotale();

						$.fn.checkProdottiScadenza();
					});
				}

				// load Sconti associated to the Cliente
				var data = result.data;
				if(data != null && data !== ''){
					$.fn.loadScontiArticoli(data, result.cliente.id);
				}

				$.fn.loadArticoliFromOrdiniClienti();

			} else{
				$('#alertDdt').empty().append(alertContent);
			}
		},
		error: function(jqXHR) {
			$('#alertDdt').append(alertContent);
			$('#updateDdtButton').attr('disabled', true);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}