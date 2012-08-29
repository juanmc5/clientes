<?php
session_start();

require_once('../../_config.php');
require_once('../../_incl/class.documentos.php');

	$input = fopen("php://input", "r");
	$strFiles = stream_get_contents($input);
	fclose($input);
			
	$arrFiles = json_decode($strFiles, true);

//print_r($arrFiles);

	// espero dos arrays: data y files.
	$numOwnerID = $arrFiles['data']['numOwnerID'];
	
	$strSrcDir = $GLOBALS['VAULT_PATH'] . 'upload/' . session_id() . '/';
	$strFolderName = str_pad($numOwnerID, 6, '0', STR_PAD_LEFT);
	$strDstDir = $GLOBALS['VAULT_PATH'] . 'contactos/' . $strFolderName . '/';

	if(!is_dir($strDstDir)) {
		mkdir($strDstDir);
	}

	$objDatos = new documentoClass('crm_documentos');
	
	foreach((array)$arrFiles['files'] as $strFilename) {
		if(!empty($strFilename)) {
			
			$arrFileInfo = pathinfo($strSrcDir . $strFilename);
			$numContador = 1;
			$strDstFilename = $strFilename;
			while(file_exists($strDstDir . $strDstFilename)) {
				// renombro el nuevo	
				$strDstFilename = $arrFileInfo['filename'] . '[' . $numContador . '].' . $arrFileInfo['extension']; 
				$numContador++;
			}
			// muevo el archivo
			if(rename($strSrcDir . $strFilename, $strDstDir . $strDstFilename)) {	
			// y lo inserto en la base de datos
				$arrDatos = array('tipo_owner'	=> 1, 	// contacto, 2 = cliente
								  'owner'		=> $numOwnerID,
								  'nombre'		=> $arrFileInfo['filename'],
								  'formato'		=> $arrFileInfo['extension'],
								  'path'		=> $GLOBALS['VAULT_PATH'] . 'contactos/' . $strFolderName,
								  'filename'	=> $strDstFilename);
				if(!$objDatos->insert($arrDatos)) {
					echo 'error al grabar el archivo ' . $strFilename;
				}
			} else {
				
				
			}
		}
	}
	