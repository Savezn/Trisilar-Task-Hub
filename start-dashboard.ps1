$projectDir = "C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub"
$port       = 3000

# Check if server is already running on port 3000
$running = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $tcp.Connect("127.0.0.1", $port)
    $tcp.Close()
    $running = $true
} catch {}

if (-not $running) {
    Start-Process "node" -ArgumentList "server.js" `
        -WorkingDirectory $projectDir `
        -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

Start-Process "http://localhost:$port"
