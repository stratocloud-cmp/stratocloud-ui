<script setup>
import {onMounted, ref, watch} from 'vue'
import {useSequenceGeneratorProvider} from '@/utils/SequenceGenerator.js'
import {DagreLayout} from '@antv/layout'
import {initializeBlueprintGraph, rearrangeLayout} from '@/views/blueprint/BlueprintUtil.js'
import {createBlueprint, updateBlueprint} from '@/api/blueprint.js'
import BlueprintNodeForm from '@/views/blueprint/BlueprintNodeForm.vue'
import BlueprintRelationshipForm from '@/views/blueprint/BlueprintRelationshipForm.vue'
import {cloneDeep} from 'lodash'

const props = defineProps({
	blueprint: {
		required: false
	}
})


const sequenceGenerator = useSequenceGeneratorProvider()

const mainContainerId = 'blueprint-main-container'
const stencilContainerId = 'blueprint-stencil-container'
const graphContainerId = 'blueprint-graph-container'

let graph

onMounted(()=>{
	graph = initializeBlueprintGraph(stencilContainerId, graphContainerId)

	graph.on('node:added', ({node}) => handleNodeAdded(node))

	graph.on('edge:connected', ({edge}) => handleEdgeConnected(edge))

	graph.on('cell:click', ({cell}) => handleCellClicked(cell))

	graph.on('cell:mouseenter', ({cell}) => handleMouseEnter(cell))

	graph.on('cell:mouseleave', ({cell}) => {
		cell.removeTool('button-remove')
	})

	if(props.blueprint){
		initializeBlueprint()
	}
})

async function initializeBlueprint(){
	formData.value.name = props.blueprint.name
	formData.value.description = props.blueprint.description
	const graphData = {nodes: [], edges: []}
	for (let node of props.blueprint.nodes) {
		sequenceGenerator.addSequence(node.nodeKey)
		sequenceGenerator.addSequence(node.nodeName)
		const nodeData = cloneDeep(node)
		graphData.nodes.push({
			id: nodeData.nodeKey,
			shape: 'custom-rect',
			label: nodeData.nodeName,
			data: nodeData,
			attrs: {
				body: {
					rx: 10,
					ry: 10,
				},
			},
			ports: {
				items: [{
					group: 'top',
					id: nodeData.nodeKey+'-top'
				},{
					group: 'right',
					id: nodeData.nodeKey+'-right'
				},{
					group: 'bottom',
					id: nodeData.nodeKey+'-bottom'
				},{
					group: 'left',
					id: nodeData.nodeKey+'-left'
				}]
			}
		})
	}

	for (let relationship of props.blueprint.relationships) {
		graphData.edges.push({
			shape: 'edge',
			label: relationship.connectActionName,
			data: cloneDeep(relationship),
			source: {
				cell: relationship.sourceNodeKey,
				port: relationship.sourceNodeKey+'-bottom'
			},
			target: {
				cell: relationship.targetNodeKey,
				port: relationship.targetNodeKey+'-top'
			},
			attrs: {
				line: {
					stroke: '#A2B1C3',
					strokeWidth: 2,
					targetMarker: {
						name: 'block',
						width: 12,
						height: 8,
					},
				},
			},
			zIndex: 0,
		})
	}

	const dagreLayout = new DagreLayout({
		nodesep: 30, // 可选
		ranksep: 30, // 可选
	})

	const newModel = dagreLayout.layout(graphData)

	graph.fromJSON(newModel)
}

function autoRearrange(){
	rearrangeLayout(graph)
}

function handleMouseEnter(cell){
	cell.addTools([
		{
			name: 'button-remove',
		},
	])
}

function handleNodeAdded(node) {
	if(node.data.nodeKey !== node.id){
		const nodeName = sequenceGenerator.getSequence(node.getData().resourceTypeName)
		const nodeKey = sequenceGenerator.getSequence('node')
		node.label = nodeName
		node.updateData({
			nodeName,
			nodeKey
		})
	}
}

function handleEdgeConnected(edge){
	const source = getCellById(graph.getNodes(), edge.source.cell)
	const target = getCellById(graph.getNodes(), edge.target.cell)
	edge.updateData({
		sourceNodeKey: source?.data.nodeKey,
		sourceTypeId: source?.data.resourceTypeId,
		targetNodeKey: target?.data.nodeKey,
		targetTypeId: target?.data.resourceTypeId,

		relationshipTypeId: undefined,
		connectActionName: undefined,
		relationshipInput: {}
	})
}

