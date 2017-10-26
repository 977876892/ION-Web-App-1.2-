import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('user') === null) {
      this.router.navigate(['login']);
    } else {}
  }

}
