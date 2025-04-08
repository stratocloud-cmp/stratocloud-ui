<script setup>
import StratoTable from '@/components/StratoTable.vue';
import {ElInput, ElMessage, ElNotification, ElTableColumn} from 'element-plus';
import { ref } from 'vue';
import {describeJobTriggers, disableJobTrigger, enableJobTrigger, triggerJobOnce, updateJobTrigger} from '@/api/job.js'
import StratoDrawer from '@/components/StratoDrawer.vue'


const tableRef = ref()

const pagingRequest = ref({})


function fetchDataAgain(){
	tableRef.value.fetchData()
}

const updateDrawerFlag = ref(false)
const updateFormData = ref({})
function openUpdateDrawer(trigger){
	updateFormData.value.triggerId = trigger.triggerId
	updateFormData.value.cronExpression = trigger.cronExpression
	updateFormData.value.description = trigger.description
	updateDrawerFlag.value = true
}

function confirmUpdate(){
	updateJobTrigger(updateFormData.value).then(resp=>{
		updateDrawerFlag.value = false
		fetchDataAgain()
	})
}

const switchLoading = ref(false)

function onEnableChange(triggerId, value){
	switchLoading.value = true
	if(value){
		enableJobTrigger({triggerId: triggerId}).then(resp=>{
			fetchDataAgain()
		}).finally(()=>{
			switchLoading.value = false
		})
	}else {
		disableJobTrigger({triggerId: triggerId}).then(resp=>{
			fetchDataAgain()
		}).finally(()=>{
			switchLoading.value = false
		})
	}
}

const triggerOnceLoading = ref(false)
function triggerOnce(trigger){
	triggerOnceLoading.value = true
	triggerJobOnce({
		triggerId: trigger.triggerId
	}).then(resp=>{
		ElNotification.success({
			message: '任务已触发',
		})
		fetchDataAgain()
	}).finally(()=>{
		triggerOnceLoading.value = false
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
		:remote-method="describeJobTriggers"
	>
		<ElTableColumn prop="triggerId" label="触发器标识" sortable="custom" />
		<ElTableColumn prop="jobType" label="任务类型标识" sortable="custom" />
		<ElTableColumn prop="jobTypeName" label="任务类型名称" sortable="custom" />
		<ElTableColumn prop="cronExpression" label="Cron表达式" sortable="custom" />
		<ElTableColumn prop="nextTriggerTime" label="下次执行时间" sortable="custom" />
		<ElTableColumn prop="disabled" label="是否启用" sortable="custom">
			<template #default="scope">
				<ElSwitch
					:loading="switchLoading"
					:model-value="!scope.row.disabled"
					@change="value=>onEnableChange(scope.row.triggerId, value)"
				/>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="description" label="描述" sortable="custom" />
		<ElTableColumn width="60">
			<template #default="scope">
				<ElButton link type="primary" @click="()=>openUpdateDrawer(scope.row)">编辑</ElButton>
			</template>
		</ElTableColumn>

		<ElTableColumn width="120">
			<template #default="scope">
				<ElButton :loading="triggerOnceLoading" link type="primary" @click="()=>triggerOnce(scope.row)">
					触发一次
				</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer v-model="updateDrawerFlag" title="编辑触发器" @on-confirm="confirmUpdate">
		<ElForm :model="updateFormData" label-position="top">
			<ElFormItem prop="cronExpression" label="Cron表达式" required>
				<ElInput v-model="updateFormData.cronExpression" />
			</ElFormItem>
			<ElFormItem prop="description" label="描述" required>
				<ElInput type="textarea" v-model="updateFormData.description" />
			</ElFormItem>
		</ElForm>
	</StratoDrawer>
</template>