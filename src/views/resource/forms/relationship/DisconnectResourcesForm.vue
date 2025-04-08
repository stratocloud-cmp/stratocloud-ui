<script setup>
import { ElForm, ElFormItem } from 'element-plus';
import { ref } from 'vue';
import RelationshipSelector from '@/views/resource/components/RelationshipSelector.vue'

const formData = defineModel()

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	relationshipIds: [{required: true, message: '请选择资源关系'}],
})


</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="解除关系" prop="relationshipIds">
			<RelationshipSelector v-model="formData.relationshipIds" />
		</ElFormItem>
	</ElForm>
</template>