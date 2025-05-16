<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {ref} from "vue";

import {ElInput} from "element-plus";
import EventLevel from '@/views/event/EventLevel.vue'
import EventSource from '@/views/event/EventSource.vue'
import {describeResourceEvents} from '@/api/event.js'
import ResourceSelector from '@/views/resource/components/ResourceSelector.vue'

const pagingRequest = ref({})

const eventTableRef = ref()

</script>

<template>
	<div style="margin-bottom: 10px;min-height: 32px">
		<ResourceSelector style="width: 200px" multiple v-model="pagingRequest.resourceIds" placeholder="请选择资源" />

		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="eventTableRef"
		:paging-request="pagingRequest"
		:remote-method="describeResourceEvents">
		<ElTableColumn prop="internalEventId" label="事件ID" sortable="custom" />
		<ElTableColumn prop="externalEventId" label="外部事件ID" sortable="custom" />
		<ElTableColumn prop="eventType" label="事件类型" sortable="custom">
			<template #default="scope">
				{{scope.row.eventTypeName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="level" label="事件级别" sortable="custom">
			<template #default="scope">
				<EventLevel :event-level="scope.row.level" />
			</template>
		</ElTableColumn>
		<ElTableColumn prop="source" label="事件来源" sortable="custom">
			<template #default="scope">
				<EventSource :event-source="scope.row.source" />
			</template>
		</ElTableColumn>
		<ElTableColumn prop="resourceId" label="资源" sortable="custom">
			<template #default="scope">
				{{scope.row.resourceTypeName+': '+scope.row.resourceName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="summary" label="事件详情" />
		<ElTableColumn prop="eventHappenedAt" label="事件发生时间" sortable="custom" />
	</StratoTable>
</template>

<style scoped>

</style>
