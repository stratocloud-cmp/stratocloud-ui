<script setup>
import StratoPagingSelector from '@/components/StratoPagingSelector.vue'
import {ref} from 'vue'
import {describeScriptDefinitions} from '@/api/scriptDefinition.js'

const scriptDefinitionId = ref()

const emits = defineEmits(['change'])

function handleChange(selectedItem){
	emits('change', selectedItem)
}
</script>

<template>
	<StratoPagingSelector
		v-model="scriptDefinitionId"
		:label-getter="item=>item.name"
		:remote-method="describeScriptDefinitions"
		@change="handleChange"
	/>
</template>

<style scoped>

</style>