import {inject, onUnmounted, provide, ref, toValue, watchEffect} from 'vue'


class AccountContext{
    constructor(){
        this.accountId = ref()
        this.clearAccountIdvalidators = []
    }

    setAccountId(accountId){
        this.accountId.value = accountId
    }

    clearAccountId(ignoredValidator){
        for (let validator of this.clearAccountIdvalidators){
            if(validator === ignoredValidator){
                continue
            }
            if(!validator()){
                return
            }
        }
        this.accountId.value = undefined
    }

    registerClearAccountIdValidator(validator){
        this.clearAccountIdvalidators.push(validator)
    }

    unregisterValidator(validator){
        const index = this.clearAccountIdvalidators.indexOf(validator)

        if(index >=0){
            this.clearAccountIdvalidators.splice(index, 1)
        }
    }
}

export function useAccountContextProvider(){
    const accountContext = new AccountContext()
    provide('accountContext', accountContext)
    return accountContext
}

export function useAccountContext(accountIdRef){
    const accountContext = inject('accountContext', new AccountContext())

    accountContext.registerClearAccountIdValidator(canBeClear)

    function canBeClear(){
        return !toValue(accountIdRef)
    }

    watchEffect(()=>{
        const accountId = toValue(accountIdRef)
        if(accountId){
            accountContext.setAccountId(accountId)
        }else {
            accountContext.clearAccountId(canBeClear)
        }
    })

    onUnmounted(()=>{
        accountContext.unregisterValidator(canBeClear)
    })

    return accountContext
}