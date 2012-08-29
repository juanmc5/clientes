<?php
/**

	class.importaCRE.php

*/
require_once('../_config.php');
require_once($GLOBALS['BASE_PATH'] . '_config.php');
require_once($GLOBALS['LIBS_PATH'] . 'class.users.php');

require_once($GLOBALS['BASE_PATH'] . '_incl/class.crm.php');
require_once($GLOBALS['BASE_PATH'] . '_incl/class.documentos.php');

if(isset($boolReducido) && !$boolReducido) {
require_once($GLOBALS['BASE_PATH'] . '_incl/class.proyectos.php');
require_once($GLOBALS['BASE_PATH'] . '_incl/class.correos.php');
require_once($GLOBALS['BASE_PATH'] . '_incl/class.smssend.php');
}

/**
	TODO
	sacar este define de esta clase

	define('QUERY_TARIFAS', 'SELECT tarifa_id AS ID, tarifa_nombre AS LABEL FROM pricelist_tarifas WHERE tarifa_portal = ' . $GLOBALS['PORTAL_ID']);
*/

//define('ENVIAR_MAIL_CLINUEVO', 2);
/*clienteClass: importaCRE
method __construct∫ 
method get
method getContactos
method getContactosLista
method getDirecciones
method getComms
method getGrupos
method getNotas
method getDocumentos
method getColecciones
method getProyectos
method getAccesoExtranet
method setExtranet
method doMail
method getPresupuestos
method insert
method update
method delete
method isBorrable
method auditConfig

HEREDADOS DE crmclass

method searchClientes
method getClientesByGrupo
method getClientesBySector
method searchContactos
method getAutocomplete
method searchGrupos
method getSectores
method getLabelEstado
method getLabelGrupo
method getLabelValoracion
method getArrayValoraciones
method getValoresOrdenacionCli
method setLocale
method getConexion
method setConexion
method query
method getNumOfRows
method getLastID
method getNext
method getFirst
method getPrev
method goFirst
method getLast
method isConnected
method hasError
method getError
method limpiaValor
method getRecordSet
method getRecord
method getCell
method getCurrentQueryIndex
method setCurrentQueryIndex
method trashTempQuery
method render
method debug
method suckResultado
method getCurResultado
method conexion
*/




class classImportaCRE extends datosClass {
private $numID;
	
	function __construct($numID = 0) {
		parent::__construct();
		$this->numID = intval($numID);
	}
	
