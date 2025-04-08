<template>
    <div style="margin-bottom: 10px;height: 32px">
	    <slot name="buttons"></slot>
        <template v-if="!simpleMode">
            <StratoButton type="primary" @click="onOpenDrawer">创建</StratoButton>
            <StratoButton
	            :disabled="selectedUsers.length===0"
	            type="success"
	            plain
	            @click="onEnable">启用</StratoButton>
            <StratoButton
	            :disabled="selectedUsers.length===0"
	            type="success"
	            plain
	            @click="onUnlock">解锁</StratoButton>
            <StratoButton
	            :disabled="selectedUsers.length===0"
	            type="danger"
	            plain
	            @click="onDisable">禁用</StratoButton>
            <ElPopconfirm title="确认删除" @confirm="onDelete">
                <template #reference>
                    <StratoButton
	                    :disabled="selectedUsers.length===0"
	                    type="danger"
	                    plain>删除</StratoButton>
                </template>
            </ElPopconfirm>
        </template>

        <ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
    </div>

    <StratoTable
        ref="userTableRef"
        :paging-request="pagingRequest"
        :remote-method="describeUsers"
        @selection-change="handleSelectionChange"
        @filter-change="handlerFilterChange"
    >
        <ElTableColumn type="selection" reserve-selection />
        <ElTableColumn prop="loginName" label="登录名" sortable="custom" />
        <ElTableColumn prop="realName" label="姓名" sortable="custom" />
        <ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
        <ElTableColumn column-key="locked" label="是否锁定" :filters="lockedFilter" :filter-multiple="false">
            <template #default="scope">
                <ElIcon color="red" v-if="scope.row.locked"><Lock /></ElIcon>
                <ElIcon color="green" v-if="!scope.row.locked"><Unlock /></ElIcon>
            </template>
        </ElTableColumn>
        <ElTableColumn column-key="disabled" label="是否禁用" :filters="disabledFilter" :filter-multiple="false">
            <template #default="scope">
                <ElIcon color="red" v-if="scope.row.disabled"><UserFilled /></ElIcon>
                <ElIcon color="green" v-if="!scope.row.disabled"><UserFilled /></ElIcon>
            </template>
        </ElTableColumn>
	    <ElTableColumn v-if="!simpleMode" min-width="100">
		    <template #default="scope">
			    <UserActionsColumn :selected-user="scope.row" @refresh="fetchData" />
		    </template>
	    </ElTableColumn>
        <slot></slot>
    </StratoTable>

    <StratoDrawer v-model="drawerFlag" title="创建用户" @onConfirm="onSave">
        <CreateUserForm v-if="drawerFlag" ref="createUserFormRef" v-model="createUserFormData" />
    </StratoDrawer>
</template>
<script setup>
import {
	describeUsers, unlockUsers, enableUsers,
	disableUsers, saveUser, deleteUsers, updateUser,
	batchAssignRoleToUser, batchRemoveRoleFromUser, changePassword
} from '@/api/user'
import StratoButton from '@/components/StratoButton.vue';
import { ElIcon, ElInput, ElPopconfirm, ElSwitch, ElTableColumn } from 'element-plus';
import { ref } from 'vue';
import CreateUserForm from './CreateUserForm.vue'
import UpdateUserForm from './UpdateUserForm.vue'
import StratoDrawer from '@/components/StratoDrawer.vue';
import StratoTable from '@/components/StratoTable.vue';
import Role from '../role/Role.vue';
import {Lock, Unlock, UserFilled} from '@element-plus/icons-vue'
import ChangePasswordForm from '@/views/user/ChangePasswordForm.vue'
import UserActionsColumn from '@/views/user/UserActionsColumn.vue'

const props = defineProps({
    simpleMode: {
        default: false,
        required: false,
	    type: Boolean
    },
	userGroupIds:{
		default: undefined,
		required: false,
	}
})

const userTableRef = ref()

const lockedFilter = [{ text: '已锁定', value: true },{ text: '未锁定', value: false }]
const disabledFilter = [{ text: '已禁用', value: true },{ text: '未禁用', value: false }]

function handlerFilterChange(newFilters){
    if('locked' in newFilters){
        if(newFilters.locked.length>0){
            pagingRequest.value.locked = newFilters.locked[0]
        }else{
            pagingRequest.value.locked = undefined
        }
    }
	if('disabled' in newFilters){
        if(newFilters.disabled.length>0){
            pagingRequest.value.disabled = newFilters.disabled[0]
        }else{
            pagingRequest.value.disabled = undefined
        }
    }
}

const pagingRequest = ref({
	userGroupIds: props.userGroupIds,
})

const selectedUsers = ref([])

const drawerFlag = ref(false)

const createUserFormData = ref({})
const createUserFormRef = ref()


function onOpenDrawer(){
	createUserFormData.value = {}
    drawerFlag.value = true
}

function onSave(){
    createUserFormRef.value.validate((valid)=>{
        if(!valid) return
        saveUser(createUserFormData.value).then(() => {
            userTableRef.value.fetchData()
            drawerFlag.value = false
        })
    })
}


const emits = defineEmits(['change'])
function handleSelectionChange(selectedRows){
    selectedUsers.value = selectedRows
	emits('change', selectedRows)
}

function getSelectedIds(){
    return selectedUsers.value.map(user=>user.id)
}


function onUnlock(){
    const userIds = getSelectedIds()
    const request = {
        userIds: userIds
    }
    unlockUsers(request).then(() => {
        userTableRef.value.fetchData()
    }).catch(() => {})
}

function onEnable(){
    const userIds = getSelectedIds()
    const request = {
        userIds: userIds
    }
    enableUsers(request).then(() => {
        userTableRef.value.fetchData()
    }).catch(() => {})
}

function onDisable(){
    const userIds = getSelectedIds()
    const request = {
        userIds: userIds
    }
    disableUsers(request).then(() => {
        userTableRef.value.fetchData()
    }).catch(() => {})
}

function onDelete(){
    const userIds = getSelectedIds()
    const request = {
        userIds: userIds
    }
    deleteUsers(request).then(() => {
        userTableRef.value.fetchData()
    }).catch(() => {})
}

function fetchData(){
	userTableRef.value.fetchData()
}

defineExpose({fetchData})
</script>
