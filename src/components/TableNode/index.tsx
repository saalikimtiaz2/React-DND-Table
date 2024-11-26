import { columnType } from 'interfaces/tableTypes'
import React, { useState } from 'react'
import { CiViewTable } from 'react-icons/ci'
import { MdClose } from 'react-icons/md'
import { Resizable } from 'react-resizable'
import 'react-resizable/css/styles.css'
import { Edge, Handle, MarkerType, NodeProps, Position } from 'reactflow'
import 'reactflow/dist/style.css'

const TableNode: React.FC<NodeProps> = ({ data }) => {
    const { label, columns, nodeId, deleteTable, dragRef, setEdges } = data

    const [dimensions, setDimensions] = useState({
        width: 200,
        height: 200,
    })

    const onResize = (
        event: React.SyntheticEvent,
        { size }: { size: { width: number; height: number } }
    ) => {
        setDimensions({ width: size.width, height: size.height })
    }

    const onDragStart = (evt: React.DragEvent, column: columnType) => {
        evt.dataTransfer.setData(
            'sourceColumn',
            JSON.stringify({
                columnId: column.column_id,
                columnName: column.name,
                columnType: column.column_data_type,
                sourceNodeId: nodeId,
            })
        )

        const newEdge: Edge = {
            id: `edge-${nodeId}-${column.column_id}`,
            source: nodeId,
            sourceHandle: `source-${column.column_id}`,
            target: '',
            targetHandle: '',
            label: `${column.name} `,
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

        if (setEdges) {
            dragRef.current = newEdge
        } else {
            console.error('setEdges is not a function')
        }
    }

    const onDropColumn = (evt: React.DragEvent, column: columnType) => {
        evt.preventDefault()

        const updateEdge = {
            ...dragRef?.current,
            target: nodeId,
            label: `${dragRef.current.label} -> ${column.name}`,
            targetHandle: `target-${column.column_id}`,
        }

        setEdges([updateEdge])
    }

    return (
        <Resizable
            width={dimensions.width}
            height={dimensions.height}
            minConstraints={[250, 150]}
            maxConstraints={[600, 400]}
            resizeHandles={['se']}
            onResize={onResize}
            className="overflow-hidden bg-white rounded shadow-xl relative"
        >
            <div className="bg-white rounded shadow-xl relative min-w-[250px]">
                <div className="flex items-center justify-between border-b border-gray-200">
                    <h3 className="text-sm px-2 py-1 flex items-center gap-x-1 font-medium">
                        <CiViewTable /> {label}
                    </h3>
                    <button
                        name="delete-table-btn"
                        className="px-2 hover:text-red-700"
                        onClick={() => deleteTable(nodeId)}
                    >
                        <MdClose />
                    </button>
                </div>
                <table className="table-auto w-full text-xs mb-2">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="text-left px-2">Column Name</th>
                            <th className="text-left px-2 border-l border-gray-400">
                                Data Type
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {columns.map((col: columnType, index: number) => (
                            <tr
                                key={col.column_id}
                                id={col.column_id}
                                className="cursor-pointer border-b border-gray-200 last:border-none relative"
                                draggable
                                onDragStart={(evt) => onDragStart(evt, col)}
                                onDrop={(evt) => onDropColumn(evt, col)}
                                onDragOver={(evt) => {
                                    onDropColumn(evt, col)
                                }}
                            >
                                <td className="px-2">{col.name}</td>
                                <td className="px-2">{col.column_data_type}</td>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={`source-${col.column_id}`}
                                    style={{
                                        top: `${index + 1}px`,
                                        opacity: 0,
                                        background: '#555',
                                    }}
                                />
                                <Handle
                                    type="target"
                                    position={Position.Left}
                                    id={`target-${col.column_id}`}
                                    style={{
                                        top: `${index + 1}px`,
                                        opacity: 0,
                                        background: '#555',
                                    }}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Resizable>
    )
}

export default TableNode
