var baseUrl = "/contarbn-be/";


$.fn.loadProduzioniTable = function(url) {
	$('#produzioniTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "data",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle produzioni</strong>\n' +
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
			{"name": "data_produzione", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.dataProduzione);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "lotto", "data": "lotto", "width":"10%"},
			{"name": "scadenza", "data": null, "width":"10%", render: function ( data, type, row ) {
				var a = moment(data.scadenza);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "articolo-ingrediente", "data": null, "orderable":false, render: function ( data, type, row ) {
				var result = data.codiceArticolo+' - '+data.descrizioneArticolo;
				if(data.tipologia == 'SCORTA'){
					result = data.codiceIngrediente+' - '+data.descrizioneIngrediente;
				}
				return result;
			}},
			{"name": "num_confezioni_prodotte", "data": "numConfezioniProdotte", "width":"12%", "className": "tdAlignRight" },
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var links = '<a class="detailsProduzione pr-2" data-id="'+data.idProduzione+'" href="#"><i class="fas fa-info-circle"></i></a>';
				links += '<a class="pr-2" data-id="'+data.idProduzione+'" href="../stampe/etichette-new.html?idProduzione='+data.idProduzione+'" title="Genera etichetta"><i class="fas fa-tag"></i></a>';
				links += '<a class="deleteProduzione" data-id="'+data.idProduzione+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
			if(data.tipologia == 'SCORTA'){
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
		alertContent = alertContent + '<strong>Errore nel recupero della produzione.</strong></div>';

		$.ajax({
			url: baseUrl + "produzioni/" + idProduzione,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					if(result.tipologia == 'SCORTA'){
						$('#scorta').text('Si');
					} else {
						$('#scorta').text('No');
					}
					$('#codice').text(result.codice);
					$('#dataProduzione').text(moment(result.dataProduzione).format('DD/MM/YYYY'));
					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}
					$('#lotto').text(result.lotto);

					var ricetta = result.ricetta;
					if(ricetta != null && ricetta != undefined && ricetta != ''){
						$('#ricetta').text(ricetta.codice+' - '+ricetta.nome);
					}
					var categoriaRicetta = result.categoria;
					if(categoriaRicetta != null && categoriaRicetta != undefined && categoriaRicetta != ''){
						$('#categoriaRicetta').text(categoriaRicetta.nome);
					}
					$('#scadenza').text(moment(result.scadenza).format('DD/MM/YYYY'));
					$('#tempoImpiegato').text(result.tempoImpiegato);
					$('#quantitaTotale').text(result.quantitaTotale);
					$('#numConfezioni').text(result.numeroConfezioni);
					$('#filmChiusura').text(result.filmChiusura);
					$('#lottoFilmChiusura').text(result.lottoFilmChiusura);
					$('#barcodeEan13').text(result.barcodeEan13);
					$('#barcodeEan128').text(result.barcodeEan128);

					if(result.produzioneConfezioni != null && result.produzioneConfezioni != undefined){
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
								[2, 'desc']
							],
							"autoWidth": false,
							"columns": [
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									if(result.tipologia == 'SCORTA'){
										var ingrediente = data.ingrediente;
										if(ingrediente != null && ingrediente != undefined){
											return ingrediente.codice+" - "+ingrediente.descrizione;
										}
									} else {
										var articolo = data.articolo;
										if(articolo != null && articolo != undefined){
											return articolo.codice+" - "+articolo.descrizione;
										}
									}
									return "";
								}},
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									return data.lotto;
								}},
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									return data.numConfezioni;
								}},
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									return data.numConfezioniProdotte;
								}}
							],
							"createdRow": function(row, data, dataIndex,cells){
								if(result.tipologia == 'SCORTA'){
									$(row).css('background-color', '#cbe8f5');
								}
							}
						});
					}

					if(result.produzioneIngredienti != null && result.produzioneIngredienti != undefined){
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
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									return data.ingrediente.codice+' - '+data.ingrediente.descrizione;
								}},
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									return data.lotto;
								}},
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									if($.fn.checkVariableIsNull(data.scadenza)){
										return '';
									} else {
										return moment(data.scadenza).format('DD/MM/YYYY');
									}
								}},
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									return data.quantita;
								}},
								{"data": null, "orderable":false, render: function ( data, type, row ) {
									return data.percentuale;
								}}
							]
						});
					}

				} else {
					$('#detailsProduzioneMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
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
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#newProduzioneForm') != null && $('#newProduzioneForm') != undefined){
		$(document).on('change','#ricetta', function(){
			var idRicetta = $('#ricetta option:selected').val();
			var idCategoria = $('#ricetta option:selected').attr('data-id-categoria');
			var numGiorniScadenza = $('#ricetta option:selected').attr('data-num-giorni-scadenza');
			if(idCategoria != '-1'){
				$('#categoria option').attr('selected', false);
				$('#categoria option[value="' + idCategoria +'"]').attr('selected', true);
			}
			if(numGiorniScadenza != '-1'){
				var scadenza = moment().add(numGiorniScadenza, 'days').format('YYYY-MM-DD');
				//scadenza.setDate(scadenza.getDate() + parseInt(numGiorniScadenza));
				$('#scadenza').val(scadenza);
			}
			$.fn.loadIngredienti(idRicetta);
		});
	}

	if($('#newProduzioneButton') != null && $('#newProduzioneButton') != undefined){
		$(document).on('submit','#newProduzioneForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertProduzioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '@@alertText@@\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var alertText = '';

			// check Ingredienti
			$('.formRowIngrediente[id^="formRowIngrediente_"]').each(function( index ) {
				var dataId = $(this).attr('data-id');
				var codiceIngrediente;
				var quantitaTotale = 0;
				var quantita = 0;
				$('.formRowIngrediente[data-id="'+dataId+'"]').find('.codiceIngrediente').each(function( index ) {
					codiceIngrediente = $(this).val();
				});
				$('.formRowIngrediente[data-id="'+dataId+'"]').find('.quantitaTotaleIngrediente').each(function( index ) {
					quantitaTotale = $(this).val();
				});
				$('.formRowIngrediente[data-id="'+dataId+'"]').find('.quantitaIngrediente').each(function( index ) {
					quantita = quantita + parseFloat($(this).val());
				});
				quantita = quantita.toFixed(3);
				if(quantita < quantitaTotale){
					alertText += 'L ingrediente <strong>'+codiceIngrediente+'</strong> ha <strong>quantita</strong> minore della quantita totale.<br/>';
				} else if(quantita > quantitaTotale){
					alertText += 'L ingrediente <strong>'+codiceIngrediente+'</strong> ha <strong>quantita</strong> maggiore della quantita totale.<br/>';
				}

				var numIngredientiById = $('.formRowIngrediente[data-id="'+dataId+'"]').length;
				var lottoScadenzaArray = [];
				$('.formRowIngrediente[data-id="'+dataId+'"]').each(function( index ) {
					var lotto;
					var scadenza;
					$(this).find('.lottoIngrediente').each(function( index ) {
						lotto = $(this).val();
					});
					$(this).find('.scadenzaIngrediente').each(function( index ) {
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
			if(alertText != ''){
				$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@',alertText).replace('@@alertResult@@', 'danger'));
				return;
			}

			var produzione = new Object();
			produzione.dataProduzione = $('#dataProduzione').val();
			var ricetta = new Object();
			ricetta.id = $('#ricetta option:selected').val();
			produzione.ricetta = ricetta;

			var categoria = new Object();
			categoria.id = $('#categoria option:selected').val();
			produzione.categoria = categoria;

			var ingredientiLength = $('.formRowIngrediente').length;
			if(ingredientiLength != null && ingredientiLength != undefined && ingredientiLength != 0){
				var produzioneIngredienti = [];
				$('.formRowIngrediente').each(function(i, item){
					var produzioneIngrediente = {};
					var produzioneIngredienteId = new Object();
					//var ingredienteId = item.id.replace('formRowIngrediente_','');
					var ingredienteId = $(this).attr('data-id');
					produzioneIngredienteId.ingredienteId = ingredienteId;
					produzioneIngrediente.id = produzioneIngredienteId;

					$(this).find('.lottoIngrediente').each(function( index ) {
						produzioneIngrediente.lotto = $(this).val();
					});
					$(this).find('.scadenzaIngrediente').each(function( index ) {
						produzioneIngrediente.scadenza = $(this).val();
					});
					$(this).find('.quantitaIngrediente').each(function( index ) {
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
			produzione.filmChiusura = $('#filmChiusura').val();
			produzione.lottoFilmChiusura = $('#lottoFilmChiusura').val();
			produzione.barcodeEan13 = $('#barcodeEan13').val();
			produzione.barcodeEan128 = $('#barcodeEan128').val();
			if($('#scorta').prop('checked') === true){
				produzione.tipologia = 'SCORTA';
			}else{
				produzione.tipologia = 'STANDARD';
			}
			
			var confezioniLength = $('.confezioneRow').length;
			produzione.numeroConfezioni = 0;
			if(confezioniLength != null && confezioniLength != undefined && confezioniLength != 0){
				produzione.numeroConfezioni = confezioniLength;
				var produzioneConfezioni = [];
				$('.confezioneRow').each(function(i, item){
					var produzioneConfezione = {};
					var produzioneConfezioneId = new Object();
					var confezioneId = $(this).find('select option:selected').val();
					produzioneConfezioneId.confezioneId = confezioneId;
					produzioneConfezione.id = produzioneConfezioneId;
					produzioneConfezione.numConfezioni = $(this).find('.confezioneNum').val();
					produzioneConfezione.lotto = $(this).find('.confezioneLotto').val();
					produzioneConfezione.numConfezioniProdotte = $(this).find('.confezioneNumProdotte').val();

					produzioneConfezioni.push(produzioneConfezione);
				});
				produzione.produzioneConfezioni = produzioneConfezioni;
			}

			var produzioneJson = JSON.stringify(produzione);

			var alertContent = '<div id="alertProduzioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "produzioni",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: produzioneJson,
				success: function(result) {
					$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@','Produzione creata con successo').replace('@@alertResult@@', 'success'));

					$('#newProduzioneButton').attr("disabled", true);

					// Returns to the page with the list of Produzione
					setTimeout(function() {
						window.location.href = "produzioni.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della produzione').replace('@@alertResult@@', 'danger'));
				}
			});

		});
	}

    if($('.confezioneDescr') != null && $('.confezioneDescr') != undefined){
        $(document).on('change','.confezioneDescr', function(){
			var idConfezione = $(this).val();
			if(idConfezione != '-1'){
				var peso = $(this).find(':selected').attr('data-peso');
				$(this).parent().next().find('input').val(peso);
				$(this).parent().next().next().next().find('input').val(1);
				//$(this).parent().next().next().next().next().find('input').val(peso);
			}
			$.fn.computeQuantitaTotale();
			$.fn.computeQuantitaIngredienti();
		});
				
        $(document).on('click','.addConfezione', function(){
            var confezioneRow = $(this).parent().parent().parent().parent();
            var newConfezioneRow = confezioneRow.clone();
			newConfezioneRow.find('label').each(function( index ) {
			  $(this).remove();
			});
			newConfezioneRow.find('.confezionePeso').each(function( index ) {
			  $(this).val(null);
			});
			newConfezioneRow.find('.confezioneLotto').each(function( index ) {
				$(this).val(null);
			});
			newConfezioneRow.find('.confezioneNum').each(function( index ) {
			  $(this).val(null);
			});
			newConfezioneRow.find('.confezioneNumProdotte').each(function( index ) {
				$(this).val(null);
			});
			newConfezioneRow.find('.addConfezione').each(function( index ) {
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

	$(document).on('click','.addIngrediente', function(){
		var ingredienteRow = $(this).parent().parent().parent().parent();
		var dataId = ingredienteRow.attr('data-id');
		var quantitaTotale = 0;
		var quantita = 0;
		var newQuantita = 0;
		$('.formRowIngrediente[data-id="'+dataId+'"]').find('.quantitaTotaleIngrediente').each(function( index ) {
			quantitaTotale = $(this).val();
		});
		$('.formRowIngrediente[data-id="'+dataId+'"]').find('.quantitaIngrediente').each(function( index ) {
			quantita = quantita + parseFloat($(this).val());
		});
		newQuantita = (quantitaTotale - quantita).toFixed(3);

		var newingredienteRow = ingredienteRow.clone();
		newingredienteRow.removeAttr('id');
		newingredienteRow.find('label').each(function( index ) {
			$(this).remove();
		});
		newingredienteRow.find('.lottoIngrediente').each(function( index ) {
			$(this).val(null);
		});
		newingredienteRow.find('.scadenzaIngrediente').each(function( index ) {
			$(this).val(null);
		});
		newingredienteRow.find('.quantitaIngrediente').each(function( index ) {
			$(this).val(newQuantita);
		});
		newingredienteRow.find('.addIngrediente').each(function( index ) {
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
		var dataId = ingredienteRow.attr('data-id');
		var quantita = 0;
		ingredienteRow.find('.quantitaIngrediente').each(function( index ) {
			quantita = parseFloat($(this).val());
		});
		ingredienteRow.remove();

		$.fn.computeQuantitaTotale();
		$.fn.computeQuantitaIngredienti();

		$('html, body').animate({
			scrollTop: $("#formRowIngredientiBody").offset().top
		}, 1000);
	});

	$.fn.createUrlSearch = function(path){
		var codice = $('#searchCodice').val();
		var ricetta = $('#searchRicetta').val();
		var barcodeEan13 = $('#searchBarcodeEan13').val();
		var barcodeEan128 = $('#searchBarcodeEan128').val();

		var params = {};
		if(codice != null && codice != undefined && codice != ''){
			params.codice = codice;
		}
		if(ricetta != null && ricetta != undefined && ricetta != ''){
			params.ricetta = ricetta;
		}
		if(barcodeEan13 != null && barcodeEan13 != undefined && barcodeEan13 != ''){
			params.barcodeEan13 = barcodeEan13;
		}
		if(barcodeEan128 != null && barcodeEan128 != undefined && barcodeEan128 != ''){
			params.barcodeEan128 = barcodeEan128;
		}
		return baseUrl + path + $.param( params );
	};

	if($('#searchProduzioneButton') != null && $('#searchProduzioneButton') != undefined) {
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
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#categoria').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdRicettaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idRicetta') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getConfezioni = function(){
	$.ajax({
		url: baseUrl + "confezioni",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
			    $.each(result, function(i, item){
                    $('.confezioneDescr').append('<option value="'+item.id+'" data-peso="'+item.peso+'">'+item.codice+' '+item.tipo+' '+item.peso+' gr.</option>');
				});
			}
			$('#dataProduzione').val(moment().format('YYYY-MM-DD'));
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.loadIngredienti = function(idRicetta){

	$.ajax({
		url: baseUrl + "ricette/" + idRicetta,
		type: 'GET',
		dataType: 'json',
		success: function (result) {
			if (result != null && result != undefined && result != '') {
				var labelHtml = '<div class="form-group col-md-12 mt-4 mb-0" id="formRowIngredientiBody"><label class="font-weight-bold">Ingredienti</label></div>';

				$('#formRowIngredienti').empty().append(labelHtml);

				if (result.ricettaIngredienti != null && result.ricettaIngredienti != undefined && result.ricettaIngredienti.length != 0) {

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
						var prezzo = item.ingrediente.prezzo;
						var quantita = item.quantita;
						var percentuale = item.percentuale;

						var rowHtml = '<div class="form-row formRowIngrediente" data-id="' + id + '" id="formRowIngrediente_' + id + '" data-percentuale="'+percentuale+'">' +
							'<div class="form-group col-md-2">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control codiceIngrediente" id="codiceIngrediente_' + id + '" disabled value="' + codice + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-3">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control descrizioneIngrediente" id="descrizioneIngrediente_' + id + '" disabled value="' + descrizione + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="lottoIngrediente">Lotto</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control lottoIngrediente" id="lottoIngrediente_' + id + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="scadenzaIngrediente">Scadenza</label>';
						}
						rowHtml = rowHtml + '<input type="date" class="form-control scadenzaIngrediente" id="scadenzaIngrediente_' + id + '" style="font-size: smaller;"></div>';

						rowHtml = rowHtml + '<div class="form-group col-md-3">';

						if (i == 0) {
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
		error: function (jqXHR, textStatus, errorThrown) {
			$('#alertProduzione').append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getRicettaProduzione = function(idRicetta){

	var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della ricetta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
        url: baseUrl + "ricette/" + idRicetta,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){
          	$('#ricetta option[value=' + idRicetta +']').attr('selected', true);
          	$('#categoria option[value="' + result.categoria.id +'"]').attr('selected', true);

			$.fn.loadIngredienti(idRicetta);

          } else{
            $('#alertProduzione').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertProduzione').append(alertContent);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.computeQuantitaTotale = function() {
	var quantitaTotale;
	$('.confezioneNum').each(function(i, item){
		var numeroConfezioni = $(this).val();
		var peso = $(this).parent().parent().find('.confezionePeso').val();
		if(numeroConfezioni != undefined && peso != undefined){
			var pesoConfezione = parseFloat(numeroConfezioni)*parseFloat(peso);
			if(quantitaTotale != null && quantitaTotale != undefined && quantitaTotale != ""){
				quantitaTotale = parseFloat(quantitaTotale) + parseFloat(pesoConfezione);
			} else {
				quantitaTotale = parseFloat(pesoConfezione);
			}
		}
	});
	if(quantitaTotale != null && quantitaTotale != undefined && quantitaTotale != ""){
		quantitaTotale = parseFloat(quantitaTotale)/1000;
	}
	$('#quantitaTotale').val(quantitaTotale);	
}

$.fn.computeQuantitaIngredienti = function() {
	var quantitaTotale = $('#quantitaTotale').val();
	if(quantitaTotale != null && quantitaTotale != undefined && quantitaTotale != ""){
		$('.formRowIngrediente').each(function(i, item){
			var percentuale = $(this).attr('data-percentuale');
			var quantitaIngrediente = parseFloat((parseFloat(percentuale)*parseFloat(quantitaTotale))/100);
			$(this).find('.quantitaTotaleIngrediente').val(quantitaIngrediente.toFixed(3));
			$(this).find('.quantitaIngrediente').val(quantitaIngrediente.toFixed(3));
		});
	}
}
