import { Grid, Card, CardContent, Typography, Button, Backdrop } from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { navigateTo } from "../routing";


export default function PrescriptionView({ parameters } : any) {
    const [showQrCode, setShowQrCode] = useState(false);


    return (<>
        <div className="flex-row-between">
            <Button onClick={(e) => navigateTo('/prescriptions')} variant="contained" color="primary">
                {'<'} Retour à la liste
            </Button>
            <Button startIcon={<QrCodeIcon/>} variant="contained" color="info" onClick={() => setShowQrCode(true)}>
                Afficher le QrCode
            </Button>
        </div>

        <Card sx={{ width: 1, mt: '10px', pb: 8 }}>
            <CardContent sx={{ pt: 4, paddingX: 6 }}>
                <Grid container spacing={2} direction="row" alignItems="center" justifyContent="center" sx={{ mb:3 }}>
                    <Grid item>
                        <InsertDriveFileIcon fontSize="large" color="primary" />
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                            Ordonnance par le <strong>Dr Who</strong> du <strong>11/04/1981</strong>
                        </Typography>
                    </Grid>
                </Grid>

                <div style={{ maxWidth: '100%' }}>
                    <div style={{ minHeight: '400px', border: '1px solid #ccc', margin: 'auto', backgroundColor: '#eee', position: 'relative' }}>
                        
                    </div>
                </div>

            </CardContent>
        </Card>

        <Backdrop open={showQrCode} onClick={() => setShowQrCode(false)}>
            <div className="flex-center">
                <QRCode value="http:/www.google.com/fr" size={300}/>
            </div>
        </Backdrop>
    </>)
}