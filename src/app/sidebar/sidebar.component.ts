import {Component, OnInit} from '@angular/core';
import {UtilService} from '../service/util.service';
import {Router} from '@angular/router';
import {Events, EventService} from "../service/event.service";


export interface RouteInfo {
    path?: string;
    title: string;
    icon: string;
    class: string;
}

export const ADMIN_ROUTES: RouteInfo[] = [
    {path: '/dashboard', title: 'Dashboard', icon: 'nc-bullet-list-67', class: ''},
    {path: '/profile', title: 'Profile', icon: 'nc-bullet-list-67', class: ''},
    {path: '/notifications', title: 'Profile Updates', icon: 'nc-bullet-list-67', class: ''},
    {path: '/alerts', title: 'Alerts', icon: 'nc-bullet-list-67', class: ''},
    {path: '/Reports', title: 'Reports', icon: 'nc-bullet-list-67', class: ''},
    {path: '/history', title: 'Calls/Chats History', icon: 'nc-bullet-list-67', class: ''},
    // { path: '/chat-list', title: 'Chats', icon: 'nc-bullet-list-67', class: '' },
];

export let ROUTES: RouteInfo[] = [];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    astro_name='';
    unique_id='';

    constructor(public utilService: UtilService, private router: Router,private eventService:EventService) {
    }

    ngOnInit() {
        this.menuItems = ADMIN_ROUTES.filter(menuItem => menuItem);
        ROUTES = ADMIN_ROUTES;

        // console.log(this.utilService.getUserProfile())
        if (this.utilService.isUserLoggedIn()) {
            this.astro_name=this.utilService.getUserProfile().name;
            this.unique_id=this.utilService.getUserProfile().unique_id;
        } else {
            this.astro_name='';
            this.unique_id='';
        }

        console.log("astro_name:-"+this.astro_name)
        console.log("unique_id:-"+this.unique_id)

        this.eventService.on(Events.USER_LOGIN_LOGUT, (data => {
            if (this.utilService.isUserLoggedIn()) {
                this.astro_name=this.utilService.getUserProfile().name;
                this.astro_name=this.utilService.getUserProfile().unique_id;
            } else {
                this.astro_name='';
                this.unique_id='';
            }
        }));
    }
}
