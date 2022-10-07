import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react'
import * as React from 'react';
import Router from 'next/router'
import { Button, Grid } from '@mui/material';
import moment from 'moment'

const columns = [
  { field: 'name', 
  width: 300,
  headerName: 'List name'
},
{ field: 'taskCount', 
width: 300,
headerName: 'Tasks' 
},
  { field: 'creationDate', 
  width: 300,
  headerName: 'Creation Date' 
},
  {
    field: 'action',
    headerName: 'Options',
    sortable: false,
    width: 300,
    renderCell: (params) => {
        const deleteList = (e) => {
            e.stopPropagation()
        }
        const seeListDetails = (e) => {
            e.stopPropagation()
            return Router.push('/list/' + params.row.name)
        }

        return (<div>
            <Button onClick={seeListDetails}>See more</Button>
            <Button onClick={deleteList}>Delete</Button>
            </div>
        )}
    }
];

const rows = [
  { id: 1, name: 'test', taskCount:'2', creationDate: moment().format('DD/MM/YYYY') },
  { id: 2 ,name: 'test2',taskCount:'2', creationDate: moment().format('DD/MM/YYYY')}
];
export default function ListPanel() {
    const [lists, setList] = useState(rows)
    const [pageSize, setPageSize] = useState(5)
    //useEffect para sacar las listas de un websocket
    return (
        <Grid container justifyContent='center'>
        <Grid item xs={8}>
            <DataGrid
                style={{ height: 400, width: '100%' }}
                rows={lists}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5,10,25,50]}
                />
        </Grid>
        </Grid>
    )
}
