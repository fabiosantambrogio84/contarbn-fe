var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	if($('#alertSchedaTecnica') != null && $('#alertSchedaTecnica') !== undefined){

		$('[data-toggle="tooltip"]').tooltip();

		$(document).on('change','#data', function(){
			$.ajax({
				url: baseUrl + "schede-tecniche/num-revisione?data="+$('#data').val(),
				type: 'GET',
				dataType: 'json',
				success: function(result) {
					if(result != null && result !== ''){
						$('#numRevisione').val(result.numRevisione);
						$('#anno').val(result.anno);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
				}
			});
		});
	}

	$(document).on('click','.addDichiarazioneNutrizionale', function(event){
		event.preventDefault();

		var dichiarazioneNutrizionaleRow = $(this).parent().parent().parent().parent();
		var newDichiarazioneNutrizionaleRow = $.fn.cloneRowDichiarazioneNutrizionale(dichiarazioneNutrizionaleRow);

		newDichiarazioneNutrizionaleRow.find('.dichiarazioneNutrizionaleNutriente').focus();
	});

	$(document).on('click','.removeDichiarazioneNutrizionale', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().remove();
	});

	$(document).on('click','.addAnalisi', function(event){
		event.preventDefault();

		var analisiRow = $(this).parent().parent().parent().parent();
		var newAnalisiRow = $.fn.cloneRowAnalisi(analisiRow);

		newAnalisiRow.find('.analisiAnalisi').focus();
	});

	$(document).on('click','.removeAnalisi', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().remove();
	});

	$(document).on('click','.addRaccolta', function(event){
		event.preventDefault();

		var raccoltaRow = $(this).parent().parent().parent().parent();
		var newRaccoltaRow = $.fn.cloneRowRaccolta(raccoltaRow);

		newRaccoltaRow.find('.raccoltaMateriale').focus();
	});

	$(document).on('click','.removeRaccolta', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().remove();
	});

	$(document).on('submit','#saveSchedaTecnicaForm', function(event){
		event.preventDefault();

		let alertContent = '<div id="alertRicettaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '@@alertText@@\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		let idProduzione = $('#hiddenIdProduzione').val();
		let idArticolo = $('#hiddenIdArticolo').val();
		let idSchedaTecnica = $('#hiddenIdSchedaTecnica').val();

		let schedaTecnica = {};
		schedaTecnica.id = idSchedaTecnica;
		schedaTecnica.idProduzione = idProduzione;
		schedaTecnica.idArticolo = idArticolo;
		schedaTecnica.numRevisione = $('#numRevisione').val();
		schedaTecnica.anno = $('#anno').val();
		schedaTecnica.data = $('#data').val();
		schedaTecnica.codiceProdotto = $('#codiceProdotto').val();
		schedaTecnica.prodotto = $('#prodotto').val();
		schedaTecnica.prodotto2 = $('#prodotto2').val();
		schedaTecnica.pesoNettoConfezione = $('#pesoNettoConfezione').val();
		schedaTecnica.durata = $('#durata').val();
		schedaTecnica.ingredienti = $('#ingredienti').val();
		schedaTecnica.tracce = $('#tracce').val();
		schedaTecnica.conservazione = $('#conservazione').val();
		schedaTecnica.consigliConsumo = $('#consigliConsumo').val();
		schedaTecnica.tipologiaConfezionamento = {"id":$('#tipologiaConfezionamento').val()};
		schedaTecnica.imballo = {"id":$('#imballo').val()};
		schedaTecnica.imballoDimensioni = $('#imballoDimensioni').val();

		let dichiarazioneNutrizionaleLength = $('.dichiarazioneNutrizionaleRow').length;
		if(dichiarazioneNutrizionaleLength != null && dichiarazioneNutrizionaleLength !== 0){
			let schedaTecnicaNutrienti = [];
			$('.dichiarazioneNutrizionaleRow').each(function(i, item){
				let schedaTecnicaNutriente = {};
				let schedaTecnicaNutrienteId = {}
				schedaTecnicaNutrienteId.nutrienteId = $(this).find('.dichiarazioneNutrizionaleNutriente option:selected').val();

				schedaTecnicaNutriente.id = schedaTecnicaNutrienteId;
				schedaTecnicaNutriente.valore = $(this).find('.dichiarazioneNutrizionaleNutrienteValore').val();

				schedaTecnicaNutrienti.push(schedaTecnicaNutriente);
			});
			schedaTecnica.schedaTecnicaNutrienti = schedaTecnicaNutrienti;

		}

		let analisiLength = $('.analisiRow').length;
		if(analisiLength != null && analisiLength !== 0){
			let schedaTecnicaAnalisi = [];
			$('.analisiRow').each(function(i, item){
				let analisi = {};
				let analisiId = {};
				analisiId.analisiId = $(this).find('.analisiAnalisi option:selected').val();

				analisi.id = analisiId;
				analisi.risultato = $(this).find('.analisiRisultato').val();

				schedaTecnicaAnalisi.push(analisi);
			});
			schedaTecnica.schedaTecnicaAnalisi = schedaTecnicaAnalisi;
		}

		let raccoltaLength = $('.raccoltaRow').length;
		if(raccoltaLength != null && raccoltaLength !== 0){
			let schedaTecnicaRaccolte = [];
			$('.raccoltaRow').each(function(i, item){
				let schedaTecnicaRaccolta = {};
				let schedaTecnicaRaccoltaId = {};
				schedaTecnicaRaccoltaId.materialeId = $(this).find('.raccoltaMateriale option:selected').val();

				schedaTecnicaRaccolta.id = schedaTecnicaRaccoltaId;

				let raccolta = {};
				raccolta.id = $(this).find('.raccoltaRaccolta option:selected').val();
				schedaTecnicaRaccolta.raccolta = raccolta;

				schedaTecnicaRaccolte.push(schedaTecnicaRaccolta);
			});
			schedaTecnica.schedaTecnicaRaccolte = schedaTecnicaRaccolte;
		}

		var schedaTecnicaJson = JSON.stringify(schedaTecnica);

		$.ajax({
			url: baseUrl + "schede-tecniche/" + idProduzione + "/" + idArticolo + "/scheda-tecnica",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: schedaTecnicaJson,
			success: function(result) {
				let idSchedaTecnica = result.id;
				$('#alertRicettaSchedaTecnica').empty().append(alertContent.replace('@@alertText@@','Scheda tecnica creata con successo').replace('@@alertResult@@', 'success'));

				window.open(baseUrl + "stampe/schede-tecniche/"+idSchedaTecnica, '_blank');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertRicettaSchedaTecnica').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della scheda tecnica').replace('@@alertResult@@', 'danger'));
			}
		});

	});

});

