var arrComms = {"0":{"ID":"4","LABEL":"email"},"1":{"ID":"3","LABEL":"Fax"},"2":{"ID":"7","LABEL":"Messenger"},"3":{"ID":"2","LABEL":"Móvil"},"4":{"ID":"6","LABEL":"Skype"},"5":{"ID":"1","LABEL":"Teléfono"},"6":{"ID":"5","LABEL":"web"}},
    arrDirs = {"0":{"ID":"2","LABEL":"Envíos"},"1":{"ID":"3","LABEL":"Facturación"},"2":{"ID":"1","LABEL":"Sede central"},"3":{"ID":"4","LABEL":"Sucursal"}},
    numClienteID = 9,
    numContactoID = 0,
    numNotaOwner = 9,
    reglaNombre = "required,nombre,El campo nombre es obligatorio.",
    textoAyuda = "Sit&uacute;e el cursor sobre el icono, bot&oacute;n o campo para el que desee obtener ayuda.",
    textoConfirmDelete = "\u00BFEst\u00E1 seguro que desea eliminar este [[1]]?",
    textoConfirmEdit = "Est\u00E1 editando un [[1]].\n\u00BFEst\u00E1 seguro de que quiere cancelar la edici\u00F3n y mostrar otro en su lugar?";


/* /srv/www/htdocs/folletos/_dom/code.js */
// para los casos en los que el navegador no soporta el objeto JSON

var JSON = JSON || {};

// implement JSON.stringify serialization
JSON.stringify = JSON.stringify || function (obj) {

	var t = typeof (obj);
	if (t != "object" || obj === null) {

		// simple data type
		if (t == "string") obj = '"'+obj+'"';
		return String(obj);

	}
	else {

		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);

		for (n in obj) {
			v = obj[n]; t = typeof(v);

			if (t == "string") v = '"'+v+'"';
			else if (t == "object" && v !== null) v = JSON.stringify(v);

			json.push((arr ? "" : '"' + n + '":') + String(v));
		}

		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};


// implement JSON.parse de-serialization
JSON.parse = JSON.parse || function (str) {
	if (str === "") str = '""';
	eval("var p=" + str + ";");
	return p;
};


// implementación de indexOf para IE
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;
 
    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;
 
    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

function removeFromArray(arrArray, strValor) {
	arrArray.splice(arrArray.indexOf(strValor), 1);	
}

function cleanDiv(elDiv) {
	$(elDiv).descendants().each(function (objeto){objeto.remove();});
}

function addOption(objSelect, objOption) {
	try {
		objSelect.add(objOption, null); // standards compliant; doesn't work in IE
	}
	catch(ex) {
		objSelect.add(objOption);  // IE only
	}
}

function array2select(objSelect, arrDatos, numCurOption, boolEmpty) {
	var elOptNew;
	objSelect.length = 0;
	if(boolEmpty) {
		elOptNew = document.createElement('option');
		elOptNew.value = 
			elOptNew.text = '';
		addOption(objSelect, elOptNew);
	}
	for(var id in arrDatos) {
		if(arrDatos.hasOwnProperty(id)) {
			var strValue, strText;
			if(typeof(arrDatos[id]) == 'object') {
				var arrResultado = arrDatos[id];
				strValue = arrResultado.ID;
				strText = arrResultado.LABEL;			
			} else {
				strValue = id;
				strText = arrDatos[id];
			}
			if(strText == '-') {
				elOptNew = document.createElement('optgroup');
			} else {
				elOptNew = document.createElement('option');
				if(numCurOption == strValue) {
					elOptNew.selected = true;
				} 
				elOptNew.value = strValue;
				elOptNew.text = strText;
			}
			addOption(objSelect, elOptNew);
		}
	}
}

function $RF(el, radioGroup) {
    if($(el).type && $(el).type.toLowerCase() == 'radio') {
        var radioGroup = $(el).name;
        var el = $(el).form;
    } else if ($(el).tagName.toLowerCase() != 'form') {
        return false;
    }
 
    var checked = $(el).getInputs('radio', radioGroup).find(
        function(re) {return re.checked;}
    );
    return (checked) ? $F(checked) : null;
}

function fecha2JSDate(strFecha) {
	return new Date(strFecha.substring(6, 10), strFecha.substring(3, 5) - 1, strFecha.substring(0, 2));	
}

/******/

function doEdit() {
	if(typeof jQuery != 'undefined') {
		$('#datos_display').slideUp(300);
		$('#datos_edit').slideDown(300);
	}
	else {
	  Effect.SlideUp('datos_display', { duration: 0.3 });
	  Effect.BlindDown('datos_edit', { duration: 0.3 });		
	}
}

