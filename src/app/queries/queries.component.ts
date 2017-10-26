import { Component, Output, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QueriesService } from '../shared/services/queries/queries.service';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  providers: [QueriesService],
  styleUrls: ['./queries.component.css']
})
export class QueriesComponent implements OnInit {
  queriesData: any = [];
  querieTemplatesData: any = [];
  // unansweredData: any = [];
  activeClassName: string = 'active';
  eachQuerieData: any = [];
  isShowUser: boolean = false;
  userDispalyData: any = {};
  isQuickReply: boolean = false;
  questionId: any = '';
  templateData: string = '';
  isAddtoQuickReply: boolean = false;
  isStartLoader;
  querieID: string = '';

  constructor(private router: Router, private quriesService: QueriesService, private route: ActivatedRoute) {
    document.addEventListener('click', this.offClickHandler.bind(this));
  }
  @ViewChild('answerData') private elementRef: ElementRef;
  @ViewChild('mainContainer') container;
  ngOnInit() {
    if (localStorage.getItem('user') === null) {
      this.router.navigate(['login']);
    } else {
      this.elementRef.nativeElement.focus();
     // this.getAllUnansweredQueries();
    }
    this.route.params.forEach((params: Params) => {
      if (params.qId !== '') {
        console.log(params.qId);
        this.querieID = params.qId;
      }
    });
  }
  offClickHandler(event: any) {
    if (!this.container.nativeElement.contains(event.target)) {
        this.isShowUser = false;
    }
}
  onEventChanged(qtype: any) {
    console.log(qtype);
    if (qtype === 'unanswered') {
      this.getAllUnansweredQueries();
    } else if (qtype === 'answered') {
      this.getAllAnsweredQueries();
    } else {
      this.getQueries();
    }
  }
  // Getting All queries
 getQueries() {
  this.isStartLoader = true;
  this.quriesService.getAllQueries().subscribe(
    (queriesResponse: any) => {
      console.log(queriesResponse);
      this.queriesData = queriesResponse.posts;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
        this.showQueries(0);
    });
}
 // Getting All answered queries
 getAllAnsweredQueries() {
  this.isStartLoader = true;
  this.quriesService.getAnsweredQueries().subscribe(
    (queriesResponse: any) => {
      console.log(queriesResponse);
      this.queriesData = queriesResponse.posts;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.showQueries(0);
    });
}

 // Getting All unanswered queries
 getAllUnansweredQueries() {
  this.isStartLoader = true;
  this.quriesService.getUnAnsweredQueries().subscribe(
    (queriesResponse: any) => {
      console.log(queriesResponse);
      this.queriesData = queriesResponse.posts;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.showQueries(0);
    });
}
// get detail querie call
getDetailsEachQuerie(id) {
  this.isStartLoader = true;
  this.quriesService.getDetailQuerie(id).subscribe(
    (queriesResponse: any) => {
      console.log(queriesResponse);
      this.eachQuerieData = queriesResponse.posts;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      if (this.eachQuerieData.length > 0) {
        if (this.eachQuerieData[0].user_id === '0') {
          this.userDispalyData = this.eachQuerieData[0];
        } else if (this.eachQuerieData[1].user_id === '0') {
          this.userDispalyData = this.eachQuerieData[1];
        }
      }
    });
}
// Answer to a querie
answerAQuerie(replyData, qId) {
  this.isStartLoader = true;
  this.quriesService.addAnswerToQuerie(replyData, qId).subscribe(
    (qResponse: any) => {
      console.log(qResponse);
      // this.queriesData = qResponse;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      if (this.isAddtoQuickReply) {
        this.addQuerieTemplate(replyData);
      }
      this.isQuickReply = false;
      this.showQueries(0);
    });
}
// geting all querie templates
getQuerieTemplates(index) {
  this.isStartLoader = true;
  let navItem: any;
  for (navItem of this.queriesData) {
    if (navItem.activeclass === this.activeClassName) {
      navItem.activeclass = '';
    }
  }
  this.queriesData[index].activeclass = this.activeClassName;
  this.isQuickReply = true;
  this.quriesService.getQuerieReplyTemplates().subscribe(
    (queriesResponse: any) => {
      console.log(queriesResponse);
      this.querieTemplatesData = queriesResponse.description;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.showTemplates(0);
    });
}
// adding querie template
addQuerieTemplate(tempData) {
  this.isStartLoader = true;
  this.quriesService.addQuerieReplyTemplate(tempData).subscribe(
    (qResponse: any) => {
      console.log(qResponse);
      // this.queriesData = qResponse;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.isQuickReply = false;
      this.showQueries(0);
    });
}
// delete querie template
deleteQuerieTemplate(tId) {
  this.isStartLoader = true;
  this.quriesService.deleteQuerieTemplateData(tId).subscribe(
    (qResponse: any) => {
      console.log(qResponse);
      // this.queriesData = qResponse;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.isQuickReply = false;
      this.showQueries(0);
    });
}
showTemplates(index) {
  let tempItem: any;
  for (tempItem of this.querieTemplatesData) {
    if (tempItem.activeclass === this.activeClassName) {
      tempItem.activeclass = '';
    }
  }
  this.querieTemplatesData[index].activeclass = this.activeClassName;
  this.templateData = this.querieTemplatesData[index].content; 
}

showQueries(Index: any) {
    let navItem: any;
    for (navItem of this.queriesData) {
      if (navItem.activeclass === this.activeClassName) {
        navItem.activeclass = '';
      }
    }
    this.queriesData[Index].activeclass = this.activeClassName;
    this.getDetailsEachQuerie(this.queriesData[Index].id);
    this.elementRef.nativeElement.focus();
    this.isQuickReply = false;
    this.questionId = this.queriesData[Index].id;
}

}
