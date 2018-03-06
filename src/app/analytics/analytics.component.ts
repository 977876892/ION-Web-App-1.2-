
//install follwing packages

//npm install underscore --save
//npm install @types/underscore --save
//npm install xml2js --save
//npm install ng2-charts --save
//npm install chart.js --save
//npm i --save angular4-carousel(for dashboard screen scroll)
//npm install ngx-chips --save (for tags)
//npm install angular-froala-wysiwyg (for editor)



import { Component, Output, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'underscore';
import * as xml2js from 'xml2js';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { IonServer } from '../shared/globals/global';
import { ErrorService } from '../shared/services/error/error.service';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  providers: [AnalyticsService,ErrorService]
})
export class AnalyticsComponent implements OnInit {

  // constructor() { }

  // ngOnInit() {
  // }
  currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
     
  constructor(private router: Router, private route: ActivatedRoute,private analyticsService: AnalyticsService,private errorservice:ErrorService) {
  
  }
    //public estimated:string='0';
  selectedDate:Date=new Date();
  allApiCalls:any[];
  estimated:number;
  alertMessage='';
  websiteAnalytics:boolean=true;
  showPublishAnalytics:boolean=false;
  showVisitAnalytics:boolean=false;
  isAlertPopup:boolean=false;
  showQueryAnalytics:boolean=false;
  isStartLoader: boolean = false;
  curentYear;
  ngOnInit() {
    if (localStorage.getItem('user') == null || localStorage.getItem('user') == '') {
      this.router.navigate(['login']);
    } else {
       if(this.currentuser.userGroup!=17)
        {
          this.router.navigate(['home']);
        }
        else{
          this.getAnalytics();
          this.estimated=0;
          if (this.router.url == '/analytics') {
              window.scroll(0,0);
              this.showQueryAnalytics=false;
              this.showVisitAnalytics=false;
              this.showPublishAnalytics=false;
              this.websiteAnalytics=true;
          }
          else if(this.router.url == '/analytics/blogsdata') {
              this.showQueryAnalytics=false;
              this.showVisitAnalytics=false;
              this.showPublishAnalytics=true;
              this.websiteAnalytics=false;
          }
            else if(this.router.url == '/analytics/questionsData') {
              this.showQueryAnalytics=true;
              this.showVisitAnalytics=false;
              this.showPublishAnalytics=false;
              this.websiteAnalytics=false;
          }
            else {
              this.showQueryAnalytics=false;
              this.showVisitAnalytics=true;
              this.showPublishAnalytics=false;
              this.websiteAnalytics=false;
          }

            
        }
    }
  }

  // onEventChanged(atype: any) {
  //   if (atype === 'website') {
  //      this.showQueryAnalytics=false;
  //     this.showVisitAnalytics=false;
  //     this.websiteAnalytics=true;
  //     this.showPublishAnalytics=false;
  //   } else if (atype === 'publish') {
      //  this.showQueryAnalytics=false;
      // this.showVisitAnalytics=false;
      // this.showPublishAnalytics=true;
      // this.websiteAnalytics=false;
  //   } 
  //   else if (atype === 'queries') {
  //     this.showQueryAnalytics=true;
  //     this.showVisitAnalytics=false;
  //     this.showPublishAnalytics=false;
  //     this.websiteAnalytics=false;
  //   } 
  //   else {
       