function cancelEdit() {
	if(typeof jQuery != 'undefined') {
		$('#datos_edit').slideUp(300);
		$('#datos_display').slideDown(300);		
	}
	else {
		Effect.BlindUp('datos_edit', { duration: 0.3 });
		Effect.BlindDown('datos_display', { duration: 0.3 });
	}
	$('rsvErrors').hide();
}

function doJqEdit() {
	$('#datos_display').hide();
	$('#datos_edit').show();
}

function cancelJqEdit() {
	$('#datos_display').show();
	$('#datos_edit').hide();
	$('#rsvErrors').hide();
}

function rsvCheckDate(strField, strLabel){
	var arrDaysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], 
		dtCh= '/',
		minYear = 2011,
		maxYear = 2100,
		strDate = $F(strField),
		objField = $(strField),
		numPos1 = strDate.indexOf(dtCh),
		numPos2 = strDate.indexOf(dtCh, numPos1 + 1),
		numDay = parseInt(strDate.substring(0, numPos1), 10),
		numMonth = parseInt(strDate.substring(numPos1 + 1, numPos2), 10),
		numYear = parseInt(strDate.substring(numPos2 + 1), 10);
		

	arrDaysInMonth[2] = ((numYear % 4 == 0) && ( (!(numYear % 100 == 0)) || (numYear % 400 == 0))) ? 29 : 28;
	if (numDay < 1 || numDay > 31 || numDay > arrDaysInMonth[numMonth]) {
		return [[objField, "La fecha " + strLabel + " no parece ser válida."]];
	}
		
	if (numPos1 == -1 || numPos2 == -1){
        return [[objField, "El formato de fecha " + strLabel + " debe ser dd/mm/yyyy."]];
	}
	if (numYear == 0 || numYear < minYear || numYear > maxYear) {
		return [[objField, "El año en la fecha " + strLabel + " debe tener 4 dígitos y ser mayor a " + minYear + "."]];
	}
	if (numMonth < 1 || numMonth > 12){
		return [[objField, "El mes en la fecha " + strLabel + " no es válido."]];
	}
	return true;
}

function createUploader(numOwner, numTipoOwner, numRepositorio) {     
	if(qq != undefined) {       
		var uploader = new qq.FileUploader({
			element: document.getElementById('file-uploader'),
			action: '../_incl/upload.php',
			debug: true,
			cancel: function() {
				Effect.BlindUp($('file-uploader'), {duration: 0.3});
				Effect.BlindDown($('ctldocumentos'), { duration: 0.3 });			
			},	// tengo que hacer un algo que elimine todos los objetos
			commit: '../_incl/commit.php',
			payload: {numOwnerID: numOwner, numTipoOwner: numTipoOwner, numRepo: numRepositorio}
		});
		Effect.BlindUp($('ctldocumentos'), {duration: 0.3});
		Effect.BlindDown($('file-uploader'), { duration: 0.3 });
	}
}

function togglePanel(strPanel) {
	strPanel = 'panel' + strPanel;
	if($(strPanel).visible()) {
		Effect.BlindUp(strPanel, { duration: 0.3 });
	} else {
		Effect.BlindDown(strPanel, { duration: 0.3 });
	}
}

function doCall(e) {
	var elBoton = e.element(),
		strNumero = elBoton.innerHTML;
		
	// hay que limipar strNumero para asegurarnos de que es un número de teléfono
	document.location='callto://' + strNumero;
}

function define (name, value) {
    // Define a new constant
    //
    // version: 903.3016
    // discuss at: http://phpjs.org/functions/define    // +      original by: Paulo Freitas
    // +       revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
    // + reimplemented by: Brett Zamir (http://brett-zamir.me)
    // *        example 1: define('IMAGINARY_CONSTANT1', 'imaginary_value1');
    // *        results 1: IMAGINARY_CONSTANT1 == 'imaginary_value1'    var defn, replace, script, that = this,
        d = this.window.document;
    var toString = function (name, value) {
        return 'const ' + name + '=' + (/^(null|true|false|(\+|\-)?\d+(\.\d+)?)$/.test(value = String(value)) ? value : '"' + replace(value) + '"');
    };    try {
        eval('const e=1');
        replace = function (value) {
            var replace = {
                "\x08": "b",                
				"\x0A": "\\n",
                "\x0B": "v",
                "\x0C": "f",
                "\x0D": "\\r",
                '"': '"',                
				"\\": "\\"
            };
            return value.replace(/\x08|[\x0A-\x0D]|"|\\/g, function (value) {
                return "\\" + replace[value];
            });        };
        defn = function (name, value) {
            if (d.createElementNS) {
                script = d.createElementNS('http://www.w3.org/1999/xhtml', 'script');
            } else {                
				script = d.createElement('script');
            }
            script.type = 'text/javascript';
            script.appendChild(d.createTextNode(toString(name, value)));
            d.documentElement.appendChild(script);           
			d.documentElement.removeChild(script);
        };
    } catch (e) {
        replace = function (value) {
            var replace = {                
				"\x0A": "\\n",
                "\x0D": "\\r"
            };
            return value.replace(/"/g, '""').replace(/\n|\r/g, function (value) {
                return replace[value];            });
        };
        defn = (this.execScript ?
        function (name, value) {
            that.execScript(toString(name, value), 'VBScript');        } : function (name, value) {
            eval(toString(name, value).substring(6));
        });
    }
    defn(name, value);
}

