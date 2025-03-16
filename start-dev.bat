@echo off
echo Starting development environment...

echo Starting server...
start cmd /k "cd server && npm run dev"

echo Starting client...
start cmd /k "cd client && npm run dev"

echo Development environment started! 