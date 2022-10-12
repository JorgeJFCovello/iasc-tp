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
import { Context } from '../libs/context';

export default function ListPanel(props) {
  const { listId } = props;
  console.log('id:?', listId);
  const [tasks, setTasks] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [openCreationDialog, setOpenCreationDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [title, setTitle] = useState('');
  const getlistData = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/list/' + listId)
      .then((data) => data.json())
      .then((data) => {
        setTitle(data.name);
        setTasks(
          data.items.map((item) => ({
            ...item,
            _id: item.id,
            creationDate: moment(item.creationDate).format('DD/MM/YYYY'),
            id: item.index,
          }))
        );
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };
  React.useEffect(() => {
    const webSocket = io.connect('http://localhost:8080', {
      withCredentials: true,
    });
    webSocket.on(`get-lists-${listId}`, (payload) => {
      console.log(payload);
      const newTasks = payload.items.map((item, index) => ({
        ...item,
        _id: item.id,
        creationDate: moment(item.creationDate).format('DD/MM/YYYY'),
        id: index,
      }));
      setTasks(newTasks);
    });
    setSocket(webSocket);
    getlistData();
  }, []);
  React.useEffect(getlistData, [listId]);

  const onCellEditCommit = (params) => {
    console.log('params: ', params);
    const json =
      params.field === 'index'
        ? { order: Number(params.value) }
        : { name: params.value };
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    };
    fetch(
      `http://localhost:3000/api/list/${listId}/task/${
        tasks.find((task) => task.id === params.id).name
      }`,
      options
    );
  };
  const columns = [
    {
      field: 'index',
      width: 70,
      sortable: true,
      headerName: '',
      editable: true,
    },
    {
      field: 'name',
      sortable: false,
      width: 300,
      headerName: 'Task name',
      editable: true,
    },
    {
      field: 'done',
      width: 280,
      headerName: 'Done',
      sortable: false,
      renderCell: (params) => {
        const changeValue = (e) => {
          e.stopPropagation();
          const options = {
            method: 'POST',
          };
          fetch(
            `http://localhost:3000/api/list/${listId}/task/${params.row.name}`,
            options
          );
        };
        return <Checkbox checked={params.row.done} onChange={changeValue} />;
      },
    },
    {
      field: 'creationDate',
      sortable: false,
      width: 300,
      headerName: 'Creation Date',
    },
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
            `http://localhost:3000/api/list/${listId}/task/${params.row.name}`,
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
    fetch(`http://localhost:3000/api/list/${listId}/task`, options)
      .then(() => setOpenCreationDialog(false))
      .catch(setError)
      .finally(() => setLoading(false));
  };
  return (
    <Grid container justifyContent="center">
      <Grid item xs={8}>
        <Card>
          <h1>{title}</h1>
          <CardContent>
            <DataGrid
              style={{ height: 400, width: '100%' }}
              rows={tasks}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50]}
              onCellEditCommit={onCellEditCommit}
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
