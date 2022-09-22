import { Routes } from '@angular/router';

import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { AlertsComponent } from 'app/pages/alerts/alerts.component';
import { PopUsersComponent } from '../../pop-users/pop-users.component';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';
import { ConductedchatscallsComponent } from 'app/pages/conductedchatscalls/conductedchatscalls.component';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { ReportsComponent } from 'app/pages/reports/reports.component';
import {ChatListComponent} from "../../pages/chat-list/chat-list.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'alerts', component: AlertsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'Reports', component: ReportsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'popup-users', component: PopUsersComponent },
    { path: 'conductedchatcalls', component: ConductedchatscallsComponent },
    { path: 'chat-list', component: ChatListComponent },
];
