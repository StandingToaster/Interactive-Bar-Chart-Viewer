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
