var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	let printEtichettaButton = $('#printEtichettaButton');
	if(printEtichettaButton != null){

		$(document).on('submit','#printEtichettaForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertEtichettaContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
			alertContent += '<strong>Stampa in corso...</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertEtichetta').empty().append(alertContent);

			let etichettaRequest = {};
			etichettaRequest.idProduzioneConfezione = $('#hiddenIdProduzioneConfezione').val();
			etichettaRequest.articolo = $('#articolo').val();
			etichettaRequest.ingredienti = $('#ingredienti').html();
			etichettaRequest.tracce = $('#tracce').val();
			etichettaRequest.conservazione = $('#conservazione').val();
			etichettaRequest.valoriNutrizionali = $('#valoriNutrizionali').val();
			etichettaRequest.dataConsumazione = $('#dataConsumazione').val();
			etichettaRequest.lotto = $('#lotto').val();
			etichettaRequest.peso = $('#peso').val();
			etichettaRequest.disposizioniComune = $('#disposizioniComune').val();
			etichettaRequest.footer = $('#footer').val();
			etichettaRequest.barcodeEan13 = $('#barcodeEan13').val();
			etichettaRequest.barcodeEan128 = $('#barcodeEan128').val();
			etichettaRequest.idDispositivo = $('#stampante option:selected').val();

			$.ajax({
				url: baseUrl + "etichette/stampa",
				type: 'POST',
				contentType: "application/json",
				data: JSON.stringify(etichettaRequest),
				success: function() {
					alertContent = '<div id="alertEtichettaContent" class="alert alert-success alert-dismissible fade show" role="alert">';
					alertContent += '<strong>Stampa eseguita con successo</strong>\n' +
						'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertEtichetta').empty().append(alertContent);

				},
				error: function(jqXHR) {
					var errorMessage = 'Errore nella stampa dell\'etichetta';
					if(jqXHR != null){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson !== ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage !== ''){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					alertContent = '<div id="alertEtichettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent += '<strong>'+errorMessage+'</strong>\n' +
						'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertEtichetta').empty().append(alertContent);
				}
			});

		});

		$(document).on('click','#downloadEtichettaButton', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertEtichettaContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
			alertContent += '<strong>Download in corso...</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertEtichetta').empty().append(alertContent);

			let etichettaRequest = {};
			etichettaRequest.idProduzioneConfezione = $('#hiddenIdProduzioneConfezione').val();
			etichettaRequest.articolo = $('#articolo').val();
			etichettaRequest.ingredienti = $('#ingredienti').html();
			etichettaRequest.tracce = $('#tracce').val();
			etichettaRequest.conservazione = $('#conservazione').val();
			etichettaRequest.valoriNutrizionali = $('#valoriNutrizionali').val();
			etichettaRequest.dataConsumazione = $('#dataConsumazione').val();
			etichettaRequest.lotto = $('#lotto').val();
			etichettaRequest.peso = $('#peso').val();
			etichettaRequest.disposizioniComune = $('#disposizioniComune').val();
			etichettaRequest.footer = $('#footer').val();
			etichettaRequest.barcodeEan13 = $('#barcodeEan13').val();
			etichettaRequest.barcodeEan128 = $('#barcodeEan128').val();
			etichettaRequest.idDispositivo = $('#stampante option:selected').val();

			let url = baseUrl + "etichette/download";

			$.ajax({
				url: url,
				type: 'POST',
				contentType: "application/json",
				data: JSON.stringify(etichettaRequest),
				xhr: function() {
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function() {
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
				success: function(response, status, xhr){

					var contentDisposition = xhr.getResponseHeader("Content-Disposition");
					var fileName = contentDisposition.substring(contentDisposition.indexOf("; ") + 1);
					fileName = fileName.replace("filename=","").trim();

					var blob = new Blob([response], { type: "application/txt" });
					var downloadUrl = URL.createObjectURL(blob);
					var a = document.createElement("a");
					a.href = downloadUrl;
					a.download = fileName;
					document.body.appendChild(a);
					a.click();
					a.remove();
					window.URL.revokeObjectURL(url);

					$('#alertEtichetta').empty();
				},
				error: function(jqXHR) {
					var errorMessage = 'Errore nel download del file';
					if(jqXHR != null){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson !== ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage !== ''){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					alertContent = '<div id="alertEtichettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent += '<strong>'+errorMessage+'</strong>\n' +
						'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertEtichetta').empty().append(alertContent);
				}
			});
		});

	}

});

$.fn.extractIdProduzioneConfezioneFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idProduzioneConfezione') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.getProduzioneConfezioneEtichetta = function(idProduzioneConfezione){

	var alertContent = '<div id="alertEtichettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent +=  '<strong>Errore nel recupero della produzione.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "produzioni/etichetta?idProduzioneConfezione=" + idProduzioneConfezione,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$('#hiddenIdProduzioneConfezione').val(result.id);
				$('#articolo').val(result.articolo);
				$('#ingredienti').html(result.ingredienti);
				$('#ingredienti2').val(result.ingredienti2);
				$('#lotto').val(result.lotto);
				$('#conservazione').val(result.conservazione);
				$('#valoriNutrizionali').val(result.valoriNutrizionali);
				$('#dataConsumazione').val(result.scadenza);
				$('#barcodeEan13').val(result.barcodeEan13);
				$('#barcodeEan128').val(result.barcodeEan128);
				$('#peso').val(result.pesoKg);

				$.fn.preloadFields();
			} else{
				$('#alertEtichetta').empty().append(alertContent);
			}
		},
		error: function(jqXHR) {
			$('#alertEtichetta').append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.preloadFields = function(){

	var alertContent = '<div id="alertEtichettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent +=  '<strong>Errore nel recupero delle stampanti.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$('#disposizioniComune').val('Verifica le disposizioni del tuo comune');
	$('#footer').val('Prodotto e confezionato da:\r\nURBANI ELIA E MARTA\r\nVia 11 Settembre, 17 SAN GIOVANNI ILARIONE (VR)\r\nTEL. 045/6550993 CEL. 328/4694654\r\nwww.urbanialimentari.com');

	$.ajax({
		url: baseUrl + "utils/stampanti?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					var selected;
					if(item.predefinito){
						selected = 'selected';
					}
					$('#stampante').append('<option value="'+item.id+'" '+selected+'>'+item.nome+'</option>');
				});

			} else{
				$('#alertEtichetta').empty().append(alertContent);
			}
		},
		error: function() {
			$('#alertEtichetta').append(alertContent);
		}
	});
}
