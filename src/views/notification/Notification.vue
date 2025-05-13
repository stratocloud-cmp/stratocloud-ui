<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {ref} from "vue";

import {ElInput} from "element-plus";
import {
	describeNotifications
} from '@/api/notification.js'

const pagingRequest = ref({})

const notificationTableRef = ref()
</script>

<template>
	<div style="margin-bottom: 10px;min-height: 32px">
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="notificationTableRef"
		:paging-request="pagingRequest"
		:remote-method="describeNotifications">
		<ElTableColumn prop="eventId" label="事件ID" sortable="custom" />
		<ElTableColumn prop="eventType" label="事件类型" sortable="custom">
			<template #default="scope">
				{{scope.row.eventTypeName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventLevel" label="事件级别" sortable="custom">
			<template #default="scope">
				<ElText type="info" v-if="scope.row.eventLevel==='INFO'">信息</ElText>
				<ElText type="primary" v-else-if="scope.row.eventLevel==='REMIND'">提示</ElText>
				<ElText type="warning" v-else-if="scope.row.eventLevel==='WARNING'">警告</ElText>
				<ElText type="danger" v-else-if="scope.row.eventLevel==='SERIOUS'">严重</ElText>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventSource" label="事件来源" sortable="custom">
			<template #default="scope">
				<ElText type="primary" v-if="scope.row.eventSource==='STRATO_ACTION'">云管操作事件</ElText>
				<ElText type="warning" v-else-if="scope.row.eventSource==='EXTERNAL_ACTION'">外部操作事件</ElText>
				<ElText type="danger" v-else-if="scope.row.eventSource==='ALERT'">告警事件</ElText>
				<ElText type="primary" v-else-if="scope.row.eventSource==='ORDER'">工单事件</ElText>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventObjectType" label="事件对象类型" sortable="custom">
			<template #default="scope">
				{{scope.row.eventObjectTypeName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventObjectId" label="事件对象" sortable="custom">
			<template #default="scope">
				{{scope.row.eventObjectName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="eventSummary" label="事件内容" />
		<ElTableColumn prop="eventHappenedAt" label="事件发生时间" sortable="custom" />
		<ElTableColumn prop="sentCount" label="通知发送次数" sortable="custom" />
		<ElTableColumn prop="lastSentTime" label="通知发送时间" sortable="custom" />
	</StratoTable>
</template>

<style scoped>

</style>
