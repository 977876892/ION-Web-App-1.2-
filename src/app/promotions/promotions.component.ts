import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionsService } from '../shared/services/promotions/promotions.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  providers: [PromotionsService],
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  promotionsData: any = [];
  ionizedBlogData: any = [];
  isStartLoader;

  constructor(private router: Router, private promotionService: PromotionsService) { }

  ngOnInit() {
    if (localStorage.getItem('user') === null) {
      this.router.navigate(['login']);
    } else {
    this.getPromotions();
    }
  }
  // event trigger function
  onEventChanged(ptype: any) {
    console.log(ptype);
  }
 // Getting promotions
 getPromotions() {
  this.isStartLoader = true;
  this.promotionService.getPromotionsData().subscribe(
    (promotionResponse: any) => {
      console.log(promotionResponse);
      this.promotionsData = promotionResponse;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.getIonizedBlogsData();
    });
}
 // get Inonized blogs
 getIonizedBlogsData() {
  this.isStartLoader = true;
  this.promotionService.getIonizedBlogs().subscribe(
    (blogResponse: any) => {
      console.log(blogResponse);
      this.ionizedBlogData = blogResponse.data;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
    });
}
}
