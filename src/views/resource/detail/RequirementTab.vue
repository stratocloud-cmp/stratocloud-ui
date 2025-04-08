<script setup>
import StratoTable from '@/components/StratoTable.vue';
import {ElTableColumn, ElPopconfirm, ElInput} from 'element-plus';
import { describeRequirements } from '@/api/resource.js';
import ResourceState from '../components/ResourceState.vue';
import RelationshipState from '../components/RelationshipState.vue'
import {computed, ref} from 'vue';
import StratoButton from "@/components/StratoButton.vue";
import StratoDrawer from "@/components/StratoDrawer.vue";
import ConnectResourcesForm from "@/views/resource/forms/relationship/ConnectResourcesForm.vue";
import ChangeEssentialTargetForm from "@/views/resource/forms/relationship/ChangeEssentialTargetForm.vue";
import {runAsyncJob} from '@/api/asyncJob.js'
import {useActiveJobStore} from '@/stores/activeJob.js'
import ResourceRuntimeProperties from '@/views/resource/components/ResourceRuntimeProperties.vue'
import ResourceTags from '@/views/resource/components/ResourceTags.vue'
import ResourceLink from '@/views/resource/components/ResourceLink.vue'
import ChangeEssentialTargetPriceInquiry
	from '@/views/resource/forms/relationship/ChangeEssentialTargetPriceInquiry.vue'
import AddToCartButton from '@/views/cart/AddToCartButton.vue'

const props = defineProps({
    resource:{
        required: true,
    },
    requirement:{
        required: true,
    }
})


const activeJobStore = useActiveJobStore()

const relationshipSpec = props.requirement.relationshipSpec

const pagingRequest = ref({sourceId: props.resource.id, relationshipType: relationshipSpec.relationshipTypeId})

const selectedRequirements = ref([])

function handleSelectionChange(rows){
	selectedRequirements.value = rows
}

function handlerFilterChange(){

}


const connectButtonDisabled = computed(()=>{
	const exclusiveRequirementExisted = relationshipSpec.exclusiveRequirement && requirementTableRef.value?.getTotal()>0
	const sourceStateNotAllowed = !relationshipSpec.allowedSourceStates?.includes(props.resource.state)
	return exclusiveRequirementExisted || sourceStateNotAllowed
})
const connectDrawerFlag = ref(false)
const connectFormRef = ref()
const connectDrawerLoading = ref(false)
const connectFormData = ref({
	sourceResourceId: props.resource.id,
	relationshipTypeId: relationshipSpec.relationshipTypeId,
	relationshipInputs: {}
})
function onOpenConnectDrawer(){
	connectDrawerFlag.value = true
}
function onConnect(){
	connectFormRef.value.validate(valid=>{
		if(!valid) return
		connectDrawerLoading.value = true
		runAsyncJob({
			jobType: 'BATCH_CONNECT_RESOURCES',
			jobParameters: {
				connections: [connectFormData.value]
			}
		}).then(resp=>{
			activeJobStore.setActiveJobId(resp.jobId)
			requirementTableRef.value.fetchData()
			connectDrawerFlag.value = false
		}).finally(()=>{
			connectDrawerLoading.value = false
		})
	})
}


const changeDrawerFlag = ref(false)
const changeFormRef = ref()
const changeFormLoading = ref(false)
const changeFormData = ref({
	sourceId: props.resource.id,
	relationshipTypeId: relationshipSpec.relationshipTypeId,
	newTargetId: undefined,
	relationshipInputs: {}
})
function onOpenChangeDrawer(){
	changeDrawerFlag.value = true
}
function onChangeEssentialTarget(){
	changeFormRef.value.validate(valid=>{
		if(!valid) return
		changeFormLoading.value = true
		runAsyncJob({
			jobType: 'BATCH_CHANGE_ESSENTIAL_REQUIREMENTS',
			jobParameters: {
				changes: [changeFormData.value]
			}
		}).then(resp=>{
			activeJobStore.setActiveJobId(resp.jobId)
			requirementTableRef.value.fetchData()
			changeDrawerFlag.value = false
		}).finally(()=>{
			changeFormLoading.value = false
		})
	})
}

function onDisconnect(){
	if(selectedRequirements.value.length===0){
		return
	}

	runAsyncJob({
		jobType: 'BATCH_DISCONNECT_RESOURCES',
		jobParameters: {
			relationshipIds: selectedRequirements.value.map(r=>r.id)
		}
	}).then(resp=>{
		activeJobStore.setActiveJobId(resp.jobId)
		requirementTableRef.value.fetchData()
	})
}

const requirementTableRef = ref()

function closeChangeDrawer(){
	changeDrawerFlag.value = false
}

