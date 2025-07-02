#!/bin/bash

echo "🔨 Test build locale..."
cd "C:/DEV/artifacts/artifacts_energivori"

# Test build
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build locale completata con successo!"
    echo "📁 Cartella build/ generata"
    echo "🚀 Pronto per il deploy su Netlify"
else
    echo "❌ Build fallita - controlla gli errori sopra"
fi
