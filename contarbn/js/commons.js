var baseUrl = "/contarbn-be/";
var configurazioneClient;

$(document).ready(function() {

    /*
        ================================
        MENU
        ================================
     */
    var pageType = $('#accordionSidebar').attr('data-page-type');
    if(pageType != null && pageType != undefined){
        $('.navbar').load('../commons/topbar.html', function() {
            $.fn.updateTopbarNav();
        });

        var sidebarFilePath = '';
        if(pageType == 'anagrafiche'){
            sidebarFilePath = '../commons/sidebar-anagrafiche.html';
        } else if(pageType == 'configurazione'){
            sidebarFilePath = '../commons/sidebar-configurazione.html';
        } else if(pageType == 'produzione'){
            sidebarFilePath = '../commons/sidebar-produzione.html';
        } else if(pageType == 'magazzino'){
            sidebarFilePath = '../commons/sidebar-magazzino.html';
        } else if(pageType == 'ordini'){
            sidebarFilePath = '../commons/sidebar-ordini.html';
        } else if(pageType == 'contabilita'){
            sidebarFilePath = '../commons/sidebar-contabilita.html';

            if($.fn.isVersionClient()){
                var pageName = $('#accordionSidebar').attr('data-page-name');
                if(pageName == 'ddt-new' || pageName == 'ddt-edit' || pageName == 'fatture-accompagnatorie-new'){
                    $('#prezzo').attr('disabled', true);
                }
            }

        } else if(pageType == 'lotti-statistiche'){
            sidebarFilePath = '../commons/sidebar-lotti-statistiche.html';
        } else if(pageType == 'stampe'){
            sidebarFilePath = '../commons/sidebar-stampe.html';
        }

        $('#accordionSidebar').load(sidebarFilePath, function() {
            $.fn.getConfigurazioneClient();
        });

        $.fn.updateFooter();

    } else{
        $('.navbar').load('commons/topbar.html', function() {
            $.fn.updateTopbarNav();
        });

        $('#accordionSidebar').load('commons/sidebar.html', function() {
            $.fn.getConfigurazioneClient();
        });

        $.fn.updateFooter();
    }

    // Toggle the side navigation
    $(document).on('click','#sidebarToggle, #sidebarToggleTop', function(){
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
          $('.sidebar .collapse').collapse('hide');
        };
    });

    /*
        ================================
        END MENU
        ================================
     */

    $(document).on('change','#dataTrasporto', function(){
        $.fn.emptyArticoli();

        $.fn.loadArticoliFromOrdiniClienti();
    });

    $(document).on('change','#puntoConsegna', function(){
        $.fn.emptyArticoli();

        $.fn.loadArticoliFromOrdiniClienti();
    });

    $(document).on('change','.pezzi', function(){
        $.fn.checkPezziOrdinati();
    });

    $(document).on('change','#data', function(){
        $.fn.emptyArticoli();

        var data = $(this).val();
        var cliente = $('#cliente option:selected').val();
        if(data != null && data != undefined && data != '' && cliente != null && cliente != undefined && cliente != ''){
            $.fn.loadScontiArticoli(data, cliente);
        }
    });

    $(document).on('click','.updateClienteNoteDocumenti', function(){

        var alertContent = '<div id="alertContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
        alertContent = alertContent + '<strong>@@alertText@@.</strong>\n' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

        var alertId = '';
        if($.fn.isDdt()){
            alertId = '#alertDdt';
        } else if($.fn.isFatturaAccompagnatoria()){
            alertId = '#alertFattureAccompagnatorie';
        } else if($.fn.isNotaAccredito()){
            alertId = '#alertNoteAccredito';
        } else if($.fn.isRicevutaPrivato()){
            alertId = '#alertRicevutaPrivato';
        } else if($.fn.isOrdineCliente()){
            alertId = '#alertOrdineCliente';
        }

        var idCliente = $('#cliente option:selected').val();

        if($.fn.checkVariableIsNull(idCliente)){
            $(alertId).empty().append(alertContent.replace('@@alertText@@', 'Selezionare un cliente'));
        } else {
            $.ajax({
                url: baseUrl + "clienti/" + idCliente,
                type: 'GET',
                dataType: 'json',
                success: function(result) {
                    if(result != null && result != undefined && result != ''){

                        $('#noteDocumenti').val(result.noteDocumenti);
                        $('#confirmUpdateClienteNoteDocumenti').attr('data-id-cliente', idCliente);
                        $('#updateClienteNoteDocumentiModal').modal('show');

                    } else{
                        $(alertId).empty().append(alertContent.replace('@@alertText@@', 'Errore nel recupero del cliente'));
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $(alertId).empty().append(alertContent.replace('@@alertText@@', 'Errore nel recupero del cliente'));
                }
            });
        }
    });

    $(document).on('click','#confirmUpdateClienteNoteDocumenti', function(){
        $('#updateClienteNoteDocumentiModal').modal('hide');

        var alertContent = '<div id="alertContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
        alertContent = alertContent + '<strong>@@alertText@@\n' +
            '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

        var alertId = '';
        if($.fn.isDdt()){
            alertId = '#alertDdt';
        } else if($.fn.isFatturaAccompagnatoria()){
            alertId = '#alertFattureAccompagnatorie';
        } else if($.fn.isNotaAccredito()){
            alertId = '#alertNoteAccredito';
        } else if($.fn.isRicevutaPrivato()){
            alertId = '#alertRicevutaPrivato';
        } else if($.fn.isOrdineCliente()){
            alertId = '#alertOrdineCliente';
        }

        var idCliente = $(this).attr('data-id-cliente');

        if($.fn.checkVariableIsNull(idCliente)){
            $(alertId).empty().append(alertContent.replace('@@alertText@@', 'Selezionare un cliente'));
        } else {
            var url = baseUrl + "clienti/" + idCliente;

            var clientePatched = new Object();
            clientePatched.id = parseInt(idCliente);
            clientePatched.noteDocumenti = $('#noteDocumenti').val();

            var clientePatchedJson = JSON.stringify(clientePatched);

            $.ajax({
                url: url,
                type: 'PATCH',
                contentType: "application/json",
                dataType: 'json',
                data: clientePatchedJson,
                success: function() {
                    //$(alertId).empty().append(alertContent.replace('@@alertText@@', 'Note documenti cliente</strong> aggiornate con successo.').replace('@@alertResult@@', 'success'));
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $(alertId).empty().append(alertContent.replace('@@alertText@@', "Errore nell'aggiornamento delle note documenti cliente'").replace('@@alertResult@@', 'danger'));
                }
            });
        }
    });

});

