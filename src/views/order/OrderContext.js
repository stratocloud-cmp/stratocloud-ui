import {inject, provide} from 'vue'

class OrderContext {
    constructor() {
        this.orderItemChangeDetector = []
    }

    registerOrderItemChangeDetector(detector) {
        this.orderItemChangeDetector.push(detector)
    }

    isAnyOrderItemChanged(){
        for (let detector of this.orderItemChangeDetector) {
            if(detector()){
                return true
            }
        }
        return false
    }
}

export function useOrderContextProvider(){
    const orderContext = new OrderContext()
    provide('orderContext', orderContext)
    return orderContext
}

export function useOrderContext(){
    return inject('orderContext', new OrderContext())
}