import { Card, CardContent, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useCallback, useState } from 'react';
import { createAccount } from '../utils/wallet';
import { useApp } from '../contexts';
import { AppAction, Role } from '../enums';

const roleMapping = {
    [Role.patient] : 'Patient',
    [Role.pharmacist] : 'Pharmacien',
    [Role.doctor] : 'Docteur',
}

export default function NewWallet() {
    const { state, dispatch } = useApp();
    const web3 = state?.web3;
    const [role, setRole] = useState<Role>(Role.patient);
    const [form, setForm] = useState({
        name: '',
        secuNum: '',
        password: '',
        passwordConfirm: ''
    });

    const isPatient = useCallback(() => {
        return role === Role.patient;
    }, [role]);

    const isPharmacist = useCallback(() => {
        return role === Role.pharmacist;
    }, [role]);

    const isDoctor = useCallback(() => {
        return role === Role.doctor;
    }, [role]);

    const isValidName = useCallback(() => {
        return form.name.length >= 2;
    }, [form.name]);

    const isValidSecuNum = useCallback(() => {
        return /^\d{13}$/.test(form.secuNum);
    }, [form.secuNum]);

    const isValidPassword = useCallback(() => {
        return form.password.length >= 8;
    }, [form.password]);

    const isValidPasswordConfirm = useCallback(() => {
        return form.password === form.passwordConfirm;
    }, [form.password, form.passwordConfirm]);

    const isValidForm = useCallback(() => {
        return isValidName() && isValidSecuNum() && isValidPassword() && isValidPasswordConfirm();
    }, [isValidName, isValidSecuNum, isValidPassword, isValidPasswordConfirm]);

    const createWallet = useCallback(() => {
        const { name, secuNum, password } = form;

        if (web3 && dispatch && isValidForm()) {
            dispatch({ type: AppAction.CreateWallet, data: { role, name, secuNum, password } });
        }
    }, [web3, dispatch, form, role, isValidForm])

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
                                <CreateNewFolderIcon fontSize="large" color="primary" />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                                    Nouveau Wallet Ordochain
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
                                <FormControl fullWidth>
                                    <InputLabel id="role-selector">Type de wallet</InputLabel>
                                    <Select
                                        labelId="role-selector"
                                        id="demo-simple-select"
                                        value={role}
                                        label="Type de wallet"
                                        onChange={(e) => setRole(e?.target?.value as Role)}
                                    >
                                        <MenuItem value={ Role.patient }>{ roleMapping[Role.patient] }</MenuItem>
                                        <MenuItem value={ Role.pharmacist }>{ roleMapping[Role.pharmacist] }</MenuItem>
                                        <MenuItem value={ Role.doctor }>{ roleMapping[Role.doctor] }</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            { (isPatient() ||isDoctor()) &&
                            <Grid item sx={{ width: 1 }}>
                                <TextField type="text"
                                    onChange={(e) => setForm({ ...form, name: e.target.value.trim() })}
                                    error={!!form.name.length && !isValidName()}
                                    label="Nom complet"
                                    variant="outlined"
                                    sx={{ width: 1 }}
                                />
                            </Grid>
                            }
                            { isPatient() &&
                            <Grid item sx={{ width: 1 }}>
                                <TextField type="number"
                                    onChange={(e) => setForm({ ...form, secuNum: e.target.value.trim() })}
                                    error={!!form.secuNum.length && !isValidSecuNum()}
                                    label="numero de sécurité sociale"
                                    variant="outlined"
                                    sx={{ width: 1 }}
                                />
                            </Grid>
                            }
                            { isPharmacist() &&
                            <Grid item sx={{ width: 1 }}>
                                <TextField type="text"
                                    onChange={(e) => setForm({ ...form, name: e.target.value.trim() })}
                                    error={!!form.name.length && !isValidName()}
                                    label="Raison sociale"
                                    variant="outlined"
                                    sx={{ width: 1 }}
                                />
                            </Grid>
                            }
                            <Grid item sx={{ width: 1 }}>
                                <TextField type="password"
                                    onChange={(e) => setForm({ ...form, password: e.target.value.trim() })}
                                    error={!!form.password.length && !isValidPassword()}
                                    label="Mot de passe"
                                    variant="outlined"
                                    sx={{ width: 1 }}
                                />
                            </Grid>
                            <Grid item sx={{ width: 1 }}>
                                <TextField type="password"
                                    onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value.trim() })}
                                    error={!!form.passwordConfirm.length && !isValidPasswordConfirm()}
                                    label="Confirmer le mot de passe"
                                    variant="outlined"
                                    sx={{ width: 1 }}
                                />
                            </Grid>
                            <Grid item sx={{ mt: 1,  width: 1 }}>
                                <Button onClick={(e) => createWallet()} disabled={!isValidForm()} variant="contained" sx={{ width: 1 }}>Créer votre wallet</Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ mt: 4, mb: 1 }}>
                        <Typography variant="body2" component="p" sx={{ flexGrow: 1 }}>
                            ou <a href="/wallet/connect">Connecter un wallet externe</a>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>);
}