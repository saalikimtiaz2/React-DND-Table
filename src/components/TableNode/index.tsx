import { columnType } from 'interfaces/tableTypes'
import React, { useState } from 'react'
import { CiViewTable } from 'react-icons/ci'
import { MdClose } from 'react-icons/md'
import 'react-resizable/css/styles.css'
import { Handle, MarkerType, NodeProps, Position } from 'reactflow'
import 'reactflow/dist/style.css'

const TableNodeComponent: React.FC<NodeProps> = ({ data }) => {
    const {
        label,
        columns,
        nodeId,
        deleteTable,
        dragRef,
        setEdges,
        toggleDialog,
        onEdgesDelete,
        edges,
        tempEdges,
        setTempEdges,
        onResizeStart,
        onResizeStop,
    } = data

    const [dimensions, setDimensions] = useState({
        width: 250,
        height: 120,
    })

    const onResize = (
        event: React.SyntheticEvent,
        { size }: { size: { width: number; height: number } }
    ) => {
        event.preventDefault()
        event.stopPropagation()
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

        const newEdge = {
            id: `edge-${nodeId}-${column.column_id}`,
            source: nodeId,
            sourceHandle: `source-${column.column_id}`,
            sourceId: column.column_data_type,
            target: '',
            targetHandle: '',
            label: `${column.name}`,
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

        dragRef.current = newEdge
    }

    const onDropColumn = (evt: React.DragEvent, column: columnType | null) => {
        evt.preventDefault()
        evt.stopPropagation()

        console.log('dropping')

        const updateEdge = {
            ...dragRef?.current,
            target: nodeId,
            label: `${dragRef.current.label} -> ${column?.name}`,
            targetHandle: `target-${column?.column_id}`,
        }

        if (dragRef.current?.source !== nodeId) {
            if (dragRef.current?.sourceId === column?.column_data_type) {
                setEdges((prevState: any) => [...prevState, updateEdge])
            } else {
                toggleDialog()
            }
        } else {
            console.log("Couldn't connect on same table.")
        }
    }

    return (
        // <ResizableBox
        //     width={dimensions.width}
        //     height={dimensions.height}
        //     minConstraints={[250, 120]}
        //     maxConstraints={[600, 400]}
        //     resizeHandles={['se']}
        //     onResize={onResize}
        //     onResizeStart={onResizeStart}
        //     onResizeStop={onResizeStop}
        // >
        <div className="bg-white rounded shadow-xl relative min-w-[250px]  ">
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
            <div
                onDragOver={(evt) => evt.preventDefault()}
                onWheel={(evt) => {
                    evt.stopPropagation()
                }}
            >
                <table
                    className="table-auto w-full text-xs mb-2"
                    onDragOver={(evt) => evt.preventDefault()}
                    onDragEnter={(evt) => evt.preventDefault()}
                    onDragLeave={(evt) => evt.preventDefault()}
                >
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
                                className="cursor-pointer border-b bg-primary/5 p-4 border-gray-200 z-50 last:border-none relative"
                                draggable
                                onDragStart={(evt) => onDragStart(evt, col)}
                                onDrop={(evt) => {
                                    console.log('Here I am')
                                    onDropColumn(evt, col)
                                }}
                                onDragEnd={() => {
                                    console.log('Dropping ')
                                }}
                                onDragOver={(evt) => evt.preventDefault()}
                                // onDragEnter={(evt) => evt.preventDefault()}
                                // onDragLeave={(evt) => evt.preventDefault()}
                            >
                                <td className="px-4 bg-secondary">
                                    {col.name}
                                </td>
                                <td className="px-2 z-20">
                                    {col.column_data_type}
                                </td>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={`source-${col.column_id}`}
                                    style={{
                                        top: `50%`,
                                        transform: 'traslateY(-50%)',
                                        opacity: 0,
                                        height: '100%',
                                        background: '#555',
                                    }}
                                />
                                <Handle
                                    type="target"
                                    position={Position.Left}
                                    id={`target-${col.column_id}`}
                                    style={{
                                        top: `50%`,
                                        transform: 'traslateY(-50%)',
                                        opacity: 0,
                                        height: '100%',
                                        background: '#555',
                                    }}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        // </ResizableBox>
    )
}

export const TableNode = React.memo(TableNodeComponent)
