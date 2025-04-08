<script setup>
import StratoTable from '@/components/StratoTable.vue';
import { ElInput, ElPopconfirm, ElTableColumn } from 'element-plus';
import { ref } from 'vue';
import StratoButton from '@/components/StratoButton.vue';
import StratoDrawer from '@/components/StratoDrawer.vue';
import {createNamingRule, createRule, deleteRules, describeRules, updateNamingRule, updateRule} from '@/api/rule.js'
import CreateRuleForm from '@/views/rule/CreateRuleForm.vue'
import UpdateRuleForm from '@/views/rule/UpdateRuleForm.vue'

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

const selectedRules = ref([])
const pagingRequest = ref({
	tenantIds: props.tenantIds
})

const createFormRef = ref()
const createFormData = ref({})
const isCreatingNamingRule = ref(false)

const updateFormRef = ref()
const updateFormData = ref({})
const isUpdatingNamingRule = ref(false)

function handleSelectionChange(selectedRows){
	selectedRules.value = selectedRows
}

function getSelectedIds(){
	return selectedRules.value.map(rule=>rule.id)
}

function onOpenDrawer(){
	if(props.tenantIds){
		createFormData.value.tenantId = props.tenantIds[0]
	}

	drawerFlag.value = true
}

function onOpenUpdateDrawer(){
	if(selectedRules.value.length !== 1){
		return
	}

	isUpdatingNamingRule.value = selectedRules.value[0].isNamingRule
	updateFormData.value = {
		ruleId: selectedRules.value[0].id,
		name: selectedRules.value[0].name,
		script: selectedRules.value[0].script,
		suffixType: selectedRules.value[0].suffixType,
		suffixLength: selectedRules.value[0].suffixLength,
		suffixStartNumber: selectedRules.value[0].suffixStartNumber,
	}
	updateDrawerFlag.value = true
}

function onSave(){
	createFormRef.value.validate((valid, fields)=>{
		if(!valid) return

		const createRuleFunction = isCreatingNamingRule.value ? createNamingRule : createRule

		createRuleFunction(createFormData.value).then(resp => {
			tableRef.value.fetchData()
			drawerFlag.value = false
		})
	})
}

function onUpdate(){
	updateFormRef.value.validate((valid, fields)=>{
		if(!valid) return

		const updateRuleFunction = isUpdatingNamingRule.value ? updateNamingRule : updateRule

		updateRuleFunction(updateFormData.value).then(resp => {
			tableRef.value.fetchData()
			updateDrawerFlag.value = false
		})
	})
}


function onDelete(){
	const ruleIds = getSelectedIds()
	const request = {ruleIds}
	deleteRules(request).then(resp=>{
		tableRef.value.fetchData()
	})
}

</script>

<template>
	<div style="margin-bottom: 10px;height: 32px">
		<StratoButton size="small" type="primary" @click="onOpenDrawer">
			<span style="font-size: 12px">创建</span>
		</StratoButton>
		<StratoButton
			size="small"
			:disabled="selectedRules.length!==1"
			disabled-message="请选择且只选择一项"
			@click="onOpenUpdateDrawer">
			<span style="font-size: 12px">编辑</span>
		</StratoButton>
		<ElPopconfirm title="确认删除" @confirm="onDelete">
			<template #reference>
				<StratoButton
					:disabled="selectedRules.length===0"
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
		:remote-method="describeRules"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="type" label="类型" sortable="custom" />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn
			prop="isNamingRule"
			label="是否命名规则"
			:formatter="(row, column, cellValue, index) => {return cellValue ? '是':'否'}"
		/>
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
	</StratoTable>

	<StratoDrawer v-model="drawerFlag" title="创建规则" @onConfirm="onSave" size="600">
		<ElRadioGroup v-model="isCreatingNamingRule" style="margin-bottom: 12px">
			<ElRadioButton label="普通规则" :value="false" />
			<ElRadioButton label="命名规则" :value="true" />
		</ElRadioGroup>
		<CreateRuleForm
			ref="createFormRef"
			:is-naming-rule="isCreatingNamingRule"
			v-model="createFormData"
		/>
	</StratoDrawer>

	<StratoDrawer v-model="updateDrawerFlag" title="编辑规则" @onConfirm="onUpdate" size="600">
		<UpdateRuleForm
			:is-naming-rule="isUpdatingNamingRule"
			ref="updateFormRef"
			v-model="updateFormData"
		/>
	</StratoDrawer>
</template>