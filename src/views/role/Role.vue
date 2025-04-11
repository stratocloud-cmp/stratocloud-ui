<template>
    <div style="margin-bottom: 10px;">
        <template v-if="!simpleMode">
            <StratoButton
	            type="primary"
	            @click="onOpenDrawer">创建</StratoButton>
            <ElPopconfirm title="确认删除" @confirm="onDelete">
                <template #reference>
                    <StratoButton :disabled="selectedRoles.length===0" type="danger" plain>删除</StratoButton>
                </template>
            </ElPopconfirm>
        </template>

        <ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
    </div>

    <StratoTable
        ref="roleTableRef"
        :paging-request="pagingRequest"
        :remote-method="describeRoles"
        @selection-change="handleSelectionChange"
    >
        <ElTableColumn v-if="!simpleMode" type="selection" reserve-selection />
        <ElTableColumn prop="name" label="角色名称" sortable="custom" />
        <ElTableColumn prop="type" label="角色类型" sortable="custom" :formatter="(_row, _column, cellValue, _index) => convertRoleType(cellValue)" />
        <ElTableColumn v-if="!simpleMode" prop="description" label="描述" sortable="custom" />
        <ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
	    <ElTableColumn v-if="!simpleMode">
		    <template #default="roleScope">
			    <RoleActionsColumn :selected-role="roleScope.row" @refresh="onRefresh" />
		    </template>
	    </ElTableColumn>
        <slot></slot>
    </StratoTable>

    <StratoDrawer v-model="drawerFlag" title="创建角色" @onConfirm="onSave">
        <CreateRoleForm ref="createRoleFormRef" v-if="drawerFlag" v-model="createRoleFormData" />
    </StratoDrawer>
</template>
<script setup>
import {describeRoles, createRole, deleteRoles} from '@/api/role'
import StratoButton from '@/components/StratoButton.vue';
import {ElInput, ElPopconfirm, ElTableColumn} from 'element-plus';
import { ref } from 'vue';
import CreateRoleForm from './CreateRoleForm.vue'
import StratoDrawer from '@/components/StratoDrawer.vue';
import StratoTable from '@/components/StratoTable.vue';
import RoleActionsColumn from '@/views/role/RoleActionsColumn.vue'

const props = defineProps({
    simpleMode:{
        default: false,
        required: false
    }
})

const roleTableRef = ref()

const pagingRequest = ref({})

const selectedRoles = ref([])

const drawerFlag = ref(false)

const createRoleFormData = ref({})
const createRoleFormRef = ref()

function onRefresh() {
	roleTableRef.value.fetchData()
}

function convertRoleType(roleType){
    switch(roleType){
        case 'SUPER_ADMIN': return '全局超级管理员'
        case 'TENANT_SUPER_ADMIN': return '租户级超级管理员'
        case 'TENANT_ADMIN': return '租户级管理员'
        case 'NORMAL_USER': return '普通用户'
    }
    return roleType
}



function onOpenDrawer(){
	createRoleFormData.value = {}
    drawerFlag.value = true
}

function onSave(){
    createRoleFormRef.value.validate(valid=>{
        if(!valid) return
        createRole(createRoleFormData.value).then(() => {
            roleTableRef.value.fetchData()
            drawerFlag.value = false
        })
    })
}

function handleSelectionChange(selectedRows){
    selectedRoles.value = selectedRows
}

function getSelectedIds(){
    return selectedRoles.value.map(user=>user.id)
}

function onDelete(){
    const roleIds = getSelectedIds()
    const request = {roleIds}
    deleteRoles(request).then(() => {
        roleTableRef.value.fetchData()
    })
}
</script>