/*
    ================================
    FUNCTIONS
    ================================
 */
$.fn.isDdt = function(){
    var result = false;
    var ddtLength = $('#containerDdt').length;
    if(ddtLength > 0){
        result = true;
    }
    return result;
}

$.fn.isFatturaAccompagnatoria = function(){
    var result = false;
    var fatturaAccompagnatoriaLength = $('#containerFatturaAccompagnatoria').length;
    if(fatturaAccompagnatoriaLength > 0){
        result = true;
    }
    return result;
}

$.fn.isFatturaAccompagnatoriaAcquisto = function(){
    var result = false;
    var fatturaAccompagnatoriaAcquistoLength = $('#containerFatturaAccompagnatoriaAcquisto').length;
    if(fatturaAccompagnatoriaAcquistoLength > 0){
        result = true;
    }
    return result;
}

$.fn.isRicevutaPrivato = function(){
    var result = false;
    var ricevutaPrivatoLength = $('#containerRicevutaPrivato').length;
    if(ricevutaPrivatoLength > 0){
        result = true;
    }
    return result;
}

$.fn.isDdtAcquisto = function(){
    var result = false;
    var ddtAcquistoLength = $('#containerDdtAcquisto').length;
    if(ddtAcquistoLength > 0){
        result = true;
    }
    return result;
}

$.fn.isNotaAccredito = function(){
    var result = false;
    var notaAccreditoLength = $('#containerNotaAccredito').length;
    if(notaAccreditoLength > 0){
        result = true;
    }
    return result;
}

$.fn.isOrdineCliente = function(){
    var result = false;
    var ordineClienteLength = $('#containerOrdineCliente').length;
    if(ordineClienteLength > 0){
        result = true;
    }
    return result;
}

