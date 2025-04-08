<script setup>
import StratoTable from '@/components/StratoTable.vue';
import {computed, onMounted, ref, watch} from 'vue';
import {describeResources} from '@/api/resource';
import {onBeforeRouteUpdate, useRouter} from 'vue-router';
import StratoButton from '@/components/StratoButton.vue';
import {ElIcon, ElInput, ElLink, ElTableColumn} from 'element-plus';
import ResourceDetail from './detail/ResourceDetail.vue'
import StratoDrawer from '@/components/StratoDrawer.vue';
import ResourceState from './components/ResourceState.vue';
import ResourceTags from "@/views/resource/components/ResourceTags.vue";
import ResourceRuntimeProperties from "@/views/resource/components/ResourceRuntimeProperties.vue";
import ResourceActionButtonsGroup from "@/views/resource/actions/ResourceActionButtonsGroup.vue";
import ResourceSyncState from "@/views/resource/components/ResourceSyncState.vue";
import {Delete} from '@element-plus/icons-vue'
import {useSessionStore} from '@/stores/session.js'
import ClaimResourcesButton from '@/views/resource/actions/ClaimResourcesButton.vue'
import {ResourceStates, ResourceSyncStates} from '@/views/resource/components/ResourceConstants.js'
import UserSelector from '@/views/user/UserSelector.vue'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'
import {isEqual} from 'lodash'
import RecycleBinButtonsGroup from '@/views/resource/actions/RecycleBinButtonsGroup.vue'
import ResourceQuickStats from '@/views/resource/components/ResourceQuickStats.vue'

const props = defineProps({
    recycled: {
        required: false,
        default: false
    },
    simpleMode: {
        required: false,
        default: false
    }
})

const pagingRequest = ref({
    recycled: props.recycled,
	ownerIds: [],
	tagsMap: {}
})

const router = useRouter()

const sessionStore = useSessionStore()

const resourceTableRef = ref()

const singleResourceId = ref()
const singleResourceName = ref()

const selectedResources = ref([])

const detailDrawerFlag = ref(false)
const detailDrawerResource = ref()

const recycleBinDrawerFlag = ref(false)

function handleSelectionChange(rows){
    selectedResources.value = rows
}



function initPagingRequest(toRoute){
    const category = toRoute?.params?.category
	const id = toRoute?.query?.id
	const name = toRoute?.query?.name
    if(category){
        pagingRequest.value.resourceCategories = [category]
	    currentCategory.value = category
	    tagRequest.value.resourceCategories = [category]
    }
	if(id && name){
		singleResourceId.value = id
		singleResourceName.value = name
		pagingRequest.value.resourceIds = [id]
		detailDrawerFlag.value = false
	}
}

function onSingleResourceTagClosed(){
	singleResourceId.value = undefined
	singleResourceName.value = undefined
	pagingRequest.value.resourceIds = undefined
	router.push(`/resource/list/${router.currentRoute.value.params.category}`)
}

function openDetailDrawer(row){
    detailDrawerResource.value = row
    detailDrawerFlag.value = true
}

function openRecycleBinDrawer(){
    recycleBinDrawerFlag.value = true
}

const buttonsGroup = ref()

onBeforeRouteUpdate(toRoute=>{
    initPagingRequest(toRoute)
	// buttonsGroup.value.fetchActions()
})

onMounted(()=>{
    initPagingRequest(router.currentRoute.value)
	initStateFilters()
	initSyncStateFilters()
})

function fetchDataAgain(){
	resourceTableRef.value.fetchData()
}

function handleListChange(listData){
	if(!listData || listData.length === 0){
		return
	}

	if(selectedResources.value.length>0){
		selectedResources.value = listData.filter(item=>selectedResources.value.findIndex(r=>r.id === item.id)!==-1)
	}

	if(detailDrawerResource.value){
		detailDrawerResource.value = listData.find(item=>item.id === detailDrawerResource.value.id)

		if(!detailDrawerResource.value){
			detailDrawerFlag.value = false
		}
	}

}


const currentCategory = ref()

const fetchingDestroyed = ref(false)
function handleFetchDestroyedChange(value){
	if(value){
		fetchingDestroyed.value = true
		pagingRequest.value.states = ['DESTROYED']
	}else {
		fetchingDestroyed.value = false
		pagingRequest.value.states = undefined
	}
}

const stateFilters = ref([])

function initStateFilters(){
	for(let key in ResourceStates){
		stateFilters.value.push({
			text: ResourceStates[key].name,
			value: key
		})
	}
}

const syncStateFilters = ref([])

function initSyncStateFilters(){
	for(let key in ResourceSyncStates){
		syncStateFilters.value.push({
			text: ResourceSyncStates[key].name,
			value: key
		})
	}
}

function handlerFilterChange(newFilters){
	if('state' in newFilters){
		pagingRequest.value.states = newFilters.state
	}
	if('syncState' in newFilters){
		pagingRequest.value.syncStates = newFilters.syncState
	}
}

const selectedTags = ref([])

