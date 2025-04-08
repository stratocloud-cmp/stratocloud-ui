<script setup>

import StratoDrawer from '@/components/StratoDrawer.vue'
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import CreateScriptDefinitionForm from '@/views/script/CreateScriptDefinitionForm.vue'
import {ElInput, ElPopconfirm} from 'element-plus'
import {
	createScriptDefinition,
	deleteScriptDefinitions,
	describeScriptDefinitions, disableScriptDefinitions, enableScriptDefinitions,
	updateScriptDefinition
} from '@/api/scriptDefinition.js'
import StratoTable from '@/components/StratoTable.vue'
import UpdateScriptDefinitionForm from '@/views/script/UpdateScriptDefinitionForm.vue'

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
		remoteScriptDef: {
			remoteScript: {},
			customForm: {
				items: []
			}
		}
	}
	createDrawerFlag.value = true
}

const updateFormRef = ref()
const updateDrawerFlag = ref(false)
const updateFormData = ref()
function openUpdateDrawer(selectedDef){
	updateFormData.value = {
		scriptDefinitionId: selectedDef.id,
		name: selectedDef.name,
		description: selectedDef.description,
		publicDefinition: selectedDef.publicDefinition,
		visibleInTarget: selectedDef.visibleInTarget,
		remoteScriptDef: selectedDef.remoteScriptDef
	}
	updateDrawerFlag.value = true
}


function onCreate(){
	createFormRef.value.validate((valid) => {
		if(!valid) return

		createScriptDefinition(createFormData.value).then(() => {
			createDrawerFlag.value = false
			tableRef.value.fetchData()
		})
	})
}

function onUpdate(){
	updateFormRef.value.validate((valid) => {
		if(!valid) return

		updateScriptDefinition(updateFormData.value).then(() => {
			updateDrawerFlag.value = false
			tableRef.value.fetchData()
		})
	})
}

function onDelete(){
	if(selectedDefs.value.length ===0){
		return
	}

	const scriptDefinitionIds = getSelectedIds()

	const request = {scriptDefinitionIds}

	deleteScriptDefinitions(request).then(() => {
		tableRef.value.fetchData()
	})
}

function onEnable(){
	if(selectedDefs.value.length ===0){
		return
	}

	const scriptDefinitionIds = getSelectedIds()

	const request = {scriptDefinitionIds}

	enableScriptDefinitions(request).then(() => {
		tableRef.value.fetchData()
	})
}

function onDisable(){
	if(selectedDefs.value.length ===0){
		return
	}

	const scriptDefinitionIds = getSelectedIds()

	const request = {scriptDefinitionIds}

	disableScriptDefinitions(request).then(() => {
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
		:remote-method="describeScriptDefinitions"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="definitionKey" label="脚本标识" sortable="custom" />
		<ElTableColumn prop="name" label="脚本名称" sortable="custom" />
		<ElTableColumn prop="publicDefinition" label="公用脚本" sortable="custom">
			<template #default="scope">
				<span>{{scope.row.publicDefinition ? '是':'否'}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="visibleInTarget" label="在依赖目标中可见" sortable="custom">
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
				{{scope.row.ownerRealName}}
			</template>
		</ElTableColumn>
		<ElTableColumn>
			<template #default="scope">
				<ElButton link type="primary" @click="()=>openUpdateDrawer(scope.row)">编辑</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer v-model="createDrawerFlag" title="新建脚本定义" size="1200" @onConfirm="onCreate">
		<CreateScriptDefinitionForm ref="createFormRef" v-if="createDrawerFlag" v-model="createFormData" />
	</StratoDrawer>

	<StratoDrawer v-model="updateDrawerFlag" title="编辑脚本定义" size="1200" @onConfirm="onUpdate">
		<UpdateScriptDefinitionForm ref="updateFormRef" v-if="updateDrawerFlag" v-model="updateFormData" />
	</StratoDrawer>
</template>

<style scoped>

</style>
