<script setup>
import StratoButton from "@/components/StratoButton.vue";
import {ref} from "vue";
import StratoDrawer from "@/components/StratoDrawer.vue";
import CreateResourceForm from "@/views/resource/forms/create/CreateResourceForm.vue";
import ConnectResourcesForm from "@/views/resource/forms/relationship/ConnectResourcesForm.vue";
import {runAsyncJob} from '@/api/asyncJob.js'
import {useActiveJobStore} from '@/stores/activeJob.js'

const props = defineProps({
	resource:{
		required: true,
	},
	capability:{
		required: true,
	}
})

const capabilityMode = ref('CREATE')

const activeJobStore = useActiveJobStore()

const relationshipSpec = props.capability.relationshipSpec

const drawerLoading = ref(false)

const createCapabilityDrawerFlag = ref(false)
const createCapabilityFormRef = ref()
const createNewCapabilityResourceFormData = ref({
	tenantId: props.resource.tenantId,
	ownerId: props.resource.ownerId,
	resource: {
		resourceTypeId: props.capability.sourceSpec.resourceTypeId,
		externalAccountId: props.resource.accountId,
		properties: {},
		tags: []
	},
	number: 1,
	requirements: [{
		targetResourceId: props.resource.id,
		relationshipTypeId: relationshipSpec.relationshipTypeId,
		relationshipInputs: {}
	}],
	capabilities: []
})
const connectFormRef = ref()
const connectFormData = ref({
	targetResourceId: props.resource.id,
	relationshipTypeId: relationshipSpec.relationshipTypeId,
	relationshipInputs: {}
})
function onOpenCreateCapabilityDrawer(){
	createCapabilityDrawerFlag.value = true
}
function onCreateCapability(){
	let request = undefined
	let formRef = undefined
	if(capabilityMode.value === 'CREATE'){
		request = {
			jobType: 'BATCH_CREATE_RESOURCES',
			jobParameters: {
				resources: [createNewCapabilityResourceFormData.value]
			}
		}
		formRef = createCapabilityFormRef
	}else if(capabilityMode.value === 'CONNECT'){
		request = {
			jobType: 'BATCH_CONNECT_RESOURCES',
			jobParameters: {
				connections: [connectFormData.value]
			}
		}
		formRef = connectFormRef
	}else {
		return
	}
	formRef.value.validate(valid=>{
		if (!valid) return
		drawerLoading.value = true
		runAsyncJob(request).then(resp=>{
			activeJobStore.setActiveJobId(resp.jobId)
			createCapabilityDrawerFlag.value = false
		}).finally(()=>{
			drawerLoading.value = false
		})
	})
}
</script>

<template>
	<StratoButton
		v-if="props.capability.sourceSpec.buildable"
		size="small"
		plain
		type="success"
		@click="onOpenCreateCapabilityDrawer">
		<span style="font-size: 12px">{{ relationshipSpec.connectActionName }}</span>
	</StratoButton>

	<StratoDrawer
		v-model="createCapabilityDrawerFlag"
		:title="relationshipSpec.capabilityName"
		size="800"
		:loading="drawerLoading"
		@onConfirm="onCreateCapability">
		<ElRadioGroup v-model="capabilityMode" style="margin-bottom: 20px">
			<ElRadioButton
				:label="`新建${props.capability.sourceSpec.resourceCategoryName}`"
				value="CREATE" />
			<ElRadioButton
				:label="`使用已有${props.capability.sourceSpec.resourceCategoryName}`"
				:disabled="relationshipSpec.essentialRequirement || relationshipSpec.primaryCapability"
				value="CONNECT" />
		</ElRadioGroup>
		<CreateResourceForm
			v-if="capabilityMode==='CREATE'"
			ref="createCapabilityFormRef"
			:resource-category="props.capability.sourceSpec.resourceCategoryId"
			v-model="createNewCapabilityResourceFormData" />
		<ConnectResourcesForm
			v-if="capabilityMode==='CONNECT'"
			ref="connectFormRef"
			v-model="connectFormData" />
	</StratoDrawer>
</template>

<style scoped>

</style>