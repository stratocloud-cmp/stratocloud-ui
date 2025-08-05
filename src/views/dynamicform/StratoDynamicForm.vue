<script setup>
import DynamicFormInput from '@/views/dynamicform/DynamicFormInput.vue'
import {ref} from 'vue'
import DynamicFormSelect from '@/views/dynamicform/DynamicFormSelect.vue'
import {useDynamicFormContextProvider} from '@/views/dynamicform/DynamicFormUtil.js'
import DynamicFormNumber from '@/views/dynamicform/DynamicFormNumber.vue'
import DynamicFormBoolean from '@/views/dynamicform/DynamicFormBoolean.vue'
import DynamicFormIp from '@/views/dynamicform/DynamicFormIp.vue'
import DynamicFormCodeBlock from '@/views/dynamicform/DynamicFormCodeBlock.vue'
import DynamicFormNestedForm from '@/views/dynamicform/DynamicFormNestedForm.vue'
import DynamicFormDateTime from '@/views/dynamicform/DynamicFormDateTime.vue'

const props = defineProps({
	formMetaData: {
		required: true,
		default: {
			formClass: undefined,
			fieldInfoList: []
		}
	},
	size: {
		required: false,
		default: 'default',
		options: ['small', 'default', 'large', ''],
	},
	args: {
		required: false,
		default: {}
	},
})




const formRef = ref()
defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const formData = defineModel({
	required: true,
})

function getFormItemComponent(type){
	switch (type) {
		case 'InputField': return DynamicFormInput
		case 'SelectField': return DynamicFormSelect
		case 'NumberField': return DynamicFormNumber
		case 'BooleanField': return DynamicFormBoolean
		case 'IpField': return DynamicFormIp
		case 'CodeBlockField': return DynamicFormCodeBlock
		case 'NestedFormField': return DynamicFormNestedForm
		case 'DateTimeField': return DynamicFormDateTime
	}

	return undefined
}

const dynamicFormContext = useDynamicFormContextProvider(formData)

dynamicFormContext.setArgs(props.args)

for (let fieldInfo of props.formMetaData.fieldInfoList) {
	if(fieldInfo.type === 'SelectField' && fieldInfo.detail && fieldInfo.detail.entityType==='SCRIPT_DEFINITION'){
		if(!formData.value[fieldInfo.key]){
			formData.value[fieldInfo.key] = {
				customFormData: {}
			}
		}
	}

	if(fieldInfo.type === 'NestedFormField' && fieldInfo.detail){
		if(!formData.value[fieldInfo.key]){
			if(fieldInfo.detail.defaultValues && fieldInfo.detail.defaultValues.length>0){
				if(fieldInfo.detail.multiple){
					formData.value[fieldInfo.key] = fieldInfo.detail.defaultValues
				} else {
					formData.value[fieldInfo.key] = fieldInfo.detail.defaultValues[0]
				}
			} else {
				if(fieldInfo.detail.multiple){
					formData.value[fieldInfo.key] = []
				} else {
					formData.value[fieldInfo.key] = {}
				}
			}
		}
	}
}



</script>

<template>
	<ElForm :size="size" ref="formRef" :model="formData" label-position="top" hide-required-asterisk>
		<template v-for="fieldInfo in formMetaData.fieldInfoList">
			<component
				style="margin-bottom: 12px"
				v-model="formData[fieldInfo.key]"
				:is="getFormItemComponent(fieldInfo.type)"
				:field-info="fieldInfo" />
		</template>
	</ElForm>
</template>

<style scoped>

</style>