function str_pad (input, pad_length, pad_string, pad_type) {
    // Returns input string padded on the left or right to specified length with pad_string  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/str_pad    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // + namespaced by: Michael White (http://getsprink.com)
    // +      input by: Marco van Oort
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');    // *     returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
    // *     example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
    // *     returns 2: '------Kevin van Zonneveld-----'
    var half = '',
        pad_to_go; 
    var str_pad_repeater = function (s, len) {
        var collect = '',
            i;
         while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);
         return collect;
    };
 
    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' '; 
    if (pad_type != 'STR_PAD_LEFT' && pad_type != 'STR_PAD_RIGHT' && pad_type != 'STR_PAD_BOTH') {
        pad_type = 'STR_PAD_RIGHT';
    }
    if ((pad_to_go = pad_length - input.length) > 0) {        if (pad_type == 'STR_PAD_LEFT') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type == 'STR_PAD_RIGHT') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type == 'STR_PAD_BOTH') {            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    } 
    return input;
}

function zerofill (num, length) {
	length = length !== undefined ? length : 5; 
	return str_pad(num, length, '0', 'STR_PAD_LEFT');
}

// metodos de options comunes a todos los modulos
function clientes() {
	document.location = '../clientes/index.php';
}

function proyectos() {
	/*
	 * OJO: Si NO se quisiera mantener la selección entre llamadas
	 * habría que añadir el parámetro "?t".
	*/
  document.location = '../proyectos/index.php?t';
	//document.location = '../proyectos/index.php';
}

function doEstatusFotografico() {
	document.location = '../proyectos/estatus.php';
}

function productos() {
	document.location = '../productos/index.php';
}

function admin() {
	document.location = '../admin/index.php';
}

function addProyecto(numCliente) {
	
//	document.location = '../proyectos/nuproyecto.php';

  var id_proy = 0,
	    id_cliente = (typeof numCliente == 'undefined' ? 0 : parseInt(numCliente));

	document.location = '../proyectos/proyecto.php?id='+id_proy+(id_cliente > 0 ? "&id_cli="+id_cliente : '');

}

/**
 * Así estaba antes de quitar el finder del medio (doFileManager()).
 * Ahora me la he llevado a productos ya que es en el único sitio que creo que la voy a usar
 *
 * Parece que si así que la que ahora renombro como _OLD es la del code.js de Productos
 */
function doFileManager()
{

	$('#tfilemanager').dialogelfinder('open').css('z-index', '9999');

}

//---------------------------------------------------------------------------
function hacerTextosEditables(nombreClase, id_objeto, attrID, destinoPost)
{
	
  $(nombreClase).editable({
    
    onEdit: function() {
      var $miInput = $(this).find('input').css('width', '100%');

//      var $this = $(this),
//          $miInput = $this.find('input').addClass('fieldtop');
//          
//      if($this.attr('fld')=='ref') {
//        $miInput.constrain({allow: { regex: "[0-9]" }}).attr('maxlength', '10');
//      }

    },
    
    onSubmit: function(content) {
      var antes   = content.previous.trim(),
          despues = content.current.trim();
					
			// He decidido que si que se puede dejar en blanco el texto aunque puedo volver a cambiar
      if(despues != antes) {
        // Determinamos los datos del objeto a mandar
        var $this = $(this),
            id_imagen = parseInt($this.attr(attrID));
                
        $.post(
          destinoPost, 
          { objeto: id_objeto,
            accion: UPDATE,
            id: id_imagen,
            edit_texto_comercial: despues
          }, 
          function(data) {
            
            if(!is_object(data) && !is_array(data) && data != 1) {
              $this.text(antes);
              alert("Error al actualizar los datos en el registro");
            }
						else {
							var $btnOK = $this.parent().find('.ok_texto_comercial');
							if($btnOK.length)
							  if(despues.length > 0)
								  $btnOK.show();
								else
								  $btnOK.hide();
						}
          },
          'json'
        ).error(function () {
          alert("Se ha producido un error de comunicación al modificar el texto.");
        });
      }
    }
  });  // editable();

}  // hacerTextosEditables()

//---------------------------------------------------------------------------
function is_array(input)
{
  return typeof(input)=='object' && (input instanceof Array);
}
 
//---------------------------------------------------------------------------
function is_object(input)
{
  return typeof(input)=='object' && !(input instanceof Array);
}
 
