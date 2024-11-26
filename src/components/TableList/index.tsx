import React from 'react'

interface Table {
    id: string
    name: string
    columns: { column_id: string; name: string; column_data_type: string }[]
}

interface TableListProps {
    tables: Table[]
}

const TableList: React.FC<TableListProps> = ({ tables }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Tables</h2>
            {tables.map((table) => (
                <div
                    key={table.id}
                    className="bg-gray-200 p-3 rounded-md mb-2 shadow-md cursor-pointer hover:bg-gray-300"
                    draggable
                    onDragStart={(e) =>
                        e.dataTransfer.setData('table', JSON.stringify(table))
                    }
                >
                    {table.name}
                </div>
            ))}
        </div>
    )
}

export default TableList