  //   }
  // }
  shownoWebSiteAnalytics=false;
  getAnalytics() {
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    if(currentuser.analyticId==''||currentuser.analyticId==null)
      {
          this.shownoWebSiteAnalytics=true;
      }
      else{
             this.isStartLoader = true;
             this.shownoWebSiteAnalytics=false;
             this.analyticsService.getAnalytics().subscribe(
            (analyticsResponse: any) => {
                this.allApiCalls=analyticsResponse.extra_fields;
                this.websiteRank();
                this.getEstimatedDaily();
                this.lastThreeMonthsUsersBasedOnAgeAndGender();
                this.lastThreeMonthsFromSocial();
                this.topPagesLastMonth();
                this.lastMonthKeywords();
                this.websiteTraffic();
                this.lastMonthUserEngagementonWebsite();
            }, (err) => {
              var errorMessage= this.errorservice.logError(err);
                this.isStartLoader=false;
                this.isAlertPopup=true;
                this.alertMessage=errorMessage;
        }, () => {
          this.isStartLoader = false;
      });
      }
      this.dateChange(new Date());
      this.getQueriesData();
      this.getBlogsData();
  }

  
                // lineChart
                public lineChartOptions ={
                  responsive: true
                };
                public lineChartColorsForVisits:Array<any> = [
                  { // grey 5bb2ec
                    backgroundColor: 'rgba(148,159,177,0.2)',
                    borderColor: '#5BB2EC',
                    pointBackgroundColor: '#5BB2EC',
                    pointBorderColor: '#5BB2EC',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                  },
                  { // dark grey
                    backgroundColor: 'rgba(77,83,96,0.2)',
                    borderColor: 'rgba(77,83,96,1)',
                    pointBackgroundColor: 'rgba(77,83,96,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(77,83,96,1)'
                  },
                  { // grey
                    backgroundColor: 'rgba(148,159,177,0.2)',
                    borderColor: 'rgba(148,159,177,1)',
                    pointBackgroundColor: 'rgba(148,159,177,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                  }
                ];
                public lineChartColors:Array<any> = [
                  { // grey 5bb2ec
                    backgroundColor: 'rgba(148,159,177,0.2)',
                    borderColor: 'rgba(148,159,177,1)',
                    pointBackgroundColor: 'rgba(148,159,177,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                  },
                  { // dark grey
                    backgroundColor: 'rgba(77,83,96,0.2)',
                    borderColor: 'rgba(77,83,96,1)',
                    pointBackgroundColor: 'rgba(77,83,96,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(77,83,96,1)'
                  },
                  { // grey
                    backgroundColor: 'rgba(148,159,177,0.2)',
                    borderColor: 'rgba(148,159,177,1)',
                    pointBackgroundColor: 'rgba(148,159,177,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                  }
                ];
               
                
                public lineChartLegend:boolean=false;
                public lineChartType:string='line';
                // line chart

                //bar chart
                public barChartOptions:any = {
                  scaleShowVerticalLines: false,
                  responsive: true
                };
            
                public barChartType:string = 'bar';
                public barChartLegend:boolean = false;
                public showThreeBar=false;
                public showSixBar=false;
                public barChartLabels:string[] = ['18-24','25-34','35-44', '45-54', '55-64','65+'];
                public barChartColors:Array<any> = [
                      { // grey 5bb2ec
                        backgroundColor: '#5BB2EC',
                        borderColor: '#5BB2EC',
                        pointBackgroundColor: '#5BB2EC',
                        pointBorderColor: '#5BB2EC',
                        pointHoverBackgroundColor: '#5BB2EC',
                        pointHoverBorderColor: '#5BB2EC'
                      }
                ];
                public cancelledAndAcceptedColor:Array<any> = [
                      
                   { // grey 5bb2ec
                        backgroundColor: '#5BB2EC',
                        borderColor: '#5BB2EC',
                        pointBackgroundColor: '#5BB2EC',
                        pointBorderColor: '#5BB2EC',
                        pointHoverBackgroundColor: '#5BB2EC',
                        pointHoverBorderColor: '#5BB2EC'
                      },{ // grey 5bb2ec
                        backgroundColor: '#fd819c',
                        borderColor: '#fd819c',
                        pointBackgroundColor: '#fd819c',
                        pointBorderColor: '#fd819c',
                        pointHoverBackgroundColor: '#fd819c',
                        pointHoverBorderColor: '#fd819c'
                      }
                ];
                //bar chart
  
  //Trend Of User Visits start
                public showDailyLine=false;
                public showMonthly=false;
                public lineChartDataForDaily:Array<any>=new Array({data: [], label: 'Trend Of User Visits Day Wise'});
                public lineChartDataForMonthly:Array<any>=new Array({data: [], label: 'Trend Of User Visits Monthly Wise'}); 
                public lineChartLabelsForDaily:Array<any>=new Array();
                public lineChartLabelsForMonthly:Array<any>=new Array();

                getEstimatedDaily(){
                  this.isStartLoader = true;
                    this.showMonthly=false;
                        this.analyticsService.getEstimatedDailyVisits(this.allApiCalls).subscribe(
                          (analyticsResponse: any) => {
                            var rows=analyticsResponse.rows;
                              for(var i=0;i<rows.length;i++){
                                  for(var j=0;j<rows[i].length;j++){
                                    if(j==0){ 
                                      this.lineChartLabelsForDaily[i]= rows[i][j].substring(6,8);
                                    }else{
                                      this.lineChartDataForDaily[0].data[i]=rows[i][j];
                                    }   
                                  }
                              }
                              this.showDailyLine=true;
                          }, (err) => {
                            var errorMessage= this.errorservice.logError(err);
                            this.isAlertPopup=true;
                            this.isStartLoader=false;
                            this.alertMessage=errorMessage;
                        }, () => {
                          this.isStartLoader = false;
                      });
                }
                getEstimatedMonthly(){
                  this.isStartLoader = true;
                      this.showDailyLine=false;
                          this.analyticsService.getEstimatedMonthlyVisits(this.allApiCalls).subscribe(
                                  (analyticsResponse: any) => {
                                          var rows=analyticsResponse.rows;
                                          var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                          var month,year,display;
                                          var groupedRows = _.groupBy(analyticsResponse.rows, function(element){ return element[0].substring(0,6);});
                                          //for skipping the first element in array
                                          var x=0;
                                          //storing the values into lineChartDataForMonthly,lineChartLabelsForMonthly arrays based on index
                                          var i=0;
                                          for(var key in groupedRows){
                                              if(x==0) x++;
                                              else{
                                                    var countsInMonth= groupedRows[key];  
                                                    var count = _.reduce(countsInMonth,function(memo,num){return memo+parseInt(num[1]);},0);
                                                    year=key.substring(2,4);
                                                    month=key.substring(4,6);
                                                    display=monthNames[parseInt(month)-1]+ " '" +year;
                                                    this.lineChartDataForMonthly[0].data[i]=count;
                                                    this.lineChartLabelsForMonthly[i]= display;
                                                    i++;   
                                              }       
                                          }
                                          this.showMonthly=true;
                                  }, (err) => {
                                    var errorMessage= this.errorservice.logError(err);
                                    this.isAlertPopup=true;
                                    this.isStartLoader=false;
                                    this.showMonthly=false;
                                    this.alertMessage=errorMessage;
                                  }, () => {
                                    this.isStartLoader = false;
                    });
                }
  //Trend Of User Visits end

  //Total Visitors - Age vs Genders
           
                public lastThreeMonthsAgeAndGender:any[] = [
                  {data: [], label: 'Male'},
                  {data: [], label: 'Female'}
                ];
                public lastSixMonthsAgeAndGender:any[] = [
                  {data: [], label: 'Male' },
                  {data: [], label: 'Female'}
                ];
                lastThreeMonthsUsersBasedOnAgeAndGender(){
                  this.isStartLoader = true;
                      this.showThreeBar=false;
                      this.analyticsService.lastThreeMonthsAandG(this.allApiCalls).subscribe(
                            (analyticsResponse: any) => {
                              this.ageAndGenderDisplay(analyticsResponse);
                            }, (err) => {
                              this.isAlertPopup=true;
                              this.isStartLoader=false;
                              var errorMessage= this.errorservice.logError(err);
                              this.alertMessage=errorMessage;
                            }, () => {
                              this.isStartLoader = false;
                            });
                }
                lastSixMonthsUsersBasedOnAgeAndGender(){
                        this.showThreeBar=false;
                        this.isStartLoader = true;
                        this.analyticsService.lastSixMonthsAandG(this.allApiCalls).subscribe(
                              (analyticsResponse: any) => {
                                this.ageAndGenderDisplay(analyticsResponse)
                              }, (err) => {
                                      this.isAlertPopup=true;
                                      this.isStartLoader=false;
                                      var errorMessage= this.errorservice.logError(err);
                                      this.alertMessage=errorMessage;
                              }, () => {
                                this.isStartLoader = false;
                              });
                }
                ageAndGenderDisplay(analyticsResponse){
                          var age_array=[ '18-24_female','18-24_male','25-34_female','25-34_male',
                                '35-44_female','35-44_male',
                                '45-54_female','45-54_male',
                                '55-64_female','55-64_male',
                                '65+_female','65+_male'];
                          var rows=analyticsResponse.rows;  
                          var groupedRows = _.groupBy(rows, function(element){return element[0]+"_"+element[1]});
                          var age,male_count,female_count,k=0;
                          for(var i=0;i<age_array.length;i++){
                            var obj= groupedRows[age_array[i]];
                                if(typeof obj== "undefined"){
                                    if(i%2==0){
                                        this.lastThreeMonthsAgeAndGender[1].data[k]=0;
                                    }
                                    else{
                                        this.lastThreeMonthsAgeAndGender[0].data[k]=0
                                    }
                                }
                                else{
                                      age=obj[0];
                                      if(age[1]=="female"){
                                        this.lastThreeMonthsAgeAndGender[1].data[k]=parseInt(age[2]);
                                          }
                                          else{
                                            this.lastThreeMonthsAgeAndGender[0].data[k]=parseInt(age[2]);      
                                          }
                                    }
                              if(i>0&&i%2!=0)  
                                {
                                  k++;
                                }
                              
                          } 
                          this.showThreeBar=true;
                }
  //Total Visitors - Age vs Genders
  //Source Of Visitors
                public sourceOfVisitorsLabels:string[] = [];
                public showSocilal=false;
                public socialVisitors:any[] = [
                  {data: [], label: ''}
                ];
                lastThreeMonthsFromSocial(){
                        this.showSocilal=false;
                        this.isStartLoader = true;
                        this.analyticsService.socilaTrafficLTM(this.allApiCalls).subscribe(
                            (analyticsResponse: any) => {
                                this.sourceOfVisitors(analyticsResponse);
                            }, (err) => {
                              this.isAlertPopup=true;
                              this.isStartLoader=false;
                              var errorMessage= this.errorservice.logError(err);
                              this.alertMessage=errorMessage;
                            }, () => {
                              this.isStartLoader = false;
                        });
                }
                lastSixMonthsFromSocial(){
                  this.isStartLoader = true;
                        this.showSocilal=false;
                        this.analyticsService.socilaTrafficLSM(this.allApiCalls).subscribe(
                              (analyticsResponse: any) => {
                                this.sourceOfVisitors(analyticsResponse);  
                              }, (err) => {
                                this.isAlertPopup=true;
                                this.isStartLoader=false;
                                var errorMessage= this.errorservice.logError(err);
                                this.alertMessage=errorMessage;
                              }, () => {
                                this.isStartLoader = false;
                        });
                }
                sourceOfVisitors(analyticsResponse){
                        for(var i=0;i<analyticsResponse.rows.length;i++){
                          if((analyticsResponse.rows[i])[0]=="(not set)") 
                          {
                              (analyticsResponse.rows[i])[0]="N/A";
                          } 
                        }  
                        var i=0;
                        var groupedRows = _.groupBy(analyticsResponse.rows, function(element){ return element[0];});
                        for(var key in groupedRows){
                                var countsInSocialSites= groupedRows[key];
                                var count = _.reduce(countsInSocialSites,function(memo,num){return memo+parseInt(num[1]);},0);   
                                this.socialVisitors[0].data[i]=count;
                                this.sourceOfVisitorsLabels[i]=analyticsResponse.rows[i][0];
                                i++;   
                        }
                        this.showSocilal=true;
                }
  //Source Of Visitors
   
  //Top 5 pages
                public pages:Array<any>=new Array();
                public bounces:Array<any>=new Array();
                public entrances:Array<any>=new Array();
                public pageviews:Array<any>=new Array();
                public timeOnPage:Array<any>=new Array();
                public exits:Array<any>=new Array();
                public showTopPages=false;
                topPagesLastMonth(){
                  this.isStartLoader = true;
                        this.showTopPages=false;
                        this.analyticsService.topPagesLM(this.allApiCalls).subscribe(
                                (analyticsResponse: any) => {
                                  this.showTopPagesGraph(analyticsResponse);
                                }, (err) => {
                                  this.isAlertPopup=true;
                                  this.isStartLoader=false;
                                  var errorMessage= this.errorservice.logError(err);
                                  this.alertMessage=errorMessage;
                                }, () => {
                                  this.isStartLoader = false;
                                });
                }
                topPagesLastThreeMonths(){
                  this.isStartLoader = true;
                        this.showTopPages=false;
                        this.analyticsService.topPagesLTM(this.allApiCalls).subscribe(
                                (analyticsResponse: any) => {
                                    this.showTopPagesGraph(analyticsResponse);
                                }, (err) => {
                                  this.isAlertPopup=true;
                                  this.isStartLoader=false;
                                  var errorMessage= this.errorservice.logError(err);
                                  this.alertMessage=errorMessage;
                                }, () => {
                                  this.isStartLoader = false;
                      });
                }
                showTopPagesGraph(analyticsResponse){

                    var groupedRows = _.groupBy(analyticsResponse.rows, function(element){ return element[0];}); 
                    var i=0;
                    for(var pagePath in groupedRows){
                            this.pages[i]=analyticsResponse.rows[i][0];
                            var countsInDay= groupedRows[pagePath]; 
                            this.bounces[i] = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[1]);},0); 
                            this.entrances[i] = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[2]);},0); 
                            this.pageviews[i] = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[3]);},0);
                            this.timeOnPage[i] =(( _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[4]);},0))/60).toFixed(1);        
                            this.exits[i] = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[5]);},0);  
                            i++;
                      } 
                      this.showTopPages=true;   
                }
         
  //Top 5 pages

