$sourceDir = "C:\Users\lol\.gemini\antigravity\brain\8b5f6b9d-4048-440e-9823-b3503c1f459b"
$destScenarios = "f:\proje\grezwanderer4\apps\web\public\images\scenarios"
$destRegions = "f:\proje\grezwanderer4\apps\web\public\images\regions"

$files = @(
    @{ Pattern = "university_street_*"; Name = "university_street.png"; Dest = $destScenarios },
    @{ Pattern = "warehouse_exterior_night_*"; Name = "warehouse_exterior_night.png"; Dest = $destScenarios },
    @{ Pattern = "tailor_shop_1905_*"; Name = "tailor_shop_1905.png"; Dest = $destScenarios },
    @{ Pattern = "street_morning_*"; Name = "street_morning.png"; Dest = $destScenarios },
    @{ Pattern = "lab_bg_*"; Name = "lab_bg.png"; Dest = $destScenarios },
    @{ Pattern = "train_station_outside_*"; Name = "train_station_outside.png"; Dest = $destScenarios },
    @{ Pattern = "bank_vault_1905_*"; Name = "bank_vault_1905.png"; Dest = $destScenarios },
    @{ Pattern = "bank_hall_1905_*"; Name = "bank_hall_1905.png"; Dest = $destScenarios },
    @{ Pattern = "apothecary_1905_*"; Name = "apothecary_1905.png"; Dest = $destScenarios },
    @{ Pattern = "mayor_office_*"; Name = "mayor_office.png"; Dest = $destScenarios },
    @{ Pattern = "freiburg_old_*"; Name = "freiburg_old.png"; Dest = $destRegions }
)

foreach ($file in $files) {
    $found = Get-ChildItem -Path $sourceDir -Filter $file.Pattern
    if ($found) {
        $sourcePath = $found.FullName
        $destPath = Join-Path $file.Dest $file.Name
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "Moved $($file.Pattern) to $destPath"
    } else {
        Write-Host "File not found: $($file.Pattern)"
    }
}
