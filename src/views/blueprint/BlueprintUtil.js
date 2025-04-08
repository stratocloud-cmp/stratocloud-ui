import {Graph, Shape} from '@antv/x6'

import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { Scroller } from '@antv/x6-plugin-scroller'

import {DagreLayout} from '@antv/layout'

import {describeResourceTypes} from '@/api/resource.js'

export function initializeBlueprintGraph(stencilContainerId, graphContainerId){
    const graph = createBlueprintGraph(graphContainerId)

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
        nodesep: 30, // 可选
        ranksep: 30, // 可选
    })
    const oldJson = graph.toJSON()
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
    graph.fromJSON(newModel)
}


function initializeNodes(ports, graph, stencil) {
    Graph.registerNode(
        'custom-rect',
        {
            inherit: 'rect',
            width: 100,
            height: 36,
            attrs: {
                body: {
                    strokeWidth: 1,
                    stroke: '#5F95FF',
                    fill: '#EFF4FF',
                },
                text: {
                    fontSize: 10,
                },
            },
            ports: {...ports},
        },
        true,
    )




    describeResourceTypes({}).then(resp => {
        const providerNamesMap = new Map()
        const providerNodesMap = new Map()
        for (let resourceType of resp.resourceTypes) {
            const nodeData = {
                resourceTypeId: resourceType.spec.resourceTypeId,
                resourceTypeName: resourceType.spec.resourceTypeName,
                borrowed: !resourceType.spec.buildable,
                resourceProperties: {}
            }

            const node = {
                shape: 'custom-rect',
                label: resourceType.spec.resourceTypeName,
                data: nodeData,
                attrs: {
                    body: {
                        rx: 4,
                        ry: 4,
                    },
                },
            }

            providerNamesMap.set(resourceType.spec.providerId, resourceType.spec.providerName)

            if(!providerNodesMap.has(resourceType.spec.providerId)){
                providerNodesMap.set(resourceType.spec.providerId, [])
            }

            providerNodesMap.get(resourceType.spec.providerId).push(node)
        }

        const groups = []
        for (let providerId of providerNamesMap.keys()) {
            let nodesCount = 0

            if(providerNodesMap.has(providerId)){
                nodesCount = providerNodesMap.get(providerId).length
            }

            groups.push({
                title: providerNamesMap.get(providerId),
                name: providerId,
                collapsable: true,
                graphHeight: (nodesCount/2)*42+50,
                layoutOptions: {
                    columns: 2,
                    columnWidth: 110,
                    rowHeight: 42,
                },
            })
        }
        stencil.addGroup(groups)

        for (let providerId of providerNodesMap.keys()) {
            stencil.load(providerNodesMap.get(providerId), providerId)
        }
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
        title: '资源栈蓝图',
        target: graph,
        stencilGraphWidth: 300,
        stencilGraphHeight: 30,
        collapsable: true,

        groups: [],
        layoutOptions: {
            columns: 2,
            columnWidth: 110,
            rowHeight: 42,
        },
    })

    const stencilContainer = document.getElementById(stencilContainerId)

    stencilContainer.appendChild(stencil.container)
    return stencil
}

function createBlueprintGraph(graphContainerId) {
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

