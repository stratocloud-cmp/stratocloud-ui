<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {runAsyncJob} from '@/api/asyncJob.js'
import {ref} from 'vue'
import {useActiveJobStore} from '@/stores/activeJob.js'

const props = defineProps({
	selectedStacks: {
		type: Array,
		required: true
	},
	recycleBinMode: {
		type: Boolean,
		required: true
	}
})

const activeJobStore = useActiveJobStore()

const restoreButtonLoading = ref(false)

function restoreStacks(){
	restoreButtonLoading.value = true
	runAsyncJob({
		jobType: 'RESTORE_RESOURCE_STACKS',
		jobParameters: {
			stackIds: props.selectedStacks.map(stack=>stack.id)
		}
	}).then(resp=>{
		activeJobStore.setActiveJobId(resp.jobId)
		emits('confirm')
	}).finally(()=>{
		restoreButtonLoading.value = false
	})
}

const emits = defineEmits(['confirm'])
</script>

<template>
	<StratoButton
		v-if="recycleBinMode"
		:disabled="selectedStacks.length===0"
		:loading="restoreButtonLoading"
		plain
		type="success"
		@click="restoreStacks">还原</StratoButton>
</template>

<style scoped>

</style>