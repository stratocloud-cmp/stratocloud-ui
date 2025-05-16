<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {ref} from "vue";

import {ElInput} from "element-plus";
import {
	describeNotifications
} from '@/api/notification.js'
import StratoDrawer from '@/components/StratoDrawer.vue'
import EventLevel from '@/views/event/EventLevel.vue'
import EventSource from '@/views/event/EventSource.vue'
import NotificationDetail from '@/views/notification/components/NotificationDetail.vue'

const pagingRequest = ref({})

const notificationTableRef = ref()

const detailDrawerFlag = ref(false)
const detailDrawerNotification = ref()
function openDetailDrawer(row){
	detailDrawerNotification.value = row
	detailDrawerFlag.value = true
}

function onRefresh(){
	notificationTableRef.value.fetchData()
}

function handleListChange(listData){
	if(!detailDrawerNotification.value)
		return
	if(listData && listData.length > 0){
		let detailDrawerNotificationFound = false
		for (let element of listData) {
			if(element.id === detailDrawerNotification.value.id){
				detailDrawerNotificationFound = true
				detailDrawerNotification.value = element
			}
		}
		if(!detailDrawerNotificationFound){
			detailDrawerFlag.value = false
		}
	}
}
</script>

<template>
	<div style="margin-bottom: 10px;min-height: 32px">
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="notificationTableRef"
		:paging-request="pagingRequest"
		:remote-method="describeNotifications"
		@list-change="handleListChange">
		<ElTableColumn prop="eventId" label="事件ID" sortable="custom">
			<template #default="scope">
				<ElButton type="primary" link @click="()=>openDetailDrawer(scope.row)">{{scope.row.eventId}}</ElButton>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventType" label="事件类型" sortable="custom">
			<template #default="scope">
				{{scope.row.eventTypeName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventLevel" label="事件级别" sortable="custom">
			<template #default="scope">
				<EventLevel :event-level="scope.row.eventLevel" />
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventSource" label="事件来源" sortable="custom">
			<template #default="scope">
				<EventSource :event-source="scope.row.eventSource" />
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventObjectId" label="对象" sortable="custom">
			<template #default="scope">
				{{scope.row.eventObjectTypeName+': '+scope.row.eventObjectName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventSummary" label="事件内容" />
		<ElTableColumn prop="eventHappenedAt" label="事件发生时间" sortable="custom" />
		<ElTableColumn prop="sentCount" label="发送次数" sortable="custom" />
		<ElTableColumn prop="lastSentTime" label="发送时间" sortable="custom" />
	</StratoTable>

	<StratoDrawer size="800" title="通知详情" v-model="detailDrawerFlag">
		<NotificationDetail :notification="detailDrawerNotification" @refresh="onRefresh" />
	</StratoDrawer>

</template>

<style scoped>

</style>
