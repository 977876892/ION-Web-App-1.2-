import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../shared/services/search/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [SearchService],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isSearchPopup: boolean = false;
  isStartLoader: boolean = false;
  isNoResult:boolean=false;
  isShowHeader=false;
  searchResposne:any=[];
  todayDate=new Date().getDate();

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
    console.log(localStorage.getItem('user')==null);
    
    if(localStorage.getItem('user')=='' ||localStorage.getItem('user')==null){
    }
    else{
      this.isShowHeader=true;
    }
  }
  logout() {
    localStorage.setItem('user', '');
    localStorage.setItem('blogs','');
    localStorage.setItem('queries', '');
    this.router.navigate(['login']);

  }
 
  get user(): any {
    if(localStorage.getItem('user')!='')
    return JSON.parse(localStorage.getItem('user'));
}
searchtext="";  
searchCall(searchtext) {
  this.isSearchPopup = true;
  console.log(searchtext);
  if(typeof searchtext!="undefined" && searchtext.length>4)
    {
      this.isStartLoader = true;
      this.searchService.getSearchAllService(searchtext).subscribe(
          (searchTextResponse: any) => {
              console.log(searchTextResponse);
              this.searchResposne=searchTextResponse.description;
              this.isStartLoader=false;
              this.isNoResult=false;
              if(this.searchResposne.length == 0){
                this.isNoResult=true;
              }
          }, (err) => {
            this.isStartLoader = false;
          }, () => {
            this.isStartLoader = false;

          });
    }
        else{
          this.searchResposne=[];
        }
  
}
}
