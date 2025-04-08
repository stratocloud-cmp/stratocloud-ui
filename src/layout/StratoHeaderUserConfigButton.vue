<script setup>

import {ref} from "vue";
import {useSessionStore} from '@/stores/session.js'
import {useActiveMenuStore} from '@/stores/activeMenu.js'
import {useRouter} from 'vue-router'
import ChangePasswordForm from '@/views/user/ChangePasswordForm.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {changePassword, describeUsers, updateUser} from '@/api/user.js'
import UpdateUserForm from '@/views/user/UpdateUserForm.vue'
import {ElNotification} from 'element-plus'


const sessionStore = useSessionStore()
const activeMenuStore = useActiveMenuStore()

const router = useRouter()

function logout(){
	activeMenuStore.setCurrentSideMenus(undefined)
	activeMenuStore.setActiveMenu(undefined)
	sessionStore.setSession(undefined)

	router.push('/login')
}

const changePasswordDrawerFlag = ref(false)
const changePasswordFormRef = ref()
const changePasswordFormData = ref({
	userId: sessionStore.userId
})
function openChangePasswordDrawer(){
	changePasswordDrawerFlag.value = true
}
function onChangePassword(){
	changePasswordFormRef.value.validate((valid)=>{
		if(!valid) return
		changePassword(changePasswordFormData.value).then(() => {
			changePasswordDrawerFlag.value = false
		})
	})
}


const updateDrawerFlag = ref(false)
const updateFormRef = ref()
const updateFormData = ref({})
function openUpdateDrawer(){
	describeUsers({userIds: [sessionStore.userId]}).then(resp=>{
		if(!resp.content || resp.content.length === 0){
			ElNotification.error('用户不存在')
		}

		updateFormData.value.userId = resp.content[0].id
		updateFormData.value.realName = resp.content[0].realName
		updateFormData.value.emailAddress = resp.content[0].emailAddress
		updateFormData.value.phoneNumber = resp.content[0].phoneNumber
		updateFormData.value.description = resp.content[0].description

		updateDrawerFlag.value = true
	})
}
function onUpdateSelf(){
	updateFormRef.value.validate((valid)=>{
		if(!valid) return
		updateUser(updateFormData.value).then(() => {
			updateDrawerFlag.value = false
		})
	})
}


function handleCommand(command){
	switch (command) {
		case 'logout':
			logout()
			break
		case 'changePassword':
			openChangePasswordDrawer()
			break
		case 'updateSelf':
			openUpdateDrawer()
			break
	}
}


</script>

<template>
	<ElDropdown @command="handleCommand" trigger="click">
		<ElButton size="large" class="user-config-button" icon="UserFilled" />
		<template #dropdown>
			<ElDropdownMenu>
				<ElDropdownItem command="updateSelf">个人信息</ElDropdownItem>
				<ElDropdownItem command="changePassword">修改密码</ElDropdownItem>
				<ElDropdownItem command="logout">退出登录</ElDropdownItem>
			</ElDropdownMenu>
		</template>
	</ElDropdown>
	<StratoDrawer v-model="changePasswordDrawerFlag" title="修改密码" @onConfirm="onChangePassword">
		<ChangePasswordForm ref="changePasswordFormRef" v-model="changePasswordFormData" />
	</StratoDrawer>
	<StratoDrawer v-model="updateDrawerFlag" title="个人信息" @onConfirm="onUpdateSelf">
		<UpdateUserForm ref="updateFormRef" v-model="updateFormData" />
	</StratoDrawer>
</template>

<style lang="scss">
.user-config-button{
	color: white;
	border: 0;
	outline: none;
}
.user-config-button:hover{
	background-color: rgba(7, 0, 112, 0.25);
	color: white;
	border: 0;
	outline: none;
}
</style>