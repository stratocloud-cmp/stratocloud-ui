<script setup>

import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import WorkflowSelector from '@/views/workflow/WorkflowSelector.vue'
import {getJobFormComponentByJobType, getJobFormDefaultData} from '@/views/order/OrderUtil.js'
import {createOrder} from '@/api/order.js'
import {ElNotification} from 'element-plus'
import {validateForms} from '@/utils/FormUtil.js'
import StratoButton from '@/components/StratoButton.vue'

const formData = ref()

const workflowId = ref()
const selectedWorkflow = ref()
const jobFormComponents = {}
function onWorkflowSelected(workflow){
	if(!workflow)
		return

	if(formData.value && workflow.id === formData.value.workflowId)
		return

	selectedWorkflow.value = workflow

	formData.value = {
		orderName: undefined,
		note: undefined,
		workflowId: workflow.id,
		items: workflow.nodes.filter(n => n.nodeType === 'JOB_NODE').map(n => {
			return {
				jobNodeKey: n.nodeKey,
				parameters: getJobFormDefaultData(n.nodeProperties.jobType)
			}
		}),
	}

	for (let node of workflow.nodes.filter(n => n.nodeType === 'JOB_NODE')) {
		const jobFormComponent = getJobFormComponent(node.nodeKey)

		if(!jobFormComponent){
			ElNotification.warning('此流程不支持新建工单')
			clear()
			return
		}

		jobFormComponents[node.nodeKey] = jobFormComponent
	}
}

function getJobNode(nodeKey) {
	return selectedWorkflow.value.nodes.filter(
		n => n.nodeType === 'JOB_NODE'
	).filter(
		node => node.nodeKey === nodeKey
	)[0]
}

function getJobFormComponent(nodeKey){
	const jobNode = getJobNode(nodeKey)

	return getJobFormComponentByJobType(jobNode.nodeProperties.jobType, 'AWAIT_SUBMIT')
}


const drawerLoading = ref(false)
const drawerFlag = ref(false)

function openDrawer(){
	drawerFlag.value = true
}

const emits = defineEmits(['refresh'])
function confirm() {
	if(!formData.value){
		ElNotification.warning('请先选择流程')
		return
	}

	validateForms(orderItemFormRefs.value, valid => {
		if(!valid) return

		drawerLoading.value = true
		createOrder(formData.value).then(resp => {
			console.log('Order created: '+resp.orderId)
			drawerFlag.value = false
			clear()
			emits('refresh')
		}).finally(() => {
			drawerLoading.value = false
		})
	})
}

const orderItemFormRefs = ref([])

function clear(){
	formData.value = undefined
	selectedWorkflow.value = undefined
	workflowId.value = undefined
}
</script>

<template>
	<StratoButton
		type="primary"
		plain
		@click="openDrawer"
	>
		新建
	</StratoButton>

	<teleport to="body">
		<StratoDrawer
			v-if="drawerFlag"
			v-model="drawerFlag"
			title="新建工单"
			:loading="drawerLoading"
			@on-confirm="confirm"
			@on-close="clear"
			:size="1000">
			<ElForm label-position="top">
				<ElFormItem label="流程">
					<WorkflowSelector v-model="workflowId" @change="onWorkflowSelected" />
				</ElFormItem>
				<ElFormItem v-if="formData" label="工单标题">
					<ElInput placeholder="留空则自动生成" v-model="formData.orderName" />
				</ElFormItem>
				<ElFormItem v-if="formData" label="备注">
					<ElInput type="textarea" v-model="formData.note" />
				</ElFormItem>
			</ElForm>
			<div v-if="formData" style="margin-top: 24px">
				<ElCard v-for="(item,index) in formData.items" shadow="never">
					<template #header>
						<span style="font-size: 16px;">
							{{`工单项${index+1}: ${getJobNode(item.jobNodeKey).nodeName}`}}
						</span>
					</template>
					<component
						ref="orderItemFormRefs"
						:is="jobFormComponents[item.jobNodeKey]"
						v-model="item.parameters"
					/>
				</ElCard>
			</div>
		</StratoDrawer>
	</teleport>
</template>

<style scoped>

</style>
