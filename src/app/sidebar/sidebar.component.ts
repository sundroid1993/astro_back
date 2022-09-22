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
    { path: '/dashboard', title: 'Dashboard', icon: 'nc-bullet-list-67', class: '' },
    { path: '/profile', title: 'Profile', icon: 'nc-bullet-list-67', class: '' },
    { path: '/notifications', title: 'Profile Updates', icon: 'nc-bullet-list-67', class: '' },
    { path: '/alerts', title: 'Alerts', icon: 'nc-bullet-list-67', class: '' },
    { path: '/Reports', title: 'Reports', icon: 'nc-bullet-list-67', class: '' },
    { path: '/conductedchatcalls', title: 'Calls/Chats History', icon: 'nc-bullet-list-67', class: '' },
    { path: '/chat-list', title: 'Chats', icon: 'nc-bullet-list-67', class: '' },
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
