# Script cài đặt Hugo trên Windows
Write-Host "Đang tải thông tin phiên bản Hugo mới nhất..." -ForegroundColor Yellow

# Lấy thông tin release mới nhất
$releaseInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/gohugoio/hugo/releases/latest"

# Tìm file Windows extended
$hugoAsset = $releaseInfo.assets | Where-Object { 
    $_.name -like "*windows-amd64*" -and $_.name -like "*extended*" -and $_.name -like "*.zip" -and $_.name -notlike "*withdeploy*"
} | Select-Object -First 1

if (-not $hugoAsset) {
    Write-Host "Không tìm thấy file Hugo extended cho Windows!" -ForegroundColor Red
    exit 1
}

Write-Host "Tìm thấy: $($hugoAsset.name)" -ForegroundColor Green
Write-Host "Đang tải Hugo..." -ForegroundColor Yellow

# Tạo thư mục tạm
$tempDir = "$env:TEMP\hugo-install"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Download file
$zipPath = Join-Path $tempDir "hugo.zip"
$downloadUrl = $hugoAsset.browser_download_url
Write-Host "Download URL: $downloadUrl" -ForegroundColor Cyan
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath

Write-Host "Đang giải nén..." -ForegroundColor Yellow

# Giải nén
Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force

# Tìm file hugo.exe
$hugoExe = Get-ChildItem -Path $tempDir -Filter "hugo.exe" -Recurse | Select-Object -First 1

if (-not $hugoExe) {
    Write-Host "Không tìm thấy hugo.exe trong file zip!" -ForegroundColor Red
    exit 1
}

Write-Host "Đang cài đặt Hugo..." -ForegroundColor Yellow

# Tạo thư mục C:\hugo nếu chưa có
$installDir = "C:\hugo"
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

# Copy vào C:\hugo (không cần quyền admin)
try {
    Copy-Item -Path $hugoExe.FullName -Destination "$installDir\hugo.exe" -Force
    Write-Host "Đã copy Hugo vào: $installDir\hugo.exe" -ForegroundColor Green
    
    # Thêm vào User PATH
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$installDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installDir", "User")
        Write-Host "Đã thêm $installDir vào PATH" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Cài đặt thành công!" -ForegroundColor Green
    Write-Host ""
    Write-Host "QUAN TRỌNG: Bạn cần đóng và mở lại Command Prompt/PowerShell để sử dụng Hugo!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Sau đó chạy lệnh:" -ForegroundColor Cyan
    Write-Host "  hugo version" -ForegroundColor White
    Write-Host ""
    Write-Host "Và chạy blog:" -ForegroundColor Cyan
    Write-Host "  cd `"d:\Do An\Bao Cao Lap Trinh Mang May Tinh 2\thien-devsystem`"" -ForegroundColor White
    Write-Host "  hugo server -D" -ForegroundColor White
    
} catch {
    Write-Host "Lỗi khi cài đặt: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Bạn có thể copy thủ công file này:" -ForegroundColor Yellow
    Write-Host "  $($hugoExe.FullName)" -ForegroundColor White
    Write-Host "Vào thư mục: C:\hugo" -ForegroundColor White
}

# Dọn dẹp
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Hoàn tất!" -ForegroundColor Green

