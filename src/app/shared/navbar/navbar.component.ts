import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UtilService } from '../../service/util.service';
import { EmitEvent, Events, EventService } from "../../service/event.service";

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    location: Location;
    public isCollapsed = true;
    @ViewChild('navbar-cmp', { static: false }) button;
    private listTitles: any[];
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    constructor(
        location: Location,
        private renderer: Renderer2,
        private element: ElementRef,
        private router: Router,
        public utilService: UtilService,
        private eventService: EventService
    ) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;

        // Detect current route
        router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                console.log(val.url);
                if(val.url == '/dashboard'){
                    this.showSwitch = false;
                }
                else{
                    this.showSwitch = true;
                }
            }
        });
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
        });
    }

    status: boolean = true;
    showSwitch: boolean = false;

    onStatusChange() {
        console.log(this.status);
        if (this.status) {
            this.utilService.setItem(this.utilService.ASTRO_STATUS, '1')
        } else {
            this.utilService.setItem(this.utilService.ASTRO_STATUS, '0')
        }
        this.eventService.emit(new EmitEvent(Events.USER_STATUS_CHANGE, ''));
    }

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        html.classList.add('nav-open');
        if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
        }
        this.sidebarVisible = true;
    };

    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
        if (window.innerWidth < 991) {
            setTimeout(function () {
                mainPanel.style.position = '';
            }, 500);
        }
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };

    collapse() {
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        console.log(navbar);
        if (!this.isCollapsed) {
            navbar.classList.remove('navbar-transparent');
            navbar.classList.add('bg-white');
        } else {
            navbar.classList.add('navbar-transparent');
            navbar.classList.remove('bg-white');
        }

    }

    logoutUser() {
        this.utilService.clearALLData();
        this.utilService.setItem(this.utilService.USER_LOGIN, '0');
        this.eventService.emit(new EmitEvent(Events.USER_LOGIN_LOGUT, ''));
        this.router.navigateByUrl('/login');
    }
}
