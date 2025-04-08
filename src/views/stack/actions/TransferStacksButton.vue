<script setup>
import StratoButton from '@/components/StratoButton.vue'
import TransferStacksForm from '@/views/stack/actions/TransferStacksForm.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {ref} from 'vue'
import {runAsyncJob} from '@/api/asyncJob.js'
import {useActiveJobStore} from '@/stores/activeJob.js'

const props = defineProps({
	selectedStacks: {
		type: Array,
		required: true
	},
	size: {
		required: false,
	}
})

const activeJobStore = useActiveJobStore()

const transferFormRef = ref()
const transferDrawerLoading = ref(false)
const transferDrawerFlag = ref(false)
const transferFormData = ref({
	transfers: []
})
function onOpenTransferDrawer(){
	transferFormData.value.transfers = props.selectedStacks.map(stack => {
		return {
			stackId: stack.id,
			newOwnerId: stack.ownerId,
			newTenantId: stack.tenantId
		}
	})
	transferDrawerFlag.value = true
}
function transferStacks(){
	transferFormRef.value.validate(valid=>{
		if(!valid) return
		transferDrawerLoading.value = true
		runAsyncJob({
			jobType: 'TRANSFER_STACKS',
			jobParameters: transferFormData.value
		}).then(resp=>{
			activeJobStore.setActiveJobId(resp.jobId)
			transferDrawerFlag.value = false
			emits('confirm')
		}).finally(()=>{
			transferDrawerLoading.value = false
		})
	})
}

const emits = defineEmits(['confirm'])
</script>

<template>
	<StratoButton
		:disabled="selectedStacks.length===0"
		:size="size"
		plain
		@click="onOpenTransferDrawer">移交</StratoButton>
	<teleport to="body">
		<StratoDrawer
			:size="600"
			:loading="transferDrawerLoading"
			v-model="transferDrawerFlag"
			title="移交资源栈"
			@on-confirm="transferStacks">
			<TransferStacksForm v-if="transferDrawerFlag" ref="transferFormRef" v-model="transferFormData" />
		</StratoDrawer>
	</teleport>
</template>

<style scoped>

</style>