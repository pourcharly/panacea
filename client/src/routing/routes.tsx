import { Role } from "../enums";
import { NewWallet, ConnectWallet, AuthWallet, RecoverWallet, PrescriptionForm, PrescriptionList, PrescriptionView } from "../pages";
import { accountExists } from "../utils/wallet";

const routes = [
    {
        path: '',
        redirectTo: 'wallet/auth'
    },
    {
        path: 'auth',
        redirectTo: 'wallet/auth',
    },
    {
        path: 'wallet',
        redirectTo: 'wallet/new',
        canActivate: ({ state }: any) => {
            return !state.account || 'prescriptions';
        },
        children: [
            {
                path: 'auth',
                component: AuthWallet,
                canActivate: ({ state }: any) => {
                    return accountExists() || 'wallet/new';
                },
            },
            {
                path: 'new',
                component: NewWallet,
                canActivate: ({ state }: any) => {
                    return !accountExists() || 'wallet/auth';
                },
            },
            {
                path: 'connect',
                component: ConnectWallet
            },
            {
                path: 'recover',
                component: RecoverWallet
            },
        ]
    },
    {
        path: 'prescriptions',
        canActivate: ({ state }: any) => {
            return !!state.account || 'wallet/auth';
        },
        children: [
            {
                path: '',
                component: PrescriptionList
            },
            {
                path: 'new',
                component: PrescriptionForm,
                canActivate: ({ state }: any) => {
                    return (!!state.account && state.role === Role.doctor) || 'wallet/auth';
                },
            },
            {
                path: ':id',
                component: PrescriptionView,
                canActivate: ({ state }: any) => {
                    return !!state.account || 'wallet/auth';
                },
            },
        ]
    },
];

export default routes;