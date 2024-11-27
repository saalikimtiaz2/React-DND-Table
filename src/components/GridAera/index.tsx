import ErrorMessage from 'components/ErrorMessage'
import {TableNode} from 'components/TableNode'
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
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [showError, setShowError] = useState(false)

    const dragRef = useRef()

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

        if (source && sourceHandle && target && targetHandle) {
            const newEdge: Edge = {
                id: `edge-${source}-${sourceHandle}-${target}-${targetHandle}`,
                source,
                sourceHandle,
                target,
                targetHandle,
                label: `${sourceHandle} → ${targetHandle}`,
                style: { stroke: '#ff8d42', strokeWidth: 2 },
                markerStart: {
                    type: MarkerType.Arrow,
                    color: '#ff8d42',
                },
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

        if (nodes.some((node) => node.id === table.id)) {
            setShowError(true)
            setTimeout(() => setShowError(false), 3000)
            return
        }

        const newNode: Node = {
            id: table.id,
            type: 'tableNode',
            position: { x: event.clientX - 200, y: event.clientY - 100 },
            data: {
                label: table.name,
                columns: table.columns,
                deleteTable,
                nodeId: table.id,
                edges,
                dragRef,
                setEdges,
            },
        }

        setNodes((prev) => [...prev, newNode])
    }

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault()
    }

    return (
        <>
            {showError && <ErrorMessage statement="Table already exists!" />}
            <ReactFlowProvider>
                <div
                    className="w-full h-full relative bg-gray-50"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onEdgesDelete={onEdgesDelete}
                        onConnect={onConnect}
                        fitView
                        nodeTypes={{ tableNode: TableNode }}
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
