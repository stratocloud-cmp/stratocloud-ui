import {inject, provide, ref} from 'vue'

class ResourceStackContext{

    tags= ref()

    constructor(){}
}

export function useResourceStackContextProvider(){
    const context = new ResourceStackContext()
    provide('resourceStackContext', context)
    return context
}

export function useResourceStackContext(){
    return inject('resourceStackContext', new ResourceStackContext())
}

