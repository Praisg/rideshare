#!/bin/bash
echo "Starting Ride App Server..."
echo ""
echo "Checking environment..."

if [ ! -f "server/.env" ]; then
    echo "Error: .env file not found in server directory"
    exit 1
fi

echo "Environment file found"
echo ""
echo "Starting server on port 3000..."
echo "Server will be accessible at:"
echo "  - http://localhost:3000"
echo "  - http://0.0.0.0:3000"
echo ""

cd server && npm start
