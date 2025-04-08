<script setup>

import StratoDrawer from '@/components/StratoDrawer.vue'
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import CreateScriptDefinitionForm from '@/views/script/CreateScriptDefinitionForm.vue'
import {ElInput, ElNotification, ElPopconfirm} from 'element-plus'
import {
	createScriptDefinition,
	deleteScriptDefinitions,
	describeScriptDefinitions, disableScriptDefinitions, enableScriptDefinitions,
	updateScriptDefinition
} from '@/api/scriptDefinition.js'
import StratoTable from '@/components/StratoTable.vue'
import UpdateScriptDefinitionForm from '@/views/script/UpdateScriptDefinitionForm.vue'
import {
	createSoftwareDefinition,
	deleteSoftwareDefinitions, describeSoftwareDefinitions, disableSoftwareDefinitions, enableSoftwareDefinitions,
	updateSoftwareDefinition
} from '@/api/softwareDefinition.js'
import CreateSoftwareDefinitionForm from '@/views/software/CreateSoftwareDefinitionForm.vue'
import UpdateSoftwareDefinitionForm from '@/views/software/UpdateSoftwareDefinitionForm.vue'

const pagingRequest = ref({})

const selectedDefs = ref([])

const tableRef = ref()

function getSelectedIds(){
	return selectedDefs.value.map(def=>def.id)
}

function handleSelectionChange(selectedRows){
	selectedDefs.value = selectedRows
}


const createFormRef = ref()
const createDrawerFlag = ref(false)
const createFormData = ref()
function openCreateDrawer(){
	createFormData.value = {
		actions: [],
		requirements: []
	}
	createDrawerFlag.value = true
}

const updateFormRef = ref()
const updateDrawerFlag = ref(false)
const updateFormData = ref()
function openUpdateDrawer(selectedDef){
	updateFormData.value = {
		softwareDefinitionId: selectedDef.id,
		name: selectedDef.name,
		description: selectedDef.description,
		softwareType: selectedDef.softwareType,
		osType: selectedDef.osType,
		publicDefinition: selectedDef.publicDefinition,
		visibleInTarget: selectedDef.visibleInTarget,
		servicePort: selectedDef.servicePort,
		actions: selectedDef.actions,
		requirements: selectedDef.requirements,
	}
	updateDrawerFlag.value = true
}


function onCreate(){
	createFormRef.value.validate((valid) => {
		if(!valid) return

		createSoftwareDefinition(createFormData.value).then(() => {
			createDrawerFlag.value = false
			ElNotification.success('软件定义已保存')
			tableRef.value.fetchData()
		})
	})
}

function onUpdate(){
	updateFormRef.value.validate((valid) => {
		if(!valid) return

		updateSoftwareDefinition(updateFormData.value).then(() => {
			updateDrawerFlag.value = false
			ElNotification.success('软件定义已更新')
			tableRef.value.fetchData()
		})
	})
}

function onDelete(){
	if(selectedDefs.value.length ===0){
		return
	}

	const softwareDefinitionIds = getSelectedIds()

	const request = {softwareDefinitionIds}

	deleteSoftwareDefinitions(request).then(() => {
		tableRef.value.fetchData()
	})
}

function convertSoftwareTypeToReadable(softwareType){
	switch(softwareType){
		case 'APPLICATION': return '应用'
		case 'DATABASE': return '数据库'
		case 'MIDDLEWARE': return '中间件'
		case 'OTHER': return '其他'
		default: return '未知类型'
	}
}

function onEnable(){
	if(selectedDefs.value.length ===0){
		return
	}

	const softwareDefinitionIds = getSelectedIds()

	const request = {softwareDefinitionIds}

	enableSoftwareDefinitions(request).then(() => {
		tableRef.value.fetchData()
	})
}

function onDisable(){
	if(selectedDefs.value.length ===0){
		return
	}

	const softwareDefinitionIds = getSelectedIds()

	const request = {softwareDefinitionIds}

	disableSoftwareDefinitions(request).then(() => {
		tableRef.value.fetchData()
	})
}

</script>

<template>
	<div style="margin-bottom: 10px;height: 32px">
		<StratoButton type="primary" @click="openCreateDrawer">新建</StratoButton>
		<StratoButton :disabled="selectedDefs.length===0" type="success" plain @click="onEnable">
			启用
		</StratoButton>
		<StratoButton :disabled="selectedDefs.length===0" type="warning" plain @click="onDisable">
			禁用
		</StratoButton>
		<ElPopconfirm title="确认删除" @confirm="onDelete">
			<template #reference>
				<StratoButton
					:disabled="selectedDefs.length===0"
					type="danger"
					plain
				>
					删除
				</StratoButton>
			</template>
		</ElPopconfirm>

		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="tableRef"
		:paging-request="pagingRequest"
		:remote-method="describeSoftwareDefinitions"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="definitionKey" label="软件标识" />
		<ElTableColumn prop="name" label="软件名称" sortable="custom" />
		<ElTableColumn prop="softwareType" label="软件类型" sortable="custom">
			<template #default="scope">
				<span>{{convertSoftwareTypeToReadable(scope.row.softwareType)}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="osType" label="系统类型" sortable="custom">
			<template #default="scope">
				<span>{{scope.row.osType}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="publicDefinition" label="公用软件" sortable="custom">
			<template #default="scope">
				<span>{{scope.row.publicDefinition ? '是':'否'}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="visibleInTarget" label="在依赖目标中可见" sortable="custom" min-width="100">
			<template #default="scope">
				<span>{{scope.row.visibleInTarget ? '是':'否'}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="disabled" label="是否禁用" sortable="custom">
			<template #default="scope">
				<span>{{scope.row.disabled ? '是':'否'}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="ownerId" label="所有者" sortable="custom">
			<template #default="scope">
				<span>{{scope.row.ownerRealName}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn>
			<template #default="scope">
				<ElButton link type="primary" @click="()=>openUpdateDrawer(scope.row)">编辑</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer v-model="createDrawerFlag" title="新建软件定义" size="1200" @onConfirm="onCreate">
		<CreateSoftwareDefinitionForm ref="createFormRef" v-if="createDrawerFlag" v-model="createFormData" />
	</StratoDrawer>

	<StratoDrawer v-model="updateDrawerFlag" title="编辑软件定义" size="1200" @onConfirm="onUpdate">
		<UpdateSoftwareDefinitionForm ref="updateFormRef" v-if="updateDrawerFlag" v-model="updateFormData" />
	</StratoDrawer>
</template>

<style scoped>

</style>
