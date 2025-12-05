<script setup>
import StratoTable from '@/components/StratoTable.vue';
import {onMounted, ref, watch} from 'vue';
import {describeResources} from '@/api/resource';
import {ElTableColumn} from 'element-plus';
import {isEqual} from 'lodash'
import {
	useResourceContext,
	useResourceTypeDef
} from '@/views/resource/composables/ResourceContext.js'
import {useAccountContext} from '@/views/resource/composables/AccountContext.js'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'

const props = defineProps({
	resourceCategory: {
		required: true,
	},
	resourceTypeId: {
		required: true,
	},
})

const resourceTypeDef = useResourceTypeDef(()=>props.resourceTypeId)

const resourceId = defineModel()

const resourceContext = useResourceContext(resourceTypeDef, resourceId)
const sharedTargetIds = resourceContext.sharedTargetIds

const accountId = ref()
const accountContext = useAccountContext(accountId)

const resourceTableRef = ref()

const selectedResource = ref()

const pagingRequest = ref({
	recycled: false,
	ownerIds: [],
	tagsMap: {},
	requirementTargetIds: sharedTargetIds.value,
	accountIds: accountContext.accountId.value?[accountContext.accountId.value]:undefined,
	resourceTypes: [props.resourceTypeId]
})

watch(sharedTargetIds, ()=>{
	pagingRequest.value.requirementTargetIds = sharedTargetIds.value
},{deep: true})

watch(accountContext.accountId, ()=>{
	pagingRequest.value.accountIds = accountContext.accountId.value?[accountContext.accountId.value]:undefined
})


function handleCurrentChange(row){
	if(row){
		accountId.value = row.accountId
		resourceId.value = row.id
	}
}


onMounted(()=>{
})

const emits = defineEmits(['clearValidation'])

const selectedAreaLoading = ref(false)
watch(resourceId, () => {
	if(resourceId.value){
		selectedAreaLoading.value = true
		describeResources({
			resourceIds: [resourceId.value],
		}).then(resp => {
			selectedResource.value = resp.content[0]
		}).finally(() => {
			selectedAreaLoading.value = false
		})
		emits('clearValidation')
	} else {
		selectedResource.value = undefined
	}
}, {immediate: true})

const selectedTags = ref([])

const tagRequest = ref({
	requiredWhenFiltering: true,
	resourceCategories: [props.resourceCategory]
})

watch(selectedTags, () => {
	const tagsMap = {}
	for (let tag of selectedTags.value) {
		if(!tag.tagKey || !tag.tagValue){
			continue
		}

		if(!tagsMap[tag.tagKey]){
			tagsMap[tag.tagKey] = []
		}
		tagsMap[tag.tagKey].push(tag.tagValue)
	}

	if(!isEqual(pagingRequest.value.tagsMap, tagsMap)){
		pagingRequest.value.tagsMap = tagsMap
	}

}, {deep: true})

function clearSelection(){
	resourceTableRef.value?.setCurrentRow(undefined)
	resourceId.value = undefined
}

</script>
<template>
	<div style="width: 100%">
		<div style="width: 100%">
			<ElRow :gutter="24">
				<ElCol :span="12">
					<TagValueSelectorGroup
						v-model="selectedTags"
						:default-add-all-entries="true"
						:entry-paging-request="tagRequest"
						:resource-type="resourceTypeId"
					/>
				</ElCol>
				<ElCol v-loading="selectedAreaLoading" :span="12">
					<ElInput>
						<template #prefix>
							<ElTag v-if="selectedResource" closable @close="clearSelection">
								当前已选择：{{selectedResource.name}}
							</ElTag>
							<ElTag v-else type="warning">
								当前尚未选择
							</ElTag>
						</template>
					</ElInput>
				</ElCol>
			</ElRow>

		</div>
		<div style="width: 100%; margin-top: 12px; margin-bottom: 12px">
			<StratoTable
				size="small"
				ref="resourceTableRef"
				:paging-request="pagingRequest"
				:remote-method="describeResources"
				@current-change="handleCurrentChange"
				highlight-current-row
				:default-page-size="5"
			>
				<ElTableColumn width="40">
					<template #default="scope">
						<ElRadio v-model="resourceId" :value="scope.row.id" />
					</template>
				</ElTableColumn>
				<ElTableColumn prop="name" label="名称" sortable="custom" width="180" />
				<ElTableColumn label="属性" :show-overflow-tooltip="false">
					<template #default="scope">
						<template v-if="scope.row.runtimeProperties && scope.row.runtimeProperties.length > 0">
							<template v-for="runtimeProperty in scope.row.runtimeProperties">
								<ElTag
									v-show="runtimeProperty.displayable"
									type="info"
									style="margin-right: 2px"
								>
									<div style="display: flex;flex-wrap: nowrap">
										<div style="text-overflow: ellipsis">
											{{runtimeProperty.keyName}}:&nbsp;{{runtimeProperty.valueName}}
										</div>
									</div>
								</ElTag>
							</template>
						</template>
					</template>
				</ElTableColumn>
			</StratoTable>
		</div>


	</div>
</template>
