import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useApp } from "../contexts"
import { Role } from "../enums";
import { theme } from "../theme";
import { registerAsPatientSoket, registerAsProfessionalSocket } from "../utils/socket";


export default function UserStatus() {
    const { state: { profile, account, role } } = useApp();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        (async () => {
            let bool = false;

            if (role === Role.patient && profile?.secuNum ) {
                bool = await registerAsPatientSoket(profile.secuNum);
            } else if (role !== Role.patient && account?.address) {
                bool = await registerAsProfessionalSocket(account.address);
            }
            setIsConnected(bool);
        })();
    }, [role, profile?.secuNum, account?.address]);

    return (<>
        { !!profile && !!account && (<div className="flex-col-right">

            <p className="noMargin">

                <Typography
                    fontSize={11}
                    textTransform="uppercase"
                    component="span"
                    color={ (theme) => isConnected ? theme.palette.primary.light : theme.palette.error.dark}
                    style={{ opacity: (isConnected ? '.4' : '.8') }}
                >
                    {` [ ${isConnected ? 'connecté' : 'hors ligne'} ] `}
                </Typography>

                <Typography variant="body1" component="span" sx={{ color: theme.palette.secondary.light, textTransform: 'capitalize' }}>
                    { role === Role.doctor && 'Dr. ' }
                    { role === Role.pharmacist && 'Pharmacie ' }
                    { profile?.name }
                </Typography>
            </p>

            <Typography fontSize={11} sx={{ color: theme.palette.primary.dark }}>
                (adresse : { account?.address })
            </Typography>
        </div>)}
    </>)
}