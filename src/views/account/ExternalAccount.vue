<script setup>
import StratoTable from "@/components/StratoTable.vue";
import {ref} from "vue";
import {
	createExternalAccount, deleteExternalAccounts,
	describeAccounts,
	disableExternalAccounts,
	enableExternalAccounts,
	updateExternalAccount
} from "@/api/account.js";
import StratoButton from "@/components/StratoButton.vue";
import {ElInput, ElPopconfirm} from "element-plus";
import {runAsyncJob} from "@/api/asyncJob.js";
import {useActiveJobStore} from "@/stores/activeJob.js";
import StratoDrawer from '@/components/StratoDrawer.vue'
import CreateAccountForm from '@/views/account/CreateAccountForm.vue'
import UpdateAccountForm from '@/views/account/UpdateAccountForm.vue'
import AccountState from '@/views/account/AccountState.vue'

const activeJobStore = useActiveJobStore()

const pagingRequest = ref({})

const selectedAccounts = ref([])

const accountTableRef = ref()

const syncButtonLoading = ref(false)

function getSelectedIds(){
	return selectedAccounts.value.map(a=>a.id)
}

function handleSelectionChange(rows) {
	selectedAccounts.value = rows
}


const createDrawerFlag = ref(false)
const createFormRef = ref()
const createDrawerLoading = ref(false)
const createFormData = ref({
	providerId: undefined,
	name: undefined,
	description: undefined,
	properties: {},
})
function onOpenCreateDrawer(){
	createFormData.value = {
		providerId: undefined,
		name: undefined,
		description: undefined,
		properties: {},
	}
	createDrawerFlag.value = true
}
function createAccount(){
	createFormRef.value.validate((valid, _fields)=>{
		if(!valid) return
		createDrawerLoading.value = true
		createExternalAccount(createFormData.value).then(()=>{
			createDrawerFlag.value = false
			accountTableRef.value.fetchData()
		}).finally(()=>{
			createDrawerLoading.value = false
		})
	})
}

const updateDrawerFlag = ref()
const updateFormRef = ref()
const updateDrawerLoading = ref(false)
const updateFormData = ref({
	externalAccountId: undefined,
	name: undefined,
	description: undefined,
	properties: {},
})
function onOpenUpdateDrawer(selectedAccount){
	updateFormData.value.externalAccountId = selectedAccount.id
	updateFormData.value.name = selectedAccount.name
	updateFormData.value.description = selectedAccount.description
	updateFormData.value.properties = selectedAccount.properties
	updateDrawerFlag.value = true
}
function updateAccount(){
	updateFormRef.value.validate(valid=>{
		if(!valid) return

		updateDrawerLoading.value = true

		updateExternalAccount(updateFormData.value).then(()=>{
			updateDrawerFlag.value = false
			accountTableRef.value.fetchData()
		}).finally(()=>{
			updateDrawerLoading.value = false
		})
	})


}


function onSync(){
	if(selectedAccounts.value.length === 0){
		return
	}
	syncButtonLoading.value = true
	runAsyncJob({
		jobType: 'SYNCHRONIZE_ACCOUNTS',
		jobParameters: {
			accountIds: getSelectedIds()
		}
	}).then(resp => {
		activeJobStore.setActiveJobId(resp.jobId)
		accountTableRef.value.fetchData()
	}).finally(() => {
		syncButtonLoading.value = false
	})
}

function onEnable(){
	if(selectedAccounts.value.length === 0){
		return
	}

	enableExternalAccounts({
		accountIds: getSelectedIds()
	}).then(()=>{
		accountTableRef.value.fetchData()
	})
}

function onDisable(){
	if(selectedAccounts.value.length === 0){
		return
	}

	disableExternalAccounts({
		accountIds: getSelectedIds()
	}).then(()=>{
		accountTableRef.value.fetchData()
	})
}

function onDelete(){
	if(selectedAccounts.value.length === 0){
		return
	}

	deleteExternalAccounts({
		externalAccountIds: getSelectedIds()
	}).then(()=>{
		accountTableRef.value.fetchData()
	})
}

</script>

<template>
	<div style="margin-bottom: 10px;">
		<StratoButton type="primary" @click="onOpenCreateDrawer">创建</StratoButton>
		<StratoButton
			:disabled="selectedAccounts.length===0"
			plain
			:loading="syncButtonLoading"
			@click="onSync">同步</StratoButton>
		<StratoButton
			:disabled="selectedAccounts.length===0"
			type="success"
			plain
			@click="onEnable">启用</StratoButton>
		<StratoButton
			:disabled="selectedAccounts.length===0"
			type="danger"
			plain
			@click="onDisable">禁用</StratoButton>
		<ElPopconfirm title="确认删除" @confirm="onDelete">
			<template #reference>
				<StratoButton :disabled="selectedAccounts.length===0" type="danger" plain>删除</StratoButton>
			</template>
		</ElPopconfirm>
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="accountTableRef"
		:paging-request="pagingRequest"
		:remote-method="describeAccounts"
		@selection-change="handleSelectionChange">
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn prop="providerId" label="云平台" sortable="custom">
			<template #default="scope">
				{{scope.row.providerName}}
			</template>
		</ElTableColumn>
		<ElTableColumn prop="state" label="状态" sortable="custom">
			<template #default="scope">
				<AccountState :state="scope.row.state" />
			</template>
		</ElTableColumn>
		<ElTableColumn prop="balance" label="余额" sortable="custom" />
		<ElTableColumn prop="description" label="描述" />
		<ElTableColumn
			prop="disabled"
			label="是否禁用"
			:formatter="(_row, _column, cellValue, _index) => {return cellValue ? '是':'否'}" />
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn>
			<template #default="scope">
				<ElButton
					link
					type="primary"
					@click="()=>onOpenUpdateDrawer(scope.row)">编辑</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer
		:loading="createDrawerLoading"
		v-model="createDrawerFlag"
		title="创建云账号"
		size="800"
		@on-confirm="createAccount">
		<CreateAccountForm ref="createFormRef" v-if="createDrawerFlag" v-model="createFormData" />
	</StratoDrawer>

	<StratoDrawer
		:loading="updateDrawerLoading"
		v-model="updateDrawerFlag"
		title="编辑云账号"
		size="800"
		@on-confirm="updateAccount">
		<UpdateAccountForm v-if="updateDrawerFlag" ref="updateFormRef" v-model="updateFormData" />
	</StratoDrawer>
</template>

<style scoped>

</style>
