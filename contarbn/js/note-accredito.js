var baseUrl = "/contarbn-be/";

$.fn.loadNoteAccreditoTable = function(url) {

	$('#noteAccreditoTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertNoteAccreditoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle Note Accredito</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertNoteAccredito').empty().append(alertContent);
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
			"emptyTable": "Nessuna Nota Accredito disponibile",
			"zeroRecords": "Nessun Nota Accredito disponibile"
		},
		"searching": false,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc'],
			[1, 'desc'],
			[2, 'desc']
		],
		"columns": [
			{"name": "anno", "data": "anno", "width":"5%", "visible": false},
			{"name":"speditoAde", "data": null, "width":"8%", render: function ( data, type, row ) {
				var speditoAde = data.speditoAde;
				var notaAccreditoId = data.id;
				var selectId = "speditoAde_" + notaAccreditoId;

				var speditoAdeSelect = '<select id="'+selectId+'" class="form-control form-control-sm speditoAdeNotaAccredito" data-id="'+notaAccreditoId+'" data-value="'+speditoAde+'">';
				var optionHtml = '<option value="si"';
				if(speditoAde){
					optionHtml += ' selected'
				}
				optionHtml += '>Si</option>';
				speditoAdeSelect += optionHtml;
				optionHtml = '<option value="no"';
				if(!speditoAde){
					optionHtml += ' selected'
				}
				optionHtml += '>No</option>';
				speditoAdeSelect += optionHtml;

				speditoAdeSelect += '</select';
				return speditoAdeSelect;
			}},
			{"name": "numero", "data": "progressivo", "width":"5%"},
			{"name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "cliente", "data": null, "width":"15%", render: function ( data, type, row ) {
				if(data.cliente != null){
					var clienteHtml = '';

					if(data.cliente.dittaIndividuale){
						clienteHtml += data.cliente.cognome + ' ' + data.cliente.nome;
					} else if(data.cliente.privato){
						clienteHtml += data.cliente.cognome + ' ' + data.cliente.nome;
					} else {
						clienteHtml += data.cliente.ragioneSociale;
					}
					return clienteHtml;
				} else {
					return '';
				}
			}},
			{"name": "agente", "data": null, "width":"15%", render: function ( data, type, row ) {
				var cliente = data.cliente;
				if(cliente != null){
					var agente = cliente.agente;
					if(agente != null){
						return agente.nome + ' ' + agente.cognome;
					}
				}
				return '';
			}},
			{"name": "acconto", "data": null, "width":"8%",render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totaleAcconto);
			}},
			{"name": "importo", "data": null, "width":"8%",render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totale);
			}},
			{"data": null, "orderable":false, "width":"12%", render: function ( data, type, row ) {
                var acconto = data.totaleAcconto;
                if(acconto == null || acconto == undefined || acconto == ''){
                    acconto = 0;
                }
                var totale = data.totale;
                if(totale == null || totale == undefined || totale == ''){
                    totale = 0;
                }
                var stato = data.statoNotaAccredito;

				var links = '<a class="detailsNotaAccredito pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
				if(stato != null && stato != undefined && stato != '' && stato.codice == 'DA_PAGARE'){
					links += '<a class="updateNotaAccredito pr-1" data-id="'+data.id+'" href="note-accredito-edit.html?idNotaAccredito=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
				}
				if((totale - acconto) != 0){
					links += '<a class="payNotaAccredito pr-1" data-id="'+data.id+'" href="pagamenti-new.html?idNotaAccredito=' + data.id + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
				}
				links += '<a class="printNotaAccredito pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
				links += '<a class="downloadAdeXml pr-1" data-id="' + data.id + '" href="#" title="Download XML AdE"><i class="fa fa-download"></i></a>';
				var cliente = data.cliente;
                if(cliente != null){
                    var email = cliente.email;
                    if(email != null && email != undefined && email != ""){
                        links += '<a class="emailNotaAccredito pr-1" data-id="'+data.id+'" data-email-to="'+email+'" href="#" title="Invio email"><i class="fa fa-envelope"></i></a>';
                    }
                }
				links += '<a class="deleteNotaAccredito" data-id="' + data.id + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px').addClass('rowNotaAccredito');
			$(row).attr('data-id-nota-accredito', data.id);
			if(data.statoNotaAccredito != null){
				var backgroundColor = '';
				if(data.statoNotaAccredito.codice == 'DA_PAGARE'){
					backgroundColor = '#fcf456';
				} else if(data.statoNotaAccredito.codice == 'PARZIALMENTE_PAGATA'){
					backgroundColor = '#fcc08b';
				} else {
					backgroundColor = 'trasparent';
				}
				$(row).css('background-color', backgroundColor);
			}
			$(cells[5]).css('text-align','right');
			$(cells[6]).css('text-align','right');
			$(cells[7]).css('font-weight','bold').css('text-align','right');
		}
	});
}

