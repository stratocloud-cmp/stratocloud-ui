<script setup>

import {ref} from 'vue'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'
import RelationshipTypeSelector from '@/views/resource/components/RelationshipTypeSelector.vue'
import {describeRelationshipForm} from '@/api/resource.js'

const formData = defineModel()

const formRef = ref()

const formMetadata = ref()
function onChange(rel){
	if(!rel) return
	formData.value.connectActionName = rel.connectActionName
	describeRelationshipForm({
		relationshipTypeId: rel.relationshipTypeId,
	}).then(resp => {
		formMetadata.value = resp.formMetaData
	})
}

</script>

<template>
	<ElForm size="small" ref="formRef" :model="formData" label-position="top">
		<ElFormItem label="关系类型">
			<RelationshipTypeSelector
				@change="onChange"
				:source-type-id="formData.sourceTypeId"
				:target-type-id="formData.targetTypeId"
				v-model="formData.relationshipTypeId"
			/>
		</ElFormItem>
		<StratoDynamicForm
			v-if="formMetadata"
			v-show="false"
			size="small"
			:form-meta-data="formMetadata"
			v-model="formData.relationshipInput"
		/>
	</ElForm>
</template>

<style scoped>

</style>