<?php
ini_set ('error_reporting', E_ALL);
ini_set ('display_errors', '1');

session_start();

require_once('../_config.php');
require_once($GLOBALS['BASE_PATH'] . '_config.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.crm.cliente.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.crm.contacto.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.crm.grupo.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.comm.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.direccion.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.nota.php');
//require_once('class.crm.accion.php');


	$strResultado = "-69";
	$numUsuario = isset($_SESSION[$GLOBALS['SESSION_NAME']]) && isset($_SESSION[$GLOBALS['SESSION_NAME'] . '.u_id']) ? $_SESSION[$GLOBALS['SESSION_NAME'] . '.u_id'] : '-1';
	$numObjeto = isset($_POST['objeto']) ? intval($_POST['objeto']) : -1;
	$numAccion = isset($_POST['accion']) ? intval($_POST['accion']) : -1;
	$numID = isset($_POST['id']) ? intval($_POST['id']) : -1;
	
	if($numObjeto > 0) {
		/*
		$strModulo = 'clientes|cliente';
		$objSec = new secClass($numUsuario);
		if(!$objSec->isAllowed($numModulo, $numAccion)) {
			return $strResultado;
			exit;
		}
		*/
		
		switch($numObjeto) {
			case COMMS:
				$objDatos = new commsClass($numID);
				break;
			case DIRECCION:
				$objDatos = new direccionClass($numID);			
				break;
			case NOTA:
				$objDatos = new notaClass($numID);			
				break;
			case CONTACTO_NOTA:
				$objDatos = new contactoNotaClass($numID);			
				break;	
			case CLIENTE:
				$objDatos = new clienteClass($numID);
				break;
			case CONTACTO:
				$objDatos = new contactoClass($numID);
				break;
			case GRUPO:
				$objDatos = new grupoClass($numID);
				break;
			case ACCION:
				$objDatos = new accionClass($numID);			
				break;
			case DOCUMENTOS:
				$objDatos = new documentoClass($numID);			
				break;
				
			default:
				$objDatos = NULL;
		}
		if($objDatos && $objDatos->isConnected()) {
			switch($numAccion) {
				case SELECT:
					$arrRecord = $objDatos->get();
					if(is_array($arrRecord)) {
						$strResultado = json_encode($arrRecord);
					}
					break;

				case INSERT:
					$arrRecord = $objDatos->insert($_POST);
					if(is_array($arrRecord)) {
						$strResultado = $arrRecord['ID'] . '##' . $objDatos->render($arrRecord);
					} else {
						$strResultado = $arrRecord;	
					}
					
					break;

				case UPDATE:
					$arrRecord = $objDatos->update($_POST);
					if(is_array($arrRecord)) {
						$strResultado = $objDatos->render($arrRecord);
					} else {
						if($arrRecord === true) {
							$strResultado = 1;	
						}
					}
					break;
				
				case DELETE:
					if($objDatos->delete()) {
						$strResultado = 1;
					}
					break;
					
				/*
					aquí empiezan los típicos casos especiales
					es donde la arquitectura empieza a verse oscurecida por el código...
				*/
				
				
				case 6:
					if($numObjeto == COMMS) {
						$arrRecord = $objDatos->get2magnify();
						if(is_array($arrRecord)) {
							$strResultado = json_encode($arrRecord);
						}
					}
					break;
					
				case 7:
					if($numObjeto == GRUPO) {
						if($objDatos->get2Add($numID) > 0) {
							$arrResultado = array();
							while($arrRecord = $objDatos->getNext()) {
				      			$arrResultado[] = $arrRecord;
      						}
							$strResultado = json_encode($arrResultado);
						} else {
							$strResultado = 0;
						}
					}
					break;
					
				case 8:
					if($numObjeto == CLIENTE) {
						if($objDatos->getGrupos() > 0) {
							$arrResultado = array();
							while($arrRecord = $objDatos->getNext()) {
			      			$arrResultado[] = $arrRecord;
      					}
							$strResultado = json_encode($arrResultado);
						} else {
							$strResultado = 0;
						}
					}
					break;
				
				case 9:
					$numMiembro = isset($_POST['miembro']) ? intval($_POST['miembro']) : 0;
					if($numObjeto == GRUPO && $numMiembro) {
						if($objDatos->addMiembro($numMiembro) > 0) {
							$strResultado = 0;
						}
					}
					break;
					
				case 10:
					$numMiembro = isset($_POST['miembro']) ? intval($_POST['miembro']) : 0;
					if($numObjeto == GRUPO && $numMiembro) {
						if($objDatos->delMiembro($numMiembro)) {
							$strResultado = 0;
						}
					}
					break;
					
				case 11:
					if($numObjeto == CONTACTO) {
						if($objDatos->getGrupos() > 0) {
							$arrResultado = array();
							while($arrRecord = $objDatos->getNext()) {
				      			$arrResultado[] = $arrRecord;
      						}
							$strResultado = json_encode($arrResultado);
						} else {
							$strResultado = 0;
						}
					}
					break;
					
				case 12: 
					if($numObjeto == ACCION) {
						if($objDatos->setDone()) {
							$strResultado = 0;
						}
					}					
					break;
					
				case 13:
					$numJefe = isset($_POST['jefe']) ? intval($_POST['jefe']) : 0;
					if($objDatos->setJefe($numJefe)) {
						$strResultado = 0;
					}
					break;
					
				case 14:
					if($objDatos->deleteMinion($numID)) {
						$strResultado = 0;
					}
					break;
					
				case 15:
					if($objDatos->insertCliente($_POST) == 0) {
						$strResultado = 0;
					}
					break;
					
				case 16:
					$direccionID = isset($_POST['direccionID']) ? intval($_POST['direccionID']) : 0;
					$contactoID = isset($_POST['contactoID']) ? intval($_POST['contactoID']) : 0;
					if($objDatos->applyDireccion($direccionID, $contactoID)) {
						$strResultado = 0;
					}
					break;
					
				case 17:
					if($numObjeto == 200) {
						$tipo = isset($_POST['tipo']) ? $_POST['tipo'] : 0;
						if($objDatos->editTipoArchivo($numID, $tipo, 'crm_documentos')) {
							$strResultado = 0;
						}
					}			
					break;	

				case 18: 
					if($numObjeto == CLIENTE) {
						if($objDatos->getColecciones() > 0) {
							$arrResultado = array();
							while($arrRecord = $objDatos->getNext()) {
			      			$arrResultado[] = $arrRecord;
      					}
							$strResultado = json_encode($arrResultado);
						} else {
							$strResultado = 0;
						}
					}					
					break;
			}
		}
	}
	
	echo $strResultado;
?>