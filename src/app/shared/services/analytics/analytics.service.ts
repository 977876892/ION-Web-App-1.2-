import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { API } from '../../api/api.urls';
import 'rxjs/add/operator/map';
//import { Storage } from '../../../shared/storage/storage';

@Injectable()
export class AnalyticsService {

  constructor(private http: Http) { }
    //get all analytics api calls
    
    getAnalytics(){
         const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
        return this.http.get(API.GET_ANALYTICS(currentuser.analyticId)).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    };
    getEstimatedDailyVisits(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[1].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    };
    getEstimatedMonthlyVisits(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[0].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastThreeMonthsAandG(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[8].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastSixMonthsAandG(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[9].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    socilaTrafficLTM(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[2].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    socilaTrafficLSM(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[3].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    topPagesLM(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[5].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    topPagesLTM(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[4].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
     keywordsLM(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[7].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    keywordsLTM(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[6].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
     WebsiteTraffic(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[20].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastMonthNoOfUsersVisited(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[12].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastMonthBounceRate(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[16].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastMonthPageViews(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[10].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastMonthAvgTimeSpent(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[18].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastSixMonthsNoOfUsersVisited(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[13].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastSixMonthsBounceRate(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[17].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastSixMonthsPageViews(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[11].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    lastSixMonthsAvgTimeSpent(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[19].value).map(
            (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            }   
        )
    }
    rankService(allApis){
             return this.http.get("http://dashboard.getion.in/reports/myproxy.php?"+allApis[21].value).map(
            (responseData) =>{
                   // const key = '_body';
                    return responseData;
            }   
        )
    }

         daywiseLineChart(date){
            var fetchdate=new Date(date);
            var day = fetchdate.getDate();
            var month = fetchdate.getMonth()+1;
            var year = fetchdate.getFullYear();  
            var datestr =  year+'-'+month+"-"+day;
            const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            return this.http.get(API.GET_DAY_LINE(datestr, currentuser.username,currentuser.pwd)).map(
             (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })
        }
        daywiseBarChart(date){
            var fetchdate=new Date(date);
            var day = fetchdate.getDate();
            var month = fetchdate.getMonth()+1;
            var year = fetchdate.getFullYear();  
            var datestr =  year+'-'+month+"-"+day;
            const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            return this.http.get(API.GET_DAY_BAR(datestr,currentuser.username,currentuser.pwd)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
        monthWiseLineChart(selectedMonth,selectedYear){
            const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            return this.http.get(API.GET_MONTH_LINE(selectedMonth,selectedYear,currentuser.username,currentuser.pwd)).map(
             (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })
        }
        monthWiseBarChart(selectedMonth,selectedYear){
             const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            return this.http.get(API.GET_MONTH_BAR(selectedYear,selectedMonth,currentuser.username,currentuser.pwd)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
        yearWiseLineChart(selectedYear){
             const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            return this.http.get(API.GET_YEAR_LINE(selectedYear,currentuser.username,currentuser.pwd)).map(
             (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })
        }
        yearWiseBarChart(selectedYear){
             const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            return this.http.get(API.GET_YEAR_BAR(selectedYear,currentuser.username,currentuser.pwd)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
        
         doctorWiseRevenue(){
            const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            return this.http.get(API.GET_REVENUE(currentuser.teamid)).map(
             (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })
        }
        doctorWiseVisits(){
             const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            return this.http.get(API.GET_DCOTOR_VISITS_LIST(currentuser.teamid)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
    //visit analytics apis

    //query analytics 
        queriesByCategory(){
             const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
             return this.http.get(API.GET_QUERIES_CATEGORY(currentuser.teamid)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
        queriesByMonth(){
             const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
             return this.http.get(API.GET_QUERIES_LAST_YEAR(currentuser.teamid)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
    //query analytics

    //blog Analytics
        publishedBlogs(){
            const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
             return this.http.get(API.GET_BLOGS_LIST_CATEGORY(currentuser.publishid)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
         publishedBlogsByTable(){
             const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
             return this.http.get(API.GET_BLOGS_LIST(currentuser.teamid)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
        emailNewsLetters(){
            const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
             return this.http.get(API.GET_EMAIL_NEWS_LETTER(currentuser.teamid)).map(
                (responseData) =>{
                    const key = '_body';
                    return JSON.parse(responseData[key]);
            })  
        }
    //blog Analytics
}
