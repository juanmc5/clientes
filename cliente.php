<?php
/////////////////////////////////////////////////////////////////////////////////////////
//
//  this file has been generated by sformi, the clever tool for lazy developers.
//
//  template v5 - 08082007
//
//  160710 - v1
//

ini_set('error_reporting', E_ALL);
ini_set('display_errors', '1');

session_start();
ob_start();

require_once('./_config.php');
require_once($GLOBALS['BASE_PATH'] . '_config.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.users.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.catalogos.php');

checkSession();

require_once($GLOBALS['LIBS_PATH'] . 'code.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.crm.cliente.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.comm.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.direccion.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.nota.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.sys.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.folletos.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.javascript.php');

require_once($GLOBALS['LIBS_PATH'] . 'class.proyectos.php');

if (isset($boolReducido) && !$boolReducido) {
    require_once($GLOBALS['LIBS_PATH'] . 'class.crm.accion.php');
}

/*
require_once($GLOBALS['LIBS_PATH'] . 'class.proyectos.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.facturas.php');
*/

require_once($GLOBALS['MODULE_PATH'] . '_incl/lan.es.php');

define('LINEA', 1);
define('RECARGO', 2);

$numRecordID = isset($_GET['id']) ? intval($_GET['id']) : -1;
$operacion   = isset($_GET['op']) ? $_GET['op'] : ($numRecordID == -1 ? 'add' : '');

$strEstado    = $strValoracion = $strNombre = $strRazonSocial = $strNif = $strFuente = $strDivision = '';
$numSector    = $numValoracion = $numTarifa = 0;
$numEstado    = 2;
$isParticular = false;

$objDatos = new clienteClass($numRecordID);
switch ($operacion) {
    case "add":
        $strCancelar = 'cancelCliente()';
        break;
    case "edit":
    default:
        $strCancelar = 'cancelEdit()';
        if ($objDatos->isConnected()) {
            $arrCliente = $objDatos->get(true);
            if (is_array($arrCliente)) {
                $strNombre      = $arrCliente['NOMBRE'];
                $strRazonSocial = $arrCliente['RAZON'];
                $strDivision    = $arrCliente['DIVISION'];
                $strNif         = $arrCliente['NIF'];
                $numEstado      = $arrCliente['ESTADO_ID'];
                $isParticular   = $arrCliente['PARTICULAR'] == '1' ? true : false;
                $strEstado      = $objDatos->getLabelEstado($numEstado);
                $numValoracion  = $arrCliente['VALORACION_ID'];
                $numTarifa      = $arrCliente['TARIFA'];
                $strValoracion  = $objDatos->getLabelValoracion($numValoracion);
                $strFuente      = $arrCliente['FUENTE'];
            } else {
                header('Location:index.php');
                exit;
            }
        }
        break;
}

// Iván: 19/08/2012 - En el checkSession() no se está pasando el ID
//   $objOpciones = new sysClass($numRecordID);
$objOpciones = new folletosClass($numRecordID);

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<title>c l i e n t e s</title>
<link href="../_dom/layout.css" rel="stylesheet" type="text/css">
<link href="./_dom/layout.css" rel="stylesheet" type="text/css">

<?php
if (isset($boolReducido) && !$boolReducido) {
?>               
<link href="../_dom/valums/fileuploader.css" rel="stylesheet" type="text/css">
<?php
}
?>
<script type="text/javascript" src="../_dom/rsv.js"></script>
<link rel="stylesheet" type="text/css" media="screen" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/smoothness/jquery-ui.css">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>

<?php
if (isset($boolReducido) && !$boolReducido) {
?>
<script src="../_dom/valums/fileuploader.js" type="text/javascript"></script>
<?php
}
?>

<style>
#datosextranet .field, #datosextranet h3{padding-bottom:12px}
#datosextranet h3{font-weight:bold}
#datosextranet .field{padding-bottom:12px}
#datosextranet table{border:0;margin:12px}

#usuariosextranet{margin-top:20px}

#holdergalerias a {
  font-weight: normal;
  outline: medium none;
}
#holdergalerias thead, tbody {
  border-bottom: 1px solid #666666;
  font-size: 12px;
  padding-bottom: 4px;
}
#holdergalerias td { height: 2em; }

</style>
</head>
<body>
<?php
require($GLOBALS['LIBS_PATH'] . 'inc.header.php');
?>

  <div id="main">
      <div id="contenido">
      <div id="rsvErrors"></div>
      <div id="datos_edit" <?php