//key words
                public keywordsSearched:Array<any>=new Array();
                public sessions:Array<any>=new Array();
                public sessionDuration:Array<any>=new Array();
                public keywordpageviews:Array<any>=new Array();
                public keywords=false;
                lastMonthKeywords(){
                  this.isStartLoader = true;
                      this.keywords=false;
                      this.analyticsService.keywordsLM(this.allApiCalls).subscribe(
                            (analyticsResponse: any) => {
                                this.showKeyWordsGraph(analyticsResponse);
                            }, (err) => {
                              this.isAlertPopup=true;
                              this.isStartLoader=false;
                              var errorMessage= this.errorservice.logError(err);
                              this.alertMessage=errorMessage;
                            }, () => {
                              this.isStartLoader = false;
                      });
                }
                lastThreeMonthsKeywords(){
                  this.isStartLoader = true;
                      this.keywords=false;
                      this.analyticsService.keywordsLTM(this.allApiCalls).subscribe(
                              (analyticsResponse: any) => {
                                this.showKeyWordsGraph(analyticsResponse);
                              }, (err) => {
                                this.isAlertPopup=true;
                                this.isStartLoader=false;
                                var errorMessage= this.errorservice.logError(err);
                                this.alertMessage=errorMessage;
                              }, () => {
                                this.isStartLoader = false;
                      });
                }
                showKeyWordsGraph(analyticsResponse){  
                      for(var i=0;i<analyticsResponse.rows.length;i++){
                              if((analyticsResponse.rows[i])[0]=="(not set)") 
                              {
                                  (analyticsResponse.rows[i])[0]="N/A";
                              } 
                      }           
                      var groupedRows = _.groupBy(analyticsResponse.rows, function(element){ return element[0];}); 
                      var i=0;
                      for(var keyword in groupedRows){
                      this.keywordsSearched[i]=analyticsResponse.rows[i][0];
                      var countsInDay= groupedRows[keyword];
                      this.sessions[i] = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[1]);},0);
                      this.sessionDuration[i] = ((_.reduce(countsInDay,function(memo,num){return memo+parseInt(num[2]);},0))/60).toFixed(1);
                      var keywordpageviews = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[3]);},0);
                      this.keywordpageviews[i]=Math.round(keywordpageviews/this.sessions[i]);
                      i++;
                      }   
                      this.keywords=true;
                }      
  //keywords

  //websitetraffic
                public cities:Array<any>=new Array();
                public users:Array<any>=new Array();
                public newUsers:Array<any>=new Array();
                public pageviewsInCities:Array<any>=new Array();
                public showCitites=false;
                websiteTraffic(){
                      this.analyticsService.WebsiteTraffic(this.allApiCalls).subscribe(
                                (analyticsResponse: any) => {
                                for(var i=0;i<analyticsResponse.rows.length;i++){
                                  if((analyticsResponse.rows[i])[0]=="(not set)") 
                                  {
                                      (analyticsResponse.rows[i])[0]="N/A";
                                  } 
                      }  
                      var i=0;
                      var groupedRows = _.groupBy(analyticsResponse.rows, function(element){ return element[0];});
                      for(var city in groupedRows){
                            this.cities[i]=analyticsResponse.rows[i][0];
                            var countsInDay= groupedRows[city];
                            this.users[i] = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[1]);},0);
                            this.newUsers[i] = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[2]);},0);
                            var pageviews = _.reduce(countsInDay,function(memo,num){return memo+parseInt(num[3]);},0);
                            this.pageviewsInCities[i]=Math.round(pageviews/(this.users[i]+this.newUsers[i]));
                            i++;
                      }   
                            this.showCitites=true;
                            }, (err) => {
                              this.isAlertPopup=true;
                              this.isStartLoader=false;
                              var errorMessage= this.errorservice.logError(err);
                              this.alertMessage=errorMessage;
                            }, () => {
                    });
                }
  //website traffic

  //user engagement on website
                public lUserVisited:number;
                public lBounceRate:number;
                public lPageViews:number;
                public lAvgPageViews:number;
                public showUserEngagementLM=false;
                public showUserEngagementLS=false;
                lastMonthUserEngagementonWebsite(){
                      this.showUserEngagementLS=false;
                      this.analyticsService.lastMonthNoOfUsersVisited(this.allApiCalls).subscribe(
                      (analyticsResponse: any) => {
                            this.lUserVisited=(analyticsResponse.rows[0])[0];
                            this.analyticsService.lastMonthBounceRate(this.allApiCalls).subscribe(
                                (analyticsResponse: any) => {
                                  this.lBounceRate=Math.round((analyticsResponse.rows[0])[0]);
                                  this.analyticsService.lastMonthPageViews(this.allApiCalls).subscribe(
                                            (analyticsResponse: any) => {
                                                this.lPageViews= Math.round((analyticsResponse.rows[0])[1]/(analyticsResponse.rows[0])[0]);
                                              this.analyticsService.lastMonthAvgTimeSpent(this.allApiCalls).subscribe(
                                                        (analyticsResponse: any) => {
                                                          this.lAvgPageViews=Math.round(((analyticsResponse.rows[0])[0])/60);
                                                        })
                                            },(err)=>{
                                              this.isAlertPopup=true;
                                              this.isStartLoader=false;
                                              var errorMessage= this.errorservice.logError(err);
                                              this.alertMessage=errorMessage;
                                            })
                                },(err)=>{
                                  this.isAlertPopup=true;
                                  this.isStartLoader=false;
                                  var errorMessage= this.errorservice.logError(err);
                                  this.alertMessage=errorMessage;
                                })
                      },(err)=>{
                        this.isStartLoader=false;
                        this.isAlertPopup=true;
                        var errorMessage= this.errorservice.logError(err);
                        this.alertMessage=errorMessage;
                      })
                      this.showUserEngagementLM=true;
                }
                public lsUserVisited:Array<any>=new Array();
                public lsBounceRate:Array<any>=new Array();
                public lsPageViews:Array<any>=new Array();
                public lsAvgTimeSpent:Array<any>=new Array();
                public lastSixmonths:Array<any>=new Array();
                public lsShowUserEngagement=false;
                lastSixMonthsUserEngagementonWebsite(){
                        this.showUserEngagementLM=false;
                        this.analyticsService.lastSixMonthsNoOfUsersVisited(this.allApiCalls).subscribe(
                        (analyticsResponse: any) => {
                          
                              var monthsData=analyticsResponse.rows;
                              var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                              for(var i=0;i<6;i++){
                              this.lastSixmonths[i]=months[parseInt((monthsData[i+1])[0])-1]
                              }
                              for(var i=0;i<6;i++)
                                {
                                   this.lsUserVisited[i]=(analyticsResponse.rows[i+1])[2]
                                }
                              this.analyticsService.lastSixMonthsBounceRate(this.allApiCalls).subscribe(
                                  (analyticsResponse: any) => {
                                    for(var i=0;i<6;i++)
                                    {
                                      this.lsBounceRate[i]=Math.round((analyticsResponse.rows[i+1])[2]);
                                    }
                                    this.analyticsService.lastSixMonthsPageViews(this.allApiCalls).subscribe(
                                              (analyticsResponse: any) => {
                                                var arr=[];
                                                 for(var i=0;i<6;i++){
                                                      if((analyticsResponse.rows[i+1])[2]==0){
                                                          this.lsPageViews[i]=0;
                                                      }
                                                      else{
                                                          this.lsPageViews[i]= Math.round((analyticsResponse.rows[i+1])[3]/(analyticsResponse.rows[i+1])[2]);
                                                      }
                                                  }        
                                                this.analyticsService.lastSixMonthsAvgTimeSpent(this.allApiCalls).subscribe(
                                                          (analyticsResponse: any) => {
                                                            for(var i=0;i<6;i++)
                                                            {
                                                              this.lsAvgTimeSpent[i]=Math.round((analyticsResponse.rows[i+1])[2]/60);
                                                            }
                                                          })
                                              },(err)=>{
                                                this.isAlertPopup=true;
                                                this.isStartLoader=false;
                                                var errorMessage= this.errorservice.logError(err);
                                                this.alertMessage=errorMessage;
                                              })
                                  },(err)=>{
                                    this.isAlertPopup=true;
                                    this.isStartLoader=false;
                                    var errorMessage= this.errorservice.logError(err);
                                    this.alertMessage=errorMessage;
                                  })
                        },(err)=>{
                          this.isAlertPopup=true;
                          this.isStartLoader=false;
                          var errorMessage= this.errorservice.logError(err);
                          this.alertMessage=errorMessage;
                        })
                        this.showUserEngagementLS=true;
                }
  //user engagement on website



  //web site rank
                public indiaRank:string;
                public wordRank:string;
                websiteRank(){
                        this.analyticsService.rankService(this.allApiCalls).subscribe(
                            (analyticsResponse: any) => {
                              var indiaRank,worldRank;
                                xml2js.parseString(analyticsResponse._body, function (err, result) {
                                if(typeof result.ALEXA.SD[0].COUNTRY=="undefined")
                                  {
                                      indiaRank="No Country Rank";
                                  } else{
                                      indiaRank=result.ALEXA.SD[0].COUNTRY[0].$.RANK;
                                  }  
                                    if(typeof  result.ALEXA.SD[0].REACH[0].$.RANK=="undefined")
                                  {
                                      worldRank="No World Rank";
                                  } else{
                                      worldRank=result.ALEXA.SD[0].REACH[0].$.RANK;
                                  }  
                                });
                                    this.indiaRank=indiaRank;
                                    this.wordRank=worldRank;
                            },(err)=>{
                              this.isStartLoader=false;
                              this.isAlertPopup=true;
                              var errorMessage= this.errorservice.logError(err);
                              this.alertMessage=errorMessage;
                            })
                  }
  //web site rank

  
  //blog analytics
  showNoBlogsAvailable=false;
  getBlogsData(){
      this.publishedBlogsBarChart();
      this.blogsByTable();
      this.newsLetters();

  }
          public blogsBarChartLabels:string[] = [];
          public blogsBarChartData:any[] = [
            {data: [], label: 'Published'}
          ];
          public showBlogsBarChart=false;
          publishedBlogsBarChart(){
            this.analyticsService.publishedBlogs().subscribe(
                (blogs: any) => {
                  if(blogs.description.length==0)
                    {
                      this.showBlogsBarChart=false;
                    }
                    else{
                        for(var i=0;i<blogs.description.length;i++)
                        {
                            this.blogsBarChartLabels[i]=blogs.description[i].Month;
                            this.blogsBarChartData[0].data[i]=blogs.description[i].Count;
                        }
                        this.showBlogsBarChart=true;
                    }
                  
            },(err)=>{
              this.isAlertPopup=true;
              this.isStartLoader=false;
              var errorMessage= this.errorservice.logError(err);
              this.alertMessage=errorMessage;
            })
          }
          public publishedBlogsTable:Array<any>=[];
          public showBlogTable=false;
          blogsByTable(){
            this.analyticsService.publishedBlogsByTable().subscribe(
                (blogs: any) => {
                   if(blogs.description.length==0){
                        this.showBlogTable=false;
                      }
                      else{
                      this.publishedBlogsTable=blogs.description;
                      this.showBlogTable=true;
                      }
            },(err)=>{
              this.isAlertPopup=true;
              this.isStartLoader=false;
              var errorMessage= this.errorservice.logError(err);
              this.alertMessage=errorMessage;
            })
          
          }
            public newsLettersBarChartLabels:string[] = [];
            public newsLettersBarChartData:any[] = [
              {data: [], label: 'Emails'},
              {data: [], label: 'Count'}
            ];
            public shownewsLetter=false;
           newsLetters(){
            this.analyticsService.emailNewsLetters().subscribe(
                (newsData: any) => {
                      if(newsData.description.length==0){
                        this.shownewsLetter=false;
                      }
                      else{
                          for(var i=0;i<newsData.description.length;i++)
                          {
                            this.newsLettersBarChartLabels[i]=newsData.description[i].Month;
                            this.newsLettersBarChartData[0].data[i]=newsData.description[i].Emails;
                            this.newsLettersBarChartData[1].data[i]=newsData.description[i].Count;
                          }
                          this.shownewsLetter=true;
                      }
                        if(this.shownewsLetter||this.showBlogTable||this.showBlogsBarChart)
                        {
                            this.showNoBlogsAvailable=false;
                        }
                          else{
                            this.showNoBlogsAvailable=true;
                          }
            },(err)=>{
              this.isAlertPopup=true;
              this.isStartLoader=false;
              var errorMessage= this.errorservice.logError(err);
              this.alertMessage=errorMessage;
            })
          
          }
  //blog analytics

  
  //query analytics
  showNoQuestionsDataAvailable=false;
  showQuestionByCategory=false;
  showQuestionsCountByMonth=false;
   getQueriesData(){
          this.queriesByCategory();
          this.queriesByMonth();
    }
          public categoryQuestions:Array<any>=[];
          queriesByCategory(){
            this.analyticsService.queriesByCategory().subscribe(
                (questions: any) => {
                  if(questions.description.length==0)
                    {
                        this.showQuestionByCategory=false;
                    }
                    else{
                        this.categoryQuestions=questions.description;
                        this.showQuestionByCategory=true;
                    }    
            },(err)=>{
              this.isAlertPopup=true;
              this.isStartLoader=false;
              var errorMessage= this.errorservice.logError(err);
              this.alertMessage=errorMessage;
            })
          }
          public yearlyQuestions:Array<any>=[];
          queriesByMonth(){
            this.analyticsService.queriesByMonth().subscribe(
                (questions: any) => {
                  if(questions.description.length==0)
                    {
                        this.showQuestionsCountByMonth=false;
                    }
                    else{
                        this.yearlyQuestions=questions.description;
                        this.showQuestionsCountByMonth=true;
                    } 
              if(this.showQuestionByCategory||this.showQuestionsCountByMonth)
                {
                    this.showNoQuestionsDataAvailable=false;
                } 
                else{
                  this.showNoQuestionsDataAvailable=true;
                }
            },(err)=>{
              this.isAlertPopup=true;
              this.isStartLoader=false;
              var errorMessage= this.errorservice.logError(err);
              this.alertMessage=errorMessage;
            })

          }
  //query analytics

  //visit analytics day wise

          //day change
          public showDate=false;
          public dateChange(dateChange){
              this.isStartLoader=true;
              this.showNoDailyVisits=false;
              this.showNoMonthlyVisits=false;
              this.showNoYearlyData=false;
              this.showNoRevenueAndVistsAvailable=false;
              this.showMonthlyDrop=false;
              this.showMonthlyLineChart=false;
              this.showMonthlyBarChart=false;

              this.showYearlyDrop=false;
              this.showYearlyBarChart=false;
              this.showYearlyLineChart=false;

              this.showByRevenue=false;
              this.showByVisits=false;

              this.showDate=true;
              if(typeof dateChange=="undefined")
              {
                dateChange=new Date();
              }
              this.visitDaywiseLineChart(dateChange);
              this.visitDaywiseBarChart(dateChange);  
          }
          //day change

          public visitDailyLineChartLabels:Array<any>=new Array();
          public visitDailyLineChartData:Array<any>=new Array({data: [], label: ''});
          public showDailyLineChart=false;
          public showDailyBarChart=false;
          public showNoDailyVisits=false;
          visitDaywiseLineChart(dateChange){
                this.showDailyLineChart=false;
                        this.analyticsService.daywiseLineChart(dateChange).subscribe(
                          (visistDaywiseLineReport: any) => {
                            if(visistDaywiseLineReport.data.length==0)
                              {
                                this.showDailyLineChart=false;
                              }
                              else{
                                        var visistDaywise;
                                  visistDaywise = visistDaywiseLineReport.data;
                                  var i=0;
                                  for(var y=9;y<21;y++)
                                  {
                                      var countRequest=0;
                                      for(var x=0;x<visistDaywise.length;x=x+1){
                                      if(visistDaywise[x].hours==y){
                                          countRequest=parseInt(visistDaywise[x].count_requests);
                                      }
                                      }
                                      if(y<=12){
                                        this.visitDailyLineChartLabels[i]=y+"AM";
                                        this.visitDailyLineChartData[0].data[i]=countRequest;
                                      }
                                      else{
                                        this.visitDailyLineChartLabels[i]=y-12+"PM";
                                        this.visitDailyLineChartData[0].data[i]=countRequest;
                                      }
                                      i++;
                                  }
                                    this.showDailyLineChart=true;
                              }
                            
                          }, (err) => {
                            this.isAlertPopup=true;
                            this.isStartLoader=false;
                            var errorMessage= this.errorservice.logError(err);
                            this.alertMessage=errorMessage;
                        }, () => {
                      });
          }
                      public visitsDailyBarChartLabels:string[] = [];
                      public visitDailyBarChartData:any[] = [
                        {data: [], label: 'Accepted'},
                        {data: [], label: 'Cancelled'}
                      ];
                    visitDaywiseBarChart(dateChange){
                        this.showDailyBarChart=false;
                        this.analyticsService.daywiseBarChart(dateChange).subscribe(
                          (visistDaywiseBarReport: any) => {
                            if(visistDaywiseBarReport.data.length==0)
                              {
                                  this.showDailyBarChart=false;
                              }
                              else{
                                   var colrows = [],colObj,tmp;
                                      tmp=visistDaywiseBarReport.data;
                                      var i=0;                    
                                      for(var z=9;z<=21;z++)
                                      {
                                          var acceptCount=0;
                                          var cancelledCount=0;
                                          for(var x=0;x<tmp.length;x=x+1){
                                              var stime=tmp[x].stime;
                                              for(var k=x;(k<=x+1)&&(k<tmp.length);k++){
                                                var datecompare=tmp[k].stime==stime;
                                                
                                                if(datecompare==true){
                                              
                                                      if(tmp[k].stime==z)
                                                      {
                                                      if(tmp[k].request_status.localeCompare("accepted")==0){
                                                          acceptCount=tmp[k].request_status_count;
                                                      } 
                                                      if(tmp[k].request_status.localeCompare("canceled")==0){
                                                          cancelledCount=tmp[k].request_status_count;
                                                      }
                                                      
                                                      if(k==x+1)
                                                        x=x+1;     
                                                      }                 
                                                } 
                                              }          
                                          } 
                                          if(z<=12){
                                                this.visitsDailyBarChartLabels[i]=z+"AM";
                                                this.visitDailyBarChartData[0].data[i]=acceptCount;
                                                this.visitDailyBarChartData[1].data[i]=cancelledCount;
                                          }
                                          else{
                                                this.visitsDailyBarChartLabels[i]=z-12+"PM";
                                                this.visitDailyBarChartData[0].data[i]=acceptCount;
                                                this.visitDailyBarChartData[1].data[i]=cancelledCount;
                                          } 
                                      i++;
                                    }
                                    this.showDailyBarChart=true;
                              }
                          if(this.showDailyBarChart||this.showDailyLineChart)
                            {
                              this.showNoDailyVisits=false;
                              this.isStartLoader=false;
                            }
                            else{
                              this.showNoDailyVisits=true;
                              this.isStartLoader=false;
                            }
                                     
                        },(err)=>{
                          this.isAlertPopup=true;
                          this.isStartLoader=false;
                          var errorMessage= this.errorservice.logError(err);
                          this.alertMessage=errorMessage;
                        })
                    }
  //visit analytics day wise

  
          //visit analysismonth wise
          //month change
          public months = [
            { name: "Jan",code: "01"},{name: "Feb",code: "02"}, { name: "Mar",code: "03"},
            {name: "Apr",code: "04"},{name: "May",code: "05"},{name: "Jun",code: "06"},
            {name: "Jul",code: "07"},{name: "Aug",code: "08"}, {name: "Sep",code: "09"},
            {name: "Oct",code: "10"},{name: "Nov",code: "11"},{name: "Dec",code: "12"}
            ];
         
          public years = [
            // { name: "2010",code: "2010"},{name: "2011",code: "2011"}, { name: "2012",code: "2012"},
            // {name: "2013",code: "2013"},{name: "2014",code: "2014"},
           // {name: "2015",code: "2015"},
            {name: "2016",code: "2016"},
            {name: "2017",code: "2017"}, {name: "2018",code: "2018"},
            {name: "2019",code: "2019"},{name: "2020",code: "2020"},{name: "2021",code: "2021"}
            ];
          public showMonthlyDrop=false;
          
          public monthChanged=function(selectedMonth,selectedYear){
            this.showNoDailyVisits=false;
              this.showNoMonthlyVisits=false;
              this.showNoYearlyData=false;
              this.showNoRevenueAndVistsAvailable=false;
            var date = new Date();
            this.getmonth = ("0" + (date.getMonth() + 1)).slice(-2)
            var year=date.getFullYear();
            if(selectedMonth == undefined || selectedYear == undefined){
              selectedMonth=this.getmonth;
              selectedYear=year;
              this.defaultMon=this.getmonth;
              this.defaultYear=year;
            }
            else{
              selectedMonth=selectedMonth;
              selectedYear=selectedYear;
            }
              this.isStartLoader=true;
              this.showDate=false;
              this.showDailyLineChart=false;
              this.showDailyBarChart=false;
             
              this.showYearlyDrop=false;
              this.showYearlyBarChart=false;
              this.showYearlyLineChart=false;
             

              this.showByRevenue=false;
              this.showByVisits=false;

              this.showMonthlyDrop=true;
              this.visitMonthWiseLineChart(selectedMonth,selectedYear);
              this.visitMonthWiseBarChart(selectedMonth,selectedYear);  
          }
          //month change
          
          public visitMonthyLineChartLabels:Array<any>=new Array();
          public visitMonthlyLineChartData:Array<any>=new Array({data: [], label: ''});
          public showMonthlyLineChart=false;
          public showNoMonthlyVisits=false;
          

          
          visitMonthWiseLineChart(selectedMonth,selectedYear){
                this.showMonthlyLineChart=false;
                this.analyticsService.monthWiseLineChart(selectedMonth,selectedYear).subscribe(
                (visistMonthwiseLineChartReport: any) => {
                  if(visistMonthwiseLineChartReport.data.length==0)
                    {
                      this.showMonthlyLineChart=false;
                    }
                    else{
                        var visitLineData=visistMonthwiseLineChartReport.data;
                        for(var i=0;i<visitLineData.length;i++)
                        {
                          this.visitMonthyLineChartLabels[i]=visitLineData[i].yearweek;
                          this.visitMonthlyLineChartData[0].data[i]=visitLineData[i].count_requests;
                        }
                        this.showMonthlyLineChart=true;
                    }
                },(err)=>{
                  this.isAlertPopup=true;
                  this.isStartLoader=false;
                  var errorMessage= this.errorservice.logError(err);
                  this.alertMessage=errorMessage;
                })
          }
          public visitsMonthlyBarChartLabels:string[] = [];
          public visitMonthlyBarChartData:any[] = [
            {data: [], label: 'Accepted'},
            {data: [], label: 'Cancelled'}
            
          ];
          public showMonthlyBarChart=false;

          visitMonthWiseBarChart(selectedMonth,selectedYear){
                this.showMonthlyBarChart=false;
                var accepted_boolean=true,cancelled_boolean=true;
                this.analyticsService.monthWiseBarChart(selectedMonth,selectedYear).subscribe(
                (visistMonthwiseBarChartReport: any) => {
                  if(visistMonthwiseBarChartReport.data.length==0)
                    {
                     
                        this.showMonthlyBarChart=false;
                    }else{
                         var visitBarData=visistMonthwiseBarChartReport.data;
                        for(var i=0;i<visitBarData.length;i++)
                        {
                          this.visitsMonthlyBarChartLabels[i]=visitBarData[i].week;
                          this.visitMonthlyBarChartData[0].data[i]=visitBarData[i].accepted_count;
                          this.visitMonthlyBarChartData[1].data[i]=visitBarData[i].canceled_count;
                           if(visitBarData[i].accepted_count=="")
                          {  
                            accepted_boolean=true;
                          }
                          else{
                              accepted_boolean=false;
                          }
                          if(visitBarData[i].canceled_count=="")
                          {
                              cancelled_boolean=true;
                          }
                            else{
                                cancelled_boolean=false;
                            }
                        }
                        this.showMonthlyBarChart=true;
                    }
                      if(accepted_boolean||cancelled_boolean)
                        {
                          this.showMonthlyBarChart=false;
                          this.showNoMonthlyVisits=true;
                          this.isStartLoader=false;
                        }
                        else{
                          this.showMonthlyBarChart=true;
                          this.showNoMonthlyVisits=false;
                          this.isStartLoader=false;
                        }
                       
                },(err)=>{
                  this.isAlertPopup=true;
                  this.isStartLoader=false;
                  var errorMessage= this.errorservice.logError(err);
                  this.alertMessage=errorMessage;
                })
          }
          