$.fn.extractDataTrasportoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

    var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'dt') {
            return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.extractOraTrasportoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

    var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'ot') {
            return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.extractTokenFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

    var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'token') {
            return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.extractParamFromUrl = function(paramName){
    var pageUrl = window.location.search.substring(1);

    var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === paramName) {
            return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getStatoOrdineClienteEvaso = function(){

    var idStatoOrdineEvaso = 2;

    $.ajax({
        url: baseUrl + "stati-ordine/evaso",
        type: 'GET',
        ajax: false,
        dataType: 'json',
        success: function(result) {
            if(result != null && result != undefined && result != ''){
                idStatoOrdineEvaso = result.id;
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Errore nel recupero dello stato ordine evaso');
        }
    });

    return idStatoOrdineEvaso;
}

$.fn.getLottoRegExp = function(articolo){
    var lottoRegexp = articolo.barcodeRegexpLotto;
    var fornitore = articolo.fornitore;
    if($.fn.checkVariableIsNull(lottoRegexp)) {
        if(!$.fn.checkVariableIsNull(fornitore)){
            lottoRegexp = fornitore.barcodeRegexpLotto;
        }
    }
    return lottoRegexp;
}

$.fn.getDataScadenzaRegExp = function(articolo){
    var dataScadenzaRegexp = articolo.barcodeRegexpDataScadenza;
    var fornitore = articolo.fornitore;
    if($.fn.checkVariableIsNull(dataScadenzaRegexp)) {
        if(!$.fn.checkVariableIsNull(fornitore)){
            dataScadenzaRegexp = fornitore.barcodeRegexpDataScadenza;
        }
    }
    return dataScadenzaRegexp;
}

$.fn.fixDecimalPlaces = function(quantita, decimalPlaces){
    var quantitaFixed = quantita;

    if(quantita != null && quantita != undefined && quantita != ''){
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

$.fn.formatNumber = function(value){
    return parseFloat(Number(Math.round(value+'e2')+'e-2')).toFixed(2);
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

$.fn.checkDuplicates = function(array){
    var set = new Set(array);
    if(array.length !== set.size){
        return true;
    }
    return false;
}

$.fn.removeDuplicates = function(array){
    return [...new Set(array)];
}

$.fn.compareByOrdine = function(a, b){
    return a.ordine - b.ordine;
}

$.fn.isVersionClient = function(){
    var result = false;
    var pathname = window.location.pathname;
    if(!$.fn.checkVariableIsNull(pathname)){
        if(pathname.indexOf('contarbn-client') != -1){
            result = true;
        }
    }
    return result;
}

$.fn.updateTopbarNav = function(){
    if($.fn.isVersionClient()){
        var navBarItem = "<li class='nav-item dropdown no-arrow'><a class='nav-link dropdown-toggle' href='#' id='clientVersionDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span class='mr-2 d-none d-lg-inline text-red-large'>Versione Client</span></a></li>";
        $(navBarItem).insertBefore("#navbarDivider");
    }
}

$.fn.updateFooter = function(){
    if($.fn.isVersionClient()){
        var spanItem = '<span class="text-red">Versione Client</span>';
        $('.copyright').append(spanItem);
    }
}

$.fn.getConfigurazioneClient = function(){

    if($.fn.isVersionClient()){
        $.ajax({
            url: baseUrl + "configurazione/app-client",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function(result) {
                if(result != null && result != undefined && result != ''){
                    configurazioneClient = result;

                    configurazioneClient.forEach((item) => {
                        if(item.codice == 'MENU_CONFIGURAZIONE'){
                            if(item.abilitato){
                                $('#configurazioneNavItem').removeAttr('hidden');
                                $('#configurazioneDivider').removeAttr('hidden');
                            } else {
                                $('#configurazioneNavItem').attr('hidden',true);
                                $('#configurazioneDivider').attr('hidden',true);
                            }
                            return false;

                        } else if(item.codice == 'RICEVUTA_PRIVATO'){
                            if(item.abilitato){
                                $('#ricevutePrivatiLink').removeAttr('hidden');
                            } else {
                                $('#ricevutePrivatiLink').attr('hidden',true);
                            }
                            return false;
                        }
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.responseText);
            }
        });
    }
}

$.fn.getConfigurazioneItemClient = function(codice){
    var abilitato = true;
    if($.fn.isVersionClient()){
        configurazioneClient.forEach((item) => {
            if(item.codice == codice){
                abilitato = item.abilitato;
                return false;
            }
        });
    }
    return abilitato;
}

$.fn.emptyArticoli = function(){

    var idTable;
    if($.fn.isDdt()){
        idTable += '#ddtArticoliTable';
    } else if($.fn.isFatturaAccompagnatoria()){
        idTable += '#fatturaAccompagnatoriaArticoliTable';
    } else if($.fn.isRicevutaPrivato()){
        idTable += '#ricevutaPrivatoArticoliTable';
    }

    $(idTable).DataTable().rows()
        .remove()
        .draw();
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

$.fn.validateDataTrasporto = function(){
    var valid = true;

    var data = $('#data').val();
    var dataTrasporto = $('#dataTrasporto').val();
    if(data != null && dataTrasporto != null){
        var data_d = new Date(data);
        var dataTrasporto_d = new Date(dataTrasporto);
        if(dataTrasporto_d < data_d){
            valid = false;
        }
    }

    return valid;
}

$.fn.handleClienteNoteDocumenti = function(hasNoteDocumenti){

    $('#updateClienteNoteDocumenti').removeAttr('hidden');
    if(hasNoteDocumenti == 1){
        $('#updateClienteNoteDocumenti').css('color', '#e74a3b');
        $($('#updateClienteNoteDocumenti').children().get(0)).addClass('fa-2x');
        $("label[for='cliente']").css('color','#e74a3b').css('font-weight','bold');
    } else {
        $('#updateClienteNoteDocumenti').css('color', '');
        $($('#updateClienteNoteDocumenti').children().get(0)).removeClass('fa-2x');
        $("label[for='cliente']").css('color','').css('font-weight','');
    }
}

$.fn.initializeCkEditor = function(selector, ckEditorName) {

    ClassicEditor
        .create(document.querySelector(selector), {
            language: 'it',
            toolbar: ['bold', 'removeFormat']
        })
        .then(editor => {
            if(ckEditorName === 'composizioneCkEditor'){
                window.composizioneCkEditor = editor;
            } else {
                window.ckEditorName = editor;
            }
        })
        .catch(error => {
            console.error('There was an error initializing the editor', error);
        });
}

$.fn.checkProdottiScadenza = function() {
    let articoliTable;
    let alert;
    let alertText = "Articoli in scadenza o scaduti: ";
    let tipoFornitore;

    let alertContent = '<div id="alertContent" class="alert alert-danger alert-dismissible fade show" role="alert" style="background-color: #fc8274">';
    alertContent += '@@alertText@@\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';


    if($.fn.isDdt()){
        articoliTable = $('#ddtArticoliTable').DataTable();
        alert = $('#alertDdt');
    } else if($.fn.isFatturaAccompagnatoria()){
        articoliTable = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
        alert = $('#alertFattureAccompagnatorie');
    } else if($.fn.isDdtAcquisto()){
        articoliTable = $('#ddtAcquistoProdottiTable').DataTable();
        alert = $('#alertDdtAcquisto');
        tipoFornitore = $('#fornitore option:selected').attr("data-tipo");
    } else if($.fn.isFatturaAccompagnatoriaAcquisto()){
        articoliTable = $('#fatturaAccompagnatoriaAcquistoProdottiTable').DataTable();
        alert = $('#alertFattureAccompagnatorieAcquisto');
        tipoFornitore = $('#fornitore option:selected').attr("data-tipo");
    }
    if(tipoFornitore !== null && tipoFornitore === 'FORNITORE_INGREDIENTI'){
        alertText = "Ingredienti in scadenza o scaduti: ";
    }

    let scaduti = [];

    articoliTable.rows().nodes().each(function(i, item){
        const articolo = $(i).children().eq(0).text();
        const scadenzaGiorni = $(i).attr('data-scadenza-giorni');
        const scadenza = $(i).children().eq(2).children().eq(0).val();

        if(scadenza != null){
            let data = moment(scadenza, 'YYYY-MM-DD').subtract(scadenzaGiorni, 'days');
            if(moment() >= data){
                scaduti.push(articolo)
            }
        }
    });

    alert.empty();
    if(scaduti.length > 0){
        alertText += "<strong>"+$.fn.removeDuplicates(scaduti).join("; ")+"</strong>";
        alert.append(alertContent.replace('@@alertText@@', alertText));
    }

}

$.fn.checkPezziOrdinati = function(){

    var articoliMap = new Map();
    var articoliMapTwo = new Map();
    var articoliArray = [];
    var ordiniClientiArticoliArray = [];

    var articoliTable;
    if($.fn.isDdt()){
        articoliTable = $('#ddtArticoliTable').DataTable();
    } else if($.fn.isFatturaAccompagnatoria()){
        articoliTable = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
    } else if($.fn.isRicevutaPrivato()){
        articoliTable = $('#ricevutaPrivatoArticoliTable').DataTable();
    }

    articoliTable.rows().nodes().each(function(i, item){
        var idArticolo = $(i).attr('data-id');
        var numeroPezzi = $(i).children().eq(5).children().eq(0).val();
        numeroPezzi = $.fn.parseValue(numeroPezzi, 'int');
        var numeroPezziStart = $(i).children().eq(5).children().eq(0).attr('data-start-num-pezzi');
        numeroPezziStart = $.fn.parseValue(numeroPezziStart, 'int');

        var totaliPezzi;
        if(articoliMap.has(idArticolo)){
            totaliPezzi = articoliMap.get(idArticolo);
        } else {
            totaliPezzi = 0;
        }
        totaliPezzi = totaliPezzi + numeroPezzi;
        articoliMap.set(idArticolo, totaliPezzi);

        var totaliPezziStart;
        if(articoliMapTwo.has(idArticolo)){
            totaliPezziStart = articoliMapTwo.get(idArticolo);
        } else {
            totaliPezziStart = 0;
        }
        totaliPezziStart = totaliPezziStart + numeroPezziStart;
        articoliMapTwo.set(idArticolo, totaliPezziStart);

        articoliArray.push(idArticolo);
    });

    var ordineClienteArticoliTable;
    if($.fn.DataTable.isDataTable( '#ordiniClientiArticoliTable' )){
        ordineClienteArticoliTable = $('#ordiniClientiArticoliTable').DataTable();
    }

    if(!$.fn.checkVariableIsNull(ordineClienteArticoliTable)){
        ordineClienteArticoliTable.rows().nodes().each(function(i, item){
            var idArticolo = $(i).attr('data-id-articolo');
            ordiniClientiArticoliArray.push(idArticolo);
        });
        var ordineClienteArticoliTableRowsNodes = ordineClienteArticoliTable.rows().nodes().to$();

        articoliMap.forEach( (value, key, map) => {
            var ordiniClientiArticoloLength = ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+key+']').length;
            //var ordiniClientiArticoloLength = $('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').length;

            if(ordiniClientiArticoloLength != 0){
                var numeroPezziOrdinati = ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+key+']').find("td:eq(3)").text();
                var numeroPezziEvasi = ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+key+']').attr('data-start-num-pezzi-evasi');
                var numeroPezziStart = articoliMapTwo.get(key);
                numeroPezziOrdinati = $.fn.parseValue(numeroPezziOrdinati, 'int');
                numeroPezziEvasi = $.fn.parseValue(numeroPezziEvasi, 'int');
                numeroPezziStart = $.fn.parseValue(numeroPezziStart, 'int');
                value = $.fn.parseValue(value, 'int');

                var newNumeroPezziEvasi = numeroPezziEvasi - numeroPezziStart + value;

                var backgroundColor;
                if(newNumeroPezziEvasi == numeroPezziOrdinati){
                    backgroundColor = 'transparent';
                } else if(newNumeroPezziEvasi == 0){
                    backgroundColor = rowBackgroundVerde;
                } else if(newNumeroPezziEvasi < numeroPezziOrdinati){
                    backgroundColor = rowBackgroundRosa;
                } else {
                    backgroundColor = rowBackgroundGiallo;
                }
                ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+key+']').css('background-color', backgroundColor).attr('data-num-pezzi-evasi', newNumeroPezziEvasi).attr('data-set-id-ddt', 'true');

                var rowData = ordineClienteArticoliTable.row("[data-id-articolo='"+key+"']").data();
                rowData["numeroPezziEvasi"] = newNumeroPezziEvasi;
                ordineClienteArticoliTable.row("[data-id-articolo='"+key+"']").data(rowData).draw();
            } else {
                // articolo non presente in quelli ordinati
                var pathname = window.location.pathname;
                if(!$.fn.checkVariableIsNull(pathname)){
                    if(pathname.indexOf('ddt-new') != -1){
                        $('tr[data-id='+key+']').css('background-color', '#F9BCBC');
                    }
                }
            }
        });

        $(ordiniClientiArticoliArray).not(articoliArray).each(function(i, item){
            ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+item+']').css('background-color', rowBackgroundVerde);
            //$('#ordiniClientiArticoliTable span[data-id-articolo='+item+']').parent().parent().css('background-color', rowBackgroundVerde);
        })
    }
}

$.fn.checkPezziOrdinatiAfterArticoloDelete = function(idArticolo, idDdt){

    var articoliArray = [];
    articoliArray.push(idArticolo);
    var ordiniClientiArticoliArray = [];

    var ordineClienteArticoliTable;
    if($.fn.DataTable.isDataTable( '#ordiniClientiArticoliTable' )){
        ordineClienteArticoliTable = $('#ordiniClientiArticoliTable').DataTable();
    }

    if(!$.fn.checkVariableIsNull(ordineClienteArticoliTable)){
        var ordineClienteArticoliTableRowsNodes = ordineClienteArticoliTable.rows().nodes().to$();
        var ordiniClientiArticoloLength = ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+idArticolo+']').length;

        ordineClienteArticoliTable.rows().nodes().each(function(i, item){
            var idArticolo = $(i).attr('data-id-articolo');
            ordiniClientiArticoliArray.push(idArticolo);
        });

        if(ordiniClientiArticoloLength !== 0){
            var numeroPezziOrdinati = ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+idArticolo+']').find("td:eq(3)").text();
            var numeroPezziEvasiStart = ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+idArticolo+']').attr('data-start-num-pezzi-evasi');
            var idsDdts = ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+idArticolo+']').attr('data-ids-ddts');
            numeroPezziOrdinati = $.fn.parseValue(numeroPezziOrdinati, 'int');
            numeroPezziEvasiStart = $.fn.parseValue(numeroPezziEvasiStart, 'int');

            var newNumeroPezziEvasi = numeroPezziEvasiStart;
            if(!$.fn.checkVariableIsNull(idsDdts) && !$.fn.checkVariableIsNull(idDdt)){
                idsDdts = idsDdts.replace(idDdt+',', '');
                if(idsDdts.length === 0){
                    newNumeroPezziEvasi = 0;
                }
            }

            var backgroundColor;
            if(newNumeroPezziEvasi == numeroPezziOrdinati){
                backgroundColor = 'transparent';
            } else if(newNumeroPezziEvasi == 0){
                backgroundColor = rowBackgroundVerde;
            } else if(newNumeroPezziEvasi < numeroPezziOrdinati){
                backgroundColor = rowBackgroundRosa;
            } else {
                backgroundColor = rowBackgroundGiallo;
            }
            ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+idArticolo+']').css('background-color', backgroundColor).attr('data-num-pezzi-evasi', newNumeroPezziEvasi).attr('data-start-num-pezzi-evasi', newNumeroPezziEvasi).attr('data-ids-ddts', idsDdts).removeAttr('data-set-id-ddt');

            var rowData = ordineClienteArticoliTable.row("[data-id-articolo='"+idArticolo+"']").data();
            rowData["numeroPezziEvasi"] = newNumeroPezziEvasi;
            ordineClienteArticoliTable.row("[data-id-articolo='"+idArticolo+"']").data(rowData).draw();
        } else {
            // articolo non presente in quelli ordinati
            var pathname = window.location.pathname;
            if(!$.fn.checkVariableIsNull(pathname)){
                if(pathname.indexOf('ddt-new') != -1){
                    $('tr[data-id='+idArticolo+']').css('background-color', '#F9BCBC');
                }
            }
        }

        //$(ordiniClientiArticoliArray).not(articoliArray).each(function(i, item){
        //    ordineClienteArticoliTableRowsNodes.filter('[data-id-articolo='+item+']').css('background-color', rowBackgroundVerde);
        //})
    }
}
/*
$.fn.openWindowWithPost = function(url, data) {
    var form = document.createElement("form");
    form.target = "_blank";
    form.method = "POST";
    form.action = url;
    form.style.display = "none";

    var input = document.createElement("input");
    input.type = "hidden";
    input.id = "data";
    input.name = "data";
    input.value = data;
    form.appendChild(input);

    //for (var key in data) {
    //    var input = document.createElement("input");
    //    input.type = "hidden";
    //    input.name = key;
    //    input.value = data[key];
    //    form.appendChild(input);
    //}

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
*/

