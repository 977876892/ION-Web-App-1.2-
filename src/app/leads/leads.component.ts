import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LeadsService } from '../shared/services/leads/leads.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  providers: [LeadsService],
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  leadsData: any = [];
  isStartLoader;

  constructor(private router: Router, private leadsService: LeadsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getLeads();
  }
// Getting All leads
getLeads() {
  this.isStartLoader = true;
  this.leadsService.getLeadsListService().subscribe(
    (leadsResponse: any) => {
      console.log(leadsResponse);
      this.leadsData = leadsResponse.description;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;

    });
}
}