//visit analysismonth wise


 //visit analytics year wise
          //year change
         
            public showYearlyDrop=false;
            public yearChanged(selectYear){
              this.showNoDailyVisits=false;
              this.showNoMonthlyVisits=false;
              this.showNoYearlyData=false;
              this.showNoRevenueAndVistsAvailable=false;
              var date = new Date();
              var year=date.getFullYear();
              this.curentYear=year;
              if(selectYear == undefined){
                selectYear=year;
              }
              this.isStartLoader=true;
              this.showDate=false;
              this.showDailyLineChart=false;
              this.showDailyBarChart=false;

              this.showMonthlyDrop=false;
              this.showMonthlyLineChart=false;
              this.showMonthlyBarChart=false;

              this.showByRevenue=false;
              this.showByVisits=false;

              this.showYearlyDrop=true;
              this.visitYearwiseLineChart(selectYear);
              this.visitYearwiseBarChart(selectYear);
            }
            //year change
            public visitYearlyLineChartLabels:Array<any>=new Array();
            public visitYearlyLineChartData:Array<any>=new Array({data: [], label: ''});
            public showYearlyLineChart=false;
            public showNoYearlyData=false;
            
            visitYearwiseLineChart(selectedYear){
                          this.showYearlyLineChart=false;
                          this.analyticsService.yearWiseLineChart(selectedYear).subscribe(
                            (visistYearwiseLineReport: any) => {

                              if(visistYearwiseLineReport.data.length==0)
                                {
                                  this.showYearlyLineChart=false;
                                }
                                else{
                                      var visistYearwise=[],month;
                                      visistYearwise=visistYearwiseLineReport.data;
                                      for(var x=0;x<12;x=x+1){
                                          
                                          if(x==0){month="Jan"}if(x==1){month="Feb"}if(x==2){month="Mar"}if(x==3){month="Apr"}
                                          if(x==4){month="May"}if(x==5){month="Jun"}if(x==6){month="Jul"}if(x==7){month="Aug"}
                                          if(x==8){month="Sep"}if(x==9){month="Oct"}if(x==10){month="Nov"}if(x==11){month="Dec"}
                                          for(var j=0;j<visistYearwise.length;j++)
                                          {
                                              if(typeof visistYearwise[j].sdate !="undefined" && parseInt(visistYearwise[j].sdate)==(x+1))
                                              {
                                                  this.visitYearlyLineChartLabels[x]=month;
                                                  this.visitYearlyLineChartData[0].data[x]=visistYearwise[j].monthly_count;
                                                  break;
                                              }
                                              else{
                                                  this.visitYearlyLineChartLabels[x]=month;
                                                  this.visitYearlyLineChartData[0].data[x]=0;
                                              }
                                          }
                                          
                                      }   
                                      this.showYearlyLineChart=true;
                                }
                            
                            }, (err) => {
                              this.isAlertPopup=true;
                              this.isStartLoader=false;
                              var errorMessage= this.errorservice.logError(err);
                              this.alertMessage=errorMessage;
                          }, () => {
                        });
            }
            public visitsYearlyBarChartLabels:string[] = [];
            public visitYearlyBarChartData:any[] = [
              {data: [], label: 'Accepted'},
              {data: [], label: 'Cancelled'}
            ];
            public showYearlyBarChart=false;

            visitYearwiseBarChart(selectedYear){
              var accepted_boolean=true,cancelled_boolean=true;
                this.showYearlyBarChart=false;
                this.analyticsService.yearWiseBarChart(selectedYear).subscribe(
                  (visistYearwiseBarReport: any) => {
                    var month,colObj,visistYearwise;
                    visistYearwise=visistYearwiseBarReport.data;
                    for(var x=0;x<12;x++){
                        var acceptCount=0,cancelledCount=0;
                      for(var j=0;j<visistYearwise.length;j++){
                        if(x==0){month="Jan"}if(x==1){month="Feb"}if(x==2){month="Mar"}if(x==3){month="Apr"}
                        if(x==4){month="May"}if(x==5){month="Jun"}if(x==6){month="Jul"}if(x==7){month="Aug"}
                        if(x==8){month="Sep"}if(x==9){month="Oct"}if(x==10){month="Nov"}if(x==11){month="Dec"} 
                             if(visistYearwise[j].request_status_accept_count=="")
                              {  
                                accepted_boolean=true;
                              }
                              else{
                                  accepted_boolean=false;
                              }
                              if(visistYearwise[j].request_status_cancel_count=="")
                              {
                                  cancelled_boolean=true;
                              }
                                else{
                                    cancelled_boolean=false;
                                }
                          if(parseInt(visistYearwise[j].sdate)==x+1){
                                this.visitsYearlyBarChartLabels[x]=month;
                                this.visitYearlyBarChartData[0].data[x]=visistYearwise[j].request_status_accept_count;
                                this.visitYearlyBarChartData[1].data[x]=visistYearwise[j].request_status_cancel_count;
                                break;
                          }
                          else{
                                this.visitsYearlyBarChartLabels[x]=month;
                                this.visitYearlyBarChartData[0].data[x]=0;
                                this.visitYearlyBarChartData[1].data[x]=0;
                          }
                      }
                    }
                    if(accepted_boolean||cancelled_boolean)
                      {
                          this.showYearlyBarChart=false;
                      }
                        else{
                           this.showYearlyBarChart=true;
                        }
                          if(this.showYearlyLineChart||this.showYearlyBarChart)
                            {
                              this.isStartLoader=false;
                              this.showNoYearlyData=false;
                            }
                            else{
                              this.isStartLoader=false;
                              this.showNoYearlyData=true;
                            }          
                })
            }
          //visit analytics year wise
          
          //doctor wise revenue and visits chart
              public revenueChanged(){
                  this.showNoDailyVisits=false;
                  this.showNoMonthlyVisits=false;
                  this.showNoYearlyData=false;
                  this.showNoRevenueAndVistsAvailable=false;
                  this.showDate=false;
                  this.showDailyLineChart=false;
                  this.showDailyBarChart=false;

                  this.showMonthlyDrop=false;
                  this.showMonthlyLineChart=false;
                  this.showMonthlyBarChart=false;

                  this.showYearlyDrop=false;
                  this.showYearlyBarChart=false;
                  this.showYearlyLineChart=false;

                  this.doctorWiseRevenue();
                  this.doctorWiseVisits();

              }
              public doctorWiseRevenueLabels:string[] = [];
              public doctorWiseRevenueData:number[]=[];
              public doughnutChartType:string = 'doughnut';
              public showByRevenue=false;
              public doctorWiseRevenueDataForTable:any=[];
              public doctorWiseVisitsDataForTable:any=[];
              public showNoRevenueAndVistsAvailable=false;
              doctorWiseRevenue(){
                    this.showByRevenue=false;
                    this.analyticsService.doctorWiseRevenue().subscribe(
                    (doctorWiseRevenue: any) => {
                      if(doctorWiseRevenue.count.length==0)
                        {
                          this.showByRevenue=false;
                        }
                        else{
                            this.doctorWiseRevenueDataForTable=doctorWiseRevenue.count;
                            var doctorWiseRevenue=doctorWiseRevenue.count;
                            for(var i=0;i<doctorWiseRevenue.length;i++)
                            {
                              this.doctorWiseRevenueLabels[i]=doctorWiseRevenue[i].name;
                              this.doctorWiseRevenueData[i]=doctorWiseRevenue[i].total_amount;
                            }
                            this.showByRevenue=true;
                        }
                      
                    },(err)=>{
                      this.isAlertPopup=true;
                      this.isStartLoader=false;
                      var errorMessage= this.errorservice.logError(err);
                      this.alertMessage=errorMessage;
                    })
              }
              public doctorWiseVisitsLabels:string[] = [];
              public doctorWiseVisitsData:number[]=[];
              public showByVisits=false;
         
              doctorWiseVisits(){
                    this.showByVisits=false;
                    this.analyticsService.doctorWiseVisits().subscribe(
                    (doctorWiseVisits: any) => {
                      if(doctorWiseVisits.count.length==0)
                        {
                          this.showByVisits=false;
                        }
                        else{
                            this.doctorWiseVisitsDataForTable=doctorWiseVisits.count;
                            var doctorWiseVisits=doctorWiseVisits.count;
                            for(var i=0;i<doctorWiseVisits.length;i++)
                            {
                              this.doctorWiseVisitsLabels[i]=doctorWiseVisits[i].name;
                              this.doctorWiseVisitsData[i]=doctorWiseVisits[i].total_visits;
                            }
                            this.showByVisits=true;
                        }
                          if(this.showByRevenue||this.showByVisits)
                            {
                              this.showNoRevenueAndVistsAvailable=false;
                            }
                            else{
                              this.showNoRevenueAndVistsAvailable=true;
                            }
                     
                    },(err)=>{
                      this.isAlertPopup=true;
                      this.isStartLoader=false;
                      var errorMessage= this.errorservice.logError(err);
                      this.alertMessage=errorMessage;
                    })
              }
          //doctor wise revenue and visits chart
  //visit analytics


 

}
