<script setup>
import StratoButton from '@/components/StratoButton.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {ref} from 'vue'
import {addTagValue, describeTagValues, removeTagValues} from '@/api/tag.js'
import StratoTable from '@/components/StratoTable.vue'
import {ElInput, ElPopconfirm} from 'element-plus'

const props = defineProps({
	selectedEntries: {
		type: Array,
		required: true
	}
})

const tableRef = ref()

const drawerEntry = ref()
const drawerFlag = ref(false)
function openValuesDrawer(){
	if(props.selectedEntries.length === 0){
		return
	}
	drawerEntry.value = props.selectedEntries[0]
	pagingRequest.value.tagEntryKey = props.selectedEntries[0].tagKey
	drawerFlag.value = true
}

const pagingRequest = ref({})


const selectedValues = ref([])
function handleSelectionChange(selectedRows){
	selectedValues.value = selectedRows
}

const addValueDrawerFlag = ref(false)
const addValueFormRef = ref()
const addValueFormData = ref({})
const addValueFormRules = ref({
	tagValue: [{required: true, message: '请输入标签值'}],
	tagValueName: [{required: true, message: '请输入标签值名称'}],
	index: [{required: true, message: '请输入序号'}],
})
function openAddValueDrawer(){
	addValueFormData.value = {}
	addValueFormData.value.tagEntryId = drawerEntry.value.id
	addValueDrawerFlag.value = true
}
function confirmAddValue(){
	addValueFormRef.value.validate(valid => {
		if (!valid) return
		addTagValue(addValueFormData.value).then(()=>{
			tableRef.value.fetchData()
			addValueDrawerFlag.value = false
		})
	})
}

function removeValue(){
	removeTagValues({
		tagEntryId: drawerEntry.value.id,
		tagValueIds: selectedValues.value.map(v=>v.id)
	}).then(()=>{
		tableRef.value.fetchData()
	})
}
</script>

<template>
	<ElButton
		type="primary"
		link
		@click="openValuesDrawer"
	>管理标签值</ElButton>
	<Teleport to="body">
		<StratoDrawer
			v-model="drawerFlag"
			:title="drawerEntry?.tagKeyName"
			no-confirm
			:size="800">
			<div style="margin-bottom: 10px;height: 32px">
				<template v-if="!props.simpleMode">
					<ElSpace alignment="normal">
						<StratoButton type="success" plain size="small" @click="openAddValueDrawer">
							<span style="font-size: 12px">新建标签值</span>
						</StratoButton>
						<ElPopconfirm title="确认删除?" @confirm="removeValue">
							<template #reference>
								<StratoButton :disabled="selectedValues.length===0" type="danger" plain size="small">
									<span style="font-size: 12px">删除标签值</span>
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
				:remote-method="describeTagValues"
				@selection-change="handleSelectionChange"
				sorted-by="index"
				direction="ASC"
			>

				<ElTableColumn type="selection" reserve-selection />
				<ElTableColumn prop="tagValue" label="标签键" sortable="custom" />
				<ElTableColumn prop="tagValueName" label="标签键名称" sortable="custom" />
				<ElTableColumn prop="description" label="描述" />
				<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
			</StratoTable>
		</StratoDrawer>
		<StratoDrawer v-model="addValueDrawerFlag" title="新建标签值" @on-confirm="confirmAddValue">
			<ElForm
				ref="addValueFormRef"
				v-if="addValueDrawerFlag"
				:model="addValueFormData"
				:rules="addValueFormRules"
				label-position="top"
			>
				<ElFormItem prop="tagValue" label="标签值">
					<ElInput placeholder="请输入标签值" v-model="addValueFormData.tagValue" />
				</ElFormItem>
				<ElFormItem prop="tagValueName" label="标签值名称">
					<ElInput placeholder="请输入标签值名称" v-model="addValueFormData.tagValueName" />
				</ElFormItem>
				<ElFormItem prop="index" label="序号">
					<ElInputNumber style="width: 100%" :min="0" placeholder="请输入序号" v-model="addValueFormData.index" />
				</ElFormItem>
				<ElFormItem prop="description" label="描述">
					<ElInput type="textarea" placeholder="请输入描述" v-model="addValueFormData.description" />
				</ElFormItem>
			</ElForm>
		</StratoDrawer>
	</Teleport>
</template>

<style scoped>

</style>
