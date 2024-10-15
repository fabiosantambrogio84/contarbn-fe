var baseUrl = "/contarbn-be/";

$.fn.loadProduzioniTable = function(url) {
	$('#produzioniTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "data",
			"error": function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
				let alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent += '<strong>Errore nel recupero delle produzioni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertProduzione').empty().append(alertContent);
			}
		},
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna produzione disponibile",
			"zeroRecords": "Nessuna produzione disponibile",
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
			[0, 'desc'],
			[1, 'desc']
		],
		"columns": [
			{"name": "data_produzione", "data": "dataProduzione", "width":"5%", "visible": false},
			{"name": "codice_produzione", "data": "codiceProduzione", "width":"10%"},
			{"name": "data_produzione", "data": null, "width":"8%", render: function (data) {
				var a = moment(data.dataProduzione);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "lotto", "data": "lotto", "width":"10%"},
			{"name": "scadenza", "data": null, "width":"10%", render: function (data) {
				var a = moment(data.scadenza);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "articolo-ingrediente", "data": null, "orderable":false, render: function (data) {
				var result = data.codiceArticolo+' - '+data.descrizioneArticolo;
				if(data.tipologia === 'SCORTA'){
					result = data.codiceIngrediente+' - '+data.descrizioneIngrediente;
				}
				return result;
			}},
			{"name": "num_confezioni_prodotte", "data": "numConfezioniProdotte", "width":"12%", "className": "tdAlignRight" },
			{"data": null, "orderable":false, "width":"10%", render: function (data) {
				var links = '<a class="detailsProduzione pr-2" data-id="'+data.idProduzione+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
				links += '<a class="pr-2" data-id="'+data.idProduzione+'" href="../stampe/etichette-new.html?idProduzioneConfezione='+data.idProduzioneConfezione+'" title="Genera etichetta"><i class="fas fa-tag"></i></a>';
				if(data.tipologia !== 'SCORTA'){
					links += '<a class=" pr-1" data-id="'+data.idProduzione+'" data-id-articolo="'+data.idArticolo+'" href="schede-tecniche-edit.html?idProduzione='+data.idProduzione+'&idArticolo='+data.idArticolo+' " title="Scheda tecnica"><i class="fas fa-clipboard-list"></i></a>';
				}
				links += '<a class="deleteProduzione" data-id="'+data.idProduzione+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data){
			$(row).css('font-size', '12px');
			if(data.tipologia === 'SCORTA'){
				$(row).css('background-color', '#cbe8f5');
			}
		}
	});
}

$(document).ready(function() {

	$.fn.loadProduzioniTable(baseUrl + "produzioni/search");

	$(document).on('click','.detailsProduzione', function(){
		var idProduzione = $(this).attr('data-id');

		var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent += '<strong>Errore nel recupero della produzione.</strong></div>';

		$.ajax({
			url: baseUrl + "produzioni/" + idProduzione,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result !== '') {
					if(result.tipologia === 'SCORTA'){
						$('#scorta').text('Si');
					} else {
						$('#scorta').text('No');
					}
					$('#codice').text(result.codice);
					$('#dataProduzione').text(moment(result.dataProduzione).format('DD/MM/YYYY'));
					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento !== ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}
					$('#lotto').text(result.lotto);

					var ricetta = result.ricetta;
					if(ricetta != null && ricetta !== ''){
						$('#ricetta').text(ricetta.codice+' - '+ricetta.nome);
					}
					var categoriaRicetta = result.categoria;
					if(categoriaRicetta != null && categoriaRicetta !== ''){
						$('#categoriaRicetta').text(categoriaRicetta.nome);
					}
					var articolo = result.articolo;
					if(articolo != null && articolo !== ''){
						$('#articolo').text(articolo.codice+' '+articolo.descrizione);
					}
					$('#scadenza').text(moment(result.scadenza).format('DD/MM/YYYY'));
					$('#tempoImpiegato').text(result.tempoImpiegato);
					$('#quantitaTotale').text(result.quantitaTotale);
					$('#numConfezioni').text(result.numeroConfezioni);
					$('#barcodeEan128').text(result.barcodeEan128);

					if(result.ricetta != null && result.ricetta.ricettaAllergeni != null){
						var allergeni = [];
						$.each(result.ricetta.ricettaAllergeni, function(i, item){
							allergeni.push(item.allergene.nome);
						})
						if(allergeni.length > 0){
							allergeni.sort();
							$('#tracce').text(allergeni.join(','));
						}
					}

					if(result.produzioneConfezioni != null){

						$('#detailsProduzioneConfezioniModalTable').DataTable().destroy();

						$('#detailsProduzioneConfezioniModalTable').DataTable({
							"data": result.produzioneConfezioni,
							"retrieve": true,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessuna confezione presente",
								"zeroRecords": "Nessuna confezione presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'desc'],
								[3, 'desc']
							],
							"autoWidth": false,
							"columns": [
								{"data": null, "orderable":false, "width": "15%", render: function (data) {
									if(result.tipologia === 'SCORTA'){
										var ingrediente = data.ingrediente;
										if(ingrediente != null){
											return ingrediente.codice+" - "+ingrediente.descrizione;
										}
									} else {
										var articolo = data.articolo;
										if(articolo != null){
											return articolo.codice+" - "+articolo.descrizione;
										}
									}
									return "";
								}},
								{"data": null, "orderable":false, "width": "5%", render: function (data) {
									return data.barcode;
								}},
								{"data": null, "orderable":false, "width": "5%", render: function (data) {
									return data.lotto;
								}},
								{"data": null, "orderable":false, "width": "5%", render: function (data) {
									return data.lotto2;
								}},
								{"data": null, "orderable":false, "width": "10%", render: function (data) {
									return data.lottoFilmChiusura;
								}},
								{"data": null, "orderable":false, "width": "12%", render: function (data) {
									return data.numConfezioni;
								}},
								{"data": null, "orderable":false, "width": "10%", render: function (data) {
									return data.numConfezioniProdotte;
								}}
							],
							"createdRow": function(row){
								if(result.tipologia === 'SCORTA'){
									$(row).css('background-color', '#cbe8f5');
								}
							}
						});
					}

					if(result.produzioneIngredienti != null){

						$('#detailsProduzioneIngredientiModalTable').DataTable().destroy();

						$('#detailsProduzioneIngredientiModalTable').DataTable({
							"data": result.produzioneIngredienti,
							"retrieve": true,
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
								[3, 'desc'],
								[4, 'desc'],
								[0, 'desc'],
								[1, 'desc']
							],
							"autoWidth": false,
							"columns": [
								{"data": null, "orderable":false, render: function (data) {
									return data.ingrediente.codice+' - '+data.ingrediente.descrizione;
								}},
								{"data": null, "orderable":false, render: function (data) {
									return data.lotto;
								}},
								{"data": null, "orderable":false, render: function (data) {
									if($.fn.checkVariableIsNull(data.scadenza)){
										return '';
									} else {
										return moment(data.scadenza).format('DD/MM/YYYY');
									}
								}},
								{"data": null, "orderable":false, render: function (data) {
									return data.quantita;
								}},
								{"data": null, "orderable":false, render: function (data) {
									return data.percentuale;
								}},
								{"data": null, "orderable":false, render: function (data) {
									if(data.ingrediente != null && data.ingrediente.ingredienteAllergeni != null){
										var allergeni = [];
										$.each(data.ingrediente.ingredienteAllergeni, function(i, item){
											allergeni.push(item.allergene.nome);
										})
										if(allergeni.length > 0){
											allergeni.sort();
											return allergeni.join(',');
										}
									}
									return '';
								}}
							]
						});
					}

				} else {
					$('#detailsProduzioneMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR) {
				$('#detailsProduzioneMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

		$('#detailsProduzioneModal').modal('show');
	});

	$(document).on('click','.closeProduzione', function(){
		$('#detailsProduzioneModalTable').DataTable().destroy();
		$('#detailsProduzioneModal').modal('hide');
	});

	$(document).on('click','.deleteProduzione', function(){
		var idProduzione = $(this).attr('data-id');
		$('#confirmDeleteProduzione').attr('data-id', idProduzione);
		$('#deleteProduzioneModal').modal('show');
	});

	$(document).on('click','#confirmDeleteProduzione', function(){
		$('#deleteProduzioneModal').modal('hide');
		var idProduzione = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "produzioni/" + idProduzione,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertProduzioneContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Produzione</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertProduzione').empty().append(alertContent);

				$('#produzioniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	$(document).on('click','.addIngrediente', function(){
		var ingredienteRow = $(this).parent().parent().parent().parent();
		var dataId = ingredienteRow.attr('data-id');
		var quantitaTotale = 0;
		var quantita = 0;
		var newQuantita = 0;
		$('.formRowIngrediente[data-id="'+dataId+'"]').find('.quantitaTotaleIngrediente').each(function() {
			quantitaTotale = $(this).val();
		});
		$('.formRowIngrediente[data-id="'+dataId+'"]').find('.quantitaIngrediente').each(function() {
			quantita = quantita + parseFloat($(this).val());
		});
		newQuantita = (quantitaTotale - quantita).toFixed(3);

		var newingredienteRow = ingredienteRow.clone();
		newingredienteRow.removeAttr('id');
		newingredienteRow.find('label').each(function() {
			$(this).remove();
		});
		newingredienteRow.find('.lottoIngrediente').each(function() {
			$(this).val(null);
		});
		newingredienteRow.find('.scadenzaIngrediente').each(function() {
			$(this).val(null);
		});
		newingredienteRow.find('.quantitaIngrediente').each(function() {
			$(this).val(newQuantita);
		});
		newingredienteRow.find('.addIngrediente').each(function() {
			$(this).remove();
		});
		var removeLink = '<a href="#" class="removeIngrediente"><i class="fas fa-minus"></i></a>';
		newingredienteRow.find('.linkIngrediente').after(removeLink);
		$('.formRowIngrediente[data-id="'+dataId+'"]').last().after(newingredienteRow);
		newingredienteRow.focus();

		$('html, body').animate({
			scrollTop: $("#formRowIngredientiBody").offset().top
		}, 1000);
	});

	$(document).on('click','.removeIngrediente', function(){
		var ingredienteRow = $(this).parent().parent().parent();
		//var dataId = ingredienteRow.attr('data-id');
		var quantita = 0;
		ingredienteRow.find('.quantitaIngrediente').each(function() {
			quantita = parseFloat($(this).val());
		});
		ingredienteRow.remove();

		$.fn.computeQuantitaTotale();
		$.fn.computeQuantitaIngredienti();

		$('html, body').animate({
			scrollTop: $("#formRowIngredientiBody").offset().top
		}, 1000);
	});

	if($('#newProduzioneForm') != null && $('#newProduzioneForm') !== undefined){

		$(document).on('change','#ricetta', function(){
			var idRicetta = $('#ricetta option:selected').val();
			var idCategoria = $('#ricetta option:selected').attr('data-id-categoria');
			var numGiorniScadenza = $('#ricetta option:selected').attr('data-num-giorni-scadenza');
			var codiceRicetta = $('#ricetta option:selected').attr('data-codice');
			var tracce = $('#ricetta option:selected').attr('data-tracce');
			if(idCategoria !== '-1'){
				$('#categoria option').attr('selected', false);
				$('#categoria option[value="' + idCategoria +'"]').attr('selected', true);
			}
			if(numGiorniScadenza !== '-1'){
				var scadenza = moment().add(numGiorniScadenza, 'days').format('YYYY-MM-DD');
				//scadenza.setDate(scadenza.getDate() + parseInt(numGiorniScadenza));
				$('#scadenza').val(scadenza);
			}

			if(idRicetta !== '-1'){
				$.fn.loadIngredienti(idRicetta);
				$.fn.loadArticoli(codiceRicetta);
				if(!$.fn.checkVariableIsNull(tracce) && tracce !== 'null'){
					$('#tracce').val(tracce);
				} else {
					$('#tracce').val(null);
				}
				$.fn.emptyConfezioni();
			} else{
				$('#scadenza').val(null);
				$('#tempoImpiegato').val(null);
				$('#quantitaTotale').val(null);
				$('#tracce').val(null);
				$('#categoria option').attr('selected', false);
				$('#categoria option[value="-1"]').attr('selected', true);
				$('#articolo').empty();
				$('#formRowIngredienti').empty().append('<div class="form-group col-md-12 mt-4 mb-0" id="formRowIngredientiBody"><label class="font-weight-bold">Ingredienti</label></div>');
				$.fn.emptyConfezioni();
			}
		});

		$(document).on('change','#articolo', function(){
			$.fn.emptyConfezioni();
		});
	}

	if($('#newProduzioneButton') != null && $('#newProduzioneButton') !== undefined){
		$(document).on('submit','#newProduzioneForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertProduzioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '@@alertText@@\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var alertText = '';

			// check Ingredienti
			$('.formRowIngrediente[id^="formRowIngrediente_"]').each(function() {
				var dataId = $(this).attr('data-id');
				var codiceIngrediente = '';
				var quantitaTotale = 0;
				var quantita = 0;
				$('.formRowIngrediente[data-id="'+dataId+'"]').find('.codiceIngrediente').each(function() {
					codiceIngrediente = $(this).val();
				});
				$('.formRowIngrediente[data-id="'+dataId+'"]').find('.quantitaTotaleIngrediente').each(function() {
					quantitaTotale = quantitaTotale + parseFloat($(this).val());
				});
				$('.formRowIngrediente[data-id="'+dataId+'"]').find('.quantitaIngrediente').each(function() {
					quantita = quantita + parseFloat($(this).val());
				});
				quantita = quantita.toFixed(3);
				quantitaTotale = quantitaTotale.toFixed(3);
				if(quantita < quantitaTotale){
					alertText += 'L ingrediente <strong>'+codiceIngrediente+'</strong> ha <strong>quantita</strong> minore della quantita totale.<br/>';
				} else if(quantita > quantitaTotale){
					alertText += 'L ingrediente <strong>'+codiceIngrediente+'</strong> ha <strong>quantita</strong> maggiore della quantita totale.<br/>';
				}

				var numIngredientiById = $('.formRowIngrediente[data-id="'+dataId+'"]').length;
				var lottoScadenzaArray = [];
				$('.formRowIngrediente[data-id="'+dataId+'"]').each(function() {
					var lotto = '';
					var scadenza = '';
					$(this).find('.lottoIngrediente').each(function() {
						lotto = $(this).val();
					});
					$(this).find('.scadenzaIngrediente').each(function() {
						scadenza = $(this).val();
					});
					var currentLottoScadenza = lotto+'#'+scadenza;
					lottoScadenzaArray.push(currentLottoScadenza);
				});
				lottoScadenzaArray = $.unique(lottoScadenzaArray);
				if(lottoScadenzaArray != null){
					if(lottoScadenzaArray.length < numIngredientiById){
						alertText += 'L ingrediente <strong>'+codiceIngrediente+'</strong> ha <strong>lotto</strong> e <strong>scadenza</strong> duplicati.<br/>';
					}
				}
			});

			if(alertText !== ''){
				$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@',alertText).replace('@@alertResult@@', 'danger'));
				return;
			}

			var produzione = {};
			produzione.dataProduzione = $('#dataProduzione').val();
			var ricetta = {};
			ricetta.id = $('#ricetta option:selected').val();
			produzione.ricetta = ricetta;

			var categoria = {};
			categoria.id = $('#categoria option:selected').val();
			produzione.categoria = categoria;

			var articolo = {};
			articolo.id = $('#articolo option:selected').val();
			articolo.quantitaPredefinita = $('#articolo option:selected').attr('data-quantita-predefinita');
			produzione.articolo = articolo;

			var ingredientiLength = $('.formRowIngrediente').length;
			if(ingredientiLength != null && ingredientiLength !== 0){
				var produzioneIngredienti = [];
				$('.formRowIngrediente').each(function(){
					var produzioneIngrediente = {};
					var produzioneIngredienteId = {};
					produzioneIngredienteId.ingredienteId = $(this).attr('data-id');
					produzioneIngrediente.id = produzioneIngredienteId;

					$(this).find('.lottoIngrediente').each(function() {
						produzioneIngrediente.lotto = $(this).val();
					});
					$(this).find('.scadenzaIngrediente').each(function() {
						produzioneIngrediente.scadenza = $(this).val();
					});
					$(this).find('.quantitaIngrediente').each(function() {
						produzioneIngrediente.quantita = $(this).val();
					});

					produzioneIngredienti.push(produzioneIngrediente);
				});
				produzione.produzioneIngredienti = produzioneIngredienti;
			}
			produzione.scadenza = $('#scadenza').val();
			produzione.tempoImpiegato = $('#tempoImpiegato').val();
			produzione.quantitaTotale = $('#quantitaTotale').val();
			produzione.scopo = $('input[name="generaLotto"]:checked').val();
			if($('#scorta').prop('checked') === true){
				produzione.tipologia = 'SCORTA';
			}else{
				produzione.tipologia = 'STANDARD';
			}
			
			var confezioniLength = $('.confezioneRow').length;
			produzione.numeroConfezioni = 0;
			if(confezioniLength != null && confezioniLength !== 0){
				produzione.numeroConfezioni = confezioniLength;
				var produzioneConfezioni = [];
				$('.confezioneRow').each(function(){
					var produzioneConfezione = {};
					var confezione = {};
					confezione.id = $(this).find('select option:selected').val();
					produzioneConfezione.confezione = confezione;
					produzioneConfezione.numConfezioni = $(this).find('.confezioneNum').val();
					produzioneConfezione.barcode = $(this).find('.confezioneBarcode').val();
					produzioneConfezione.lotto = $(this).find('.confezioneLotto').val();
					produzioneConfezione.lotto2 = $(this).find('.confezioneLotto2').val();
					produzioneConfezione.lottoFilmChiusura = $(this).find('.lottoFilmChiusura').val();
					produzioneConfezione.numConfezioniProdotte = $(this).find('.confezioneNumProdotte').val();

					produzioneConfezioni.push(produzioneConfezione);
				});
				produzione.produzioneConfezioni = produzioneConfezioni;
			}

			var produzioneJson = JSON.stringify(produzione);

			alertContent = '<div id="alertProduzioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "produzioni",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: produzioneJson,
				success: function() {
					$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@','Produzione creata con successo').replace('@@alertResult@@', 'success'));

					$('#newProduzioneButton').attr("disabled", true);

					// Returns to the page with the list of Produzione
					setTimeout(function() {
						window.location.href = "produzioni.html";
					}, 1000);
				},
				error: function() {
					$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della produzione').replace('@@alertResult@@', 'danger'));
				}
			});

		});
	}

    if($('.confezioneDescr') != null && $('.confezioneDescr') !== undefined){
        $(document).on('change','.confezioneDescr', function(){
			var idConfezione = $(this).val();
			if(idConfezione !== '-1'){
				var peso = $(this).find(':selected').attr('data-peso');
				$(this).parent().next().next().find('input').val(peso);
				$(this).parent().next().next().next().next().next().next().find('input').val(1);
				var barcodeElem = $(this).parent().next().find('input');

				if($('#scorta').prop('checked') === false){
					var codiceRicetta = $('#ricetta option:selected').attr('data-codice');
					$.ajax({
						url: baseUrl + "produzioni/check-articolo?codiceRicetta="+codiceRicetta+'&idConfezione='+idConfezione,
						type: 'GET',
						dataType: 'json',
						success: function(result) {
							if(result != null){
								barcodeElem.val(result.barcode);
							}
						},
						error: function() {
							console.log("Error checking articolo with codiceRicetta '"+codiceRicetta+"' and idConfezione '"+idConfezione+"'");
						}
					});
				}
			} else {
				$(this).parent().parent().find('input').val(null);
			}
			$.fn.computeQuantitaTotale();
			$.fn.computeQuantitaIngredienti();
		});
				
        $(document).on('click','.addConfezione', function(){
            var confezioneRow = $(this).parent().parent().parent().parent();
            var newConfezioneRow = confezioneRow.clone();
			newConfezioneRow.addClass('confezioneRowAdd');
			newConfezioneRow.find('label').each(function() {
			  $(this).remove();
			});
			newConfezioneRow.find('.confezionePeso').each(function() {
			  $(this).val(null);
			});
			newConfezioneRow.find('.confezioneBarcode').each(function() {
				$(this).val(null);
			});
			newConfezioneRow.find('.confezioneLotto').each(function() {
				$(this).val(null);
			});
			newConfezioneRow.find('.confezioneLotto2').each(function() {
				$(this).val(null);
			});
			newConfezioneRow.find('.confezioneNum').each(function() {
			  $(this).val(null);
			});
			newConfezioneRow.find('.confezioneNumProdotte').each(function() {
				$(this).val(null);
			});
			newConfezioneRow.find('.lottoFilmChiusura').each(function() {
				$(this).val(null);
			});
			newConfezioneRow.find('.addConfezione').each(function() {
			  $(this).remove();
			});
			var removeLink = '<a href="#" class="removeConfezione"><i class="fas fa-minus"></i></a>';
			newConfezioneRow.find('.linkConfezione').after(removeLink);
			$('.confezioneRow').last().after(newConfezioneRow);
			newConfezioneRow.focus();
        });
		
		$(document).on('click','.removeConfezione', function(){
            var confezioneRow = $(this).parent().parent().parent();
            confezioneRow.remove();
			$.fn.computeQuantitaTotale();
			$.fn.computeQuantitaIngredienti();
        });
		
		$(document).on('change','.confezioneNum', function(){
			$.fn.computeQuantitaTotale();
			$.fn.computeQuantitaIngredienti();
		});
    }

	$.fn.createUrlSearch = function(path){
		var codice = $('#searchCodice').val();
		var ricetta = $('#searchRicetta').val();
		var barcodeEan13 = $('#searchBarcodeEan13').val();
		var barcodeEan128 = $('#searchBarcodeEan128').val();

		var params = {};
		if(codice != null && codice !== ''){
			params.codice = codice;
		}
		if(ricetta != null && ricetta !== ''){
			params.ricetta = ricetta;
		}
		if(barcodeEan13 != null && barcodeEan13 !== ''){
			params.barcodeEan13 = barcodeEan13;
		}
		if(barcodeEan128 != null && barcodeEan128 !== ''){
			params.barcodeEan128 = barcodeEan128;
		}
		return baseUrl + path + $.param( params );
	};

	if($('#searchProduzioneButton') != null && $('#searchProduzioneButton') !== undefined) {
		$(document).on('submit', '#searchProduzioneForm', function (event) {
			event.preventDefault();

			var url = $.fn.createUrlSearch("produzioni/search?");

			$('#produzioniTable').DataTable().destroy();
			$.fn.loadProduzioniTable(url);

		});

		$(document).on('click','#resetSearchProduzioneButton', function(){
			$('#searchProduzioneForm :input').val(null);
			$('#searchProduzioneForm select option[value=""]').attr('selected', true);

			$('#produzioniTable').DataTable().destroy();
			$.fn.loadProduzioniTable(baseUrl + "produzioni/search");
		});
	}

});

