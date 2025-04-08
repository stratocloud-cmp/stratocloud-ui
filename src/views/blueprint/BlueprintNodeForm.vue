<script setup>

import {ref, watch} from 'vue'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'
import {describeResourceActionForm} from '@/api/resource.js'
import ResourceSelector from '@/views/resource/components/ResourceSelector.vue'

const formData = defineModel()

const formRef = ref()

const formMetadata = ref()

function retrieveFormMetadata() {
	if (formData.value?.borrowed) return

	if (!formData.value?.resourceTypeId) return

	describeResourceActionForm({
		resourceTypeId: formData.value.resourceTypeId,
		actionId: 'BUILD_RESOURCE'
	}).then(resp => {
		formMetadata.value = resp.formMetaData
	}).catch(() => {
		formData.value.borrowed = true
	})
}

watch(()=>formData.value?.resourceTypeId, retrieveFormMetadata, {immediate: true})
watch(()=>formData.value?.borrowed, retrieveFormMetadata)

</script>

<template>
	<ElForm size="small" ref="formRef" :model="formData" label-position="top">
		<ElFormItem label="资源类型">
			<ElInput disabled v-model="formData.resourceTypeName" />
		</ElFormItem>
		<ElFormItem label="节点标识">
			<ElInput disabled v-model="formData.nodeKey" />
		</ElFormItem>
		<ElFormItem label="节点名称">
			<ElInput v-model="formData.nodeName" />
		</ElFormItem>
		<ElFormItem label="使用已有资源">
			<ElSwitch v-model="formData.borrowed" />
		</ElFormItem>
		<ElFormItem label="已有资源" v-if="formData.borrowed">
			<ResourceSelector
				teleported
				:resource-type-id="formData.resourceTypeId"
				v-model="formData.borrowedResourceId"
			/>
		</ElFormItem>
		<StratoDynamicForm
			v-if="formMetadata && !formData.borrowed"
			size="small"
			:form-meta-data="formMetadata"
			v-model="formData.resourceProperties"
		/>
	</ElForm>
</template>

<style scoped>

</style>
