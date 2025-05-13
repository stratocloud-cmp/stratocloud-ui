<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {ref} from "vue";

import StratoButton from "@/components/StratoButton.vue";
import {ElInput, ElPopconfirm} from "element-plus";
import StratoDrawer from '@/components/StratoDrawer.vue'
import {
	createNotificationPolicy,
	createNotificationWay, deleteNotificationPolicies,
	deleteNotificationWays, describeNotificationPolicies,
	describeNotificationWays, updateNotificationPolicy,
	updateNotificationWay
} from '@/api/notification.js'
import NotificationProviderStatus from '@/views/notification/components/NotificationProviderStatus.vue'
import CreateNotificationWayForm from '@/views/notification/CreateNotificationWayForm.vue'
import UpdateNotificationWayForm from '@/views/notification/UpdateNotificationWayForm.vue'
import CreateNotificationPolicyForm from '@/views/notification/CreateNotificationPolicyForm.vue'
import UpdateNotificationPolicyForm from '@/views/notification/UpdateNotificationPolicyForm.vue'

const pagingRequest = ref({})

const selectedPolicies = ref([])

const policyTableRef = ref()

function getSelectedIds(){
	return selectedPolicies.value.map(a=>a.id)
}

function handleSelectionChange(rows) {
	selectedPolicies.value = rows
}


const createDrawerFlag = ref(false)
const createFormRef = ref()
const createDrawerLoading = ref(false)
const createFormData = ref({})
function onOpenCreateDrawer(){
	createFormData.value = {
		maxNotificationTimes: 1,
		notificationIntervalMinutes: 30
	}
	createDrawerFlag.value = true
}
function createPolicy(){
	createFormRef.value.validate((valid, _fields)=>{
		if(!valid) return
		createDrawerLoading.value = true
		createNotificationPolicy(createFormData.value).then(()=>{
			createDrawerFlag.value = false
			policyTableRef.value.fetchData()
		}).finally(()=>{
			createDrawerLoading.value = false
		})
	})
}

const updateDrawerFlag = ref()
const updateFormRef = ref()
const updateDrawerLoading = ref(false)
const updateFormData = ref({})
function onOpenUpdateDrawer(selectedPolicy){
	updateFormData.value.notificationPolicyId = selectedPolicy.id
	updateFormData.value.name = selectedPolicy.name
	updateFormData.value.description = selectedPolicy.description
	updateFormData.value.receiverType = selectedPolicy.receiverType
	updateFormData.value.presetUserIds = selectedPolicy.presetUserIds
	updateFormData.value.presetUserGroupIds = selectedPolicy.presetUserGroupIds
	updateFormData.value.presetRoleIds = selectedPolicy.presetRoleIds
	updateFormData.value.template = selectedPolicy.template
	updateFormData.value.maxNotificationTimes = selectedPolicy.maxNotificationTimes
	updateFormData.value.notificationIntervalMinutes = selectedPolicy.notificationIntervalMinutes
	updateDrawerFlag.value = true
}
function updatePolicy(){
	updateFormRef.value.validate(valid=>{
		if(!valid) return

		updateDrawerLoading.value = true

		updateNotificationPolicy(updateFormData.value).then(()=>{
			updateDrawerFlag.value = false
			policyTableRef.value.fetchData()
		}).finally(()=>{
			updateDrawerLoading.value = false
		})
	})


}


function onDelete(){
	if(selectedPolicies.value.length === 0){
		return
	}

	deleteDrawerLoading.value = true
	deleteNotificationPolicies({
		notificationPolicyIds: getSelectedIds(),
		force: forceDelete.value
	}).then(()=>{
		deleteDrawerFlag.value = false
		policyTableRef.value.fetchData()
	}).finally(()=>{
		deleteDrawerLoading.value = false
	})
}

const forceDelete = ref(false)
const deleteDrawerFlag = ref(false)
const deleteDrawerLoading = ref(false)
function openDeleteDrawer(){
	deleteDrawerFlag.value = true
}

</script>

<template>
	<div style="margin-bottom: 10px;">
		<StratoButton type="primary" @click="onOpenCreateDrawer">创建</StratoButton>
		<StratoButton @click="openDeleteDrawer" :disabled="selectedPolicies.length===0" type="danger" plain>
			删除
		</StratoButton>
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="policyTableRef"
		:paging-request="pagingRequest"
		:remote-method="describeNotificationPolicies"
		@selection-change="handleSelectionChange">
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn prop="eventType" label="事件类型" sortable="custom">
			<template #default="scope">
				{{scope.row.eventTypeName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="policyKey" label="策略标识" />
		<ElTableColumn prop="receiverType" label="接收者类型" sortable="custom">
			<template #default="scope">
				<span v-if="scope.row.receiverType === 'PRESET_USERS'">
					指定用户
				</span>
				<span v-else-if="scope.row.receiverType === 'PRESET_ROLES'">
					指定角色
				</span>
				<span v-else-if="scope.row.receiverType === 'PRESET_USER_GROUPS'">
					指定用户组
				</span>
				<span v-else-if="scope.row.receiverType === 'EVENT_OBJECT_OWNER'">
					事件对象所有者
				</span>
				<span v-else-if="scope.row.receiverType === 'ORDER_HANDLERS'">
					工单审批人
				</span>
				<span v-else>
					未知
				</span>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="notificationWayId" label="通知方式" sortable="custom">
			<template #default="scope">
				{{scope.row.notificationWayName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="description" label="描述" />
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn>
			<template #default="scope">
				<ElButton
					link
					type="primary"
					@click="()=>onOpenUpdateDrawer(scope.row)">编辑</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer
		:loading="createDrawerLoading"
		v-model="createDrawerFlag"
		title="创建通知策略"
		@on-confirm="createPolicy"
		size="800">
		<CreateNotificationPolicyForm style="width: 95%" ref="createFormRef" v-if="createDrawerFlag" v-model="createFormData" />
	</StratoDrawer>

	<StratoDrawer
		:loading="updateDrawerLoading"
		v-model="updateDrawerFlag"
		title="编辑通知策略"
		@on-confirm="updatePolicy"
		size="800">
		<UpdateNotificationPolicyForm style="width: 95%" v-if="updateDrawerFlag" ref="updateFormRef" v-model="updateFormData" />
	</StratoDrawer>
	<StratoDrawer
		:loading="deleteDrawerLoading"
		v-model="deleteDrawerFlag"
		title="删除通知策略"
		@on-confirm="onDelete">
		<ElCheckbox v-model="forceDelete">强制删除</ElCheckbox>
	</StratoDrawer>
</template>

<style scoped>

</style>
