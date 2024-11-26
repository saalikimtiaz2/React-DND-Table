type columnType = { column_id: string; name: string; column_data_type: string }

type TableTypes = {
    id: string
    name: string
    columns: columnType[]
}

export type { TableTypes, columnType };

