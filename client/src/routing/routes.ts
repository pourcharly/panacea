import { CreateWallet, Login, PrescriptionForm, PrescriptionList, PrescriptionView } from "../pages";

const routes = [
    {
        path: '',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: Login,
        canActivate: (appContext: any) => {
            return 'prescriptions';
        }
    },
    {
        path: 'wallet/create',
        component: CreateWallet
    },
    {
        path: 'prescriptions',
        children: [
            {
                path: '',
                component: PrescriptionList
            },
            {
                path: 'new',
                component: PrescriptionForm
            },
            {
                path: ':id',
                component: PrescriptionView
            },
        ]
    },
    {
        path: 'test/:id/:name/q/:age',
        component: PrescriptionView
    },
];

export default routes;