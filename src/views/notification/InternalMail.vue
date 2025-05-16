<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {ref} from "vue";

import StratoButton from "@/components/StratoButton.vue";
import {ElInput} from "element-plus";
import StratoDrawer from '@/components/StratoDrawer.vue'
import {
	createNotificationWay,
	deleteNotificationWays, describeInternalMails,
	describeNotificationWays, markInternalMailsRead,
	updateNotificationWay
} from '@/api/notification.js'
import NotificationProviderStatus from '@/views/notification/components/NotificationProviderStatus.vue'
import CreateNotificationWayForm from '@/views/notification/CreateNotificationWayForm.vue'
import UpdateNotificationWayForm from '@/views/notification/UpdateNotificationWayForm.vue'

const props = defineProps({
	isRead: {
		type: Boolean,
		default: undefined
	}
})

const pagingRequest = ref({read: props.isRead})

const selectedMails = ref([])

const mailTableRef = ref()

function getSelectedIds(){
	return selectedMails.value.map(a=>a.id)
}

function handleSelectionChange(rows) {
	selectedMails.value = rows
}

function onMarkRead(){
	markInternalMailsRead({internalMailIds: getSelectedIds()}).then(()=>{
		mailTableRef.value?.fetchData()
	})
}

function getTotal(){
	return mailTableRef.value.getTotal()
}

defineExpose({getTotal})

</script>

<template>
	<div v-if="isRead===false" style="margin-bottom: 10px;">
		<ElButton size="small" @click="onMarkRead" :disabled="selectedMails.length===0" type="primary" plain>
			设为已读
		</ElButton>
	</div>
	<StratoTable
		ref="mailTableRef"
		size="small"
		:default-page-size="5"
		:paging-request="pagingRequest"
		:remote-method="describeInternalMails"
		@selection-change="handleSelectionChange">
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="eventId" label="事件ID" width="120" sortable="custom" />
		<ElTableColumn prop="message" label="消息" :show-overflow-tooltip="false">
			<template #default="scope">
				<div v-html="scope.row.message">
				</div>
			</template>
		</ElTableColumn>
	</StratoTable>
</template>

<style scoped>

</style>
