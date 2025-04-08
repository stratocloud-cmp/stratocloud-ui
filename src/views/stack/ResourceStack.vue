<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {ref} from "vue";
import {ElInput} from "element-plus";
import {describeStacks} from '@/api/resourceStack.js'
import ResourceStackState from '@/views/stack/ResourceStackState.vue'
import RecycleBinButton from '@/views/stack/actions/RecycleBinButton.vue'
import CreateStacksButton from '@/views/stack/actions/CreateStacksButton.vue'
import RecycleStacksButton from '@/views/stack/actions/RecycleStacksButton.vue'
import TransferStacksButton from '@/views/stack/actions/TransferStacksButton.vue'
import UpdateStackBasicsButton from '@/views/stack/actions/UpdateStackBasicsButton.vue'
import RestoreStacksButton from '@/views/stack/actions/RestoreStacksButton.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import ResourceStackDetail from '@/views/stack/ResourceStackDetail.vue'
import ResourceTags from '@/views/resource/components/ResourceTags.vue'
import DropStacksButton from '@/views/stack/actions/DropStacksButton.vue'

const props = defineProps({
	recycleBinMode: {
		type: Boolean,
		required: false,
		default: false
	}
})

const pagingRequest = ref({
	recycled: props.recycleBinMode,
})

const selectedStacks = ref([])

const tableRef = ref()


function handleSelectionChange(rows) {
	selectedStacks.value = rows
}


function refresh() {
	tableRef.value.fetchData()
}

const detailDrawerFlag = ref(false)
const detailStack = ref()
function openDetailDrawer(stack){
	detailStack.value = stack
	detailDrawerFlag.value = true
}


function handleListChange(listData){
	if(!listData || listData.length === 0){
		return
	}

	if(selectedStacks.value.length>0){
		selectedStacks.value = listData.filter(item=>selectedStacks.value.findIndex(s=>s.id === item.id)!==-1)
	}

	if(detailStack.value){
		detailStack.value = listData.find(item=>item.id === detailStack.value.id)

		if(!detailStack.value){
			detailDrawerFlag.value = false
		}
	}

}


</script>

<template>
	<div style="margin-bottom: 10px;">
		<template v-if="!recycleBinMode">
			<ElSpace>
				<CreateStacksButton @confirm="refresh" />

				<UpdateStackBasicsButton :selected-stacks="selectedStacks" @confirm="refresh" />

				<TransferStacksButton :selected-stacks="selectedStacks" @confirm="refresh" />

				<RecycleStacksButton :selected-stacks="selectedStacks" @confirm="refresh" />

				<DropStacksButton :selected-stacks="selectedStacks" @confirm="refresh" />

				<RecycleBinButton />
			</ElSpace>
		</template>

		<RestoreStacksButton
			:recycle-bin-mode="recycleBinMode"
			:selected-stacks="selectedStacks"
			@confirm="refresh"
		/>

		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="tableRef"
		:paging-request="pagingRequest"
		:remote-method="describeStacks"
		@selection-change="handleSelectionChange"
		@list-change="handleListChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom">
			<template #default="scope">
				<ElLink type="primary" @click="()=>openDetailDrawer(scope.row)">
					{{scope.row.name}}
				</ElLink>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="state" label="状态" sortable="custom">
			<template #default="scope">
				<ResourceStackState :state="scope.row.state" />
			</template>
		</ElTableColumn>
		<ElTableColumn label="标签">
			<template #default="scope">
				<ResourceTags :resource="scope.row" in-list />
			</template>
		</ElTableColumn>
		<ElTableColumn prop="ownerId" label="所有者">
			<template #default="scope">
				{{scope.row.ownerRealName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="description" label="描述" />
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn prop="expireTime" label="到期时间" sortable="custom" />
	</StratoTable>

	<StratoDrawer v-model="detailDrawerFlag" title="资源栈详情" :size="800" no-confirm>
		<ResourceStackDetail :stack="detailStack" />
	</StratoDrawer>
</template>

<style scoped>

</style>