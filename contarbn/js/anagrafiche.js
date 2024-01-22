var baseUrl = "/contarbn-be/";
const pageTitlePrefix = "ContaRbn - ";
const tipoMap = new Map();
tipoMap.set("analisi-microbiologiche", {
	pageTitle:"Analisi microbiologiche", headerPageList:"Elenco analisi microbiologiche", headerPageNew:"Nuova analisi microbiologica", headerPageEdit:"Modifica analisi microbiologica", tipologiaAnagrafica:"ANALISI_MICROBIOLOGICA"
});
tipoMap.set("imballi", {
	pageTitle:"Imballi", headerPageList:"Elenco imballi", headerPageNew:"Nuovo imballo", headerPageEdit:"Modifica imballo", tipologiaAnagrafica:"IMBALLO"
});
tipoMap.set("materiali", {
	pageTitle:"Materiali", headerPageList:"Elenco materiali", headerPageNew:"Nuovo materiale", headerPageEdit:"Modifica materiale", tipologiaAnagrafica:"MATERIALE"
});
tipoMap.set("nutrienti", {
	pageTitle:"Nutrienti", headerPageList:"Elenco nutrienti", headerPageNew:"Nuovo nutriente", headerPageEdit:"Modifica nutriente", tipologiaAnagrafica:"NUTRIENTE"
});
tipoMap.set("raccolte-differenziate", {
	pageTitle:"Raccolte differenziate", headerPageList:"Elenco raccolte differenziate", headerPageNew:"Nuova raccolta differenziata", headerPageEdit:"Modifica raccolta differenziata", tipologiaAnagrafica:"RACCOLTA_DIFFERENZIATA"
});
tipoMap.set("tipologie-confezionamento", {
	pageTitle:"Tipologie confezionamento", headerPageList:"Elenco tipologie confezionamento", headerPageNew:"Nuova tipologia confezionamento", headerPageEdit:"Modifica tipologia confezionamento", tipologiaAnagrafica:"TIPOLOGIA_CONFEZIONAMENTO"
});


$.fn.setTipoAnagrafica = function(tipo){
	let tipoMapValue = tipoMap.get(tipo);

	$("#hiddenTipoAnagrafica").val(tipo);
	$('#anagraficaNewLink').attr('href', 'anagrafiche-new.html?tipo='+tipo);

	let pathName = window.location.pathname;
	if(pathName.includes("anagrafiche.html")){
		$('title').text(pageTitlePrefix + tipoMapValue.pageTitle);
		$('#headerPagina').text(tipoMapValue.headerPageList);
	} else if(pathName.includes("anagrafiche-new.html")){
		$('title').text(pageTitlePrefix + tipoMapValue.pageTitle + " Nuovo");
		$('#headerPagina').text(tipoMapValue.headerPageNew);
		$('#undoAnagraficaLink').attr('href', 'anagrafiche.html?tipo='+tipo);
	} else if(pathName.includes("anagrafiche-edit.html")){
		$('title').text(pageTitlePrefix + tipoMapValue.pageTitle + " Modifica");
		$('#headerPagina').text(tipoMapValue.headerPageEdit);
		$('#undoAnagraficaLink').attr('href', 'anagrafiche.html?tipo='+tipo);
	}
}

$.fn.getAnagrafica = function(idAnagrafica){

	var alertContent = '<div id="alertAnagraficaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent += '<strong>Errore nel recupero dell\' anagrafica.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "anagrafiche/"+idAnagrafica,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$('#hiddenIdAnagrafica').val(result.id);
				$('#nome').val(result.nome);
				$('#ordine').val(result.ordine);
				if(result.attivo === true){
					$('#attivo').prop('checked', true);
				}
			} else{
				$('#alertAnagrafica').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
			$('#alertAnagrafica').empty().append(alertContent);
		}
	});
}

