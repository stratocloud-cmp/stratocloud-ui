<script setup>

import ScriptDefinitionSelector from '@/views/script/ScriptDefinitionSelector.vue'
import {onMounted, ref} from 'vue'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'

const wrappedInput = defineModel()

const customFormMetaData = ref()

function handleChange(selectedDefinition){
	if(selectedDefinition){
		if(selectedDefinition.remoteScriptDef){
			customFormMetaData.value = selectedDefinition.remoteScriptDef.customFormMetaData
		}
	}
}

onMounted(() => {
	console.log(wrappedInput.value)
})

</script>

<template>
	<div style="width: 100%">
		<template v-if="wrappedInput">
			<ScriptDefinitionSelector @change="handleChange" v-model="wrappedInput.scriptDefinitionId" />
			<StratoDynamicForm
				style="margin-top: 12px"
				v-if="customFormMetaData && wrappedInput.customFormData"
				:form-meta-data="customFormMetaData"
				v-model="wrappedInput.customFormData"
			/>
		</template>
	</div>
</template>

<style scoped>

</style>