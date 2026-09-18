# Capture emulator screenshot cleanly via adb shell and pull
param(
    [string]$AdbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
    [string]$OutputPath = ""
)

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $OutputPath = "$PSScriptRoot\..\..\build\screenshot_$timestamp.png"
}

$outputDir = Split-Path $OutputPath -Parent
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

Write-Host "Capturing screenshot on emulator..."
& $AdbPath shell screencap -p /sdcard/titan_screencap.png
& $AdbPath pull /sdcard/titan_screencap.png $OutputPath | Out-Null
& $AdbPath shell rm /sdcard/titan_screencap.png

if (Test-Path $OutputPath) {
    $size = (Get-Item $OutputPath).Length
    Write-Host "Screenshot captured successfully ($size bytes): $OutputPath"
} else {
    Write-Error "Failed to capture screenshot."
}
