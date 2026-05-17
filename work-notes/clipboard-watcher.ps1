# clipboard-watcher.ps1
# Runs silently in the background. Monitors clipboard for Claude work notes
# and saves them to the Obsidian vault automatically.
#
# Start at login via Task Scheduler (see README for setup).

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$VAULT = "C:\Users\Jayde\OneDrive\Documents\Obsidian Vault"

$TOPIC_FOLDERS = @{
    "GoTab"    = "Work\GoTab"
    "Business" = "Work\Business"
    "Sales"    = "Work\Sales"
    "Tickets"  = "Work\Tickets"
    "Support"  = "Work\Support"
}

# ── Toast notification ────────────────────────────────────────────────────────

$trayIcon = New-Object System.Windows.Forms.NotifyIcon
$trayIcon.Icon = [System.Drawing.SystemIcons]::Information
$trayIcon.Visible = $true

function Show-Toast($title, $message, $isError = $false) {
    $trayIcon.BalloonTipIcon  = if ($isError) { "Error" } else { "Info" }
    $trayIcon.BalloonTipTitle = $title
    $trayIcon.BalloonTipText  = $message
    $trayIcon.ShowBalloonTip(4000)
}

# ── Note detection ────────────────────────────────────────────────────────────

function Is-WorkNote($text) {
    return $text -match '(?m)^---' -and $text -match 'type:\s*work-note' -and $text -match 'topic:\s*\S+'
}

# ── Save a single note ────────────────────────────────────────────────────────

function Save-Note($text) {
    $topicMatch = [regex]::Match($text, 'topic:\s*(\S+)')
    $dateMatch  = [regex]::Match($text, 'date:\s*(\d{4}-\d{2}-\d{2})')
    $titleMatch = [regex]::Match($text, '(?m)^#\s+(.+)$')

    if (-not $topicMatch.Success -or -not $titleMatch.Success) { return $null }

    $topic     = $topicMatch.Groups[1].Value.Trim()
    $date      = if ($dateMatch.Success) { $dateMatch.Groups[1].Value } else { Get-Date -Format "yyyy-MM-dd" }
    $title     = $titleMatch.Groups[1].Value.Trim()
    $safeTitle = ($title -replace '[\\/:*?"<>|]', '-').Substring(0, [Math]::Min($title.Length, 80)).Trim()

    if (-not $TOPIC_FOLDERS.ContainsKey($topic)) { return $null }

    $folder = Join-Path $VAULT $TOPIC_FOLDERS[$topic]
    if (-not (Test-Path $folder)) { New-Item -ItemType Directory -Path $folder -Force | Out-Null }

    $filename = "$date $safeTitle.md"
    $dest     = Join-Path $folder $filename

    # Skip if identical file already exists
    if (Test-Path $dest) {
        $existing = Get-Content $dest -Raw
        if ($existing.Trim() -eq $text.Trim()) { return "duplicate" }
        # Different content — append date suffix to avoid overwrite
        $filename = "$date $safeTitle $(Get-Date -Format 'HHmmss').md"
        $dest     = Join-Path $folder $filename
    }

    Set-Content -Path $dest -Value $text -Encoding UTF8
    return "$($TOPIC_FOLDERS[$topic])\$filename"
}

# ── Main loop ─────────────────────────────────────────────────────────────────

$lastHash = ""

Show-Toast "Obsidian Watcher" "Running — clipboard monitor active."

while ($true) {
    Start-Sleep -Milliseconds 1500

    try {
        $clip = [System.Windows.Forms.Clipboard]::GetText()
    } catch {
        continue
    }

    if (-not $clip -or $clip.Trim() -eq "") { continue }

    # Hash to avoid reprocessing the same clipboard content
    $hash = [System.Security.Cryptography.MD5]::Create().ComputeHash(
        [System.Text.Encoding]::UTF8.GetBytes($clip)
    ) | ForEach-Object { $_.ToString("x2") }
    $hash = $hash -join ""

    if ($hash -eq $lastHash) { continue }
    $lastHash = $hash

    if (-not (Is-WorkNote $clip)) { continue }

    # Split on ---NOTE--- separator for multiple notes
    $notes  = $clip -split '---NOTE---' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
    $saved  = @()
    $skipped = 0

    foreach ($note in $notes) {
        if (-not (Is-WorkNote $note)) { continue }
        $result = Save-Note $note
        if ($result -eq "duplicate") { $skipped++ }
        elseif ($result) { $saved += $result }
    }

    if ($saved.Count -gt 0) {
        $names = $saved | ForEach-Object { Split-Path $_ -Leaf }
        $msg   = if ($saved.Count -eq 1) { $names[0] } else { "$($saved.Count) notes saved" }
        Show-Toast "Obsidian — Note Saved" $msg
    }
}
