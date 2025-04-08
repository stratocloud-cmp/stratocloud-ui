<script setup>
import StratoButton from '@/components/StratoButton.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import RecycleStacksForm from '@/views/stack/actions/RecycleStacksForm.vue'
import {ref} from 'vue'
import {runAsyncJob} from '@/api/asyncJob.js'
import {useActiveJobStore} from '@/stores/activeJob.js'

const props = defineProps({
	selectedStacks: {
		type: Array,
		required: true
	},
	size: {
		required: false
	}
})

const activeJobStore = useActiveJobStore()

const recycleFormRef = ref()
const recycleDrawerLoading = ref(false)
const recycleDrawerFlag = ref(false)
const recycleFormData = ref({
	stacks: []
})
function onOpenRecycleDrawer(){
	recycleFormData.value.stacks = props.selectedStacks.map(stack => {
		return {
			stackId: stack.id,
			executingDestruction: true
		}
	})
	recycleDrawerFlag.value = true
}
function recycleStacks(){
	recycleFormRef.value.validate(valid=>{
		if(!valid) return
		recycleDrawerLoading.value = true
		runAsyncJob({
			jobType: 'RECYCLE_RESOURCE_STACKS',
			jobParameters: recycleFormData.value
		}).then(resp=>{
			activeJobStore.setActiveJobId(resp.jobId)
			recycleDrawerFlag.value = false
			emits('confirm')
		}).finally(()=>{
			recycleDrawerLoading.value = false
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
		type="warning"
		@click="onOpenRecycleDrawer">回收</StratoButton>
	<teleport to="body">
		<StratoDrawer
			:loading="recycleDrawerLoading"
			v-model="recycleDrawerFlag"
			title="回收资源栈"
			@on-confirm="recycleStacks">
			<RecycleStacksForm v-if="recycleDrawerFlag" ref="recycleFormRef" v-model="recycleFormData" />
		</StratoDrawer>
	</teleport>
</template>

<style scoped>

</style>