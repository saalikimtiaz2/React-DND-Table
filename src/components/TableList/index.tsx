import { TableTypes } from 'interfaces/tableTypes'
import React, { useEffect, useState } from 'react'

interface TableListProps {
    tables: TableTypes[]
}

const TableList: React.FC<TableListProps> = ({ tables }) => {
    const [search, setSearch] = useState<string>('')
    const [tableList, setTableList] = useState<TableTypes[]>([...tables])

    useEffect(() => {
        if (search !== '') {
            const newList = tableList.filter((fil) =>
                fil.name.toLowerCase().includes(search.toLocaleLowerCase())
            )
            setTableList([...newList])
        } else {
            setTableList([...tables])
        }
    }, [search])

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Tables</h2>
            <input
                type="text"
                value={search}
                placeholder="Search Tables"
                className="w-full outline-none px-4 py-2 rounded-lg border border-gray-300 mb-6 focus:border-blue-500 hover:border-blue-500"
                onChange={(e: any) => setSearch(e.target.value)}
            />
            {tableList.length > 0 ? (
                <>
                    {tableList.map((table: TableTypes) => (
                        <div
                            key={table.id}
                            className="bg-gray-200 p-3 rounded-md mb-2 shadow-md cursor-pointer hover:bg-gray-300"
                            draggable
                            onDragStart={(e) =>
                                e.dataTransfer.setData(
                                    'table',
                                    JSON.stringify(table)
                                )
                            }
                        >
                            {table.name}
                        </div>
                    ))}
                </>
            ) : (
                <div className="text-center">Sorry such table found!</div>
            )}
        </div>
    )
}

export default TableList
