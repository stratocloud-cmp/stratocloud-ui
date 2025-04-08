<script setup>

import CreateResourceForm from '@/views/resource/forms/create/CreateResourceForm.vue'
import {onMounted, ref} from 'vue'
import {useResourceStackNodeContextProvider} from '@/views/stack/ResourceStackNodeContext.js'

const resourceCmd = defineModel()

const props = defineProps({
	node: {
		required: true
	},
	nodes: {
		required: true
	}
})

function validate(callback){
	formRef.value.validate(callback)
}

defineExpose({validate})

const formRef = ref()

const context = useResourceStackNodeContextProvider()

const requirements = ref([])

const capabilities = ref([])

onMounted(()=>{
	if(props.node.internalRequirements){
		for (let internalRequirement of props.node.internalRequirements) {
			context.addIgnoredTargetTypeId(internalRequirement.targetResourceTypeId)
			requirements.value.push({
				connectActionName: internalRequirement.connectActionName,
				targetNodeName: internalRequirement.targetNodeName
			})
		}
	}

	if(props.nodes){
		for (let eachNode of props.nodes){
			if(eachNode.internalRequirements){
				for (let internalRequirement of eachNode.internalRequirements) {
					if(internalRequirement.targetNodeKey === props.node.nodeKey){
						context.addIgnoredCapabilityTypeId(internalRequirement.relationshipTypeId)
						capabilities.value.push({
							connectActionName: internalRequirement.connectActionName,
							sourceNodeName: eachNode.nodeName
						})
					}
				}
			}
		}
	}
})

</script>

<template>
	<div v-if="requirements && requirements.length > 0" style="margin-bottom: 24px">
		<div style="margin-bottom: 12px">
			<ElText type="success">
				依赖于下列节点
			</ElText>
		</div>

		<ElTable :data="requirements">
			<ElTableColumn prop="connectActionName" label="关系" />
			<ElTableColumn prop="targetNodeName" label="节点名称" />
		</ElTable>
	</div>
	<div v-if="capabilities && capabilities.length > 0" style="margin-bottom: 24px">
		<div style="margin-bottom: 12px">
			<ElText type="success">
				被下列节点所依赖
			</ElText>
		</div>
		<ElTable :data="capabilities">
			<ElTableColumn prop="connectActionName" label="关系" />
			<ElTableColumn prop="sourceNodeName" label="节点名称" />
		</ElTable>
	</div>

	<CreateResourceForm ref="formRef" v-model="resourceCmd" />
</template>

<style scoped>

</style>