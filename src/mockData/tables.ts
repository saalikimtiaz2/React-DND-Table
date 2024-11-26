import { TableTypes } from 'interfaces/tableTypes'

export const tableLists: TableTypes[] = [
    {
        id: 'empTable',
        name: 'Employees',
        columns: [
            { column_id: 'col1', name: 'id', column_data_type: 'string' },
            {
                column_id: 'col2',
                name: 'First Name',
                column_data_type: 'string',
            },
            {
                column_id: 'col3',
                name: 'Last Name',
                column_data_type: 'string',
            },
            { column_id: 'col4', name: 'Age', column_data_type: 'number' },
            {
                column_id: 'col5',
                name: 'Phone',
                column_data_type: 'number',
            },
            {
                column_id: 'col6',
                name: 'Email',
                column_data_type: 'string',
            },
        ],
    },
    {
        id: 'salTable',
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
            {
                column_id: 'col3',
                name: 'Tax',
                column_data_type: 'Number',
            },
            {
                column_id: 'col4',
                name: 'Allowance',
                column_data_type: 'Number',
            },
            {
                column_id: 'col5',
                name: 'Bonus',
                column_data_type: 'Number',
            },
        ],
    },
    {
        id: 'patTable',
        name: 'Patients',
        columns: [
            {
                column_id: 'col1',
                name: 'Pid',
                column_data_type: 'string',
            },
            {
                column_id: 'col2',
                name: 'Patient Name',
                column_data_type: 'string',
            },
            {
                column_id: 'col3',
                name: 'Condition',
                column_data_type: 'string',
            },
            {
                column_id: 'col4',
                name: 'Tests',
                column_data_type: 'string',
            },
            {
                column_id: 'col5',
                name: 'Bills',
                column_data_type: 'string',
            },
        ],
    },
]
