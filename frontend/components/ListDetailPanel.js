import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import * as React from 'react';
import Router from 'next/router';
import io from 'socket.io-client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import moment from 'moment';

export default function ListPanel(props) {
  const { listName } = props;
  const [tasks, setTasks] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [openCreationDialog, setOpenCreationDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  React.useEffect(() => {
    const webSocket = io.connect('http://localhost:8080', {
      withCredentials: true,
    });
    webSocket.on(`get-lists-${listName}`, (payload) => {
      console.log(payload);
      const newTasks = payload.items.map((item, index) => ({
        ...item,
        creationDate: moment(item.creationDate).format('DD/MM/YYYY'),
        id: index,
      }));
      setTasks(newTasks);
    });
    setSocket(webSocket);

    setLoading(true);
    fetch('http://localhost:3000/api/list/' + listName)
      .then((data) => data.json())
      .then((data) => {
        console.log('tasks: ', data);
        setTasks(
          data.items.map((item, index) => ({
            ...item,
            creationDate: moment(item.creationDate).format('DD/MM/YYYY'),
            id: index,
          }))
        );
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  const columns = [
    { field: 'name', width: 300, headerName: 'List name' },
    {
      field: 'done',
      width: 280,
      headerName: 'Done',
      renderCell: (params) => {
        const changeValue = (e) => {
          e.stopPropagation();
          const options = {
            method: 'POST',
          };
          fetch(
            `http://localhost:3000/api/list/${listName}/task/${params.row.name}`,
            options
          );
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
        const deleteTask = (e) => {
          e.stopPropagation();
          const options = {
            method: 'DELETE',
          };
          fetch(
            `http://localhost:3000/api/list/${listName}/task/${params.row.name}`,
            options
          );
        };
        return (
          <div>
            <Button onClick={deleteTask}>Delete</Button>
          </div>
        );
      },
    },
  ];
  //useEffect para sacar las listas de un websocket

  const saveNewTask = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newTaskName }),
    };
    console.log('saving: ', newTaskName);
    fetch(`http://localhost:3000/api/list/${listName}/task`, options)
      .then(() => setOpenCreationDialog(false))
      .catch(setError)
      .finally(() => setLoading(false));
  };
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
          <CardActions>
            <Button onClick={() => setOpenCreationDialog(true)}>
              Add new task
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Dialog open={openCreationDialog}>
        <DialogTitle>Create new task</DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center">
            <Grid item xs={8}>
              <TextField
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                label="task Name"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenCreationDialog(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" onClick={saveNewTask}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
