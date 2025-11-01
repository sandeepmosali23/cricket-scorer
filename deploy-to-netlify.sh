#!/bin/bash

# Cricket Scorer Pro - Netlify Deployment Script
echo "🏏 Cricket Scorer Pro - Netlify Deployment"
echo "=========================================="
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "❌ Netlify CLI not found!"
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed!"
    echo ""
fi

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ Error: public directory not found!"
    exit 1
fi

# Check if index.html exists
if [ ! -f "public/index.html" ]; then
    echo "❌ Error: public/index.html not found!"
    exit 1
fi

echo "✅ All files ready for deployment"
echo ""

# Login to Netlify
echo "🔐 Logging in to Netlify..."
netlify login

echo ""
echo "🚀 Deploying to Netlify..."
echo ""

# Deploy to production
netlify deploy --prod --dir=public

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📱 Your app is now live!"
echo "🔗 Visit the URL shown above to access your Cricket Scorer Pro app"
echo ""