echo $operacion != '' ? '' : 'style="display:none"';
?>>
        <div>
        <h2><?php
echo $TEXTOS['cliente_titulo'];
?></h2>
        <form id="formulario" name="formulario" style="margin-top:12px">
          <input name="op" id="op" type="hidden" value="<?php
echo $operacion;
?>">
          <input name="id" id="id" type="hidden" value="<?php
echo $numRecordID;
?>">
          <fieldset id="clientes">
            <div class="field">
                <label for="nombre"><?php
echo $TEXTOS['cliente_nombre'];
?></label>
                <input name="nombre" id="nombre" size="70" maxlength="200" value="<?php
echo $strNombre;
?>" />
            </div>
            <div class="field">
              <label for="particular"><?php
echo $TEXTOS['cliente_particular'];
?></label>
              <input name="particular" id="particular" type="checkbox" <?php
echo $isParticular ? 'checked="checked"' : '';
?> onChange="doParticular();" />
            </div>
            <div id="isempresa">
              <div class="field">
                  <label for="razonsocial"><?php
echo $TEXTOS['cliente_razon'];
?></label>
                    <input name="razonsocial" id="razonsocial" size="70" maxlength="200" value="<?php
echo $strRazonSocial;
?>" />
              </div>
              <div class="field">
                <label for="division"><?php
echo $TEXTOS['cliente_dpto'];
?></label>
                <input name="division" id="division" size="70" maxlength="200" value="<?php
echo $strDivision;
?>" />
              </div>
            </div>
            <div class="field">
              <label for="nif"><?php
echo $TEXTOS['cliente_nif'];
?></label>
              <input name="nif" id="nif" size="12" maxlength="12" value="<?php
echo $strNif;
?>" />
            </div>
            <div class="field">
              <label for="estado"><?php
echo $TEXTOS['cliente_estado'];
?></label>
              <select name="estado" id="estado">
                  <?php
echo arrayAsoc2Select($gArrEstados, $numEstado);
?>
              </select>
            
<?php
if (isset($boolReducido) && !$boolReducido) {
?>            
              <label for="valoracion"><?php
    echo $TEXTOS['cliente_valoracion'];
?></label>
                <select name="valoracion" id="valoracion">
                  <?php
    echo arrayAsoc2Select($objDatos->getArrayValoraciones(), $numValoracion);
?>
          </select>
<?php
}
?>
              </div>
<?php
if (isset($boolReducido) && !$boolReducido) {
?>            
            <div class="field">
              <label for="tarifa"><?php
    echo $TEXTOS['cliente_tarifa'];
?></label>
              <select name="tarifa" id="tarifa">
                  <?php
    echo sql2Select($objDatos, QUERY_TARIFAS, $numTarifa);
?>
                 </select>
            </div>
            
            <div class="field">
              <label for="fuente"><?php
    echo $TEXTOS['cliente_fuente'];
?></label>
              <select name="fuente" id="fuente" onchange="doFuentes('<?php
    echo $OPTION['otro'];
?>');">
                <?php
    echo sql2Select($objDatos, QUERY_FUENTES, $strFuente);
?>
                    <option value="#otro#"><?php
    echo $OPTION['otro'];
?></option>
              </select>
            </div>
<?php
}
?>
      <div class="field" id="fuente_otros_field" style="display:none">
              <label>&nbsp;</label>
                <input name="fuente_otros" id="fuente_otros" size="70" maxlength="200" value="" />
            </div>          
            <div class="formControls">
              <input class="formButton" type="button" value="<?php
echo $BOTON['cancelar'];
?>" id="cancel" onClick="<?php
echo $strCancelar;
?>;return false;" />
                <input class="formButton" type="button" value="<?php
echo $BOTON['grabar'];
?>" id="grabar" onclick="saveCliente();" />
          <?php
if ($operacion != 'add') {
    if ($objDatos->isBorrable()) {
?>
                <a href="#" onclick="delCliente(); return false;" style="margin-left:100px">[ <?php
        echo $BOTON['borrar'];
?> ]</a>
          <?php
    }
}
?>
            </div>
          </fieldset>
        </form>
        </div>
      </div>