//---------------------------------------------------------------------------
function is_int(x)
{
	var y = parseInt(x);
	if (isNaN(y))
		return false;
	return x == y && x.toString() == y.toString();
}

//---------------------------------------------------------------------------
function nl2br (str, is_xhtml)
{   
	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

//---------------------------------------------------------------------------
//

if(typeof DEFINES_HECHOS == 'undefined') {

	define('DEFINES_HECHOS', 1);
	define('SELECT', 1);
	define('INSERT', 2);
	define('UPDATE', 3);
	define('DELETE', 4);
	
	define('FACTURA', 1);
	define('DOCUMENTO', 5);
	
	define('CATALOGO', 14);
	define('PRODUCTO', 15);
	define('IMAGEN', 16);
	
	// entidades del módulo proyectos
	define('PROYECTO', 80);
	define('TIMING',   81);
	define('TAB_PRO',  82);
	define('OFERTA',   83);
	define('MAQUETA',  84);
	
}  // (typeof DEFINES_HECHOS == 'undefined')


/* end of /srv/www/htdocs/folletos/_dom/code.js*/

/* /srv/www/htdocs/folletos/_dom/box.js */
/*******************
************** BOXES
********************/
var Box = {
	boolDirty: false,
	elBox: null,
	elForm: null,
	numCurItem: 0,
	objParams: [],
	strCurBox: '',
	
	define: function (strNombre, arrParams) {
		this.objParams[strNombre] = arrParams;
	},

	create: function (strNombre, numCurItem, elPadre) {
		var deferStyle = false;
		
		if (this.elBox !== null) {
			this.hide();	
		}
		
		this.numCurItem = numCurItem;
		this.strCurBox = strNombre;
		if (typeof this.objParams[this.strCurBox] === 'undefined') {
			this.objParams[this.strCurBox] = {'ctl': '', 'holder': '', 'action' : ''};
		}
		this.elForm = $('form', {id: 'boxform', method: 'post', action: this.objParams[this.strCurBox].action});
		this.elBox = $('div', {id: strNombre}).addClass('ebox');
		
		if (elPadre) {
			elPadre = $(elPadre);
//			this.elBox.setStyle({'display': 'none', 'position': 'relative'});
			this.elbox.css('display', 'none');
			this.elbox.css('position', 'relative');
			
		} else {
			elPadre = document.body;
			deferStyle = true;		// hasta que el objeto esté appendado y tenga dimensiones.
		}
		
		this.elBox.appendChild(this.elForm);
		elPadre.appendChild(this.elBox);
		
		if(deferStyle) {
			this.elBox.setStyle({'display': 'none', 'position': 'fixed', 'top': '150px', 'left':(parseInt((document.viewport.getWidth() - this.elBox.getWidth()) / 2, 10))+'px', 'zIndex': 9999});
		}
	},
	
	show: function () {		
		this._dirtyHandler();
		if (typeof this.objParams[this.strCurBox] !== 'undefined') {
			if (typeof this.objParams[this.strCurBox].ctl !== 'undefined' && this.objParams[this.strCurBox].ctl !== '') {
				Effect.BlindUp(this.objParams[this.strCurBox].ctl, { duration: 0.3 });
			}
			if (typeof this.objParams[this.strCurBox].holder !== 'undefined' && this.objParams[this.strCurBox].holder !== '') {
				Effect.BlindUp(this.objParams[this.strCurBox].holder.replace('[ID]', this.numCurItem), { duration: 0.3 });
			}
		}
		Effect.BlindDown(this.elBox, 
								{duration: 0.3, 
								afterFinish:function(effect) {
										var boolFocus = false;
										effect.element.descendants().each(function (item) {
											if (item.nodeName === 'INPUT' || item.nodeName === 'SELECT' || item.nodeName === 'TEXTAREA' ) {
												if (item.type !== 'hidden' && boolFocus === false) {
													boolFocus = true;
													item.focus();
												}
											}
										}
									);
								}
							}
						);
	},
	
	hide: function () {
		if (this.elBox !== null) {
			Effect.BlindUp(this.elBox, {duration: 0.3, afterFinish: function(effect) {effect.element.remove();}});
			if (typeof this.objParams[this.strCurBox] !== 'undefined') {
				if (typeof this.objParams[this.strCurBox].ctl !== 'undefined' && this.objParams[this.strCurBox].ctl !== '') {
					Effect.BlindDown(this.objParams[this.strCurBox].ctl, { duration: 0.3 });
				}
				if (typeof this.objParams[this.strCurBox].holder !== 'undefined' && this.objParams[this.strCurBox].holder !== '') {
					Effect.BlindDown(this.objParams[this.strCurBox].holder.replace('[ID]', this.numCurItem), { duration: 0.3 });
				}
			}
			this.numCurItem = 0;
			this.strCurBox = '';
			this.elBox = this.elForm = null;
		}
	},
	
	// para los casos en que eliminamos el objeto que sujeta la caja y queremos que la caja desaparezca.
	kill: function () {
		this.elBox.remove();
	},
	
	attach: function(elDiv) {
		if (this.elForm !== null) {
			this.elForm.appendChild(elDiv);
		}
	},
	
	save: function() {
		if (this.objParams[this.strCurBox].validate !== 'undefined') { 
			if (this.objParams[this.strCurBox].validate()) {
				this.elForm.submit();
			}
		} else {
			this.elForm.submit();	
		}
	},
	
	getName: function() {
		return this.strCurBox;
	},
	
	_dirtyHandler: function() {
		if (this.elForm !== null) {	
			this.elForm.descendants().each(function (item) {
				if (item.nodeName === 'INPUT' || item.nodeName === 'SELECT' || item.nodeName === 'TEXTAREA' ) {
					item.observe('change', Box.setDirty);
				}
			});	
		}
	},
	
	setDirty: function(evt) {
		this.boolDirty = true;
	},
	
	isDirty: function() {
		return this.boolDirty;	
	}
};


/* end of /srv/www/htdocs/folletos/_dom/box.js*/

/* /srv/www/htdocs/folletos/_dom/jqTabs.js */
var Tabs = {
	arrPaneles: [],
	curEstado: 'idle',
	numCurPanel: 0,
			
	change: function (numTab) {
		// Iván - 03/08/2012: Si se pulsa en el que ya está activo pasamos
		if(numTab != this.numCurPanel) {
			if(this.canChange()) {			
				this.curEstado = 'idle';
				
				$('#tab' + this.arrPaneles[this.numCurPanel]).removeClass('activa');
				$('#panel' + this.arrPaneles[this.numCurPanel]).hide();
	
				$('#tab' + this.arrPaneles[numTab]).addClass('activa');
				$('#panel' + this.arrPaneles[numTab]).show('slide',{direction: numTab > this.numCurPanel ? 'right' : 'left'});
				
				this.numCurPanel = numTab;
			}
		}
	},
	
	init: function (arrPaneles) {
		var i,
			self = this,
			numPaneles = arrPaneles.length;
		
		this.arrPaneles = arrPaneles;
		var $elPanel = $('#panel' + this.arrPaneles[this.numCurPanel]),
		    $elTab   = $('#tab' + this.arrPaneles[this.numCurPanel]);
		$('#panel' + this.arrPaneles[this.numCurPanel]).show();
		$('#tab' + this.arrPaneles[this.numCurPanel]).addClass('activa');

		for(i = 0; i < numPaneles; i++) {
			$('#tab' + this.arrPaneles[i])
				.attr('panel', i)
				.click(function (evt) {
					self.change($(evt.target).attr('panel'));					
				});
		}
	},
	
	canChange: function () {
		return this.curEstado == 'editando' ? confirm(textoConfirmEdit) : true;
	},
	
	setEstado: function (strEstado) {
		this.curEstado = strEstado;
	}
};

/* end of /srv/www/htdocs/folletos/_dom/jqTabs.js*/

/* /srv/www/htdocs/folletos/_dom/code.comms.js */
// reglas para la validacion de formularios
if(typeof rsv !== undefined){
	rsv.displayType = "display-html";
	var rulesCliente = [];
	rulesCliente.push(reglaNombre);
	
	var rulesContacto = [];
	rulesContacto.push(reglaNombre);
	
	var rulesDir = [];
	rulesDir.push("required,direccion_box,El campo direcci&oacute;n es obligatorio.");
	rulesDir.push("required,poblacion_box,El campo poblaci&oacute;n es obligatorio.");
	rulesDir.push("required,codigopostal_box,El campo c&oacute;digo postal es obligatorio.");

	var rulesComms = [];
	rulesComms.push("required,direccion_box,El campo direcci&oacute;n es obligatorio.");

	var rulesNotas = [];
	rulesNotas.push("required,nota_box,No puedes dejar el texto en blanco.");
	
	var rulesProyecto = [];
	rulesProyecto.push(reglaNombre);
        if(typeof reglaOT != 'undefined')
	  rulesProyecto.push(reglaOT);
}

function hoverItem(tipo, cual, como) {
	var strIcono = tipo + 'edit' + cual;
	if(como=='in') {
		if($(strIcono)){$(strIcono).show();}	
	} else {
		if($(strIcono)){$(strIcono).hide();}
	}
}

/*******************
************** NOTAS
********************/
function doNota(numID, numObjeto, numOwner) {
	var elDiv,
		arrDatos;
	
	Box.define('notabox', {'ctl': 'ctlnotas', 'holder': (numID ? 'nota[ID]' : '')});
	Box.create('notabox', numID, numID ? 'notaholder' + numID : 'holdernotas');

	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('input', {id: 'id_box', value: numID, type: 'hidden'}));	
		elDiv.appendChild($('input', {id: 'objeto_box', value: numObjeto, type: 'hidden'}));	
		elDiv.appendChild($('input', {id: 'owner_box', value: numOwner, type: 'hidden'}));	
		elDiv.appendChild($('textarea', {id: 'nota_box', 'cols': 50, 'rows': 4}).setStyle({'width': '490px'}));
	Box.attach(elDiv);
	
	/*elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('input', {id: 'file_box', 'type': 'file'}).setStyle({'width': '490px'}));
	Box.attach(elDiv);
*/
	Box.attach($('div', {id: 'attach'}).addClass('field'));
	elDiv = $('div', {'class': 'formControls'});

		if(numID) {
			elDiv.appendChild($('a', {'class': 'delButton'}).update('[ eliminar ]').observe('click', delNota));
		}
		elDiv.appendChild($('input', {'id': 'cancel_box', 'type': 'button', 'class': 'formButton', 'value': 'Cancelar'}).observe('click', Box.hide.bind(Box)));
		elDiv.appendChild($('input', {'id': 'grabar_box', 'type': 'button', 'class': 'formButton', 'value': 'Grabar'}).observe('click', saveNota));
	Box.attach(elDiv);
	
	if(numID) {
		new Ajax.Request('_incl/dispatcher.php', {
						method:'post',
						parameters: {accion: 1,
									objeto: numObjeto,
									id: numID},
						onSuccess: function(transport){
									if(transport.responseText != -69) {
										arrDatos = transport.responseText.evalJSON();
										$('id_box').value = arrDatos.ID;
										$('nota_box').value = arrDatos.TEXTO;
									} else {
										alert('No se pueden leer los datos.');
									}
								}
		});
	}	
	Box.show();
}

