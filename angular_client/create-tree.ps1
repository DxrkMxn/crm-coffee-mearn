$excludedFolders = @('node_modules', 'dist', '.git', 'coverage', 'build');
$rootPath = 'C:\Users\Dxrk\Documents\Proyectos\crm-coffee-mearn'

function Get-Tree {
    param (
        [string]$folder,
        [int]$level = 0
    )
    
    $indent = " " * $level
    $currentDir = Split-Path $folder -Leaf
    Write-Output "${indent}|-- $currentDir"
    
    Get-ChildItem $folder -Directory | Where-Object { $excludedFolders -notcontains $_.Name } | ForEach-Object {
        Get-Tree $_.FullName ($level + 4)
    }
}

Get-Tree $rootPath | Out-File 'C:\Users\Dxrk\Documents\Proyectos\crm-coffee-mearn\tree.txt'
