<script setup>
import StratoTable from '@/components/StratoTable.vue';
import { ElInput, ElTableColumn } from 'element-plus';
import { ref } from 'vue';
import {changeJobDefinitionOrderRequirement, describeJobDefinitions} from '@/api/job.js'


const tableRef = ref()

const pagingRequest = ref({})


function fetchDataAgain(){
	tableRef.value.fetchData()
}

const switchLoading = ref(false)
function handleOrderRequirementChange(jobType, value){
	switchLoading.value = true
	changeJobDefinitionOrderRequirement({
		jobType: jobType,
		defaultWorkflowRequireOrder: value
	}).then(fetchDataAgain).finally(()=>{
		switchLoading.value = false
	})
}

</script>

<template>
	<div style="margin-bottom: 10px;height: 32px">
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="tableRef"
		:paging-request="pagingRequest"
		:remote-method="describeJobDefinitions"
	>
		<ElTableColumn prop="jobType" label="任务类型标识" sortable="custom" />
		<ElTableColumn prop="jobTypeName" label="任务类型名称" sortable="custom" />
		<ElTableColumn prop="startJobTopic" label="Start Topic" sortable="custom" />
		<ElTableColumn prop="cancelJobTopic" label="Cancel Topic" sortable="custom" />
		<ElTableColumn prop="serviceName" label="Service Name" sortable="custom" />
		<ElTableColumn prop="defaultWorkflowName" label="内置流程名称" sortable="custom" />
		<ElTableColumn prop="defaultWorkflowRequireOrder" label="启用工单" sortable="custom">
			<template #default="scope">
				<ElSwitch
					:loading="switchLoading"
					:model-value="scope.row.defaultWorkflowRequireOrder"
					@change="value=>handleOrderRequirementChange(scope.row.jobType, value)"
				/>
			</template>
		</ElTableColumn>

	</StratoTable>
</template>