function saveNota() {
	var arrResultado,
		numID = $F('#$1');
		
	if(Box.getName() == 'notabox' &&
		rsv.validate(document.getElementById('boxform'), rulesNotas)) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: numID > 0 ? 3 : 2,
						objeto: $F('#$1'),
						id: numID,
						owner: $F('#$1'),
						texto: $F('#$1')},
			onSuccess: function(transport) {
				if(transport.responseText != -69) {
					resultado = transport.responseText;
					if(numID > 0) {					
						$('notaholder' + numID).update(resultado);
					} else {
						arrResultado = resultado.split('##');						
						$('notas').appendChild($('li', {id:'notaholder' + arrResultado[0]})).update(arrResultado[1]);
					}
				} else {
					alert('Ha ocurrido un error al grabar.');
				}
			}
		});
		Box.hide();	
	}
}

function delNota() {
	var numID = $F('#$1');

	if(Box.getName() == 'notabox' && confirm('Seguro que deseas eliminar este registro?')) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: 4,
						objeto: $F('#$1'),
						id: numID},
			onSuccess: function(transport){
				if(transport.responseText === '1') {
					($('nota' + numID).ancestors())[0].remove();
				} else {
					alert('Ha ocurrido un error al borrar.');
				}
			}
		});
		Box.hide();
	}
}

