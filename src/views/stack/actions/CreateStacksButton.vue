<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import {runAsyncJob} from '@/api/asyncJob.js'
import CreateStacksForm from '@/views/stack/actions/CreateStacksForm.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {useActiveJobStore} from '@/stores/activeJob.js'

const activeJobStore = useActiveJobStore()

const createDrawerFlag = ref(false)
const createFormRef = ref()
const createDrawerLoading = ref(false)
const createFormData = ref({
	tenantId: undefined,
	ownerId: undefined,

	blueprintId: undefined,

	name: undefined,
	description: undefined,

	expireTime: undefined,
	number: 1,

	nodes: [],
	tags: []
})
function onOpenCreateDrawer(){
	createDrawerFlag.value = true
}
function createStacks(){
	createFormRef.value.validate((valid)=>{
		if(!valid) return
		createDrawerLoading.value = true
		runAsyncJob({
			jobType: 'CREATE_RESOURCE_STACKS',
			jobParameters: createFormData.value
		}).then(resp=>{
			activeJobStore.setActiveJobId(resp.jobId)
			createDrawerFlag.value = false
			emits('confirm')
		}).finally(()=>{
			createDrawerLoading.value = false
		})
	})
}


const emits = defineEmits(['confirm'])


</script>

<template>
	<StratoButton type="primary" @click="onOpenCreateDrawer">创建</StratoButton>
	<StratoDrawer
		:loading="createDrawerLoading"
		v-model="createDrawerFlag"
		title="创建资源栈"
		:size="1000"
		@on-confirm="createStacks">
		<CreateStacksForm v-if="createDrawerFlag" ref="createFormRef" v-model="createFormData" />
	</StratoDrawer>
</template>

<style scoped>

</style>