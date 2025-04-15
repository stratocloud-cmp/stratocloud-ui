<script setup>
import StratoTable from '@/components/StratoTable.vue';
import {ElInput, ElNotification, ElPopconfirm, ElTableColumn} from 'element-plus';
import { ref } from 'vue';
import StratoButton from '@/components/StratoButton.vue';
import StratoDrawer from '@/components/StratoDrawer.vue';
import {deleteBlueprints, describeBlueprints} from '@/api/blueprint.js'
import BlueprintEditor from '@/views/blueprint/BlueprintEditor.vue'


const tableRef = ref()

const drawerFlag = ref(false)
const updateDrawerFlag = ref(false)

const selectedBlueprints = ref([])
const pagingRequest = ref({})


const updateFormBlueprint = ref()

function handleSelectionChange(selectedRows){
	selectedBlueprints.value = selectedRows
}

function getSelectedIds(){
	return selectedBlueprints.value.map(blueprint=>blueprint.id)
}

function onOpenDrawer(){
	drawerFlag.value = true
}

function onOpenUpdateDrawer(selectedBlueprint){
	updateFormBlueprint.value = selectedBlueprint
	updateDrawerFlag.value = true
}


const createEditorRef = ref()
function onSave(){
	createEditorRef.value.confirmCreate().then(()=>{
		drawerFlag.value = false
		ElNotification.success('蓝图已保存')
		tableRef.value.fetchData()
	})
}

const updateEditorRef = ref()
function onUpdate(){
	updateEditorRef.value.confirmUpdate().then(()=>{
		updateDrawerFlag.value = false
		ElNotification.success('蓝图已保存')
		tableRef.value.fetchData()
	})
}


function onDelete(){
	const blueprintIds = getSelectedIds()
	const request = {blueprintIds}
	deleteBlueprints(request).then(()=>{
		tableRef.value.fetchData()
	})
}

</script>

<template>
	<div style="margin-bottom: 10px;height: 32px">
		<StratoButton type="primary" @click="onOpenDrawer">
			创建
		</StratoButton>
		<ElPopconfirm title="确认删除" @confirm="onDelete">
			<template #reference>
				<StratoButton
					:disabled="selectedBlueprints.length===0"
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
		:remote-method="describeBlueprints"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn prop="description" label="描述" />
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn prop="lastModifiedAt" label="更新时间" sortable="custom" />
		<ElTableColumn>
			<template #default="scope">
				<ElButton link type="primary" @click="()=>onOpenUpdateDrawer(scope.row)">编辑</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer v-model="drawerFlag" title="创建蓝图" @onConfirm="onSave" size="1000">
		<BlueprintEditor ref="createEditorRef" v-if="drawerFlag" />
	</StratoDrawer>

	<StratoDrawer v-model="updateDrawerFlag" title="编辑蓝图" @onConfirm="onUpdate" size="1000">
		<BlueprintEditor ref="updateEditorRef" v-if="updateDrawerFlag" :blueprint="updateFormBlueprint" />
	</StratoDrawer>
</template>
