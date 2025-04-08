
<template>
    <ElContainer style="height: 100%; overflow: hidden; background-image: linear-gradient(-45deg, #150055 0%, #610099 100%);">
        <ElHeader style="padding: 0;">
            <StratoHeader />
        </ElHeader>
        <ElContainer style="height: 100%;">
            <ElAside style="width: 240px; height: 100%; scrollbar-width: thin;">
                <StratoMenu />
            </ElAside>
            <ElContainer style="height: 100%; margin-right: 16px; background-color: rgb(16, 16, 16);">
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

const router = useRouter()

if (!useSessionStore().session){
    router.push('/login')
}

</script>
<style>
body{
	overflow: hidden;
}
</style>
