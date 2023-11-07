var baseUrl = "/contarbn-be/";

$.fn.loadEtichetteTable = function(url) {
	$('#etichetteTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "data",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertEtichettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle produzioni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertEtichetta').empty().append(alertContent);
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
				var links = '<a class="pr-2" data-id="'+data.idProduzione+'" href="etichette-new.html?idProduzione='+data.idProduzione+'" title="Genera etichetta"><i class="fas fa-tag"></i></a>';
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

	$.fn.loadEtichetteTable(baseUrl + "produzioni/search");

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

	if($('#searchEtichettaButton') != null && $('#searchEtichettaButton') != undefined) {
		$(document).on('submit', '#searchEtichettaForm', function (event) {
			event.preventDefault();

			var url = $.fn.createUrlSearch("produzioni/search?");

			$('#etichetteTable').DataTable().destroy();
			$.fn.loadEtichetteTable(url);

		});

		$(document).on('click','#resetSearchEtichettaButton', function(){
			$('#searchEtichettaForm :input').val(null);
			$('#searchEtichettaForm select option[value=""]').attr('selected', true);

			$('#etichetteTable').DataTable().destroy();
			$.fn.loadEtichetteTable(baseUrl + "produzioni/search");
		});
	}

	if($('#newEtichettaButton') != null && $('#newEtichettaButton') != undefined){

		$(document).on('change','#caricaBarcode', function(){
			var isChecked = $('#caricaBarcode').prop('checked');
			if(isChecked){
				$('#barcodeEan13').val(null);
				$('#barcodeEan128').val(null);
				$('#barcodeEan13').attr('disabled', true);
				$('#barcodeEan128').attr('disabled', true);
				$('#barcodeEan13File').removeAttr('disabled');
				$('#barcodeEan128File').removeAttr('disabled');
			} else{
				$('#barcodeEan13').removeAttr('disabled');
				$('#barcodeEan128').removeAttr('disabled');
				$('#barcodeEan13File').val(null);
				$('#barcodeEan128File').val(null);
				$('#barcodeEan13File').attr('disabled', true);
				$('#barcodeEan128File').attr('disabled', true);
			}
		});

		$(document).on('submit','#newEtichettaForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertEtichettaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var barcodeEan13 = $('#barcodeEan13').val();
			var barcodeEan128 = $('#barcodeEan128').val();
			var barcodeEan13File;
			if($('#barcodeEan13File') != null && $('#barcodeEan13File')[0] != null){
				barcodeEan13File = $('#barcodeEan13File')[0].files[0];
			}
			var barcodeEan128File;
			if($('#barcodeEan128File') != null && $('#barcodeEan128File')[0] != null){
				barcodeEan128File = $('#barcodeEan128File')[0].files[0];
			}
			if($.fn.checkVariableIsNull(barcodeEan13) && !barcodeEan13File){
				$('#alertEtichetta').empty().append(alertContent.replace('@@alertText@@', "Inserire un valore o caricare un file per il barcode EAN 13 ").replace('@@alertResult@@', 'danger'));
				return false;
			}
			if($.fn.checkVariableIsNull(barcodeEan128) && !barcodeEan128File){
				$('#alertEtichetta').empty().append(alertContent.replace('@@alertText@@', "Inserire un valore o caricare un file per il barcode EAN 128 ").replace('@@alertResult@@', 'danger'));
				return false;
			}


			var idProduzione = $('#hiddenIdProduzione').val();
			var articolo = $('#articolo').val();
			var ingredienti = $('#ingredienti').val();
			var ingredienti2 = $('#ingredienti2').val();
			var conservazione = $('#conservazione').val();
			var valoriNutrizionali = $('#valoriNutrizionali').val();
			var dataConsumazione = $('#dataConsumazione').val();
			var lotto = $('#lotto').val();
			var peso = $('#peso').val();
			var disposizioniComune = $('#disposizioniComune').val();
			var footer = $('#footer').val();

			var data = new FormData();
			data.append('idProduzione', idProduzione);
			data.append('articolo', articolo);
			data.append('ingredienti', ingredienti);
			data.append('ingredienti2', ingredienti2);
			data.append('conservazione', conservazione);
			data.append('valoriNutrizionali', valoriNutrizionali);
			data.append('dataConsumazione', dataConsumazione);
			data.append('lotto', lotto);
			data.append('peso', peso);
			data.append('disposizioniComune', disposizioniComune);
			data.append('footer', footer);
			data.append('barcodeEan13File', barcodeEan13File);
			data.append('barcodeEan128File', barcodeEan128File);
			data.append('barcodeEan13', barcodeEan13);
			data.append('barcodeEan128', barcodeEan128);

			$.ajax({
				url: baseUrl + "etichette/genera",
				type: 'POST',
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				success: function(result) {
					var filename = result.filename;
					var uuid = result.uuid;

					$("#labelHtmlDiv").load(baseUrl+"etichette/"+uuid, function(response, status, xhr) {
						if(status === "error") {
							$('#alertEtichetta').empty().append(alertContent.replace('@@alertText@@',"Errore nella generazione dell'etichetta").replace('@@alertResult@@', 'danger'));
						} else {
							$('#downloadEtichetta').attr('data-uuid', uuid);
							$('#downloadEtichetta').attr('data-filename', filename);

							$("#previewEtichettaModal").on("shown.bs.modal", function () {
								$.fn.adjustText();
							});
							$('#previewEtichettaModal').modal('show');
						}
					});

				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertEtichetta').empty().append(alertContent.replace('@@alertText@@',"Errore nella generazione dell'etichetta").replace('@@alertResult@@', 'danger'));
				}
			});

		});

		$(document).on('click','#downloadEtichetta', function(event){
			event.preventDefault();

			var filename = $('#downloadEtichetta').attr('data-filename');
			filename = filename.replaceAll('.html', '.png');
			$('#previewEtichettaModal').modal('hide');

			html2canvas(document.getElementById("labelRoot"),{
				allowTaint: true,
				useCORS: true
			}).then(function (canvas) {
				var anchorTag = document.createElement("a");
				document.body.appendChild(anchorTag);
				//document.getElementById("previewImg").appendChild(canvas);
				anchorTag.download = filename;
				anchorTag.href = canvas.toDataURL();
				anchorTag.target = '_blank';
				anchorTag.click();
			});
		});

		$(document).on('click','.closePreviewEtichettaModal', function(event){
			event.preventDefault();

			var uuid = $('#downloadEtichetta').attr('data-uuid');
			var url = baseUrl + "etichette/" + uuid;
			$('#previewEtichettaModal').modal('hide');

			$.ajax({
				url: url,
				type: 'DELETE',
				success: function() {
				},
				error: function(jqXHR, textStatus, errorThrown) {
				}
			});
		});

	}

});

