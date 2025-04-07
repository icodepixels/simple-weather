<script setup>
import { onMounted, ref, watch } from 'vue'
import CitySearch from './components/CitySearch.vue'
import CityTabs from './components/CityTabs.vue'
import CityContent from './components/CityContent.vue'
import { useCityStore } from './stores/cityStore'

const cityStore = useCityStore()
const lastUpdated = ref(new Date());

onMounted(() => {
  cityStore.setDefaultCity()
  cityStore.fetchForecastData(cityStore.selectedCity.name)
})

// Watch for changes to forecastData and update lastUpdated
watch(() => cityStore.forecastData, () => {
  lastUpdated.value = new Date()
}, { deep: true })

</script>

<template>
  <div class="flex flex-col h-screen bg-gray-100 overflow-hidden">
    <header class="bg-[#2966b0] p-4 flex justify-between items-center shadow-sm">
      <h1 class="text-xl font-medium text-[#f7f8fa]">Simple Weather</h1>
      <CitySearch />
    </header>
    <CityTabs />
    <div class="flex-1 overflow-auto mx-4 mt-2">
      <CityContent />
    </div>
    <div class="bg-[#2966b0] text-[#f7f8fa] px-2 text-sm text-right">
      Last updated on {{ lastUpdated.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) }}
    </div>
  </div>
</template>
