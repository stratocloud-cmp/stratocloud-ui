import { defineStore } from "pinia"



export const useActiveMenuStore = defineStore('stratoActiveMenu', {
    state: () => ({
      activeMenu: undefined,
      currentSideMenus: undefined
    }),
    actions: {
      setActiveMenu(activeMenu){
        this.activeMenu = activeMenu
      },
      setCurrentSideMenus(currentSideMenus){
        this.currentSideMenus = currentSideMenus
      }
    },
    persist: {
      storage: localStorage,
      paths: ['activeMenu','currentSideMenus']
    }
})
