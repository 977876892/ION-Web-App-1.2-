import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../shared/services/dashboard/dashboard.service';
import { PromotionsService } from '../shared/services/promotions/promotions.service';

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
// @ViewChild('mainContainer') container;

constructor(private router: Router, private dashboardService: DashboardService, private promotionService: PromotionsService) {
  // document.addEventListener('click', this.offClickHandler.bind(this));
 }

  ngOnInit() {
    if (localStorage.getItem('user') === null) {
      this.router.navigate(['login']);
    } else {
    this.getDashboardStatistics();
    }
  }
  offClickHandler(event: any) {
    // if (this.container.nativeElement.contains(event.target)) {
    //     this.isPromoPopupOpen = false;
    //     this.isSelectPromo = false;
    // }
}
  getDashboardStatistics() {
    this.isStartLoader = true;
    this.dashboardService.getDashboardStatistics().subscribe(
      (dashboardResponse: any) => {
        console.log(dashboardResponse);
        this.dashboardData = dashboardResponse.description;
      }, (err) => {

      }, () => {
        this.isStartLoader = false;
        this.getDashboardFeeds();
        this.getDashboardNotifications();
      });

  }

  // Get dashboard feeds
  getDashboardFeeds() {
    this.isStartLoader = true;
    this.dashboardService.getDashboardFeeds().subscribe(
      (dashboardResponse: any) => {
        console.log(dashboardResponse);
        this.dashboardFeedData = dashboardResponse.description;
      }, (err) => {

      }, () => {
        this.isStartLoader = false;
      });

  }
  // Get dashboard feeds
  getDashboardNotifications() {
    this.isStartLoader = true;
    this.dashboardService.getDashboardNotificationFeeds().subscribe(
      (feedsResponse: any) => {
        this.notificationsData = feedsResponse.data[0];
        console.log(this.notificationsData);
      }, (err) => {

      }, () => {
        this.isStartLoader = false;
      });

  }
  ConvertToInt(val) {
    return parseInt(val);
  }

  // get promotions
  getPromotionsCall() {
    this.isPromoSelected = true;
    this.isStartLoader = true;
    this.promotionService.getPromotionsData().subscribe(
      (promotionResponse: any) => {
        console.log(promotionResponse);
        this.promotionsData = promotionResponse;
      }, (err) => {
      }, () => {
        this.isStartLoader = false;
      });

  }
}