$.fn.extractIdProduzioneFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idProduzione') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.getProduzioneEtichetta = function(idProduzione){

	var alertContent = '<div id="alertEtichettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della produzione.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "produzioni/" + idProduzione + '/etichetta',
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$('#hiddenIdProduzione').val(result.id);
				$('#articolo').val(result.articolo);
				$('#ingredienti').val(result.ingredienti);
				$('#lotto').val(result.lotto);
				$('#conservazione').val(result.conservazione);
				$('#valoriNutrizionali').val(result.valoriNutrizionali);
				$('#dataConsumazione').val(result.scadenza);

				$.fn.preloadFields();
			} else{
				$('#alertEtichetta').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertEtichetta').append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.preloadFields = function(){
	$('#disposizioniComune').val('Verifica le disposizioni del tuo comune');

	$('#footer').val('Prodotto e confezionato da:\r\nURBANI ELIA E MARTA\r\nVia 11 Settembre, 17 SAN GIOVANNI ILARIONE (VR)\r\nTEL. 045/6550993 CEL. 328/4694654\r\nwww.urbanialimentari.com');
}

$.fn.adjustText = function(){
	var containers = document.getElementsByClassName("labelAdjustText");
	for (var i = 0; i < containers.length; i++) {
		const container = containers.item(i);
		const text = container.getElementsByTagName("p")[0];

		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;

		text.style.fontSize = '12px';

		while (text.scrollWidth > containerWidth || text.scrollHeight > containerHeight) {
			const fontSize = parseFloat(window.getComputedStyle(text).fontSize);
			text.style.fontSize = (fontSize - 1) + 'px';
		}
	}
}