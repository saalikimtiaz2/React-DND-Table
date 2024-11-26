import GridArea from 'components/GridAera'
import TableList from 'components/TableList'
import { tableLists } from 'mockData/tables'
import React from 'react'

const App: React.FC = () => {
    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-100 p-4">
                <TableList tables={tableLists} />
            </div>
            <div className="w-3/4 bg-white">
                <GridArea />
            </div>
        </div>
    )
}

export default App
