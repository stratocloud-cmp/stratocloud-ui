import { defineStore } from "pinia"



export const useActiveJobStore = defineStore('stratoActiveJob', {
    state: () => ({
        activeJobId: undefined
    }),
    actions: {
        setActiveJobId(activeJobId){
            this.activeJobId = activeJobId
        },
    }
})