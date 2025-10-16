# Interactive Bar Chart Viewer

A dynamic bar chart viewer built with TypeScript and SimpleKit for the CS349 (User Interfaces) course at the University of Waterloo.

## Overview
This application visualizes datasets as animated, interactive bar charts.  
Users can:
- Hover over bars to view their values  
- Click bars to adjust their heights using arrow keys  
- Switch datasets using numbered buttons  
- Trigger next or previous datasets using flick gestures  

All interactions and rendering are done directly on a canvas using SimpleKit, with no DOM manipulation or CSS styling.

## Features
- Responsive layout that scales with window size  
- Smooth animations for bar height changes and button selection  
- Custom flick gesture recognition (left and right)  
- Keyboard input handling (arrow keys with Shift modifiers)  
- Data persistence between datasets  

## Technologies Used
- TypeScript  
- Vite  
- SimpleKit (Canvas Mode)  
- HTML5 Canvas API  
- Node.js and npm  

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/StandingToaster/Interactive-Bar-Chart-Viewer.git
   cd Interactive-Bar-Chart-Viewer
2. Install Dependancies
   npm install
   npm install simplekit
3. Run Development Server
   npm run dev -o

## Deployment
- Push changes to the `main` branch to trigger the GitHub Actions workflow in `.github/workflows/deploy.yml`.
- On the repository settings page, enable GitHub Pages and select "GitHub Actions" as the source (one-time setup).
- The app is published at `https://harsimrankalsi.com/`. If you fork this project, update `vite.config.ts` to set the correct `base` path and replace `public/CNAME` with your own domain (or delete it to fall back to the GitHub Pages default URL).