const clickedCell = ref()
const clickedNodeData = ref()
const clickedEdgeData = ref()
function handleCellClicked(cell) {
	clickedCell.value = cell

	if(cell.shape === 'edge'){
		clickedEdgeData.value = cell.data
	}else {
		clickedNodeData.value = cell.data
	}
}
watch(()=>clickedNodeData.value?.nodeName, ()=>{
	if(clickedNodeData.value?.nodeName){
		clickedCell.value.label = clickedNodeData.value.nodeName
	}
})

watch(()=>clickedEdgeData.value?.connectActionName, ()=>{
	if(clickedEdgeData.value?.connectActionName){
		clickedCell.value.setLabels(clickedEdgeData.value.connectActionName)
	}
})

const formData = ref({})

function getCellById(cells, id){
	return cells.find(cell => cell.id === id)
}

function collectNodesAndEdges(){
	const graphData = graph.toJSON()
	formData.value.nodes = []
	formData.value.relationships = []
	for (let cell of graphData.cells) {
		if(cell.shape === 'edge'){
			formData.value.relationships.push(cell.data)
		}else {
			formData.value.nodes.push(cell.data)
		}
	}
}

function confirmCreate(){
	collectNodesAndEdges()
	return createBlueprint(formData.value)
}

function confirmUpdate(){
	if(!props.blueprint){
		console.error('Current blueprint is undefined, cannot update.')
		return
	}
	collectNodesAndEdges()
	const updateData = {
		...formData.value,
		blueprintId: props.blueprint.id,
	}
	return updateBlueprint(updateData)
}

defineExpose({confirmCreate, confirmUpdate})

</script>

<template>
	<div style="height: 10%">
		<ElInput style="width: 150px;margin-right: 50px" v-model="formData.name" placeholder="请输入蓝图名称" />
		<ElButton @click="autoRearrange">自动布局</ElButton>
		<ElTooltip>
			<ElButton link icon="Warning">操作说明</ElButton>
			<template #content>
				<div>
					从左侧面板拖拽出节点放置到右侧画布上，鼠标悬停于节点上将显示连接桩(节点边缘的小圆圈)，
					点击连接桩(按住鼠标左键)拖出线条进行连线，连接完成后松开鼠标左键。<br>
					可点击某个节点或关系以修改其属性。<br>
					快捷键：ctrl+c复制，ctrl+v粘贴，ctrl+x剪切，backspace删除，ctrl+z撤销，ctrl+shift+z重做，ctrl+a全选
				</div>
			</template>
		</ElTooltip>
		<ElCard
			v-if="clickedCell"
			style="position: absolute;top: 80px;right: 30px;width: 260px;max-height: 650px;overflow: auto;background-color: #07070e;z-index: 9999"
		>
			<BlueprintRelationshipForm
				v-if="clickedCell.shape === 'edge'"
				v-model="clickedEdgeData"
			/>
			<BlueprintNodeForm
				v-else
				v-model="clickedNodeData"
			/>

		</ElCard>

	</div>
	<div style="width: 100%;height: 90%">
		<div :id="mainContainerId">
			<div style="height: 600px;overflow-y: scroll;overflow-x: hidden">
				<div :id="stencilContainerId"></div>
			</div>
			<div :id="graphContainerId"></div>
		</div>
	</div>

</template>

<style>
#blueprint-main-container {
	display: flex;
	height: 100%;
}
#blueprint-stencil-container {
	width: 300px;
	height: 4000px;
	position: relative;
}
#blueprint-graph-container {
	width: calc(100% - 120px);
	height: 100%;
}
.x6-widget-stencil  {
	background-color: rgba(128,128,128,0.5);
	height: 100%;
}
.x6-widget-stencil-content{
	overflow: hidden;
}
.x6-widget-stencil-title {
	color: rgba(255, 255, 255, 0.8);
	background-color: rgba(128,128,128,0.5);
}
.x6-widget-stencil-group-title {
	color: rgba(255, 255, 255, 0.8) !important;
	background-color: rgba(128,128,128,0.5) !important;
}
.x6-widget-transform {
	margin: -1px 0 0 -1px;
	padding: 0px;
	border: 1px solid #239edd;
}
.x6-widget-transform > div {
	border: 1px solid #239edd;
}
.x6-widget-transform > div:hover {
	background-color: #3dafe4;
}
.x6-widget-transform-active-handle {
	background-color: #3dafe4;
}
.x6-widget-transform-resize {
	border-radius: 0;
}
.x6-widget-selection-inner {
	border: 1px solid #239edd;
}
.x6-widget-selection-box {
	opacity: 0;
}
.x6-edge-label > text {
	font-size: 10px;
}
</style>
