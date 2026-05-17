# save-work-note.ps1
# Reads a work note from clipboard and saves it to the correct Obsidian vault folder.
# Usage: copy the note Claude generated, then run this script.

$VAULT = "C:\Users\Jayde\OneDrive\Documents\Obsidian Vault"

$TOPIC_FOLDERS = @{
    "GoTab"    = "Work\GoTab"
    "Business" = "Work\Business"
    "Sales"    = "Work\Sales"
    "Tickets"  = "Work\Tickets"
    "Support"  = "Work\Support"
}

function Save-Note($text) {
    # Extract topic from frontmatter
    $topicMatch = [regex]::Match($text, 'topic:\s*(\S+)')
    if (-not $topicMatch.Success) {
        Write-Host "ERROR: Could not find 'topic:' in frontmatter. Make sure you copied the full note." -ForegroundColor Red
        return $false
    }
    $topic = $topicMatch.Groups[1].Value.Trim()

    # Extract date from frontmatter
    $dateMatch = [regex]::Match($text, 'date:\s*(\d{4}-\d{2}-\d{2})')
    $date = if ($dateMatch.Success) { $dateMatch.Groups[1].Value } else { Get-Date -Format "yyyy-MM-dd" }

    # Extract title from first H1 heading
    $titleMatch = [regex]::Match($text, '(?m)^#\s+(.+)$')
    if (-not $titleMatch.Success) {
        Write-Host "ERROR: Could not find a '# Title' heading in the note." -ForegroundColor Red
        return $false
    }
    $title = $titleMatch.Groups[1].Value.Trim()

    # Sanitise title for filename
    $safeTitle = $title -replace '[\\/:*?"<>|]', '-'
    $safeTitle = $safeTitle.Substring(0, [Math]::Min($safeTitle.Length, 80)).Trim()

    # Resolve folder
    if (-not $TOPIC_FOLDERS.ContainsKey($topic)) {
        Write-Host "ERROR: Unknown topic '$topic'. Valid topics: $($TOPIC_FOLDERS.Keys -join ', ')" -ForegroundColor Red
        return $false
    }
    $folder = Join-Path $VAULT $TOPIC_FOLDERS[$topic]

    # Create folder if needed
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }

    $filename = "$date $safeTitle.md"
    $dest = Join-Path $folder $filename

    # Warn if file already exists
    if (Test-Path $dest) {
        $overwrite = Read-Host "File already exists: $filename`nOverwrite? (y/n)"
        if ($overwrite -ne 'y') {
            Write-Host "Skipped." -ForegroundColor Yellow
            return $false
        }
    }

    Set-Content -Path $dest -Value $text -Encoding UTF8
    Write-Host ""
    Write-Host "Saved!" -ForegroundColor Green
    Write-Host "  File:   $filename"
    Write-Host "  Folder: $($TOPIC_FOLDERS[$topic])"
    Write-Host ""
    return $true
}

# ── Main ──────────────────────────────────────────────────────────────────────

$clipboard = Get-Clipboard -Raw

if (-not $clipboard -or $clipboard.Trim() -eq "") {
    Write-Host "Clipboard is empty. Copy a note from Claude first, then run this script." -ForegroundColor Yellow
    exit
}

# Handle multiple notes separated by ---NOTE---
$notes = $clipboard -split '---NOTE---' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }

if ($notes.Count -gt 1) {
    Write-Host "Found $($notes.Count) notes to save..." -ForegroundColor Cyan
    Write-Host ""
}

$saved = 0
foreach ($note in $notes) {
    if (Save-Note $note) { $saved++ }
}

if ($notes.Count -gt 1) {
    Write-Host "$saved of $($notes.Count) notes saved."
}

Read-Host "Press Enter to close"