<?php
if ($operacion == '') {
?>
      <div id="datos_display">
        <div>
          <h2><a href="#" onclick="doEdit();"><?php
    echo $strNombre;
?></a></h2>
          <div class="bloque">
<?php
    if (1 == 0) {
?>
            <p><?php
        echo $strRazonSocial . ($strRazonSocial != '' ? ' &bull; ' : '') . $strNif;
?>
<?php
    }
?>
      <?php
    echo $strEstado != '' && $strEstado != 'Activo' ? '<p><b>' . $strEstado . '</b></p>' : '';
?>
            <?php
    echo $strValoracion != '' ? '<p><b>Valoración</b>: ' . $strValoracion . '</p>' : '';
?>
            <?php
    echo $strFuente != '' ? '<p><b>Fuente</b>: ' . $strFuente . '</p>' : '';
?>
            <ul class="grupos" style="padding-top:12px" id="holdergrupos"></ul>
          </div>
        </div>
      </div>

  <div id="tabs">
    <ul>
<?php
    if (isset($boolReducido) && $boolReducido) {
?>               
      <li id="tabdirecciones"><?php
        echo $TABS['direcciones'];
?></li>
           <li id="tabproyectos"><?php
        echo $TABS['proyectos'];
?></li>
        <li id="tabcolecciones"><?php
        echo $TABS['coleccion'];
?></li>
<?php
    } else {
?>
      <li id="tabdirecciones"><?php
        echo $TABS['direcciones'];
?></li>
           <li id="tabproyectos"><?php
        echo $TABS['proyectos'];
?></li>
      <li id="tabfacturas"><?php
        echo $TABS['facturas'];
?></li>
      <li id="tabnotas"><?php
        echo $TABS['notas'];
?></li>
            <li id="tabacciones"><?php
        echo $TABS['acciones'];
?></li>
      <li id="tabdocumentos"><?php
        echo $TABS['documentos'];
?></li>
<?php
    }
?>
     </ul>
  </div>
    
    <div id="paneles">    
    <div id="panelproyectos" style="display:none">
<?php
    echo $objOpciones->renderActions('proyectos');
?>
          <div id="mainproyectos" style="clear:both;">        
<?php
    $objProyectos = new proyectosClass();
    $numProyectos = $objProyectos->getByCliente($numRecordID);
    if ($numProyectos) {
?>
        <div id="resultados">
          <table border="0" cellspacing="2" cellpadding="4">
                        <thead>
                          <tr>
                            <td width="90"><?php
        echo ($TEXTOS['proyecto_estado']);
?></td>
                            <td width="400"><?php
        echo ($TEXTOS['proyecto_nombre']);
?></td>
                            <td width="80"><?php
        echo ($TEXTOS['proyecto_paginas']);
?></td>
                        </tr>
                        </thead>
                        <tbody class="rayas">
<?php
        while ($arrProyecto = $objProyectos->getNext()) {
            $pro_id = $arrProyecto['ID'];
?>
                            <tr>
                         <td valign="top"><?php
            echo $arrProyecto['ESTADO_TX'];
?></td>
<td valign="top" class="data"><a href="../proyectos/proyecto.php?id=<?php
            echo $pro_id;
?>" class="button"><?php
            echo $arrProyecto['NOMBRE'];
?></a></td>
<td valign="top" class="data"><a href="../proyectos/proyecto.php?id=<?php
            echo $pro_id;
?>" class="button"><?php
            echo $arrProyecto['PAGINAS'];
?></a></td>
                            </tr>
<?php
        } // while
?>
                    </tbody>
        </table>
                </div>
<?php
    } else {
        echo ('Este cliente no tiene ningún proyecto ');
        
    }
?> 
      </div>
        </div>

<?php
    if (isset($boolReducido) && !$boolReducido) {
?>                     
    <div id="panelfacturas" style="display:none">
    </div>
<?php
    }
?>

    <div id="paneldirecciones" style="display:none">
<?php
    echo $objOpciones->renderActions('direcciones');
?>
        <div id="maindirecciones" style="clear:both;">
          <div id="holderdirecciones" style="margin-bottom:8px"></div>
          <ul id="comms" class="listadoble">
<?php
    if (isset($arrCliente['COMMS']) && is_array($arrCliente['COMMS'])) {
        foreach ($arrCliente['COMMS'] as $arrRecord) {
?>
            <li id="commholder<?php
            echo $arrRecord['ID'];
?>">      
<?php
            echo commsClass::render($arrRecord);
?>
            </li>
<?php
        }
    }
?>
          </ul>
          <ul id="dirs" class="listadoble">
<?php
    if (isset($arrCliente['DIRS']) && is_array($arrCliente['DIRS'])) {
        foreach ($arrCliente['DIRS'] as $arrRecord) {
?>      
            <li id="dirholder<?php
            echo $arrRecord['ID'];
?>">
<?php
            echo direccionClass::render($arrRecord);
?>
            </li>
<?php
        }
    }
?>
          </ul>
        </div>
      </div>
        
        <div id="panelcolecciones" style="display:none">
<?php
    echo $objOpciones->renderActions('galerias');
    
    // Iván: 14/08/2012
    // Cargamos las colecciones del cliente
    $objCatalogo  = new catalogosClass();
    $numCatalogos = $objCatalogo->getCatalogos($numTotal, array(
        'search' => $numRecordID
    )); // Buscamos los catálogos del cliente.
    
?>
      <div id="maingalerias" style="clear:both;">
        <div id="holdergalerias" style="margin-bottom:8px">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th width="60%">Colecci&oacute;n</th>
                <th width="40%">Productos</th>
              </tr>
            </thead>
            <tbody class="rayas">
<?php
    while ($arrRecord = $objCatalogo->getNext()) {
        $col_id = $arrRecord['ID'];
?>
              <tr>     
                <td width="60%" valign="top" class="data"><a href="../productos/coleccion.php?id=<?php
        echo $col_id;
?>" class="button"><?php
        echo $arrRecord['NOMBRE'];
?></a></td>
                <td width="40%" valign="top" class="data"><a href="../productos/coleccion.php?id=<?php
        echo $col_id;
?>" class="button"><?php
        echo $arrRecord['PRODUCTOS'];
?></a></td>
              </tr>
<?php
    }
?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
   
  <?php
    if (isset($boolReducido) && $boolReducido) {
?>               
     
    <div id="panelnotas" style="display:none">
<?php
        echo $objOpciones->renderActions('notas');
?>
        <div id="mainnotas" style="clear:both;">
          <div id="holdernotas" style="margin-bottom:8px"></div> 
      <ul id="notas">
<?php
        if (isset($arrCliente['NOTAS']) && is_array($arrCliente['NOTAS'])) {
            foreach ($arrCliente['NOTAS'] as $arrRecord) {
?>
        <li id="notaholder<?php
                echo $arrRecord['ID'];
?>">
<?php
                echo notaClass::render($arrRecord);
?>  
            </li>
<?php
            }
        }
?>
      </ul>
      </div>
      </div>
<?php
    }
    
    if (isset($boolReducido) && !$boolReducido) {
?>
    <div id="panelacciones" style="display:none">
<?php
        echo $objOpciones->renderActions('acciones');
?>
        <div id="mainacciones" style="clear:both;">
        <div id="holderacciones" style="margin-bottom:8px;"></div> 
      
<?php
        $objAccion     = new accionClass();
        $arrAcciones   = $objAccion->getAccionesCliente($numRecordID);
        $arrAccionTipo = $objAccion->getArrayTipos();
        $arrAccion     = $objAccion->getArrayAcciones();
        
        if ($arrAcciones == 0) {
            echo ('<br/>&nbsp;&nbsp;No se han realizado acciones comerciales');
        } else {
?>   
    <div id="tablaAcciones" style="height:720px; overflow:scroll;">
          <table border="0" cellspacing="2" cellpadding="4" id="resultados">
              <thead>
                  <tr>
                      <td style="width:140px">Contacto</td>
                        <td style="width:35px">Proyecto</td>
                      <td style="width:35px">Como</td>
                        <td style="width:100px">Que</td>
                        <td style="width:40px">Para</td>
                        <td style="width:40px">Creado</td>
                        <td style="width:25px; text-align:center"></td>
                   </tr>
                 </thead>
                 <tbody class="rayas">
<?php
            while ($arrAcciones = $objAccion->getNext()) {
?>
                   <tr>
                       <td valign="top" class="data"><a href="contacto.php?id=<?php
                echo $arrAcciones['CONTACTO_ID'];
?>" class="button"><?php
                echo $arrAcciones['CONTACTO'];
?></a></td>
                        <td valign="top" class="data" style="text-align:center"><a href="contacto.php?id=<?php
                echo $arrAcciones['CONTACTO_ID'];
?>" class="button"><?php
                echo $arrAcciones['PROYECTO'] == 0 ? 'NO' : $arrAcciones['REF_INTERNA'];
?></a></td>
                        <td valign="top" class="data" style="text-align:center"><a href="contacto.php?id=<?php
                echo $arrAcciones['CONTACTO_ID'];
?>" class="button"><?php
                echo $arrAccionTipo[$arrAcciones['TIPO']];
?></a></td>
                        <td valign="top" class="data"><a href="contacto.php?id=<?php
                echo $arrAcciones['CONTACTO_ID'];
?>" class="button"><?php
                echo $arrAccion[$arrAcciones['MOTIVO']];
?></a></td>  
                        <td valign="top" class="data"><a href="contacto.php?id=<?php
                echo $arrAcciones['CONTACTO_ID'];
?>" class="button"><?php
                echo $arrAcciones['CUANDO'];
?></a></td>
                        <td valign="top" class="data"><a href="contacto.php?id=<?php
                echo $arrAcciones['CONTACTO_ID'];
?>" class="button"><?php
                echo $arrAcciones['FECHA_CREACION'];
?></a></td>
                        <td valign="top" class="data" style="text-align:center"><?php
                if ($arrAcciones['DONE'] == 1)
                    echo '<img src="../_imgs/available.png" width="25" height="25">';
                else
                    echo '<img src="../_imgs/attention.png" width="25" height="25">';
?></td>
                   </tr>
<?php
            } // while
?>
                    </tbody>
        </table> 
                </div>       
<?php
        }
?>   
    
      </div>
      </div>
      
  <div id="paneldocumentos" style="display:none">
<?php
        echo $objOpciones->renderActions('documentos');
        $strTabla         = 'crm_documentos';
        $objUsers         = new usersClass();
        $arrUsers         = $objUsers->getUsers();
        $objDocus         = new documentoClass($strTabla);
        $arrTiposArchivos = $objDocus->getTiposArchivosClientes();
        $arrFormatos      = $objDocus->getFormatos();
?>
        <div id="maindocumentos" style="clear:both;">
                 <div id="file-uploader" style="display:none"></div>       
          
                </div>
      
<?php
        if (isset($arrCliente['DOCUMENTOS']) && is_array($arrCliente['DOCUMENTOS'])) {
?>
     <table border="0" cellspacing="2" cellpadding="4" id="documentos">
                        <thead>
                          <tr>
                              <td>Archivo</td>
                                <td>Tipo</td>
                              <td align="center">Formato</td>
                                <td align="center">Subido</td>
                                <td align="center">Por Usuario</td>
                                <td>Por Usuario</td>
                          </tr>
                        </thead>
                        <tbody class="rayas">
<?php
            foreach ($arrCliente['DOCUMENTOS'] as $arrRecord) {
?>
        <tr>
          <td style width="350">
<?php
                echo '<a href="download.php?id=' . $arrRecord['ID'] . '">' . $arrRecord['DOCNAME'] . '</a> ';
?>  
             </td>
                    <td>
                      <select name="lista_tipos" id="lista_tipos<?php
                echo $arrRecord['ID'];
?>" onChange="editTipoArchivo(<?php
                echo $arrRecord['ID'];
?>);" style="border:2px groove #006;">
                <?php
                echo arrayAsoc2Select($arrTiposArchivos, $arrRecord['TIPO'], true);
?>       
                        </select>
                    </td>
                    <td style width="100" align="center">
<?php
                echo strtoupper($arrRecord['FORMATO']);
?>
                    </td>                    
                    <td style width="100" align="center">
<?php
                echo $arrRecord['CREADO'];
?>
                    </td>                    
                   <td valign="top" style width="100" align="center">
              <?php
                foreach ($arrUsers as $arrSubUsers) {
                    if ($arrSubUsers['ID'] == $arrRecord['CREADOR']) {
                        echo $arrSubUsers['NOMBRE'];
                    }
                }
                ;
?>
                    </td>
                    <td width="200">
<?php
                //Find the source path of the file to open with google:
                if ($objDocus->isConnected()) {
                    $arrDocu = $objDocus->get($arrRecord['ID']);
                    if (is_array($arrDocu)) {
                        $strSrcFile  = $arrDocu['PATH'] . '/' . $arrDocu['FILENAME'];
                        $strFileName = $arrDocu['DOCNAME'] . '.' . $arrDocu['FORMATO'];
                    }
                }
                if (in_array($arrRecord['FORMATO'], $arrFormatos) && filesize($strSrcFile) < 2000000) {
                    echo '<a href="http://docs.google.com/viewer?url=https://alger.deltatext.com/clientes/download.php?id=' . $arrRecord['ID'] . '" target="_blank" >Ver online</a>';
                }
?>  
                   </td>
                 </tr>
<?php
                $arrIdDocus[] = $arrRecord['ID'];
            }
        }
?>
      </tbody>
            </table> 
      
    </div>
<?php
    }
?>
  
    </div>
<?php
}
?>
  
  </div>
  <div id="columna">
