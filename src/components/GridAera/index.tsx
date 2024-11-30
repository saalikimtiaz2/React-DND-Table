import DialogBox from 'components/Dialog'
import { TableNode } from 'components/TableNode'
import React, { useEffect, useRef, useState } from 'react'
import 'react-resizable/css/styles.css'
import ReactFlow, {
    Background,
    Connection,
    Controls,
    Edge,
    MarkerType,
    Node,
    OnEdgesChange,
    OnEdgesDelete,
    OnNodesChange,
    ReactFlowProvider,
    applyEdgeChanges,
    applyNodeChanges,
} from 'reactflow'
import 'reactflow/dist/style.css'

const GridArea: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [tempEdges, setTempEdges] = useState<Edge[]>([])
    const [showDialog, setShowDialog] = useState(false)
    const [isResizing, setIsResizing] = useState(false)

    useEffect(() => {
        console.log(tempEdges)
    }, [tempEdges])

    const toggleDialog = () => {
        setShowDialog((prevState) => !prevState)
    }

    const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(
        null
    )

    useEffect(() => {
        console.log(isResizing)
    }, [isResizing])

    const dragRef = useRef()

    const nodeTypes = {
        tableNode: TableNode,
    }

    const onNodesChange: OnNodesChange = (changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds))
    }

    const onEdgesChange: OnEdgesChange = (changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds))
    }

    const onEdgesDelete: OnEdgesDelete = (deletedEdges) => {
        setEdges((eds) =>
            eds.filter(
                (edge) =>
                    !deletedEdges.find((delEdge) => delEdge.id === edge.id)
            )
        )
    }

    const onResizeStart = (event: React.SyntheticEvent) => {
        console.log('resizeinggg')
        event.stopPropagation()
        setIsResizing(true)
    }

    const onResizeStop = (event: React.SyntheticEvent) => {
        event.stopPropagation()
        setIsResizing(false)
    }

    const onConnect = (params: Connection) => {
        const { source, sourceHandle, target, targetHandle } = params

        if (source && sourceHandle && target && targetHandle) {
            const newEdge: Edge = {
                id: `edge-${source}-${sourceHandle}-${target}-${targetHandle}`,
                source,
                sourceHandle,
                target,
                targetHandle,
                label: `${sourceHandle} → ${targetHandle}`,
                style: { stroke: '#ff8d42', strokeWidth: 2 },

                markerEnd: {
                    type: MarkerType.Arrow,
                    color: '#ff8d42',
                },
            }
            setEdges((eds) => [...eds, newEdge])
        } else {
            console.error('Invalid connection parameters:', params)
        }
    }

    const deleteTable = (id: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== id))
        setEdges((eds) =>
            eds.filter((edge) => edge.source !== id && edge.target !== id)
        )
    }

    const onDrop = (event: React.DragEvent) => {
        event.preventDefault()

        const tableData = event.dataTransfer.getData('table')
        const table = JSON.parse(tableData)

        const existingNode = nodes.find((node) => node.id === table.id)

        if (existingNode) {
            setHighlightedNodeId(table.id)
            setTimeout(() => setHighlightedNodeId(null), 3000)
            return
        }

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const offsetX = 200
        const offsetY = 100

        let x = event.clientX - offsetX
        let y = event.clientY - offsetY

        x = Math.max(0, Math.min(x, viewportWidth - 250))
        y = Math.max(0, Math.min(y, viewportHeight - 120))

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            const nodeRight = node.position.x + 250
            const nodeBottom = node.position.y + 120

            if (
                x < nodeRight &&
                x + 250 > node.position.x &&
                y < nodeBottom &&
                y + 120 > node.position.y
            ) {
                x += 20
                y += 20
                i = -1
            }
        }

        const newNode: Node = {
            id: table.id,
            type: 'tableNode',
            position: { x, y },
            data: {
                label: table.name,
                columns: table.columns,
                deleteTable,
                nodeId: table.id,
                edges,
                dragRef,
                setEdges,
                tempEdges,
                setTempEdges,
                toggleDialog,
                isResizing,
                onResizeStart,
                onResizeStop,
                onEdgesDelete,
            },
        }

        setNodes((prev) => [...prev, newNode])
    }

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault()
    }

    return (
        <>
            <DialogBox
                isOpen={showDialog}
                closeModal={toggleDialog}
                heading="Invalid Data Type"
                subtitle="Couldn't connect the table because data type doesn't mactches."
            />

            <ReactFlowProvider>
                <div
                    className="w-full h-full relative bg-gray-50"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <ReactFlow
                        nodes={nodes.map((node) => ({
                            ...node,
                            className:
                                node.id === highlightedNodeId ? 'animate' : '',
                        }))}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onEdgesDelete={onEdgesDelete}
                        onConnect={onConnect}
                        fitView
                        nodeTypes={nodeTypes}
                        zoomOnScroll={false}
                    >
                        <Background gap={20} size={1} />
                        <Controls />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </>
    )
}

export default React.memo(GridArea)
