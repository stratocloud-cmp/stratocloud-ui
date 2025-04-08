<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {createJob} from '@/api/job.js'
import {useActiveJobStore} from '@/stores/activeJob.js'
import UpdateUserGroupForm from '@/views/usergroup/UpdateUserGroupForm.vue'

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
	formData.value.userGroupId = props.selectedGroups[0].id
	drawerFlag.value = true
}

const formData = ref({})

const formRef = ref()

const emits = defineEmits(['confirm'])

function confirmUpdate(){
	formRef.value.validate(valid=>{
		if(!valid) return
		drawerLoading.value = true
		createJob({
			jobType: 'UPDATE_USER_GROUP',
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
	<ElButton
		type="primary"
		link
		@click="openDrawer"
	>更新</ElButton>
	<Teleport to="body">
		<StratoDrawer
			v-model="drawerFlag"
			title="更新用户组"
			@onConfirm="confirmUpdate"
			:loading="drawerLoading"
			size="600"
		>
			<UpdateUserGroupForm v-if="drawerFlag" ref="formRef" v-model="formData" />
		</StratoDrawer>
	</Teleport>
</template>

<style scoped>

</style>
