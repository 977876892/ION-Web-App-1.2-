import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../shared/services/dashboard/dashboard.service';
import { PromotionsService } from '../shared/services/promotions/promotions.service';
import { ICarouselConfig, AnimationConfig } from 'angular4-carousel';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [DashboardService, PromotionsService],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
dashboardData: any = [];
dashboardFeedData: any = [];
isStartLoader;
notificationsData: any = [];
isPromoPopupOpen: boolean = false;
isSelectPromo: boolean = false;
isPromoSelected: boolean = false;
promotionsData: any = [];
public imageSources: string[] = [];
public config: ICarouselConfig;
isSelectBlog: boolean = false;
images: any[] = [];

  public carouselBannerItems: Array<any> = [];
  public carouselBanner: NgxCarousel;

 
constructor(private router: Router, private dashboardService: DashboardService, private promotionService: PromotionsService) {

 }

  ngOnInit() {
    if (localStorage.getItem('user') == null || localStorage.getItem('user') == '') {
      this.router.navigate(['login']);
    } else {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    this.getDashboardStatistics();
     const OneSignal = window['OneSignal'] || [];
    OneSignal.push(['init', {
      appId: 'ef7de815-6fae-466b-8f5b-ea582555a873',
      autoRegister: true,
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: false
      }
    }]);
    // OneSignal.push(function () {
    //   console.log('Register For Push');

    //   OneSignal.push(["registerForPushNotifications"])
    // });
    OneSignal.push(function () {
      // Occurs when the user's subscription changes to a new value.
      OneSignal.on('subscriptionChange', function (isSubscribed) {
       // console.log("The user's subscription state is now:", isSubscribed);
        OneSignal.getUserId().then(function (userId) {
          // console.log("User ID is", userId);
        });
      });
    });
      OneSignal.push(['sendTag', 'userid', currentuser.id]); 
    }
   
    
    this.carouselBanner = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 300px;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngxcarouselPoint li.active {
              background: white;
              width: 10px;
          }
        `
      },
      load: 2,
      loop: true,
      touch: true
    }
  }
 
get user(): any {
  return JSON.parse(localStorage.getItem('user'));
}
  getDashboardStatistics() {
    this.isStartLoader = true;
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
        this.dashboardData = dashboardResponse.description;
      }, (err) => {
        this.isStartLoader = false;
      }, () => {        
        this.getDashboardFeeds();       
      });

  }
selectPromo(eachpromotion){
  this.router.navigate(['promotions/promotiondemo',eachpromotion.id,eachpromotion.avatar,eachpromotion.title]);
  // console.log("promo");
  // console.log(eachpromotion);
}
  // Get dashboard feeds
  getDashboardFeeds() {
    this.isStartLoader = true;
    this.dashboardService.getDashboardFeeds().subscribe(
      (dashboardResponse: any) => {
        this.dashboardFeedData = dashboardResponse.description;
         console.log( this.dashboardFeedData);
      }, (err) => {
        this.isStartLoader = false;
      }, () => {
        this.getDashboardNotifications();
      });

  }
  // Get dashboard feeds
  getDashboardNotifications() {
    this.isStartLoader = true;
    this.dashboardService.getDashboardNotificationFeeds().subscribe(
      (feedsResponse: any) => {
        this.notificationsData = feedsResponse.data;
        console.log(this.notificationsData);
      }, (err) => {
        this.isStartLoader = false;
      }, () => {
        this.isStartLoader = false;
              
       // this.images.push('http://www.dashboard.getion.in/images/ion/180/resize-IMG-20171112-1731465a40a2b48924e0.44920380.png');
        console.log(this.images);
        this.config = {
          verifyBeforeLoad: true,
          log: false,
          animation: true,
          animationType: AnimationConfig.SLIDE,
          autoplay: true,
          autoplayDelay: 2000,
          stopAutoplayMinWidth: 768
        };
        this.carouselBannerLoad();
      });

  }
  public carouselBannerLoad() {  
    //console.log("load"); 
    const len = this.carouselBannerItems.length;
    if (this.notificationsData.length > 0 && len==0 ) {
      this.carouselBannerItems=this.notificationsData;
      // for (let i = 0; i < this.images.length; i++) {
      //   this.carouselBannerItems=this.images;
      // }
    }
    console.log(this.carouselBannerItems);
  }
  testingFunction(id){
      console.log(id);
  }
  ConvertToInt(val) {
    return parseInt(val);
  }

  // get promotions
  getPromotionsCall() {
    this.isSelectPromo = false;
    this.isPromoPopupOpen = false;
    this.isPromoSelected = true;
    this.isStartLoader = true;
    this.promotionService.getPromotionsData().subscribe(
      (promotionResponse: any) => {
        console.log(promotionResponse);
        this.promotionsData = promotionResponse;
      }, (err) => {
        this.isStartLoader = false;
      }, () => {
        this.isStartLoader = false;
      });

  }

  // congratulate

  congaratulate(id){
   // console.log("congratulate");
    this.dashboardService.congartulate(id).subscribe(
      (congratulateResponse: any) => {
        // this.notificationsData = feedsResponse.data[0];
        console.log(congratulateResponse);
        this.getDashboardFeeds();
      }, (err) => {
        this.isStartLoader = false;
      }, () => {
        this.isStartLoader = false;
      });
    
  }
}
