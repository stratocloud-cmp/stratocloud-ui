<script setup>

import {onMounted, ref} from 'vue'
import RemoteScriptDef from '@/views/script/RemoteScriptDef.vue'
import {validateForms} from '@/utils/FormUtil.js'
import SoftwareDefinitionSelector from '@/views/software/SoftwareDefinitionSelector.vue'

const requirements = defineModel({
	required: true,
	type: Array
})

const baseFormRefs = ref([])
const remoteScriptDefRefs = ref([])

function addTab() {
	let i = requirements.value.length + 1
	let newRequirementKey = 'REQUIREMENT_' + i
	while (requirements.value.findIndex(a => a.requirementKey === newRequirementKey) >= 0) {
		i++
		newRequirementKey = 'REQUIREMENT_' + i
	}

	requirements.value.push({
		requirementKey: newRequirementKey,
		requirementName: '依赖' + i,
		capabilityName: '',

		connectScriptDef: {
			remoteScript: {},
			customForm: {
				items: []
			}
		},
		disconnectScriptDef: {
			remoteScript: {},
			customForm: {
				items: []
			}
		},
		checkConnectionScriptDef: {
			remoteScript: {},
			customForm: {
				items: []
			}
		},
	})
	activeTab.value = requirements.value.length-1
}

function handleRemoveTab(targetName) {
	const index = targetName
	if (index >= 0) {
		requirements.value.splice(index, 1)
	}
	if (requirements.value.length > 0) {
		activeTab.value = requirements.value.length-1
	} else {
		activeTab.value = undefined
	}
}

const activeTab = ref()

onMounted(() => {
	if (requirements.value.length > 0) {
		activeTab.value = 0
	}
})


function validate(callback) {
	validateForms([...baseFormRefs.value, ...remoteScriptDefRefs.value], callback)
}

defineExpose({validate})

</script>
<template>
	<ElButton style="margin-bottom: 20px" type="primary" size="small" plain icon="plus" @click="addTab">
		添加依赖
	</ElButton>
	<ElTabs
		v-model="activeTab"
		type="border-card"
		closable
		@tab-remove="handleRemoveTab"
		v-if="requirements && requirements.length > 0"
	>
		<ElTabPane
			v-for="(requirement, index) in requirements"
			:key="index"
			:name="index"
			:label="requirement.requirementName">
			<ElForm ref="baseFormRefs" :model="requirement">
				<ElFormItem prop="targetSoftwareDefinitionId" label="依赖软件" required :show-message="false">
					<SoftwareDefinitionSelector v-model="requirement.targetSoftwareDefinitionId" />
				</ElFormItem>
				<ElFormItem prop="requirementKey" label="依赖标识" required :show-message="false">
					<ElInput v-model="requirement.requirementKey"/>
				</ElFormItem>
				<ElFormItem prop="requirementName" label="依赖名称" required :show-message="false">
					<ElInput v-model="requirement.requirementName"/>
				</ElFormItem>
				<ElFormItem prop="capabilityName" label="被依赖名称" required :show-message="false">
					<ElInput v-model="requirement.capabilityName"/>
				</ElFormItem>
				<ElFormItem prop="exclusive" label="排他依赖">
					<ElCheckbox v-model="requirement.exclusive" />
				</ElFormItem>
			</ElForm>
			<ElCollapse accordion>
				<ElCollapseItem title="建立依赖脚本">
					<RemoteScriptDef ref="remoteScriptDefRefs" v-model="requirement.connectScriptDef" />
				</ElCollapseItem>
				<ElCollapseItem title="解除依赖脚本">
					<RemoteScriptDef ref="remoteScriptDefRefs" v-model="requirement.disconnectScriptDef" />
				</ElCollapseItem>
				<ElCollapseItem title="检查依赖脚本">
					<RemoteScriptDef ref="remoteScriptDefRefs" v-model="requirement.checkConnectionScriptDef" />
				</ElCollapseItem>
			</ElCollapse>
		</ElTabPane>
	</ElTabs>
</template>

<style scoped>

</style>