<?php
require_once($GLOBALS['LIBS_PATH'] . 'inc.acciones.php');
?>
	<ul>
    <li><a href='#' onclick="doImportFicheroCRE();"><?php
echo ('Importar CRE');
?></a></li>
	</ul>
  <div id="contactos">
    <h3>Contactos</h3>
<?php
if ($objDatos->getContactos()) {
?>
          <ul>
<?php
    while ($arrRecord = $objDatos->getNext()) {
        $strTelefono = $arrRecord['TELEFONO'] == '' ? $arrRecord['MOVIL'] : $arrRecord['TELEFONO'];
?>
            <li>
                  <a href="contacto.php?id=<?php
        echo $arrRecord['ID'];
?>"><b><?php
        echo $arrRecord['NOMBRE'];
?></b></a><br/>
<?php
        echo ($arrRecord['CARGO'] != '' ? $arrRecord['CARGO'] . '<br/>' : '');
        echo ($strTelefono != '' ? '<a href="#" onclick="doTelefono2(\'' . $strTelefono . '\', \'' . $arrRecord['NOMBRE'] . '\');return false;" class="plain">' . $strTelefono . '</a><br/>' : '');
        echo ($arrRecord['EMAIL'] != '' ? '<a href="mailto:' . $arrRecord['EMAIL'] . '" class="plain">' . $arrRecord['EMAIL'] . '</a>' : '');
?>
                </li>
<?php
    }
?>
          </ul>
<?php
}
?>
  </div>
  </div>
