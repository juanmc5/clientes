<?php
require_once( './_config.php' );
require_once( $GLOBALS[ 'BASE_PATH' ] . '_config.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.users.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'code.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.crm.cliente.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.comm.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.direccion.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.nota.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.sys.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.javascript.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.proyectos.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.catalogo.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.producto.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.imagen.php' );
require_once( $GLOBALS[ 'LIBS_PATH' ] . 'class.documentos.php' );
require_once( './_incl/class.importaCRE.php' );
					define( 'EXEC_IDENTIFY', '/usr/bin/identify' );
					define( 'EXEC_CONVERT', '/usr/bin/convert' );
					define( 'EXEC_COMA', "'" );
checkSession();
$objImportaCRE = new classImportaCRE();
$arrDatos = $_POST;
if ( is_array( $_FILES ) && isset( $_FILES[ 'import_ficheroCRE' ] ) ) {
	if ( !$_FILES[ 'import_ficheroCRE' ][ 'error' ] ) {
		$arrDatos[ 'import_ficheroCRE' ] = $_FILES[ 'import_ficheroCRE' ][ 'name' ];
//		echo ( 'archivo encontrado  ' . $arrDatos[ 'import_ficheroCRE' ] . '</BR></BR></BR>' );
		descomponerPath( $_FILES[ 'import_ficheroCRE' ][ 'name' ], $szCarpeta, $strNombreTab, $szExtension );
		$strFilename = $_FILES[ 'import_ficheroCRE' ][ 'tmp_name' ];
		if ( !empty( $strFilename ) ) {
		echo ('<br><br><br>COMIENZA A LEER DATOS A LAS '. date("H:i:s").'<br><br><br>');

		echo ("Procesando archivo ". $_FILES[ 'import_ficheroCRE' ][ 'name' ]."</br></br>");
			ini_set( "memory_limit", "1000M" );
			ini_set( "auto_detect_line_endings", true );
			$fp            = fopen( $strFilename, 'rb' );
			$fila          = fgets( $fp );
			$fila          = fgets( $fp );
			$fila          = fgets( $fp );
			$titulosC      = preg_split( "/[\t\r\n]+/", $fila );
			$totalTitulosC = count( $titulosC );
			$campoValido   = array( );
			for ( $numCampo = 0; $numCampo < $totalTitulosC; $numCampo++ ) {
				switch ( $titulosC[ $numCampo ] ) {
//                         case 'Thumbnail':
//                             $campoValido['Thumbnail'] = $numCampo;
//                             break;
					case 'Catalog Name':
						$campoValido[ 'Catalog Name' ] = $numCampo;
						break;
					case 'Notes':
						$campoValido[ 'Notes' ] = $numCampo;
						break;
					case 'Asset Creation Date':
						$campoValido[ 'Asset Creation Date' ] = $numCampo;
						break;
					case 'Folder Name':
						$campoValido[ 'Folder Name' ] = $numCampo;
						break;
					case 'Record Modification Date':
						$campoValido[ 'Record Modification Date' ] = $numCampo;
						break;
					case 'Volume Name':
						$campoValido[ 'Volume Name' ] = $numCampo;
						break;
					case 'Server Name':
						$campoValido[ 'Server Name' ] = $numCampo;
						break;
					case 'Asset Modification Date':
						$campoValido[ 'Asset Modification Date' ] = $numCampo;
						break;
					case 'Record Creation Date':
						$campoValido[ 'Record Creation Date' ] = $numCampo;
						break;
					case 'Record Name':
						$campoValido[ 'Record Name' ] = $numCampo;
						break;
					case 'Asset Name':
						$campoValido[ 'Asset Name' ] = $numCampo;
						break;
					case 'Image Width':
						$campoValido[ 'Image Width' ] = $numCampo;
						break;
					case 'Horizontal Resolution':
						$campoValido[ 'Horizontal Resolution' ] = $numCampo;
						break;
					case 'Vertical Pixels':
						$campoValido[ 'Vertical Pixels' ] = $numCampo;
						break;
					case 'Color Mode':
						$campoValido[ 'Color Mode' ] = $numCampo;
						break;
					case 'Vertical Resolution':
						$campoValido[ 'Vertical Resolution' ] = $numCampo;
						break;
					case 'Horizontal Pixels':
						$campoValido[ 'Horizontal Pixels' ] = $numCampo;
						break;
					case 'File Data Size':
						$campoValido[ 'File Data Size' ] = $numCampo;
						break;
					case 'File Format':
						$campoValido[ 'File Format' ] = $numCampo;
						break;
					case 'Image Height':
						$campoValido[ 'Image Height' ] = $numCampo;
						break;
					case 'ID':
						$campoValido[ 'ID' ] = $numCampo;
						break;
				}
			}
			$arrDatos[ ]                    = array( );
			$arrDatos[ 'Time_importacion' ] = date( "YmdHis" );
			$row                            = fgets( $fp );
			$row                            = fgets( $fp );
			$row                            = fgets( $fp );
			$contadorAbsorvidos = 0;
			while ( ( $row = fgets( $fp ) ) !== false ) { {
					$sql = explode( "\t", $row );
					if ( is_array( $sql ) ) {
						$arrDatos[ 'CatalogName' ]            = $sql[ $campoValido[ 'Catalog Name' ] ];
						$arrDatos[ 'Notes' ]                  = $sql[ $campoValido[ 'Notes' ] ];
						$arrDatos[ 'AssetCreationDate' ]      = $sql[ $campoValido[ 'Asset Creation Date' ] ];
						$arrDatos[ 'FolderName' ]             = $sql[ $campoValido[ 'Folder Name' ] ];
						$arrDatos[ 'RecordModificationDate' ] = $sql[ $campoValido[ 'Record Modification Date' ] ];
						$arrDatos[ 'VolumeName' ]             = $sql[ $campoValido[ 'Volume Name' ] ];
						$arrDatos[ 'ServerName' ]             = $sql[ $campoValido[ 'Server Name' ] ];
						$arrDatos[ 'AssetModificationDate' ]  = $sql[ $campoValido[ 'Asset Modification Date' ] ];
						$arrDatos[ 'RecordCreationDate' ]     = $sql[ $campoValido[ 'Record Creation Date' ] ];
						$arrDatos[ 'RecordName' ]             = $sql[ $campoValido[ 'Record Name' ] ];
						$arrDatos[ 'AssetName' ]              = $sql[ $campoValido[ 'Asset Name' ] ];
						$arrDatos[ 'ImageWidth' ]             = $sql[ $campoValido[ 'Image Width' ] ];
						$arrDatos[ 'HorizontalResolution' ]   = $sql[ $campoValido[ 'Horizontal Resolution' ] ];
						$arrDatos[ 'VerticalPixels' ]         = $sql[ $campoValido[ 'Vertical Pixels' ] ];
						$arrDatos[ 'ColorMode' ]              = $sql[ $campoValido[ 'Color Mode' ] ];
						$arrDatos[ 'VerticalResolution' ]     = $sql[ $campoValido[ 'Vertical Resolution' ] ];
						$arrDatos[ 'HorizontalPixels' ]       = $sql[ $campoValido[ 'Horizontal Pixels' ] ];
						$arrDatos[ 'FileDataSize' ]           = $sql[ $campoValido[ 'File Data Size' ] ];
						$arrDatos[ 'FileFormat' ]             = $sql[ $campoValido[ 'File Format' ] ];
						$arrDatos[ 'ImageHeight' ]            = $sql[ $campoValido[ 'Image Height' ] ];
						if ( isset( $siguienteCRE ) )
							$arrDatos[ 'ID_CRE' ] = $siguienteCRE;
						$siguienteCRE = $objImportaCRE->insert( $arrDatos );
						$contadorAbsorvidos++ ;
					}
				}
			}
		}
	}
}
$arrCREelegidos = procesaSeleccion( $objImportaCRE, $arrDatos[ 'Time_importacion' ], $arrDatos[ 'id_cliente' ]);
function procesaSeleccion( $objCRE, $MarcaImportacion, $IDCliente )
{
	$arrSeleccion = $objCRE->get_by_Time_importacion( $MarcaImportacion );
	if ( $arrSeleccion > 0 ) {
		$CREDatos          = $objCRE->getFirst();
		$anteriorServerVol = '';
		$contador=0;
		
echo('</br>'.date("H:i:s").'</br>');		
		
		for ( $i = 0; $i < $arrSeleccion; $i++ ) {
		
//		para producción


		$ServerName			 = '192.168.11.79'; //$CREDatos['ServerName'];        
        $VolumeName          = $CREDatos['VolumeName'];
        $EscVolumeName       = escapeshellarg($VolumeName);
        $LocalVolumeName     = "/srv/www/htdocs/folletos/thumbnails/" . $VolumeName;
        $EscLocalVolumeName  = escapeshellarg($LocalVolumeName);
        $actualServerVol     = "//" . $ServerName . "/" . $VolumeName;
//        $actualServerVol     = "afp://" . $ServerName . "/" . $VolumeName;
        $EscActualServerVol  = escapeshellarg($actualServerVol);
		
        if ($anteriorServerVol != $actualServerVol) {
            $anteriorServerVol = $actualServerVol;
            if (!is_dir($LocalVolumeName)) { // comprobamos si ya esta montado, convendría añadir el server.... 
                $orden1 = "mkdir " . $EscLocalVolumeName;
                system($orden1);   
            }
//     Valido excepto que wwwrun no puedue usar mount en pool   $orden2 = "mount.cifs " . $EscActualServerVol . " " . $EscLocalVolumeName. " -ouid=1000,gid=1000,guest";
//        echo ('</br>'.$orden2.'</br></br>'. exec('whoami').'</br>');
            
//$orden2 = 'mount_smbfs //juan:asemat@192.168.2.99/PoolDeCP /Volumes/PoolDeCP';
//$orden2 = "mount_afp " . $EscActualServerVol . " " . $EscLocalVolumeName; mount.cifs '//192.168.11.79/BBDD Feuvert' '/srv/www/htdocs/folletos/thumbnails/BBDD Feuvert' -o pass=
 
 
 //				system($orden2);
            
        }
		
		if ( is_dir( $LocalVolumeName ) ) {
			$path_Imagen = $LocalVolumeName . '/' . $CREDatos[ 'FolderName' ] . '/' . $CREDatos[ 'AssetName' ];
//			$path_Imagen = $LocalVolumeName . '/' . $CREDatos[ 'VolumeName' ] . '/' . $CREDatos[ 'FolderName' ] . '/' . $CREDatos[ 'AssetName' ];
			echo ('</br></br>'.$path_Imagen.'</br></br>');
			if ( file_exists( $path_Imagen ) ) {
				$Coleccion   = new catalogoClass();
				$idColeccion = $Coleccion->getColeccionXNombre( $CREDatos[ 'CatalogName' ], $IDCliente );
				if ( ! $idColeccion ) { //si no existe creamos la colección
					$datosColeccion[ 'edit_tipo' ]    = "";
					$datosColeccion[ 'edit_recurso' ] = "";
					$datosColeccion[ 'edit_nombre' ]  = $CREDatos[ 'CatalogName' ];
					$datosColeccion[ 'cliente' ]      = $IDCliente;
					$idColeccion                      = $Coleccion->insert( $datosColeccion );
				}
				//crear el producto
				$datosProducto[ 'edit_catalogo' ]           = $idColeccion[ 'col_id' ];
				$datosProducto[ 'edit_nombre' ]             = $CREDatos[ 'AssetName' ];
				$datosProducto[ 'edit_texto_comercial' ]    = $CREDatos[ 'Notes' ];
				$datosProducto[ 'edit_referencia_interna' ] = "";
				$datosProducto[ 'edit_referencia_cliente' ] = "";
				$datosProducto[ 'edit_datos' ]              = $CREDatos[ 'Notes' ];
				$producto                                   = new productoClass();
				$IDProducto                                 = $producto->insert( $datosProducto );
				//crear la imagen asociada al producto
				$datosImagen[ 'edit_item' ]                 = $IDProducto;
				$datosImagen[ 'edit_texto_comercial' ]      = $CREDatos[ 'Notes' ];
				$datosImagen[ 'edit_filename' ]             = $CREDatos[ 'AssetName' ];
				$imagen                                     = new imagenClass();
				$IDImagen                                   = $imagen->insert( $datosImagen );
//					var_dump( $path_Imagen );
				$directorios = documentoClass::doPrevio( $path_Imagen, $idColeccion[ 'col_id' ], $IDImagen );
			} else {
					echo ( "<br />No encontrado" . $path_Imagen );
			}
		} else
				echo ( '<br> no lo ve como directorio' );
		$CREDatos = $objCRE->getNext();
		$contador=$i+1;
		echo ("Procesados ".$contador. " de ".$arrSeleccion."</br>");
		}
		echo('</br> fin '.date("H:i:s").'</br>');		
	}
}
?>

