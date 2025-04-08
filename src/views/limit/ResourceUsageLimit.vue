<script setup>
import StratoTable from '@/components/StratoTable.vue';
import { ElInput, ElPopconfirm, ElTableColumn } from 'element-plus';
import { ref } from 'vue';
import StratoButton from '@/components/StratoButton.vue';
import StratoDrawer from '@/components/StratoDrawer.vue';
import {createLimit, deleteLimits, describeLimits, disableLimits, enableLimits, updateLimit} from '@/api/limit.js'
import CreateLimitForm from '@/views/limit/CreateLimitForm.vue'
import UpdateLimitForm from '@/views/limit/UpdateLimitForm.vue'

const props = defineProps({
	tenantIds: {
		type: Array,
		required: false,
		default: undefined
	}
})

const tableRef = ref()

const drawerFlag = ref(false)
const updateDrawerFlag = ref(false)

const selectedLimits = ref([])
const pagingRequest = ref({
	tenantIds: props.tenantIds
})

const createFormRef = ref()
const createFormData = ref({
	tags: [],
	items: []
})

const updateFormRef = ref()
const updateFormData = ref({})

function handleSelectionChange(selectedRows){
	selectedLimits.value = selectedRows
}

function getSelectedIds(){
	return selectedLimits.value.map(limit=>limit.id)
}

function onOpenDrawer(){
	if(props.tenantIds){
		createFormData.value.tenantId = props.tenantIds[0]
	}

	drawerFlag.value = true
}

function onOpenUpdateDrawer(){
	if(selectedLimits.value.length !== 1){
		return
	}

	updateFormData.value = {
		limitId: selectedLimits.value[0].id,
		name: selectedLimits.value[0].name,
		description: selectedLimits.value[0].description,
		ownerIds: selectedLimits.value[0].ownerIds,
		providerIds: selectedLimits.value[0].providerIds,
		accountIds: selectedLimits.value[0].accountIds,
		resourceCategories: selectedLimits.value[0].resourceCategories,
		resourceTypes: selectedLimits.value[0].resourceTypes,
		tags: selectedLimits.value[0].tags?selectedLimits.value[0].tags:[],
		items: selectedLimits.value[0].items?selectedLimits.value[0].items:[]
	}
	updateDrawerFlag.value = true
}

function onSave(){
	createFormRef.value.validate(valid=>{
		if(!valid) return

		createLimit(createFormData.value).then(() => {
			tableRef.value.fetchData()
			drawerFlag.value = false
		})
	})
}

function onUpdate(){
	updateFormRef.value.validate(valid=>{
		if(!valid) return

		updateLimit(updateFormData.value).then(() => {
			tableRef.value.fetchData()
			updateDrawerFlag.value = false
		})
	})
}


function onDelete(){
	const limitIds = getSelectedIds()
	const request = {limitIds}
	deleteLimits(request).then(()=>{
		tableRef.value.fetchData()
	})
}

function onEnable(){
	const limitIds = getSelectedIds()
	const request = {limitIds}
	enableLimits(request).then(()=>{
		tableRef.value.fetchData()
	})
}

function onDisable(){
	const limitIds = getSelectedIds()
	const request = {limitIds}
	disableLimits(request).then(()=>{
		tableRef.value.fetchData()
	})
}

const detailDrawerLimit = ref()
const detailDrawerFlag = ref(false)
function onOpenDetailDrawer(row){
	detailDrawerLimit.value = row
	detailDrawerFlag.value = true
}

</script>

<template>
	<div style="margin-bottom: 10px;height: 32px">
		<StratoButton size="small" type="primary" @click="onOpenDrawer">
			<span style="font-size: 12px">创建</span>
		</StratoButton>
		<StratoButton
			size="small"
			:disabled="selectedLimits.length!==1"
			disabled-message="请选择且只选择一项"
			@click="onOpenUpdateDrawer">
			<span style="font-size: 12px">编辑</span>
		</StratoButton>
		<StratoButton
			size="small"
			:disabled="selectedLimits.length===0"
			@click="onEnable"
			type="success"
			plain
		>
			<span style="font-size: 12px">启用</span>
		</StratoButton>
		<StratoButton
			size="small"
			:disabled="selectedLimits.length===0"
			@click="onDisable"
			type="danger"
			plain
		>
			<span style="font-size: 12px">禁用</span>
		</StratoButton>
		<ElPopconfirm title="确认删除" @confirm="onDelete">
			<template #reference>
				<StratoButton
					:disabled="selectedLimits.length===0"
					type="danger"
					plain
					size="small"
				>
					<span style="font-size: 12px">删除</span>
				</StratoButton>
			</template>
		</ElPopconfirm>
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="tableRef"
		:paging-request="pagingRequest"
		:remote-method="describeLimits"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn prop="description" label="描述" />
		<ElTableColumn
			prop="disabled"
			label="是否禁用"
			:formatter="row => row.disabled ? '是':'否'"
		/>
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn>
			<template #default="scope">
				<ElButton link type="primary" @click="()=>onOpenDetailDrawer(scope.row)">查看配额</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer v-model="drawerFlag" title="创建配额上限" @onConfirm="onSave" size="600">
		<CreateLimitForm ref="createFormRef" v-model="createFormData" />
	</StratoDrawer>

	<StratoDrawer v-model="updateDrawerFlag" title="编辑配额上限" @onConfirm="onUpdate" size="600">
		<UpdateLimitForm ref="updateFormRef" v-model="updateFormData" />
	</StratoDrawer>

	<StratoDrawer v-model="detailDrawerFlag" title="配额详情" size="600">
		<ElTable :data="detailDrawerLimit.items">
			<ElTableColumn prop="usageTypeName" label="配额项" />
			<ElTableColumn prop="usageValue" label="已使用量" />
			<ElTableColumn prop="limitValue" label="上限" />
			<ElTableColumn prop="percentage" label="百分比">
				<template #default="scope">
					<ElText type="success" v-if="scope.row.percentage <= 80">
						{{scope.row.percentage}}%
					</ElText>
					<ElText type="warning" v-else-if="scope.row.percentage > 80 && scope.row.percentage < 100">
						{{scope.row.percentage}}%
					</ElText>
					<ElText type="danger" v-else>
						{{scope.row.percentage}}%
					</ElText>
				</template>
			</ElTableColumn>
		</ElTable>
	</StratoDrawer>
</template>