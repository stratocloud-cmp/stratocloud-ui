<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import CreateUserGroupForm from '@/views/usergroup/CreateUserGroupForm.vue'
import {createJob} from '@/api/job.js'
import {useActiveJobStore} from '@/stores/activeJob.js'
import {cloneDeep} from 'lodash'

const activeJobStore = useActiveJobStore()

const drawerFlag = ref(false)

const drawerLoading = ref(false)

function openDrawer(){
	formData.value = cloneDeep(defaultFormData)
	drawerFlag.value = true
}

const defaultFormData = {
	tenantId: undefined,
	name: undefined,
	alias: undefined,
	description: undefined,
	tags: []
}

const formData = ref(cloneDeep(defaultFormData))

const formRef = ref()

const emits = defineEmits(['confirm'])

function confirmCreate(){
	formRef.value.validate(valid=>{
		if(!valid) return
		drawerLoading.value = true
		createJob({
			jobType: 'CREATE_USER_GROUP',
			jobParameters: formData.value
		}).then(resp=>{
			drawerFlag.value = false
			activeJobStore.setActiveJobId(resp.jobId)
			emits('confirm')
		}).finally(()=>{
			drawerLoading.value = false
		})
	})

}
</script>

<template>
	<StratoButton type="primary" @click="openDrawer">创建</StratoButton>
	<StratoDrawer
		v-model="drawerFlag"
		title="创建用户组"
		@onConfirm="confirmCreate"
		:loading="drawerLoading"
		size="600"
	>
		<CreateUserGroupForm v-if="drawerFlag" ref="formRef" v-model="formData" />
	</StratoDrawer>
</template>

<style scoped>

</style>