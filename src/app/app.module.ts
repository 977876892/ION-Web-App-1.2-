import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routedComponents, AppRoutingModule } from './app.routing';
// import { LockerModule } from './shared/storage/safeguard';

import { AppComponent } from './app.component';
import { LoginComponent, } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PublishComponent } from './publish/publish.component';
import { VisitsComponent } from './visits/visits.component';
import { QueriesComponent } from './queries/queries.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { SettingsComponent } from './settings/settings.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { LeadsComponent } from './leads/leads.component';
import { ChartsModule } from 'ng2-charts';

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
