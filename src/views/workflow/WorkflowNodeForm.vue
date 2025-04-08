<script setup>

import {ref} from 'vue'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'

const formData = defineModel()

const formRef = ref()



</script>

<template>
	<ElForm size="small" ref="formRef" :model="formData" label-position="top">
		<ElFormItem label="节点类型">
			<ElInput disabled v-model="formData.nodeType" />
		</ElFormItem>
		<ElFormItem label="节点类型名称">
			<ElInput disabled v-model="formData.nodeTypeName" />
		</ElFormItem>
		<ElFormItem label="节点标识">
			<ElInput disabled v-model="formData.nodeKey" />
		</ElFormItem>
		<ElFormItem label="节点名称">
			<ElInput v-model="formData.nodeName" />
		</ElFormItem>
		<StratoDynamicForm
			v-if="formData.nodePropertiesFormMetaData"
			size="small"
			:form-meta-data="formData.nodePropertiesFormMetaData"
			v-model="formData.nodeProperties"
		/>
	</ElForm>
</template>

<style scoped>

</style>