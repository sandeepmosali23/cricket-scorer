#!/bin/bash

echo "🔥 Firebase Security Rules Deployment"
echo "======================================"
echo ""
echo "Project: cricket-scorer-pro-95b9d"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "Install with: npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found"
echo ""

# Check if logged in
echo "📝 Checking Firebase authentication..."
firebase projects:list &> /dev/null
if [ $? -ne 0 ]; then
    echo ""
    echo "🔐 You need to login to Firebase first:"
    echo ""
    echo "Run: firebase login"
    echo ""
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Show current rules
echo "📄 Current security rules (firestore.rules):"
echo "--------------------------------------------"
head -20 firestore.rules
echo "..."
echo ""

# Confirm deployment
read -p "🚀 Deploy these rules to Firebase? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Deploying Firestore security rules..."
    firebase deploy --only firestore:rules

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Security rules deployed!"
        echo ""
        echo "Your database is now protected with:"
        echo "  ✓ Public read access"
        echo "  ✓ Public create access"
        echo "  ✓ 7-day auto-expiration for matches"
        echo "  ✓ 30-day auto-expiration for teams"
        echo ""
        echo "🎉 Your app is now production-ready!"
    else
        echo ""
        echo "❌ Deployment failed. Check the error above."
        exit 1
    fi
else
    echo ""
    echo "⏸️  Deployment cancelled."
fi
