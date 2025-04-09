<script setup>
import StratoTable from '@/components/StratoTable.vue';
import { describeTenants, createTenant, updateTenant, disableTenants, enableTenants, deleteTenants } from '@/api/tenant'
import { ElInput, ElPopconfirm, ElTableColumn } from 'element-plus';
import { ref } from 'vue';
import StratoButton from '@/components/StratoButton.vue';
import StratoDrawer from '@/components/StratoDrawer.vue';
import CreateTenantForm from '@/views/tenant/CreateTenantForm.vue'
import UpdateTenantForm from '@/views/tenant/UpdateTenantForm.vue'
import Rule from '@/views/rule/Rule.vue'
import ResourceUsageLimit from '@/views/limit/ResourceUsageLimit.vue'

const tableRef = ref()

const drawerFlag = ref(false)
const updateDrawerFlag = ref(false)

const selectedTenants = ref([])
const pagingRequest = ref({})

const createTenantFormRef = ref()
const createTenantFormData = ref({})

const updateTenantFormRef = ref()
const updateTenantFormData = ref({})

function handleSelectionChange(selectedRows){
    selectedTenants.value = selectedRows
}

function getSelectedIds(){
    return selectedTenants.value.map(tenant=>tenant.id)
}

function onOpenDrawer(){
	createTenantFormData.value = {}
    drawerFlag.value = true
}

function onOpenUpdateDrawer(selectedTenant){
    updateTenantFormData.value = {
        tenantId: selectedTenant.id,
        name: selectedTenant.name,
        description: selectedTenant.description,
    }
    updateDrawerFlag.value = true
}

function onSave(){
    createTenantFormRef.value.validate((valid)=>{
        if(!valid) return
        createTenant(createTenantFormData.value).then(() => {
            tableRef.value.fetchData()
            drawerFlag.value = false
        })
    })
}

function onUpdate(){
    updateTenantFormRef.value.validate((valid)=>{
        if(!valid) return
        updateTenant(updateTenantFormData.value).then(() => {
            tableRef.value.fetchData()
            updateDrawerFlag.value = false
        })
    })
}

function onEnable(){
    const tenantIds = getSelectedIds()
    const request = {tenantIds}
    enableTenants(request).then(()=>{
        tableRef.value.fetchData()
    })
}

function onDisable(){
    const tenantIds = getSelectedIds()
    const request = {tenantIds}
    disableTenants(request).then(()=>{
        tableRef.value.fetchData()
    })
}

function onDelete(){
    const tenantIds = getSelectedIds()
    const request = {tenantIds}
    deleteTenants(request).then(()=>{
        tableRef.value.fetchData()
    })
}

const ruleDrawerTenantIds = ref()
const ruleDrawerTenantName = ref()
const ruleDrawerFlag = ref(false)
function openRuleDrawer(tenant){
	ruleDrawerTenantIds.value = [tenant.id]
	ruleDrawerTenantName.value = tenant.name
	ruleDrawerFlag.value = true
}

const limitDrawerTenantIds = ref()
const limitDrawerTenantName = ref()
const limitDrawerFlag = ref(false)
function openLimitDrawer(tenant){
	limitDrawerTenantIds.value = [tenant.id]
	limitDrawerTenantName.value = tenant.name
	limitDrawerFlag.value = true
}


</script>

<template>
    <div style="margin-bottom: 10px;height: 32px">
        <StratoButton type="primary" @click="onOpenDrawer">创建</StratoButton>
        <StratoButton :disabled="selectedTenants.length===0" type="success" plain @click="onEnable">启用</StratoButton>
        <StratoButton :disabled="selectedTenants.length===0" type="danger" plain @click="onDisable">禁用</StratoButton>
        <ElPopconfirm title="确认删除" @confirm="onDelete">
            <template #reference>
                <StratoButton :disabled="selectedTenants.length===0" type="danger" plain>删除</StratoButton>
            </template>
        </ElPopconfirm>
        <ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
    </div>

    <StratoTable ref="tableRef" :paging-request="pagingRequest" :remote-method="describeTenants" @selection-change="handleSelectionChange">
        <ElTableColumn type="selection" reserve-selection />
        <ElTableColumn prop="name" label="名称" sortable="custom" />
        <ElTableColumn prop="parentName" label="父级租户" />
        <ElTableColumn prop="description" label="描述" />
        <ElTableColumn prop="disabled" label="是否禁用" :formatter="(_row, _column, cellValue, _index) => {return cellValue ? '是':'否'}" />
        <ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
	    <ElTableColumn min-width="100">
		    <template #default="scope">
			    <ElButton link type="primary" @click="()=>onOpenUpdateDrawer(scope.row)">编辑</ElButton>
			    <ElButton link type="primary" @click="()=>openRuleDrawer(scope.row)">
				    规则管理
			    </ElButton>
			    <ElButton link type="primary" @click="()=>openLimitDrawer(scope.row)">
				    配额上限
			    </ElButton>
		    </template>
	    </ElTableColumn>
    </StratoTable>

    <StratoDrawer v-model="drawerFlag" title="创建租户" @onConfirm="onSave">
        <CreateTenantForm ref="createTenantFormRef" v-model="createTenantFormData" />
    </StratoDrawer>

    <StratoDrawer v-model="updateDrawerFlag" title="编辑租户" @onConfirm="onUpdate">
        <UpdateTenantForm ref="updateTenantFormRef" v-model="updateTenantFormData" />
    </StratoDrawer>

	<StratoDrawer v-model="ruleDrawerFlag" :title="`规则管理(租户:${ruleDrawerTenantName})`" no-confirm size="800">
		<Rule v-if="ruleDrawerFlag" :tenant-ids="ruleDrawerTenantIds" />
	</StratoDrawer>

	<StratoDrawer v-model="limitDrawerFlag" :title="`配额上限(租户:${limitDrawerTenantName})`" no-confirm size="800">
		<ResourceUsageLimit v-if="limitDrawerFlag" :tenant-ids="limitDrawerTenantIds" />
	</StratoDrawer>
</template>
