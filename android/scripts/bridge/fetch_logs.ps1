# Fetch logs and crash stacktraces from connected Android device/emulator
param(
    [string]$AdbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
    [string]$PackageName = "com.titanlabs.productintelligence",
    [int]$Lines = 100
)

Write-Host "Fetching logcat for $PackageName..."
& $AdbPath logcat -d -t $Lines | Select-String -Pattern "AndroidRuntime", "$PackageName", "FATAL" | Select-Object -First 50