$.fn.computeTotale = function() {
    var ivaMap = new Map();
    var totaleDocumento = 0;

    var articoliTable;
    if($.fn.isDdt()){
        articoliTable = $('#ddtArticoliTable').DataTable();
    } else if($.fn.isFatturaAccompagnatoria()){
        articoliTable = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
    } else if($.fn.isRicevutaPrivato()){
        articoliTable = $('#ricevutaPrivatoArticoliTable').DataTable();
    } else if($.fn.isFatturaAccompagnatoriaAcquisto()){
        articoliTable = $('#fatturaAccompagnatoriaAcquistoProdottiTable').DataTable();
    }

    articoliTable.rows().nodes().each(function(i, item){
        var totale = $(i).children().eq(8).text();
        if($.fn.isRicevutaPrivato()){
            totale = $(i).children().eq(6).children().eq(0).attr('data-totale');
        }
        totale = $.fn.parseValue(totale, 'float');

        var iva = $(i).children().eq(9).text();
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

        if($.fn.isFatturaAccompagnatoria() || $.fn.isRicevutaPrivato() || $.fn.isFatturaAccompagnatoriaAcquisto()){
            // populating the table with iva and imponibile
            $('tr[data-valore='+key+']').find('td').eq(1).text($.fn.formatNumber((totalePerIva * key/100)));
            $('tr[data-valore='+key+']').find('td').eq(2).text($.fn.formatNumber(totalePerIva));
        }
    });

    if(totaleDocumento != null && totaleDocumento != undefined && totaleDocumento != ""){
        totaleDocumento = parseFloat(totaleDocumento);
    }
    $('#totale').val(Number(Math.round(totaleDocumento+'e2')+'e-2'));
}

