import { Component, Output, OnInit , EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSowSubTab: boolean;
  @Output() public eventType: EventEmitter<any> = new EventEmitter<any>();
  @Output() public promotinType: EventEmitter<any> = new EventEmitter<any>();
  @Output() public analyticType: EventEmitter<any> = new EventEmitter<any>();

  querieType: string = 'unanswered';
  promotionTaType: string = 'designposters';
  analyticsType:string='website';

  constructor(private router: Router) { }

  ngOnInit() {
    this.changeAmount();
    this.changePromotion();
  }
  changeAmount() {
    this.eventType.emit(this.querieType);
  }
  changePromotion() {
    this.promotinType.emit(this.promotionTaType);
  }
  changeAnalytics(){
    this.analyticType.emit(this.analyticsType);
  }
  get user(): any {
    return JSON.parse(localStorage.getItem('user'));
}
// querie subtab click
querieTypeClick(type) {
  this.querieType = type;
  this.changeAmount();
}
// promotion subtab click handler
promotionTypeClick(ptype) {
  this.promotionTaType = ptype;
  this.changePromotion();
}
analyticTypeClick(atype) {
  this.analyticsType = atype;
  this.changeAnalytics();
}

}
