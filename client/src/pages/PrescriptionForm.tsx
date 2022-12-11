import { Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { SendToMobile } from "@mui/icons-material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { navigateTo } from "../routing";
import { filterFiles, getFilesFromEvent } from "../utils/files";
import { isPatientSocketConnected, socket } from "../utils/socket";


export default function PrescriptionForm() {
    const [file, setFile] = useState<(File | null)>(null);
    const [fileType, setFileType] = useState<string>('');
    const [dataUrl, setDataUrl] = useState<string | ArrayBuffer | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [secuNum, setSecuNum] = useState('');
    const [isPatientConnected, setIsPatientConnected] = useState<boolean | null>(null);
    const secuField = useRef(null);


    const onDragFile = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragEndFile = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDropFile = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = getFilesFromEvent(e);

        if (files.length) {
            setFile(files[0]);
        }
        setIsDragging(false);
    }, []);

    const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const files = filterFiles(Array.from((e.target as HTMLInputElement).files || []));
        
        if (files.length) {
            setFile(files[0]);
        }
    }, []);

    const isValidSecuNum = useCallback(() => {
        return /^\d{13}$/.test(secuNum);
    }, [secuNum]);

    // Determine file type
    useEffect(() => {
        let type = '';
        if (file) {
            switch (file.type) {
                case 'application/pdf':
                    type = 'pdf';
                    break;
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                    type = 'img';
                    break;
                default:
                    type = 'unknown';
            }
        }
        setFileType(type);
    },  [file])

    // Convert file to Data URL
    useEffect(() => {
        if (file) {
            const fileReader = new FileReader();
            fileReader.addEventListener("load", () => setDataUrl(fileReader.result), false);
            fileReader.readAsDataURL(file);
        }
    }, [file]);

    // Verify is patient is currently connected
    useEffect(() => {
        if (isValidSecuNum()) {
            (async () => {
                const _isPatientConnected: boolean = await isPatientSocketConnected(secuNum);
                setIsPatientConnected(_isPatientConnected);
            })();
        } else {
            setIsPatientConnected(null);
        }
    }, [secuNum, isValidSecuNum]);

    // Watch for patient connection
    useEffect(() => {
        if (!isPatientConnected) {
            const connectionMessageType = `patientConnect_${secuNum}`;
    
            socket.on(connectionMessageType, () => {
                setIsPatientConnected(true);
            });
    
            return () => void socket.off(connectionMessageType);
        } else {
            const disconnectionMessageType = `clientDisconnect_${secuNum}`;
    
            socket.on(disconnectionMessageType, () => {
                setIsPatientConnected(false);
            });

            return () => void socket.off(disconnectionMessageType);
        }
    }, [isPatientConnected, secuNum]);

    return (<>
        <Card sx={{ width: 1, mt: '10px', pb: 8 }}
            onDragOver={(e) => onDragFile(e)} onDragStart={(e) => onDragFile(e)} onDragEnter={(e) => onDragFile(e)}
            onDragEnd={(e) => onDragEndFile(e)} onDragLeave={(e) => onDragEndFile(e)} onDragExit={(e) => onDragEndFile(e)}
        >
            <CardContent sx={{ pt: 4, paddingX: 6 }}>

                <Grid container spacing={2} direction="row" alignItems="center" justifyContent="center" sx={{ mb:3 }}>
                    <Grid item>
                        <NoteAddIcon fontSize="large" color="primary" />
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                            Nouvelle prescription
                        </Typography>
                    </Grid>
                </Grid>

                <div style={{ maxWidth: '100%' }}>
                    <div className="flex-row-between" style={{ marginBottom: '10px' }}>
                        <TextField variant="outlined"
                            ref={secuField}
                            error={!!secuNum.length && !isValidSecuNum() && (document.activeElement !== secuField.current)}
                            label="Numéro de sécurité social du patient"
                            type="number"
                            style={{ width: '100%', maxWidth: '400px' }}
                            onChange={(e) => setSecuNum(e.target.value)}
                        />
                        
                        { file ?
                            <Button onClick={() => setFile(null)} variant="text">
                                Supprimer le fichier
                            </Button> :
                            
                            <TextField variant="outlined"
                                type="file"
                                style={{ width: '100%', maxWidth: '400px', marginLeft: '20px' }}
                                onChange={(e) => onFileInputChange(e) }
                            />
                        }
                    </div>

                    { isPatientConnected === true &&
                    <div className="flex-row-left" style={{ margin: 'auto', marginTop: '20px' }}>
                        <Typography variant="body2" color="valid" align="left">
                            - Patient connecté -
                        </Typography>
                    </div>
                    }

                    { isPatientConnected === false &&
                    <div className="flex-row-left" style={{ margin: 'auto', marginTop: '20px' }}>
                        <Typography variant="body2" color="error" align="left">
                            - Patient déconnecté -
                        </Typography>
                    </div>
                    }

                    <div
                        style={{ minHeight: '400px', border: '1px solid #ccc', margin: 'auto', backgroundColor: '#eee', position: 'relative' }}
                        onDragOver={(e) => onDragFile(e)} onDragStart={(e) => onDragFile(e)} onDragEnter={(e) => onDragFile(e)}
                        onDragEnd={(e) => onDragEndFile(e)} onDragLeave={(e) => onDragEndFile(e)} onDragExit={(e) => onDragEndFile(e)}
                        onDrop={(e) => onDropFile(e)}
                    >
                        { dataUrl && fileType === 'img' &&
                            <img src={dataUrl.toString()} style={{ maxWidth: '100%' }} alt="Ordonnance" />
                        }
                        { dataUrl && fileType === 'pdf' &&
                            <iframe src={dataUrl.toString()} style={{ maxWidth: '100%', width: '100%', minHeight: '600px' }} title="Ordonnance" />
                        }
                    
                        { isDragging && <div className="dragMessage"></div> }
                    </div>

                    <div className="flex-row-between" style={{ margin: 'auto', marginTop: '20px' }}>
                        <Button onClick={(e) => navigateTo('/prescriptions')} variant="contained" color="error">
                            Annuler
                        </Button>

                        <Button onClick={(e) => navigateTo('/prescriptions')} variant="contained" startIcon={<SendToMobile/>} disabled={!file || !isValidSecuNum() || !isPatientConnected}>
                            Sauvergader et envoyer au patient
                        </Button>
                    </div>
                    { isPatientConnected === false &&
                    <div className="flex-row-right" style={{ margin: 'auto', marginTop: '20px' }}>
                        <Typography variant="body2" color="error" align="right">
                            Le patient ne semble pas connecté.<br/>
                            Demndez lui d'ouvrir son application Ordochain<br/>
                            ou vérifiez son numéro de sécurité social.
                        </Typography>
                    </div>
                    }
                </div>

            </CardContent>
        </Card>
    </>)
}