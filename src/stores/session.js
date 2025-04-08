import { defineStore } from "pinia"



export const useSessionStore = defineStore('stratoSession', {
    state: () => ({
      session: undefined,
    }),
    actions: {
      setSession(session){
        this.session = session
      },

      hasPermission(target, action){
        if(!this.session){
          return false
        }
        if(this.session.roleType === 'SUPER_ADMIN' || this.session.roleType === 'TENANT_SUPER_ADMIN'){
          return true
        }
        return this.session.permissions[target]?.includes(action);
      }
    },
    getters: {
        tenantId: (state, id) => state.session?.tenantId,
        userId: (state, id) => state.session?.userId,

        isNormalUser: (state, id) => state.session?.roleType === 'NORMAL_USER',
        isSuperAdmin: (state, id) =>
            state.session?.roleType === 'SUPER_ADMIN' || state.session?.roleType === 'TENANT_SUPER_ADMIN',
    },
    persist: {
      storage: localStorage,
      paths: ['session']
    }
})