$(document).ready(function() {

	var tipo = $("#hiddenTipoAnagrafica").val();

	$('#anagraficheTable').DataTable({
		"ajax": {
			"url": baseUrl + "anagrafiche/"+tipo,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertAnagraficaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dell\'anagrafica</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAnagrafica').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna anagrafica disponibile",
			"zeroRecords": "Nessuna anagrafica disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc'],
			[2, 'asc'],
			[1, 'asc']
		],
		"columns": [
			{"name": "attivo", "data": "attivo", "visible":false},
			{"name": "nome", "data": "nome"},
			{"name": "ordine", "data": "ordine"},
			{"data": null, "orderable":false, "width":"12%", render: function ( data, type, row ) {
				var links = '<a class="updateAnagrafica pr-2" data-id="'+data.id+'" href="anagrafiche-edit.html?id=' + data.id + '&tipo='+tipo+'"><i class="far fa-edit"></i></a>';
				links += '<a class="deleteAnagrafica" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			if(!data.attivo){
				$(row).css('background-color', '#d2d4d2');
			}
		}
	});

	$(document).on('click','.deleteAnagrafica', function(){
		var idAnagrafica = $(this).attr('data-id');
		$('#confirmDeleteAnagrafica').attr('data-id', idAnagrafica);
		$('#deleteAnagraficaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteAnagrafica', function(){
		$('#deleteAnagraficaModal').modal('hide');
		var idAnagrafica = $(this).attr('data-id');

		var alertContent = '<div id="alertAnagraficaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '@@alertText@@\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "anagrafiche/" + idAnagrafica,
			type: 'DELETE',
			success: function() {
				$('#alertAnagrafica').empty().append(alertContent.replace('@@alertText@@','Anagrafica cancellata con successo').replace('@@alertResult@@', 'success'));

				$('#anagraficheTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = "Errore nella cancellazione. L'anagrafica potrebbe essere in uso";
				var responseText = jqXHR.responseText;
				if(responseText !== undefined){
					console.log('Response text: ' + responseText);
				}

				$('#alertAnagrafica').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('submit','#newAnagraficaForm', function(event){
		event.preventDefault();

		let tipo = $('#hiddenTipoAnagrafica').val();
		let tipoMapValue = tipoMap.get(tipo);

		let anagrafica = {};
		anagrafica.tipo = tipoMapValue.tipologiaAnagrafica;
		anagrafica.nome = $('#nome').val();
		anagrafica.ordine = $('#ordine').val();
		anagrafica.attivo = $('#attivo').prop('checked') === true;

		let anagraficaJson = JSON.stringify(anagrafica);

		let alertContent = '<div id="alertAnagraficaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "anagrafiche",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: anagraficaJson,
			success: function(result) {
				$('#alertAnagrafica').empty().append(alertContent.replace('@@alertText@@','Anagrafica creata con successo').replace('@@alertResult@@', 'success'));

				setTimeout(function() {
					window.location.href = "anagrafiche.html?tipo="+tipo;
				}, 1000);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				let errorMessage = "Errore nella creazione dell\' anagrafica";
				let responseText = jqXHR.responseText;
				if(responseText !== undefined){
					console.log('Response text: ' + responseText);
					errorMessage = JSON.parse(responseText).message;
				}
				$('#alertAnagrafica').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('submit','#editAnagraficaForm', function(event){
		event.preventDefault();

		let tipo = $('#hiddenTipoAnagrafica').val();
		let tipoMapValue = tipoMap.get(tipo);

		let idAnagrafica = $('#hiddenIdAnagrafica').val();

		let anagrafica = {};
		anagrafica.id = idAnagrafica;
		anagrafica.tipo = tipoMapValue.tipologiaAnagrafica;
		anagrafica.nome = $('#nome').val();
		anagrafica.ordine = $('#ordine').val();
		anagrafica.attivo = $('#attivo').prop('checked') === true;

		var anagraficaJson = JSON.stringify(anagrafica);

		var alertContent = '<div id="alertAnagraficaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "anagrafiche/" + idAnagrafica,
			type: 'PUT',
			contentType: "application/json",
			dataType: 'json',
			data: anagraficaJson,
			success: function(result) {
				$('#alertAnagrafica').empty().append(alertContent.replace('@@alertText@@','Anagrafica modificata con successo').replace('@@alertResult@@', 'success'));

				setTimeout(function() {
					window.location.href = "anagrafiche.html?tipo="+tipo;
				}, 1000);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				let errorMessage = "Errore nella modifica dell\' anagrafica";
				let responseText = jqXHR.responseText;
				if(responseText !== undefined){
					console.log('Response text: ' + responseText);
					errorMessage = JSON.parse(responseText).message;
				}
				$('#alertAnagrafica').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	});

});