$.fn.cloneRowDichiarazioneNutrizionale = function(row){
	var newRow = row.clone();
	newRow.addClass('dichiarazioneNutrizionaleRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function( index ) {
		$(this).remove();
	});
	newRow.find('input').each(function( index ) {
		$(this).val(null);
	});
	newRow.find('.addDichiarazioneNutrizionale').each(function( index ) {
		$(this).remove();
	});
	var removeLink = '<a href="#" class="removeDichiarazioneNutrizionale"><i class="fas fa-minus"></i></a>';
	newRow.find('.linkDichiarazioneNutrizionale').after(removeLink);
	$('.dichiarazioneNutrizionaleRow').last().after(newRow);

	return newRow;
}

$.fn.cloneRowAnalisi = function(row){
	var newRow = row.clone();
	newRow.addClass('analisiRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function( index ) {
		$(this).remove();
	});
	newRow.find('input').each(function( index ) {
		$(this).val(null);
	});
	newRow.find('.addAnalisi').each(function( index ) {
		$(this).remove();
	});
	var removeLink = '<a href="#" class="removeAnalisi"><i class="fas fa-minus"></i></a>';
	newRow.find('.linkAnalisi').after(removeLink);
	$('.analisiRow').last().after(newRow);

	return newRow;
}

$.fn.cloneRowRaccolta = function(row){
	var newRow = row.clone();
	newRow.addClass('raccoltaRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function( index ) {
		$(this).remove();
	});
	newRow.find('input').each(function( index ) {
		$(this).val(null);
	});
	newRow.find('.addRaccolta').each(function( index ) {
		$(this).remove();
	});
	var removeLink = '<a href="#" class="removeRaccolta"><i class="fas fa-minus"></i></a>';
	newRow.find('.linkRaccolta').after(removeLink);
	$('.raccoltaRow').last().after(newRow);

	return newRow;
}

