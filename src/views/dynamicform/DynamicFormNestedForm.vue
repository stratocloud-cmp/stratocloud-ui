<script setup>
import {onMounted, ref} from 'vue'
import {QuestionFilled} from '@element-plus/icons-vue'
import {useDynamicFormContext} from '@/views/dynamicform/DynamicFormUtil.js'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'
import {validateForms} from '@/utils/FormUtil.js'

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
				defaultValues: [],
				multiple: false,
				multipleMin: 0,
				multipleMax: 50,
				conditions: [],
				nestedFormMetadata: undefined,
			},
		}
	}
})

onMounted(()=>{

})

const dynamicFormContext = useDynamicFormContext()

function isConditionsMatched(){
	return dynamicFormContext.isConditionsMatched(props.fieldInfo.detail.conditions)
}

function triggerAddNewNestedForm(){
	model.value.push({})
}

function triggerRemoveNestedForm(formData){
	model.value.splice(model.value.indexOf(formData), 1)
}

const nestedFormRefs = ref([])

const rules = [
	{
		validator: getNestedFormValidator(),
		trigger: ['blur', 'change'],
	}
]

function getNestedFormValidator(){
	return (_rule, _value, callback)=>{
		validateForms(nestedFormRefs.value, callback)
	}
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

		<div v-if="fieldInfo.detail?.multiple" style="width: 100%;">
			<ElButton
				type="primary"
				link
				icon="Plus"
				@click="triggerAddNewNestedForm"
				style="margin-bottom: 18px;margin-top: 12px"
			>
				添加{{ fieldInfo.label }}
			</ElButton>
			<template v-for="(formData, index) in model">
				<ElCard style="margin-left: 24px;margin-bottom: 24px">
					<template #header>
						<ElButton
							circle
							link
							size="small"
							icon="Close"
							type="danger"
							@click="()=>triggerRemoveNestedForm(formData)"
						/>
						{{ fieldInfo.label+(index+1) }}
					</template>
					<template #default>
						<StratoDynamicForm
							ref="nestedFormRefs"
							:form-meta-data="fieldInfo.detail?.nestedFormMetadata"
							v-model="model[index]"
						/>
					</template>
				</ElCard>
			</template>
		</div>
		<div v-else>
			<StratoDynamicForm
				ref="nestedFormRefs"
				:form-meta-data="fieldInfo.detail?.nestedFormMetadata"
				v-model="model"
			/>
		</div>
	</ElFormItem>
</template>

<style scoped>

</style>
