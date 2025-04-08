<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {createJob} from '@/api/job.js'
import {useActiveJobStore} from '@/stores/activeJob.js'
import User from '@/views/user/User.vue'
import InviteUserForm from '@/views/usergroup/InviteUserForm.vue'

const activeJobStore = useActiveJobStore()

const props = defineProps({
	selectedGroups: {
		type: Array,
		required: true
	}
})

const drawerFlag = ref(false)

const selectedGroup = ref()

const tableRef = ref()

function openDrawer(){
	if(props.selectedGroups.length === 0){
		return
	}
	selectedGroup.value = props.selectedGroups[0]
	drawerFlag.value = true
}



const selectedUsers = ref([])
function onSelectChange(selectedRows){
	selectedUsers.value = selectedRows
}

function removeMembers(){
	createJob({
		jobType: 'REMOVE_USERS_FROM_GROUP',
		jobParameters: {
			userGroupId: selectedGroup.value.id,
			userIds: selectedUsers.value.map(user=>user.id)
		}
	}).then(resp=>{
		activeJobStore.setActiveJobId(resp.jobId)
		tableRef.value.fetchData()
	})
}

const inviteFormData = ref({
	userGroupId: undefined,
	userIds: []
})
const inviteFormRef = ref()
const inviteDrawerFlag = ref(false)
function openInviteDrawer(){
	inviteFormData.value.userGroupId = selectedGroup.value.id
	inviteDrawerFlag.value = true
}
function confirmInvite(){
	inviteFormRef.value.validate(valid=>{
		if(!valid) return
		createJob({
			jobType: 'INVITE_USERS_TO_GROUP',
			jobParameters: inviteFormData.value
		}).then(resp=>{
			inviteDrawerFlag.value = false
			activeJobStore.setActiveJobId(resp.jobId)
			tableRef.value.fetchData()
		})
	})
}
</script>

<template>
	<ElButton
		type="primary"
		@click="openDrawer"
		link
	>成员管理</ElButton>
	<Teleport to="body">
		<StratoDrawer :size="800" v-model="drawerFlag" title="成员管理" no-confirm>
			<User
				v-if="drawerFlag"
				simple-mode
				:user-group-ids="[selectedGroup.id]"
				@change="onSelectChange"
				ref="tableRef"
			>
				<template #buttons>
					<StratoButton
						size="small"
						type="success"
						plain
						@click="openInviteDrawer"
					>
						<span style="font-size:12px">邀请新成员</span>
					</StratoButton>
					<StratoButton
						size="small"
						type="danger"
						plain
						:disabled="selectedUsers.length===0"
						@click="removeMembers"
					>
						<span style="font-size:12px">移除成员</span>
					</StratoButton>
				</template>
			</User>
		</StratoDrawer>

		<StratoDrawer v-model="inviteDrawerFlag" title="邀请新成员" @on-confirm="confirmInvite">
			<InviteUserForm ref="inviteFormRef" v-model="inviteFormData" />
		</StratoDrawer>
	</Teleport>
</template>

<style scoped>

</style>
