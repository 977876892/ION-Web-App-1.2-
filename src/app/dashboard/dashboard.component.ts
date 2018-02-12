import { Component, Output, OnInit , EventEmitter,Input} from '@angular/core';
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
  @Input()
  visitsCount: number;
  querieType: string = 'unanswered';
  promotionTaType;
  analyticsType:string='website';
  AnsAndUnansCount:Array<number>=[];
  queries;
  blogs;
  calDate;
  calMonth='';
  calDay='Today';
  en = {dayNamesShort: ["SU", "M", "T", "W", "T", "F", "S"]};
  monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN","JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  settingsType:string='profile';
  publishType: string = 'publish';
  selectedDateValue: Date;
  isShowDashboard=false;
  isLoadMore: boolean = true;
  currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
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
            if(this.router.url == '/analytics'){
            this.analyticsType = 'website';
          }else if(this.router.url == '/analytics/blogsdata'){
             this.analyticsType = 'publish';
           }else if(this.router.url == '/analytics/questionsData'){
             this.analyticsType = 'queries';
           }else {
             this.analyticsType = 'visits';
           }
         
          if(this.router.url == '/settings'||this.router.url == '/settings/contactus' ||this.router.url == '/settings/users'||this.router.url == '/settings/subscription' ||this.router.url=='/analytics'||this.router.url=='/analytics/blogsdata'||this.router.url=='/analytics/questionsData'||this.router.url=='/analytics/appointments'||this.router.url=='/promotions'||this.router.url=='/promotions/smspromotions'||this.router.url=='/leads'||this.router.url=='/promotions/fullview'||this.router.url.includes('promotiondemo')) {
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
          this.calMonth=this.monthNames[this.selectedDateValue.getMonth()];
         this.calDate=this.selectedDateValue.getDate();
         var dd;
              if(this.selectedDateValue.getDate()<10){
                dd='0'+this.selectedDateValue.getDate();
              } else{
                dd=this.selectedDateValue.getDate();
              }
         this.calDate=dd;
        
    }
    
  }
  changeAmount() {
    if (this.router.url.includes('/promotions')) {
      this.eventType.emit(this.promotionTaType);
    }
  
    // if (this.router.url.includes('/analytics')) {
    //   this.eventType.emit(this.analyticsType);
    // }
    // if (this.router.url.includes('/settings')) {
    //   this.eventType.emit(this.settingsType);
    // }
    if (this.router.url.includes('/visits')) {
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
querieTypeClick(qtype) {
  this.querieType = qtype;
  if(qtype == 'answered') {
    this.router.navigate(['queries/answered']);
  } else if(qtype == 'popular') {
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
  if(atype == 'website') {
   this.router.navigate(['analytics']);
  } else if(atype == 'publish') {
    this.router.navigate(['analytics/blogsdata']);
  } else if(atype == 'queries'){
    this.router.navigate(['analytics/questionsData']);
  }else{
    this.router.navigate(['analytics/appointments']);
  }
  //this.changeAmount();
}
// settingsClick(stype) {
//    this.settingsType = stype;
//   this.changeAmount();
// }

selectedVisitDate(selectedDateValue) {
  this.selectedDateValue=selectedDateValue;
  this.changeAmount();
 
var dd;
if(this.selectedDateValue.getDate()<10){
  dd='0'+this.selectedDateValue.getDate();
} else{
  dd=this.selectedDateValue.getDate();
}

this.calMonth=this.monthNames[this.selectedDateValue.getMonth()];
this.calDay=this.weekday[this.selectedDateValue.getDay()];
this.calDate=dd;
}
helpWindow(event){
window.open('http://getion.in', '_blank');
}

 getDashboardStatistics() {
    this.dashboardService.getDashboardStatistics().subscribe(
      (dashboardResponse: any) => {
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
