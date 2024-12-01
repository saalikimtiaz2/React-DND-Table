import RowItem from 'components/Rows'
import { columnType } from 'interfaces/tableTypes'
import React, { useState } from 'react'
import { CiViewTable } from 'react-icons/ci'
import { MdClose } from 'react-icons/md'
import 'react-resizable/css/styles.css'
import { NodeProps, NodeResizer } from 'reactflow'
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
    } = data

    const [height, setHeight] = useState('120px')
    const maxHeight = 30 + 20 + 20 * columns.length

    return (
        <>
            <NodeResizer
                minWidth={250}
                minHeight={100}
                maxWidth={350}
                maxHeight={maxHeight}
                handleStyle={{ zIndex: 999 }}
                lineStyle={{
                    zIndex: 998,
                    overflow: 'hidden ',
                }}
                onResize={(e) => setHeight(`${e.y}px`)}
            />
            <div
                style={{ maxHeight: `${height} !important` }}
                className="z-[997] bg-white rounded shadow-xl relative h-full min-w-[250px] overflow-x-hidden overflow-y-scroll scrollbar-hidden nowheel border border-grey-500"
            >
                <div className="flex items-center justify-between border-b border-gray-200 h-[30px]">
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
                        className="w-full text-xs mb-2 "
                        onDragOver={(evt) => evt.preventDefault()}
                        onDragEnter={(evt) => evt.preventDefault()}
                        onDragLeave={(evt) => evt.preventDefault()}
                    >
                        <div className="bg-blue-100 flex items-center h-[20px]">
                            <div className="text-left flex-1 px-2">
                                Column Name
                            </div>
                            <div className="text-left flex-1 px-2 ">
                                Data Type
                            </div>
                        </div>

                        <div>
                            {columns.map((col: columnType) => (
                                <RowItem
                                    rowData={col}
                                    nodeId={nodeId}
                                    dragRef={dragRef}
                                    setEdges={setEdges}
                                    toggleDialog={toggleDialog}
                                    key={col.column_id}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const TableNode = React.memo(TableNodeComponent)
