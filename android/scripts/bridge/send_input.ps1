# Send tap, text, swipe, or keyevent input to connected emulator
param(
    [string]$AdbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
    [string]$Action = "tap", # tap, swipe, text, key
    [int]$X = 0,
    [int]$Y = 0,
    [int]$EndX = 0,
    [int]$EndY = 0,
    [int]$DurationMs = 300,
    [string]$Text = "",
    [string]$Key = "" # e.g. 4 for Back, 3 for Home, 66 for Enter
)

switch ($Action.ToLower()) {
    "tap" {
        Write-Host "Tapping at ($X, $Y)..."
        & $AdbPath shell input tap $X $Y
    }
    "swipe" {
        Write-Host "Swiping from ($X, $Y) to ($EndX, $EndY) in ${DurationMs}ms..."
        & $AdbPath shell input swipe $X $Y $EndX $EndY $DurationMs
    }
    "text" {
        Write-Host "Typing text: $Text..."
        & $AdbPath shell input text "$Text"
    }
    "key" {
        Write-Host "Sending keyevent $Key..."
        & $AdbPath shell input keyevent $Key
    }
    default {
        Write-Error "Unknown action: $Action. Use tap, swipe, text, or key."
    }
}
