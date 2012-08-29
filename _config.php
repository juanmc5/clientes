<?php
	if(file_exists($_SERVER['DOCUMENT_ROOT'] . '/desarrollo')) {	
		$GLOBALS['BASE_PATH']		= $_SERVER['DOCUMENT_ROOT'] . '/folletos/';	// asemat
	} else {
		$GLOBALS['BASE_PATH']		= $_SERVER['DOCUMENT_ROOT'] . '/';			// mimaquina
	}
	
	$GLOBALS['MODULE_PATH']			= $GLOBALS['BASE_PATH'] . 'clientes/';

	$_SESSION['LAST_MODULE'] 		= 'clientes';
	
	
/**
	IMPORTANTE
	este bool determina el nivel de funcionalidd.

	en modo reducido no hay buscador por tipos, ni listado de contactos, ni grupos de empresas.
*/
	$boolReducido = true;

define('LISTA_COMMS', 10);
define('LISTA_DIRECCIONES', 11);