# Event Management System

A modern event management application built with React, JavaScript, and Vanilla CSS.

## Features

- Create and manage events across multiple timezones
- Event scheduling and calendar integration
- User profile management
- Event logs and history tracking
- Responsive design with modern UI components

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **React** - UI library with JavaScript
- **Vanilla CSS** - Custom CSS with CSS variables
- **Radix UI** - Accessible UI primitives
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd EventManagementSystem/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ui components
│   ├── EventCard/      # Event display component
│   ├── EventForm/      # Event creation/editing form
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.jsx           # Application entry point
```