/*******************
************** COMMS
********************/

function doComms(numID) {
	var arrDatos,
		elDiv,
		objSelect;
	
	if(!numID) {numID = 0;}
	
	Box.define('combox', {'ctl': 'ctldirecciones', 'holder': (numID ? 'comm[ID]' : '')});
	Box.create('combox', numID, numID ? 'commholder' + numID : 'holderdirecciones');
	
	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('input', {id: 'id_box', value: numID, type: 'hidden'}));
		objSelect = $('select', {id: 'tipo_box'}).setStyle({'width': '80px'})
		array2select(objSelect, arrComms, 0, false);
		elDiv.appendChild(objSelect);
		elDiv.appendChild($('input', {id: 'direccion_box', 'size': 50, maxLength: 250}));
	Box.attach(elDiv);

	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('span').update('Notas'));
		elDiv.appendChild($('textarea', {'id': 'notas_box', 'cols':65}).setStyle({'width':'445px'}));
	Box.attach(elDiv);

	elDiv = $('div', {'class': 'formControls'});
		if(numID) {
			elDiv.appendChild($('a', {'class': 'delButton'}).update('[ eliminar ]').observe('click', delComms));
		}
		elDiv.appendChild($('input', {'id': 'cancel_box', 'type': 'button', 'class': 'formButton', 'value': 'Cancelar'}).observe('click', Box.hide.bind(Box)));
		elDiv.appendChild($('input', {'id': 'grabar_box', 'type': 'button', 'class': 'formButton', 'value': 'Grabar'}).observe('click', saveComms));
	Box.attach(elDiv);

	if(numID) {
		new Ajax.Request('_incl/dispatcher.php', {
				method:'post',
				parameters: {accion: 1,
							objeto:4,
							id: numID},
				onSuccess: function(transport){
					if(transport.responseText != -69) {
						arrDatos = transport.responseText.evalJSON();
						$('id_box').value = arrDatos.ID;
						$('tipo_box').value = arrDatos.TIPO;
						$('direccion_box').value = arrDatos.DIRECCION;
						$('notas_box').value = arrDatos.NOTAS;
					} else {
						alert('No se pueden leer los datos.');
					}
				}
			});
	}
	Box.show();
}

