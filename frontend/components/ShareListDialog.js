import { useState } from 'react';
import * as React from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
} from '@mui/material';

const ShareListDialog = (props) => {
  const { openDialog, onClose, listName } = props;
  const [user, setUser] = useState('');
  const [shareOptions, setShareOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setShareOptions(JSON.parse(data));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const shareWith = () => {
    fetch(`http://localhost:3000/api/list/${listName}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user,
      }),
    })
      .then(onClose)
      .catch(setError)
      .finally(() => setLoading(false));
  };
  return (
    <Dialog open={openDialog}>
      <DialogTitle>Share list</DialogTitle>
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
              <Select
                style={{ width: '100%' }}
                value={user}
                onChange={(data) => setUser(data.target.value)}
                label="User"
              >
                {shareOptions.map(({ username }) => (
                  <MenuItem value={username}>{username}</MenuItem>
                ))}
              </Select>
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
        <Button variant="outlined" disabled={loading} onClick={shareWith}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareListDialog;
