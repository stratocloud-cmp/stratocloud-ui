<script setup>
import User from '@/views/user/User.vue'
import {ElSwitch, ElTableColumn} from 'element-plus'
import PermissionSelector from '@/views/role/PermissionsSelector.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import UpdateRoleForm from '@/views/role/UpdateRoleForm.vue'
import {batchAssignRoleToUser, batchRemoveRoleFromUser} from '@/api/user.js'
import {updateRole} from '@/api/role.js'
import {ref} from 'vue'

const props = defineProps({
	selectedRole: {
		required: true,
		type: Object
	}
})

const updateDrawerFlag = ref(false)

const updateRoleFormData = ref({})
const updateRoleFormRef = ref()

const usersDrawerFlag = ref(false)

const permissionsDrawerFlag = ref(false)

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

function onOpenAssignUsersDrawer(){
	usersDrawerFlag.value = true
}

function onOpenPermissionsDrawer(){
	permissionsDrawerFlag.value = true
}

function onOpenUpdateDrawer(updatingRole){
	updateRoleFormData.value = {
		roleId: updatingRole.id,
		name: updatingRole.name,
		roleType: updatingRole.type,
		description: updatingRole.description,
	}

	updateDrawerFlag.value = true
}

const emits = defineEmits(['refresh'])

function onUpdate(){
	updateRoleFormRef.value.validate(valid=>{
		if(!valid) return
		updateRole(updateRoleFormData.value).then(() => {
			emits('refresh')
			updateDrawerFlag.value = false
		})
	})
}

</script>

<template>
	<ElButton link type="primary" @click="()=>onOpenUpdateDrawer(selectedRole)">
		编辑
	</ElButton>
	<ElButton link type="primary" @click="onOpenAssignUsersDrawer">
		关联用户
	</ElButton>
	<ElButton link type="primary" @click="onOpenPermissionsDrawer">
		关联权限
	</ElButton>

	<Teleport to="body">
		<StratoDrawer v-model="updateDrawerFlag" title="编辑角色" @onConfirm="onUpdate">
			<UpdateRoleForm ref="updateRoleFormRef" v-model="updateRoleFormData" />
		</StratoDrawer>

		<StratoDrawer v-model="usersDrawerFlag" no-confirm title="关联用户" :size="800">
			<User v-if="usersDrawerFlag" :simple-mode="true">
				<ElTableColumn label="关联状态">
					<template #default="scope">
						<span hidden>{{scope.row.related=scope.row.related===undefined?scope.row.roleIds.includes(selectedRole.id):scope.row.related }}</span>
						<ElSwitch v-model="scope.row.related" @change="handleRelationChange(scope.row.id, selectedRole.id, scope.row.related, scope.row)" />
					</template>
				</ElTableColumn>
			</User>
		</StratoDrawer>

		<StratoDrawer v-model="permissionsDrawerFlag" no-confirm title="配置权限" :size="800">
			<PermissionSelector v-if="permissionsDrawerFlag" :role-id="selectedRole.id" :permission-ids="selectedRole.permissionIds"/>
		</StratoDrawer>
	</Teleport>
</template>

<style scoped>

</style>