const tagRequest = ref({
	requiredWhenFiltering: true,
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

function checkIsMonitoredCategory(){
	return [
		'COMPUTE_INSTANCE',
		'CONTAINER',
		'ELASTIC_IP',
		'DISK',
		'CLUSTER',
		'HOST',
		'LOAD_BALANCER',
		'DATASTORE',
	].includes(currentCategory.value)
}

const isMonitoredCategory = computed(checkIsMonitoredCategory)

</script>
<template>
    <div style="margin-bottom: 10px;height: 32px">
        <template v-if="!simpleMode">
	        <ResourceActionButtonsGroup
		        v-if="currentCategory"
		        ref="buttonsGroup"
		        @action-submitted="fetchDataAgain"
		        :selected-resources="selectedResources"
		        :category="currentCategory" />

            <StratoButton style="margin-left: 10px;" @click="openRecycleBinDrawer" plain>
                <ElIcon><Delete /></ElIcon>
                回收站
            </StratoButton>

	        <template v-if="sessionStore.hasPermission('Resource', 'CLAIM')">
		        <ClaimResourcesButton
			        style="margin-left: 10px;"
			        :category="currentCategory"
			        @action-submitted="fetchDataAgain"
		        />
	        </template>


	        <ElTag style="margin-left: 30px" v-if="singleResourceId" closable @close="onSingleResourceTagClosed">
		        资源:&nbsp;{{singleResourceName}}
	        </ElTag>
        </template>

	    <template v-if="recycled">
		    <ElSpace alignment="normal">
			    <RecycleBinButtonsGroup
				    v-if="currentCategory && !fetchingDestroyed"
				    ref="recycleBinButtonsGroup"
				    @action-submitted="fetchDataAgain"
				    :selected-resources="selectedResources"
				    :category="currentCategory"
			    />
			    <ElCheckbox @change="handleFetchDestroyedChange">查看已销毁</ElCheckbox>
		    </ElSpace>
	    </template>


        <ElInput style="float: right; width: 15%;" v-model="pagingRequest.search" suffix-icon="search" />
    </div>
    <StratoTable
	    :size="recycled?'small':'default'"
        ref="resourceTableRef"
        v-if="pagingRequest.resourceCategories"
        :paging-request="pagingRequest"
        :remote-method="describeResources"
        @selection-change="handleSelectionChange"
        @filter-change="handlerFilterChange"
        @list-change="handleListChange"
    >
        <ElTableColumn type="selection" reserve-selection />
        <ElTableColumn prop="name" label="资源名称" sortable="custom" min-width="100">
            <template #default="scope">
                <ElLink @click="()=>openDetailDrawer(scope.row)" type="primary">{{ scope.row.name }}</ElLink>
            </template>
        </ElTableColumn>
        <ElTableColumn prop="type" label="类型" sortable="custom">
            <template #default="scope">
                <span>{{ scope.row.typeName }}</span>
            </template>
        </ElTableColumn>
        <ElTableColumn
	        prop="state"
	        label="资源状态"
	        column-key="state"
	        :filters="stateFilters"
	        sortable="custom"
	        :min-width="90">
            <template #default="scope">
                <ResourceState :state="scope.row.state" />
            </template>
        </ElTableColumn>
	    <ElTableColumn
		    v-if="!simpleMode"
		    prop="syncState"
		    label="同步状态"
		    column-key="syncState"
		    :filters="syncStateFilters"
		    sortable="custom"
		    :min-width="90"
	    >
		    <template #default="scope">
			    <ResourceSyncState :state="scope.row.syncState" />
		    </template>
	    </ElTableColumn>
	    <ElTableColumn label="标签">
		    <template #default="scope">
			    <ResourceTags in-list :resource="scope.row" />
		    </template>
		    <template #header>
			    <span>
				    标签
				    <ElPopover trigger="click" width="260">
					    <template #reference>
						    <ElButton
							    icon="Search"
							    :style="{color: selectedTags.length>0?'#409eff':undefined}"
							    link
						    />
					    </template>
					    <TagValueSelectorGroup
						    v-model="selectedTags"
						    :default-add-all-entries="false"
						    :entry-paging-request="tagRequest"
					    />
				    </ElPopover>
			    </span>
		    </template>
	    </ElTableColumn>
	    <ElTableColumn label="属性" width="200">
		    <template #default="scope">
			    <ResourceRuntimeProperties in-list :resource="scope.row" />
		    </template>
	    </ElTableColumn>
	    <ElTableColumn label="监控" width="180" v-if="isMonitoredCategory && !recycled" :show-overflow-tooltip="false">
		    <template #default="scope">
			    <ResourceQuickStats :hide-after="2" :span="12" :resource-id="scope.row.id" />
		    </template>
	    </ElTableColumn>
	    <ElTableColumn prop="ownerId" label="所有者">
		    <template #default="scope">
			    <span>{{scope.row.ownerRealName}}</span>
		    </template>
		    <template #header>
			    <span>
				    所有者
				    <ElPopover trigger="click" width="260">
					    <template #reference>
						    <ElButton
							    icon="Search"
							    :style="{color: pagingRequest.ownerIds.length>0?'#409eff':undefined}"
							    link
						    />
					    </template>
					    <UserSelector v-model="pagingRequest.ownerIds" multiple />
				    </ElPopover>
			    </span>
		    </template>
	    </ElTableColumn>
	    <ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
	    <ElTableColumn v-if="recycled" prop="recycledTime" label="回收时间" sortable="custom" />
    </StratoTable>

    <StratoDrawer :size="1000" v-model="detailDrawerFlag" title="资源详情" no-confirm>
        <ResourceDetail v-if="detailDrawerFlag" :resource="detailDrawerResource" @refresh="fetchDataAgain" />
    </StratoDrawer>
    <StratoDrawer :size="1050" v-model="recycleBinDrawerFlag" title="回收站" no-confirm>
        <Resource v-if="recycleBinDrawerFlag" :simple-mode="true" :recycled="true" />
    </StratoDrawer>
</template>
