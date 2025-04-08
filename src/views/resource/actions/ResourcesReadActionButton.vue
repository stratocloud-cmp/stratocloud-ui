<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {computed, ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {runReadActions} from '@/api/resource.js'
import {ElNotification} from 'element-plus'


const props = defineProps({
	small: {
		required: false,
		type: Boolean,
		default: false
	},
	category: {
		required: true
	},
	selectedResources: {
		required: true,
		type: Array
	},
	action: {
		required: true
	},
	disabled: {
		required: false,
		default: false,
		type: Boolean
	},
	disabledMessage: {
		required: false,
	},
	showButton:{
		required: false,
		default: true
	}
})

const drawerFlag = ref(false)

const loading = ref(false)

const selectedIds = computed(() => props.selectedResources.map(r => r.id))

const responseList = ref([])

function openResultDrawer(){
	drawerFlag.value = true

	loading.value = true
	runReadActions({
		resourceIds: selectedIds.value,
		actionId: props.action.id
	}).then(resp => {
		responseList.value = resp.responseList
	}).finally(() => {
		loading.value = false
	})
}

defineExpose({openResultDrawer})

function handleCopy(value){
	navigator.clipboard.writeText(value)
	ElNotification.success('文本已复制')
}

function handleJump(url){
	window.open(url, '_blank')
}

</script>

<template>
	<template v-if="showButton">
		<StratoButton
			:size="small?'small':'default'"
			@click="openResultDrawer"
			:disabled="disabled"
			:disabled-message="disabledMessage?disabledMessage:undefined"
			plain>
			<span :style="small?{fontSize: '12px'}:{}">{{action.name}}</span>
		</StratoButton>
	</template>

	<StratoDrawer
		v-model="drawerFlag"
		:size="800"
		:title="action.name"
		no-confirm
	>
		<div v-loading="loading" style="width:100%;">
			<ElCard v-for="response in responseList">
				<template #header>
					{{response.resourceName}}
				</template>
				<ElDescriptions v-if="response.resultList && response.resultList.length>0" border direction="vertical">
					<ElDescriptionsItem v-for="item in response.resultList" :span="3" :label="item.name">
						<template #label>
							<span>{{item.name}}</span>
							<ElLink
								style="float: right"
								v-if="item.isUrl"
								@click="() => handleJump(item.value)"
							>
								前往
							</ElLink>
							<ElLink
								style="float: right"
								@click="() => handleCopy(item.value)"
								v-else
							>
								复制
							</ElLink>
						</template>
						<div style="max-width: 400px;overflow-wrap: break-word">
							{{item.value}}
						</div>
					</ElDescriptionsItem>
				</ElDescriptions>
				<div v-else>
					无数据
				</div>
			</ElCard>
		</div>
	</StratoDrawer>
</template>

<style scoped>

</style>