$.fn.getAnagrafiche = function(){

	$.ajax({
		url: baseUrl + "anagrafiche/analisi-microbiologiche?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('.analisiAnalisi').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "anagrafiche/imballi?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				var selected = '';
				$.each(result, function(i, item){
					if(i === 0){
						selected = 'selected';
					}
					$('#imballo').append('<option value="'+item.id+'" >'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "anagrafiche/materiali?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('.raccoltaMateriale').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "anagrafiche/nutrienti?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('.dichiarazioneNutrizionaleNutriente').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "anagrafiche/raccolte-differenziate?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('.raccoltaRaccolta').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "anagrafiche/tipologie-confezionamento?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#tipologiaConfezionamento').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getSchedaTecnica = function(idProduzione, idArticolo){

	var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent +=  '<strong>Errore nel recupero della scheda tecnica.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "schede-tecniche/" + idProduzione + "/" + idArticolo + "/scheda-tecnica",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){

				let idSchedaTecnica;
				if(result.objectType !== null && result.objectType === 'view'){
					idSchedaTecnica = result.idSchedaTecnica;
				} else {
					try {
						idSchedaTecnica = parseInt(result.id);
						if(isNaN(idSchedaTecnica)) throw "not a number";
					} catch(err) {
						idSchedaTecnica = result.idSchedaTecnica;
					}
				}

				$('#hiddenIdSchedaTecnica').val(idSchedaTecnica);
				$('#hiddenIdProduzione').val(result.idProduzione);
				$('#hiddenIdArticolo').val(result.idArticolo);

				$('#numRevisione').val(result.numRevisione);
				$('#anno').val(result.anno);
				$('#data').val(result.data);
				$('#codiceProdotto').val(result.codiceProdotto);
				$('#prodotto').val(result.prodotto);
				$('#prodotto2').val(result.prodotto2);
				$('#pesoNettoConfezione').val(result.pesoNettoConfezione);
				$('#durata').val(result.durata);
				$('#ingredienti').val(result.ingredienti);
				$('#tracce').val(result.tracce);
				$('#conservazione').val(result.conservazione);
				$('#consigliConsumo').val(result.consigliConsumo);
				if(result.tipologiaConfezionamento != null){
					$('#tipologiaConfezionamento option[value="' + result.tipologiaConfezionamento.id +'"]').attr('selected', true);
				}
				if(result.imballo != null){
					$('#imballo option[value="' + result.imballo.id +'"]').attr('selected', true);
				}
				$('#imballoDimensioni').val(result.imballoDimensioni);

				if(result.schedaTecnicaNutrienti != null && result.schedaTecnicaNutrienti.length !== 0){
					let schedaTecnicaNutrienti = result.schedaTecnicaNutrienti;
					schedaTecnicaNutrienti.sort(function(a,b){
						let nutriente1 = a.nutriente.ordine;
						let nutriente2 = b.nutriente.ordine;
						return ((nutriente1 > nutriente2) ? 1 : ((nutriente1 < nutriente2) ? -1 : 0));
					});

					$.each(schedaTecnicaNutrienti, function(i, item){
						let id = item.id;
						let nutrienteId = id.nutrienteId;
						let row;
						if(i === 0){
							row = $('#dichiarazioneNutrizionaleRow1');
						} else {
							row = $.fn.cloneRowDichiarazioneNutrizionale($('#dichiarazioneNutrizionaleRow1'));
						}
						row.find('.dichiarazioneNutrizionaleNutriente option[value="' + nutrienteId +'"]').attr('selected', true);
						row.find('.dichiarazioneNutrizionaleNutrienteValore').val(item.valore);
					});
				}

				if(result.schedaTecnicaAnalisi != null && result.schedaTecnicaAnalisi.length !== 0){
					let schedaTecnicaAnalisi = result.schedaTecnicaAnalisi;
					schedaTecnicaAnalisi.sort(function(a,b){
						let analisi1 = a.analisi.ordine;
						let analisi2 = b.analisi.ordine;
						return ((analisi1 > analisi2) ? 1 : ((analisi1 < analisi2) ? -1 : 0));
					});

					$.each(schedaTecnicaAnalisi, function(i, item){
						let id = item.id;
						let analisiId = id.analisiId;
						let row;
						if(i === 0){
							row = $('#analisiRow1');
						} else {
							row = $.fn.cloneRowAnalisi($('#analisiRow1'));
						}
						row.find('.analisiAnalisi option[value="' + analisiId +'"]').attr('selected', true);
						row.find('.analisiRisultato').val(item.risultato);
					});
				}

				if(result.schedaTecnicaRaccolte != null && result.schedaTecnicaRaccolte.length !== 0){
					let schedaTecnicaRaccolte = result.schedaTecnicaRaccolte;
					schedaTecnicaRaccolte.sort(function(a,b){
						let materiale1 = a.materiale.ordine;
						let materiale2 = b.materiale.ordine;
						return ((materiale1 > materiale2) ? 1 : ((materiale1 < materiale2) ? -1 : 0));
					});

					$.each(schedaTecnicaRaccolte, function(i, item){
						let id = item.id;
						let materialeId = id.materialeId;
						let row;
						if(i === 0){
							row = $('#raccoltaRow1');
						} else {
							row = $.fn.cloneRowRaccolta($('#raccoltaRow1'));
						}
						row.find('.raccoltaMateriale option[value="' + materialeId +'"]').attr('selected', true);
						row.find('.raccoltaRaccolta option[value="' + item.raccolta.id +'"]').attr('selected', true);
					});
				}

			} else{
				$('#alertRicetta').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertRicetta').append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}