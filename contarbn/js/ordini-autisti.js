var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	if($('#searchOrdineAutistaButton') != null && $('#searchOrdineAutistaButton') != undefined){
		$(document).on('submit','#searchOrdineAutistaForm', function(event){
			event.preventDefault();

			$('#ordiniAutistiTable').DataTable().destroy();
			$('#ordiniAutistiMainDiv').removeClass('d-none');

			var alertContent = '<div id="alertOrdineAutistaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var idAutista = $('#autista option:selected').val();
			var dataConsegnaDa = $('#dataConsegnaDa').val();
			var dataConsegnaA = $('#dataConsegnaA').val();
			var params = {};
            if(idAutista != null && idAutista != undefined && idAutista != ''){
                params.idAutista = idAutista;
            }
            if(dataConsegnaDa != null && dataConsegnaDa != undefined && dataConsegnaDa != ''){
                params.dataConsegnaDa = dataConsegnaDa;
            }
			if(dataConsegnaA != null && dataConsegnaA != undefined && dataConsegnaA != ''){
				params.dataConsegnaA = dataConsegnaA;
			}
            var url = baseUrl + "ordini-clienti/autisti?" + $.param( params );

			$('#ordiniAutistiTable').DataTable({
				"ajax": {
					"url": url,
					"type": "GET",
					"content-type": "json",
					"cache": false,
					"dataSrc": "",
					"error": function(jqXHR, textStatus, errorThrown) {
						console.log('Response text: ' + jqXHR.responseText);
						var alertContent = '<div id="alertOrdineAutistaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
						alertContent = alertContent + '<strong>Errore nel recupero degli ordini</strong>\n' +
							'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
						$('#alertOrdineAutista').empty().append(alertContent);
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
					"emptyTable": "Nessun ordine disponibile",
					"zeroRecords": "Nessun ordine disponibile"
				},
				"pageLength": 20,
				"lengthChange": false,
				"info": false,
				"autoWidth": false,
				"order": [
					[0, 'desc']
				],
				"columns": [
					{"name":"codice", "data": null, render: function ( data, type, row ) {
						return data.progressivo + '/' + data.annoContabile;
					}},
					{"name":"autista", "data": null, render: function ( data, type, row ) {
						if(data.autista != null){
							var autistaHtml = '';

							if(data.autista.nome){
								autistaHtml += data.autista.nome;
							}
							if(data.autista.cognome){
								autistaHtml += ' ' + data.autista.cognome;
							}
							return autistaHtml;
						} else {
							return '';
						}
					}},
					{"name":"cliente", "data": null, render: function ( data, type, row ) {
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
					{"name":"puntoConsegna", "data": null, render: function ( data, type, row ) {
						if(data.puntoConsegna != null){
							var puntoConsegnaHtml = '';

							if(data.puntoConsegna.indirizzo != null){
								puntoConsegnaHtml += data.puntoConsegna.indirizzo;
							}
							if(data.puntoConsegna.localita != null){
								puntoConsegnaHtml += ' ' + data.puntoConsegna.localita;
							}
							return puntoConsegnaHtml;
						} else {
							return '';
						}
					}},
					{"name":"telefono", "data": null, render: function ( data, type, row ) {
                        if(data.telefonata != null){
                            var telefonataHtml = '';

                            if(data.telefonata.telefono != null){
                                telefonataHtml += data.telefonata.telefono;
                            }
                            return telefonataHtml;
                        } else {
                            return '';
                        }
                    }},
					{"name": "dataConsegna", "data": null, render: function ( data, type, row ) {
						if(data.dataConsegna != null){
							var a = moment(data.dataConsegna);
							return a.format('DD/MM/YYYY');
						} else {
							return '';
						}
					}},
					{"name":"statoOrdine", "data": null, render: function ( data, type, row ) {
						if(data.statoOrdine != null){
							var statoOrdineHtml = '';

							if(data.statoOrdine.descrizione){
								statoOrdineHtml += data.statoOrdine.descrizione;
							}

							return statoOrdineHtml;
						} else {
							return '';
						}
					}}
					//{"data": null, "orderable":false, "width":"5%", render: function ( data, type, row ) {
					//	var links = '<a class="updateOrdineCliente pr-2" data-id="'+data.id+'" href="ordini-clienti-edit.html?idOrdineCliente=' + data.id + '"><i class="far fa-edit"></i></a>';
					//	return links;
					//}}
				],
				"createdRow": function(row, data, dataIndex,cells){
					$(row).addClass('rowOrdine');
					$(row).attr('data-id-ordine', data.id);
					$(row).css('font-size', '12px');
				}
			});

		});
	}

	$(document).on('click','#printOrdiniAutisti', function(event){
		event.preventDefault();

		$('#alertOrdineAutista').empty()

        var alertContent = '<div id="alertOrdineAutistaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
        		alertContent = alertContent + '<strong>@@alertText@@\n' +
        			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var idAutista = $('#autista option:selected').val();
		var dataConsegnaDa = $('#dataConsegnaDa').val();
		var dataConsegnaA = $('#dataConsegnaA').val();
		var ids = "";

		/*$(".rowOrdine").each(function(i, item){
			var id = $(this).attr('data-id-ordine');
			ids += id+",";
		});*/

		var params = {};
        if(idAutista != null && idAutista != undefined && idAutista != ''){
            params.idAutista = idAutista;
        } else {
            $('#alertOrdineAutista').empty().append(alertContent.replace('@@alertText@@', 'Selezionare un autista').replace('@@alertResult@@', 'danger'));
            return;
        }
        if(dataConsegnaDa != null && dataConsegnaDa != undefined && dataConsegnaDa != ''){
            params.dataConsegnaDa = dataConsegnaDa;
        } else {
            $('#alertOrdineAutista').empty().append(alertContent.replace('@@alertText@@', 'Selezionare una data di consegna').replace('@@alertResult@@', 'danger'));
            return;
        }
		if(dataConsegnaA != null && dataConsegnaA != undefined && dataConsegnaA != ''){
			params.dataConsegnaA = dataConsegnaA;
		} else {
			$('#alertOrdineAutista').empty().append(alertContent.replace('@@alertText@@', 'Selezionare una data di consegna').replace('@@alertResult@@', 'danger'));
			return;
		}
        /*if(ids != null && ids != undefined && ids != ''){
            params.ids = ids;
        }*/
        var url = baseUrl + "stampe/ordini-autisti?" + $.param( params );

		window.open(url, '_blank');

	});

	/*
	$(document).on('click','#emptyOrdineAutisti', function(event){
		event.preventDefault();

		$('#ordiniAutistiTable').DataTable().destroy();
		$('#ordiniAutistiMainDiv').addClass('d-none');

		$('#autista option[value=""]').attr('selected', true);
		$('#dataConsegna').val(moment().add(1, 'days').format('YYYY-MM-DD'));
	});
	*/
});