$.fn.getCategorieRicette = function(){
	$.ajax({
		url: baseUrl + "categorie-ricette",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#categoria').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getConfezioni = function(){
	$.ajax({
		url: baseUrl + "confezioni",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
			    $.each(result, function(i, item){
                    $('.confezioneDescr').append('<option value="'+item.id+'" data-peso="'+item.peso+'">'+item.tipo+'</option>');
				});
			}
			$('#dataProduzione').val(moment().format('YYYY-MM-DD'));
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.loadIngredienti = function(idRicetta){

	var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent += '<strong>Errore nel caricamento degli ingredienti</strong>\n' +
		'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "ricette/" + idRicetta,
		type: 'GET',
		dataType: 'json',
		success: function (result) {
			if (result != null && result !== '') {
				var labelHtml = '<div class="form-group col-md-12 mt-4 mb-0" id="formRowIngredientiBody"><label class="font-weight-bold">Ingredienti</label></div>';

				$('#formRowIngredienti').empty().append(labelHtml);

				if (result.ricettaIngredienti != null && result.ricettaIngredienti.length !== 0) {

					var ricettaIngredienti = result.ricettaIngredienti;
					ricettaIngredienti.sort(function(a,b){
						var quantita1 = a.quantita;
						var quantita2 = b.quantita;
						return ((quantita1 > quantita2) ? -1 : ((quantita1 < quantita2) ? 1 : 0));
					});

					ricettaIngredienti.forEach(function (item, i) {
						var id = item.id.ingredienteId;
						var codice = item.ingrediente.codice;
						var descrizione = item.ingrediente.descrizione;
						var quantita = item.quantita;
						var percentuale = item.percentuale;
						var allergeni = '';
						if(item.ingrediente.ingredienteAllergeni != null){
							var allergeniArray = [];
							$.each(item.ingrediente.ingredienteAllergeni, function(i, item2){
								allergeniArray.push(item2.allergene.nome);
							})
							if(allergeniArray.length > 0){
								allergeniArray.sort();
								allergeni = allergeniArray.join(',');
							}
						}

						var rowHtml = '<div class="form-row formRowIngrediente" data-id="' + id + '" id="formRowIngrediente_' + id + '" data-percentuale="'+percentuale+'">' +
							'<div class="form-group col-md-2">';

						if (i === 0) {
							rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control codiceIngrediente" id="codiceIngrediente_' + id + '" disabled value="' + codice + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i === 0) {
							rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control descrizioneIngrediente" id="descrizioneIngrediente_' + id + '" disabled value="' + descrizione + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i === 0) {
							rowHtml = rowHtml + '<label for="allergeniIngrediente">Allergeni</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control allergeniIngrediente" id="allergeniIngrediente_' + id + '" disabled value="' + allergeni + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i === 0) {
							rowHtml = rowHtml + '<label for="lottoIngrediente">Lotto</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control lottoIngrediente" id="lottoIngrediente_' + id + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i === 0) {
							rowHtml = rowHtml + '<label for="scadenzaIngrediente">Scadenza</label>';
						}
						rowHtml = rowHtml + '<input type="date" class="form-control scadenzaIngrediente" id="scadenzaIngrediente_' + id + '" style="font-size: smaller;"></div>';

						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i === 0) {
							rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita (Kg)</label>';
						}
						rowHtml += '<div class="input-group input-group-sm mb-3">';
						rowHtml += '<input type="number" class="form-control quantitaIngrediente" id="quantitaIngrediente_' + id + '" step=".001" min="0" value="' + quantita + '" onchange="$.fn.computeCostoIngredienti(this);" style="text-align: right;">';
						rowHtml += '<div class="input-group-prepend"><div class="input-group-text">di</div></div>';
						rowHtml += '<input type="number" class="form-control quantitaTotaleIngrediente" id="quantitaTotaleIngrediente_' + id + '" step=".001" min="0" value="' + quantita + '" disabled style="text-align: right;">';

						rowHtml += '<div class="input-group-append ml-1 mt-1 linkIngrediente"><a href="#" class="addIngrediente"><i class="fas fa-plus"></i></a></div>';
						rowHtml += '</div></div>';

						rowHtml = rowHtml + '</div></div>';
						rowHtml = rowHtml + '</div>';

						$('#formRowIngredienti').append(rowHtml);
					});
					$.fn.computeQuantitaIngredienti();
				}
			} else {
				$('#alertProduzione').empty().append(alertContent);
			}
		},
		error: function (jqXHR) {
			$('#alertProduzione').empty().append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.loadArticoli = function(codiceRicetta){

	var codice = 'UR'+codiceRicetta;

	var alertContent = '<div id="alertProduzioneContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
	alertContent += '<strong>Non sono presenti articoli con codice che inizia con '+codice+'</strong>\n' +
		'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$('#articolo').empty().append('<option value="" ' +
		'data-quantita-predefinita="" ' +
		'data-barcode="" ' +
		'>-</option>');

	$.ajax({
		url: baseUrl + "articoli/codice/" + codice + "/like?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== '' && result.length > 0){

				$.each(result, function(i, item){
					var selected = '';

					if(item.codice === codice){
						selected = 'selected';
					}

					$('#articolo').append('<option value="'+item.id+'" ' +
						'data-quantita-predefinita="'+item.quantitaPredefinita+'" ' +
						'data-barcode="'+item.barcode+'" ' +
						selected +
						'>'+item.codice+' '+item.descrizione+'</option>');

				});

			} else{
				$('#alertProduzione').empty().append(alertContent);
			}
		},
		error: function(jqXHR) {
			$('#alertProduzione').append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getRicettaProduzione = function(idRicetta){

	var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent += '<strong>Errore nel recupero della ricetta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
        url: baseUrl + "ricette/" + idRicetta,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result !== ''){
          	$('#ricetta option[value=' + idRicetta +']').attr('selected', true);
          	$('#categoria option[value="' + result.categoria.id +'"]').attr('selected', true);

			$.fn.loadIngredienti(idRicetta);
			$.fn.loadArticoli(result.codice);

          } else{
            $('#alertProduzione').empty().append(alertContent);
          }
        },
        error: function(jqXHR) {
            $('#alertProduzione').append(alertContent);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.computeQuantitaTotale = function() {
	var quantitaTotale = 0;
	$('.confezioneNum').each(function(){
		var numeroConfezioni = $(this).val();
		var peso = $(this).parent().parent().find('.confezionePeso').val();
		if(numeroConfezioni !== undefined && peso !== undefined){
			var pesoConfezione = parseFloat(numeroConfezioni)*parseFloat(peso);
			if(quantitaTotale != null && quantitaTotale !== ""){
				quantitaTotale = parseFloat(quantitaTotale) + parseFloat(pesoConfezione);
			} else {
				quantitaTotale = parseFloat(pesoConfezione);
			}
		}
	});
	if(quantitaTotale != null && quantitaTotale !== ""){
		quantitaTotale = parseFloat(quantitaTotale)/1000;
	}
	$('#quantitaTotale').val(quantitaTotale);	
}

$.fn.computeQuantitaIngredienti = function() {
	var quantitaTotale = $('#quantitaTotale').val();
	if(quantitaTotale != null && quantitaTotale !== ""){
		$('.formRowIngrediente').each(function(){
			var percentuale = $(this).attr('data-percentuale');
			var quantitaIngrediente = parseFloat((parseFloat(percentuale)*parseFloat(quantitaTotale))/100);
			$(this).find('.quantitaTotaleIngrediente').val(quantitaIngrediente.toFixed(3));
			$(this).find('.quantitaIngrediente').val(quantitaIngrediente.toFixed(3));
		});
	}
}

$.fn.emptyConfezioni = function() {
	$('.confezioneRowAdd').remove();
	var confezioneRow = $('.confezioneRow');
	$('.confezioneDescr option').attr('selected', false);
	$('.confezioneDescr option[value="-1"]').attr('selected', true);
	confezioneRow.find('.confezionePeso').each(function() {
		$(this).val(null);
	});
	confezioneRow.find('.confezioneBarcode').each(function() {
		$(this).val(null);
	});
	confezioneRow.find('.confezioneLotto').each(function() {
		$(this).val(null);
	});
	confezioneRow.find('.confezioneLotto2').each(function() {
		$(this).val(null);
	});
	confezioneRow.find('.confezioneNum').each(function() {
		$(this).val(null);
	});
	confezioneRow.find('.confezioneNumProdotte').each(function() {
		$(this).val(null);
	});
	confezioneRow.find('.lottoFilmChiusura').each(function() {
		$(this).val(null);
	});
}