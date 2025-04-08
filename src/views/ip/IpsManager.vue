<script setup>
import {ElInput, ElPopconfirm, ElTableColumn} from 'element-plus'
import {ref} from 'vue'
import StratoTable from '@/components/StratoTable.vue'
import {addIpRange, describeIps, excludeIps, releaseIps, removeIpRanges} from '@/api/IpPool.js'
import ResourceLink from '@/views/resource/components/ResourceLink.vue'
import StratoButton from '@/components/StratoButton.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import CreateIpRangeForm from '@/views/ip/CreateIpRangeForm.vue'
import IpState from '@/views/ip/IpState.vue'

const props = defineProps({
	ipPool: {
		required: true
	}
})

const ipPagingRequest = ref({
	ipPoolId: props.ipPool.id
})
const selectedIps = ref([])
function handleIpSelectionChange(selectedRows){
	selectedIps.value = selectedRows
}


const selectedRanges = ref([])
function handleRangeSelectionChange(selectedRows){
	selectedRanges.value = selectedRows
}

const rangeTableRef = ref()

const createRangeDrawerFlag = ref(false)
const createRangeFormRef = ref()
const createRangeFormData = ref({
	ipPoolId: props.ipPool.id
})
function openCreateRangeDrawer(){
	createRangeDrawerFlag.value = true
}
function confirmCreateRange(){
	createRangeFormRef.value.validate(valid=>{
		if(!valid) return

		addIpRange(createRangeFormData.value).then(()=>{
			createRangeDrawerFlag.value = false
			emits('refresh')
			ipTableRef.value.fetchData()
		})
	})
}

const emits = defineEmits(['refresh'])



function onDeleteRanges(){
	removeIpRanges({
		ipPoolId: props.ipPool.id,
		ipRangeIds: selectedRanges.value.map(r=>r.id),
	}).then(resp=>{
		emits('refresh')
		ipTableRef.value.fetchData()
		rangeTableRef.value.clearSelection()
	})
}


const ipTableRef = ref()

const excludeReason = ref()
function confirmExcludeIps(){
	excludeIps({
		ipPoolId: props.ipPool.id,
		addresses: selectedIps.value.map(ip=>ip.address),
		reason: excludeReason.value
	}).then(resp=>{
		excludeReason.value = undefined
		ipTableRef.value.fetchData()
	})
}

function confirmReleaseIps(){
	releaseIps({
		ipPoolId: props.ipPool.id,
		addresses: selectedIps.value.map(ip=>ip.address),
	}).then(resp=>{
		ipTableRef.value.fetchData()
	})
}

</script>
<template>
	<div>
		<ElText>IP范围</ElText>
	</div>
	<div style="margin-top: 6px; margin-bottom: 6px; height: 32px">
		<StratoButton size="small" type="primary" @click="openCreateRangeDrawer">
			<span style="font-size: 12px">新建</span>
		</StratoButton>
		<ElPopconfirm title="确认删除" @confirm="onDeleteRanges">
			<template #reference>
				<StratoButton :disabled="selectedRanges.length===0" size="small" type="danger" plain>
					<span style="font-size: 12px">删除</span>
				</StratoButton>
			</template>
		</ElPopconfirm>

	</div>
	<ElTable
		ref="rangeTableRef"
		:data="ipPool.ranges"
		@selection-change="handleRangeSelectionChange"
		:row-key="row=>row.id"
		size="small"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn label="起始IP" prop="startIp" />
		<ElTableColumn label="终止IP" prop="endIp" />
		<ElTableColumn label="创建时间" prop="createdAt" />
	</ElTable>
	<StratoDrawer v-model="createRangeDrawerFlag" title="新建IP范围" @on-confirm="confirmCreateRange" size="400">
		<CreateIpRangeForm
			ref="createRangeFormRef"
			v-model="createRangeFormData"
			:protocol="ipPool.protocol"
		/>
	</StratoDrawer>


	<div style="margin-top: 12px;">
		<ElText>IP地址</ElText>
	</div>
	<div style="margin-top: 6px; margin-bottom: 6px; height: 32px">
		<ElSpace alignment="normal">
			<StratoButton
				size="small"
				:disabled="selectedIps.length===0"
				type="success"
				@click="confirmReleaseIps"
				plain
			>
				<span style="font-size: 12px">释放</span>
			</StratoButton>
			<StratoButton
				size="small"
				:disabled="selectedIps.length===0"
				type="warning"
				@click="confirmExcludeIps"
				plain
			>
				<span style="font-size: 12px">排除</span>
			</StratoButton>
			<ElInput
				:disabled="selectedIps.length===0"
				placeholder="排除原因"
				size="small"
				style="width: 20%;"
				v-model="excludeReason"
			/>
		</ElSpace>
		<ElInput size="small" style="float: right; width: 30%;" v-model="ipPagingRequest.search" suffix-icon="search" />
	</div>
	<StratoTable
		ref="ipTableRef"
		:paging-request="ipPagingRequest"
		:remote-method="describeIps"
		@selection-change="handleIpSelectionChange"
		size="small"
		sorted-by="toBigInteger"
		direction="ASC"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn label="IP地址" prop="toBigInteger" sortable="custom">
			<template #default="scope">
				<span>{{scope.row.address}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn label="状态" prop="state" sortable="custom">
			<template #default="scope">
				<IpState :state="scope.row.state" />
			</template>
		</ElTableColumn>
		<ElTableColumn label="资源" prop="resourceName" sortable="custom">
			<template #default="scope">
				<ResourceLink
					v-if="scope.row.resourceId"
					:resource-category="scope.row.resourceCategory"
					:resource-id="scope.row.resourceId"
					:resource-name="scope.row.resourceName"
				/>
			</template>
		</ElTableColumn>
		<ElTableColumn label="排除原因" prop="allocationReason" />
		<ElTableColumn label="更新时间" prop="lastModifiedAt" />
	</StratoTable>
</template>

<style scoped>

</style>