<script setup>
import {onMounted, ref, watch} from 'vue'
import {initializeWorkflowGraph, rearrangeLayout} from '@/views/workflow/WorkflowUtil.js'
import {useSequenceGeneratorProvider} from '@/utils/SequenceGenerator.js'
import WorkflowNodeForm from '@/views/workflow/WorkflowNodeForm.vue'
import {createWorkflow, describeNodeTypes, updateWorkflow} from '@/api/workflow.js'
import {DagreLayout} from '@antv/layout'

const props = defineProps({
	workflow: {
		required: false
	}
})


const sequenceGenerator = useSequenceGeneratorProvider()

const mainContainerId = 'workflow-main-container'
const stencilContainerId = 'workflow-stencil-container'
const graphContainerId = 'workflow-graph-container'

let graph



onMounted(()=>{
	graph = initializeWorkflowGraph(stencilContainerId, graphContainerId)

	graph.on('node:added', ({node}) => handleNodeAdded(node))

	graph.on('node:click', ({node}) => handleNodeClicked(node))

	graph.on('cell:mouseenter', ({cell}) => handleMouseEnter(cell))

	graph.on('cell:mouseleave', ({cell}) => {
		cell.removeTool('button-remove')
	})

	if(props.workflow){
		initializeWorkflow()
	}
})

async function initializeWorkflow(){
	formData.value.workflowName = props.workflow.name

	const nodeTypes = await describeNodeTypes({}).then(resp=>{return resp.nodeTypes})
	const graphData = {nodes: [], edges: []}
	for (let node of props.workflow.nodes) {
		sequenceGenerator.addSequence(node.nodeKey)
		sequenceGenerator.addSequence(node.nodeName)

		const nodeTypeItem = nodeTypes.find(n => node.nodeType === n.nodeType)
		const nodeData = {
			nodeType: nodeTypeItem.nodeType,
			nodeTypeName: nodeTypeItem.nodeTypeName,
			nodePropertiesFormMetaData: nodeTypeItem.nodePropertiesFormMetaData,

			nodeKey: node.nodeKey,
			nodeName: node.nodeName,
			nodeProperties: node.nodeProperties,
		}
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

	for (let sequenceFlow of props.workflow.sequenceFlows) {
		graphData.edges.push({
			shape: 'edge',
			source: {
				cell: sequenceFlow.sourceNodeKey,
				port: sequenceFlow.sourceNodeKey+'-bottom'
			},
			target: {
				cell: sequenceFlow.targetNodeKey,
				port: sequenceFlow.targetNodeKey+'-top'
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
		nodesep: 20, // 可选
		ranksep: 20, // 可选
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
		const nodeName = sequenceGenerator.getSequence(node.getData().nodeTypeName)
		const nodeKey = sequenceGenerator.getSequence(node.getData().nodeType)
		node.label = nodeName
		node.updateData({
			nodeName,
			nodeKey
		})
	}
}

const clickedNode = ref()
const clickedNodeData = ref()
function handleNodeClicked(node) {
	clickedNode.value = node
	clickedNodeData.value = node.data
}
watch(()=>clickedNodeData.value?.nodeName, ()=>{
	if(clickedNodeData.value?.nodeName){
		clickedNode.value.label = clickedNodeData.value.nodeName
	}
})

const formData = ref({})

function getCellById(cells, id){
	return cells.find(cell => cell.id === id)
}

function collectNodesAndEdges(){
	const graphData = graph.toJSON()
	formData.value.nodes = []
	formData.value.sequenceFlows = []
	for (let cell of graphData.cells) {
		if(cell.shape === 'edge'){
			formData.value.sequenceFlows.push({
				sourceNodeKey: getCellById(graphData.cells, cell.source.cell)?.data.nodeKey,
				targetNodeKey: getCellById(graphData.cells, cell.target.cell)?.data.nodeKey,
			})
		}else {
			formData.value.nodes.push({
				nodeType: cell.data.nodeType,
				nodeKey: cell.data.nodeKey,
				nodeName: cell.data.nodeName,
				nodeProperties: cell.data.nodeProperties
			})
		}
	}
}

function confirmCreate(){
	collectNodesAndEdges()
	return createWorkflow(formData.value)
}

function confirmUpdate(){
	if(!props.workflow){
		console.error('Current workflow is undefined, cannot update.')
		return
	}
	collectNodesAndEdges()
	const updateData = {
		...formData.value,
		workflowId: props.workflow.id,
	}
	return updateWorkflow(updateData)
}

defineExpose({confirmCreate, confirmUpdate})

</script>

<template>
	<div style="height: 10%">
		<ElInput style="width: 150px;margin-right: 50px" v-model="formData.workflowName" placeholder="请输入流程名称" />
		<ElButton @click="autoRearrange">自动布局</ElButton>
		<ElTooltip>
			<ElButton link icon="Warning">操作说明</ElButton>
			<template #content>
				<div>
					从左侧面板拖拽出节点放置到右侧画布上，鼠标悬停于节点上将显示连接桩(节点边缘的小圆圈)，
					点击连接桩(按住鼠标左键)拖出线条进行连线，连接完成后松开鼠标左键。<br>
					可点击某个节点以修改其属性。<br>
					快捷键：ctrl+c复制，ctrl+v粘贴，ctrl+x剪切，backspace删除，ctrl+z撤销，ctrl+shift+z重做，ctrl+a全选
				</div>
			</template>
		</ElTooltip>
		<ElCard
			v-if="clickedNode"
			style="position: absolute;top: 80px;right: 30px;width: 260px;background-color: #07070e;z-index: 9999"
			:key="clickedNode.label"
		>
			<WorkflowNodeForm
				v-model="clickedNodeData"
			/>
		</ElCard>

	</div>
	<div style="width: 100%;height: 90%">
		<div :id="mainContainerId">
			<div :id="stencilContainerId"></div>
			<div :id="graphContainerId"></div>
		</div>
	</div>

</template>

<!--suppress CssUnusedSymbol -->
<style>
#workflow-main-container {
	display: flex;
	height: 100%;
}
#workflow-stencil-container {
	width: 120px;
	height: 100%;
	position: relative;
}
#workflow-graph-container {
	width: calc(100% - 120px);
	height: 100%;
}
.x6-widget-stencil  {
	background-color: rgba(128,128,128,0.5);
	height: 100%;
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
	padding: 0;
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
</style>
