import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VisitsService } from '../shared/services/visits/visits.service';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  providers: [VisitsService],
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {
  visitsData: any = [];
  isStartLoader;

  constructor(private router: Router, private visitsService: VisitsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getVisits();
  }
  // Getting All Visits
 getVisits() {
  this.isStartLoader = true;
  this.visitsService.getVisitsListService().subscribe(
    (visitsResponse: any) => {
      console.log(visitsResponse);
      this.visitsData = visitsResponse.data;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;

    });
}

}