$.fn.loadNoteAccreditoTotaliTable = function(){

	$('#notaAccreditoTotaliTable').DataTable({
		"ajax": {
			"url": baseUrl + "aliquote-iva",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertNoteAccreditoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle aliquote iva</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertNoteAccredito').empty().append(alertContent);
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

$.fn.loadNoteAccreditoRigheTable = function(){

	var table = $('#notaAccreditoArticoliTable').DataTable({
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
			{ "width": "25%" },
			{ "width": "12%" },
			{ "width": "10%" },
			{ "width": "5%" },
			{ "width": "8%" },
			{ "width": "8%" },
			{ "width": "8%" },
			{ "width": "8%" },
			{ "width": "8%" },
			{ "width": "5%" }
		],
		"order": [
			//[0, 'asc']
		]
	});

	return table;
}

$(document).ready(function() {

	$.fn.loadNoteAccreditoTable(baseUrl + "note-accredito");

	if(window.location.search.substring(1).indexOf('idNotaAccredito') == -1){
		$.fn.loadNoteAccreditoTotaliTable();

		$.fn.loadNoteAccreditoRigheTable();
	}

	$(document).on('change','.speditoAdeNotaAccredito', function(){
		var originalValue = $(this).attr("data-value");
		if(originalValue == "true"){
			originalValue = "si";
		} else {
			originalValue = "no";
		}
		var notaAccreditoId = $(this).attr("data-id");

		confirmResult = confirm("Sei sicuro di voler aggiornare il flag 'Spedito A.d.E.'?");

		if(confirmResult){
			var speditoAde = $(this).val();
			if(speditoAde == "si"){
				speditoAde = true;
			} else {
				speditoAde = false;
			}

			var notaAccreditoPatched = new Object();
			notaAccreditoPatched.id = parseInt(notaAccreditoId);
			notaAccreditoPatched.speditoAde = speditoAde;

			var notaAccreditoPatchedJson = JSON.stringify(notaAccreditoPatched);

			var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "note-accredito/" + notaAccreditoId,
				type: 'PATCH',
				contentType: "application/json",
				dataType: 'json',
				data: notaAccreditoPatchedJson,
				success: function(result) {
					$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@',"Flag 'Spedito A.d.E.' modificato con successo").replace('@@alertResult@@', 'success'));
					$('#noteAccreditoTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@',"Errore nella modifica del flag 'Spedito A.d.E.'").replace('@@alertResult@@', 'danger'));
					$('#noteAccreditoTable').DataTable().ajax.reload();
				}
			});

		} else {
			$("#speditoAde_" + notaAccreditoId).val(originalValue).prop('selected', true);
		}
	});

	$(document).on('click','#resetSearchNoteAccreditoButton', function(){
		$('#searchNoteAccreditoForm :input').val(null);
		$('#searchNoteAccreditoForm select option[value=""]').attr('selected', true);

		$('#noteAccreditoTable').DataTable().destroy();
		$.fn.loadNoteAccreditoTable(baseUrl + "note-accredito");
	});

	$(document).on('click','.detailsNotaAccredito', function(){
		var idNotaAccredito = $(this).attr('data-id');

		var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della Nota Accredito.</strong></div>';

		$.ajax({
			url: baseUrl + "note-accredito/" + idNotaAccredito,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#numero').text(result.progressivo);
					$('#data').text(moment(result.data).format('DD/MM/YYYY'));
					var cliente = result.cliente;
					if(cliente != null && cliente != undefined && cliente != ''){
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
					$('#totale').text(result.totale);
					$('#totaleAcconto').text(result.totaleAcconto);

					var speditoAde = result.speditoAde;
					if(speditoAde){
						$('#speditoAde').text("Si");
					} else {
						$('#speditoAde').text("No");
					}
					var stato = result.statoNotaAccredito;
					if(stato != null && stato != undefined && stato != ''){
						$('#stato').text(stato.descrizione);
					}
					var causale = result.causale;
					if(causale != null && causale != undefined && causale != ''){
						$('#causale').text(causale.descrizione);
					}
					$('#note').text(result.note);
					$('#riferimento').text(result.tipoRiferimento);
					$('#documentoRiferimento').text(result.documentoRiferimento);
					$('#dataDocumentoRiferimento').text(moment(result.dataDocumentoRiferimento).format('DD/MM/YYYY'));

					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}

					if(result.notaAccreditoRighe != null && result.notaAccreditoRighe != undefined){
						var notaAccreditoRighe = result.notaAccreditoRighe;
						notaAccreditoRighe.sort(function(a, b){
							var a1= a.numRiga, b1= b.numRiga;
							if(a1==b1) return 0;
							return a1> b1? 1: -1;
						});

						$('#detailsNoteAccreditoRigheModalTable').DataTable({
							"data": notaAccreditoRighe,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessuna riga presente",
								"zeroRecords": "Nessuna riga presente"
							},
							"paging": false,
							"searching": false,
							"lengthChange": false,
							"info": false,
							"order": [
								//[0, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "descrizione", "data": "descrizione"},
								{"name": "lotto", "data": "lotto"},
								{"name": "unitaMisura", "data": null, render: function (data, type, row) {
									var result = '';
									if(data.unitaMisura != null){
										result = data.unitaMisura.etichetta;
									}
									return result;
								}},
								{"name": "quantita", "data": "quantita"},
								{"name": "prezzo", "data": "prezzo"},
								{"name": "sconto", "data": "sconto"},
								{"name": "imponibile", "data": "imponibile"},
								{"name": "aliquotaIva", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.aliquotaIva != null) {
										result = data.aliquotaIva.valore;
									}
									return result;
								}}
							]
						});
					}

					if(result.notaAccreditoTotali != null && result.notaAccreditoTotali != undefined){
						$('#detailsNoteAccreditoTotaliModalTable').DataTable({
							"data": result.notaAccreditoTotali,
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

					if(result.notaAccreditoPagamenti != null && result.notaAccreditoPagamenti != undefined){
						$('#detailsNoteAccreditoPagamentiModalTable').DataTable({
							"data": result.notaAccreditoPagamenti,
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
					$('#detailsNoteAccreditoMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsNoteAccreditoMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsNoteAccreditoModal').modal('show');
	});

	$(document).on('click','.closeNoteAccredito', function(){
		$('#detailsNoteAccreditoRigheModalTable').DataTable().destroy();
		$('#detailsNoteAccreditoTotaliModalTable').DataTable().destroy();
		$('#detailsNoteAccreditoPagamentiModalTable').DataTable().destroy();
		$('#detailsNoteAccreditoModal').modal('hide');
	});

	$(document).on('click','.deleteNotaAccredito', function(){
		var idNotaAccredito = $(this).attr('data-id');
		$('#confirmDeleteNoteAccredito').attr('data-id', idNotaAccredito);
		$('#deleteNoteAccreditoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteNoteAccredito', function(){
		$('#deleteNoteAccreditoModal').modal('hide');
		var idNotaAccredito = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "note-accredito/" + idNotaAccredito,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertNoteAccreditoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Nota Accredito</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertNoteAccredito').empty().append(alertContent);

				$('#noteAccreditoTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	$(document).on('click','.printNotaAccredito', function(){
		var idNotaAccredito = $(this).attr('data-id');

		window.open(baseUrl + "stampe/note-accredito/"+idNotaAccredito, '_blank');
	});

	$(document).on('click','#printNoteAccredito', function(event){
		event.preventDefault();

		var url = $.fn.createUrlSearch("stampe/note-accredito?");

		window.open(url, '_blank');

	});

	$(document).on('click','.downloadAdeXml', function(){
		var idNotaAccredito = $(this).attr('data-id');

		window.open(baseUrl + "export-ade/note-accredito/"+idNotaAccredito);
	});

	$.fn.createNotaAccredito = function(print){

		var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var notaAccredito = new Object();
		notaAccredito.progressivo = $('#progressivo').val();
		notaAccredito.anno = $('#anno').val();
		notaAccredito.data = $('#data').val();

		var cliente = new Object();
		cliente.id = $('#cliente option:selected').val();
		notaAccredito.cliente = cliente;

		var causale = new Object();
		causale.id = $('#causale option:selected').val();
		notaAccredito.causale = causale;

		notaAccredito.tipoRiferimento = $('#riferimento option:selected').val();
		notaAccredito.documentoRiferimento = $('#numeroDocumento').val();
		notaAccredito.dataDocumentoRiferimento = $('#dataDocumento').val();
		notaAccredito.note = $('#note').val();

		var notaAccreditoRigheLength = $('.rowArticolo').length;
		if(notaAccreditoRigheLength != null && notaAccreditoRigheLength != undefined && notaAccreditoRigheLength != 0){
			var notaAccreditoRighe = [];
			$('.rowArticolo').each(function(i, item){
				var articoloId = $(this).attr('data-id');

				var notaAccreditoRiga = {};

				var notaAccreditoRigaId = new Object();
				notaAccreditoRiga.id = notaAccreditoRigaId;

				notaAccreditoRiga.descrizione = $(this).children().eq(0).children().eq(0).val();
				notaAccreditoRiga.lotto = $(this).children().eq(1).children().eq(0).val();
				notaAccreditoRiga.scadenza = $(this).children().eq(2).children().eq(0).val();

				var udm = $(this).children().eq(3).children().eq(0).val();
				if(udm != null && udm != ""){
					var unitaMisura = new Object();
					unitaMisura.id = udm;
					notaAccreditoRiga.unitaMisura = unitaMisura;
				}
				notaAccreditoRiga.quantita = $(this).children().eq(4).children().eq(0).val();
				notaAccreditoRiga.prezzo = $(this).children().eq(5).children().eq(0).val();
				notaAccreditoRiga.sconto = $(this).children().eq(6).children().eq(0).val();

				var iva = $(this).children().eq(8).children().eq(0).val();
				if(iva != null && iva != ""){
					var aliquotaIva = new Object();
					aliquotaIva.id = iva;
					notaAccreditoRiga.aliquotaIva = aliquotaIva;
				}

				if(articoloId != null && articoloId != ""){
					var articolo = new Object();
					articolo.id = articoloId;
					notaAccreditoRiga.articolo = articolo;
				}
				notaAccreditoRiga.numRiga = $(this).attr('data-row-index');

				notaAccreditoRighe.push(notaAccreditoRiga);
			});
			notaAccredito.notaAccreditoRighe = notaAccreditoRighe;
		}

		var notaAccreditoTotaliLength = $('.rowTotaliByIva').length;
		if(notaAccreditoTotaliLength != null && notaAccreditoTotaliLength != undefined && notaAccreditoTotaliLength != 0){
			var notaAccreditoTotali = [];
			$('.rowTotaliByIva').each(function(i, item){
				var aliquotaIvaId = $(this).attr('data-id');

				var notaAccreditoTotale = {};
				var notaAccreditoTotaleId = new Object();
				notaAccreditoTotaleId.aliquotaIvaId = aliquotaIvaId;
				notaAccreditoTotale.id = notaAccreditoTotaleId;

				notaAccreditoTotale.totaleIva = $(this).find('td').eq(1).text();
				notaAccreditoTotale.totaleImponibile = $(this).find('td').eq(2).text();

				notaAccreditoTotali.push(notaAccreditoTotale);
			});
			notaAccredito.notaAccreditoTotali = notaAccreditoTotali;
		}

		var notaAccreditoJson = JSON.stringify(notaAccredito);

		$.ajax({
			url: baseUrl + "note-accredito",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: notaAccreditoJson,
			success: function(result) {
				$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@','Nota Accredito creata con successo').replace('@@alertResult@@', 'success'));

				$('#newNotaAccreditoButton').attr("disabled", true);
				$('#newAndPrintNotaAccreditoButton').attr("disabled", true);

				// Returns to the page with the list of Nota Accredito
				setTimeout(function() {
					window.location.href = "note-accredito.html";
				}, 1000);

				if(print){
					window.open(baseUrl + "stampe/note-accredito/"+result.id, '_blank');
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione della Nota Accredito';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	}

    $(document).on('click','.emailNotaAccredito', function(){
        var idNotaAccredito = $(this).attr('data-id');
        var email = $(this).attr('data-email-to');
        $('#confirmSendEmailNotaAccredito').attr('data-id', idNotaAccredito);
        $('#sendEmailNotaAccreditoModalBody').html("La nota accredito verrà inviata a <b>"+email+"</b>. Confermi?");
        $('#sendEmailNotaAccreditoModal').modal('show');
    });

    $(document).on('click','#confirmSendEmailNotaAccredito', function(){
        $('#sendEmailNotaAccreditoModal').modal('hide');
        var idNotaAccredito = $(this).attr('data-id');

        var alertContent = '<div id="alertNoteAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
        alertContent = alertContent + '<strong>@@alertText@@\n' +
            '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

        var url = baseUrl + "emails/note-accredito/" + idNotaAccredito;

        $('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', 'Invio email in corso...').replace('@@alertResult@@', 'warning'));

        $.ajax({
            url: url,
            type: 'GET',
            success: function() {
                $('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', 'Email inviata con successo.').replace('@@alertResult@@', 'success'));
                $('#noteAccreditoTable').DataTable().ajax.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.responseText);
                $('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', "Errore nell'invio dell'email").replace('@@alertResult@@', 'danger'));
            }
        });
    });

    $.fn.createUrlSearch = function(path) {

		var dataDa = $('#searchDataFrom').val();
		var dataA = $('#searchDataTo').val();
		var progressivo = $('#searchProgressivo').val();
		var importo = $('#searchImporto').val();
		var cliente = $('#searchCliente').val();
		var agente = $('#searchAgente option:selected').val();
		var articolo = $('#searchArticolo option:selected').val();
		var stato = $('#searchStato option:selected').val();

		var params = {};
		if(dataDa != null && dataDa != undefined && dataDa != ''){
			params.dataDa = dataDa;
		}
		if(dataA != null && dataA != undefined && dataA != ''){
			params.dataA = dataA;
		}
		if(progressivo != null && progressivo != undefined && progressivo != ''){
			params.progressivo = progressivo;
		}
		if(importo != null && importo != undefined && importo != ''){
			params.importo = importo;
		}
		if(cliente != null && cliente != undefined && cliente != ''){
			params.cliente = cliente;
		}
		if(agente != null && agente != undefined && agente != ''){
			params.agente = agente;
		}
		if(articolo != null && articolo != undefined && articolo != ''){
			params.articolo = articolo;
		}
		if(stato != null && stato != undefined && stato != ''){
			params.stato = stato;
		}
		return baseUrl + path + $.param( params );
	}

	if($('#searchNoteAccreditoButton') != null && $('#searchNoteAccreditoButton') != undefined) {
		$(document).on('submit', '#searchNoteAccreditoForm', function (event) {
			event.preventDefault();

			var url = $.fn.createUrlSearch("note-accredito?");

			$('#noteAccreditoTable').DataTable().destroy();
			$.fn.loadNoteAccreditoTable(url);
		});
	}

	$.fn.validateLotto = function(){
		var validLotto = true;
		// check if all input fields 'lotto' are not empty
		$('.lotto').each(function(i, item){
			var lottoValue = $(this).val();
			if($.fn.checkVariableIsNull(lottoValue)){
				validLotto = false;
				return false;
			}
		});
		return validLotto;
	}

	if($('#newNotaAccreditoButton') != null && $('#newNotaAccreditoButton') != undefined && $('#newNotaAccreditoButton').length > 0){

		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('submit','#newNotaAccreditoForm', function(event){
			event.preventDefault();

			$.fn.createNotaAccredito(false);

		});
	}

	if($('#newAndPrintNotaAccreditoButton') != null && $('#newAndPrintNotaAccreditoButton') != undefined && $('#newAndPrintNotaAccreditoButton').length > 0){
		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('click','#newAndPrintNotaAccreditoButton', function(event){
			event.preventDefault();

			$.fn.createNotaAccredito(true);
		});
	}

	if($('#updateNotaAccreditoButton') != null && $('#updateNotaAccreditoButton') != undefined && $('#updateNotaAccreditoButton').length > 0){
		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('submit','#updateNotaAccreditoForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';


			var notaAccredito = new Object();
			notaAccredito.id = $('#hiddenIdNotaAccredito').val();
			notaAccredito.progressivo = $('#progressivo').val();
			notaAccredito.anno = $('#anno').val();
			notaAccredito.data = $('#data').val();

			var cliente = new Object();
			cliente.id = $('#cliente option:selected').val();
			notaAccredito.cliente = cliente;

			var causale = new Object();
			causale.id = $('#causale option:selected').val();
			notaAccredito.causale = causale;

			notaAccredito.tipoRiferimento = $('#riferimento option:selected').val();
			notaAccredito.documentoRiferimento = $('#numeroDocumento').val();
			notaAccredito.dataDocumentoRiferimento = $('#dataDocumento').val();
			notaAccredito.note = $('#note').val();

			var notaAccreditoRigheLength = $('.rowArticolo').length;
			if(notaAccreditoRigheLength != null && notaAccreditoRigheLength != undefined && notaAccreditoRigheLength != 0){
				var notaAccreditoRighe = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var notaAccreditoRiga = {};

					var notaAccreditoRigaId = new Object();
					notaAccreditoRiga.id = notaAccreditoRigaId;

					notaAccreditoRiga.descrizione = $(this).children().eq(0).children().eq(0).val();
					notaAccreditoRiga.lotto = $(this).children().eq(1).children().eq(0).val();
					notaAccreditoRiga.scadenza = $(this).children().eq(2).children().eq(0).val();

					var udm = $(this).children().eq(3).children().eq(0).val();
					if(udm != null && udm != ""){
						var unitaMisura = new Object();
						unitaMisura.id = udm;
						notaAccreditoRiga.unitaMisura = unitaMisura;
					}
					notaAccreditoRiga.quantita = $(this).children().eq(4).children().eq(0).val();
					notaAccreditoRiga.prezzo = $(this).children().eq(5).children().eq(0).val();
					notaAccreditoRiga.sconto = $(this).children().eq(6).children().eq(0).val();

					var iva = $(this).children().eq(8).children().eq(0).val();
					if(iva != null && iva != ""){
						var aliquotaIva = new Object();
						aliquotaIva.id = iva;
						notaAccreditoRiga.aliquotaIva = aliquotaIva;
					}

					if(articoloId != null && articoloId != ""){
						var articolo = new Object();
						articolo.id = articoloId;
						notaAccreditoRiga.articolo = articolo;
					}
					notaAccreditoRiga.numRiga = $(this).attr('data-row-index');

					notaAccreditoRighe.push(notaAccreditoRiga);
				});
				notaAccredito.notaAccreditoRighe = notaAccreditoRighe;
			}

			var notaAccreditoTotaliLength = $('.rowTotaliByIva').length;
			if(notaAccreditoTotaliLength != null && notaAccreditoTotaliLength != undefined && notaAccreditoTotaliLength != 0){
				var notaAccreditoTotali = [];
				$('.rowTotaliByIva').each(function(i, item){
					var aliquotaIvaId = $(this).attr('data-id');

					var notaAccreditoTotale = {};
					var notaAccreditoTotaleId = new Object();
					notaAccreditoTotaleId.aliquotaIvaId = aliquotaIvaId;
					notaAccreditoTotale.id = notaAccreditoTotaleId;

					notaAccreditoTotale.totaleIva = $(this).find('td').eq(1).text();
					notaAccreditoTotale.totaleImponibile = $(this).find('td').eq(2).text();

					notaAccreditoTotali.push(notaAccreditoTotale);
				});
				notaAccredito.notaAccreditoTotali = notaAccreditoTotali;
			}

			var notaAccreditoJson = JSON.stringify(notaAccredito);

			$.ajax({
				url: baseUrl + "note-accredito/"+notaAccredito.id,
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: notaAccreditoJson,
				success: function(result) {
					$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@','Nota Accredito aggiornata con successo').replace('@@alertResult@@', 'success'));

					$('#updateNotaAccreditoButton').attr("disabled", true);

					// Returns to the page with the list of Nota Accredito
					setTimeout(function() {
						window.location.href = "note-accredito.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica della Nota Accredito';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('change','#inserimento', function(){
		var inserimento = $(this).val();
		if(inserimento == 'manuale'){
			$('#articoloDiv').addClass("d-none");
			$('#articoloManualeDiv').removeClass("d-none");
		} else {
			$('#articoloDiv').removeClass("d-none");
			$('#articoloManualeDiv').addClass("d-none");
		}
	});

	$(document).on('change','#cliente', function(){
		$('#articolo option[value=""]').prop('selected', true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertNoteAccredito').empty();

		var cliente = $('#cliente option:selected').val();
		var idListino = $('#cliente option:selected').attr('data-id-listino');
		var hasNoteDocumenti = $('#cliente option:selected').attr('data-has-note-documenti');
		if(cliente != null && cliente != ''){

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
						$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento dei prezzi di listino').replace('@@alertResult@@', 'danger'));
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

			$.fn.handleClienteNoteDocumenti(hasNoteDocumenti);

			$('#articolo').removeAttr('disabled');
			$('#articolo').selectpicker('refresh');
		} else {
			$('#updateClienteNoteDocumenti').attr('hidden', true);
			$('#articolo').attr('disabled', true);
			$('#articolo').selectpicker('refresh');
		}
	});

	$(document).on('change','#data', function(){
		var data = $(this).val();
		var cliente = $('#cliente option:selected').val();
		if(data != null && data != undefined && data != '' && cliente != null && cliente != undefined && cliente != ''){
			$.fn.loadScontiArticoli(data, cliente);
		}
	});

	$.fn.loadScontiArticoli = function(data, cliente){
		var alertContent = '<div id="alertNoteAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

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
				$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli sconti').replace('@@alertResult@@', 'danger'));
			}
		});
	}

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

			$('#udm option[value="' + udm +'"]').prop('selected', true);
			$('#iva option[value="' + iva +'"]').prop('selected', true);

			$('#lotto').val('');
			$('#scadenza').val('');
			$('#quantita').val(quantita);
			$('#prezzo').val(prezzo);
			$('#sconto').val(sconto);
		} else {
			('#udm option[value=""]').prop('selected', true);
			('#iva option[value=""]').prop('selected', true);
			$('#lotto').val('');
			$('#scadenza').val('');
			$('#quantita').val('');
			$('#prezzo').val('');
			$('#sconto').val('');
		}
	});

	$(document).on('click','#addArticolo', function(event){
		event.preventDefault();

		var articoloId = $('#articolo option:selected').val();

		$('#addNotaAccreditoArticoloAlert').empty();

		var inserimento = $('#inserimento option:selected').val();
		var articolo = '';
		if(inserimento == 'manuale'){
			articolo = $('#articoloManuale').val();
		} else {
			articolo = $('#articolo option:selected').text();
		}
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#scadenza').val();
		var quantita = $('#quantita').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#iva').val();
		var codiceFornitore = $('#articolo option:selected').attr("data-codice-fornitore");

		if(lotto != null && lotto != undefined && lotto != ''){
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'">';
		} else {
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'">';
		}
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';
		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+ $.fn.fixDecimalPlaces(quantita,3)+'">';
		var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+sconto+'">';

		var udmHtml = '<select class="form-control form-control-sm ">\n' +
			'                    <option value=""></option>';
		var udmValues = $('#_udm').data("udmValues");
		if(udmValues != null){
			udmValues.forEach(function(item, i){
				udmHtml += '<option value="'+item.id+'"';
				if(udm != null && udm != ""){
					if(udm == item.id){
						udmHtml += ' selected';
					}
				}
				udmHtml += '>'+item.etichetta+'</option>';
			});
		}
		udmHtml += '</select>';

		var ivaHtml = '<select class="form-control form-control-sm compute-totale">';
		var ivaValues = $('#_iva').data("ivaValues");
		if(ivaValues != null){
			ivaValues.forEach(function(item, i){
				ivaHtml += '<option value="'+item.id+'"';
				if(iva != null && iva != ""){
					if(iva == item.id){
						ivaHtml += ' selected';
					}
				}
				ivaHtml += '>'+item.valore+'</option>';
			});
		}
		ivaHtml += '</select>';

		var descrizioneHtml = '<textarea rows="1" style="width: 100%">'+articolo+'</textarea>';

		var totale = 0;
		quantita = $.fn.parseValue(quantita, 'float');
		prezzo = $.fn.parseValue(prezzo, 'float');
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var table = $('#notaAccreditoArticoliTable').DataTable();

		var rowsCount = $.fn.getMaxRowsCountArticoliTable();

		var deleteLink = '<a class="deleteNotaAccreditoArticolo" data-row-index="'+(parseInt(rowsCount) + 1)+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

		var rowNode = table.row.add( [
			descrizioneHtml,
			lottoHtml,
			scadenzaHtml,
			udmHtml,
			quantitaHtml,
			prezzoHtml,
			scontoHtml,
			totale,
			ivaHtml,
			deleteLink
		] ).draw( false ).node();
		$(rowNode).css('text-align', 'center');
		$(rowNode).addClass('rowArticolo');
		$(rowNode).attr('data-id', articoloId);
		$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);

		$.fn.computeTotale();

		$('#articolo option[value=""]').prop('selected',true);
		$('#articoloManuale').val('')
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		$('#articolo').focus();
		$('#articolo').selectpicker('refresh');
	});

	$(document).on('click','.deleteNotaAccreditoArticolo', function(){
		$('#notaAccreditoArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#notaAccreditoArticoliTable').focus();

		$.fn.computeTotale();
	});

	$(document).on('change','.compute-totale', function(){
		$.row = $(this).parent().parent();
		var quantita = $.row.children().eq(4).children().eq(0).val();
		quantita = $.fn.parseValue(quantita, 'float');
		var prezzo = $.row.children().eq(5).children().eq(0).val();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $.row.children().eq(6).children().eq(0).val();
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		var totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		//var totale = Number(Math.round(((quantita * prezzo) - sconto) + 'e2') + 'e-2');
		$.row.children().eq(7).text(totale);

		$.fn.computeTotale();
	});

});

$.fn.preloadSearchFields = function(){

	$.ajax({
		url: baseUrl + "agenti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchAgente').append('<option value="'+item.id+'" >'+item.nome+' '+item.cognome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	/*
	$.ajax({
		url: baseUrl + "articoli?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchArticolo').append('<option value="'+item.id+'" >'+item.codice+' '+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
	*/

	$.ajax({
		url: baseUrl + "stati-note-accredito",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchStato').append('<option value="'+item.id+'" >'+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

}

$.fn.preloadFields = function(){
	$.ajax({
		url: baseUrl + "note-accredito/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				//$('#progressivo').attr('value', result.progressivo);
				$('#anno').attr('value', result.anno);
				$('#data').val(moment().format('YYYY-MM-DD'));

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

	//return $.Deferred(function() {

		return $.ajax({
			url: baseUrl + "clienti?bloccaDdt=false",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var label = '';
						if(item.dittaIndividuale){
							label += item.cognome + ' ' + item.nome;
						} else if(item.privato){
							label += item.cognome + ' ' + item.nome;
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
					$('#log').append('Clienti caricati\n');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	//});
}

$.fn.getCausali = function(){

	return $.ajax({
		url: baseUrl + "causali",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					if(item != null && item != ''){
						if(item.predefinito === true){
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


$.fn.getArticoli = function(){

	//return $.Deferred(function() {

		return $.ajax({
			url: baseUrl + "articoli?attivo=true",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var dataUdm = '';
						var udm = item.unitaMisura;
						if(udm != null && udm != undefined){
							dataUdm = udm.id;
						}
						var dataIva = '';
						var iva = item.aliquotaIva;
						if(iva != null && iva != undefined){
							dataIva = iva.id;
						}
						var dataQta = item.quantitaPredefinita;
						var dataPrezzoBase = item.prezzoListinoBase;
						$('#articolo').append('<option value="'+item.id+'" data-udm="'+dataUdm+'" data-iva="'+dataIva+'" data-qta="'+dataQta+'" data-prezzo-base="'+dataPrezzoBase+'" data-codice-fornitore="'+item.fornitore.codice+'">'+item.codice+' '+item.descrizione+'</option>');

						$('#articolo').selectpicker('refresh');

					});
				}
				$('#log').append('Articoli caricati\n');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.getUnitaMisura = function(){

	//return $.Deferred(function() {

		return $.ajax({
			url: baseUrl + "unita-misura",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					var udm = [];
					$.each(result, function(i, item){
						$('#udm').append('<option value="'+item.id+'">'+item.etichetta+'</option>');

						udm.push(item);
					});
					$('#_udm').data("udmValues", udm);
					$('#log').append('Unita di misura caricate\n');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	//});
}

$.fn.getAliquoteIva = function(){

	//return $.Deferred(function() {

		return $.ajax({
			url: baseUrl + "aliquote-iva",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				var iva = [];
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						$('#iva').append('<option value="'+item.id+'">'+item.valore+'</option>');

						iva.push(item);
					});
					$('#_iva').data("ivaValues", iva);

					$('#log').append('Aliquote iva caricate\n');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	//});
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

$.fn.getNotaAccredito = function(idNotaAccredito){

	var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della Nota Accredito</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "note-accredito/" + idNotaAccredito,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdNotaAccredito').attr('value', result.id);
				$('#progressivo').attr('value', result.progressivo);
				$('#anno').attr('value', result.anno);
				$('#data').attr('value', result.data);
				if(result.cliente != null && result.cliente != undefined){
					$('#cliente option[value="' + result.cliente.id +'"]').attr('selected', true);

					$('#cliente').selectpicker('refresh');

					$('#log').append('Preseleziona cliente\n');
				}

				$('#tipoRiferimento option[value="' + result.tipoRiferimento +'"]').attr('selected', true);
				$('#numeroDocumento').val(result.documentoRiferimento);
				$('#dataDocumento').val(result.dataDocumentoRiferimento);
				if(result.causale != null && result.causale != undefined){
					$('#causale option:selected').attr('selected', false);
					$('#causale option[value="' + result.causale.id +'"]').attr('selected', true);
				}
				$('#note').val(result.note);

				if(result.notaAccreditoRighe != null && result.notaAccreditoRighe != undefined && result.notaAccreditoRighe.length != 0){

					var table = $('#notaAccreditoArticoliTable').DataTable();
					if(table != null){
						table.destroy();
						table = $.fn.loadNoteAccreditoRigheTable();
					}

					var notaAccreditoRighe = result.notaAccreditoRighe;
					notaAccreditoRighe.sort(function(a, b){
						var a1= a.numRiga, b1= b.numRiga;
						if(a1==b1) return 0;
						return a1> b1? 1: -1;
					});

					notaAccreditoRighe.forEach(function(item, i){
						var articolo = item.articolo;
						var articoloId;
						var codiceFornitore;
						if(articolo != null && articolo != ''){
							articoloId = item.id.articoloId;
							codiceFornitore = articolo.fornitore.codice;
						}
						var descrizione = item.descrizione;

						var udm;
						var unitaMisura = item.unitaMisura;
						if(unitaMisura != null && unitaMisura != ''){
							udm = unitaMisura.id;
						}
						var iva;
						var aliquotaIva = item.aliquotaIva;
						if(aliquotaIva != null && aliquotaIva != ''){
							iva = aliquotaIva.id;
						}

						var quantita = item.quantita;
						var prezzo = item.prezzo;
						var sconto = item.sconto;
						var lotto = item.lotto;
						var scadenza = item.scadenza;

						if(lotto != null && lotto != undefined && lotto != ''){
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'">';
						} else {
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'">';
						}
						var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';
						var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+ $.fn.fixDecimalPlaces(quantita,3)+'">';
						var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+prezzo+'">';
						var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+sconto+'">';

						var udmHtml = '<select class="form-control form-control-sm ">\n' +
							'                    <option value=""></option>';
						var udmValues = $('#_udm').data("udmValues");
						if(udmValues != null){
							udmValues.forEach(function(item, i){
								udmHtml += '<option value="'+item.id+'"';
								if(udm != null && udm != ""){
									if(udm == item.id){
										udmHtml += ' selected';
									}
								}
								udmHtml += '>'+item.etichetta+'</option>';
							});
						}
						udmHtml += '</select>';

						var ivaHtml = '<select class="form-control form-control-sm compute-totale">';
						var ivaValues = $('#_iva').data("ivaValues");
						if(ivaValues != null){
							ivaValues.forEach(function(item, i){
								ivaHtml += '<option value="'+item.id+'"';
								if(iva != null && iva != ""){
									if(iva == item.id){
										ivaHtml += ' selected';
									}
								}
								ivaHtml += '>'+item.valore+'</option>';
							});
						}
						ivaHtml += '</select>';

						var descrizioneHtml = '<textarea rows="1" style="width: 100%">'+descrizione+'</textarea>';

						var totale = 0;
						quantita = $.fn.parseValue(quantita, 'float');
						prezzo = $.fn.parseValue(prezzo, 'float');
						sconto = $.fn.parseValue(sconto, 'float');

						var quantitaPerPrezzo = (quantita * prezzo);
						var scontoValue = (sconto/100)*quantitaPerPrezzo;
						totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

						var rowsCount = $.fn.getMaxRowsCountArticoliTable();

						var deleteLink = '<a class="deleteNotaAccreditoArticolo" data-row-index="'+(parseInt(rowsCount) + 1)+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

						var rowNode = table.row.add( [
							descrizioneHtml,
							lottoHtml,
							scadenzaHtml,
							udmHtml,
							quantitaHtml,
							prezzoHtml,
							scontoHtml,
							totale,
							ivaHtml,
							deleteLink
						] ).draw( false ).node();
						$(rowNode).css('text-align', 'center');
						$(rowNode).addClass('rowArticolo');
						$(rowNode).attr('data-id', articoloId);
						$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);

						$.fn.computeTotale();
					});

					if(result.notaAccreditoTotali != null && result.notaAccreditoTotali != undefined && result.notaAccreditoTotali.length != 0){

						var notaAccreditoTotaliTable = $('#notaAccreditoTotaliTable').DataTable();
						if(notaAccreditoTotaliTable != null){
							notaAccreditoTotaliTable.destroy();
						}

						$('#notaAccreditoTotaliTable').DataTable({
							"data": result.notaAccreditoTotali,
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
									var iva = '';
									var aliquotaIva = data.aliquotaIva;
									if(aliquotaIva != null && aliquotaIva != ''){
										iva = aliquotaIva.valore;
									}
									return iva;
								}},
								{"name": "totaleIva", "data": null, "width":"8%", render: function ( data, type, row ) {
									return data.totaleIva;
								}},
								{"name": "totaleImponibile", "data": null, "width":"8%", render: function ( data, type, row ) {
									return data.totaleImponibile;
								}}
							],
							"createdRow": function(row, data, dataIndex,cells){
								var aliquotaIva = data.aliquotaIva;
								var ivaId;
								var ivaValore;
								if(aliquotaIva != null && aliquotaIva != ''){
									ivaId = aliquotaIva.id;
									ivaValore = aliquotaIva.valore;
								}
								$(row).attr('data-id', ivaId);
								$(row).attr('data-valore', ivaValore);
								$(row).addClass('rowTotaliByIva');
								$(cells[0]).css('text-align','center');
								$(cells[1]).css('text-align','center');
								$(cells[2]).css('text-align','center');
							}
						});

					}

					$('#log').append('Nota accredito caricata\n');

				}
			} else{
				$('#alertNoteAccredito').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertNoteAccredito').append(alertContent);
			$('#updateNotaAccreditoButton').attr('disabled', true);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

}

$.fn.parseValue = function(value, resultType){
	if(value != null && value != undefined && value != ''){
		if(resultType == 'float'){
			return parseFloat(value);
		} else if(resultType == 'int'){
			return parseInt(value);
		} else {
			return value;
		}
	} else {
		if(resultType == 'float'){
			return 0.0;
		} else {
			return 0;
		}
	}
}

$.fn.formatNumber = function(value){
	return parseFloat(Number(Math.round(value+'e2')+'e-2')).toFixed(2);
}

$.fn.getMaxRowsCountArticoliTable = function(){
	var maxRowsCount = 0;
	var rowIndexes = [];
	$('#notaAccreditoArticoliTable tbody tr').each(function(i, item){
		rowIndexes.push($.fn.parseValue($(this).attr('data-row-index'), 'int'));
	});

	if (Array.isArray(rowIndexes) && rowIndexes.length > 0){
		maxRowsCount= Math.max.apply(null, rowIndexes);
	}

	return maxRowsCount;
}

$.fn.emptyTotaliTable = function(){
	$('#notaAccreditoTotaliTable tbody tr').each(function(i, item){
		$(this).find('td').eq(1).text('');
		$(this).find('td').eq(2).text('');
	});
}

$.fn.computeTotale = function() {
	var ivaMap = new Map();
	var totaleDocumento = 0;

	$.fn.emptyTotaliTable();

	$('.rowArticolo').each(function(i, item){
		var totale = $(this).children().eq(7).text();
		totale = $.fn.parseValue(totale, 'float');
		var iva = $(this).children().eq(8).children().eq(0).find('option:selected').text();
		iva = $.fn.parseValue(iva, 'int');

		var totaliIva;
		if(ivaMap.has(iva)){
			totaliIva = ivaMap.get(iva);
		} else {
			totaliIva = [];
		}
		totaliIva.push(totale);
		ivaMap.set(iva, totaliIva);

	});
	ivaMap.forEach( (value, key, map) => {
		var totalePerIva = value.reduce((a, b) => a + b, 0);
		var totaleConIva = totalePerIva + (totalePerIva * key/100);

		totaleDocumento += totaleConIva;

		// populating the table with iva and imponibile
		$('tr[data-valore='+key+']').find('td').eq(1).text($.fn.formatNumber((totalePerIva * key/100)));
		$('tr[data-valore='+key+']').find('td').eq(2).text($.fn.formatNumber(totalePerIva));
	});

	if(totaleDocumento != null && totaleDocumento != undefined && totaleDocumento != ""){
		totaleDocumento = parseFloat(totaleDocumento);
	}
	$('#totale').val(Number(Math.round(totaleDocumento+'e2')+'e-2'));

}

$.fn.checkVariableIsNull = function(variable){
	if(variable == null || variable == undefined || variable == ''){
		return true;
	}
	return false;
}

$.fn.normalizeIfEmptyOrNullVariable = function(variable){
	if(variable != null && variable != undefined && variable != ''){
		return variable;
	}
	if(variable == null || variable == undefined){
		return '';
	}
	return '';
}

$.fn.fixDecimalPlaces = function(quantita, decimalPlaces){
	var quantitaFixed = quantita;

	if(quantita != null && quantita != ''){
		if(typeof quantita != "string"){
			quantita = quantita.toString();
		}

		if(quantita.indexOf('.') != -1){
			var numDecimalPlaces = quantita.substring(quantita.indexOf('.')+1, quantita.length).length;
			if(numDecimalPlaces > decimalPlaces){
				quantitaFixed = quantita.substring(0, quantita.indexOf('.')+1);
				quantitaFixed += quantita.substring(quantita.indexOf('.')+1, quantita.indexOf('.')+4);
			}
		}
	}

	return quantitaFixed;
}