</div>
<?php
require($GLOBALS['LIBS_PATH'] . 'inc.footer.php');
?>
<div id="dlog_carga_ficheroCRE" class="dlog"> 
	<form id="frm_importarCRE" name="frm_importarCRE" action="./subirCRE.php" method="post" enctype="multipart/form-data">

		<input id="id_cliente" name ="id_cliente" type="hidden" value="<?php
echo $numRecordID;
?>">
 		<div class='field'>
	     <label for="import_ficheroCRE" class="etq_input"><?php
echo ('CRE a importar');
?></label>
	     <input name="import_ficheroCRE" id="import_ficheroCRE" type="file" />
	    </div>		
	</form>
</div>
</body>
<?php
$objJS = new jsLoaderClass();

$objJS->order();

$objJS->numNotaOwner  = $objJS->numClienteID = $numRecordID;
$objJS->numContactoID = 0;
$objJS->arrComms      = getListaJavaScript(LISTA_COMMS);
$objJS->arrDirs       = getListaJavaScript(LISTA_DIRECCIONES);

$objJS->textoAyuda         = $objJS->text($TEXTOS['ayuda']);
$objJS->textoConfirmEdit   = $objJS->text($TEXTOS['confirmar_edicion']);
$objJS->textoConfirmDelete = $objJS->text($TEXTOS['confirmar_borrado']);

