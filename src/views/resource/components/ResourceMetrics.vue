<script setup>

import {ref, watch} from 'vue'
import {describeResourceMetrics} from '@/api/resource.js'
import StratoDrawer from '@/components/StratoDrawer.vue'
import StratoLineChart from '@/layout/StratoLineChart.vue'

const props = defineProps({
	resourceId: {
		required: true
	},
})

const metricGroups = ref([])

const metricsRequest = ref({
	resourceId: props.resourceId,
	from: undefined,
	to: undefined
})

const renderVersion = ref(0)

const activeTab = ref()

function fetchMetrics(){
	loading.value = true
	describeResourceMetrics(metricsRequest.value).then(resp=>{
		if(resp.metricGroups && resp.metricGroups.length > 0){
			metricGroups.value = resp.metricGroups
			if(!activeTab.value)
				activeTab.value = resp.metricGroups[0].group.id
		}

		renderVersion.value++
	}).finally(()=>{
		loading.value = false
	})
}

const loading = ref(false)

const detailDrawerFlag = ref(false)

function openDetailDrawer(){
	fetchMetrics()
	detailDrawerFlag.value = true
}

function refresh(){
	fetchMetrics()
}

const datetimeRange = ref()

watch(()=>datetimeRange.value, ()=>{
	if(datetimeRange.value && datetimeRange.value.length === 2){
		metricsRequest.value.from = datetimeRange.value[0]
		metricsRequest.value.to = datetimeRange.value[1]
		fetchMetrics()
	} else {
		metricsRequest.value.from = undefined
		metricsRequest.value.to = undefined
		fetchMetrics()
	}

})

const shortcuts = [
	{
		text: '5分钟',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setMinutes(start.getMinutes() - 5)
			return [start, end]
		},
	},
	{
		text: '30分钟',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setMinutes(start.getMinutes() - 30)
			return [start, end]
		},
	},
	{
		text: '1小时',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setHours(start.getHours() - 1)
			return [start, end]
		},
	},
	{
		text: '3小时',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setHours(start.getHours() - 3)
			return [start, end]
		},
	},
	{
		text: '12小时',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setHours(start.getHours() - 12)
			return [start, end]
		},
	},
	{
		text: '24小时',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setHours(start.getHours() - 24)
			return [start, end]
		},
	},
	{
		text: '2天',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setDate(start.getDate() - 2)
			return [start, end]
		},
	},
	{
		text: '7天',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setDate(start.getDate() - 7)
			return [start, end]
		},
	},
	{
		text: '30天',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setDate(start.getDate() - 30)
			return [start, end]
		},
	},
	{
		text: '今天',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setHours(0)
			start.setMinutes(0)
			start.setSeconds(0)
			return [start, end]
		},
	},
	{
		text: '昨天',
		value: () => {
			const end = new Date()
			const start = new Date()
			end.setHours(0)
			end.setMinutes(0)
			end.setSeconds(0)
			start.setDate(start.getDate()-1)
			start.setHours(0)
			start.setMinutes(0)
			start.setSeconds(0)
			return [start, end]
		},
	},
]

function formatTime(time){
	return new Date(time)
}

</script>

<template>
	<ElButton type="primary" link @click="openDetailDrawer">详情</ElButton>
	<Teleport to="body">
		<StratoDrawer v-model="detailDrawerFlag" title="监控详情" size="800">
			<div v-if="detailDrawerFlag">
				<div>
					<ElDatePicker
						type="datetimerange"
						v-model="datetimeRange"
						value-format="YYYY-MM-DD HH:mm:ss"
						start-placeholder="起始时间"
						end-placeholder="结束时间"
						:shortcuts="shortcuts"
					/>
					<ElButton style="margin-left: 12px" :disabled="loading" link @click="refresh">
						<template #icon>
							<ElIcon :class="loading?'is-loading':''"><Refresh /></ElIcon>
						</template>
					</ElButton>
				</div>
				<ElTabs v-model="activeTab" style="min-height: 400px;margin-top: 12px">
					<ElTabPane
						v-for="group in metricGroups"
						:label="group.group.name"
						:name="group.group.id">
						<ElRow v-if="group.metrics">
							<ElCol v-for="metric in group.metrics" :span="24">
								<ElCard style="margin-bottom: 24px;background-color: rgba(0,0,0,0)">
									<template #header>
										{{metric.metric.metricLabel+(metric.metric.metricUnit?('('+metric.metric.metricUnit+')'):'')}}
									</template>
									<StratoLineChart
										:render-version="renderVersion"
										style="height: 300px"
										:chart-id="metric.metric.metricName"
										channel-x="time"
										channel-y="value"
										channel-x-name="time"
										:channel-y-name="metric.metric.metricName"
										sequence-name-key="sequenceName"
										sequence-data-key="points"
										:sequences="metric.sequences"
										:channel-x-formatter="formatTime"
									/>
								</ElCard>
							</ElCol>
						</ElRow>
					</ElTabPane>
				</ElTabs>
			</div>
		</StratoDrawer>
	</Teleport>
</template>

<style scoped>
</style>
