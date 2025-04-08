<script setup>
import StratoTable from '@/components/StratoTable.vue';
import { ElInput, ElPopconfirm, ElTableColumn } from 'element-plus';
import { ref } from 'vue';
import StratoButton from '@/components/StratoButton.vue';
import StratoDrawer from '@/components/StratoDrawer.vue';
import {createIpPool, deleteIpPools, describeIpPools, updateAttachedNetworks, updateIpPool} from '@/api/IpPool.js'
import CreateIpPoolForm from '@/views/ip/CreateIpPoolForm.vue'
import UpdateIpPoolForm from '@/views/ip/UpdateIpPoolForm.vue'
import IpsManager from '@/views/ip/IpsManager.vue'
import ResourceSelector from '@/views/resource/components/ResourceSelector.vue'


const tableRef = ref()

const drawerFlag = ref(false)
const updateDrawerFlag = ref(false)

const selectedIpPools = ref([])
const pagingRequest = ref({})

const createFormRef = ref()
const createFormData = ref({})

const updateFormRef = ref()
const updateFormData = ref({})

function handleSelectionChange(selectedRows){
	selectedIpPools.value = selectedRows
}

function getSelectedIds(){
	return selectedIpPools.value.map(ipPool=>ipPool.id)
}

function onOpenDrawer(){
	drawerFlag.value = true
}

function onOpenUpdateDrawer(selectedIpPool){
	updateFormData.value = {
		ipPoolId: selectedIpPool.id,
		name: selectedIpPool.name,
		description: selectedIpPool.description,
		cidr: selectedIpPool.cidr,
		gateway: selectedIpPool.gateway,
		protocol: selectedIpPool.protocol,
	}
	updateDrawerFlag.value = true
}

function onSave(){
	createFormRef.value.validate((valid)=>{
		if(!valid) return

		createIpPool(createFormData.value).then(() => {
			tableRef.value.fetchData()
			drawerFlag.value = false
		})
	})
}

function onUpdate(){
	updateFormRef.value.validate((valid)=>{
		if(!valid) return
		updateFormData.value.protocol = undefined
		updateIpPool(updateFormData.value).then(() => {
			tableRef.value.fetchData()
			updateDrawerFlag.value = false
		})
	})
}


function onDelete(){
	const ipPoolIds = getSelectedIds()
	const request = {ipPoolIds}
	deleteIpPools(request).then(()=>{
		tableRef.value.fetchData()
	})
}


const ipsDrawerFlag = ref(false)
const ipsDrawerIpPool = ref()
function openIpsDrawer(ipPool){
	ipsDrawerIpPool.value = ipPool
	ipsDrawerFlag.value = true
}



function handleListChange(listData){
	if(!listData || listData.length === 0){
		return
	}

	if(selectedIpPools.value.length>0){
		selectedIpPools.value = listData.filter(item=>selectedIpPools.value.findIndex(r=>r.id === item.id)!==-1)
	}

	if(ipsDrawerIpPool.value){
		ipsDrawerIpPool.value = listData.find(item=>item.id === ipsDrawerIpPool.value.id)

		if(!ipsDrawerIpPool.value){
			ipsDrawerFlag.value = false
		}
	}
}

function fetchDataAgain(){
	tableRef.value.fetchData()
}


const attachDrawerFlag = ref(false)
const attachingIpPool = ref()
const attachingNetworkIds = ref([])
function openAttachDrawer(selectedIpPool){
	attachingIpPool.value = selectedIpPool
	if(attachingIpPool.value.attachedNetworkResources){
		attachingNetworkIds.value = attachingIpPool.value.attachedNetworkResources.map(item=>item.resourceId)
	}
	attachDrawerFlag.value = true
}

function confirmAttach(){
	updateAttachedNetworks({
		ipPoolId: attachingIpPool.value.id,
		attachedNetworkResourceIds: attachingNetworkIds.value,
	}).then(()=>{
		attachDrawerFlag.value = false
		attachingIpPool.value = undefined
		attachingNetworkIds.value = []
		fetchDataAgain()
	})
}

</script>

<template>
	<div style="margin-bottom: 10px;height: 32px">
		<StratoButton type="primary" @click="onOpenDrawer">
			创建
		</StratoButton>
		<ElPopconfirm title="确认删除" @confirm="onDelete">
			<template #reference>
				<StratoButton
					:disabled="selectedIpPools.length===0"
					type="danger"
					plain
				>
					删除
				</StratoButton>
			</template>
		</ElPopconfirm>
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>

	<StratoTable
		ref="tableRef"
		:paging-request="pagingRequest"
		:remote-method="describeIpPools"
		@selection-change="handleSelectionChange"
		@list-change="handleListChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="name" label="名称" sortable="custom" />
		<ElTableColumn label="已关联网络资源">
			<template #default="scope">
				<ElLink type="primary" v-if="scope.row.attachedNetworkResources">
					{{scope.row.attachedNetworkResources[0]?.resourceName}}
				</ElLink>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="protocol" label="IP协议版本" sortable="custom" />
		<ElTableColumn prop="cidr" label="CIDR" sortable="custom" />
		<ElTableColumn prop="gateway" label="网关" sortable="custom" />
		<ElTableColumn prop="description" label="描述" />
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
		<ElTableColumn min-width="120">
			<template #default="scope">
				<ElButton link type="primary" @click="()=>openIpsDrawer(scope.row)">
					管理IP
				</ElButton>
				<ElButton link type="primary" @click="()=>onOpenUpdateDrawer(scope.row)">编辑</ElButton>
				<ElButton link type="primary" @click="()=>openAttachDrawer(scope.row)">关联网络</ElButton>
			</template>
		</ElTableColumn>
	</StratoTable>

	<StratoDrawer v-model="drawerFlag" title="创建IP池" @onConfirm="onSave" size="600">
		<CreateIpPoolForm
			ref="createFormRef"
			v-model="createFormData"
		/>
	</StratoDrawer>

	<StratoDrawer v-model="updateDrawerFlag" title="编辑IP池" @onConfirm="onUpdate" size="600">
		<UpdateIpPoolForm
			ref="updateFormRef"
			v-model="updateFormData"
		/>
	</StratoDrawer>

	<StratoDrawer v-model="ipsDrawerFlag" :title="'IP池: '+ipsDrawerIpPool?.name" size="800" no-confirm>
		<IpsManager v-if="ipsDrawerFlag" :ip-pool="ipsDrawerIpPool" @refresh="fetchDataAgain" />
	</StratoDrawer>

	<StratoDrawer v-model="attachDrawerFlag" title="关联网络" size="800" @on-confirm="confirmAttach">
		<ElForm v-if="attachDrawerFlag">
			<ElFormItem label="网络资源">
				<ResourceSelector
					v-model="attachingNetworkIds"
					multiple
					ip-pool-attachable
				/>
			</ElFormItem>
		</ElForm>
	</StratoDrawer>


</template>
