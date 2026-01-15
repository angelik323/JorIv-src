import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    leftDrawerOpen: true,
    minLeftDrawer: false,
    rightDrawerOpen: false,
  }),

  actions: {
    toggleLeftInitialState(isOpen: boolean) {
      this.leftDrawerOpen = isOpen
    },

    toggleLeftDrawer(isMobile: boolean) {
      if (!isMobile) {
        this.leftDrawerOpen = true
        this.minLeftDrawer = !this.minLeftDrawer
      } else {
        this.minLeftDrawer = false
        this.leftDrawerOpen = !this.leftDrawerOpen
      }
    },

    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen
    },
  },
  persist: true,
})
