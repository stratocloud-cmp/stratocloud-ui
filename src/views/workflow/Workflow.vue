<script setup>
import StratoTable from '@/components/StratoTable.vue';
import { ElInput, ElPopconfirm, ElTableColumn } from 'element-plus';
import { ref } from 'vue';
import StratoButton from '@/components/StratoButton.vue';
import StratoDrawer from '@/components/StratoDrawer.vue';
import { deleteWorkflows, describeWorkflows} from '@/api/workflow.js'
import WorkflowEditor from '@/views/workflow/WorkflowEditor.vue'


const tableRef = ref()

const drawerFlag = ref(false)
const updateDrawerFlag = ref(false)

const selectedWorkflows = ref([])
const pagingRequest = ref({})


const updateFormWorkflow = ref()

function handleSelectionChange(selectedRows){
	selectedWorkflows.value = selectedRows
}

function getSelectedIds(){
	return selectedWorkflows.value.map(workflow=>workflow.id)
}

function onOpenDrawer(){
	drawerFlag.value = true
}

function onOpenUpdateDrawer(selectedWorkflow){
	updateFormWorkflow.value = selectedWorkflow
	updateDrawerFlag.value = true
}


const createEditorRef = ref()
function onSave(){
	createEditorRef.value.confirmCreate().then(resp=>{
		drawerFlag.value = false
		tableRef.value.fetchData()
	})
}

const updateEditorRef = ref()
function onUpdate(){
	updateEditorRef.value.confirmUpdate().then(resp=>{
		updateDrawerFlag.value = false
		tableRef.value.fetchData()
	})
}


function onDelete(){
	const workflowIds = getSelectedIds()
	const request = {workflowIds}
	deleteWorkflows(request).then(resp=>{
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
					:disabled="selectedWorkflows.length===0"
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
		:remote-method="describeWorkflows"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn prop="lastModifiedAt" label="更新时间" sortable="custom" />
		<ElTableColumn width="100">
			<template #default="scope">
				<ElButton
					link
					type="primary"
					@click="()=>onOpenUpdateDrawer(scope.row)">
					编辑
				</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer v-model="drawerFlag" title="创建流程" @onConfirm="onSave" size="1000">
		<WorkflowEditor ref="createEditorRef" v-if="drawerFlag" />
	</StratoDrawer>

	<StratoDrawer v-model="updateDrawerFlag" title="编辑流程" @onConfirm="onUpdate" size="1000">
		<WorkflowEditor ref="updateEditorRef" v-if="updateDrawerFlag" :workflow="updateFormWorkflow" />
	</StratoDrawer>
</template>
