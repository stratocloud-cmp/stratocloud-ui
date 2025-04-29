<script setup>
import StratoTable from '@/components/StratoTable.vue';
import {ElInput, ElPopconfirm, ElTableColumn} from 'element-plus';
import { describeCapabilities } from '@/api/resource.js';
import ResourceState from '../components/ResourceState.vue';
import RelationshipState from '../components/RelationshipState.vue'
import {computed, ref} from 'vue';
import StratoButton from "@/components/StratoButton.vue";
import CreateCapabilityButton from "@/views/resource/detail/CreateCapabilityButton.vue";
import ResourceRuntimeProperties from '@/views/resource/components/ResourceRuntimeProperties.vue'
import ResourceTags from '@/views/resource/components/ResourceTags.vue'
import {runAsyncJob} from '@/api/asyncJob.js'
import {useActiveJobStore} from '@/stores/activeJob.js'
import ResourceLink from '@/views/resource/components/ResourceLink.vue'
import ResourceActionButtonsGroup from '@/views/resource/actions/ResourceActionButtonsGroup.vue'

const props = defineProps({
    resource:{
        required: true,
    },
    capability:{
        required: true,
    }
})

const relationshipSpec = props.capability.relationshipSpec

const pagingRequest = ref({targetId: props.resource.id, relationshipType: relationshipSpec.relationshipTypeId})

const selectedCapabilities = ref([])
function handleSelectionChange(rows){
	selectedCapabilities.value = rows
}

function handlerFilterChange(){

}


const capabilityTableRef = ref()

const canCreate = computed(()=>{
	return !(relationshipSpec.primaryCapability &&  capabilityTableRef.value && capabilityTableRef.value.getTotal());
})

const activeJobStore = useActiveJobStore()

function fetchDataAgain() {
	capabilityTableRef.value.fetchData()
}

function onDisconnect(){
	if(selectedCapabilities.value.length===0){
		return
	}

	runAsyncJob({
		jobType: 'BATCH_DISCONNECT_RESOURCES',
		jobParameters: {
			relationshipIds: selectedCapabilities.value.map(c=>c.id)
		}
	}).then(resp=>{
		activeJobStore.setActiveJobId(resp.jobId)
		fetchDataAgain()
	})
}

const selectedResources = computed(() => selectedCapabilities.value.map(c => c.source))

</script>

<template>
	<div style="margin-bottom: 10px;height: 20px">
		<ElSpace alignment="normal">
			<CreateCapabilityButton v-if="canCreate" :resource="props.resource" :capability="props.capability" />
			<ElPopconfirm
				v-if="!relationshipSpec.essentialRequirement && !relationshipSpec.primaryCapability && props.capability.sourceSpec.destroyable"
				:title="`确认${relationshipSpec.disconnectActionName}`"
				@confirm="onDisconnect">
				<template #reference>
					<StratoButton
						size="small"
						:disabled="selectedCapabilities.length===0"
						type="danger"
						plain>
						<span style="font-size: 12px">{{ relationshipSpec.disconnectActionName }}</span>
					</StratoButton>
				</template>
			</ElPopconfirm>

			<ResourceActionButtonsGroup
				:category="capability.sourceSpec.resourceCategoryId"
				:selected-resources="selectedResources"
				build-action-hidden
				small
				@action-submitted="fetchDataAgain"
			/>
		</ElSpace>
		<ElInput size="small" style="float: right;width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>
    <StratoTable
        ref="capabilityTableRef"
        :paging-request="pagingRequest"
        :remote-method="describeCapabilities"
        @selection-change="handleSelectionChange"
        @filter-change="handlerFilterChange"
        :default-page-size="5"
        size="small"
    >
        <ElTableColumn type="selection" reserve-selection />
        <ElTableColumn prop="sourceName" label="资源名称">
            <template #default="scope">
	            <ResourceLink
		            :resource-category="scope.row.source.category"
		            :resource-id="scope.row.source.id"
		            :resource-name="scope.row.source.name"
	            />
            </template>
        </ElTableColumn>
        <ElTableColumn prop="sourceType" label="类型">
            <template #default="scope">
                <span>{{ scope.row.source.typeName }}</span>
            </template>
        </ElTableColumn>
        <ElTableColumn prop="sourceState" label="资源状态">
            <template #default="scope">
                <ResourceState :state="scope.row.source.state" />
            </template>
        </ElTableColumn>
        <ElTableColumn prop="relationshipState" label="关联状态">
            <template #default="scope">
                <RelationshipState :state="scope.row.state" />
            </template>
        </ElTableColumn>
	    <ElTableColumn label="标签">
		    <template #default="scope">
			    <ResourceTags in-list :resource="scope.row.source" />
		    </template>
	    </ElTableColumn>
	    <ElTableColumn label="属性" width="200">
		    <template #default="scope">
			    <ResourceRuntimeProperties in-list :resource="scope.row.source" />
		    </template>
	    </ElTableColumn>
    </StratoTable>


</template>