$.fn.computeTotaleAndImponibile = function() {
    var ivaMap = new Map();
    var totaleIva = 0;
    var totaleDocumento = 0;
    var imponibileDocumento = 0;

    var prodottoTable = $('#ddtAcquistoProdottiTable').DataTable();

    prodottoTable.rows().nodes().each(function(i, item){
        var iva = $(i).children().eq(9).text();
        iva = $.fn.parseValue(iva, 'float');
        var totale = $(i).children().eq(8).text();
        totale = $.fn.parseValue(totale, 'float');

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

        totaleIva += (totalePerIva * key/100);
        imponibileDocumento += totalePerIva;
        totaleDocumento += totaleConIva;
    });

    totaleIva = parseFloat(totaleIva);
    totaleDocumento = parseFloat(totaleDocumento);
    imponibileDocumento = parseFloat(imponibileDocumento);
    $('#totale').val($.fn.formatNumber(totaleDocumento));
    $('#totaleIva').val($.fn.formatNumber(totaleIva));
    $('#totaleImponibile').val($.fn.formatNumber(imponibileDocumento));
}

$.fn.loadArticoliFromOrdiniClienti = function(){

    var alertLabel = 'alert';
    var idDdt;
    if($.fn.isDdt()){
        alertLabel += 'Ddt';
        idDdt = $('#hiddenIdDdt').attr('value');
    } else if($.fn.isFatturaAccompagnatoria()){
        alertLabel += 'FattureAccompagnatorie';
    } else if($.fn.isRicevutaPrivato()){
        alertLabel += 'RicevutaPrivato';
    }

    var idStatoOrdineEvaso = $.fn.getStatoOrdineClienteEvaso();

    var dataConsegna = $('#dataTrasporto').val();
    var idCliente = $('#cliente option:selected').val();
    var idPuntoConsegna = $('#puntoConsegna option:selected').val();

    if($.fn.normalizeIfEmptyOrNullVariable(idCliente) != ''
        && $.fn.normalizeIfEmptyOrNullVariable(idPuntoConsegna) != ''
        && $.fn.normalizeIfEmptyOrNullVariable(dataConsegna) != ''){

        var url = baseUrl + "ordini-clienti/aggregate?idCliente="+idCliente;
        url += "&idPuntoConsegna="+idPuntoConsegna;
        url += "&dataConsegnaLessOrEqual="+moment(dataConsegna).format('YYYY-MM-DD');
        url += "&idStatoNot="+idStatoOrdineEvaso;

        $('#ordiniClientiArticoliTable').DataTable().destroy();

        $('#ordiniClientiArticoliTable').DataTable({
            "ajax": {
                "url": url,
                "type": "GET",
                "content-type": "json",
                "cache": false,
                "dataSrc": "",
                "error": function(jqXHR, textStatus, errorThrown) {
                    console.log('Response text: ' + jqXHR.responseText);
                    var alertContent = '<div id="'+alertLabel+'Content" class="alert alert-danger alert-dismissible fade show" role="alert">';
                    alertContent = alertContent + '<strong>Errore nel recupero degli ordini clienti</strong>\n' +
                        '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                    $('#'+alertLabel).empty().append(alertContent);
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
                "emptyTable": "Nessun ordine cliente trovato",
                "zeroRecords": "Nessun ordine cliente trovato"
            },
            //"retrieve": true,
            "searching": false,
            "responsive":true,
            "pageLength": 5,
            "lengthChange": false,
            "info": false,
            "autoWidth": false,
            "order": [
                [1, 'asc']
            ],
            "columns": [
                {"name": "codiciOrdiniClienti", "data": "codiciOrdiniClienti", "width":"10%"},
                {"name": "articolo", "data": null, "width":"20%", render: function ( data, type, row ) {
                    var articolo = data.articolo;
                    var span = '<span class="ordineClienteArticolo "';
                    span += 'data-id-articolo="'+data.idArticolo+'" data-ids-ordini="'+data.idsOrdiniClienti+'"';
                    span += '>'+articolo+'</span>';
                    return span;
                }},
                {"name": "prezzoListinoBase", "data": "prezzoListinoBase", "width":"5%"},
                {"name": "numeroPezziDaEvadere", "data": "numeroPezziOrdinati", "width":"3%"},
                {"name": "numeroPezziEvasi", "data": "numeroPezziEvasi", "width":"3%"}
            ],
            "createdRow": function(row, data, dataIndex,cells){
                var idsDdts = data.idsDdts;
                if($.fn.checkVariableIsNull(idsDdts)){
                    idsDdts = '';
                }
                if(!$.fn.checkVariableIsNull(data.numeroPezziEvasi)){
                    if(data.numeroPezziEvasi == 0){
                        $(row).css('background-color',rowBackgroundVerde);
                    } else if(!$.fn.checkVariableIsNull(data.numeroPezziDaEvadere) && (data.numeroPezziEvasi < data.numeroPezziDaEvadere)) {
                        $(row).css('background-color',rowBackgroundRosa);
                    } else if(!$.fn.checkVariableIsNull(data.numeroPezziDaEvadere) && (data.numeroPezziEvasi == data.numeroPezziDaEvadere)){
                        $(row).css('background-color','transparent');
                    }
                } else {
                    $(row).css('background-color',rowBackgroundVerde);
                }
                $(row).css('font-size', 'smaller');
                $(row).attr('data-id-articolo', data.idArticolo);
                $(row).attr('data-start-num-pezzi-evasi', data.numeroPezziEvasi);
                $(row).attr('data-num-pezzi-evasi', data.numeroPezziEvasi);
                $(row).attr('data-ids-ordini', data.idsOrdiniClienti);
                $(row).attr('data-ids-ddts', idsDdts);
                if($.fn.isDdt() && !$.fn.checkVariableIsNull(idDdt)){
                    if(idsDdts.indexOf(idDdt + ',') != -1){
                        $(row).attr('data-set-id-ddt', 'true');
                    }
                }
                $(cells[0]).css('text-align','center');
                $(cells[1]).css('text-align','center');
                $(cells[2]).css('text-align','center');
                $(cells[3]).css('text-align','center');
                $(cells[4]).css('text-align','center');

                var note = data.note;
                var actualNote = $('#ordiniNote').val();
                if(!$.fn.checkVariableIsNull(actualNote)){
                    if(!actualNote.includes(note)){
                        note = actualNote + '\n' + note;
                    }
                }
                $('#ordiniNote').val(note);
            }
        });
    }
}

$.fn.groupArticoloRow = function(insertedRow){
    var insertedRowIndex = insertedRow.attr("data-row-index");
    var articoloId = insertedRow.attr("data-id");
    var	lotto = insertedRow.children().eq(1).children().eq(0).val();
    var	scadenza = insertedRow.children().eq(2).children().eq(0).val();
    var quantita = insertedRow.children().eq(4).children().eq(0).val();
    var pezzi = insertedRow.children().eq(5).children().eq(0).val();
    //var pezziDaEvadere = insertedRow.children().eq(6).children().eq(0).val();
    var	prezzo = insertedRow.children().eq(6).children().eq(0).val();
    var prezzoSenzaIva;
    if($.fn.isRicevutaPrivato()){
        prezzoSenzaIva = insertedRow.children().eq(6).children().eq(0).attr('data-prezzo');
    }
    var	sconto = insertedRow.children().eq(7).children().eq(0).val();

    var found = 0;
    var currentRowIndex = 0;
    //var currentIdOrdineCliente;
    var currentIdArticolo;
    var currentLotto;
    var currentScadenza;
    var currentPrezzo;
    var currentSconto;
    var currentPezzi = 0;
    //var currentPezziDaEvadere = 0;
    var currentQuantita = 0;

    var articoliLength = $('.rowArticolo').length;
    if(articoliLength != null && articoliLength != undefined && articoliLength != 0) {
        $('.rowArticolo').each(function(i, item){

            if(found != 1){
                currentRowIndex = $(this).attr('data-row-index');
                if(currentRowIndex != insertedRowIndex){
                    //currentIdOrdineCliente = $(this).attr('data-id-ordine-cliente');
                    currentIdArticolo = $(this).attr('data-id');
                    currentLotto = $(this).children().eq(1).children().eq(0).val();
                    currentScadenza = $(this).children().eq(2).children().eq(0).val();
                    currentPrezzo = $(this).children().eq(6).children().eq(0).val();
                    currentSconto = $(this).children().eq(7).children().eq(0).val();
                    if(currentSconto == '0'){
                        currentSconto = '';
                    }
                    //currentPezziDaEvadere = $(this).children().eq(6).children().eq(0).val();

                    if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(articoloId)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentLotto) == $.fn.normalizeIfEmptyOrNullVariable(lotto)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentPrezzo) == $.fn.normalizeIfEmptyOrNullVariable(prezzo)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentSconto) == $.fn.normalizeIfEmptyOrNullVariable(sconto)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentScadenza) == $.fn.normalizeIfEmptyOrNullVariable(scadenza)){
                        found = 1;
                        currentQuantita = $(this).children().eq(4).children().eq(0).val();
                        currentPezzi = $(this).children().eq(5).children().eq(0).val();
                    }
                }
            }
        });
    }

    var table;
    if($.fn.isDdt()){
        table = $('#ddtArticoliTable').DataTable();
    } else if($.fn.isFatturaAccompagnatoria()){
        table = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
    } else if($.fn.isRicevutaPrivato()){
        table = $('#ricevutaPrivatoArticoliTable').DataTable();
    }

    if(found >= 1){

        if(!$.fn.isRicevutaPrivato()){
            var totale = 0;
            quantita = $.fn.parseValue(quantita, 'float');
            prezzo = $.fn.parseValue(prezzo, 'float');
            sconto = $.fn.parseValue(sconto, 'float');
            pezzi = $.fn.parseValue(pezzi, 'int');

            var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
            var scontoValue = (sconto/100)*quantitaPerPrezzo;
            totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

            // aggiorno la riga
            $.fn.aggiornaRigaArticolo(table,currentRowIndex,currentQuantita,currentPezzi,lotto,scadenza,prezzo,null,sconto,
                quantita,pezzi,null,null,null,totale,null);

        } else {
            var prezzoIva = prezzo;
            prezzo = prezzoSenzaIva;

            var totaleConIva = 0;
            var totale = 0;
            quantita = $.fn.parseValue(quantita, 'float');
            prezzoIva = $.fn.parseValue(prezzoIva, 'float');
            prezzo = $.fn.parseValue(prezzo, 'float');
            sconto = $.fn.parseValue(sconto, 'float');
            pezzi = $.fn.parseValue(pezzi, 'int');

            var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
            var scontoValue = (sconto/100)*quantitaPerPrezzo;
            totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

            var quantitaPerPrezzoIva = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzoIva);
            totaleConIva = Number(Math.round((quantitaPerPrezzoIva - scontoValue) + 'e2') + 'e-2');

            // aggiorno la riga
            $.fn.aggiornaRigaArticolo(table,currentRowIndex,currentQuantita,currentPezzi,lotto,scadenza,prezzo,prezzoIva,sconto,
                quantita,pezzi,null,null,null,totale,totaleConIva);
        }

        table.row("[data-row-index='"+insertedRowIndex+"']").remove().draw();
    }

    $.fn.computeTotale();

    $.fn.checkPezziOrdinati();
}

