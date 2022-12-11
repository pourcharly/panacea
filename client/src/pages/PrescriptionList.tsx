import { Backdrop, Button, Card, CardContent, Divider, Grid, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import * as dayjs from 'dayjs';
import { theme } from "../theme";
import QrCodeIcon from '@mui/icons-material/QrCode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TopicIcon from '@mui/icons-material/Topic';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Container } from "@mui/system";
import { QRCode } from "react-qrcode-logo";
import { useState } from "react";
import { navigateTo } from "../routing";
import { Role } from "../enums";
import { useApp } from "../contexts";

export default function PrescriptionList() {
    const { state: { role } } = useApp();
    const [showQrCode, setShowQrCode] = useState(false);

    const prescriptions: any[] = [
        { date: new Date(), prescriptor: 'Dr. Who', status: 'Cloturée' },
        { date: new Date(), prescriptor: 'Dr. House', status: 'Délivré' },
        { date: new Date(), prescriptor: 'Dr. Doctor', status: 'Archivée' },
    ];

    return (<>
        { role === Role.doctor &&
        <div className="flex-row-right">
            <Button onClick={(e) => navigateTo('./prescriptions/new')} variant="contained" startIcon={<NoteAddIcon/>}>
                Nouvelle prescription
            </Button>
        </div>
        }
        
        <Card sx={{ width: 1, mt: '10px', pb: 8 }}>
            <CardContent sx={{ pt: 4, paddingX: 6 }}>
                <Grid container spacing={2} direction="row" alignItems="center" justifyContent="center" sx={{ mb:3 }}>
                    <Grid item>
                        <TopicIcon fontSize="large" color="primary" />
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                            Mes Ordonnances
                        </Typography>
                    </Grid>
                </Grid>

                <Divider/>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 150, borderRight: `1px solid ${theme.palette.divider}`, color: theme.palette.secondary.dark }} align="left">
                                    Date
                                </TableCell>
                                <TableCell align="left" sx={{ color: theme.palette.secondary.dark }}>
                                    Médecin
                                </TableCell>
                                <TableCell sx={{ width: 150, borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.secondary.dark }} align="right">
                                    État
                                </TableCell>
                                <TableCell sx={{ width: 200, borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.secondary.dark }} align="center">

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { prescriptions.map((prescription, i) => (
                            <TableRow
                            key={ i }
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, "&:hover": { backgroundColor: theme.palette.secondary.light } }}
                            >
                                <TableCell component="th" scope="row">
                                    { dayjs.unix(prescription.date.getTime() / 1000).format('DD/MM/YYYY')  }
                                </TableCell>
                                <TableCell align="left">{ prescription.prescriptor }</TableCell>
                                <TableCell align="right" sx={{ textTransform: 'uppercase' }}>
                                    { prescription.status }
                                </TableCell>
                                <TableCell align="right">
                                    <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
                                        <Grid item>
                                            <IconButton onClick={(e) => navigateTo('/prescriptions/' + i)} aria-label="Voir l'ordonnance" title="Voir l'ordonnance" sx={{ backgroundColor: theme.palette.secondary.main, "&:hover": { backgroundColor: theme.palette.secondary.dark } }}>
                                                <VisibilityIcon sx={{ color: theme.palette.secondary.light }} />
                                            </IconButton>
                                        </Grid>
                                        { role === Role.patient &&
                                        <Grid item>
                                            <IconButton
                                                onClick={() => setShowQrCode(true)}
                                                aria-label="Ouvrir le QRCode" title="Ouvrir le QRCode"
                                                sx={{ backgroundColor: theme.palette.secondary.main, "&:hover": { backgroundColor: theme.palette.secondary.dark } }}
                                            >
                                                <QrCodeIcon sx={{ color: theme.palette.secondary.light }} />
                                            </IconButton>
                                        </Grid>
                                        }
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        )) }
                        </TableBody>
                    </Table>
                </TableContainer>

                { !!prescriptions.length ? <></> :
                <Container sx={{ width: 1, margin: 0, borderBottom: `1px solid ${theme.palette.divider}`, paddingY: '200px' }}>
                    <Typography variant="body1" component="p" color="divider" sx={{ flexGrow: 1, mb:3, }}>
                        - Le wallet est vide -
                    </Typography>
                </Container>
                }   

            </CardContent>
        </Card>

        <Backdrop open={showQrCode} onClick={() => setShowQrCode(false)}>
            <div className="flex-center">
                <QRCode value="http:/www.google.com/fr" size={300}/>
            </div>
        </Backdrop>
    </>)
}