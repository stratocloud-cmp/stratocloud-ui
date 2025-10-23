
<template>
    <ElContainer :class="isDark ? 'strato-main-container-dark' : 'strato-main-container-light'">
        <ElHeader style="padding: 0;">
            <StratoHeader />
        </ElHeader>
        <ElContainer style="height: 100%;">
            <ElAside style="width: 240px; height: 100%; scrollbar-width: thin;margin-top: 2px">
                <StratoMenu />
            </ElAside>
	        <ElContainer :class="isDark ? 'strato-content-dark' : 'strato-content-light'">
		        <ElHeader style="display: flex; align-items: center;">
			        <StratoContentHeader />
		        </ElHeader>
		        <ElMain>
			        <RouterView :key="router.currentRoute.value.fullPath" />
		        </ElMain>
	        </ElContainer>
        </ElContainer>
    </ElContainer>
</template>
<script setup>
import {RouterView, useRouter} from 'vue-router';
import StratoContentHeader from './StratoContentHeader.vue';
import StratoHeader from './StratoHeader.vue';
import StratoMenu from './StratoMenu.vue';
import { ElAside, ElContainer, ElHeader, ElMain } from 'element-plus';

import { useSessionStore } from '@/stores/session'
import {useDark} from '@vueuse/core'

const router = useRouter()

if (!useSessionStore().session){
    router.push('/login')
}

const isDark = useDark()

</script>
<style>
body{
	overflow: hidden;
}

.strato-content-dark {
	height: 100%;
	margin-right: 16px;
	border-radius: 6px;
	background-color: rgb(28, 28, 28);
	margin-top: 2px;
	box-shadow: 1px 1px 1px 1px rgb(28, 28, 28);
}

.strato-content-light {
	height: 100%;
	margin-right: 16px;
	border-radius: 6px;
	margin-top: 2px;
	border: 1px solid #ededed;
	background-color: #fdfdfd;
	box-shadow: 1px 1px 1px 1px #ededed;
}

.strato-main-container-dark {
	height: 100%;
	overflow: hidden;
	background-image: linear-gradient(-45deg, #150055 0%, #006b99 100%);
}

.strato-main-container-light {
	height: 100%;
	overflow: hidden;
}
</style>
