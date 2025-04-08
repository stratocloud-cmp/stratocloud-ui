<script setup>

import {onMounted, ref} from 'vue'
import RemoteScriptDef from '@/views/script/RemoteScriptDef.vue'
import {validateForms} from '@/utils/FormUtil.js'

const actions = defineModel({
	required: true,
	type: Array
})

const baseFormRefs = ref([])
const remoteScriptDefRefs = ref([])

function addTab(){
	let i = actions.value.length+1
	let newActionId = 'ACTION_'+i
	while (actions.value.findIndex(a => a.actionId===newActionId)>=0){
		i++
		newActionId = 'ACTION_'+i
	}

	actions.value.push({
		actionId: newActionId,
		actionName: '操作'+i,
		remoteScriptDef: {
			remoteScript: {},
			customForm: {
				items: []
			}
		}
	})
	activeTab.value = actions.value.length-1
}

function handleRemoveTab(targetName){
	const index = targetName
	if(index >= 0){
		actions.value.splice(index, 1)
	}
	if(actions.value.length>0){
		activeTab.value = actions.value.length-1
	}else {
		activeTab.value = undefined
	}
}

const activeTab = ref()

onMounted(() => {
	if(actions.value.length>0){
		activeTab.value = 0
	}
})


function validate(callback){
	validateForms([...baseFormRefs.value, ...remoteScriptDefRefs.value], callback)
}

defineExpose({validate})

</script>
<template>
	<ElButton size="small" style="margin-bottom: 20px" type="primary" plain icon="plus" @click="addTab">
		添加操作
	</ElButton>
	<ElTabs
		v-model="activeTab"
		type="border-card"
		closable
		@tab-remove="handleRemoveTab"
		v-if="actions && actions.length > 0"
	>
		<ElTabPane
			v-for="(action, index) in actions"
			:key="index"
			:name="index"
			:label="action.actionName">
			<ElForm ref="baseFormRefs" :model="action">
				<ElFormItem prop="actionId" label="操作标识" required :show-message="false">
					<ElInput v-model="action.actionId" />
				</ElFormItem>
				<ElFormItem prop="actionName" label="操作名称" required :show-message="false">
					<ElInput v-model="action.actionName" />
				</ElFormItem>
				<ElFormItem prop="actionType" label="操作类型" required :show-message="false">
					<ElSelect v-model="action.actionType">
						<ElOption value="INSTALL" label="安装" />
						<ElOption value="START" label="启动" />
						<ElOption value="STOP" label="停止" />
						<ElOption value="RESTART" label="重启" />
						<ElOption value="UNINSTALL" label="卸载" />
						<ElOption value="CHECK_STATE" label="检查状态" />
						<ElOption value="CONFIGURE" label="配置" />
					</ElSelect>
				</ElFormItem>
			</ElForm>
			<RemoteScriptDef ref="remoteScriptDefRefs" v-model="action.remoteScriptDef" />
		</ElTabPane>
	</ElTabs>
</template>

<style scoped>

</style>
