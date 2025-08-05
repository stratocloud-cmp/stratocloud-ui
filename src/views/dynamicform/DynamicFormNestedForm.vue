<script setup>
import {computed, onMounted, ref} from 'vue'
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

const isConditionsMatched = computed(
	() => dynamicFormContext.isConditionsMatched(props.fieldInfo.detail.conditions)
)

function triggerAddNewNestedForm(){
	model.value.push({})
}

function triggerRemoveNestedForm(formData){
	model.value.splice(model.value.indexOf(formData), 1)
}

const nestedFormRefs = ref([])

const nestedFormRef = ref()

const rules = ref([
	{
		validator: getNestedFormValidator(),
		trigger: ['change'],
	}
])

function getNestedFormValidator(){
	return (_rule, _value, callback)=>{
		validateForms(
			props.fieldInfo.detail?.multiple ? nestedFormRefs.value : [nestedFormRef.value],
			(valid, _fields) => {
				if(valid)
					callback()
				else
					callback(new Error(props.fieldInfo.label+'校验失败'))
			}
		)
	}
}

</script>

<template>
	<div v-if="isConditionsMatched">
		<ElFormItem :prop="fieldInfo.key" :label="fieldInfo.label" :rules="rules">
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
		</ElFormItem>
		<div v-if="fieldInfo.detail?.multiple" style="width: 100%;">
			<ElButton
				type="primary"
				link
				icon="Plus"
				@click="triggerAddNewNestedForm"
				style="margin-bottom: 18px;"
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
				ref="nestedFormRef"
				:form-meta-data="fieldInfo.detail?.nestedFormMetadata"
				v-model="model"
			/>
		</div>
	</div>

</template>

<style scoped>

</style>
