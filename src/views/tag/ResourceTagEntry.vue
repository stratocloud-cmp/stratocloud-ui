<script setup>
import {ElInput, ElPopconfirm, ElTableColumn} from 'element-plus'
import {ref} from 'vue'
import StratoTable from '@/components/StratoTable.vue'
import {deleteTagEntries, describeTagEntries} from '@/api/tag.js'
import TagValuesButton from '@/views/tag/TagValuesButton.vue'
import CreateEntryButton from '@/views/tag/CreateEntryButton.vue'
import StratoButton from '@/components/StratoButton.vue'
import UpdateEntryButton from '@/views/tag/UpdateEntryButton.vue'

const props = defineProps({
	simpleMode:{
		default: false,
		required: false
	}
})

const pagingRequest = ref({})

const selectedTagEntries = ref([])

function handleSelectionChange(selectedRows){
	selectedTagEntries.value = selectedRows
}

const tableRef = ref()

function fetchData(){
	tableRef.value.fetchData()
}

function confirmDelete(){
	deleteTagEntries({tagEntryIds: selectedTagEntries.value.map(e=>e.id)}).then(()=>{
		fetchData()
	})
}

</script>

<template>
	<div style="margin-bottom: 10px;">
		<template v-if="!props.simpleMode">
			<ElSpace alignment="normal">
				<CreateEntryButton @confirm="fetchData" />
				<ElPopconfirm title="确认删除?" @confirm="confirmDelete">
					<template #reference>
						<StratoButton :disabled="selectedTagEntries.length===0" type="danger" plain>
							删除
						</StratoButton>
					</template>
				</ElPopconfirm>
			</ElSpace>
		</template>

		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="tableRef"
		:paging-request="pagingRequest"
		:remote-method="describeTagEntries"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="tagKey" label="标签键" sortable="custom">
		</ElTableColumn>
		<ElTableColumn prop="tagKeyName" label="标签键名称" sortable="custom" />
		<ElTableColumn prop="description" label="描述" />
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn min-width="60">
			<template #default="scope">
				<TagValuesButton :selected-entries="[scope.row]" />
				<UpdateEntryButton :selected-entries="[scope.row]" @confirm="fetchData" />
			</template>
		</ElTableColumn>
	</StratoTable>


</template>

<style scoped>

</style>
