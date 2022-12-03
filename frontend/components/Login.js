import {
  CardContent,
  TextField,
  CardActions,
  Button,
  Card,
  Grid,
  Alert,
} from '@mui/material';
import Router from 'next/router';
import { useContext, useState } from 'react';
import { Context } from '../libs/context';
import { initSocket } from '../libs/socket';

export default function Login() {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [context, setContext] = useContext(Context);
  const loginAndRedirect = async () => {
    try {
      const options = {
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      };
      const response = await fetch('/api/login', options);
      const data = await response.json();
      if (data.status === 'ok') {
        setContext({ data, username });
        initSocket('/');
        Router.push('/lists');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      console.log(err);
      setAlert(err.message);
    }
  };
  return (
    <Grid container justifyContent="center">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1>TP IASC G2</h1>
            </Grid>
            {alert && (
              <Grid item xs={12}>
                <Alert
                  onClick={() => setAlert(null)}
                  variant="filled"
                  severity="error"
                >
                  {alert}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                className="input"
                value={username}
                label="username"
                fullWidth
                onChange={(e) => setusername(e.target.value)}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="input"
                value={password}
                type="password"
                label="Password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              ></TextField>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container justifyContent="center">
            <Button onClick={loginAndRedirect}>Login</Button>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
}
