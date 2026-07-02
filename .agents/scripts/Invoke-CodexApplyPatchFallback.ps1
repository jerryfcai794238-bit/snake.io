[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$PatchFile,
    [ValidateRange(1000, 24000)]
    [int]$MaxBatchChars = 24000,
    [string]$CodexPath,
    [switch]$ValidateOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Resolve-CodexExecutable {
    if ($CodexPath) {
        return (Resolve-Path -LiteralPath $CodexPath).Path
    }
    $found = @(Get-Command codex -CommandType Application -ErrorAction SilentlyContinue)
    if ($found.Count -eq 0) {
        throw 'Codex CLI not found. Use -CodexPath to specify codex.exe.'
    }
    return $found[0].Source
}

function Get-PatchOperations {
    param([string]$Text)
    $begin = '*** Begin ' + 'Patch'
    $end = '*** End ' + 'Patch'
    $text = [regex]::Replace($Text.TrimStart([char]0xFEFF), [char]13, '')
    if (-not $text.StartsWith($begin + [char]10)) {
        throw 'Invalid patch: missing begin marker.'
    }
    if (-not $text.TrimEnd().EndsWith($end)) {
        throw 'Invalid patch: missing end marker.'
    }
    $start = ($begin + [char]10).Length
    $body = $text.Substring($start, $text.LastIndexOf($end) - $start).Trim([char]10)
    $matches = [regex]::Matches($body, '(?m)^\*\*\* (?:Add|Update|Delete) File: .+$')
    if ($matches.Count -eq 0 -or $matches[0].Index -ne 0) {
        throw 'Invalid patch: no valid file operation found.'
    }
    $result = @()
    for ($i = 0; $i -lt $matches.Count; $i++) {
        $from = $matches[$i].Index
        if ($i + 1 -lt $matches.Count) {
            $length = $matches[$i + 1].Index - $from
        }
        else {
            $length = $body.Length - $from
        }
        $result += $body.Substring($from, $length).Trim([char]10)
    }
    return $result
}

function New-PatchBatches {
    param([string[]]$Operations)
    $begin = '*** ' + 'Begin Patch'
    $end = '*** ' + 'End Patch'
    $batches = @()
    $current = @()
    $nl = [Environment]::NewLine
    foreach ($operation in $Operations) {
        $single = [string]::Concat($begin, $nl, $operation, $nl, $end)
        if ($single.Length -gt $MaxBatchChars) {
            throw 'One operation exceeds the limit. Split it into independent hunks.'
        }
        $items = @($current) + $operation
        $candidate = [string]::Concat($begin, $nl, ($items -join $nl), $nl, $end)
        if ($candidate.Length -gt $MaxBatchChars -and $current.Count -gt 0) {
            $batches += [string]::Concat($begin, $nl, ($current -join $nl), $nl, $end)
            $current = @()
        }
        $current += $operation
    }
    if ($current.Count -gt 0) {
        $batches += [string]::Concat($begin, $nl, ($current -join $nl), $nl, $end)
    }
    return $batches
}

$path = (Resolve-Path -LiteralPath $PatchFile).Path
$utf8 = [System.Text.UTF8Encoding]::new($false, $true)
$text = [IO.File]::ReadAllText($path, $utf8)
$operations = @(Get-PatchOperations $text)
$batches = @(New-PatchBatches $operations)
Write-Host ('Patch validation: {0} operations, {1} batches.' -f $operations.Count, $batches.Count)
if ($ValidateOnly) {
    Write-Host 'Patch validation passed.'
    return
}
$codex = Resolve-CodexExecutable
for ($i = 0; $i -lt $batches.Count; $i++) {
    Write-Host ('Applying batch {0}/{1}.' -f ($i + 1), $batches.Count)
    & $codex --codex-run-as-apply-patch $batches[$i]
    if ($LASTEXITCODE -ne 0) {
        throw ('Batch {0} failed. Exit code: {1}' -f ($i + 1), $LASTEXITCODE)
    }
    Write-Host ('Batch {0} completed. Exit code: 0' -f ($i + 1))
}
