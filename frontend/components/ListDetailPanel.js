import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import * as React from 'react';
import Router from 'next/router';
import { Button, Card, CardContent, Checkbox, Grid } from '@mui/material';
import moment from 'moment';

const columns = [
  { field: 'name', width: 300, headerName: 'List name' },
  {
    field: 'done',
    width: 280,
    headerName: 'Done',
    renderCell: (params) => {
      const changeValue = (e) => {
        e.stopPropagation();
        //change vaue in ws
      };

      return <Checkbox checked={params.row.done} onChange={changeValue} />;
    },
  },
  { field: 'creationDate', width: 300, headerName: 'Creation Date' },
  {
    field: 'action',
    headerName: 'Options',
    sortable: false,
    width: 300,
    renderCell: (params) => {
      const deleteList = (e) => {
        e.stopPropagation();
        //call api service to delete
      };
      const seeListDetails = (e) => {
        e.stopPropagation();
        return Router.push('/lists/' + params.row.name);
      };

      return (
        <div>
          <Button onClick={deleteList}>Delete</Button>
        </div>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    name: 'test',
    done: true,
    creationDate: moment().format('DD/MM/YYYY'),
  },
  {
    id: 2,
    name: 'test2',
    done: false,
    creationDate: moment().format('DD/MM/YYYY'),
  },
];
export default function ListPanel(props) {
  const { listName } = props;
  const [tasks, setTasks] = useState(rows);
  const [pageSize, setPageSize] = useState(5);
  //useEffect para sacar las listas de un websocket
  return (
    <Grid container justifyContent="center">
      <Grid item xs={8}>
        <Card>
          <h1>{listName}</h1>
          <CardContent>
            <DataGrid
              style={{ height: 400, width: '100%' }}
              rows={tasks}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
