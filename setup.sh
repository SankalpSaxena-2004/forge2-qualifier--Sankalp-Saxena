#!/bin/bash

echo "🦞 Molt's Kanban Board - Setup"
echo "=============================="

# Check if data directory exists
if [ ! -d "data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p data

    # Copy example data if available
    if [ -d "data.example" ]; then
        echo "📋 Copying example data..."
        cp data.example/*.json data/
    else
        # Create empty data files
        echo '{"projects":[]}' > data/tasks.json
        echo '{"activities":[]}' > data/activity.json
    fi

    echo "✅ Data directory created"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✨ Setup completed!"
echo ""
echo "Start the server with: npm start"
echo "The board will then be available at: http://localhost:3000"
