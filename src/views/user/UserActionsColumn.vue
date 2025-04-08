<script setup>
import UpdateUserForm from '@/views/user/UpdateUserForm.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import Role from '@/views/role/Role.vue'
import {ElSwitch, ElTableColumn} from 'element-plus'
import ChangePasswordForm from '@/views/user/ChangePasswordForm.vue'
import {ref} from 'vue'
import {batchAssignRoleToUser, batchRemoveRoleFromUser, changePassword, updateUser} from '@/api/user.js'

const props = defineProps({
	selectedUser: {
		required: true,
		type: Object,
	}
})

const updateDrawerFlag = ref(false)

const updateUserFormData = ref({})
const updateUserFormRef = ref()

const rolesDrawerFlag = ref(false)



function onOpenAssignRolesDrawer(){
	rolesDrawerFlag.value = true
}

function onOpenUpdateDrawer(){
	updateUserFormData.value = {
		userId: props.selectedUser.id,
		realName: props.selectedUser.realName,
		emailAddress: props.selectedUser.emailAddress,
		phoneNumber: props.selectedUser.phoneNumber,

		description: props.selectedUser.description,
	}

	updateDrawerFlag.value = true
}

const emits = defineEmits(['refresh'])

function onUpdate(){
	updateUserFormRef.value.validate((valid)=>{
		if(!valid) return
		updateUser(updateUserFormData.value).then(() => {
			emits('refresh')
			updateDrawerFlag.value = false
		})
	})
}

const changePasswordFormData = ref({})
const changePasswordFormRef = ref()
const changePasswordDrawerFlag = ref(false)
function onOpenChangePasswordDrawer(){
	changePasswordFormData.value.userId = props.selectedUser.id
	changePasswordDrawerFlag.value = true
}
function onChangePassword(){

	changePasswordFormRef.value.validate((valid)=>{
		if(!valid) return

		changePassword(changePasswordFormData.value).then(() => {
			emits('refresh')
			changePasswordDrawerFlag.value = false
		})
	})

}

function handleRelationChange(userId, roleId, relate, row){
	if(relate){
		batchAssignRoleToUser({assignList: [{userId, roleId}]}).catch(()=>{
			row.related = false
		})
	}else{
		batchRemoveRoleFromUser({removeList: [{userId, roleId}]}).catch(()=>{
			row.related = true
		})
	}
}
</script>
<template>
	<ElButton
		link
		type="primary"
		@click="onOpenAssignRolesDrawer"
		disabled-message="请选择且只选择一项">关联角色</ElButton>
	<ElButton
		link
		type="primary"
		@click="onOpenChangePasswordDrawer"
		disabled-message="请选择且只选择一项">修改密码</ElButton>
	<ElButton
		link
		type="primary"
		@click="onOpenUpdateDrawer"
		disabled-message="请选择且只选择一项">编辑</ElButton>
	<Teleport to="body">
		<StratoDrawer v-model="updateDrawerFlag" title="编辑用户" @onConfirm="onUpdate">
			<UpdateUserForm ref="updateUserFormRef" v-model="updateUserFormData" />
		</StratoDrawer>
		<StratoDrawer v-model="changePasswordDrawerFlag" title="修改密码" @onConfirm="onChangePassword">
			<ChangePasswordForm ref="changePasswordFormRef" v-model="changePasswordFormData" />
		</StratoDrawer>
		<StratoDrawer v-model="rolesDrawerFlag" no-confirm title="关联角色" :size="800">
			<Role v-if="rolesDrawerFlag" :simple-mode="true">
				<ElTableColumn label="关联状态">
					<template #default="scope">
						<span hidden>{{scope.row.related=scope.row.related===undefined?selectedUser.roleIds.includes(scope.row.id):scope.row.related }}</span>
						<ElSwitch v-model="scope.row.related" @change="handleRelationChange(selectedUser.id, scope.row.id, scope.row.related, scope.row)" />
					</template>
				</ElTableColumn>
			</Role>
		</StratoDrawer>
	</Teleport>
</template>

<style scoped>

</style>
