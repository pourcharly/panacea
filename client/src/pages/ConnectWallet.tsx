import { Card, CardContent, Divider, Grid, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import WalletIcon from '@mui/icons-material/Wallet';

export default function ConnectWallet() {


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
                                <WalletIcon fontSize="large" color="primary" />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                                    Connecter un wallet externe
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
                            <Grid item>
                                <Button variant="contained" sx={{ width: 1 }}>Se connecter avec MetaMask</Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ mt: 4, mb: 1 }}>
                        <Typography variant="body2" component="p" sx={{ flexGrow: 1 }}>
                            ou <a href="/wallet/new">Créer un wallet Ordochain</a>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>);
}