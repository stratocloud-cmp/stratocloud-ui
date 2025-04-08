<script setup>
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import StratoButton from '@/components/StratoButton.vue'
import ClaimResourcesForm from '@/views/resource/forms/ownership/ClaimResourcesForm.vue'
import {createJob} from '@/api/job.js'
import {useActiveJobStore} from '@/stores/activeJob.js'

const props = defineProps({
	small: {
		required: false,
		type: Boolean,
		default: false
	},
	category: {
		required: true
	},
})

const emits = defineEmits(['actionSubmitted'])

function emitsActionSubmitted(){
	emits('actionSubmitted')
}

const formData = ref([])

const drawerFlag = ref(false)
const buttonLoading = ref(false)
const formRef = ref()

const activeJobStore = useActiveJobStore()

function openClaimDrawer(){
	formData.value = []
	formData.value.push({
		resourceId: undefined,
		enableCascadedClaim: true
	})
	drawerFlag.value = true
}

function confirmClaim(){
	formRef.value.validate(valid=>{
		if (!valid) return
		buttonLoading.value = true
		createJob({
			jobType: 'CLAIM_RESOURCES',
			jobParameters: {
				claims: formData.value
			}
		}).then(resp=>{
			drawerFlag.value = false
			activeJobStore.setActiveJobId(resp.jobId)
			emitsActionSubmitted()
		}).finally(() => {
			buttonLoading.value = false
		})
	})
}


</script>

<template>
	<StratoButton
		:style="$attrs.style"
		:size="small?'small':'default'"
		:loading="buttonLoading"
		@click="openClaimDrawer"
		plain>
		<span :style="small?{fontSize: '12px'}:{}">认领</span>
	</StratoButton>
	<StratoDrawer
		v-model="drawerFlag"
		:size="800"
		title="认领资源"
		@on-confirm="confirmClaim"
		:loading="buttonLoading"
	>
		<ClaimResourcesForm
			v-if="drawerFlag"
			ref="formRef"
			v-model="formData"
			:resource-category="category"
		/>
	</StratoDrawer>
</template>

<style scoped>

</style>
