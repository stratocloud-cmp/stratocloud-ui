<script setup>
import {computed, ref, watch} from 'vue'
import {QuestionFilled} from '@element-plus/icons-vue'
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
				defaultValues: [],
				allowFutureTime: false,
				isRange: false,
				dateOnly: false,
				timeOnly: false,
				required: true,
				conditions: []
			},
		}
	}
})

const rules = ref([])

watch(props, ()=>{
	if(props.fieldInfo.detail?.defaultValues && props.fieldInfo.detail.defaultValues.length>0 && !model.value){
		if(props.fieldInfo.detail.isRange){
			model.value = props.fieldInfo.detail.defaultValues
		}else {
			model.value = props.fieldInfo.detail.defaultValues[0]
		}
	}

	if(props.fieldInfo.detail?.required){
		rules.value.push({required: true, message: '请选择'+props.fieldInfo.label})
	}
}, {immediate: true})

const dynamicFormContext = useDynamicFormContext()

const isConditionsMatched = computed(
	() => dynamicFormContext.isConditionsMatched(props.fieldInfo.detail.conditions)
)

</script>

<template>
	<ElFormItem v-if="isConditionsMatched" :prop="fieldInfo.key" :label="fieldInfo.label" :rules="rules">
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
		<ElDatePicker
			v-if="fieldInfo.detail?.isRange && fieldInfo.detail?.dateOnly"
			type="daterange"
			v-model="model"
			value-format="YYYY-MM-DD HH:mm:ss"
			start-placeholder="起始时间"
			end-placeholder="结束时间"
		/>
		<ElTimePicker
			v-else-if="fieldInfo.detail?.timeOnly"
			:is-range="fieldInfo.detail?.isRange"
			v-model="model"
			value-format="HH:mm"
			format="HH:mm"
			start-placeholder="起始时间"
			end-placeholder="结束时间"
		/>
		<ElDatePicker
			v-else-if="fieldInfo.detail?.isRange && !fieldInfo.detail?.dateOnly"
			type="datetimerange"
			v-model="model"
			value-format="YYYY-MM-DD HH:mm:ss"
			start-placeholder="起始时间"
			end-placeholder="结束时间"
		/>
		<ElDatePicker
			v-else-if="!fieldInfo.detail?.dateOnly"
			type="datetime"
			v-model="model"
			value-format="YYYY-MM-DD HH:mm:ss"
		/>

		<ElDatePicker
			v-else
			type="date"
			v-model="model"
			value-format="YYYY-MM-DD HH:mm:ss"
		/>
	</ElFormItem>
</template>

<style scoped>

</style>
