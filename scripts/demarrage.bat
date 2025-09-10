@echo off

REM Vous définissez le nom ici
set KIOSK_KEY=""

REM Et il est automatiquement ajouté à l'URL de démarrage
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "http://nextjs.ls-inf0rmatique.fr/?kioskKey=%KIOSK_KEY%"