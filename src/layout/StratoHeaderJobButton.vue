<script setup>

import Job from "@/views/jobs/Job.vue";
import {computed, ref, watch} from "vue";
import {useActiveJobStore} from "@/stores/activeJob.js";
import {Check} from "@element-plus/icons-vue";

const popOverVisible = ref(false)
const jobRef = ref()

const activeJobStore = useActiveJobStore()

const showNewJobSubmittedMessage = ref(false)

watch(()=>activeJobStore.activeJobId, ()=>{
	if(activeJobStore.activeJobId === undefined){
		return
	}
	jobRef.value.refresh().then(()=>{
		popOverVisible.value = true
		showNewJobSubmittedMessage.value = true
		setTimeout(()=>{
			popOverVisible.value = false
			showNewJobSubmittedMessage.value = false
		}, 5000)
	})
})

const runningJobCount = computed(() => jobRef.value ? jobRef.value.getRunningJobCount() : 0)

</script>

<template>
	<ElPopover v-model:visible="popOverVisible" placement="bottom-end" :width="800" trigger="click">
		<template #reference>
			<ElBadge :is-dot="runningJobCount > 0" type="warning" :offset="[-10, 10]">
				<ElButton size="large" class="job-button" icon="List" />
			</ElBadge>
		</template>
		<ElText
			v-if="showNewJobSubmittedMessage"
			style="float: left; margin-right: 20px"
			type="success">
			<ElIcon><Check /></ElIcon>任务已提交
		</ElText>
		<Job ref="jobRef" simple-mode my-job />
	</ElPopover>
</template>

<style lang="scss">
.job-button{
	color: white;
	border: 0;
}
.job-button:hover{
	background-color: rgba(7, 0, 112, 0.25);
	color: white;
}
.el-popover.el-popper{
	background: rgba(55, 55, 55, .5);
	backdrop-filter: blur(20px);
}
</style>
