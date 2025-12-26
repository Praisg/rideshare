#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./configure-maps.sh YOUR_GOOGLE_MAPS_API_KEY"
    echo ""
    echo "This script will replace YOUR_GOOGLE_MAP_API_KEY with your actual API key in all necessary files."
    exit 1
fi

API_KEY="$1"

echo "Configuring Google Maps API Key..."
echo ""

FILES=(
    "app.json"
    "ios/RideApp/Info.plist"
    "ios/RideApp/AppDelegate.mm"
    "android/app/src/main/AndroidManifest.xml"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        sed -i.bak "s/YOUR_GOOGLE_MAP_API_KEY/$API_KEY/g" "$file"
        echo "Updated: $file"
        rm "$file.bak"
    else
        echo "Warning: $file not found"
    fi
done

echo ""
echo "Configuration complete!"
echo "Google Maps API Key has been set in all necessary files."

