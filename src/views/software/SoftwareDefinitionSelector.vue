<script setup>
import StratoPagingSelector from '@/components/StratoPagingSelector.vue'
import {describeSoftwareDefinitions} from '@/api/softwareDefinition.js'
import {ref} from 'vue'

const softwareDefinitionId = ref()
</script>

<template>
	<StratoPagingSelector
		v-model="softwareDefinitionId"
		:label-getter="item=>item.name"
		:remote-method="describeSoftwareDefinitions" />
</template>

<style scoped>

</style>