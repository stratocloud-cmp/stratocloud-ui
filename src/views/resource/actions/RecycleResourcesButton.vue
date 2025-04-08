<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {useResourceButtonCommon} from '@/views/resource/composables/ResourceButtonCommon.js'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import RecycleResourcesForm from '@/views/resource/forms/recycle/RecycleResourcesForm.vue'
import DestroyResourcesRefundInquiry from '@/views/resource/forms/recycle/DestroyResourcesRefundInquiry.vue'

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
	destroyable: {
		required: false,
		type: Boolean,
		default: false
	},
	recycleBinMode: {
		required: false,
		type: Boolean,
		default: false
	},
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
		jobType: 'BATCH_RECYCLE_RESOURCES',
		jobParameters: {
			resources: formData.value
		}
	}
}

function openRecycleDrawer(){
	formData.value = []
	for(let r of props.selectedResources){
		formData.value.push({
			resourceId: r.id,
			recyclingCapabilities: true,
			executingDestruction: true,
			destroyParameters: {}
		})
	}
	openDrawer()
}


</script>

<template>
	<StratoButton
		:size="small?'small':'default'"
		:loading="buttonLoading"
		@click="openRecycleDrawer"
		:disabled="selectedResources.length === 0"
		type="warning"
		plain>
		<span :style="small?{fontSize: '12px'}:{}">
			{{recycleBinMode ? '销毁' : '回收'}}
		</span>
	</StratoButton>
	<StratoDrawer
		v-model="drawerFlag"
		:size="800"
		title="回收资源"
		@on-confirm="confirm"
		:loading="buttonLoading"
	>
		<RecycleResourcesForm
			v-if="drawerFlag"
			ref="formRef"
			v-model="formData"
			:destroyable="destroyable"
			:resource-category="category" />

		<template #footer v-if="drawerFlag">
			<DestroyResourcesRefundInquiry :form-data="formData" />
		</template>
	</StratoDrawer>
</template>

<style scoped>

</style>