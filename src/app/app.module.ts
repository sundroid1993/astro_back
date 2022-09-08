import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { ColorPipe } from './pages/color.pipe';
import { PopUsersComponent } from './pop-users/pop-users.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetComponent } from './modals/password-reset/password-reset.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ConductedchatscallsComponent } from './pages/conductedchatscalls/conductedchatscalls.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { PopupalertComponent } from './modals/popupalert/popupalert.component';
import { AddReportComponent } from './modals/add-report/add-report.component';
import { CropImageComponent } from './pages/crop-image/crop-image.component';
import {ImageCropperModule} from "ngx-image-cropper";

@NgModule({
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AlertsComponent,
        ColorPipe,
        PopUsersComponent,
        LoginComponent,
        RegisterComponent,
        PasswordResetComponent,
        ProfileComponent,
        ConductedchatscallsComponent,
        ReportsComponent,
        PopupalertComponent,
        AddReportComponent,
        CropImageComponent

    ],
    imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes),
        SidebarModule,
        NavbarModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        FooterModule,
        FixedPluginModule,
        NgbModule,
        FormsModule,
        GooglePlaceModule,
        NgMultiSelectDropDownModule,
        ImageCropperModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
