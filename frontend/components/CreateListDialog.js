import { useState } from 'react';
import * as React from 'react';
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

const CreateListDialog = (props) => {
  const { openDialog, onClose } = props;
  const [newListName, setNewListName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const saveNewList = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newListName }),
    };
    fetch('/api/list', options)
      .then(() => {
        setNewListName('');
        onClose();
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };
  return (
    <Dialog open={openDialog}>
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
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button variant="outlined" disabled={loading} onClick={saveNewList}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateListDialog;
