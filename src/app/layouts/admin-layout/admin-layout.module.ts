import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AdminLayoutRoutes} from './admin-layout.routing';

import {DashboardComponent} from '../../pages/dashboard/dashboard.component';
import {NotificationsComponent} from '../../pages/notifications/notifications.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        NgbModule,
        GooglePlaceModule,
        NgMultiSelectDropDownModule,
    ],
    declarations: [
        DashboardComponent,
        NotificationsComponent,
    ]
})

export class AdminLayoutModule {
}
