import { Component, Output, OnInit , EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { DashboardService } from '../shared/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers:[DashboardService],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSowSubTab: boolean;
  options: DatepickerOptions = {
    locale: enLocale,
    displayFormat: 'DD/MM/YYYY',
    barTitleFormat: 'MMMM YYYY',
  };
  @Output() public eventType: EventEmitter<any> = new EventEmitter<any>();
  // @Output() public promotinType: EventEmitter<any> = new EventEmitter<any>();
  // @Output() public analyticType: EventEmitter<any> = new EventEmitter<any>();
  // @Output() public settingType: EventEmitter<any> = new EventEmitter<any>();
  // @Output() public publishingType: EventEmitter<any> = new EventEmitter<any>();

  querieType: string = 'unanswered';
  promotionTaType;
  analyticsType:string='website';
  AnsAndUnansCount:Array<number>=[];
  queries;
  blogs;
  settingsType:string='profile';
  publishType: string = 'publish';
  selectedDateValue: Date;
  isShowDashboard=false;
  isLoadMore: boolean = false;
  constructor(private router: Router, private dashboardService: DashboardService) {
    this.selectedDateValue = new Date();
   }

  ngOnInit() {
    // this.unanswered=localStorage.getItem("unanswered");
    // this.answered=localStorage.getItem("answered");
    // this.popular=localStorage.getItem("popular");
    // this.AnsAndUnansCount=localStorage.getItem("queries");

     if (localStorage.getItem('user') == null || localStorage.getItem('user') == '') {
      this.router.navigate(['login']);
    }
    else{
      this.getDashboardStatistics();
      this.isShowDashboard=true;
        if(localStorage.getItem('queries'))
          {
              this.queries = localStorage ? JSON.parse(localStorage.getItem('queries')) : 0;
              this.blogs= localStorage? JSON.parse(localStorage.getItem('blogs')) : 0;
          }
          // console.log(this.currentuser);
          this.changeAmount();
          if(this.router.url == '/publish/online') {
            this.publishType = 'online';
          } else if(this.router.url == '/publish/drafts') {
            this.publishType = 'drafts';
          } else {
            this.publishType = 'publish';
          }
          if(this.router.url == '/queries/answered') {
            this.querieType = 'answered';
          } else if(this.router.url == '/queries/popular') {
            this.querieType = 'popular';
          } else {
            this.querieType = 'unanswered';
          }
          if(this.router.url == '/settings'){
            this.settingsType = 'profile';
          }else if(this.router.url == '/settings/contactus'){
             this.settingsType = 'contactus';
           }else if(this.router.url == '/settings/subscription'){
             this.settingsType = 'subscription';
           }else {
             this.settingsType = 'users';
           }
         
          if(this.router.url == '/settings'||this.router.url == '/settings/contactus' ||this.router.url == '/settings/users'||this.router.url == '/settings/subscription' ||this.router.url=='/analytics'||this.router.url=='/promotions'||this.router.url=='/promotions/smspromotions'||this.router.url=='/leads'||this.router.url=='/promotions/fullview') {
            this.isLoadMore= true;
          } 
        // this.changePromotion();
        // this.changeAnalytics();
        // this.changeSettings();
          // this.changePublishType();
          if(this.router.url.includes('smspromotion')) {
          this.promotionTaType = 'smspromotion';
          } else {
            this.promotionTaType = 'designposters';
          }
    }
    
  }
  changeAmount() {
    if (this.router.url.includes('/promotions')) {
      this.eventType.emit(this.promotionTaType);
    }
  
    if (this.router.url.includes('/analytics')) {
      this.eventType.emit(this.analyticsType);
    }
    // if (this.router.url.includes('/settings')) {
    //   this.eventType.emit(this.settingsType);
    // }
    if (this.router.url.includes('/visits')) {
      console.log(this.selectedDateValue);
      this.eventType.emit(this.selectedDateValue);
    }
  }
  
  get user(): any {
      if (localStorage.getItem('user') == '') {
          this.router.navigate(['login']);
      }
      else{
         return JSON.parse(localStorage.getItem('user'));
      }
   
}
// querie subtab click
querieTypeClick(type) {
  this.querieType = type;
  if(type == 'answered') {
    this.router.navigate(['queries/answered']);
  } else if(type == 'popular') {
    this.router.navigate(['queries/popular']);
  } else {
    this.router.navigate(['queries']);
  }
 // this.changeAmount();
}
// setting subtab click
settingsClick(type) {
  this.settingsType = type;
  if(type == 'profile') {
    this.router.navigate(['settings']);
  } else if(type == 'contactus') {
    this.router.navigate(['settings/contactus']);
  } else if(type == 'subscription'){
    this.router.navigate(['settings/subscription']);
  }else{
    this.router.navigate(['settings/users']);
  }
 // this.changeAmount();
}
// publis subtab click
publishTypeClick(ptypes) {
  this.publishType = ptypes;
  if(ptypes == 'drafts') {
    this.router.navigate(['publish/drafts']);
  } else if(ptypes == 'online') {
    this.router.navigate(['publish/online']);
  }else {
    this.router.navigate(['publish']);
  }
  // this.changeAmount();
}
// promotion subtab click handler
promotionTypeClick(ptype) {
  this.promotionTaType = ptype;
  this.changeAmount();
}
analyticTypeClick(atype) {
  this.analyticsType = atype;
  this.changeAmount();
}
// settingsClick(stype) {
//    this.settingsType = stype;
//   this.changeAmount();
// }
selectedVisitDate(selectedDateValue) {
  console.log(selectedDateValue);
  this.selectedDateValue=selectedDateValue;
  this.changeAmount();
}
helpWindow(event){
window.open('http://getion.in', '_blank');
}

 getDashboardStatistics() {
    this.dashboardService.getDashboardStatistics().subscribe(
      (dashboardResponse: any) => {
        console.log(dashboardResponse);
         localStorage.setItem('queries', JSON.stringify({
              unanswered: dashboardResponse.description[0].unanswered,
              answered:dashboardResponse.description[0].answered,
              popular: dashboardResponse.description[0].popular,
          }));
             localStorage.setItem('blogs', JSON.stringify({
              draft: dashboardResponse.description[0].draft,
              publish:dashboardResponse.description[0].publish,
              online: dashboardResponse.description[0].online,
          }));
          this.queries = localStorage ? JSON.parse(localStorage.getItem('queries')) : 0;
          this.blogs= localStorage? JSON.parse(localStorage.getItem('blogs')) : 0;
      }, (err) => {
      }, () => {              
      });

  }
}
