import { columnType } from 'interfaces/tableTypes'
import React, { useEffect, useState } from 'react'
import { CiViewTable } from 'react-icons/ci'
import { MdClose } from 'react-icons/md'
import { ResizableBox } from 'react-resizable'
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
        onResizeStart,
        onResizeStop,
    } = data

    const [isDraggingRow, setIsDraggingRow] = useState<null | string>(null)

    const onDragEnter = (colId: string) => setIsDraggingRow(colId)
    const onDragLeave = () => setIsDraggingRow(null)

    useEffect(() => {
        console.log('row', isDraggingRow)
    }, [isDraggingRow])

    const [dimensions, setDimensions] = useState({
        width: 250,
        height: 120,
    })

    const onResize = (
        _event: React.SyntheticEvent,
        { size }: { size: { width: number; height: number } }
    ) => {
        setDimensions({ width: size.width, height: size.height })
    }

    const onDragStart = (evt: React.DragEvent, column: columnType) => {
        evt.stopPropagation()
        evt.dataTransfer.effectAllowed = 'move'

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
        onDragLeave()

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
        <ResizableBox
            width={dimensions.width}
            height={dimensions.height}
            minConstraints={[250, 120]}
            maxConstraints={[600, 400]}
            resizeHandles={['se']}
            onResize={onResize}
            onResizeStart={onResizeStart}
            onResizeStop={onResizeStop}
            className="overflow-hidden"
        >
            <div
                className="bg-white rounded shadow-xl relative min-w-[250px]  "
                onMouseDown={(e) => e.stopPropagation()}
            >
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
                    onDragOver={(evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                    }}
                    onWheel={(evt) => evt.stopPropagation()}
                >
                    <div
                        className="table-auto w-full text-xs mb-2"
                        onDragOver={(evt) => evt.preventDefault()}
                        onDragEnter={(evt) => evt.preventDefault()}
                        onDragLeave={(evt) => evt.preventDefault()}
                    >
                        <div className="bg-blue-100 flex items-center">
                            <div className="text-left flex-1 px-2">
                                Column Name
                            </div>
                            <div className="text-left flex-1 px-2 border-l border-gray-400">
                                Data Type
                            </div>
                        </div>

                        <div>
                            {columns.map((col: columnType) => (
                                <div
                                    key={col.column_id}
                                    id={col.column_id}
                                    data-row="true"
                                    className={`z-[999] flex items-center border-b bg-primary/5 border-gray-200 last:border-none relative ${
                                        isDraggingRow === col.column_id
                                            ? 'bg-green-100'
                                            : ''
                                    }`}
                                    draggable={false}
                                    onDragEnter={(evt) => {
                                        onDragEnter(col.column_id)
                                        evt.preventDefault()
                                    }}
                                    onDragLeave={(evt) => {
                                        evt.preventDefault()
                                        onDragLeave()
                                    }}
                                    onDragOver={(evt) => evt.preventDefault()}
                                    onDrop={(evt) => onDropColumn(evt, col)}
                                >
                                    {isDraggingRow === col.column_id ? (
                                        <div className="text-center flex-1 text-gray-400">
                                            Drop here
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                className="px-4 bg-secondary flex-1"
                                                draggable="true"
                                                onDragStart={(evt) =>
                                                    onDragStart(evt, col)
                                                }
                                                onDrag={(evt) =>
                                                    evt.stopPropagation()
                                                }
                                            >
                                                {col.name}
                                            </div>
                                            <div className="px-2 flex-1">
                                                {col.column_data_type}
                                            </div>
                                        </>
                                    )}
                                    <Handle
                                        type="source"
                                        position={Position.Right}
                                        id={`source-${col.column_id}`}
                                        style={{
                                            top: `50%`,
                                            transform: 'translateY(-50%)',
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
                                            transform: 'translateY(-50%)',
                                            opacity: 0,
                                            height: '100%',
                                            background: '#555',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ResizableBox>
    )
}

export const TableNode = React.memo(TableNodeComponent)
