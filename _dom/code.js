/*******************
*********** CLIENTES
********************/
function addCliente() {
	document.location = 'cliente.php';
}

function cancelCliente() {
	document.location="index.php";	
}

function doParticular() {
	var isParticular = $('particular').checked;
	if(isParticular) {
		$('isempresa').hide();
	} else {
		$('isempresa').show();
	}
}


function saveCliente() {
	if(rsv.validate(document.getElementById('formulario'), rulesCliente)) {
		$.ajax({url: '_incl/dispatcher.php', 
			type:'post',
			data: {accion: $('#op').val() == 'add' ? 2 : 3,
						objeto:1,
						id: $('#id').val(),
						nombre: $('#nombre').val(),
						particular: $('#particular').val() ? 1 : 0,
						razonsocial: $('#razonsocial').val(),
						nif: $('#nif').val(),
						division: $('#division').val(),
						estado: $('#estado').val()
						},
			success: function(transport){
				if(transport.responseText != -69) {
					if($('#id').val() == -1) {
						var destino =  transport.responseText;
					} else {
						var destino = $('#id').val();
					}
					document.location='cliente.php?id=' + destino;
					return;
					
				} else {
					alert('Ha ocurrido un error al grabar el cliente.');
				}
			}
		});
		cancelEdit();
	}
}
function doFuentes(strTrigger) {
	if($('#fuente').val() === '#otro#') {
		$('fuente_otros_field').show();
		$('fuente_otros').activate();	
	} else {
		$('fuente_otros_field').hide();		
		$('fuente_otros').value = '';	
	}
}

/*******************
********** CONTACTOS
********************/
function addContacto(numClienteID) {
	if(numClienteID > 0) {
		document.location = 'contacto.php?cliente=' + numClienteID;
	} else {
		alert('Graba el cliente antes de a\u361adir un contacto.');	
	}
}

function cancelContacto(numClienteID) {
	document.location="cliente.php?id="+numClienteID;	
}

function saveContacto() {
	if(rsv.validate(document.getElementById('formulario'), rulesContacto)) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: $('#op').val() == 'add' ? 2 : 3,
						objeto:2,
						id: $('#id').val(),
						cliente: $('#cliente').val(),
						nombre: $('#nombre').val(),
						departamento: $('#departamento').val(),
						cargo: $('#cargo').val()
						},
			onSuccess: function(transport) {
				if(transport.responseText != -69) {
					if($('#id').val() == -1) {
						var resultado = transport.responseText,
							arrResultado = resultado.split('##');

						document.location='contacto.php?id=' + arrResultado[0];
						return;
					} else {
						document.location='contacto.php?id=' + $('#id').val();
						return;
/*
						var arrDatos = transport.responseText.evalJSON();
						$('dato_nombre').update(arrDatos.NOMBRE);
						$('dato_cliente').update(arrDatos.CLIENTE);
						$('dato_departamento').update(arrDatos.DEPARTAMENTO);
						$('dato_cargo').update(arrDatos.CARGO);
*/
					}
	//				cancelEdit();
				} else {
					alert('Ha ocurrido un error al grabar el cliente.');
				}
			}
		});
	}
}

function delContacto() {
	if(confirm('Seguro que deseas eliminar este contacto?')) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: 4,
						objeto:2,
						id: $('#id').val()},
			onSuccess: function(transport){
				if(transport.responseText === '1') {
					document.location='cliente.php?id='+$('#cliente').val();
				} else {
					alert('Ha ocurrido un error al borrar.');
				}
			}
		});
	}
}

//----------------------------------------------------------------------------
function delCliente() {

	if(confirm('Seguro que deseas eliminar este cliente?')) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: 4,
						objeto:1,
						id: $('#id').val()},
			onSuccess: function(transport){
				if(transport.responseText === '1') {
					clientes();
				} else {
					alert('Ha ocurrido un error al borrar.');
				}
			}
		});
	}
}

/*******************
************* GRUPOS
********************/
function addGrupo($strTipo) {
	Modalbox.show('./_incl/dlog_addgrupo.php?t=c', {width: 400, title: ($strTipo == 'contacto' ? 'A&ntilde;adir grupo de contactos' : 'A&ntilde;adir grupo de clientes')});
}