function saveComms() {
	var arrResultado,
		resultado,
		numID = $F('#$1');
		
	if(Box.getName() == 'combox' && rsv.validate(document.getElementById('boxform'), rulesComms)) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: $F('#$1') > 0 ? 3 : 2,
						objeto:4,
						id: numID,
						cliente: numClienteID,
						contacto: numContactoID,
						tipo: $F('#$1'),
						direccion: $F('#$1'),
						notas: $F('#$1')},
			onSuccess: function(transport){
				if(transport.responseText != -69) {
					resultado = transport.responseText;
					if(numID > 0) {
						($('comm' + numID).ancestors())[0].update(resultado);
					} else {					
						arrResultado = resultado.split('##');						
						$('comms').appendChild($('li', {id:'commholder' + arrResultado[0]})).update(arrResultado[1]);
					}
				} else {
					alert('Ha ocurrido un error al grabar.');
				}
			}
		});
		Box.hide();
	}
}

function delComms() {
	if(Box.getName() == 'combox' && confirm('Seguro que deseas eliminar este registro?')) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: 4,
						objeto:4,
						id: $F('#$1')},
			onSuccess: function(transport){
				if(transport.responseText === '1') {
					($('comm'+$F('#$1')).ancestors())[0].remove();
				} else {
					alert('Ha ocurrido un error al borrar.');
				}
			}
		});
		Box.hide();
	}	
}


/*******************
******** DIRECCIONES
********************/
function doDirs(numID) {
	var elDiv,
		objSelect;
	
	if(!numID) {numID = 0;}
	
	Box.define('dirbox', {'ctl': 'ctldirecciones', 'holder': (numID ? 'dir[ID]' : '')});
	Box.create('dirbox', numID, numID ? 'dirholder' + numID : 'holderdirecciones');

	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('input', {id: 'id_box', value: numID, type: 'hidden'}));	
		elDiv.appendChild($('label', {'for': 'tipo_box'}).update('Tipo'));
		objSelect = $('select', {id: 'tipo_box'});
		array2select(objSelect, arrDirs, 0, false);
		elDiv.appendChild(objSelect);
	Box.attach(elDiv);

	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('label', {'for': 'direccion_box'}).update('Domicilio'));
		elDiv.appendChild($('input', {id: 'direccion_box', 'size':48, 'maxLength':250}).setStyle({'width': '390px'}));	
	Box.attach(elDiv);

	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('label', {'for': 'poblacion_box'}).update('Poblaci&oacute;n'));
		elDiv.appendChild($('input', {id: 'poblacion_box', 'size':48, 'maxLength':250}).setStyle({'width': '390px'}));	
	Box.attach(elDiv);
		
	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('label', {'for': 'codigopostal_box'}).update('C&oacute;digo postal'));
		elDiv.appendChild($('input', {id: 'codigopostal_box', 'size':7, 'maxLength':10}));	
	Box.attach(elDiv);
	
	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('label', {'for': 'provincia_box'}).update('Provincia'));
		elDiv.appendChild($('input', {id: 'provincia_box', 'size':48, 'maxLength':250}).setStyle({'width': '390px'}));	
	Box.attach(elDiv);
		
	elDiv = $('div', {'class': 'field'});
		elDiv.appendChild($('label', {'for': 'notas_box'}).update('Notas'));
		elDiv.appendChild($('input', {id: 'notas_box', 'cols':65}).setStyle({'width': '390px'}));	
	Box.attach(elDiv);
	
	elDiv = $('div', {'class': 'formControls'});
		if(numID) {
			elDiv.appendChild($('a', {'class': 'delButton'}).update('[ eliminar ]').observe('click', delDireccion));
		}
		elDiv.appendChild($('input', {'id': 'cancel_box', 'type': 'button', 'class': 'formButton', 'value': 'Cancelar'}).observe('click', Box.hide.bind(Box)));
		elDiv.appendChild($('input', {'id': 'grabar_box', 'type': 'button', 'class': 'formButton', 'value': 'Grabar'}).observe('click', saveDireccion));
	Box.attach(elDiv);
	
	if(numID) {
		new Ajax.Request('_incl/dispatcher.php', {
				method:'post',
				parameters: {accion: 1,
							objeto:5,
							id: numID},
				onSuccess: function(transport){
					if(transport.responseText != -69) {
						var arrDatos = transport.responseText.evalJSON();
						$('id_box').value = arrDatos.ID;
						$('tipo_box').value = arrDatos.TIPO;
						$('direccion_box').value = arrDatos.DOMICILIO;
						$('poblacion_box').value = arrDatos.POBLACION;
						$('provincia_box').value = arrDatos.PROVINCIA;
						$('codigopostal_box').value = arrDatos.CODIGOPOSTAL;
						$('notas_box').value = arrDatos.NOTAS;
					} else {
						alert('No se pueden leer los datos.');
					}
				}
			});
	}
	Box.show();
}

