import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routedComponents, AppRoutingModule } from './app.routing';
import { CarouselModule } from 'angular4-carousel';
import { FullCalendarModule } from 'ng-fullcalendar';
import { NgDatepickerModule } from 'ng2-datepicker';
import { NgxCarouselModule } from 'ngx-carousel';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
// import { LockerModule } from './shared/storage/safeguard';

import { AppComponent } from './app.component';
import { LoginComponent, } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PublishComponent } from './publish/publish.component';
import { VisitsComponent } from './visits/visits.component';
import { QueriesComponent,QuerySearchPipe } from './queries/queries.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { SettingsComponent } from './settings/settings.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { LeadsComponent } from './leads/leads.component';
import { ChartsModule } from 'ng2-charts';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { AutofocusModule } from 'angular-autofocus-fix';
//import {  } from 'ng-pick-datetime';
import { UiSwitchModule } from 'ngx-toggle-switch/src'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PublishComponent,
    VisitsComponent,
    QueriesComponent,
    AnalyticsComponent,
    PromotionsComponent,
    SettingsComponent,
    ForgotpasswordComponent,
    RegistrationComponent,
    DashboardComponent,
    HeaderComponent,
    LeadsComponent,
    QuerySearchPipe
  ],
  imports: [
    BrowserModule,
    AngularMultiSelectModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
    TagInputModule,
    CarouselModule,
    BrowserAnimationsModule,
    FullCalendarModule,
    NgDatepickerModule,
    Ng2OrderModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    DateTimePickerModule,
    NgxCarouselModule,
    AutofocusModule,UiSwitchModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
  }
}