$.fn.groupProdottoRow = function(insertedRow){
    var insertedRowIndex = insertedRow.attr("data-row-index");
    var articoloId = insertedRow.attr("data-id");
    var	lotto = insertedRow.children().eq(1).children().eq(0).val();
    var	scadenza = insertedRow.children().eq(2).children().eq(0).val();
    var quantita = insertedRow.children().eq(4).children().eq(0).val();
    var pezzi = insertedRow.children().eq(5).children().eq(0).val();
    var	prezzo = insertedRow.children().eq(6).children().eq(0).val();
    var	sconto = insertedRow.children().eq(7).children().eq(0).val();

    var found = 0;
    var currentRowIndex = 0;
    var currentIdArticolo;
    var currentLotto;
    var currentScadenza;
    var currentPrezzo;
    var currentSconto;
    var currentQuantita = 0;
    var currentPezzi = 0;

    var ddtProdottiLength = $('.rowProdotto').length;
    if(ddtProdottiLength != null && ddtProdottiLength != undefined && ddtProdottiLength != 0) {
        $('.rowProdotto').each(function(i, item){

            if(found != 1){
                currentRowIndex = $(this).attr('data-row-index');
                if(currentRowIndex != insertedRowIndex){
                    //currentIdOrdineCliente = $(this).attr('data-id-ordine-cliente');
                    currentIdArticolo = $(this).attr('data-id');
                    currentLotto = $(this).children().eq(1).children().eq(0).val();
                    currentScadenza = $(this).children().eq(2).children().eq(0).val();
                    currentPrezzo = $(this).children().eq(6).children().eq(0).val();
                    currentSconto = $(this).children().eq(7).children().eq(0).val();
                    if(currentSconto == '0'){
                        currentSconto = '';
                    }

                    if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(articoloId)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentLotto) == $.fn.normalizeIfEmptyOrNullVariable(lotto)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentPrezzo) == $.fn.normalizeIfEmptyOrNullVariable(prezzo)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentSconto) == $.fn.normalizeIfEmptyOrNullVariable(sconto)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentScadenza) == $.fn.normalizeIfEmptyOrNullVariable(scadenza)){
                        found = 1;
                        currentQuantita = $(this).children().eq(4).children().eq(0).val();
                        currentPezzi = $(this).children().eq(5).children().eq(0).val();
                    }
                }
            }
        });
    }

    var table = $('#ddtAcquistoProdottiTable').DataTable();
    if(found >= 1){

        var totale = 0;
        quantita = $.fn.parseValue(quantita, 'float');
        prezzo = $.fn.parseValue(prezzo, 'float');
        sconto = $.fn.parseValue(sconto, 'float');
        pezzi = $.fn.parseValue(pezzi, 'int');

        var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
        var scontoValue = (sconto/100)*quantitaPerPrezzo;
        totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

        // aggiorno la riga
        $.fn.aggiornaRigaProdotto(table,currentRowIndex,articoloId,currentQuantita,currentPezzi,lotto,scadenza,prezzo,sconto,quantita,pezzi,null,null,null,totale);
        table.row("[data-row-index='"+insertedRowIndex+"']").remove().draw();
    }

    $.fn.computeTotaleAndImponibile();

}

