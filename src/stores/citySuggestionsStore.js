import { defineStore } from 'pinia';
import Papa from 'papaparse';

export const useCitySuggestionsStore = defineStore('citySuggestions', {
  state: () => ({
    cities: [],
    error: null,
  }),

  actions: {
    async loadCities() {
      try {
        this.isLoading = true;
        const response = await fetch('/src/data/cities_20000.csv');
        const csvText = await response.text();

        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        });

        this.cities = results.data.map(city => ({
          id: city.city_id,
          name: city.city_name,
          country: city.country_full,
          lat: parseFloat(city.lat),
          lon: parseFloat(city.lon)
        }));
      } catch (error) {
        this.error = 'Failed to load cities data';
        console.error('Error loading cities:', error);
      } finally {
        this.isLoading = false;
      }
    },

    getSuggestions(query) {
      if (!query) return [];

      const normalizedQuery = query.toLowerCase().trim();
      return this.cities
        .filter(city => city.name.toLowerCase().includes(normalizedQuery))
        .slice(0, 5); // Limit to 5 suggestions
    }
  }
});