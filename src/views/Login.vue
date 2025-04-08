<template>
    <div class="login-page">
        <div class="login-form-area">
            <div class="content">
                <div style="display: flex; justify-content: center;">
                    <img alt="StratoCloud" src="/svg/StratoCloud.svg" />
                </div>
                <ElForm style="margin-top: 10px;" :model="loginForm" label-position="top" :disabled="loading">
                    <ElFormItem>
                        <template #label><span style="color: white;">用户名</span></template>
                        <ElInput :spellcheck="false" v-model="loginForm.username" />
                    </ElFormItem>
                    <ElFormItem>
                        <template #label><span style="color: white;">密码</span></template>
                        <ElInput :spellcheck="false" @keyup.enter="onLogin" type="password" autocomplete="new-password" show-password v-model="loginForm.password" />
                    </ElFormItem>
                    <ElFormItem>
                        <StratoButton :loading="loading" type="primary" @click="onLogin">登录</StratoButton>
                    </ElFormItem>
                </ElForm>
            </div>
            
        </div>
    </div>

    
</template>
<script setup>
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus';
import { ref } from 'vue';
import { login } from '@/api/login'
import { getMd5 } from '@/utils/md5'
import { useSessionStore } from '@/stores/session'
import StratoButton from '@/components/StratoButton.vue';
import {useActiveMenuStore} from '@/stores/activeMenu.js'
import {useRouter} from 'vue-router'

const router = useRouter()

const loginForm = ref({
    username: undefined,
    password: undefined
})

const loading = ref(false)

const sessionStore = useSessionStore()

const activeMenuStore = useActiveMenuStore()

function onLogin(){
    loading.value = true;

    const request = {
        loginName: loginForm.value.username,
        password: getMd5(loginForm.value.password)
    }


    login(request).then(resp => {
        loading.value = false

        const session = resp.userSession
        sessionStore.setSession(session)
	    if(activeMenuStore.activeMenu){
		    router.push(activeMenuStore.activeMenu.path)
	    }else {
		    router.push('/')
	    }

    }).catch(err => {
        loading.value = false
    })
}


</script>

<style lang="scss" scoped>
.login-page{
    height: 100%; 
    justify-content: center; 
    display: flex; 
    align-items: center;
    background: linear-gradient(to top, #23008b 0%, #610099 100%);
}
.login-form-area{
    width: 350px;
    background-color: rgb(26, 26, 42); 
    border-radius: 2px;
    box-shadow: 0 1px 4px 1px rgba(7,7,14,.2);
    font-weight: 600;
    font-size: large;

    .content{
        padding: 20px;
        
    }
    .el-button{
        width: 100%;
        margin-top: 10px;
    }
}

.form-item{
    .el-form-item__label{
        color: aliceblue;
    }
}

</style>