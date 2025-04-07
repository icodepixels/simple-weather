<!-- CityContent.vue -->
<script setup>
import { useCityStore } from '../stores/cityStore'
import { computed } from 'vue'

const cityStore = useCityStore()

// Get forecast data grouped by day
const dailyForecasts = computed(() => {
    if (!cityStore.forecastData?.list) return []

    const dailyForecasts = {}

    cityStore.forecastData.list.forEach(forecast => {
      const date = new Date(forecast?.dt * 1000)
      const day = date?.toLocaleDateString()

      if (!dailyForecasts[day]) {
        dailyForecasts[day] = {
          date: date,
          forecasts: []
        }
      }
      dailyForecasts[day].forecasts.push(forecast)
    })

    return Object.values(dailyForecasts)
  })

// Get next few hours of forecast
const hourlyForecast = computed(() => {
  if (!cityStore?.forecastData?.list) return []
  return cityStore.forecastData.list.slice(0, 11)
})

// Format hour
const formatHour = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)  // Multiply by 1000 to convert from seconds to milliseconds
  return date?.toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'UTC'
        })
}

// Format date
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return `${days[date?.getDay()] || ''}, ${months[date?.getMonth()] || ''} ${date?.getDate() || ''}`
}

// Get weather icon URL
const getWeatherIconUrl = (iconCode) => {
  if (!iconCode) return ''
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

</script>

<template>
  <div v-if="cityStore?.selectedCity" class="h-full">
    <!-- Loading indicator for forecast data -->
    <div v-if="cityStore?.isLoadingForecast" class="flex justify-center items-center h-32 mb-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>

    <!-- Next Hours Section -->
    <div v-else class="bg-white rounded shadow mb-4 mx-2 max-w-screen-md mx-auto">
      <h2 class="text-2xl font-normal p-4">Next hours</h2>

      <div v-if="!cityStore?.forecastError && hourlyForecast?.length > 0" class="w-full overflow-x-auto">
        <div class="grid grid-cols-11 text-center border-t border-gray-100 pt-4 min-w-max">
          <div v-for="(forecast, index) in hourlyForecast" :key="forecast?.dt" class="flex flex-col items-center">
            <div class="font-medium">{{ Math.round(forecast?.main?.temp) }}°</div>
            <div class="flex flex-col items-center w-full" :class="{ 'border-l border-gray-100': index !== 0 && index !== hourlyForecast?.length - 1 }">
              <div class="text-blue-400 text-sm">{{ forecast?.main?.humidity }}%</div>
              <div class="w-12 h-12">
                <img :src="getWeatherIconUrl(forecast?.weather?.[0]?.icon)"
                     :alt="forecast?.weather?.[0]?.description"
                     class="w-full h-full">
              </div>
            </div>
            <div class="text-sm text-gray-400 mb-4">{{ formatHour(forecast?.dt) }}</div>
          </div>
        </div>
      </div>

      <!-- Error message for hourly forecast -->
      <div v-else-if="cityStore?.forecastError" class="p-4 text-red-500">
        {{ cityStore?.forecastError }}
      </div>

      <!-- No data message for hourly forecast -->
      <div v-else class="p-4 text-gray-500 text-center">
        No hourly forecast data available
      </div>
    </div>

    <!-- Next 5 Days Section -->
    <div class="bg-white rounded shadow mb-4 mx-2 max-w-screen-md mx-auto">
      <h2 class="text-2xl font-normal p-4">Next 5 days</h2>

      <div v-if="!cityStore?.forecastError && dailyForecasts?.length > 0" class="space-y-4 border-t border-gray-100 pt-4">
        <div v-for="day in dailyForecasts.slice(0, 5)" :key="day?.date" class="flex items-center border-b border-gray-100 pb-2 mx-4">
          <div class="w-12 h-12">
            <img :src="getWeatherIconUrl(day?.forecasts?.[0]?.weather?.[0]?.icon)" :alt="day?.forecasts?.[0]?.weather?.[0]?.description" class="w-full h-full">
          </div>
          <div class="flex-grow flex flex-col items-center">
            <div class="font-medium">{{ formatDate(day?.forecasts?.[0]?.dt) }}</div>
            <div class="text-gray-500 text-sm">{{ day?.forecasts?.[0]?.weather?.[0]?.description }}</div>
          </div>
          <div class="pr-1">
            <span>{{ Math.round(day?.forecasts?.[0]?.main?.temp_max) }}°</span>
            <span class="ml-2">{{ Math.round(day?.forecasts?.[0]?.main?.temp_min) }}°</span>
          </div>
        </div>
      </div>

      <!-- Error message for daily forecast -->
      <div v-else-if="cityStore?.forecastError" class="p-4 text-red-500">
        {{ cityStore?.forecastError }}
      </div>

      <!-- No data message for daily forecast -->
      <div v-else class="p-4 text-gray-500 text-center">
        No daily forecast data available
      </div>
    </div>
  </div>
  <div v-else class="h-full flex items-center justify-center">
    <div class="p-4 bg-white rounded shadow text-center text-gray-600">
      Select a city to view weather information
    </div>
  </div>
</template>