$.fn.inserisciRigaArticolo = function(table,currentIdOrdineCliente,articoloId,articolo,
                                      lottoHtml,scadenzaHtml,udm,quantitaHtml,pezziHtml,prezzoHtml,scontoHtml,
                                      totale,iva,totaleIva=null,articoloScadenzaGiorni=0){

    var deleteLinkClass = 'delete';
    if($.fn.isDdt()){
        deleteLinkClass += 'DdtArticolo';
    } else if($.fn.isFatturaAccompagnatoria()){
        deleteLinkClass += 'FatturaAccompagnatoriaArticolo';
    } else if($.fn.isRicevutaPrivato()){
        deleteLinkClass += 'RicevutaPrivatoArticolo';
        totale = totaleIva;
    } else if($.fn.isDdtAcquisto()){
        deleteLinkClass += 'DdtProdotto';
    }
    var deleteLink = '<a class="'+deleteLinkClass+'" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

    var rowsCount = 0;
    if(!$.fn.checkVariableIsNull(table) && !$.fn.checkVariableIsNull(table.rows())){
        rowsCount = table.rows().count();
    }

    if($.fn.isVersionClient()){
        prezzoHtml = prezzoHtml.replace('>', ' disabled>');
    }

    var rowNode = table.row.add( [
        articolo,
        lottoHtml,
        scadenzaHtml,
        udm,
        quantitaHtml,
        pezziHtml,
        prezzoHtml,
        scontoHtml,
        totale,
        iva,
        deleteLink
    ] ).draw( false ).node();
    $(rowNode).css('text-align', 'center').css('color','#080707');
    var cssClass = 'rowArticolo';
    $(rowNode).addClass(cssClass);
    $(rowNode).attr('data-id', articoloId);
    $(rowNode).attr('data-scadenza-giorni', articoloScadenzaGiorni);
    $(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);
}

