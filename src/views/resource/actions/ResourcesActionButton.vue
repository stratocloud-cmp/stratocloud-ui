<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {useResourceButtonCommon} from '@/views/resource/composables/ResourceButtonCommon.js'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import RunResourcesActionForm from '@/views/resource/forms/action/RunResourcesActionForm.vue'
import RunActionsPriceInquiry from '@/views/resource/forms/action/RunActionsPriceInquiry.vue'
import AddToCartButton from '@/views/cart/AddToCartButton.vue'

const props = defineProps({
	small: {
		required: false,
		type: Boolean,
		default: false
	},
	category: {
		required: true
	},
	selectedResources: {
		required: true,
		type: Array
	},
	action: {
		required: true
	},
	disabled: {
		required: false,
		default: false,
		type: Boolean
	},
	disabledMessage: {
		required: false,
	},
	showButton:{
		required: false,
		default: true
	}
})

const emits = defineEmits(['actionSubmitted'])

function emitsActionSubmitted(){
	emits('actionSubmitted')
}

const formData = ref([])


const {
	drawerFlag,
	buttonLoading,
	formRef,
	openDrawer,
	confirm
} = useResourceButtonCommon(requestGetter, emitsActionSubmitted)

function requestGetter(){
	return {
		jobType: 'BATCH_RUN_RESOURCE_ACTIONS',
		jobParameters: {
			actions: formData.value
		}
	}
}

function openActionDrawer(){
	formData.value = []
	for(let r of props.selectedResources){
		formData.value.push({
			resourceId: r.id,
			actionId: props.action.id,
			parameters: {}
		})
	}
	openDrawer()
}

defineExpose({openActionDrawer})

const redActions = [
	'STOP', 'DESTROY_RESOURCE'
]

const greenActions = [
	'START'
]

function getButtonType(action){
	if(redActions.includes(action)){
		return 'danger'
	}

	if(greenActions.includes(action)){
		return 'success'
	}

	return undefined
}

function closeDrawer(){
	drawerFlag.value = false
}

</script>

<template>
	<template v-if="showButton">
		<StratoButton
			:size="small?'small':'default'"
			:loading="buttonLoading"
			@click="openActionDrawer"
			:disabled="disabled"
			:disabled-message="disabledMessage?disabledMessage:undefined"
			:type="getButtonType(action.id)"
			plain>
			<span :style="small?{fontSize: '12px'}:{}">{{action.name}}</span>
		</StratoButton>
	</template>

	<StratoDrawer
		v-model="drawerFlag"
		:size="800"
		:title="action.name"
		@on-confirm="confirm"
		:loading="buttonLoading"
	>
		<RunResourcesActionForm
			v-if="drawerFlag"
			ref="formRef"
			v-model="formData"
			:resource-category="category"
		/>

		<template #footer v-if="drawerFlag">
			<RunActionsPriceInquiry :form-data="formData" />
			<AddToCartButton
				style="margin-left: 36px"
				job-type="BATCH_RUN_RESOURCE_ACTIONS"
				:job-parameters="{actions: formData}"
				:form-ref="formRef"
				@confirm="closeDrawer"
			/>
		</template>
	</StratoDrawer>
</template>

<style scoped>

</style>