function closeConnectDrawer(){
	connectDrawerFlag.value = false
}

</script>
<template>
	<div style="margin-bottom: 10px;height: 20px">
		<StratoButton
			v-if="relationshipSpec.changeableEssential"
			size="small"
			plain
			type="success"
			@click="onOpenChangeDrawer"
			:disabled="selectedRequirements.length===0"
		>
			<span style="font-size: 12px">
				变更{{ props.requirement.targetSpec.resourceCategoryName }}
			</span>
		</StratoButton>
		<StratoButton
			size="small"
			plain
			type="success"
			v-if="!relationshipSpec.essentialRequirement && !relationshipSpec.essentialPrimaryCapability"
			:disabled="connectButtonDisabled"
			disabled-message="该资源当前无法挂载到此目标"
			@click="onOpenConnectDrawer">
			<span style="font-size: 12px">{{ relationshipSpec.connectActionName }}</span>
		</StratoButton>
		<ElPopconfirm
			v-if="!relationshipSpec.essentialRequirement && !relationshipSpec.essentialPrimaryCapability"
			:title="`确认${relationshipSpec.disconnectActionName}`"
			@confirm="onDisconnect">
			<template #reference>
				<StratoButton
					size="small"
					:disabled="selectedRequirements.length===0"
					type="danger"
					plain>
					<span style="font-size: 12px">{{ relationshipSpec.disconnectActionName }}</span>
				</StratoButton>
			</template>
		</ElPopconfirm>
		<ElInput size="small" style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>
    <StratoTable        
        ref="requirementTableRef"
        :paging-request="pagingRequest" 
        :remote-method="describeRequirements" 
        @selection-change="handleSelectionChange"
        @filter-change="handlerFilterChange"
        :default-page-size="5"
        size="small"
    >
        <ElTableColumn type="selection" reserve-selection :selectable="row => row.state!=='DISCONNECTED'" />
        <ElTableColumn prop="targetName" label="资源名称">
            <template #default="scope">
	            <ResourceLink
		            :resource-category="scope.row.target.category"
		            :resource-id="scope.row.target.id"
		            :resource-name="scope.row.target.name"
	            />
            </template>
        </ElTableColumn>
        <ElTableColumn prop="targetType" label="类型">
            <template #default="scope">
                <span>{{ scope.row.target.typeName }}</span>
            </template>
        </ElTableColumn>
        <ElTableColumn prop="targetState" label="资源状态">
            <template #default="scope">
                <ResourceState :state="scope.row.target.state" />
            </template>
        </ElTableColumn>
        <ElTableColumn prop="relationshipState" label="关联状态">
            <template #default="scope">
                <RelationshipState :state="scope.row.state" />
            </template>
        </ElTableColumn>
	    <ElTableColumn label="标签">
		    <template #default="scope">
			    <ResourceTags in-list :resource="scope.row.target" />
		    </template>
	    </ElTableColumn>
	    <ElTableColumn label="属性" width="200">
		    <template #default="scope">
			    <ResourceRuntimeProperties in-list :resource="scope.row.target" />
		    </template>
	    </ElTableColumn>
    </StratoTable>

	<StratoDrawer
		v-model="connectDrawerFlag"
		size="800"
		:title="relationshipSpec.requirementName"
		@onConfirm="onConnect"
		:loading="connectDrawerLoading"
	>
		<ConnectResourcesForm
			ref="connectFormRef"
			v-model="connectFormData" />

		<template #footer v-if="connectDrawerFlag">
			<AddToCartButton
				style="margin-left: 36px"
				job-type="BATCH_CONNECT_RESOURCES"
				:job-parameters="{connections: [connectFormData]}"
				:form-ref="connectFormRef"
				@confirm="closeConnectDrawer"
			/>
		</template>
	</StratoDrawer>
	<StratoDrawer
		v-model="changeDrawerFlag"
		size="800"
		:title="`变更${props.requirement.targetSpec.resourceCategoryName}`"
		@onConfirm="onChangeEssentialTarget"
		:loading="changeFormLoading"
	>
		<ChangeEssentialTargetForm
			ref="changeFormRef"
			v-model="changeFormData" />

		<template #footer v-if="changeDrawerFlag">
			<ChangeEssentialTargetPriceInquiry :form-data="changeFormData" />
			<AddToCartButton
				style="margin-left: 36px"
				job-type="BATCH_CHANGE_ESSENTIAL_REQUIREMENTS"
				:job-parameters="{changes: [changeFormData]}"
				:form-ref="changeFormRef"
				@confirm="closeChangeDrawer"
			/>
		</template>
	</StratoDrawer>
</template>