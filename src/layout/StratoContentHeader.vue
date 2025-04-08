<script setup>
import { useActiveMenuStore } from '@/stores/activeMenu'

const activeMenuStore = useActiveMenuStore()
</script>
<template>
    <span style="font-size: 24px;">{{ activeMenuStore.activeMenu?.menuName }}</span>    
</template>