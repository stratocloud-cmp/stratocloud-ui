<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {computed, ref} from "vue";
import {ElInput, ElNotification} from "element-plus";
import {describeJobs, retryJob} from "@/api/job.js";
import {useSessionStore} from "@/stores/session.js";
import JobStatus from "@/views/jobs/JobStatus.vue";
import {describeAsyncJob} from '@/api/asyncJob.js'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {QuestionFilled} from '@element-plus/icons-vue'

const sessionStore = useSessionStore()

const props = defineProps({
	simpleMode: {
		required: false,
		type: Boolean,
		default: false
	},
	myJob: {
		required: false,
		type: Boolean,
		default: false
	}
})

const jobTableRef = ref()

defineExpose({refresh, getRunningJobCount})

function refresh(){
	return jobTableRef.value.fetchData()
}

const pagingRequest = ref({
	ownerIds: props.myJob ? [sessionStore.session.userId] : undefined
})

const asyncJobMap = ref(new Map())

const runningJob = ref(0)

function getRunningJobCount(){
	return runningJob.value
}

function handleListChange(listData){
	if(listData && listData.length > 0){
		const jobIds = listData.map(item=>item.id)
		describeAsyncJob({
			jobIds: jobIds,
			size: 100
		}).then(resp=>{
			if(resp?.content && resp.content.length > 0){
				for (let asyncJob of resp.content) {
					asyncJobMap.value.set(asyncJob.id, asyncJob)
				}
			}
		})
		runningJob.value = listData.filter(j => j.status === 'STARTED').length
	}
}

function isAsyncJob(jobId){
	return asyncJobMap.value.has(jobId)
}

const detailDrawerFlag = ref(false)

function openDetailDrawer(job){
	currentJobForDetail.value = job
	detailDrawerFlag.value = true
}

const currentJobForDetail = ref()

const currentAsyncJobForDetail = computed(()=>{
	if(!currentJobForDetail.value){
		return undefined
	}
	return asyncJobMap.value.get(currentJobForDetail.value.id)
})

const executionStates = [
	{
		id: 'AWAIT_START',
		name: '待开始',
		type: 'info',
	},
	{
		id: 'STARTED',
		name: '已开始',
		type: 'primary',
	},
	{
		id: 'FAILED',
		name: '已失败',
		type: 'danger',
	},
	{
		id: 'FINISHED',
		name: '已完成',
		type: 'success',
	},
	{
		id: 'DISCARDED',
		name: '已废弃',
		type: 'warning',
	},
	{
		id: 'CANCELED',
		name: '已取消',
		type: 'warning',
	},
]

const stepStates = executionStates

const taskStates = executionStates

function getStateObject(state, stateList){
	let result = stateList.find(s=>s.id === state)
	if(!result){
		result = {
			id: state,
			name: state,
			type: 'warning'
		}
	}
	return result
}

const retryLoading = ref(false)
function retry(job){
	retryLoading.value = true
	retryJob({
		jobId: job.id
	}).then(() => {
		refresh()
		ElNotification.success('重试请求已提交')
	}).finally(() => {
		retryLoading.value = false
	})
}

</script>

<template>
	<div style="margin-bottom: 10px;height: 32px">
		<span v-if="props.myJob">我的任务</span>

		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="jobTableRef"
		:size="simpleMode?'small':'default'"
		:default-page-size="simpleMode?5:10"
		:paging-request="pagingRequest"
		:remote-method="describeJobs"
		@list-change="handleListChange"
	>
		<ElTableColumn v-if="!simpleMode" type="selection" reserve-selection />
		<ElTableColumn prop="jobTypeName" label="类型" sortable="custom" />
		<ElTableColumn prop="status" label="状态" sortable="custom">
			<template #default="scope">
				<JobStatus
					:size="props.simpleMode?'small':'default'"
					:state="scope.row.status"
					:error-message="scope.row.errorMessage" />
			</template>
		</ElTableColumn>
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn prop="startedAt" label="开始时间" sortable="custom" />
		<ElTableColumn prop="endedAt" label="结束时间" sortable="custom" />
		<ElTableColumn v-if="!simpleMode" label="详情" width="120">
			<template #default="scope">
				<ElLink type="primary" :disabled="!isAsyncJob(scope.row.id)" @click="()=>openDetailDrawer(scope.row)">
					<span style="font-size: 12px">
						查看详情
					</span>
				</ElLink>
			</template>
		</ElTableColumn>
		<ElTableColumn label="操作" width="80">
			<template #default="scope">
				<ElButton
					link
					type="primary"
					:loading="retryLoading"
					:disabled="scope.row.status !== 'FAILED'"
					@click="()=>retry(scope.row)"
				>
					重试
				</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>


	<StratoDrawer :title="currentJobForDetail?.jobTypeName" v-model="detailDrawerFlag" size="800" no-confirm>
		<ElTimeline>
			<ElTimelineItem :timestamp="currentJobForDetail?.startedAt" placement="top">
			</ElTimelineItem>
			<ElTimelineItem
				v-for="(execution, index) in currentAsyncJobForDetail.executions"
				:type="getStateObject(execution.state, executionStates).type"
				:timestamp="execution.lastModifiedAt"
				placement="top"
			>
				<ElCollapse>
					<ElCollapseItem :title="`执行${index+1}`">
						<ElTimeline>
							<ElTimelineItem>
							</ElTimelineItem>
							<ElTimelineItem
								v-for="(step, stepIndex) in execution.steps"
								:type="getStateObject(step.state, stepStates).type"
								:timestamp="step.lastModifiedAt"
								placement="top"
							>
								<ElCollapse>
									<ElCollapseItem :title="`步骤${stepIndex+1}`">
										<ElTimeline>
											<ElTimelineItem>
											</ElTimelineItem>
											<ElTimelineItem
												v-for="task in step.tasks"
												:type="getStateObject(task.state, taskStates).type"
												:timestamp="task.lastModifiedAt"
												placement="top"
											>
												<div>
													{{task.name}}
													<ElTooltip v-if="task.message">
														<ElIcon><QuestionFilled /></ElIcon>
														<template #content>
															<div
																style="max-width: 500px;white-space: pre-wrap;max-height: 300px;overflow: auto"
																v-html="task.message">
															</div>
														</template>
													</ElTooltip>
												</div>
												<div>{{task.entityDescription}}</div>
											</ElTimelineItem>
											<ElTimelineItem>
											</ElTimelineItem>
										</ElTimeline>
									</ElCollapseItem>
								</ElCollapse>
							</ElTimelineItem>
							<ElTimelineItem>
							</ElTimelineItem>
						</ElTimeline>
					</ElCollapseItem>
				</ElCollapse>
			</ElTimelineItem>
			<ElTimelineItem :timestamp="currentJobForDetail?.endedAt" placement="top">
			</ElTimelineItem>
		</ElTimeline>
	</StratoDrawer>
</template>

<style scoped>

</style>