function add2Grupo() {
	Modalbox.show('./_incl/dlog_add2grupo.php', {width: 300, title: 'A&ntilde;adir a un grupo'});
}

function delFromGrupo(numCliente, numGrupo, strTipo) {
	new Ajax.Request('_incl/dispatcher.php', {
		method:'post',
		parameters: {accion: 10,
					objeto:3,
					id: numGrupo,
					miembro:numCliente},
		onSuccess: function(transport){
			if(transport.responseText !== '-69') {
				if(strTipo == 'cliente') {
					loadGrupos();
				} else {
					loadGruposContacto();
				}
			} else {
				alert('Ha ocurrido un error al borrar el miembro del grupo.');
			}
		}
	});
}

function saveGrupo(strTipo) {
	new Ajax.Request('_incl/dispatcher.php', {
		method:'post',
		parameters: {accion: 2,
					objeto:3,
					nombre: $('#nombre_dlog').val(),
					tipo: (strTipo == 'cliente' ? $('#tipo_dlog').val() : 99),
					desc: $('#descripcion_dlog').val()},
		onSuccess: function(transport){
			if(transport.responseText != -69) {
				var arrDatos = transport.responseText.evalJSON();
				alert('Creado el grupo ' + arrDatos('nombre') + '.');
			} else {
				alert('Ha ocurrido un error al grabar el grupo.');
			}
		}
	});
	Modalbox.hide();
}

function loadGrupos() {
	new Ajax.Request('_incl/dispatcher.php', {
		method:'post',
		parameters: {id: numClienteID,
					accion:8,
					objeto:1},
		onSuccess: function(transport) {
			var elHolder = $('holdergrupos'),
				arrItems = elHolder.descendants(),
				numItems = arrItems.length;
				
			if(arrItems.length) {
				arrItems.each(function(objeto) { objeto.remove() });
			}
			if(transport.responseText != -69) {
				var arrGrupos = transport.responseText.evalJSON(),
					numGrupos = arrGrupos.length;
				for(var i = 0; i < numGrupos; i++) {
					elHolder.appendChild($('li').writeAttribute({'grupo': arrGrupos[i]['ID']}).update(arrGrupos[i]['LABEL']).observe('click', doGrupo));
				}
			} else {
				elHolder.appendChild($('span').setStyle({'marginRight': '12px', 'fontSize': '11px'}).update('Sin grupo'));
			}
			elHolder.appendChild($('li').update('+').observe('click', add2Grupo));
		}
	});
}

function doGrupo(evt) {
	var elBoton = evt.element(), 
		numGrupo = elBoton.getAttribute('grupo'),
		strGrupo = elBoton.innerHTML; 
	
	if(evt.altKey) {
		if(confirm('Deseas borrar a este cliente del grupo ' + strGrupo)) {
			delFromGrupo(numClienteID, numGrupo, 'cliente') 
		}
	} else {
		document.location = 'index.php?grupo=' + numGrupo;
	}
}

function doAdd2Grupo(evt) {
	var elCelda = evt.findElement('td'),
		strTipo = $('#op_dlog').val();
 	if (elCelda) {
		var numGrupoID = elCelda.readAttribute('grupo');
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {id: numGrupoID,
						miembro: (strTipo == 'cliente' ? numClienteID : numContactoID),
						accion: 9,
						objeto: 3},
			onSuccess: function(transport) {
					if(transport.responseText != -69) {
						if(strTipo == 'cliente') {
							loadGrupos();
						} else {
							loadGruposContacto();
						}
						Modalbox.hide();
					}
				}
		});
	}
}