function saveDireccion() {
	var arrResultado,
		resultado,
		numID = $F('#$1');
		
	if(Box.getName() == 'dirbox' && rsv.validate(document.getElementById('boxform'), rulesDir)) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: $F('#$1') > 0 ? 3 : 2,
						objeto:5,
						id: numID,
						cliente: numClienteID,
						contacto: numContactoID,
						tipo: $F('#$1'),
						domicilio: $F('#$1'),
						poblacion: $F('#$1'),
						provincia: $F('#$1'),
						codigopostal: $F('#$1'),
						notas: $F('#$1')},
			onSuccess: function(transport){
				if(transport.responseText != -69) {
					resultado = transport.responseText;
					if(numID > 0) {
						($('dir' + numID).ancestors())[0].update(resultado);
					} else {
						arrResultado = resultado.split('##');						
						$('dirs').appendChild($('li', {id:'dirholder' + arrResultado[0]})).update(arrResultado[1]);
					}
				} else {
					alert('Ha ocurrido un error al grabar.');
				}
			}
		});
		Box.hide();
	}
}

function delDireccion() {
	if(Box.getName() == 'dirbox' && confirm('Seguro que deseas eliminar este registro?')) {
		new Ajax.Request('_incl/dispatcher.php', {
			method:'post',
			parameters: {accion: 4,
						objeto:5,
						id: $F('#$1')},
			onSuccess: function(transport){
				if(transport.responseText === '1') {
					($('dir' + $F('#$1')).ancestors())[0].remove();
				} else {
					alert('Ha ocurrido un error al borrar.');
				}
			}
		});
		Box.hide();
	}
}

/*******************
*********** TELEFONO
********************/
function clearMagni() {
	Box.hide();
}

function doMagni(arrDatos) {
	var elDiv;
	
	Box.create('magnibox');
	
	elDiv = $('div', {id: 'magni'});
		elDiv.appendChild($('p', {id: 'magni_numero'}).update(arrDatos.DIRECCION));
		elDiv.appendChild($('p', {id: 'magni_nombre'}).update(arrDatos.NOMBRE));
		if(arrDatos.DEPARTAMENTO) {
			elDiv.appendChild($('p').update(arrDatos.DEPARTAMENTO));
		}
		if(arrDatos.CARGO) {
			elDiv.appendChild($('p').update(arrDatos.CARGO));
		}
	Box.attach(elDiv);
	
	elDiv.observe('click', clearMagni);
	
	Box.show();
}

function doTelefono(numID) {
	Box.hide();
	new Ajax.Request('_incl/dispatcher.php', {
		method:'post',
		parameters: {accion: 6,
					 objeto: 4,
					 id: numID},
		onSuccess: function(transport){
			if(transport.responseText != -69) {
				doMagni(transport.responseText.evalJSON());
			}
		}
	});
}

function doTelefono2(strNumero, strNombre) {
	Box.hide();
	doMagni({'DIRECCION':strNumero, 'NOMBRE':strNombre, 'DEPARTAMENTO':'', 'CARGO':''});
}


/* end of /srv/www/htdocs/folletos/_dom/code.comms.js*/

/* /srv/www/htdocs/folletos/clientes/_dom/code.js */
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

// function saveCliente() {
// 	if(rsv.validate(document.getElementById('formulario'), rulesCliente)) {
// 		new Ajax.Request('_incl/dispatcher.php', {
// 			method:'post',
// 			parameters: {accion: $('#op').val() == 'add' ? 2 : 3,
// 						objeto:1,
// 						id: $('#id').val(),
// 						nombre: $('#nombre').val(),
// 						particular: $('#particular').val() ? 1 : 0,
// 						razonsocial: $('#razonsocial').val(),
// 						nif: $('#nif').val(),
// 						division: $('#division').val(),
// 						estado: $('#estado').val()
// 						},
// 			onSuccess: function(transport){
// 				if(transport.responseText != -69) {
// 					if($('#id').val() == -1) {
// 						var destino =  transport.responseText;
// 					} else {
// 						var destino = $('#id').val();
// 					}
// 					document.location='cliente.php?id=' + destino;
// 					return;
// 					
// 				} else {
// 					alert('Ha ocurrido un error al grabar el cliente.');
// 				}
// 			}
// 		});
// 		cancelEdit();
// 	}
// }
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



/* end of /srv/www/htdocs/folletos/clientes/_dom/code.js*/

