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
  { path: 'settings', component: SettingsComponent },
  { path: 'leads', component: LeadsComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'queries/:qId', component: QueriesComponent },
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
