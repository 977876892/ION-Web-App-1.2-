import { Component, OnInit,ViewChild,Input, HostListener } from '@angular/core';
@Component({
  selector: 'app-publish',
  templateUrl: './youtube.component.html',
})
export class YoutubeComponent implements OnInit {
     @ViewChild('videoId') videoId;
    
     link:string;
     ngOnInit() {
    
    if (localStorage.getItem('user') =='' || localStorage.getItem('user')==null) {
      //this.router.navigate(['login']);
    } else {
          
    }}
    constructor() {}  
    onUploaded() {
        this.link="https://www.youtube.com/watch?v="+this.videoId.nativeElement.textContent;
    }
    
}