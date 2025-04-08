<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {createJob} from '@/api/job.js'
import {useActiveJobStore} from '@/stores/activeJob.js'
import UpdateUserGroupForm from '@/views/usergroup/UpdateUserGroupForm.vue'
import DeleteUserGroupsForm from '@/views/usergroup/DeleteUserGroupsForm.vue'

const activeJobStore = useActiveJobStore()

const props = defineProps({
	selectedGroups: {
		type: Array,
		required: true
	}
})

const drawerFlag = ref(false)

const drawerLoading = ref(false)

function openDrawer(){
	if(props.selectedGroups.length === 0){
		return
	}
	formData.value.userGroupIds = props.selectedGroups.map(g=>g.id)
	drawerFlag.value = true
}

const formData = ref({})

const formRef = ref()

const emits = defineEmits(['confirm'])

function confirmDelete(){
	formRef.value.validate(valid=>{
		if(!valid) return
		drawerLoading.value = true
		createJob({
			jobType: 'DELETE_USER_GROUPS',
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
	<StratoButton :disabled="selectedGroups.length===0" plain type="danger" @click="openDrawer">删除</StratoButton>
	<Teleport to="body">
		<StratoDrawer
			v-model="drawerFlag"
			title="删除用户组"
			@onConfirm="confirmDelete"
			:loading="drawerLoading"
			size="600"
		>
			<DeleteUserGroupsForm v-if="drawerFlag" ref="formRef" v-model="formData" />
		</StratoDrawer>
	</Teleport>
</template>

<style scoped>

</style>
