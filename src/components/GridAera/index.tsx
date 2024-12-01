import DialogBox from 'components/Dialog'
import { nodeTypes } from 'config/nodeTypes'
import React, { useRef, useState } from 'react'
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
    const gridSize = 3
    const cellWidth = 350
    const cellHeight = 200
    const baseOffset = 100

    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [showDialog, setShowDialog] = useState(false)

    const toggleDialog = () => {
        setShowDialog((prevState) => !prevState)
    }

    const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(
        null
    )
    const dragRef = useRef(null)

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

    const onConnect = (params: Connection) => {
        const { source, sourceHandle, target, targetHandle } = params
        console.log('Params', params)

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

        // Find next available position for new node only
        const occupiedPositions = new Set(
            nodes.map((node) => `${node.position.x},${node.position.y}`)
        )

        let newNodeCol = 0
        let newNodeRow = 0

        // Find first unoccupied position
        while (true) {
            const xAxis = newNodeCol * cellWidth + baseOffset
            const yAxis = newNodeRow * cellHeight + baseOffset
            const posKey = `${xAxis},${yAxis}`

            if (!occupiedPositions.has(posKey)) {
                break
            }

            newNodeCol += 1
            if (newNodeCol >= gridSize) {
                newNodeCol = 0
                newNodeRow += 1
                if (newNodeRow >= gridSize) newNodeRow = 0
            }
        }

        const newNode: Node = {
            id: table.id,
            type: 'tableNode',
            position: {
                x: newNodeCol * cellWidth + baseOffset,
                y: newNodeRow * cellHeight + baseOffset,
            },
            style: {
                height: 150,
            },
            data: {
                label: table.name,
                columns: table.columns,
                deleteTable,
                nodeId: table.id,
                edges,
                dragRef,
                setEdges,
                toggleDialog,
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
                    className="w-full h-full relative bg-[#1c1c1c]"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <ReactFlow
                        nodes={nodes.map((node) => ({
                            ...node,
                            className:
                                node.id === highlightedNodeId
                                    ? 'animate animate-pulse'
                                    : '',
                        }))}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onEdgesDelete={onEdgesDelete}
                        onConnect={onConnect}
                        nodesConnectable={false}
                        connectionLineComponent={undefined}
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
