import {Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {TermsAndConditionsComponent} from "./pages/terms-and-conditions/terms-and-conditions.component";

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }, {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(x => x.AdminLayoutModule)
            }]
    },

    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'terms', component: TermsAndConditionsComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
]
