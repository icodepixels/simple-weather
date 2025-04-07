<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCityStore } from '../stores/cityStore'

const cityStore = useCityStore()
// Use selectedCity from store as the source of truth for active tab
const activeTab = computed(() => cityStore.selectedCity?.id || 'rio-de-janeiro')

// Handle tab click
const selectTab = (cityId) => {
  const city = cityStore.getCityById(cityId)
  cityStore.setSelectedCity(city)
  cityStore.fetchForecastData(city.name)
}
</script>

<template>
  <div class="overflow-x-auto bg-white scrollbar-hide">
    <div class="flex space-x-2 min-w-max px-2">
      <button
        v-for="city in cityStore.cities"
        :key="city.id"
        @click="selectTab(city.id)"
        class="p-4 transition-all duration-300 text-sm font-medium relative uppercase whitespace-nowrap"
        :class="{
          'bg-white/20 text-black border-b-2 border-orange-500': activeTab === city?.id,
          'bg-white/5 hover:bg-white/10 text-gray-500 border-b-2 border-transparent': activeTab !== city?.id
        }"
      >
        {{ city.name }}
      </button>
    </div>
  </div>
</template>