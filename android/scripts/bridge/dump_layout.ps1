# Dump current UI hierarchy from emulator for accessibility and layout inspection
param(
    [string]$AdbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
    [string]$OutputPath = "$PSScriptRoot\..\..\build\window_dump.xml"
)

$outputDir = Split-Path $OutputPath -Parent
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

Write-Host "Dumping UI hierarchy from device..."
& $AdbPath shell uiautomator dump /sdcard/window_dump.xml
& $AdbPath pull /sdcard/window_dump.xml $OutputPath
& $AdbPath shell rm /sdcard/window_dump.xml

if (Test-Path $OutputPath) {
    Write-Host "UI hierarchy dumped to $OutputPath"
} else {
    Write-Error "Failed to dump UI hierarchy."
}
