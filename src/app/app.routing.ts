import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, NavigationError } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { PublishComponent } from './publish/publish.component';
import { QueriesComponent } from './queries/queries.component';
import { SettingsComponent } from './settings/settings.component';
import { LeadsComponent } from './leads/leads.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { RegistrationComponent } from './registration/registration.component';
import { VisitsComponent } from './visits/visits.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { Title } from '@angular/platform-browser';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'promotions', component: PromotionsComponent },
  { path: 'publish', component: PublishComponent },
  { path: 'queries', component: QueriesComponent },
  { path: 'visits', component: VisitsComponent },
  { path: 'visits/:isAddVisitParam', component: VisitsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/contactus', component: SettingsComponent },
  { path: 'settings/subscription', component: SettingsComponent },
  { path: 'settings/users', component: SettingsComponent },
  { path: 'leads', component: LeadsComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'queries/:qId', component: QueriesComponent },
  { path: 'promotions/:view', component: PromotionsComponent },
  { path: 'promotions/:view/:id/:avatar/:title', component: PromotionsComponent },
  // { path: 'promotions/:view', component: PromotionsComponent },
  { path: 'publish/calendar', component: PublishComponent },
  { path: 'publish/drafts', component: PublishComponent },
  { path: 'publish/online', component: PublishComponent },
  { path: 'publish/:isnewpost', component: PublishComponent },
  { path: 'queries/answered', component: QueriesComponent },
  { path: 'queries/popular', component: QueriesComponent },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(appRoutes)]
  })
  export class AppRoutingModule {

      constructor(private router: Router, title: Title) {
        router.events.subscribe((route) => {
          if (route instanceof NavigationError) {
            this.router.navigate(['login']);
          }
        });
      }
    }

    export const routedComponents = [
        LoginComponent,
        RegistrationComponent,
        ForgotpasswordComponent,
        HomeComponent,
        PromotionsComponent,
        PublishComponent,
        QueriesComponent,
        VisitsComponent,
        SettingsComponent,
        LeadsComponent,
        AnalyticsComponent
    ];
