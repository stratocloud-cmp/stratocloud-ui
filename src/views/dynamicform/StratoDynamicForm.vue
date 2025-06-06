<script setup>
import DynamicFormInput from '@/views/dynamicform/DynamicFormInput.vue'
import {ref} from 'vue'
import DynamicFormSelect from '@/views/dynamicform/DynamicFormSelect.vue'
import {useDynamicFormContextProvider} from '@/views/dynamicform/DynamicFormUtil.js'
import DynamicFormNumber from '@/views/dynamicform/DynamicFormNumber.vue'
import DynamicFormBoolean from '@/views/dynamicform/DynamicFormBoolean.vue'
import DynamicFormIp from '@/views/dynamicform/DynamicFormIp.vue'
import DynamicFormCodeBlock from '@/views/dynamicform/DynamicFormCodeBlock.vue'

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
	}
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
}



</script>

<template>
	<ElForm :size="size" ref="formRef" :model="formData" label-position="top" hide-required-asterisk>
		<template v-for="fieldInfo in formMetaData.fieldInfoList">
			<component
				v-model="formData[fieldInfo.key]"
				:is="getFormItemComponent(fieldInfo.type)"
				:field-info="fieldInfo" />
		</template>
	</ElForm>
</template>

<style scoped>

</style>
