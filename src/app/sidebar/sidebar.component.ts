import { Component, OnInit } from '@angular/core';
import { UtilService } from '../service/util.service';
import { Router } from '@angular/router';


export interface RouteInfo {
    path?: string;
    title: string;
    icon: string;
    class: string;
}

export const ADMIN_ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },
    { path: '/notifications', title: 'Notifications', icon: 'file', class: '' },
    { path: '/alerts', title: 'Alerts', icon: 'file', class: '' },
    { path: '/profile', title: 'Profile', icon: 'file', class: '' },
    { path: '/Reports', title: 'Reports', icon: 'file', class: '' },
    { path: '/conductedchatcalls', title: 'Calls/Chats History', icon: 'file', class: '' },
];

export let ROUTES: RouteInfo[] = [];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    constructor(public utilService: UtilService, private router: Router) {
    }

    ngOnInit() {
        this.menuItems = ADMIN_ROUTES.filter(menuItem => menuItem);
        ROUTES = ADMIN_ROUTES;
    }
}
