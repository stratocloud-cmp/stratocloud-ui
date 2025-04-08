import {inject, provide, ref} from 'vue'

class NetworkResourceContext {
    constructor () {
        this.networkResourceId = ref()
    }

    setNetworkResourceId (id) {
        this.networkResourceId.value = id
    }
}




export function useNetworkResourceContextProvider(){
    const networkResourceContext = new NetworkResourceContext()
    provide('networkResourceContext', networkResourceContext)
    return networkResourceContext
}

export function useNetworkResourceContext(){
    return inject('networkResourceContext', new NetworkResourceContext())
}