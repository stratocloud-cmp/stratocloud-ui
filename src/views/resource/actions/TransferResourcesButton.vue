<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import TransferResourcesForm from '@/views/resource/forms/ownership/TransferResourcesForm.vue'
import {useActiveJobStore} from '@/stores/activeJob.js'
import {createJob} from '@/api/job.js'

const props = defineProps({
	small: {
		required: false,
		type: Boolean,
		default: false
	},
	selectedResources: {
		required: true,
		type: Array
	},
	category: {
		required: true
	},
})

const emits = defineEmits(['actionSubmitted'])

function emitsActionSubmitted(){
	emits('actionSubmitted')
}

const formData = ref([])


const drawerFlag = ref(false)
const buttonLoading = ref(false)
const formRef = ref()

const activeJobStore = useActiveJobStore()

function openTransferDrawer(){
	formData.value = props.selectedResources.map(r=>{
		return {
			resourceId: r.id,
			newOwnerId: r.ownerId,
			newTenantId: r.tenantId,
			enableCascadedTransfer: true
		}
	})
	drawerFlag.value = true
}

function confirmTransfer(){
	formRef.value.validate(valid=>{
		if (!valid) return
		buttonLoading.value = true
		createJob({
			jobType: 'TRANSFER_RESOURCES',
			jobParameters: {
				transfers: formData.value
			}
		}).then(resp=>{
			drawerFlag.value = false
			activeJobStore.setActiveJobId(resp.jobId)
			emitsActionSubmitted()
		}).finally(() => {
			buttonLoading.value = false
		})
	})
}


</script>

<template>
	<StratoButton
		:size="small?'small':'default'"
		:loading="buttonLoading"
		@click="openTransferDrawer"
		:disabled="selectedResources.length === 0"
		plain>
		<span :style="small?{fontSize: '12px'}:{}">移交</span>
	</StratoButton>
	<StratoDrawer
		v-model="drawerFlag"
		:size="800"
		title="移交资源"
		@on-confirm="confirmTransfer"
		:loading="buttonLoading"
	>
		<TransferResourcesForm
			v-if="drawerFlag"
			ref="formRef"
			v-model="formData"
			:resource-category="category"
		/>
	</StratoDrawer>
</template>

<style scoped>

</style>