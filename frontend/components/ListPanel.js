import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import * as React from 'react';
import Router from 'next/router';
import io from 'socket.io-client';
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import moment from 'moment';

const columns = [
  { field: 'name', width: 300, headerName: 'List name' },
  { field: 'taskCount', width: 280, headerName: 'Tasks' },
  { field: 'creationDate', width: 300, headerName: 'Creation Date' },
  {
    field: 'action',
    headerName: 'Options',
    sortable: false,
    width: 300,
    renderCell: (params) => {
      const deleteList = (e) => {
        e.stopPropagation();
        const options = {
          method: 'DELETE',
        };
        fetch('http://localhost:3000/api/list/' + params.row.name, options);
      };
      const seeListDetails = (e) => {
        e.stopPropagation();
        return Router.push('/lists/' + params.row.name);
      };

      return (
        <div>
          <Button onClick={seeListDetails}>See more</Button>
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
    taskCount: '2',
    creationDate: moment().format('DD/MM/YYYY'),
  },
  {
    id: 2,
    name: 'test2',
    taskCount: '2',
    creationDate: moment().format('DD/MM/YYYY'),
  },
];
export default function ListPanel() {
  const [lists, setList] = useState(rows);
  const [pageSize, setPageSize] = useState(5);
  const [newListName, setNewListName] = useState('');
  const [openCreationDialog, setOpenCreationDialog] = useState(false);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  //useEffect para sacar las listas de un websocket
  React.useEffect(() => {
    const webSocket = io.connect('http://localhost:8080', {
      withCredentials: true,
      extraHeaders: {
        'my-custom-header': 'abcd',
      },
    });
    webSocket.on('get-lists', (payload) => setList(JSON.parse(payload)));
    setSocket(webSocket);
    setLoading(true);
    fetch('http://localhost:3000/api/list')
      .then((res) => res.json())
      .then((data) =>
        setList(
          data.map((list, index) => ({
            ...list,
            creationDate: moment(list.creationDate).format('DD/MM/YYYY'),
            taskCount: list.items.length,
            id: index,
          }))
        )
      )
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);
  const saveNewList = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newListName }),
    };
    fetch('http://localhost:3000/api/list', options)
      .then(() => {
        setOpenCreationDialog(false);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  };
  return (
    <Grid container justifyContent="center">
      <Grid item xs={8}>
        <Card>
          <h1>Todo Lists</h1>
          <CardContent>
            <DataGrid
              style={{ height: 400, width: '100%' }}
              rows={lists}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </CardContent>
          <CardActions>
            <Button onClick={() => setOpenCreationDialog(!openCreationDialog)}>
              Create new list
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Dialog open={openCreationDialog}>
        <DialogTitle>Create new list</DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center">
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid item xs={8}>
                <TextField
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  label="List Name"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => setOpenCreationDialog(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" disabled={loading} onClick={saveNewList}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
