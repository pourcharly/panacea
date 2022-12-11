import { Card, CardContent, Divider, Grid, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import { ChangeEvent, useCallback, useState } from 'react';
import { useApp } from '../contexts';
import { AppAction } from '../enums';

export default function AuthWallet() {
    const { dispatch } = useApp();
    const [password, setPassword] = useState('');
    const [hasFailed, setHasFailed] = useState(false);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value.trim());
        setHasFailed(false);
    }, []);

    const login = useCallback(() => {
        if (dispatch) {
            try {
                dispatch({ type: AppAction.OpenWallet, data: { password } });
            } catch (e) {
                setHasFailed(true);
            }
        }
    }, [dispatch, password]);

    return (<Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '80vh' }}
      >
        <Grid item>
            <Card sx={{ width: 400 }}>
                <CardContent>
                    <Box sx={{ pt: 1, pb: 3 }}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Grid item>
                                <EnhancedEncryptionIcon fontSize="large" color="primary" />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                                    Authentification
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ mt: 4, mb: 4 }}>
                        <Grid
                            container
                            spacing={2}
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Grid item sx={{ width: 1 }}>
                                <TextField type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)} label="Mot de passe" variant="outlined" sx={{ width: 1 }} />
                            </Grid>
                            <Grid item sx={{ mt: 1,  width: 1 }}>
                                <Button onClick={() => login()}
                                    disabled={password.length < 8}
                                    variant="contained"
                                    sx={{ width: 1 }}
                                >Ouvrir votre wallet Ordochain</Button>
                            </Grid>
                            { hasFailed &&
                            <Grid item >
                                <Typography variant="body1" component="span" color="error">
                                    Le mot de passe est érroné
                                </Typography>
                            </Grid>
                            }
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>);
}