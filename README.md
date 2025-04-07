# Weather App

A modern weather application built with Vue 3, Vite, and Tailwind CSS that allows users to view weather forecasts for multiple cities.

## Features

- **City Selection**: Choose from predefined cities or search for new ones
- **Weather Forecasts**: View detailed weather information including:
  - Hourly forecasts with temp and humidity levels
  - 5-day forecast with daily high/low temperatures
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Uses OpenWeatherMap API for accurate weather data
- **City Suggestions**: Intelligent city search with 20,000 suggestions

## Technologies Used

- **Vue 3**: Progressive JavaScript framework with Composition API
- **Vite**: Next Generation Frontend Tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Pinia**: State management for Vue
- **Font Awesome**: Icon library
- **OpenWeatherMap API**: Weather data provider

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
├── src/
│   ├── components/    # Vue components
│   │   ├── CityContent.vue    # Displays weather forecast data
│   │   ├── CitySearch.vue     # City search functionality
│   │   └── CityTabs.vue       # City selection tabs
│   ├── stores/        # Pinia stores
│   │   ├── cityStore.js              # Main application state
│   │   └── citySuggestionsStore.js   # City search suggestions
│   ├── data/          # Static data files
│   │   └── cities_20000.csv          # City database for suggestions
│   ├── App.vue        # Root component
│   └── main.js        # Application entry point
├── public/            # Public static files
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json       # Project dependencies and scripts
```

## Usage

### Viewing Weather Data

1. The app starts with Rio de Janeiro as the default city
2. Click on any city tab to view its weather forecast
3. View the 5-day forecast and hourly forecast

### Searching for Cities

1. Click the search icon in the top-right corner
2. Type at least 2 characters to see city suggestions
3. Select a city from the dropdown or press Enter to search
4. The app will fetch and display weather data for the selected city

## API Integration

The application uses the OpenWeatherMap API to fetch weather data. The API key is stored in the `cityStore.js` file. For production use, consider moving this to an environment variable.

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

### State Management

The application uses Pinia for state management with two main stores:

- `cityStore`: Manages the selected city and weather data
- `citySuggestionsStore`: Handles city search suggestions
