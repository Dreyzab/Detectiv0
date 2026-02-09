<#
.SYNOPSIS
    Auto-generates Obsidian Canvas from VN node structure
.DESCRIPTION
    Scans a folder (optionally recursively) for scene_*.md, *_beat*.md, *_ch*.md, map_*.md files,
    parses frontmatter for parent and type, then generates a .canvas JSON
    with nodes positioned in a hierarchical layout.
.PARAMETER FolderPath
    Path to the folder to scan
.PARAMETER VaultRoot
    Path to the Obsidian vault root (for generating relative paths)
.PARAMETER OutputName
    Name of the output canvas file (default: Auto_Flow.canvas)
.PARAMETER Recursive
    If specified, scan subfolders recursively
.EXAMPLE
    .\generate_canvas.ps1 -FolderPath ".\obsidian\StoryDetective\40_GameViewer\Case01\Plot" -VaultRoot ".\obsidian\StoryDetective" -Recursive
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$FolderPath,
    
    [Parameter(Mandatory = $true)]
    [string]$VaultRoot,
    
    [Parameter(Mandatory = $false)]
    [string]$OutputName = "Auto_Flow.canvas",
    
    [Parameter(Mandatory = $false)]
    [switch]$Recursive
)

# Resolve to absolute paths
$FolderPath = (Resolve-Path $FolderPath).Path
$VaultRoot = (Resolve-Path $VaultRoot).Path

# Node dimensions
$NODE_WIDTH = 300
$NODE_HEIGHT = 100
$H_SPACING = 350
$V_SPACING = 150

# Color mapping by type (Obsidian Canvas colors: 1-6)
# Using semantic colors matching CSS snippet
$TYPE_COLORS = @{
    # Scene family - Blue (1 = red in canvas, using custom mapping)
    "vn_scene"      = "1"   # Red - main scenes stand out
    "vn_beat"       = "4"   # Green - beats
    "vn_background" = "6"   # Cyan - background
    "vn_checks"     = "5"   # Purple - checks
    
    # Decision family - Warm
    "vn_choice"     = "3"   # Yellow - choices
    "vn_action"     = "2"   # Orange - actions
    
    # Navigation
    "map_hub"       = "1"   # Red - important navigation
    "location"      = "4"   # Green - locations
    
    # Evidence - all variants
    "evidence"      = "5"   # Purple base
}

# Evidence category to shade mapping
$EVIDENCE_COLORS = @{
    "fact"        = "5"   # Purple
    "observation" = "6"   # Cyan (lighter)
    "item"        = "3"   # Yellow (gold)
}

function Get-Frontmatter {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    if (-not $content) { return @{} }
    
    if ($content -match "(?s)^---\r?\n(.+?)\r?\n---") {
        $yaml = $Matches[1]
        $result = @{}
        
        foreach ($line in $yaml -split "`n") {
            if ($line -match "^(\w+):\s*(.+)$") {
                $result[$Matches[1]] = $Matches[2].Trim()
            }
        }
        return $result
    }
    return @{}
}

function Get-NodeId {
    return [guid]::NewGuid().ToString().Substring(0, 16)
}

function Get-RelativePath {
    param(
        [string]$FullPath,
        [string]$BasePath
    )
    $relative = $FullPath.Replace($BasePath, "").TrimStart("\", "/")
    return $relative -replace "\\", "/"
}

function Get-NodeColor {
    param(
        [string]$Type,
        [string]$Category
    )
    
    # Check for evidence category first
    if ($Category -and $EVIDENCE_COLORS.ContainsKey($Category)) {
        return $EVIDENCE_COLORS[$Category]
    }
    
    # Fall back to type
    if ($Type -and $TYPE_COLORS.ContainsKey($Type)) {
        return $TYPE_COLORS[$Type]
    }
    
    return "0"  # Default grey
}

# Collect all markdown files
$searchOption = if ($Recursive) { "AllDirectories" } else { "TopDirectoryOnly" }
$files = Get-ChildItem -Path $FolderPath -Filter "*.md" -Recurse:$Recursive | 
Where-Object { $_.Name -notmatch "^MOC_" -and $_.Name -notmatch "^_" }

$nodes = @()
$edges = @()
$nodeMap = @{}  # id -> canvas node id
$parentMap = @{}  # id -> parent id
$fileToId = @{}  # file path -> id

# Parse files and build node list
$x = 0
$yByParent = @{}

foreach ($file in $files) {
    $fm = Get-Frontmatter -FilePath $file.FullName
    $id = $fm["id"]
    $type = $fm["type"]
    $parent = $fm["parent"]
    $category = $fm["category"]
    
    if (-not $id) { 
        # Generate ID from filename
        $id = $file.BaseName
    }
    
    $canvasId = Get-NodeId
    $nodeMap[$id] = $canvasId
    $fileToId[$file.FullName] = $id
    
    if ($parent) {
        $parentMap[$id] = $parent
    }
    
    # Determine position
    if ($parent -and $yByParent.ContainsKey($parent)) {
        $yByParent[$parent] += 1
        $y = $yByParent[$parent] * $V_SPACING
        $parentNode = $nodes | Where-Object { $_.id -eq $nodeMap[$parent] } | Select-Object -First 1
        $xPos = if ($parentNode) { $parentNode.x + $H_SPACING } else { $x }
    }
    else {
        $y = 0
        $xPos = $x
        $x += $H_SPACING
        if ($id) { $yByParent[$id] = 0 }
    }
    
    $color = Get-NodeColor -Type $type -Category $category
    
    # Generate relative path from vault root
    $relativePath = Get-RelativePath -FullPath $file.FullName -BasePath $VaultRoot
    
    $nodes += @{
        id     = $canvasId
        type   = "file"
        file   = $relativePath
        x      = $xPos
        y      = $y
        width  = $NODE_WIDTH
        height = $NODE_HEIGHT
        color  = $color
    }
}

# Build edges from parent relationships
foreach ($id in $parentMap.Keys) {
    $parentId = $parentMap[$id]
    if ($nodeMap.ContainsKey($id) -and $nodeMap.ContainsKey($parentId)) {
        $edges += @{
            id       = Get-NodeId
            fromNode = $nodeMap[$parentId]
            fromSide = "right"
            toNode   = $nodeMap[$id]
            toSide   = "left"
        }
    }
}

# Generate canvas JSON
$canvas = @{
    nodes = $nodes
    edges = $edges
}

$outputPath = Join-Path $FolderPath $OutputName
$canvas | ConvertTo-Json -Depth 10 | Set-Content $outputPath -Encoding UTF8

Write-Host "✅ Canvas generated: $outputPath"
Write-Host "   Nodes: $($nodes.Count)"
Write-Host "   Edges: $($edges.Count)"
