<!-- CitySearch.vue -->
<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useCityStore } from '../stores/cityStore'
import { useCitySuggestionsStore } from '../stores/citySuggestionsStore'

const cityStore = useCityStore()
const suggestionsStore = useCitySuggestionsStore()

const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const suggestions = ref([])
const showSuggestions = ref(false)
const selectedIndex = ref(-1) // Track the currently selected suggestion


const openSearch = async () => {
  isSearchOpen.value = true
  await nextTick()
  searchInput.value?.focus()
}

const handleBlur = () => {
  if (!searchQuery.value) {
    isSearchOpen.value = false
  }
  showSuggestions.value = false
  suggestions.value = []
  selectedIndex.value = -1 // Reset selected index
}

const handleKeydown = async (event) => {
  if (event.key === 'Enter') {
    if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
      // If a suggestion is selected, use it
      await selectCity(suggestions.value[selectedIndex.value])
    } else if (searchQuery.value) {
      // Otherwise, search with the current query
      await cityStore.fetchForecastData(searchQuery.value)
      if (!cityStore.error) {
        searchQuery.value = ''
        isSearchOpen.value = false
      }
    }
  } else if (event.key === 'Escape') {
    searchQuery.value = ''
    isSearchOpen.value = false
    selectedIndex.value = -1
  } else if (event.key === 'ArrowDown' && showSuggestions.value && suggestions.value.length > 0) {
    event.preventDefault()
    // Move selection down
    selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
    // Ensure the selected item is visible
    scrollSelectedIntoView()
  } else if (event.key === 'ArrowUp' && showSuggestions.value && suggestions.value.length > 0) {
    event.preventDefault()
    // Move selection up
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    // Ensure the selected item is visible
    scrollSelectedIntoView()
  }
}

// Scroll the selected item into view
const scrollSelectedIntoView = () => {
  nextTick(() => {
    const selectedElement = document.querySelector('.suggestion-item.selected')
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' })
    }
  })
}

const handleInput = () => {
  if (searchQuery.value.length >= 2) {
    suggestions.value = suggestionsStore.getSuggestions(searchQuery.value)
    showSuggestions.value = true
    selectedIndex.value = -1 // Reset selection when input changes
  } else {
    suggestions.value = []
    showSuggestions.value = false
    selectedIndex.value = -1
  }
}

const selectCity = async (city) => {
  searchQuery.value = city.name
  showSuggestions.value = false
  selectedIndex.value = -1

  try {
    await cityStore.fetchForecastData(city.name)
    if (!cityStore.error) {
      searchQuery.value = ''
      isSearchOpen.value = false
    }
  } catch (error) {
    console.error('Error selecting city:', error)
  }
}

onMounted(async () => {
  await suggestionsStore.loadCities()
})
</script>

<template>
  <div class="relative w-fit flex items-center">
    <!-- Search Container -->
    <div
      class="relative flex items-center transition-all duration-300 ease-in-out"
      :class="{ 'w-8': !isSearchOpen, 'w-40': isSearchOpen }"
    >
      <!-- Search Input -->
      <input
        type="text"
        v-model="searchQuery"
        class="absolute left-0 transition-all duration-300 ease-in-out bg-white/20 backdrop-blur-sm rounded focus:outline-none border border-white/30 text-white placeholder-white px-0 w-full py-0 text-base"
        :class="{
          'opacity-0 w-0 pointer-events-none': !isSearchOpen,
          'opacity-100 pl-2 w-40 relative': isSearchOpen
        }"
        placeholder="Search for a city..."
        @input="handleInput"
        @blur="handleBlur"
        @keydown="handleKeydown"
        ref="searchInput"
      >

      <!-- Search Button - Only visible when search is closed -->
      <button
        v-if="!isSearchOpen"
        @click="openSearch"
        class="flex items-center justify-center transition-opacity duration-300 relative z-10"
        type="button"
      >
        <font-awesome-icon
          icon="search"
          class="text-xl text-[#f7f8fa] cursor-pointer"
        />
      </button>
    </div>

    <!-- Suggestions dropdown -->
    <div v-if="showSuggestions && suggestions?.length > 0 && isSearchOpen"
         class="absolute top-1.5 left-0 right-0 mt-5 bg-white/90 backdrop-blur-sm border border-white/30 rounded-b max-h-48 overflow-y-auto z-50 shadow-md">
      <div
        v-for="(city, index) in suggestions"
        :key="city?.id"
        @mousedown="selectCity(city)"
        class="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200 suggestion-item"
        :class="{ 'bg-gray-100': index === selectedIndex, 'selected': index === selectedIndex }"
      >
        {{ city?.name }}, {{ city?.country }}
      </div>
    </div>
  </div>
</template>