	function get($boolFull = false) {	
		if($this->numID) {
			$arrRecord = $this->getRecord('SELECT 	ID_CRE,
													CatalogName,
													Notes,
													AssetCreationDate,
													FolderName,
													RecordModificationDate,
													VolumeName,
													ServerName,
													AssetModificationDate,
													RecordCreationDate,
													RecordName,
													AssetName,
													ImageWidth,
													HorizontalResolution,
													VerticalPixels,
													ColorMode,
													VerticalResolution,
													HorizontalPixels,
													FileDataSize,
													FileFormat,
													ImageHeight,
													ID_Catalog,
													FechaProceso,
													ID_user,
													Time_importacion
													 
											 FROM importaCRE
											 
											 WHERE ID_CRE = ' . $this->numID);
			/*	ejemplo de relleno de un campo con valores de otra tabla
				if($this->getComms()) {
					$arrRecord['COMMS'] = array();
					while($arrSecond = $this->getNext()) {
						$arrRecord['COMMS'][] = $arrSecond;	
					}
				}
			*/	
			//}
			return $arrRecord;
		} else {
			return null;	
		}
	}
	
		function get_by_Time_importacion($fechaHoraID) {	
			$arrRecord = $this->getRecordSet('SELECT 	ID_CRE,
													Thumbnail,
													CatalogName,
													Notes,
													AssetCreationDate,
													FolderName,
													RecordModificationDate,
													VolumeName,
													ServerName,
													AssetModificationDate,
													RecordCreationDate,
													RecordName,
													AssetName,
													ImageWidth,
													HorizontalResolution,
													VerticalPixels,
													ColorMode,
													VerticalResolution,
													HorizontalPixels,
													FileDataSize,
													FileFormat,
													ImageHeight,
													ID_Catalog,
													FechaProceso,
													ID_user,
													Time_importacion
													 
											 FROM importaCRE
											 
											 WHERE Time_importacion = ' . $fechaHoraID.
											 ' ORDER BY ServerName, VolumeName, FolderName'
											 );

			return $arrRecord;
		}

	function insert($arrDatos, $boolLog = false) {
//										Thumbnail = '.$this->limpiaValor(trim($arrDatos['Thumbnail'])).',
		if($this->query('INSERT INTO importaCRE
									SET 
										CatalogName =  ' . $this->limpiaValor(trim($arrDatos['CatalogName'])) . ', 
										Notes =  ' . $this->limpiaValor(trim($arrDatos['Notes'])) . ', 
										AssetCreationDate =' . $this->limpiaValor(trim($arrDatos['AssetCreationDate'])) . ',
										FolderName =  ' . $this->limpiaValor(trim($arrDatos['FolderName'])) . ', 
										RecordModificationDate =  ' . $this->limpiaValor(trim($arrDatos['RecordModificationDate'])) . ',
										VolumeName =  ' . $this->limpiaValor(trim($arrDatos['VolumeName'])) . ', 
										ServerName =  ' . $this->limpiaValor(trim($arrDatos['ServerName'])) . ', 
										AssetModificationDate = ' . $this->limpiaValor(trim($arrDatos['AssetModificationDate'])) . ',
										RecordCreationDate =  ' . $this->limpiaValor(trim($arrDatos['RecordCreationDate'])) . ',
										RecordName =  ' . $this->limpiaValor(trim($arrDatos['RecordName'])) . ', 
										AssetName =  ' . $this->limpiaValor(trim($arrDatos['AssetName'])) . ', 
										ImageWidth =  ' . intval($arrDatos['ImageWidth']) . ', 
										HorizontalResolution =  ' . intval($arrDatos['HorizontalResolution']) . ', 
										VerticalPixels =  ' . intval($arrDatos['VerticalPixels']) . ', 
										ColorMode =  ' . $this->limpiaValor(trim($arrDatos['ColorMode'])) . ', 
										VerticalResolution =  ' . intval($arrDatos['VerticalResolution']) . ', 
										HorizontalPixels =  ' . intval($arrDatos['HorizontalPixels']) . ', 
										FileDataSize =  ' . intval($arrDatos['FileDataSize']) . ', 
										FileFormat =  ' . $this->limpiaValor(trim($arrDatos['FileFormat'])) . ',
										ImageHeight =  ' . intval($arrDatos['ImageHeight']) . ', 
										Time_importacion = '.intval($arrDatos['Time_importacion'])
										//.', ID_CRE = '.intval($arrDatos['ID_CRE'])
										)) {
			
			return $this->getLastID();	
			/**
	@returns el id del ˙ltimo registro creado usando este objeto. Heredada de datosClass
	public function getLastID() {
		return mysql_insert_id($this->rsrcConexion);
	}

*/	
			
		} else {
			return 0;	
		}
	}
	
	function update($arrDatos, $boolAudit = true) {
		if($this->numID) {			
			return $this->query('UPDATE importaCRE
									SET 
										CatalogName =  ' . $this->limpiaValor(trim($arrDatos['CatalogName'])) . ', 
										Notes =  ' . $this->limpiaValor(trim($arrDatos['Notes'])) . ', 
										AssetCreationDate =' . $this->limpiaValor(trim($arrDatos['AssetCreationDate'])) . ',
										FolderName =  ' . $this->limpiaValor(trim($arrDatos['FolderName'])) . ', 
										RecordModificationDate =  ' . $this->limpiaValor(trim($arrDatos['RecordModificationDate'])) . ',
										VolumeName =  ' . $this->limpiaValor(trim($arrDatos['VolumeName'])) . ', 
										ServerName =  ' . $this->limpiaValor(trim($arrDatos['ServerName'])) . ', 
										AssetModificationDate = ' . $this->limpiaValor(trim($arrDatos['AssetModificationDate'])) . ',
										RecordCreationDate =  ' . $this->limpiaValor(trim($arrDatos['RecordCreationDate'])) . ',
										RecordName =  ' . $this->limpiaValor(trim($arrDatos['RecordName'])) . ', 
										AssetName =  ' . $this->limpiaValor(trim($arrDatos['AssetName'])) . ', 
										ImageWidth =  ' . intval($arrDatos['ImageHeight']) . ', 
										HorizontalResolution =  ' . intval($arrDatos['ImageHeight']) . ', 
										VerticalPixels =  ' . intval($arrDatos['ImageHeight']) . ',
										ColorMode =  ' . $this->limpiaValor(trim($arrDatos['ColorMode'])) . ', 
										VerticalResolution =  ' . intval($arrDatos['ImageHeight']) . ', 
										HorizontalPixels =  ' . intval($arrDatos['ImageHeight']) . ', 
										FileDataSize =  ' . intval($arrDatos['ImageHeight']) . ', 
										FileFormat =  ' . $this->limpiaValor(trim($arrDatos['FileFormat'])) . ',
										ImageHeight =  ' . intval($arrDatos['ImageHeight']) . ', 
										ID_Catalog =  ' . intval($arrDatos['ID_Catalog']) . ', 
										ID_user =  ' . $this->numUserID . ', 
										Time_importacion = '.intval($arrDatos['Time_importacion']).'
										WHERE ID_CRE = '. $this->numID);
		} else {
			return false;	
		}
	}	
	
	//--------------------------------------------------------------------------
	function delete($boolAudit = true) {
		if($this->numID) {
			if($boolAudit) {
				$this->doAudit(AUDIT_DELETE, $this->numID, $this->numUserID);
			}
			
			// Ivan: 04/07/1971 - Meto el borrado de las tablas hijas.
			
			// Cuando sepamos como hacerlo se tendrán que borrar las siguientes tablas
			// CRM_DOCUMENTOS
		
		//No eliminamos las colecciones, que si se quiere se eliminan a mano.
		//eliminamos primero los productos asociados, y al eliminarlos eliminamos también las imágnenes asociadas.
		
/*		
      if(!$this->query('DELETE from crm_cliente_notas WHERE nota_owner = ' . $this->numID))
			  return false;

      if(!$this->query('DELETE from crm_contacto_notas WHERE nota_owner = ' . $this->numID))
			  return false;

      if(!$this->query('DELETE from crm_grupo_clientes WHERE clgrp_cliente_id = ' . $this->numID))
			  return false;

      if(!$this->query('DELETE from crm_comunicaciones WHERE com_owner = ' . $this->numID))
			  return false;

      if(!$this->query('DELETE from crm_direcciones WHERE dir_owner = ' . $this->numID))
			  return false;

      if(!$this->query('DELETE from crm_cliente_contactos WHERE cont_cliente = ' . $this->numID))
			  return false;

			return $this->query('DELETE FROM crm_clientes WHERE cli_id = ' . $this->numID);
			
			
		} else {
			return null;	
*/
		}		
	}
	
	//--------------------------------------------------------------------------
	/**
	 * Devuelve true si el cliente puede borrarse. En el momento que tenga proyectos
	 * el cliente ya no se podrá borrar.
	 * Iván: 04/07/2012
	 */
	function isBorrable()
	{
		
		if($this->numID == 0)
		  return true;
		
		$numTotal = $this->getCell('SELECT COUNT(*) 
											 
										FROM bro_proyectos ' . 
									
										' WHERE pro_cliente = ' . $this->numID);
		
		return ($numTotal == 0);
		
	}
	

	//--------------------------------------------------------------------------
	function auditConfig() {
		return array('numTabla' => CLIENTE,
					 'tabla' => 'crm_clientes', 
					 'key' => 'cli_id', 
					 'padre' => '');
	}
}





