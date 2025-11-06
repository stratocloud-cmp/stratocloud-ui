<script setup>
import {computed, ref, shallowRef, watch} from 'vue'
import {QuestionFilled} from '@element-plus/icons-vue'
import {getSelectorComponentByEntityType, useDynamicFormContext} from '@/views/dynamicform/DynamicFormUtil.js'

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
				multiSelect: false,
				defaultValues: [],
				options: [],
				optionNames: [],
				source: undefined,
				entityType: undefined,
				dependsOn: [],
				required: true,
				conditions: [],
				type: undefined,
				properties: [],
				filterPredicates: []
			},
		}
	}
})

const rules = ref([])

const entitySelector = shallowRef()

watch(props, ()=>{
	if(props.fieldInfo.detail?.defaultValues && props.fieldInfo.detail.defaultValues.length>0 && !model.value){
		if(props.fieldInfo.detail.multiSelect){
			model.value = props.fieldInfo.detail.defaultValues
		}else {
			model.value = props.fieldInfo.detail.defaultValues[0]
		}
	}

	if(props.fieldInfo.detail?.required){
		rules.value.push({required: true, message: '请选择'+props.fieldInfo.label})
	}

	if(props.fieldInfo.detail.source === 'ENTITY'){
		entitySelector.value = getSelectorComponentByEntityType(props.fieldInfo.detail.entityType)
	}
}, {immediate: true})

const dynamicFormContext = useDynamicFormContext()

const isConditionsMatched = computed(
	() => dynamicFormContext.isConditionsMatched(props.fieldInfo.detail.conditions)
)

const optionElements = computed(() => {
	const elements = []
	for (let i = 0; i < props.fieldInfo.detail.options.length; i++) {
		const element = {
			optionValue: props.fieldInfo.detail.options[i],
			optionName: props.fieldInfo.detail.optionNames[i]
		}

		if(props.fieldInfo.detail.properties && props.fieldInfo.detail.properties.length>0){
			for (let property of props.fieldInfo.detail.properties) {
				element[property.name] = property.values[i]
			}
		}

		elements.push(element)
	}
	return elements
})

const filteredElements = computed(() => {
	let elements = optionElements.value
	if(props.fieldInfo.detail.filterPredicates && props.fieldInfo.detail.filterPredicates.length>0){
		props.fieldInfo.detail.filterPredicates.forEach(predicate => {
			try {
				const predicateFunction = new Function('formData', 'element', 'return '+predicate)
				elements = elements.filter(
					element => predicateFunction(dynamicFormContext.formDataRef.value, element)
				)
			}catch (e) {
				console.error(e)
			}
		})
	}
	return elements
})

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
		<ElSelect
			v-if="fieldInfo.detail.source === 'STATIC'"
			v-model="model"
			filterable
			:multiple="fieldInfo.detail.multiSelect"
			:allow-create="fieldInfo.detail.allowCreate"
			:placeholder="fieldInfo.detail.placeholder ? fieldInfo.detail.placeholder : ('请选择'+fieldInfo.label)"
		>
			<ElOption
				v-for="item in filteredElements"
				:key="item.optionValue"
				:value="item.optionValue"
				:label="item.optionName"
			/>
		</ElSelect>
		<component
			v-else-if="entitySelector"
			:is="entitySelector"
			v-model="model"
			:multiple="fieldInfo.detail.multiSelect"
			:placeholder="fieldInfo.detail.placeholder ? fieldInfo.detail.placeholder : ('请选择'+fieldInfo.label)"
		/>
		<div v-else>Unknown options source: {{fieldInfo.detail.source}}</div>
	</ElFormItem>
</template>

<style scoped>

</style>
