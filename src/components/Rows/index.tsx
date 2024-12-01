import { columnType } from 'interfaces/tableTypes'
import React, { useState } from 'react'
import { Handle, MarkerType, Position } from 'reactflow'

type RowItemType = {
    rowData: columnType
    nodeId: string
    dragRef: any
    setEdges: (edge: any) => void
    toggleDialog: () => void
}

const RowItem: React.FC<RowItemType> = ({
    rowData,
    nodeId,
    dragRef,
    setEdges,
    toggleDialog,
}) => {
    const [isDraggingRow, setIsDraggingRow] = useState<null | string>(null)

    const onDragEnter = (colId: string) => setIsDraggingRow(colId)
    const onDragLeave = () => setIsDraggingRow(null)

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
        const updateEdge = {
            ...dragRef?.current,
            target: nodeId,
            label: `${dragRef.current.label} -> ${column?.name}`,
            targetHandle: `target-${column?.column_id}`,
        }

        if (dragRef.current?.source !== nodeId) {
            if (dragRef.current?.sourceId === column?.column_data_type) {
                setEdges((prevState: any) => [...prevState, updateEdge])
                dragRef.current = null
            } else {
                toggleDialog()
                dragRef.current = null
            }
        } else {
            console.log("Couldn't connect on same table.")
        }
    }

    return (
        <div
            key={rowData.column_id}
            id={rowData.column_id}
            data-row="true"
            className={`z-[999] row-main flex items-center h-[20px] border-b cursor-default bg-primary/5 border-gray-200 last:border-none relative ${
                isDraggingRow === rowData.column_id ? 'bg-green-100' : ''
            }`}
            draggable={true}
            onDragStart={(evt) => onDragStart(evt, rowData)}
            onDragEnter={(evt) => {
                onDragEnter(rowData.column_id)
                evt.preventDefault()
            }}
            onDragLeave={(evt) => {
                evt.preventDefault()
                onDragLeave()
            }}
            onDragOver={(evt) => evt.preventDefault()}
        >
            {dragRef.current?.source !== nodeId &&
            isDraggingRow === rowData.column_id ? (
                <div
                    className={`text-center flex-1  h-full ${dragRef.current?.sourceId === rowData.column_data_type ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                    onDragOver={(evt) => evt.preventDefault()}
                    onDrop={(evt) => onDropColumn(evt, rowData)}
                    onDragEnter={() => setIsDraggingRow(rowData.column_id)}
                    onDragLeave={() => setIsDraggingRow(null)}
                >
                    {dragRef.current?.sourceId === rowData.column_data_type
                        ? 'Drop here'
                        : "Data type doesn't match"}
                </div>
            ) : (
                <>
                    <div className="px-4 bg-secondary/50 flex-1 h-full">
                        {rowData.name}
                    </div>
                    <div className="px-2 flex-1 text-right pr-6  h-full">
                        {rowData.column_data_type}
                    </div>
                </>
            )}
            <Handle
                type="source"
                position={Position.Right}
                id={`source-${rowData.column_id}`}
                className="handle handleVisible"
                style={{
                    top: `50%`,
                    right: '2px',
                    transform: 'translateY(-50%)',
                    height: '100%',
                    borderRadius: '3px',
                    maxHeight: '16px',
                    width: '16px',
                    background: 'white',
                    border: 'none',
                }}
            />
            <Handle
                type="target"
                className="handle"
                position={Position.Left}
                id={`target-${rowData.column_id}`}
                style={{
                    top: `50%`,
                    transform: 'translateY(-50%)',
                    opacity: 0,
                    height: '100%',
                    background: '#555',
                }}
            />
        </div>
    )
}

export default RowItem
