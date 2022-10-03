import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToastrModule} from 'ngx-toastr';

import {SidebarModule} from './sidebar/sidebar.module';
import {FooterModule} from './shared/footer/footer.module';
import {NavbarModule} from './shared/navbar/navbar.module';
import {FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import {AppComponent} from './app.component';
import {AppRoutes} from './app.routing';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import {AlertsComponent} from './pages/alerts/alerts.component';
import {ColorPipe} from './pages/color.pipe';
import {PopUsersComponent} from './pop-users/pop-users.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PasswordResetComponent} from './modals/password-reset/password-reset.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {ConductedchatscallsComponent} from './pages/conductedchatscalls/conductedchatscalls.component';
import {ReportsComponent} from './pages/reports/reports.component';
import {PopupalertComponent} from './modals/popupalert/popupalert.component';
import {AddReportComponent} from './modals/add-report/add-report.component';
import {CropImageComponent} from './pages/crop-image/crop-image.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {environment} from "../environments/environment";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {ChatListComponent} from './pages/chat-list/chat-list.component';
import {ChatComponent} from './modals/chat/chat.component';
import {DatePipe} from "@angular/common";
import { ChatRequestPopupComponent } from './modals/chat-request-popup/chat-request-popup.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { ImageInfoModalComponent } from './modals/image-info-modal/image-info-modal.component';

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
        CropImageComponent,
        ChatListComponent,
        ChatComponent,
        ChatRequestPopupComponent,
        TermsAndConditionsComponent,
        ImageInfoModalComponent
    ],
    imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes, {
            useHash: true
        }),
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
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireDatabaseModule,
    ],
    providers: [
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
