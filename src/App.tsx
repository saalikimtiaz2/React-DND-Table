import GridArea from 'components/GridAera'
import TableList from 'components/TableList'
import React, { useState } from 'react'

const App: React.FC = () => {
    const [tables] = useState([
        {
            id: 'table1',
            name: 'Employees',
            columns: [
                { column_id: 'col1', name: 'id', column_data_type: 'string' },
                { column_id: 'col2', name: 'Name', column_data_type: 'string' },
                { column_id: 'col3', name: 'Age', column_data_type: 'number' },
            ],
        },
        {
            id: 'table2',
            name: 'Salary',
            columns: [
                {
                    column_id: 'col1',
                    name: 'id',
                    column_data_type: 'string',
                },
                {
                    column_id: 'col2',
                    name: 'Salary',
                    column_data_type: 'Number',
                },
            ],
        },
        {
            id: 'table3',
            name: 'Patients',
            columns: [
                {
                    column_id: 'col1',
                    name: 'Patient Name',
                    column_data_type: 'string',
                },
                {
                    column_id: 'col2',
                    name: 'Condition',
                    column_data_type: 'string',
                },
            ],
        },
    ])

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-100 p-4">
                <TableList tables={tables} />
            </div>
            <div className="w-3/4 bg-white">
                <GridArea />
            </div>
        </div>
    )
}

export default App
