var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#articoliTable').DataTable({
		"ajax": {
			"url": baseUrl + "articoli",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent += '<strong>Errore nel recupero degli articoli</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticolo').empty().append(alertContent);
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
			"emptyTable": "Nessun articolo disponibile",
			"zeroRecords": "Nessun articolo disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "descrizione", "data": "descrizione"},
			{"name": "categoria", "data": null, render: function (data) {
				if(data.categoria != null){
					return data.categoria.nome;
				} else{
					return '';
				}
			}},
			{"name": "fornitore", "data": null, render: function (data) {
				if (data.fornitore != null) {
					return data.fornitore.ragioneSociale;
				} else{
					return '';
				}
			}},
			{"name": "data", "data": null, render: function (data) {
                if(data.data != null){
					var a = moment(data.data);
					return a.format('DD/MM/YYYY');
				} else {
                	return '';
				}
            }},
			{"data": null, "orderable":false, "width":"15%", render: function (data,) {
				var links = '<a class="updateArticolo pr-2" data-id="'+data.id+'" href="articoli-edit.html?idArticolo=' + data.id + '"><i class="far fa-edit" title="Modifica"></i></a>';
				links += '<a class="manageArticoloImmagini pr-2" data-id="'+data.id+'" href="articolo-immagini.html?idArticolo=' + data.id + '"><i class="fas fa-images" title="Immagini"></i></a>';
				links += '<a class="deleteArticolo" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt" title="Elimina"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data){
			if(!data.attivo){
				$(row).css('background-color', '#d1cfcf');
			}
		}
	});

	$(document).on('click','.deleteArticolo', function(){
		var idArticolo = $(this).attr('data-id');
		$('#confirmDeleteArticolo').attr('data-id', idArticolo);
		$('#deleteArticoloModal').modal('show');
	});

	$(document).on('click','#confirmDeleteArticolo', function(){
		$('#deleteArticoloModal').modal('hide');
		var idArticolo = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "articoli/" + idArticolo,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertArticoloContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Articolo</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticolo').empty().append(alertContent);

				$('#articoliTable').DataTable().ajax.reload();
			},
			error: function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nella cancellazione dell articolo</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticolo').empty().append(alertContent);

				$('#articoliTable').DataTable().ajax.reload();
			}
		});
	});

	$(document).on('change','#fornitore', function(){
		var idTipoFornitore = $(this).find('option:selected').attr('data-id-tipo-fornitore');
		var barcodeMaskLottoScadenza = $(this).find('option:selected').attr('data-barcode-mask-lotto-scadenza');
		if(idTipoFornitore != null && idTipoFornitore !== "" && idTipoFornitore===1) {
			if(barcodeMaskLottoScadenza != null && barcodeMaskLottoScadenza !== "" && barcodeMaskLottoScadenza !== "null"){
				$('#barcodeMaskLottoScadenza').val(barcodeMaskLottoScadenza);
			}
			$('#barcodeMaskLottoScadenza').attr('disabled', false);
		} else {
			$('#barcodeMaskLottoScadenza').val(null);
			$('#barcodeMaskLottoScadenza').attr('disabled', true);
		}

		$.fn.getNextBarcode();
	});

	$(document).on('change','#completeBarcode', function(){
		$.fn.getNextBarcode();
	});

	if($('#newArticoloButton') != null && $('#newArticoloButton') !== undefined){
		$(document).on('submit','#newArticoloForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertArticoloContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '@@alertText@@\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			if(!$.fn.checkBarcode(alertContent)){
				return false;
			}

			var articolo = {};
			articolo.codice = $('#codice').val();
			articolo.descrizione= $('#descrizione').val();
			articolo.descrizione2= $('#descrizione2').val();
			var idCategoriaArticolo = $('#categoriaArticolo option:selected').val();
			if(idCategoriaArticolo !== -1){
				var categoriaArticolo = {};
				categoriaArticolo.id = idCategoriaArticolo;
				articolo.categoria = categoriaArticolo;
			}
			var idFornitore = $('#fornitore option:selected').val();
			if(idFornitore !== -1){
				var fornitore = {};
				fornitore.id = idFornitore;
				articolo.fornitore = fornitore;
			}
			var idAliquotaIva = $('#aliquotaIva option:selected').val();
			if(idAliquotaIva !== -1){
				var aliquotaIva = {};
				aliquotaIva.id = idAliquotaIva;
				articolo.aliquotaIva = aliquotaIva;
			}
			var idUnitaMisura = $('#unitaMisura option:selected').val();
			if(idUnitaMisura !== -1){
				var unitaMisura = {};
				unitaMisura.id = idUnitaMisura;
				articolo.unitaMisura = unitaMisura;
			}
			articolo.data= $('#data').val();
			articolo.quantitaPredefinita= $('#quantitaPredefinita').val();
			articolo.prezzoAcquisto= $('#prezzoAcquisto').val();
			articolo.prezzoListinoBase= $('#prezzoListinoBase').val();
			articolo.scadenzaGiorni= $('#scadenzaGiorni').val();
			articolo.scadenzaGiorniAllarme= $('#scadenzaGiorniAllarme').val();
			articolo.barcode=$('#barcode').val();
			articolo.completeBarcode = $('#completeBarcode').prop('checked') === true;
			articolo.barcodeMaskLottoScadenza = $('#barcodeMaskLottoScadenza').val();
			articolo.sitoWeb = $('#sitoWeb').prop('checked') === true;
			articolo.attivo = $('#attivo').prop('checked') === true;
			var articoloJson = JSON.stringify(articolo);

			$.ajax({
				url: baseUrl + "articoli",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: articoloJson,
				success: function() {
					$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@','Articolo creato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list of 'Articoli' page
					setTimeout(function() {
						window.location.href = "articoli.html";
					}, 1000);

				},
				error: function(jqXHR) {
					var errorMessage = 'Errore nella creazione dell articolo';
					if(jqXHR != null && jqXHR !== ""){
						var responseJson = jqXHR.responseJSON;
						if(responseJson != null && responseJson !== ""){
							var message = jqXHR.responseJSON.message;
							if(message != null && message !== ""){
								errorMessage += '. '+message;
							}
						}
					}
					$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#updateArticoloButton') != null && $('#updateArticoloButton') !== undefined){
		$(document).on('submit','#updateArticoloForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertArticoloContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '@@alertText@@\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			if(!$.fn.checkBarcode(alertContent)){
				return false;
			}

			var idArticolo = $('#hiddenIdArticolo').val();
			var articolo = {};
			articolo.id = idArticolo;
			articolo.codice = $('#codice').val();
			articolo.descrizione= $('#descrizione').val();
			articolo.descrizione2= $('#descrizione2').val();
			var idCategoriaArticolo = $('#categoriaArticolo option:selected').val();
			if(idCategoriaArticolo !== -1){
				var categoriaArticolo = {};
				categoriaArticolo.id = idCategoriaArticolo;
				articolo.categoria = categoriaArticolo;
			}
			var idFornitore = $('#fornitore option:selected').val();
			if(idFornitore !== -1){
				var fornitore = {};
				fornitore.id = idFornitore;
				articolo.fornitore = fornitore;
			}
			var idAliquotaIva = $('#aliquotaIva option:selected').val();
			if(idAliquotaIva !== -1){
				var aliquotaIva = {};
				aliquotaIva.id = idAliquotaIva;
				articolo.aliquotaIva = aliquotaIva;
			}
			var idUnitaMisura = $('#unitaMisura option:selected').val();
			if(idUnitaMisura !== -1){
				var unitaMisura = {};
				unitaMisura.id = idUnitaMisura;
				articolo.unitaMisura = unitaMisura;
			}
			articolo.data= $('#data').val();
			articolo.quantitaPredefinita= $('#quantitaPredefinita').val();
			articolo.prezzoAcquisto= $('#prezzoAcquisto').val();
			articolo.prezzoListinoBase= $('#prezzoListinoBase').val();
			articolo.scadenzaGiorni= $('#scadenzaGiorni').val();
			articolo.scadenzaGiorniAllarme= $('#scadenzaGiorniAllarme').val();
			articolo.barcode=$('#barcode').val();
			articolo.completeBarcode = $('#completeBarcode').prop('checked') === true;
			articolo.barcodeMaskLottoScadenza = $('#barcodeMaskLottoScadenza').val();
			articolo.sitoWeb = $('#sitoWeb').prop('checked') === true;
			articolo.attivo = $('#attivo').prop('checked') === true;

			var articoloJson = JSON.stringify(articolo);

			$.ajax({
				url: baseUrl + "articoli/" + idArticolo,
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: articoloJson,
				success: function() {
					$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@','Articolo modificato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list of 'Articoli' page
					setTimeout(function() {
						window.location.href = "articoli.html";
					}, 1000);

				},
				error: function(jqXHR) {
					var errorMessage = 'Errore nella modifica dell articolo';
					if(jqXHR != null && jqXHR !== ""){
						var responseJson = jqXHR.responseJSON;
						if(responseJson != null && responseJson !== ""){
							var message = jqXHR.responseJSON.message;
							if(message != null && message !== ""){
								errorMessage += '. '+message;
							}
						}
					}
					$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

});

$.fn.getCategorieArticoli = function(){
	$.ajax({
		url: baseUrl + "categorie-articoli",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#categoriaArticolo').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
				$('#data').val(moment().format('YYYY-MM-DD'));
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getFornitori = function(){
	$.ajax({
		url: baseUrl + "fornitori?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#fornitore').append('<option value="'+item.id+'" data-id-tipo-fornitore="'+item.tipoFornitore.id+'" data-barcode-mask-lotto-scadenza="'+item.barcodeMaskLottoScadenza+'">'+item.ragioneSociale+'</option>');
				});

				var firstIdTipoFornitore = $('#fornitore option:selected').attr('data-id-tipo-fornitore');
				var firstBarcodeMaskLottoScadenza = $('#fornitore option:selected').attr('data-barcode-mask-lotto-scadenza');
				if(firstIdTipoFornitore != null && firstIdTipoFornitore !== "" && firstIdTipoFornitore===1) {
					if(firstBarcodeMaskLottoScadenza != null && firstBarcodeMaskLottoScadenza !== "" && firstBarcodeMaskLottoScadenza !== "null"){
						$('#barcodeMaskLottoScadenza').attr('value', firstBarcodeMaskLottoScadenza);
					}
					$('#barcodeMaskLottoScadenza').attr('disabled', false);
				} else {
					$('#barcodeMaskLottoScadenza').val(null);
					$('#barcodeMaskLottoScadenza').attr('disabled', true);
				}
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getAliquoteIva = function(){
	$.ajax({
		url: baseUrl + "aliquote-iva",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#aliquotaIva').append('<option value="'+item.id+'">'+item.valore+'</option>');
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getUnitaMisura = function(){
	$.ajax({
		url: baseUrl + "unita-misura",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#unitaMisura').append('<option value="'+item.id+'">'+item.etichetta+'</option>');
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticolo = function(idCliente){

	var alertContent = '<div id="alertArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent += '<strong>Errore nel recupero dell articolo.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "articoli/" + idArticolo,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
			if(result != null && result !== ''){

				$('#hiddenIdArticolo').val(result.id);
				$('#codice').val(result.codice);
				$('#descrizione').val(result.descrizione);
				$('#descrizione2').val(result.descrizione2);
				if(result.categoria != null){
					$('#categoriaArticolo option[value="' + result.categoria.id +'"]').attr('selected', true);
				}
				if(result.fornitore != null){
					$('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);
				}
				if(result.aliquotaIva != null){
					$('#aliquotaIva option[value="' + result.aliquotaIva.id +'"]').attr('selected', true);
				}
				if(result.unitaMisura != null){
					$('#unitaMisura option[value="' + result.unitaMisura.id +'"]').attr('selected', true);
				}
				$('#data').val(result.data);
				$('#quantitaPredefinita').val(result.quantitaPredefinita);
				$('#prezzoAcquisto').val(result.prezzoAcquisto);
				$('#prezzoListinoBase').val(result.prezzoListinoBase);
				$('#scadenzaGiorni').val(result.scadenzaGiorni);
				$('#scadenzaGiorniAllarme').val(result.scadenzaGiorniAllarme);
				$('#barcode').val(result.barcode).attr('data-barcode', result.barcode).attr('data-barcode-complete', (result.completeBarcode===true ? 1 : 0));
				if(result.completeBarcode === true){
					$('#completeBarcode').prop('checked', true);
				}

				var idTipoFornitore = $('#fornitore option:selected').attr('data-id-tipo-fornitore');
				if(idTipoFornitore != null && idTipoFornitore !== "" && idTipoFornitore===1) {
					$('#barcodeMaskLottoScadenza').attr('disabled', false);
				} else {
					$('#barcodeMaskLottoScadenza').val(null);
					$('#barcodeMaskLottoScadenza').attr('disabled', true);
				}
				$('#barcodeMaskLottoScadenza').val(result.barcodeMaskLottoScadenza);

				if(result.sitoweb === true){
					$('#sitoWeb').prop('checked', true);
				}
				if(result.attivo === true){
					$('#attivo').prop('checked', true);
				}

			} else{
				$('#alertArticolo').empty().append(alertContent);
			}
        },
        error: function(jqXHR) {
            $('#alertArticolo').empty().append(alertContent);
            $('#updateClienteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.getNextBarcode = function(){
	var idFornitore = $('#fornitore option:selected').val();
	if(idFornitore === '23'){
		var completeBarcode = $('#completeBarcode').prop('checked') === true;
		if(completeBarcode){
			completeBarcode = 1;
		} else {
			completeBarcode = 0;
		}
		var currentBarcode = $('#barcode').attr('data-barcode');
		var currentBarcodeComplete = $('#barcode').attr('data-barcode-complete');
		if(currentBarcode != null && currentBarcode !== '' && currentBarcodeComplete != null && parseInt(currentBarcodeComplete)===completeBarcode){
			$('#barcode').val(currentBarcode);
		} else {
			$.ajax({
				url: baseUrl + "articoli/next-barcode?idFornitore="+idFornitore+"&completeBarcode="+completeBarcode,
				type: 'GET',
				dataType: 'json',
				success: function(result) {
					if(result != null && result !== ''){
						$('#barcode').val(result);
					}
				},
				error: function(jqXHR) {
					console.log('Response text: ' + jqXHR.responseText);
				}
			});
		}

	} else {
		$('#barcode').val(null);
	}
}

$.fn.checkBarcode = function(alertContent){
	var idFornitore = $('#fornitore option:selected').val();
	var barcode = $('#barcode').val();
	if(barcode != null && barcode !== ''){
		if(barcode.startsWith('0')){
			$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@', "Il barcode non può iniziare con 0").replace('@@alertResult@@', 'danger'));
			return false;
		}
	}
	if(idFornitore === '23' && (barcode == null || barcode === '')){
		var fornitore = $('#fornitore option:selected').text();
		$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@', "Per fornitore <b>'"+fornitore+"'</b> il campo <b>'barcode'</b> deve essere valorizzato").replace('@@alertResult@@', 'danger'));
		return false;
	}
	return true;
};