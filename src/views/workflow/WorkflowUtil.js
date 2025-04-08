import {Graph, Shape} from '@antv/x6'

import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'

import {DagreLayout} from '@antv/layout'

import {describeNodeTypes} from '@/api/workflow.js'

export function initializeWorkflowGraph(stencilContainerId, graphContainerId){
    const graph = createWorkflowGraph(graphContainerId)

    graph.use(new Transform({resizing: true, rotating: true}))
        .use(new Selection({rubberband: false, showNodeSelectionBox: true}))
        .use(new Snapline())
        .use(new Keyboard())
        .use(new Clipboard())
        .use(new History())

    const stencil = createStencil(graph, stencilContainerId)

    bindKeys(graph)

    const ports = configurePorts(graph)

    initializeNodes(ports, graph, stencil)

    return graph
}


export function rearrangeLayout(graph){
    const dagreLayout = new DagreLayout({
        nodesep: 20, // 可选
        ranksep: 20, // 可选
    })
    const oldJson = graph.toJSON()

    console.log(oldJson)

    const oldModel = {
        edges: [],
        nodes: []
    }

    oldJson.cells.forEach(cell => {
        if(cell.shape === 'edge'){
            oldModel.edges.push(cell)
        }else {
            oldModel.nodes.push(cell)
        }
    })

    const newModel = dagreLayout.layout(oldModel)

    console.log(newModel)

    graph.fromJSON(newModel)
}


function initializeNodes(ports, graph, stencil) {
    Graph.registerNode(
        'custom-rect',
        {
            inherit: 'rect',
            width: 80,
            height: 36,
            attrs: {
                body: {
                    strokeWidth: 1,
                    stroke: '#5F95FF',
                    fill: '#EFF4FF',
                },
                text: {
                    fontSize: 12,
                    fill: '#262626',
                },
            },
            ports: {...ports},
        },
        true,
    )

    Graph.registerNode(
        'custom-polygon',
        {
            inherit: 'polygon',
            width: 66,
            height: 36,
            attrs: {
                body: {
                    strokeWidth: 1,
                    stroke: '#5F95FF',
                    fill: '#EFF4FF',
                },
                text: {
                    fontSize: 12,
                    fill: '#262626',
                },
            },
            ports: {
                ...ports,
                items: [
                    {
                        group: 'top',
                    },
                    {
                        group: 'bottom',
                    },
                ],
            },
        },
        true,
    )

    Graph.registerNode(
        'custom-circle',
        {
            inherit: 'circle',
            width: 45,
            height: 45,
            attrs: {
                body: {
                    strokeWidth: 1,
                    stroke: '#5F95FF',
                    fill: '#EFF4FF',
                },
                text: {
                    fontSize: 12,
                    fill: '#262626',
                },
            },
            ports: {...ports},
        },
        true,
    )

    Graph.registerNode(
        'custom-image',
        {
            inherit: 'rect',
            width: 52,
            height: 52,
            markup: [
                {
                    tagName: 'rect',
                    selector: 'body',
                },
                {
                    tagName: 'image',
                },
                {
                    tagName: 'text',
                    selector: 'label',
                },
            ],
            attrs: {
                body: {
                    stroke: '#5F95FF',
                    fill: '#5F95FF',
                },
                image: {
                    width: 26,
                    height: 26,
                    refX: 13,
                    refY: 16,
                },
                label: {
                    refX: 3,
                    refY: 2,
                    textAnchor: 'left',
                    textVerticalAnchor: 'top',
                    fontSize: 12,
                    fill: '#fff',
                },
            },
            ports: {...ports},
        },
        true,
    )


    const nodes = []

    describeNodeTypes({}).then(resp => {
        for (let nodeTypeItem of resp.nodeTypes) {
            const nodeData = {
                nodeType: nodeTypeItem.nodeType,
                nodeTypeName: nodeTypeItem.nodeTypeName,
                nodePropertiesFormMetaData: nodeTypeItem.nodePropertiesFormMetaData,
                nodeProperties: {}
            }

            nodes.push({
                shape: 'custom-rect',
                label: nodeTypeItem.nodeTypeName,
                data: nodeData,
                attrs: {
                    body: {
                        rx: 10,
                        ry: 10,
                    },
                },
            })
        }

        stencil.load(nodes, 'group1')
    })
}



function bindKeys(graph) {
    graph.bindKey(['meta+c', 'ctrl+c'], () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
            graph.copy(cells)
        }
        return false
    })
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
            graph.cut(cells)
        }
        return false
    })
    graph.bindKey(['meta+v', 'ctrl+v'], () => {
        if (!graph.isClipboardEmpty()) {
            const cells = graph.paste({offset: 32})
            graph.cleanSelection()
            graph.select(cells)
        }
        return false
    })

// undo redo
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
        if (graph.canUndo()) {
            graph.undo()
        }
        return false
    })
    graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
        if (graph.canRedo()) {
            graph.redo()
        }
        return false
    })

// select all
    graph.bindKey(['meta+a', 'ctrl+a'], () => {
        const nodes = graph.getNodes()
        if (nodes) {
            graph.select(nodes)
        }
    })

// delete
    graph.bindKey('backspace', () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
            graph.removeCells(cells)
        }
    })
}

function configurePorts(graph) {
    const showPorts = (ports, show) => {
        for (let i = 0, len = ports.length; i < len; i += 1) {
            ports[i].style.visibility = show ? 'visible' : 'hidden'
        }
    }
    graph.on('node:mouseenter', () => {
        const container = document.getElementById(graph.container.id)
        const ports = container.querySelectorAll(
            '.x6-port-body',
        )
        showPorts(ports, true)
    })
    graph.on('node:mouseleave', () => {
        const container = document.getElementById(graph.container.id)
        const ports = container.querySelectorAll(
            '.x6-port-body',
        )
        showPorts(ports, false)
    })

    return {
        groups: {
            top: {
                position: 'top',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            right: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            bottom: {
                position: 'bottom',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            left: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
        },
        items: [
            {
                group: 'top',
            },
            {
                group: 'right',
            },
            {
                group: 'bottom',
            },
            {
                group: 'left',
            },
        ],
    }
}


function createStencil(graph, stencilContainerId) {
    const stencil = new Stencil({
        title: '流程图',
        target: graph,
        stencilGraphWidth: 120,
        collapsable: true,
        groups: [
            {
                title: '节点列表',
                name: 'group1',
                collapsable: true
            },
        ],
        stencilGraphHeight: 300,
        layoutOptions: {
            columns: 1,
            columnWidth: 100,
            rowHeight: 55,
        },
    })

    const stencilContainer = document.getElementById(stencilContainerId)

    stencilContainer.appendChild(stencil.container)
    return stencil
}

function createWorkflowGraph(graphContainerId) {
    return new Graph({
        container: document.getElementById(graphContainerId),
        width: '100%',
        height: '100%',
        grid: true,
        panning: true,
        connecting: {
            router: 'manhattan',
            connector: {
                name: 'rounded',
                args: {
                    radius: 8,
                },
            },
            anchor: 'center',
            connectionPoint: 'anchor',
            allowBlank: false,
            snap: {
                radius: 20,
            },
            createEdge() {
                return new Shape.Edge({
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
            },
            validateConnection({targetMagnet}) {
                return !!targetMagnet
            },
        },
        highlighting: {
            magnetAdsorbed: {
                name: 'stroke',
                args: {
                    attrs: {
                        fill: '#5F95FF',
                        stroke: '#5F95FF',
                    },
                },
            },
        },
    })
}

