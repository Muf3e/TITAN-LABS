# Deploy and launch the TITAN app on connected Android emulator / device
param(
    [string]$AdbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
    [string]$ApkPath = "$PSScriptRoot\..\..\app\build\outputs\apk\debug\app-debug.apk",
    [string]$PackageName = "com.titanlabs.productintelligence",
    [string]$MainActivity = "com.titanlabs.productintelligence.MainActivity"
)

if (-not (Test-Path $AdbPath)) {
    Write-Error "adb.exe not found at $AdbPath"
    exit 1
}

if (-not (Test-Path $ApkPath)) {
    Write-Host "APK not found. Building debug APK..."
    $env:JAVA_HOME = "C:\Program Files\Android\openjdk\jdk-21.0.8"
    Push-Location "$PSScriptRoot\..\.."
    .\gradlew.bat assembleDebug
    Pop-Location
}

Write-Host "Installing $ApkPath to connected device..."
& $AdbPath install -r -g $ApkPath

Write-Host "Launching $PackageName/$MainActivity..."
& $AdbPath shell am start -n "$PackageName/$MainActivity"
Write-Host "TITAN app launched successfully on emulator!"
