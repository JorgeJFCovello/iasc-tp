import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import * as React from 'react';
import Router from 'next/router';
import io from 'socket.io-client';
import { Button, Card, CardActions, CardContent, Grid } from '@mui/material';
import moment from 'moment';
import CreateListDialog from './CreateListDialog';
import ShareListDialog from './ShareListDialog';
import { socketCache } from '../libs/socket';
import { env } from '../next.config';
import { LoginOutlined } from '@mui/icons-material';

export default function ListPanel(props) {
  const [lists, setList] = useState([]);
  const { username } = props;
  const [pageSize, setPageSize] = useState(5);
  const [openCreationDialog, setOpenCreationDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [list2Share, setList2Share] = useState('');

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
          fetch(`/api/list/${params.row._id}`, options);
        };
        const seeListDetails = (e) => {
          e.stopPropagation();
          return Router.push('/lists/' + params.row._id);
        };
        const openShareOptions = (e) => {
          e.stopPropagation();
          setList2Share(params.row._id);
          setOpenShareDialog(true);
        };
        return (
          <div>
            <Button onClick={openShareOptions}>Share</Button>
            <Button onClick={seeListDetails}>See more</Button>
            <Button onClick={deleteList}>Delete</Button>
          </div>
        );
      },
    },
  ];

  React.useEffect(() => {
    const webSocket = socketCache.backendConnection;
    webSocket.on(`get-lists-${username}`, (payload) => {
      const newLists = payload.map((list, index) => ({
        ...list,
        creationDate: moment(list.creationDate).format('DD/MM/YYYY'),
        taskCount: list.items.length,
        _id: list.id,
        id: index,
      }));
      console.log('llegaron cosas');
      setList(newLists);
    });
    setSocket(webSocket);
    setLoading(true);
    fetch(`/api/list`)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={8}>
        <Card>
          <Grid container justifyContent="space-between">
            <h2 style={{ margin: '10px' }}>Todo Lists</h2>
            <Button
              style={{ margin: '10px' }}
              variant="outlined"
              onClick={() => {
                fetch(`/api/logout`).finally(() => {
                  Router.push('/');
                });
              }}
              startIcon={<LoginOutlined />}
            >
              logout
            </Button>
          </Grid>
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
      {
        <CreateListDialog
          openDialog={openCreationDialog}
          onClose={() => setOpenCreationDialog(false)}
        />
      }
      {
        <ShareListDialog
          listName={list2Share}
          openDialog={openShareDialog}
          onClose={() => setOpenShareDialog(false)}
        />
      }
    </Grid>
  );
}
