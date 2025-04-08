<script setup>
import { ElForm, ElFormItem } from 'element-plus';
import { ref } from 'vue';
import ResourceSelector from '@/views/resource/components/ResourceSelector.vue'

const formData = defineModel()

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	resourceIds: [{required: true, message: '请选择资源'}],
})


</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="同步所有资源" prop="synchronizeAll">
			<ElSwitch v-model="formData.synchronizeAll" />
		</ElFormItem>
		<ElFormItem v-if="!formData.synchronizeAll" label="资源" prop="resourceIds">
			<ResourceSelector multiple v-model="formData.resourceIds" />
		</ElFormItem>

	</ElForm>
</template>