import React, { useState } from 'react'
import { CiViewTable } from 'react-icons/ci'
import { MdClose } from 'react-icons/md'
import ReactFlow, {
    Background,
    Connection,
    Controls,
    Edge,
    Handle,
    MarkerType,
    Node,
    NodeProps,
    OnEdgesChange,
    OnEdgesDelete,
    OnNodesChange,
    Position,
    ReactFlowProvider,
    applyEdgeChanges,
    applyNodeChanges,
} from 'reactflow'
import 'reactflow/dist/style.css'

const TableNode: React.FC<NodeProps> = ({ data }) => {
    const { label, columns, deleteTable, nodeId } = data

    return (
        <div className="bg-white shadow-lg relative min-w-[250px]">
            <div className="flex items-center justify-between">
                <h3 className="mb-2 text-sm px-2 flex items-center gap-x-1">
                    <CiViewTable /> {label}
                </h3>
                <button
                    name="delete-table-btn"
                    className=" px-2 hover:text-red-700"
                    onClick={() => deleteTable(nodeId)}
                >
                    <MdClose />
                </button>
            </div>
            <table className="table-auto w-full text-sm mb-2">
                <thead>
                    <tr className="bg-blue-100">
                        <th className="text-left ">Column Name</th>
                        <th className="text-left border-l border-gray-400 pl-2">
                            Data Type
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {columns.map(
                        (col: {
                            column_id: string
                            name: string
                            column_data_type: string
                        }) => (
                            <tr key={col.column_id}>
                                <td>{col.name}</td>
                                <td className="pr-2">{col.column_data_type}</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
            <Handle
                type="source"
                position={Position.Right}
                id="output"
                style={{ top: '50%', background: '#555' }}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                style={{ top: '50%', background: '#555' }}
            />
        </div>
    )
}

const nodeTypes = { tableNode: TableNode }

const GridArea: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])

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
        if (params.source && params.target) {
            const customEdge: Edge = {
                id: `edge-${params.source}-${params.target}`,
                source: params.source,
                target: params.target,
                sourceHandle: params.sourceHandle || null,
                targetHandle: params.targetHandle || null,
                style: { stroke: '#ff8d42', strokeWidth: 3 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#ff8d42',
                },
            }

            setEdges((eds) => [...eds, customEdge])
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
            alert(`Table "${table.name}" already exists!`)
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
            },
        }

        setNodes((prev) => [...prev, newNode])
    }

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault()
    }

    return (
        <ReactFlowProvider>
            <div
                className="w-full h-full relative"
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
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    )
}

export default GridArea
