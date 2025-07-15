# What is This - AI Object Identifier PWA

A Progressive Web App that identifies objects using AI by taking photos or text input.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Groq API key:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from: https://console.groq.com/keys

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

- 📸 Camera integration for photo capture
- 🤖 AI-powered object identification using Groq API
- 📱 Mobile-optimized PWA with offline capabilities
- 🎨 Modern glass morphism UI design
- 📐 Fully responsive design

## API Integration

This app uses the Groq API with the `meta-llama/llama-4-maverick-17b-128e-instruct` model for object identification. 