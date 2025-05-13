<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {ref} from "vue";

import StratoButton from "@/components/StratoButton.vue";
import {ElInput} from "element-plus";
import StratoDrawer from '@/components/StratoDrawer.vue'
import {
	createNotificationWay,
	deleteNotificationWays,
	describeNotificationWays,
	updateNotificationWay
} from '@/api/notification.js'
import NotificationProviderStatus from '@/views/notification/components/NotificationProviderStatus.vue'
import CreateNotificationWayForm from '@/views/notification/CreateNotificationWayForm.vue'
import UpdateNotificationWayForm from '@/views/notification/UpdateNotificationWayForm.vue'

const pagingRequest = ref({})

const selectedWays = ref([])

const wayTableRef = ref()

function getSelectedIds(){
	return selectedWays.value.map(a=>a.id)
}

function handleSelectionChange(rows) {
	selectedWays.value = rows
}


const createDrawerFlag = ref(false)
const createFormRef = ref()
const createDrawerLoading = ref(false)
const createFormData = ref({})
function onOpenCreateDrawer(){
	createFormData.value = {
		tenantId: undefined,
		providerId: undefined,
		name: undefined,
		description: undefined,
		properties: {},
	}
	createDrawerFlag.value = true
}
function createWay(){
	createFormRef.value.validate((valid, _fields)=>{
		if(!valid) return
		createDrawerLoading.value = true
		createNotificationWay(createFormData.value).then(()=>{
			createDrawerFlag.value = false
			wayTableRef.value.fetchData()
		}).finally(()=>{
			createDrawerLoading.value = false
		})
	})
}

const updateDrawerFlag = ref()
const updateFormRef = ref()
const updateDrawerLoading = ref(false)
const updateFormData = ref({})
function onOpenUpdateDrawer(selectedWay){
	updateFormData.value.notificationWayId = selectedWay.id
	updateFormData.value.name = selectedWay.name
	updateFormData.value.description = selectedWay.description
	updateFormData.value.properties = selectedWay.properties
	updateDrawerFlag.value = true
}
function updateWay(){
	updateFormRef.value.validate(valid=>{
		if(!valid) return

		updateDrawerLoading.value = true

		updateNotificationWay(updateFormData.value).then(()=>{
			updateDrawerFlag.value = false
			wayTableRef.value.fetchData()
		}).finally(()=>{
			updateDrawerLoading.value = false
		})
	})


}


function onDelete(){
	if(selectedWays.value.length === 0){
		return
	}

	deleteDrawerLoading.value = true
	deleteNotificationWays({
		notificationWayIds: getSelectedIds(),
		force: forceDelete.value
	}).then(()=>{
		deleteDrawerFlag.value = false
		wayTableRef.value.fetchData()
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
		<StratoButton @click="openDeleteDrawer" :disabled="selectedWays.length===0" type="danger" plain>
			删除
		</StratoButton>
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="wayTableRef"
		:paging-request="pagingRequest"
		:remote-method="describeNotificationWays"
		@selection-change="handleSelectionChange">
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn prop="providerId" label="通知类型" sortable="custom">
			<template #default="scope">
				{{scope.row.providerName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="providerStatus" label="状态" sortable="custom">
			<template #default="scope">
				<NotificationProviderStatus :state="scope.row.providerStatus" :error-message="scope.row.errorMessage" />
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
		title="创建通知方式"
		@on-confirm="createWay">
		<CreateNotificationWayForm ref="createFormRef" v-if="createDrawerFlag" v-model="createFormData" />
	</StratoDrawer>

	<StratoDrawer
		:loading="updateDrawerLoading"
		v-model="updateDrawerFlag"
		title="编辑通知方式"
		@on-confirm="updateWay">
		<UpdateNotificationWayForm v-if="updateDrawerFlag" ref="updateFormRef" v-model="updateFormData" />
	</StratoDrawer>
	<StratoDrawer
		:loading="deleteDrawerLoading"
		v-model="deleteDrawerFlag"
		title="删除通知方式"
		@on-confirm="onDelete">
		<ElCheckbox v-model="forceDelete">强制删除</ElCheckbox>
	</StratoDrawer>
</template>

<style scoped>

</style>
