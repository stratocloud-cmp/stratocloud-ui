<script setup>
import EventLevel from '@/views/event/EventLevel.vue'
import EventSource from '@/views/event/EventSource.vue'
import {ref} from 'vue'
import StratoCodeBlock from '@/components/StratoCodeBlock.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {resendNotification} from '@/api/notification.js'

const props = defineProps({
	notification: {
		required: true,
	}
})

const eventSummaryDrawerFlag = ref(false)
function openEventSummaryDrawer(){
	eventSummaryDrawerFlag.value = true
}

const eventPropertiesDrawerFlag = ref(false)
function openEventPropertiesDrawer(){
	eventPropertiesDrawerFlag.value = true
}

const selectedReceivers = ref([])
function onReceiversSelectionChange(selectedRows){
	selectedReceivers.value = selectedRows
}

const receiversTableRef = ref()
function onResendNotification(){
	if(selectedReceivers.value.length > 0){
		resendNotification({
			notificationId: props.notification.id,
			receiverUserIds: selectedReceivers.value.map(e=>e.receiverUserId)
		}).then(()=>{
			receiversTableRef.value.clearSelection()
			emits('refresh')
		})
	}
}

const emits = defineEmits(['refresh'])

</script>
<template>
	<ElForm>
		<ElRow :gutter="24" v-if="notification">
			<ElCol :span="12">
				<ElFormItem label="事件ID">
					{{notification.eventId}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件发生时间">
					{{notification.eventHappenedAt}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件类型标识">
					{{notification.eventType}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件类型">
					{{notification.eventTypeName}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件级别">
					<EventLevel :event-level="notification.eventLevel" />
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件来源">
					<EventSource :event-source="notification.eventSource" />
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件对象类型标识">
					{{notification.eventObjectType}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件对象类型">
					{{notification.eventObjectTypeName}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件对象标识">
					{{notification.eventObjectId}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件对象">
					{{notification.eventObjectName}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件内容">
					<ElButton style="margin-top: 3px" link type="primary" @click="openEventSummaryDrawer">查看详情</ElButton>
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="事件参数">
					<ElButton style="margin-top: 3px" link type="primary" @click="openEventPropertiesDrawer">查看详情</ElButton>
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="通知发送次数">
					{{notification.sentCount}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="最近通知发送时间">
					{{notification.lastSentTime}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="通知策略">
					{{notification.notificationPolicyName}}
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="通知方式">
					{{notification.notificationWayName}}
				</ElFormItem>
			</ElCol>
		</ElRow>
	</ElForm>
	<div style="margin-bottom: 16px">
		接收人列表
	</div>
	<div style="height: 36px">
		<ElButton size="small" type="primary" plain :disabled="selectedReceivers.length<=0" @click="onResendNotification">
			重新发送
		</ElButton>
	</div>
	<ElTable
		ref="receiversTableRef"
		v-if="notification"
		:data="notification.receivers"
		row-key="receiverUserId"
		@selection-change="onReceiversSelectionChange">
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="receiverUserRealName" label="接收人名称" />
		<ElTableColumn prop="successfullySentCount" label="成功发送次数" />
		<ElTableColumn prop="state" label="发送状态" />
	</ElTable>
	<StratoDrawer size="600" v-model="eventSummaryDrawerFlag" title="事件内容">
		<div v-if="notification">
			{{notification.eventSummary}}
		</div>
	</StratoDrawer>
	<StratoDrawer size="600" v-model="eventPropertiesDrawerFlag" title="事件参数">
		<StratoCodeBlock
			v-if="notification"
			read-only
			language="json"
			v-model="notification.eventProperties">
		</StratoCodeBlock>
	</StratoDrawer>
</template>

<style scoped>

</style>
