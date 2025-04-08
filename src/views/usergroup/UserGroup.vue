<script setup>
import {ElInput, ElTableColumn} from 'element-plus'
import {ref} from 'vue'
import StratoTable from '@/components/StratoTable.vue'
import {describeUserGroups} from '@/api/userGroup.js'
import CreateUserGroupButton from '@/views/usergroup/CreateUserGroupButton.vue'
import UpdateUserGroupButton from '@/views/usergroup/UpdateUserGroupButton.vue'
import JoinUserGroupButton from '@/views/usergroup/JoinUserGroupButton.vue'
import MembersButton from '@/views/usergroup/MembersButton.vue'
import DeleteUserGroupsButton from '@/views/usergroup/DeleteUserGroupsButton.vue'

const props = defineProps({
	simpleMode:{
		default: false,
		required: false
	}
})

const pagingRequest = ref({})

const selectedUserGroups = ref([])

function handleSelectionChange(selectedRows){
	selectedUserGroups.value = selectedRows
}

const tableRef = ref()

function fetchData(){
	tableRef.value.fetchData()
}

</script>

<template>
	<div style="margin-bottom: 10px;">
		<template v-if="!props.simpleMode">
			<ElSpace alignment="normal">
				<CreateUserGroupButton @confirm="fetchData" />
				<DeleteUserGroupsButton :selected-groups="selectedUserGroups" @confirm="fetchData" />
				<JoinUserGroupButton />
			</ElSpace>
		</template>

		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="tableRef"
		:paging-request="pagingRequest"
		:remote-method="describeUserGroups"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" v-if="!props.simpleMode" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn prop="alias" label="别名" sortable="custom" />
		<ElTableColumn prop="description" label="描述" />
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn>
			<template #default="scope">
				<UpdateUserGroupButton :selected-groups="[scope.row]" @confirm="fetchData" />
				<MembersButton :selected-groups="[scope.row]" />
			</template>
		</ElTableColumn>
	</StratoTable>
</template>

<style scoped>

</style>