function getGrupos(strTipo) {
	new Ajax.Request('_incl/dispatcher.php', {
		method:'post',
		parameters: {id: (strTipo == 'cliente' ? $('#tipo_dlog').val() : 99),
					accion: 7,
					objeto: 3},
		onSuccess: function(transport) {
			if(transport.responseText != -69) {
				cleanDiv('dlog_tabla');
				var elHolder = $('dlog_tabla'),
					arrDatos = transport.responseText.evalJSON(),
					strClass='impar',
					i,
					proyectoRow,
					curCell,
					numGrupos = arrDatos.length;
				if(numGrupos) {
					for(i = 0; i < numGrupos; i++) {			
						proyectoRow = document.createElement('tr');
						proyectoRow.className = strClass;
						curCell = document.createElement('td');
						curCell.writeAttribute('grupo', arrDatos[i]['ID']);
						curCell.appendChild(document.createTextNode(arrDatos[i]['LABEL']));
						proyectoRow.appendChild(curCell);
						elHolder.appendChild(proyectoRow);
						strClass = strClass == 'impar' ? 'par' : 'impar';
					}
					elHolder.observe('click', doAdd2Grupo);
				} else {
					alert('No se ha creado ning\u00FAn grupo.');	
				}
			} else {
				alert('getGrupos: Error.');
			}
		}
	});
}

/*******************
***** GRUPOSCONTACTO
********************/

function doGrupoContacto(evt) {
	var elBoton = evt.element(), 
		numGrupo = elBoton.getAttribute('grupo'),
		strGrupo = elBoton.innerHTML; 
	
	if(evt.altKey) {
		if(confirm('Deseas borrar a este cliente del grupo ' + strGrupo)) {
			delFromGrupo(numContactoID, numGrupo, 'contacto') 
		}
	} else {
		document.location = 'index.php?grupo=' + numGrupo;
	}
}

function loadGruposContacto() {
	new Ajax.Request('_incl/dispatcher.php', {
		method:'post',
		parameters: {id: numContactoID,
					accion:11,
					objeto:2},
		onSuccess: function(transport) {
			var elHolder = $('holdergrupos'),
				arrItems = elHolder.descendants(),
				numItems = arrItems.length;
				
			if(numItems) {
				arrItems.each(function(objeto) { objeto.remove() });
			}
			if(transport.responseText != -69) {
				var arrGrupos = transport.responseText.evalJSON(),
					numGrupos = arrGrupos.length;
				if(numGrupos) {
					for(var i = 0; i < numGrupos; i++) {
						elHolder.appendChild($('li').writeAttribute({'grupo': arrGrupos[i]['ID']}).update(arrGrupos[i]['LABEL']).observe('click', doGrupoContacto));
					}
				} else {
					elHolder.appendChild($('span').setStyle({'marginRight': '12px', 'fontSize': '11px'}).update('Sin grupo'));				
				}
			} else {
				elHolder.appendChild($('span').setStyle({'marginRight': '12px', 'fontSize': '11px'}).update('Sin grupo'));
			}
			elHolder.appendChild($('li').update('+').observe('click', add2GrupoContacto));
		}
	});
}

function add2GrupoContacto() {
	Modalbox.show('./_incl/dlog_add2grupo.php?t=99', {width: 300, title: 'A&ntilde;adir a un grupo'});
}

/*******************
***** Importar los CREs en el cliente  //JMC
********************/
//---------------------------------------------------------------------------

function prepararDialogoImportarCRE()
{
	$("#dlog_carga_ficheroCRE").dialog({
		autoOpen: false,
		resizable: false,
		height: 160,
		width: 440,
		modal: true,
		title: 'Importar CRE',
		buttons: {
			'Cancelar': function() {
				$(this).dialog( "close" );
			},
			'Importar': function() {
				var $miForm = $('#frm_importarCRE');
				
				if($miForm.length) {
						var id_cliente     = parseInt($miForm.find('input[name=id_cliente]').val()),
							strFichero    = $miForm.find('input[type=file]').val(),
							msgError      = '';
					var 	strFichero    = $miForm.find('input[type=file]').val(),
							msgError      = '';
						
					if(strFichero == '')
						msgError += '  * Hay que seleccionar algún fichero\n';
						
					if(msgError == '')
						$miForm[0].submit();
					else
						alert('ERRORES:\n'+msgError);

				}
			}
		},

		close: function() {
			$('#import_ficheroCRE').val('');
		}
	});
  
}  // prepararDialogoImportar()

//--------------------------------------------------------------------------
function doImportFicheroCRE()
{
		$('#dlog_carga_ficheroCRE').dialog('open');
}

