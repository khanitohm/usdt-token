<#
Run-all PowerShell orchestrator
Steps:
 - Start pricefeed in background and capture PID
 - Wait for /health to respond
 - Check sender balance
 - Run transfer (100k)
 - Run readiness check
 - Optionally stop pricefeed

Usage (PowerShell):
  .\scripts\run_all.ps1

This script only calls existing npm scripts; it does not expose private keys.
#>

function Start-LocalPriceFeed {
  Write-Host "Starting pricefeed..."
  $proc = Start-Process -FilePath npm -ArgumentList 'run','pricefeed' -PassThru
  Start-Sleep -Seconds 1
  Write-Host "Started pricefeed PID:" $proc.Id
  return $proc.Id
}

function Wait-Health {
  param($tries = 10)
  for ($i=0; $i -lt $tries; $i++) {
    try {
      $res = Invoke-RestMethod http://127.0.0.1:3000/health -TimeoutSec 2
      Write-Host "Health:" ($res | ConvertTo-Json)
      return $true
    } catch {
      Write-Host "Waiting for /health... ($($i+1)/$tries)"
      Start-Sleep -Seconds 1
    }
  }
  throw "Pricefeed did not respond"
}

function Invoke-CheckSender {
  Write-Host "Checking sender balance..."
  npm run check:sender
}

function Invoke-Transfer {
  Write-Host "Executing transfer (100,000)..."
  npm run transfer
}

function Invoke-Readiness {
  Write-Host "Running readiness check..."
  npm run ready
}

function Stop-LocalPriceFeed {
  param($processId)
  if ($processId) {
    Write-Host "Stopping pricefeed PID $processId"
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
  } else {
    Write-Host "No PID provided; skipping stop"
  }
}

try {
  $pfpid = Start-LocalPriceFeed
  Wait-Health
  Invoke-CheckSender
  Read-Host -Prompt "Press Enter to proceed with transfer (this will send 100,000 USDTz) or Ctrl+C to cancel"
  Invoke-Transfer
  Invoke-Readiness
  $stop = Read-Host -Prompt "Stop pricefeed? (y/n)"
  if ($stop -eq 'y') { Stop-LocalPriceFeed -processId $pfpid }
} catch {
  Write-Error $_
}
