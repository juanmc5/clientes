<?php
	if($objDatos->searchGrupos(0, 10, true)) {
?>
				<div id="grupos">
        	<h3>Grupos de Empresas</h3>
					<ul>
<?php
		while($arrRecord = $objDatos->getNext()) {
?>
						<li><a href="index.php?grupo=<?php echo $arrRecord['ID']; ?>" title="<?php echo $arrRecord['DESCR']; ?>" ><?php echo $arrRecord['LABEL']; ?></a></li>
<?php
		}
?>
						<li>&nbsp;</li>
						<li><a href="grupos.php">Ver todos los grupos</a></li>
						<li><a href="#" onclick="addGrupo();return true;">A&ntilde;adir un grupo&hellip;</a></li>
          </ul>          
        </div>
<?php
	}
?>