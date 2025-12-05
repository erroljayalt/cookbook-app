# Cookbook Application

A premium digital cookbook web application built with Next.js, TypeScript, and SQLite.

## Features

- 📖 Beautiful, cookbook-inspired design
- 🍳 Browse recipes in an elegant grid layout
- 📝 Detailed recipe pages with ingredients and step-by-step instructions
- ➕ Upload new recipes with images
- 💾 SQLite database for local storage
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Run the installation script:
   ```bash
   install.bat
   ```

   Or manually:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   start.bat
   ```

   Or manually:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Viewing Recipes

- The home page displays all recipes in a grid layout
- Click on any recipe card to view the full recipe details

### Adding a Recipe

1. Click "Add Recipe" in the navigation
2. Fill in the recipe details:
   - Title
   - Chef's name
   - Description (optional)
   - Upload an image
   - Add ingredients (click "+ Add Ingredient" for more)
   - Add cooking instructions (click "+ Add Step" for more)
3. Click "Publish Recipe"

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules)
- **Database**: better-sqlite3 (SQLite)
- **Image Storage**: Local filesystem

## Project Structure

```
cookbook-app/
├── src/
│   ├── app/
│   │   ├── api/recipes/       # API routes
│   │   ├── recipes/[id]/      # Recipe detail page
│   │   ├── upload/            # Upload recipe page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   └── lib/
│       └── db.ts              # Database utilities
├── public/
│   └── uploads/               # Uploaded recipe images
└── recipes.db                 # SQLite database (created on first run)
```

## Design

The application features a premium, cookbook-inspired aesthetic with:
- Warm color palette (cream, parchment, brown tones)
- Elegant serif fonts (Playfair Display) for headings
- Clean sans-serif fonts (Inter) for body text
- Smooth animations and transitions
- Responsive design for all screen sizes

## License

MIT