$.fn.aggiornaRigaArticolo = function(table,currentRowIndex,currentQuantita,currentPezzi,lotto,scadenza,prezzo,prezzoIva,sconto,
                                     quantita,pezzi,codiceFornitore,lottoRegExp,dataScadenzaRegExp,totale,totaleConIva){

    var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));
    var newPezzi = pezzi + $.fn.parseValue(currentPezzi,'int');

    var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(newQuantita, 3) +'">';
    var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';

    var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
    var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';

    //var pezziDaEvadereHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezziDaEvadere" value="'+pezziDaEvadere+'">';
    if($.fn.isRicevutaPrivato()){
        var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzoIva+'" data-prezzo="'+prezzo+'" data-totale="'+totale+'">';
    } else {
        var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
    }
    var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

    if($.fn.isVersionClient()){
        prezzoHtml = prezzoHtml.replace('>', ' disabled>');
    }

    var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
    rowData[1] = lottoHtml;
    rowData[2] = scadenzaHtml;
    rowData[4] = newQuantitaHtml;
    rowData[5] = newPezziHtml;
    rowData[6] = prezzoHtml;
    rowData[7] = scontoHtml;
    if($.fn.isRicevutaPrivato()){
        rowData[8] = totaleConIva;
    } else {
        rowData[8] = totale;
    }
    table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();
}

$.fn.inserisciRigaProdotto = function(table,articoloId,articolo,lottoHtml,scadenzaHtml,udm,quantitaHtml,pezziHtml,prezzoHtml,scontoHtml,totale,iva,tipo,articoloScadenzaGiorni=0){

    var deleteLink = '<a class="deleteDdtProdotto" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

    var rowsCount = table.rows().count();

    var rowNode = table.row.add( [
        articolo,
        lottoHtml,
        scadenzaHtml,
        udm,
        quantitaHtml,
        pezziHtml,
        prezzoHtml,
        scontoHtml,
        totale,
        iva,
        deleteLink
    ] ).draw( false ).node();
    $(rowNode).css('text-align', 'center').css('color','#080707');
    $(rowNode).addClass('rowProdotto');
    $(rowNode).attr('data-id', articoloId);
    $(rowNode).attr('data-tipo', tipo);
    $(rowNode).attr('data-scadenza-giorni', articoloScadenzaGiorni);
    $(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);
}

$.fn.aggiornaRigaProdotto = function(table,currentRowIndex,articoloId,currentQuantita,currentPezzi,lotto,scadenza,prezzo,sconto,
                                     quantita,pezzi,codiceFornitore,lottoRegExp,dataScadenzaRegExp,totale){

    var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));
    var newPezzi = pezzi + $.fn.parseValue(currentPezzi,'int');

    var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(newQuantita, 3) +'">';
    var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';

    var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
    var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';
    var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
    var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

    var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
    rowData[1] = lottoHtml;
    rowData[2] = scadenzaHtml;
    rowData[4] = newQuantitaHtml;
    rowData[5] = newPezziHtml;
    rowData[6] = prezzoHtml;
    rowData[7] = scontoHtml;
    rowData[8] = totale;
    table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();
}
