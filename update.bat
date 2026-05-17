@echo off
echo 🚀 Bat dau qua trinh cap nhat GitHub...

git add .
set /p msg="Nhap ghi chu cap nhat (hoac nhan Enter de dung mac dinh): "
if "%msg%"=="" set msg="Cap nhat ngay %date% luc %time%"

git commit -m "%msg%"
git push origin main

echo.
echo ✅ Da cap nhat thanh cong len GitHub!
pause
