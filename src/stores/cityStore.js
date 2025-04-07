import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCityStore = defineStore('city', () => {
  const apiKey = '6e4b41231e26caed5109552a1063f847'

  // Define default cities
  const cities = ref([
    { id: 'rio-de-janeiro', name: 'Rio de Janeiro' },
    { id: 'beijing', name: 'Beijing' },
    { id: 'los-angeles', name: 'Los Angeles' }
  ])

  // Track the selected city
  const selectedCity = ref(null)

  // Track weather data
  const forecastData = ref(null)
  const isLoading = ref(false)
  const isLoadingForecast = ref(false)
  const error = ref(null)
  const forecastError = ref(null)

  // Set the selected city
  const setSelectedCity = (city) => {
    if (!city) {
      return setDefaultCity()
    }
    selectedCity.value = city
  }

  // Get city by ID
  const getCityById = (cityId) => {
    return cities.value.find(city => city.id === cityId)
  }

  // Set default city
  const setDefaultCity = () => {
    const defaultCity = getCityById('rio-de-janeiro')
    setSelectedCity(defaultCity)
  }

  // Fetch OpenWeatherMap API
  const fetchForecastData = async (cityName) => {
    if (!cityName || cityName.length < 2 || forecastData.value?.city?.name.toLowerCase() === cityName.toLowerCase()) return
    isLoadingForecast.value = true
    forecastError.value = null

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      )

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`)
      }

      const data = await response.json()
      // Create a new city object
      const newCity = {
        id: data.city.name.toLowerCase().replace(/\s+/g, '-'),
        name: data.city.name,
        coord: data.city.coord
      }
      // Check if city already exists
      const existingCity = cities.value.find(c => c.id === newCity.id)
      if (!existingCity) {
        // Add new city to the beginning of the array
        cities.value = [newCity, ...cities.value]
      }
      // Set the selected city
      setSelectedCity(newCity)
      // Set the forecast data
      forecastData.value = data
    } catch (err) {
      forecastError.value = err.message
      console.error('Error fetching forecast data:', err)
    } finally {
      isLoadingForecast.value = false
    }
  }

  return {
    cities,
    selectedCity,
    forecastData,
    isLoading,
    isLoadingForecast,
    error,
    forecastError,
    setSelectedCity,
    getCityById,
    setDefaultCity,
    fetchForecastData
  }
})