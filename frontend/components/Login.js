import {  CardContent, TextField, CardActions, Button, Card, Grid } from '@mui/material'
import { useState } from 'react'

export default function Login() {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    return (
        <Grid container justifyContent='center'>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <h1>
                            Login
                        </h1>
                        <Grid item xs={12}>
                            <TextField className='input' value={userName} label='Username' fullWidth onChange={(e) => setUserName(e.target.value)}></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField className='input' value={password} type='password' label='Password' fullWidth onChange={(e) => setPassword(e.target.value)}></TextField>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container justifyContent='center'>
                        <Button onClick={() => console.log('login')}>Login</Button>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    )
}