$objJS->reglaNombre = '"required,nombre,'.$ERROR['rsv_nombre'].'"';

$objJS->addFile($GLOBALS['BASE_PATH'] . '_dom/code.js');
$objJS->addFile($GLOBALS['BASE_PATH'] . '_dom/box.js');
$objJS->addFile($GLOBALS['BASE_PATH'] . '_dom/jqTabs.js');
$objJS->addFile($GLOBALS['BASE_PATH'] . '_dom/code.comms.js');
$objJS->addFile($GLOBALS['MODULE_PATH'] . '_dom/code.js');

$objJS->save($GLOBALS['MODULE_PATH'] . '_dom/_cliente.js');
?>
<script type="text/javascript" src="./_dom/_cliente.js"></script>
<script>
  rsv.errorTextIntro = "<?php
echo $ERROR['rsv_error'];
?>";
  
<?php
if ($operacion == '') {
    if (isset($boolReducido) && !$boolReducido) {
?>
  loadGrupos();
  Tabs.init(['direcciones', 'proyectos', 'facturas', 'documentos', 'notas', 'acciones']);
<?php
    } else {
?>
  Tabs.init(['direcciones', 'proyectos', 'colecciones']);
<?php
    }
}
?>
$(document).ready(function(){
prepararDialogoImportarCRE();
});

</script>

</html>
