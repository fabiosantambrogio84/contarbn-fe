var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('[data-toggle="tooltip"]').tooltip();

	$.fn.loadSchedeTecnicheTable(baseUrl + "schede-tecniche/search");

	$(document).on('click','.addRaccolta', function(event){
		event.preventDefault();

		let raccoltaRow = $(this).parent().parent().parent().parent();
		let newRaccoltaRow = $.fn.cloneRowRaccolta(raccoltaRow);

		newRaccoltaRow.find('.raccoltaMateriale').focus();
	});

	$(document).on('click','.removeRaccolta', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().remove();
	});

	$(document).on('click','.downloadSchedaTecnica', function(event){
		event.preventDefault();
		window.open(baseUrl + "stampe/schede-tecniche/"+$(this).attr('data-id'), '_blank');
	});

	$(document).on('click','.deleteSchedaTecnica', function(){
		$('#confirmDeleteSchedaTecnica').attr('data-id', $(this).attr('data-id'));
		$('#deleteSchedaTecnicaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteSchedaTecnica', function(){
		$('#deleteSchedaTecnicaModal').modal('hide');
		let idSchedaTecnica = $(this).attr('data-id');

		let alertContent = '<div id="alertSchedaTecnicaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '@@alertText@@\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "schede-tecniche/" + idSchedaTecnica,
			type: 'DELETE',
			success: function() {
				$('#alertSchedaTecnica').empty().append(alertContent.replace('@@alertText@@','Scheda tecnica cancellata con successo').replace('@@alertResult@@', 'success'));

				$('#schedeTecnicheTable').DataTable().ajax.reload();
			},
			error: function() {
				$('#alertSchedaTecnica').empty().append(alertContent.replace('@@alertText@@','Errore nella cancellazione della scheda tecnica').replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('click','.emailSchedaTecnica', function(){
		$('#confirmSendEmailSchedaTecnica').attr('data-id', $(this).attr('data-id'));
		$('#sendEmailSchedaTecnicaModal').modal('show');
	});

	$(document).on('click','#confirmSendEmailSchedaTecnica', function(){
		$('#sendEmailSchedaTecnicaModal').modal('hide');
		let idSchedaTecnica = $(this).attr('data-id');
		let email = $('#email').val();

		let alertContent = '<div id="alertSchedaTecnicaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@\n <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		if(!email.includes("@")){
			$('#alertSchedaTecnica').empty().append(alertContent.replace('@@alertText@@', 'Indirizzo email non valido.').replace('@@alertResult@@', 'danger'));
			return;
		}

		let url = baseUrl + "emails/schede-tecniche/" + idSchedaTecnica;

		let body = {};
		body.to = email;

		$('#alertSchedaTecnica').empty().append(alertContent.replace('@@alertText@@', 'Invio email in corso...').replace('@@alertResult@@', 'warning'));

		$.ajax({
			url: url,
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(body),
			success: function() {
				$('#alertSchedaTecnica').empty().append(alertContent.replace('@@alertText@@', 'Email inviata con successo.').replace('@@alertResult@@', 'success'));
				$('#schedeTecnicheTable').DataTable().ajax.reload();
			},
			error: function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
				$('#alertSchedaTecnica').empty().append(alertContent.replace('@@alertText@@', "Errore nell'invio dell'email").replace('@@alertResult@@', 'danger'));
			}
		});
	});

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
			error: function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	$(document).on('submit', '#searchSchedaTecnicaForm', function (event) {
		event.preventDefault();

		let url = $.fn.createUrlSearch("schede-tecniche/search?");

		$('#schedeTecnicheTable').DataTable().destroy();
		$.fn.loadSchedeTecnicheTable(url);

	});

	$(document).on('click','#resetSearchSchedaTecnicaButton', function(){
		$('#searchSchedaTecnicaForm :input').val(null);
		$('#searchSchedaTecnicaForm select option[value=""]').attr('selected', true);

		$('#schedeTecnicheTable').DataTable().destroy();
		$.fn.loadSchedeTecnicheTable(baseUrl + "schede-tecniche/search");
	});

	$(document).on('submit','#saveSchedaTecnicaForm', function(event){
		event.preventDefault();

		let alertContent = '<div id="alertRicettaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '@@alertText@@\n' +
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
		schedaTecnica.ingredienti = $('#ingredienti').html();
		schedaTecnica.tracce = $('#tracce').val();
		schedaTecnica.conservazione = $('#conservazione').val();
		schedaTecnica.consigliConsumo = $('#consigliConsumo').val();
		schedaTecnica.tipologiaConfezionamento = {"id":$('#tipologiaConfezionamento').val()};
		schedaTecnica.imballo = {"id":$('#imballo').val()};
		schedaTecnica.imballoDimensioni = $('#imballoDimensioni').val();

		let dichiarazioneNutrizionaleLength = $('.dichiarazioneNutrizionaleRow').length;
		if(dichiarazioneNutrizionaleLength != null && dichiarazioneNutrizionaleLength !== 0){
			let schedaTecnicaNutrienti = [];
			$('.dichiarazioneNutrizionaleRow').each(function(){
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
			$('.analisiRow').each(function(){
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
			$('.raccoltaRow').each(function(){
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

		$.ajax({
			url: baseUrl + "schede-tecniche/" + idProduzione + "/" + idArticolo + "/scheda-tecnica",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: JSON.stringify(schedaTecnica),
			success: function(result) {
				$('#alertRicettaSchedaTecnica').empty().append(alertContent.replace('@@alertText@@','Scheda tecnica creata con successo').replace('@@alertResult@@', 'success'));

				window.open(baseUrl + "stampe/schede-tecniche/"+result.id, '_blank');

			},
			error: function() {
				$('#alertRicettaSchedaTecnica').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della scheda tecnica').replace('@@alertResult@@', 'danger'));
			}
		});

	});

});

$.fn.loadSchedeTecnicheTable = function(url) {
	$('#schedeTecnicheTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "data",
			"error": function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
				let alertContent = '<div id="alertSchedaTecnicaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent += '<strong>Errore nel recupero delle schede tecniche</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertSchedaTecnica').empty().append(alertContent);
			}
		},
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna scheda tecnica disponibile",
			"zeroRecords": "Nessuna scheda tecnica disponibile",
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
			[1, 'desc'],
			[2, 'desc'],
			[0, 'asc']
		],
		"columns": [
			{"name": "prodotto_descr", "data": "prodottoDescr", "width":"20%"},
			{"name": "num_revisione", "data": "numRevisione", "width":"8%"},
			{"name": "data", "data": null, "width":"8%", render: function (data) {
				let a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"data": null, "orderable":false, "width":"10%", render: function (data) {
				let links = '<a class="downloadSchedaTecnica pr-2" data-id="'+data.id+'" href="#" title="Download"><i class="fas fa-file-download"></i></a>';
				links += '<a class="emailSchedaTecnica pr-1" data-id="'+data.id+'" data-email-to="" href="#" title="Invio email"><i class="fa fa-envelope"></i></a>';
				links += '<a class="deleteSchedaTecnica" data-id="'+data.id+'" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row){
			$(row).css('font-size', '12px');
		}
	});
}

$.fn.cloneRowDichiarazioneNutrizionale = function(row){
	let newRow = row.clone();
	newRow.addClass('dichiarazioneNutrizionaleRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function() {
		$(this).remove();
	});
	newRow.find('input').each(function() {
		$(this).val(null);
	});
	$('.dichiarazioneNutrizionaleRow').last().after(newRow);

	return newRow;
}

$.fn.cloneRowAnalisi = function(row){
	let newRow = row.clone();
	newRow.addClass('analisiRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function() {
		$(this).remove();
	});
	newRow.find('input').each(function() {
		$(this).val(null);
	});
	$('.analisiRow').last().after(newRow);

	return newRow;
}

$.fn.cloneRowRaccolta = function(row){
	let newRow = row.clone();
	newRow.addClass('raccoltaRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function() {
		$(this).remove();
	});
	newRow.find('input').each(function() {
		$(this).val(null);
	});
	newRow.find('.addRaccolta').each(function() {
		$(this).remove();
	});
	let removeLink = '<a href="#" class="removeRaccolta"><i class="fas fa-minus"></i></a>';
	newRow.find('.linkRaccolta').after(removeLink);
	$('.raccoltaRow').last().after(newRow);

	return newRow;
}

$.fn.createUrlSearch = function(path){
	let prodotto = $('#searchProdotto').val();

	let params = {};
	if(prodotto != null && prodotto !== ''){
		params.prodotto = prodotto;
	}
	return baseUrl + path + $.param( params );
};

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
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "anagrafiche/imballi?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				let selected = '';
				$.each(result, function(i, item){
					if(i === 0){
						selected = 'selected';
					}
					$('#imballo').append('<option value="'+item.id+'" >'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR) {
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
		error: function(jqXHR) {
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
		error: function(jqXHR) {
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
		error: function(jqXHR) {
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
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getSchedaTecnica = function(idProduzione, idArticolo){

	let alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent +=  '<strong>Errore nel recupero della scheda tecnica.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "schede-tecniche/" + idProduzione + "/" + idArticolo + "/scheda-tecnica",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){

				let idSchedaTecnica;
				try {
					idSchedaTecnica = parseInt(result.id);
					if(isNaN(idSchedaTecnica)) throw "not a number";
				} catch(err) {
					idSchedaTecnica = result.id;
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
				$('#ingredienti').html(result.ingredienti);
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
		error: function(jqXHR) {
			$('#alertRicetta').append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}