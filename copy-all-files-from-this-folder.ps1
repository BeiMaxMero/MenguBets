# 1. Obtener la ruta donde se encuentra el script
$scriptPath = $PSScriptRoot

# 2. Definir la carpeta destino: se creará una carpeta dentro de $scriptPath 
#    con el mismo nombre que la carpeta donde se encuentra el script.
$folderNameScript = Split-Path $scriptPath -Leaf
$dest = Join-Path $scriptPath $folderNameScript

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
}

# 3. Recorrer recursivamente todos los archivos en $scriptPath,
#    excluyendo aquellos que ya se encuentren en la carpeta destino para evitar copiar dos veces.
Get-ChildItem -Path $scriptPath -Recurse -File | Where-Object { 
    -not ($_.FullName.StartsWith($dest))
} | ForEach-Object {
    $file = $_

    # 4. Obtener la ruta relativa del directorio del archivo respecto a $scriptPath.
    #    Esto nos da, por ejemplo, "carpeta1\carpeta2" si el archivo está en esa subruta.
    $relativePath = $file.Directory.FullName.Substring($scriptPath.Length)
    $relativePath = $relativePath.Trim("\")  # Quitar barras invertidas al inicio o final

    # 5. Construir el prefijo:
    #    Si el archivo está en la raíz, se usará el nombre de la carpeta donde se ejecuta el script;
    #    de lo contrario, se reemplazan las barras invertidas por guiones bajos para formar el prefijo.
    if ($relativePath -eq "") {
        $prefix = $folderNameScript
    }
    else {
        $prefix = $relativePath -replace '\\','_'
    }

    # 6. Crear el nuevo nombre concatenando el prefijo, un guion bajo y el nombre original del archivo.
    $newName = "{0}_{1}" -f $prefix, $file.Name

    # 7. Construir la ruta destino completa para el archivo
    $destPath = Join-Path $dest $newName

    # 8. Copiar el archivo a la carpeta destino con el nuevo nombre
    Copy-Item -Path $file.FullName -Destination $destPath
}
