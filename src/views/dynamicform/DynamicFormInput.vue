<script setup>
import {onMounted, ref} from 'vue'
import {QuestionFilled} from '@element-plus/icons-vue'
import {getValidatorByRegex} from '@/utils/regex.js'
import {useDynamicFormContext} from '@/views/dynamicform/DynamicFormUtil.js'

const model = defineModel()

const props = defineProps({
	fieldInfo: {
		required: true,
		default: {
			type: undefined,
			key: undefined,
			label: undefined,
			description: undefined,
			detail: {
				defaultValue: undefined,
				required: undefined,
				conditions: [],
				regex: undefined,
				regexMessage: undefined,
			},
		}
	}
})

const rules = ref([])

onMounted(()=>{
	if(props.fieldInfo.detail?.defaultValue && !model.value){
		model.value = props.fieldInfo.detail.defaultValue
	}

	if(props.fieldInfo.detail?.required){
		rules.value.push({required: true, message: '请输入'+props.fieldInfo.label})
	}

	if(props.fieldInfo.detail?.regex){
		rules.value.push({
			validator: getValidatorByRegex(props.fieldInfo.detail.regex, props.fieldInfo.detail.regexMessage),
			trigger: ['blur', 'change'],
		})
	}
})

const dynamicFormContext = useDynamicFormContext()

function isConditionsMatched(){
	return dynamicFormContext.isConditionsMatched(props.fieldInfo.detail.conditions)
}

</script>

<template>
	<ElFormItem v-if="isConditionsMatched()" :prop="fieldInfo.key" :label="fieldInfo.label" :rules="rules">
		<template #label>
			<span>
				{{fieldInfo.label}}
				<ElTooltip v-if="fieldInfo.description">
					<template #content>
						<div style="white-space: pre-wrap" v-html="fieldInfo.description"></div>
					</template>
					<ElIcon style="cursor: pointer;">
						<QuestionFilled />
					</ElIcon>
				</ElTooltip>
			</span>
		</template>
		<ElInput
			:type="fieldInfo.detail?.inputType"
			:show-password="fieldInfo.detail?.inputType==='password'"
			:autocomplete="fieldInfo.detail?.inputType==='password'?'new-password':'off'"
			v-model="model" />
	</ElFormItem>
</template>

<style scoped>

</style>