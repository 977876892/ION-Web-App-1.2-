import { Component, OnInit,ViewChild,Input, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { PublishService } from '../shared/services/publish/publish.service';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import * as CryptoJS from 'crypto-js';
import {DomSanitizer} from '@angular/platform-browser';
declare var require: any;
import { IonServer } from '../shared/globals/global';
declare var $: any;

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  providers: [PublishService, AuthserviceService],
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
  format = require('date-fns/format');
  topicsDate=new Date();
  today=new Date();
  stopDates=this.today.getFullYear()+"-"+(this.today.getMonth()+1)+"-"+this.today.getDate();
  isStartLoader;
  isPageStartLoader;
  publishedData: any = [];
  pstatus: any = 1;
  publishType: any = 'publish';
  blogViewData: any;
  isBlogDraft: boolean = false;
  isIonizedBlog: boolean = false;
  showRequestIsTaken: boolean = false;
  imageerrorAlert:boolean=false;
  isPublishedBlog=false;
  blogCommentsData: any = [];
  calendarEventsData: any = [];
  trendingTopicsData: any = [];
  comment:string="";
  loginUserId: number;
  isCalendarView: boolean = false;
  isClosingConformationAlertPopup:boolean=false;
  public calendarOptions: Options;
  blogTitle="";
  offsetTop:string = "";
  offsetLeft:string = "";
  blogCategory:number;
  isTopicSelected=true;
  blogTags:any=[];
  blogStatus:any;
  selectedTopicId:any="";
  spaceComment=IonServer.Space_Not_required;  
  monthsList=['January','February','March','April','May','June','July','Auguest','September','October','November','December'];
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  displayEvent: any;
  isAddNewTopic: boolean = false;
  isAddNewTopicButton: boolean = true;
  draftCurrentClass = 'save';
  publishCurrentClass = 'save';
  isPublishComments: boolean = true;
  draftCategeory = 'blog';
  isBlogComments: boolean = true;
  publishCategeory = 'blog';
  isAlertPopup: boolean = false;
  alertMessage: string = '';
  isContentBlock: string = '';
  selectedTrendTopics: any = [];
  isMouseOverDiv: boolean = false;
  isClickOnEdit: boolean = false;
  isTrendingTopicsList: boolean = false;
  isCreateBlog:boolean=false;
  isOpenEditor:boolean=false;
  isScrolled: boolean = false;
  isNoRecords: boolean = false;
  startsFrom: number = 0;
  endTo: number = 20;
  totalrecordLength = 0;
  currentRecordCount = 0;
  blogCount;
  imageSrc: any = [];
  isPublishNow: boolean = false;
  publishIsA: string = 'blog';
  isIonizeNow: boolean = false;
  imageUploadAlert: boolean = false;
  imgerror="Choose Only Image.";
  imgsize="The file size can not exceed 8MB.";
  currentLoginUser="";
   @ViewChild('filePublishInput') filePublishInput;
   autoComplete=[];
   public editorImageoptions:Object;
  @ViewChild('editcontainer') editcontainer;
  @ViewChild('fileInput') fileInput;
  coverImages:any=[];
  newTrendTopicForm: FormGroup = this.builder.group({
    title: new FormControl(''),
    tag: new FormControl('') 
  });
  formEditor: FormGroup = this.builder.group({
    formModel: new FormControl('')
  });
  createAndUpdateTheBlogForm: FormGroup = this.builder.group({
    title: new FormControl(''),
    content:new FormControl(''),
    type:new FormControl(''),
    image:new FormControl(''),
    topicId:new FormControl(''),
    status:new FormControl(''),
    postid:new FormControl(''),
    createdDate:new FormControl(''),
    createdTime:new FormControl('')
  });
  objectKeys = Object.keys;
  showNoBlogsAvailable=false;
  
  constructor(private router: Router,
    private publishService: PublishService,
    private authService: AuthserviceService,
    private route: ActivatedRoute, private builder: FormBuilder,private santizer:DomSanitizer) {
      document.addEventListener('click', this.offClickHandler.bind(this));
     }
    public options: Object = {
      charCounterCount: true,
      toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    };
    offClickHandler(event: any) {
      if (this.editcontainer && !this.editcontainer.nativeElement.contains(event.target)) {
         this.publishedData.forEach((eachData) => {
          eachData.isClickOnEdit = false;
        });
      }
    }
  ngOnInit() {
    if (localStorage.getItem('user') =='' || localStorage.getItem('user')==null) {
      this.router.navigate(['login']);
    } else {
      this.getAllTopicsForNewBlog();
      this.getCategories();
      this.getBlogTypes();
      this.route.params.forEach((params: Params) => {
        if (params.isnewpost !== '' && params.isnewpost !== undefined) {
          if(params.isnewpost == 'selecttopic') {
            this.isCalendarView = false;
            this.pstatus = 5;
            this.publishType = 'publish';
            this.getPublishedBlogs(0,20);
            this.startNewBlogWithTopic();
          }else if(params.isnewpost == 'newpost') {
            this.isCalendarView = false;
            this.pstatus = 5;
            this.publishType = 'publish';
            this.getPublishedBlogs(0,20);
            this.startNewBogWithOutTopic();
          }
        }
      });
      this.currentLoginUser=localStorage? JSON.parse(localStorage.getItem('user')) : 0;
      console.log(this.currentLoginUser);
      this.blogCount=localStorage? JSON.parse(localStorage.getItem('blogs')) : 0;
      if(this.router.url == '/publish/calendar') {
        this.blogCalendarCall();
        //this.getCategories();
      } else if(this.router.url == '/publish/online') {
        this.publishedData = [];
        this.pstatus = 1;
        this.publishType = 'online';
        this.totalrecordLength = this.blogCount.online;
        this.getPublishedBlogs(0,20);
      } else if(this.router.url == '/publish/drafts') {
        this.publishedData = [];
        this.pstatus = 3;
        this.publishType = 'draft';
        this.getPublishedBlogs(0,20);
        this.totalrecordLength = this.blogCount.draft;
      } else {
        this.publishedData = [];
        this.pstatus = 5;
        this.publishType = 'publish';
        this.getPublishedBlogs(0,20);
        this.totalrecordLength = this.blogCount.publish;
      }
      var currentuser=localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      //video upload to s3 options
       var date = new Date();
        date.setDate(date.getDate() + 1);
        var str_date = date.toISOString();
        var s3Policy = {
                'expiration': str_date,
                'conditions': [
                    {'bucket': 'sairamtest'},
                    {'acl': 'public-read'},
                    {'success_action_status': '201'},
                    {'x-requested-with': 'xhr'},
                    ['starts-with', '$key', ''], //last parameter is keyStart. One can mention the folder name here
                    ['starts-with', '$Content-Type', ''] //Can mention what type of files to accept
                ]
            };
        var stringifyPolicy = JSON.stringify(s3Policy),
        policy = window.btoa(stringifyPolicy);
        var hash = CryptoJS.HmacSHA1(policy, "L2YR1fuJHxAByS7eQNUYeDClGr6y3PMCfNxTVIo5"),
        base64 = CryptoJS.enc.Base64.stringify(hash);
        //video upload to s3 options
this.editorImageoptions = {
                
                charCounterCount: true,
                key: 'YC-9A-8nrssD5vn==',
                toolbarButtons: ['fullscreen', 'undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'formatOL', 'formatUL', 'align', 'outdent', 'indent', 'quote', '-', 'paragraphFormat', 'fontFamily', 'fontSize', 'color', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', '|', 'spellChecker'],
                // Set the image upload parameter.
                //imageUploadParam: 'image_param',
        
                // Set the image upload URL.
                imageUploadURL: 'http://staging.getion.in/index.php/request?action=post&module=user&resource=upload',
        
                // Additional upload params.
                imageUploadParams: {userid: currentuser.id,username: currentuser.username,
                password:currentuser.pwd,encode:true,auth_key:currentuser.auth,link:1},
                // Set request type.
                imageUploadMethod: 'POST',
                // Set max image size to 5MB.
                imageMaxSize: 2 * 1024 * 1024,
        
                // Allow to upload PNG and JPG.
                imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                // Set a preloader.
                //imageManagerPreloader: "/images/loader.gif",
        
                // Set page size.
                imageManagerPageSize: 20,
        
                // Set a scroll offset (value in pixels).
                imageManagerScrollOffset: 10,
        
                // Set the load images request URL.
                imageManagerLoadURL: "",
        
                // Set the load images request type.
                imageManagerLoadMethod: "",
        
                // Additional load params.
                imageManagerLoadParams: {user_id: ''},
        
                // Set the delete image request URL.
                imageManagerDeleteURL: "",
        
                // Set the delete image request type.
                imageManagerDeleteMethod: "",
        
                // Additional delete params.
                imageManagerDeleteParams: {param: ''},
                videoUploadToS3: {
                        bucket: 'sairamtest',
                        // Your bucket region.
                        region: 's3',
                        keyStart: '',
                        params: {
                          acl: 'public-read', // ACL according to Amazon Documentation.
                          AWSAccessKeyId: 'AKIAJCPS7FEJDBMXTWOQ', // Access Key from Amazon.
                          policy: policy, // Policy string computed in the backend.
                          signature: base64, // Signature computed in the backend.
                        }
                      },

                //   // Set the video upload parameter.
                //   videoUploadParam: 'video_param',
        
                //   // Set the video upload URL.
                //   videoUploadURL: 'https://www.youtube.com/playlist?list=PLwoMh-3WF6NeuAFwHFubUvaBhmKM9DpZg',
        
                //   // Additional upload params.
                //   videoUploadParams: {'data-clientid': '347188050879-8u1evqsjqhj5pld7dhum47qcad3372oh.apps.googleusercontent.com'},
        
                //   // Set request type.
                //   videoUploadMethod: 'POST',
        
                //   // Set max video size to 50MB.
                //   videoMaxSize: 50 * 1024 * 1024,
        
                // // Allow to upload MP4, WEBM and OGG
                //     videoAllowedTypes: ['webm', 'jpg', 'ogg','MP4'],
                 events : {
                      'froalaEditor.image.error': function (e, editor, error, response) {
                        // Bad link.
                        if (error.code == 1) { 
                           console.log(1);
                         }
                         
                        // No link in upload response.
                        else if (error.code == 2) { 
                           console.log(2);
                         }
                
                        // Error during image upload.
                        else if (error.code == 3) { 
                           console.log(3);
                         }
                
                        // Parsing response failed.
                        else if (error.code == 4) { 
                          console.log(4);
                         }
                
                        // Image too text-large.
                        else if (error.code == 5) { 
                          alert("we are allowed only max 8 mb file");
                         }
                
                        // Invalid image type.
                        else if (error.code == 6) { 
                          console.log(6);
                         }
                
                        // Image can be uploaded only to same domain in IE 8 and IE 9.
                        else if (error.code == 7) { 
                          console.log(7);
                         }
                
                        // Response contains the original server response to the request if available.
                      },
                      'froalaEditor.video.inserted': function (e, editor, $video) {
                              var videoSource = $video.contents().get(0).src;
                              console.log($video.contents());
                              //$video.html('<video src="'+videoSource+'" style="width: 600px;" controls="" class="fr-draggable">Your browser does not support HTML5 video.</video>');
                              $video.html('<iframe width="640" height="360" src="'+videoSource+'" frameborder="0" allowfullscreen=""></iframe>');
                          }
                }
              };        
    } 
  }

  windowBottom:any="";
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (!this.isScrolled && !this.isNoRecords) {
      let status = "not reached";
      let windowHeight = "innerHeight" in window ? window.innerHeight
        : document.documentElement.offsetHeight;
      let body = document.body, html = document.documentElement;
      let docHeight = Math.max(body.scrollHeight,
        body.offsetHeight, html.clientHeight,
        html.scrollHeight, html.offsetHeight);
      let windowBottom = windowHeight + window.pageYOffset;
      if (Math.ceil(windowBottom) >= docHeight) {
        status = 'bottom reached!';
        console.log(this.totalrecordLength +">"+ this.currentRecordCount);
        if (this.totalrecordLength > this.currentRecordCount) {
          this.startsFrom = this.startsFrom + 20;
          this.endTo = this.endTo + 20;
          this.isPageStartLoader = true;
          this.getPublishedBlogs(this.startsFrom, this.endTo);
        }
      }
      //  console.log(windowHeight);
      //  console.log(window.pageYOffset);
      // this.windowBottom=(windowHeight + window.pageYOffset)-880;
       //console.log(windowHeight + window.pageYOffset);
       if(!this.isEditorForEditThePublish && !this.isEditorForEditTheDraft && !this.isEditorForEditTheOnline && !this.isBlogDraft && !this.isIonizedBlog && !this.isPublishedBlog && !this.isIonizeNow && !this.isPublishNow)
             {
               //this.windowBottom=(windowHeight + window.pageYOffset)-650;
               this.windowBottom= window.pageYOffset;
             }
       else{
          //this.windowBottom=(windowHeight + window.pageYOffset)-700;
       }
    }
  };
  uploadTextEditor() {
    console.log(this.formEditor.value);
  }
  // upload image
uploadCoverImage() {
  console.log("upload");
   this.isPageStartLoader=false;
  const fileBrowser = this.fileInput.nativeElement;
  console.log(fileBrowser.files.length);

  // fileBrowser.files.FileList.forEach(file=>{
  //     console.log(file);
  // })
  if (fileBrowser.files && fileBrowser.files[0]) {
  if(fileBrowser.files[0].size/1024/1024 > 9) {

    //  this.isStartLoader = true;
    // this.imageSrc = "";
    this.imageUploadAlert = true;
    this.fileInput.nativeElement.value = '';
    return false;
  }
  this.isStartLoader = true;
  this.imageerrorAlert=false;
  this.imageUploadAlert = false;
  // if (fileBrowser.files && fileBrowser.files[0]) {
   // console.log(fileBrowser.files[0]);
    const fd = new FormData();
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    for(var key=0;key<fileBrowser.files.length;key++)
     {
        if(key==0)
          fd.append('file', fileBrowser.files[key]);
       else{
         fd.append('file'+key, fileBrowser.files[key]);
       }

     }

    //fd.append('file', fileBrowser.files[0]);
    fd.append('userid', currentuser.id);
    fd.append('username', currentuser.username);
    fd.append('password', currentuser.pwd);
    fd.append('encode', 'true');
    fd.append('auth_key', currentuser.auth);

    this.authService.uploadImageService(fd).subscribe(res => {
      // do stuff w/my uploaded file
      console.log(res);
      if(res.description==undefined){
        this.imageUploadAlert = false;
        this.imageerrorAlert=true;
      }else{
        res.description.forEach(image=>{
          this.coverImages.push(image.url);
        })
        //this.coverImages.push(res.description[0].url);
        if(this.isOpenEditor && this.coverImages.length>1)
          {
            this.draftCurrentClass='ionize';
          }
        this.createAndUpdateTheBlogForm.patchValue({
          image:res.description[0].url
        })
        this.isStartLoader = false;
      }
    },(err) => {

     }, () => {
      this.fileInput.nativeElement.value = '';
      this.isStartLoader = false;
    });
  }
}
// Getting All published blogs list
getPublishedBlogs(startfrom, limitto) {
  this.isPageStartLoader = true;
  this.showNoBlogsAvailable=false;
  this.publishService.getAllPublishMessages(this.pstatus, startfrom, limitto).subscribe(
    (publishResponse: any) => {
      console.log(publishResponse);
      this.publishedData = publishResponse.data;
      if(this.publishedData.length==0)
        {
          this.showNoBlogsAvailable=true;
        }
    }, (err) => {
      this.isScrolled = false;
      this.isNoRecords = true;
      this.isPageStartLoader = false;
    }, () => {
      this.isScrolled = false;
      this.isPageStartLoader = false;
      this.currentRecordCount = this.publishedData.length;
      this.publishedData.forEach((eachData) => {
        eachData.isMouseOverDiv = false;
        eachData.isClickOnEdit = false;
      });
    });
}
// mouse enter event
onMouseEnterToDiv(indx) {
  if(this.publishedData[indx].isMouseOverDiv) {
    this.publishedData[indx].isMouseOverDiv = false;
  }else {
   this.publishedData[indx].isMouseOverDiv = true;
  }
}

clickedOnDottedLine(indx) {
  if(this.publishedData[indx].isClickOnEdit) {
    this.publishedData[indx].isClickOnEdit = false;
  }else {
   this.publishedData[indx].isClickOnEdit = true;
  }
}

// Get Blog Detail view call

getBlogDetailView(bid, viewType) {
  this.isPageStartLoader = true;
console.log("popup name is - isIonizedBlog");
  this.publishService.getBlogDetailViewService(bid).subscribe(
    (blogResponse: any) => {
      if(this.blogTypes.length>0)
      {
        this.blogTypes.forEach(category=>{
          console.log(category.id);
          console.log(blogResponse.category.categoryid);
          console.log(category.id==blogResponse.category.categoryid);
          if(category.id==blogResponse.category.categoryid)
            {
                  category.selected=true;
            }
            else{
                  category.selected=false;
            }
        })
      }
       this.blogViewData = blogResponse;
       console.log(this.blogViewData);
      if(this.blogViewData.publish_up=='0000-00-00 00:00:00')
        {
            this.createdDate=''
            this.createdTime=''
        }
          else{
            this.createdDate=this.blogViewData.publish_up;
            this.createdTime=this.blogViewData.publish_up;
            this.dateChange(this.createdDate);
            this.timeChange(this.createdDate);
          }


       if(blogResponse.tags.length!=0)
          {
            blogResponse.tags.forEach(tag=>{
                this.blogTags.push(tag.title);
            })
          }
       this.blogViewData.text=this.santizer.bypassSecurityTrustHtml(this.blogViewData.text);
       if(viewType == 'draft') {
          this.isIonizedBlog = false;
          this.isBlogDraft = true;
          this.isPublishedBlog=false;
        } else
        if(viewType == 'publish') {
          this.isBlogDraft = false;
          this.isIonizedBlog = true;
          this.isPublishedBlog=false;
        } else {
          this.isPublishedBlog=true;
           this.isBlogDraft = false;
          this.isIonizedBlog = false;
        }
    }, (err) => {

    }, () => {
      this.isPageStartLoader = false;
      this.getBlogComments(bid);
    });
}
// get blog comments call
getBlogComments(bid) {
  this.blogCommentsData=[];
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  this.loginUserId = currentuser.id;
  this.isStartLoader = true;
  this.publishService.getBlogCommentsService(bid).subscribe(
    (blogResponse: any) => {
      console.log(blogResponse);
      this.blogCommentsData = blogResponse.description;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
    });
}
// add blog comment call
showCommentError=false;
addBlogComment(bid, comment) {
  var comment=comment.trim();

  if(typeof comment=="undefined")
    {
      comment="";
    }
  if(this.imageSrc.length>0)
    {
      this.imageSrc.forEach((image,index)=>{
              comment=comment+'<img src="'+image+'"/>';
      })
    }
  console.log(comment);
  console.log(bid);
  if(comment!="")
    {
        this.isLoaderForUpdateBlog = true;
        this.publishService.addBlogCommentsService(bid, comment).subscribe(
          (blogResponse: any) => {
            console.log(blogResponse);
            this.blogCommentsData = blogResponse.data;
            this.getBlogComments(bid);
            this.imageSrc=[];
          }, (err) => {

          }, () => {
            this.isLoaderForUpdateBlog = false;
          });
    }
        else{
          this.showCommentError=true;
        }

}
// publish Calendar
blogCalendarCall() {
 
  this.isCalendarView = true;
   var str_month=''
  this.dateStore=new Date();
  var month=this.dateStore.getMonth()+1;
  var year=this.dateStore.getFullYear();
  this.showDisplayMonthAndYear=this.monthsList[month-1] +" "+year;
  if (month < 10)
    {
          str_month = '0' + month;
          this.getBlogCountInCalendar(year+"-"+str_month);
          this.getCalendarEventsByMonth(str_month+"/"+year,year+"-"+month);
    }
  else{
          this.getBlogCountInCalendar(year+"-"+month);
          this.getCalendarEventsByMonth(month+"/"+year,year+"-"+month);
  }


}
// get calendat=r events by month call
dateStore:Date=new Date();
prevMonth(){
   PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showIonized=false;
   var str_month=''
  this.dateStore.setMonth(this.dateStore.getMonth() - 1);
  var month=this.dateStore.getMonth()+1;
  console.log(month);
  var year=this.dateStore.getFullYear();
  this.showDisplayMonthAndYear=this.monthsList[month-1] +" "+year;
  if (month < 10)
    {
          str_month = '0' + month;
          this.getBlogCountInCalendar(year+"-"+str_month);
          this.getCalendarEventsByMonth(str_month+"/"+year,year+"-"+month);
    }
  else{
          this.getBlogCountInCalendar(year+"-"+month);
          this.getCalendarEventsByMonth(month+"/"+year,year+"-"+month);
  }
}
showDisplayMonthAndYear="";
nextMonth(){
   PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showIonized=false;
  this.dateStore.setMonth(this.dateStore.getMonth() + 1);
  var month=this.dateStore.getMonth()+1;
  var year=this.dateStore.getFullYear();
   var str_month='';
  this.showDisplayMonthAndYear=this.monthsList[month-1] +" "+year;
  console.log(month < 10);
  if (month < 10)
    {
          str_month = '0' + month;
          this.getBlogCountInCalendar(year+"-"+str_month);
          this.getCalendarEventsByMonth(str_month+"/"+year,year+"-"+month);
    }
  else{
          this.getBlogCountInCalendar(year+"-"+month);
          this.getCalendarEventsByMonth(month+"/"+year,year+"-"+month);
  }

}

showCalendar=false;
getCalendarEventsByMonth(month,defaultdate) {
   PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showIonized=false;
  console.log(defaultdate);
  this.showCalendar=false;
  this.isStartLoader = true;
  let calendarResponse: any = [];
  this.calendarEventsData=[];
  this.publishService.getPublishCalendarByMonthService(month).subscribe(
    (calResponse: any) => {
      console.log(calResponse[0]);
      if(calResponse[0]==null)
        {
            calendarResponse =[];
        }
        else{
            calendarResponse = calResponse[0].posts;
        }
      
    }, (err) => {

    }, () => {
      
      calendarResponse.forEach((resdata) => {
      
      var tempObj = {"4":"publish_cale_status publish_s_ionizing","3":"publish_cale_status publish_s_draft","2":"publish_cale_status","1":"publish_cale_status publish_s_Online","0":"publish_cale_status publish_s_ionized"};
       
          this.calendarEventsData.push({id: resdata.postid, title: resdata.title, start: resdata.publish_up,className:tempObj[resdata.published],state:resdata.published});
       
        
      
     });
    console.log(this.calendarEventsData);
    //  this.calendarOptions = {
    //     editable: true,
    //     eventLimit: false,
    //      defaultDate: defaultdate+"-12",
    //     header: {
    //       left: 'prev,next today',
    //       center: 'title',
    //       right: 'month,agendaWeek,agendaDay,listMonth'
    //     },
    //     events: this.calendarEventsData
    //   };
    console.log(this.calendarEventsData);
     this.calendarOptions = {
       editable: true,
       eventLimit: true,
       defaultDate: defaultdate+"-12",
       header: {
         left: '',
         center: '',
         right: ''
       },
       events: this.calendarEventsData,
       eventMouseover: function(event, jsEvent, view) {
           let elemPos = $(this).offset();
           event.offsetTop = elemPos.top;
           event.offsetLeft = elemPos.left;

           PublishComponent.calenderOverEvent(event);
        },
        eventMouseout: function(event, jsEvent, view) {
            // PublishComponent.showDraft=false;
            // PublishComponent.showIonize=false;
            // PublishComponent.showPublished=false;
            // PublishComponent.showIonized=false;
        }
     };
      this.showCalendar=true;
      this.isStartLoader = false;
    });
}

static showDraft=false;
static showIonize=false;
static showPublished=false;
static showIonized=false;
static offsetTop = "";
static offsetLeft = "";
static viewData={};
static id="";
static calenderOverEvent(view) {
    PublishComponent.offsetTop = "";
    PublishComponent.offsetLeft = "";
  PublishComponent.viewData="";
  PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showIonized=false;

  PublishComponent.viewData=view;

  if(view.state==3)
    {
      PublishComponent.showDraft=true;
    }
    else if(view.state==4)
      {
        PublishComponent.showIonize=true;
      }
      else if(view.state==1)
        {
          PublishComponent.showPublished=true;
        }
        else {
         PublishComponent.showIonized=true;
        }

 // PublishComponent.showDraft=true;
  PublishComponent.id=view.id;
 // this.staticUrlArray();
 }
get staticShowDraft() {
    return PublishComponent.showDraft;
  }
  get staticShowIonize() {
    return PublishComponent.showIonize;
  }
  get staticShowIonized() {
    return PublishComponent.showIonized;
  }
  get staticShowPublished() {
    return PublishComponent.showPublished;
  }
  get staticId() {
    return PublishComponent.id;
  }
  get staticViewData(){
    return PublishComponent.viewData;
  }




clickButton(model: any) {
  var month=model.data._d.getMonth()+1;
  var year=model.data._d.getFullYear();
  this.getCalendarEventsByMonth(month+"/"+year,year+"-"+month);
 console.log(model.data._d);

this.displayEvent = model;
}


// currentDateObj(event) {
//   console.log(event);
// }
eventClick(model: any) {
// console.log(this.displayEvent);
model = {
  event: {
    id: model.event.id,
    start: model.event.start,
    end: model.event.end,
    title: model.event.title,
    allDay: model.event.allDay
    // other params
  },
  duration: {}
};
this.displayEvent = model;
}
updateEvent(model: any) {
console.log(222);
model = {
  event: {
    id: model.event.id,
    start: model.event.start,
    end: model.event.end,
    title: model.event.title
    // other params
  },
  duration: {
    _data: model.duration._data
  }
};
this.displayEvent = model;
}
eventMouseover(model: any) {
console.log(1233456);
}
// add new topics call
addNewTopicsCall() {
  PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showIonized=false;
  this.isAddNewTopic = true;
  this.getTrendingTopicsByMonth(new Date());
  //this.getAllTrendingTopicsCall();
}
// get all trending topics  call
getAllTrendingTopicsCall() {
  this.isStartLoader = true;

  this.publishService.getAllTrendingTopicsService().subscribe(
    (trendResponse: any) => {
      console.log(trendResponse.description);
      this.trendingTopicsData = trendResponse.description;
    }, (err) => {

    }, () => {
     // console.log(this.trendingTopicsData);
      this.isStartLoader = false;
      for (const key in this.trendingTopicsData) {
          var topics=this.trendingTopicsData[key];
          for(let data of topics)
          {
                data.selectedDate="0000-00-00";
          }
        if (this.trendingTopicsData.hasOwnProperty(key)) {
          this.trendingTopicsData[key].isTrendTitleChecked = false;
      }
    }
   this.trendTopicClick(Object.keys(this.trendingTopicsData)[0]);
    });
}
// get trending topics by month call
ShowNoTopicsAreAvailable=false;
getTrendingTopicsByMonth(date) {
  this.isPageStartLoader = true;
  this.ShowNoTopicsAreAvailable=false;
  var month=this.format(date, ['YYYY-MM']);
  this.trendingTopicsData=[];
  this.publishService.getTrendingTopicsService(month).subscribe(
    (trendResponse: any) => {
     // console.log(trendResponse);
      this.trendingTopicsData = trendResponse.description;
      if(this.trendingTopicsData.length==0)
        {
          this.ShowNoTopicsAreAvailable=true;
        }
    }, (err) => {

    }, () => {
      this.isPageStartLoader = false;
      // for (const key in this.trendingTopicsData) {
      //   if (this.trendingTopicsData.hasOwnProperty(key)) {
      //     this.trendingTopicsData[key].isTrendTitleChecked = false;
      // }
      // }
       this.isStartLoader = false;
      for (const key in this.trendingTopicsData) {
          var topics=this.trendingTopicsData[key];
          for(let data of topics)
          {
                data.selectedDate="0000-00-00";
          }
        if (this.trendingTopicsData.hasOwnProperty(key)) {
          this.trendingTopicsData[key].isTrendTitleChecked = false;
      }
    }
   this.trendTopicClick(Object.keys(this.trendingTopicsData)[0]);

    });
}
totalTopicselect=0;


// calendar create new post checked event
checkedTrendingTopic(ikey, jindx, ischecked) {
    this.showSelectedTrendingError=false;
    console.log(this.selectedTrendTopics);
    if (this.trendingTopicsData.hasOwnProperty(ikey)) {
      console.log(ischecked);
      if(ischecked) {
       // this.trendingTopicsData[ikey][jindx].ischecked = true;
        console.log(this.trendingTopicsData[ikey][jindx]);
        const topicObj = {ikey : this.trendingTopicsData[ikey][jindx]};
        this.selectedTrendTopics.push(topicObj);
      } else {
        // this.trendingTopicsData[ikey][jindx].ischecked = false;
        const index = this.deepIndexOf(this.selectedTrendTopics, ikey);
        this.selectedTrendTopics.splice(index, 1);
    }
    console.log(this.selectedTrendTopics);
    
    this.totalTopicselect=this.selectedTrendTopics.length;
    
  }
}
// check index
deepIndexOf(arr, obj) {
  return arr.findIndex(function (cur) {
    return Object.keys(obj).every(function (key) {
      return obj[key] === cur[key];
    });
  });
}
select_topic_id='';
 dateSelectedForTrendingTopic(key,index,date)
  {
    this.showSelectedTrendingError=false;
     for (const topickey in this.trendingTopicsData) {
         if(topickey===key)
          {
            (this.trendingTopicsData[key])[index].selectedDate=date;
              console.log((this.trendingTopicsData[key])[index].title);
              console.log((this.trendingTopicsData[key])[index].id);
              this.select_topic_id=(this.trendingTopicsData[key])[index].id;
              console.log(this.select_topic_id);
          }
    }
   
   // console.log(key,index,date);
  }

 
// is checked main topic
trendTopicClick(key) {
  if (this.trendingTopicsData.hasOwnProperty(key)) {
   if(this.trendingTopicsData[key].isTrendTitleChecked) {
    this.trendingTopicsData[key].isTrendTitleChecked = false;
   } else {
    this.trendingTopicsData[key].isTrendTitleChecked = true;
   }
  }
 // console.log(this.trendingTopicsData[key].isTrendTitleChecked);
}
showSelectedTrendingError=false;
addToCalendar(){
  console.log(this.selectedTrendTopics);
  if(this.selectedTrendTopics.length==0)
    {
        this.showSelectedTrendingError=true;
    }
      else{
            var idAndDate="";
            this.isStartLoader=true;

            for(let topic of this.selectedTrendTopics)
              {
                console.log(topic.ikey.selectedDate);
                if(topic.ikey.selectedDate!='0000-00-00')
                  {
                    var date=topic.ikey.selectedDate;
                    var dd:any=date.getDate();
                    var mm:any=(date.getMonth()+1);

                    if(dd<10){
                      dd='0'+dd;
                    } 
                    if(mm<10){
                      mm='0'+mm;
                    } 
                    var selectedDate=date.getFullYear()+"-"+mm+"-"+dd;
                    idAndDate=idAndDate+topic.ikey.id+":"+selectedDate+",";                      
                  }
                else{
                  this.showSelectedTrendingError=true;
                }
              }
              console.log(idAndDate);
              if(!this.showSelectedTrendingError){
                this.isPageStartLoader=true;
                  console.log(idAndDate);
                  this.publishService.addTopicToCalendar(idAndDate).subscribe(
                    data =>{
                        this.isStartLoader=false;
                        this.isAddNewTopic = false;
                        this.selectedTrendTopics=[];
                        this.blogCalendarCall();
                  },
                  err =>{
                    console.log(err);
                  },()=>{
                    this.isPageStartLoader=false;
                  });
              }
              

      }
 
    }


// add Trending topic new
addNewTrendingTopic() {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  const resData = 
  {
    'created_by' : currentuser.teamid,
    'title' : this.newTrendTopicForm.value.title,
    'tag' : this.newTrendTopicForm.value.tag
  };
    console.log(resData);
    this.isPageStartLoader=true;
    this.publishService.createTrendingTopic(resData,this.topicsDate).subscribe(
      data=>{console.log(data);
        this.isAddNewTopicButton=true;
        //this.getAllTrendingTopicsCall();
        this.getTrendingTopicsByMonth(this.topicsDate);
      },
      err=>{
        this.isPageStartLoader=false;
      },
      ()=>{
        //this.isPageStartLoader=false;
      }
    )

}
// ionizeTheBlog() {
  // var content='';
  // console.log(this.images);
  // content =content + this.aboutImages +"<br>";
  // for(let image of this.images)
  //   {
  //       content=content+'<img src="'+image+'"'+">";
  //   }
  //     console.log(content);
  //     this.publishService.ionizeBlogService(this.promotionId,content,this.promotionTitle).subscribe(res => {
  //      console.log(res);
  //      alert("ionized successfully");
  //     },(err) => {
  //     }, () => {
  //     })
//}
// titleChange(value){
//   this.blogTitle=value;
// }
// contentChange(value){
//   this.blogContent=value;
// }
isLoaderForEditor=false;
noofdays:any="";
showPublishedDate="";
showPublishedTime="";
createTheBlog(blogStatus){
  console.log(this.createAndUpdateTheBlogForm.value);
  if(this.blogCategory == undefined){
    this.blogCategory=80;
  }else{
    this.createAndUpdateTheBlogForm.value.type=this.blogCategory;
  }
    //this.isStartLoader = true;
    var tags="";
    var content="";
    //console.log(this.blogTags);
    this.blogTags.forEach(data=>{
         tags +=data.value+",";
    })
         if(this.coverImages.length>1)
          {
            this.coverImages.forEach((image,index)=>{
                    content=content+'<img src="'+image+'"/><br>';
            })
            this.createAndUpdateTheBlogForm.value.content=this.createAndUpdateTheBlogForm.value.content+content;
            //console.log(this.createAndUpdateTheBlogForm.value.content);
            //this.createAndUpdateTheBlogForm.value.content=content;
          }
  this.createAndUpdateTheBlogForm.value.status=blogStatus;
   console.log(this.createAndUpdateTheBlogForm.value);
    if(this.createAndUpdateTheBlogForm.value.status==3)
      {
        if(this.createAndUpdateTheBlogForm.value.content=='' && this.createAndUpdateTheBlogForm.value.title=='')
          {
            this.validateAllFormFields(this.createAndUpdateTheBlogForm);
          }
          else{
            console.log("3")
            this.isLoaderForEditor=true;
          this.publishService.createTheBlogService(this.createAndUpdateTheBlogForm.value,'')
            .subscribe(
            (cteateBlogResponse: any) => {
              console.log(cteateBlogResponse);
              this.createAndUpdateTheBlogForm.patchValue({
                status:blogStatus
              })
              this.isOpenEditor=false;
              this.isLoaderForEditor=false;
              this.blogCategory=80;
              //testing script
              // var minutes = 1000*60;
              // var hours = minutes*60;
              // var days = hours*24;
              
              // var start_date:any = new Date();
              // var end_date:any = new Date(this.createAndUpdateTheBlogForm.value.createdDate);
              // console.log(end_date);
              // console.log(start_date);
              // console.log(end_date - start_date);
              // var diff_date = Math.round((end_date - start_date)/days);
              // this.noofdays=diff_date+1;
              this.getPublishedBlogs(0,20);
              this.showRequestIsTaken=true;
              //this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['YYYY-MM-DD']);
              //this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
            }, (err) => {
                    console.log(err);
            }, () => {
              
           });

          }
      }
    else if(this.createAndUpdateTheBlogForm.valid)
      {
        console.log(this.createAndUpdateTheBlogForm.value)
       this.createAndUpdateTheBlogForm.value.type=this.blogCategory;
       console.log( this.createAndUpdateTheBlogForm.value.type)
          this.isLoaderForEditor=true;
          this.publishService.createTheBlogService(this.createAndUpdateTheBlogForm.value,'')
            .subscribe(
            (cteateBlogResponse: any) => {
              console.log(cteateBlogResponse);
              this.createAndUpdateTheBlogForm.patchValue({
                status:blogStatus
              })
              this.isOpenEditor=false;
              this.isLoaderForEditor=false;
              this.blogCategory=80;
             
              //testing script
              var minutes = 1000*60;
              var hours = minutes*60;
              var days = hours*24;
              
              var start_date:any = new Date();
              var end_date:any = new Date(this.createAndUpdateTheBlogForm.value.createdDate);
              console.log(end_date);
              console.log(start_date);
              console.log(end_date - start_date);
              var diff_date = Math.round((end_date - start_date)/days);
              this.noofdays=diff_date+1;
              
              if(blogStatus==2)
                {
                      this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['DD MMMM, YYYY']);
                      this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh.mm A']);
                }
              else if(blogStatus==1){
                      this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['DD MMMM, YYYY']);
                      this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh.mm A']);
              }
              else if(blogStatus==4)
                {
                     this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['MMM DD YYYY']);
                      this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh.mm A']);
            
                }
                this.showRequestIsTaken=true;
                this.getPublishedBlogs(0,20);
              //this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['YYYY-MM-DD']);
              //this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
            }, (err) => {
                    console.log(err);
            }, () => {
              
           });
      }
      else{
        this.validateAllFormFields(this.createAndUpdateTheBlogForm);
      }
    
}
isLoaderForUpdateBlog:boolean=false;
createdDate="";
createdTime="";
showDateRequired=false;
showTimeRequired=false;
updateTheBlogDirectly(blogStatus) {
  if(this.createdDate===""){
    this.showDateRequired=true;
  }
  else if(this.createdTime==="")
    {
      this.showTimeRequired=true;
    }
    else{
       this.blogTags.forEach(tag=>{
          if(typeof tag.value!="undefined")
            {
                tags =tags+tag.value + ',';
            }
            else{
                tags =tags+tag + ',';
            }
        })
      this.isLoaderForUpdateBlog=true;
      var tags='';
      console.log(this.blogViewData);

      this.createAndUpdateTheBlogForm.patchValue({
          title:this.blogViewData.title,
          content:this.blogViewData.text,
          postid:this.blogViewData.postid,
          type:this.blogViewData.category.categoryid,
          status:blogStatus,
          image:this.blogViewData.image.url,
          createdDate:this.createdDate,
          createdTime:this.createdTime
      })
    console.log(this.blogViewData.tags);
    // if(this.blogViewData.tags.length!=0)
    //   {
    //     this.blogViewData.tags.forEach(tag=>{
    //          tags=tags+tag.title+",";
    //     })
    //   }
      this.blogTags.forEach(tag=>{
          if(typeof tag.value!="undefined")
            {
                tags =tags+tag.value + ',';
            }
            else{
                tags =tags+tag + ',';
            }
      })
      if(blogStatus=='')
        {
          blogStatus=this.blogViewData.published;
        }
        console.log(blogStatus);
    console.log(this.createAndUpdateTheBlogForm.value);
    this.isStartLoader = true;
    this.publishService.updateBlogService(this.createAndUpdateTheBlogForm.value, tags)
    .subscribe(
    (updateblogResponse: any) => {
      console.log(updateblogResponse);
      this.isIonizedBlog = false;
      this.isBlogDraft = false;
      this.isPublishNow = false;
      this.isIonizeNow = false;
      var minutes = 1000*60;
      var hours = minutes*60;
      var days = hours*24;
      var start_date:any = new Date();
      var end_date:any = new Date(this.createdDate);
      console.log(end_date);
      console.log(start_date);
      console.log(end_date - start_date);
      var diff_date = Math.round((end_date - start_date)/days);
      this.noofdays=diff_date+1;
      var showPublishedDate=new Date(this.createdDate).toString().split(" ");
      //this.showPublishedDate=showPublishedDate[2]+" "+showPublishedDate[1]+" "+showPublishedDate[3];
      //var showPublishedTime=new Date(this.createdTime).toString().split(" ");
      //this.showPublishedTime=showPublishedTime[4];
      // this.showPublishedDate=this.format(this.createdDate, ['YYYY-MM-DD']);
      // this.showPublishedTime=this.format(this.createdTime, ['hh:mm A']);
       if(blogStatus==2)
                {
                      this.showPublishedDate=this.format(this.createdDate, ['DD MMMM, YYYY']);
                      this.showPublishedTime=this.format(this.createdTime, ['hh.mm A']);
                }
              else if(blogStatus==1){
                      this.showPublishedDate=this.format(this.createdDate, ['DD MMMM, YYYY']);
                      this.showPublishedTime=this.format(this.createdTime, ['hh.mm A']);
              }
              else if(blogStatus==4)
                {
                     this.showPublishedDate=this.format(this.createdDate, ['MMM DD YYYY']);
                      this.showPublishedTime=this.format(this.createdTime, ['hh.mm A']);
            
                }
      this.showRequestIsTaken=true;
      this.getPublishedBlogs(0,20);
     
      //this.clearTheForm();
      
      //this.isLoaderForEditor=false;
      // if(blogStatus == 1) {
      //   this.showRequestIsTaken = true;
      //  // this.alertMessage = 'Blog Published Successfully.';
      //   } else {
      //     this.isAlertPopup = true;
      //     this.alertMessage = 'blog Inoized Successfully.';
      //   }

        // console.log(trendResponse);
        // this.trendingTopicsData = trendResponse.description;
    }, (err) => {

    }, () => {
      // console.log(this.trendingTopicsData);
      this.isLoaderForUpdateBlog=false;
      this.isStartLoader = false;
    });
    }
  


}
  
  updateTheBlogFromEdit(blogStatus) {
    // console.log(this.blogViewData);
   console.log(blogStatus);
   console.log(this.createAndUpdateTheBlogForm.value);
   //console.log(this.blogTags);
   console.log(blogStatus);
   var tags="";
   this.blogTags.forEach(tag=>{
     if(typeof tag.value!="undefined")
      {
          tags =tags+tag.value + ',';
      }
      else{
          tags =tags+tag + ',';
      }
   })
   console.log(tags);
   this.createAndUpdateTheBlogForm.value.status=blogStatus;
    if(this.createAndUpdateTheBlogForm.value.status==3)
      {
        if(this.createAndUpdateTheBlogForm.value.content=='' && this.createAndUpdateTheBlogForm.value.title=='')
          {
            this.validateAllFormFields(this.createAndUpdateTheBlogForm);
          }
          else{
           
            this.isLoaderForUpdateBlog=true;
           this.publishService.updateBlogService(this.createAndUpdateTheBlogForm.value,tags)
            .subscribe(
            (updateblogResponse: any) => {
               this.createAndUpdateTheBlogForm.patchValue({
                  status:blogStatus
                })
              console.log(updateblogResponse);
              
              this.isEditorForEditThePublish=false;
              this.isEditorForEditTheDraft=false;
              this.isEditorForEditTheOnline=false;
              
              this.showRequestIsTaken=true;
              var minutes = 1000*60;
              var hours = minutes*60;
              var days = hours*24;
              var start_date:any = new Date();
              var end_date:any = new Date(this.createAndUpdateTheBlogForm.value.createdDate);
              console.log(end_date);
              console.log(start_date);
              console.log(end_date - start_date);
              var diff_date = Math.round((end_date - start_date)/days);
              this.noofdays=diff_date+1;
              if(blogStatus==2)
                {
                      this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['DD MMMM, YYYY']);
                      this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh.mm A']);
                }
              else if(blogStatus==1){
                      this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['DD MMMM, YYYY']);;
                      this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh.mm A']);
              }
              else if(blogStatus==4)
                {
                     this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['MMM DD YYYY']);
                      this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh.mm A']);
            
                }
             
              this.isLoaderForUpdateBlog=false;
              this.getPublishedBlogs(0,20);
            }, (err) => {

            }, () => {
              // console.log(this.trendingTopicsData);
              //this.isStartLoader = false;
            });
          }
      }
    else if(this.createAndUpdateTheBlogForm.valid)
      {
           this.isLoaderForUpdateBlog=true;
           this.publishService.updateBlogService(this.createAndUpdateTheBlogForm.value,tags)
            .subscribe(
            (updateblogResponse: any) => {
               this.createAndUpdateTheBlogForm.patchValue({
                  status:blogStatus
                })
              console.log(updateblogResponse);
              this.isEditorForEditThePublish=false;
              this.isEditorForEditTheDraft=false;
              this.isEditorForEditTheOnline=false;
              this.getPublishedBlogs(0,20);
              this.showRequestIsTaken=true;
              var minutes = 1000*60;
              var hours = minutes*60;
              var days = hours*24;
              var start_date:any = new Date();
              var end_date:any = new Date(this.createAndUpdateTheBlogForm.value.createdDate);
              console.log(end_date);
              console.log(start_date);
              console.log(end_date - start_date);
              var diff_date = Math.round((end_date - start_date)/days);
              this.noofdays=diff_date+1;
              this.getPublishedBlogs(0,20);
              this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['YYYY-MM-DD']);
              this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                this.isLoaderForUpdateBlog=false;
            }, (err) => {

            }, () => {
              // console.log(this.trendingTopicsData);
              //this.isStartLoader = false;
            });
      }
          else{
            this.validateAllFormFields(this.createAndUpdateTheBlogForm);
          }
}


//   ionizeTheBlog(){
//     console.log(this.blogViewData);
//     this.isStartLoader = true;
//     let publish=4;
//     this.publishService.updateBlogService(this.blogViewData,publish)
//     .subscribe(
//     (updateblogResponse: any) => {
//       console.log(updateblogResponse);
//         // console.log(trendResponse);
//         // this.trendingTopicsData = trendResponse.description;
//     }, (err) => {

//     }, () => {
//       // console.log(this.trendingTopicsData);
//       this.isStartLoader = false;
//     });


// }
// Edit the Blog
isEditorForEditThePublish=false;
isEditorForEditTheDraft=false;
isEditorForEditTheOnline=false;

editBlogCall(eachData,type) {
   
   this.blogTags=[];
   console.log(eachData);
   this.getBlogComments(eachData.postid);
   this.publishService.getBlogDetailViewService(eachData.postid).subscribe(data=>{
       //console.log(data);
       if(type!='draft')
        {
            this.dateChange(data.publish_up);
            this.timeChange(data.publish_up);
        }
      
   if(eachData.tags.length!=0)
          {
            eachData.tags.forEach(tag=>{
                this.blogTags.push(tag.title);
            })
          }
    if(this.blogTypes.length>0)
      {
        this.blogTypes.forEach(category=>{
          console.log(category.id);
          console.log(eachData.category.categoryid);
          console.log(category.id==eachData.category.categoryid);
          if(category.id==eachData.category.categoryid)
            {
                  category.selected=true;
            }
            else{
                  category.selected=false;
            }
        })
      }
    this.createAndUpdateTheBlogForm.patchValue({
        title:data.title,
        content:data.text,
        postid:data.postid,
        type:data.category.categoryid,
        status:data.published,
        image:data.image.url,
        createdDate:data.publish_up,
        createdTime:data.publish_up,
    })
       
   if(type=='publish')
    {
        this.isEditorForEditThePublish=true;
    }
    else if(type=='draft')
      {
       this.createAndUpdateTheBlogForm.patchValue({
        createdDate:'',
        createdTime:''
       })
        this.isEditorForEditTheDraft=true;
      }
      else{
        this.isEditorForEditTheOnline=true;
      }
   },err=>{

   },
  ()=>{})

  
}
// Delete the Blog
isDeleteAlertPopup=false;
deleteBlogId="";
deleteBlogIndex="";
deleteBlogCall(blogId,index) {
  this.deleteBlogId=blogId;
  this.deleteBlogIndex=index;
  this.isDeleteAlertPopup=true;
  // this.isStartLoader = true;
  // this.publishService.deleteBlogService(blogId)
  // .subscribe(
  // (blogResponse: any) => {
  //   console.log(blogResponse);
  //    this.isAlertPopup = true;
  //    this.alertMessage = '';
  // }, (err) => {

  // }, () => {
  //   // console.log(this.trendingTopicsData);
  //   this.isStartLoader = false;
  // });
}
deleteTheBlog(){
   this.isStartLoader = true;
  this.publishService.deleteBlogService(this.deleteBlogId)
  .subscribe(
  (blogResponse: any) => {
    console.log(blogResponse);
     this.isDeleteAlertPopup = false;
     this.alertMessage = '';
     this.publishedData.splice(this.deleteBlogIndex,1);
  }, (err) => {

  }, () => {
    // console.log(this.trendingTopicsData);
    this.isStartLoader = false;
  });
}
// create new post
createNewPostCall() {
  this.blogCommentsData=[];
  this.isCreateBlog=true;
}
startNewBlogWithTopic(){
   this.draftCurrentClass='save';
   this.isCreateBlog=false;
   this.isTrendingTopicsList = true;
}
  startNewBogWithOutTopic(){
    this.draftCurrentClass='save';
    if(this.blogTypes.length>0)
    {
        //this.blogTypes[0].selected=true;
        this.blogTypes.forEach((btype, index) =>{
            if(index==0)
             {
                btype.selected=true;
             }
            else{
               btype.selected=false;
            }    
        })
        this.createAndUpdateTheBlogForm.patchValue({
          type:this.blogTypes[0].id
        })
    }
    else{
      var currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      this.createAndUpdateTheBlogForm.value.type=currentuser.publishid;
    }
    this.isCreateBlog=false;
    this.isOpenEditor=true;
    console.log(this.createAndUpdateTheBlogForm.value);
  }
  startTheBlogWithTopic(){
     if(this.blogTitle!="")
        {
            //this.isCreateNewPost=false;
            this.isOpenEditor=true;
             this.createAndUpdateTheBlogForm.patchValue({
                  title:this.blogTitle,
                  topicId:this.selectedTopicId
             })
        }
        else{
            this.isTopicSelected=false;
            return;
        }
      if(this.blogTypes.length>0)
        {
            //this.blogTypes[0].selected=true;
            this.blogTypes.forEach((btype, index) =>{
            if(index==0)
             {
                btype.selected=true;
             }
            else{
               btype.selected=false;
            }    
      })
            this.createAndUpdateTheBlogForm.patchValue({
              type:this.blogTypes[0].id
            })
            //this.createAndUpdateTheBlogForm.value.type=this.blogTypes[0].id;
        }
        else{
          var currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
          this.createAndUpdateTheBlogForm.value.type=currentuser.publishid;
        }
        this.isTrendingTopicsList=false;
        this.isOpenEditor=true;
        console.log(this.createAndUpdateTheBlogForm.value);
     
  }
// get categories
categories=[];
getCategories(){
    this.publishService.getCategories('').subscribe(data=>{
          console.log(data);
          this.categories=data;
           data.forEach(element => {
            this.autoComplete.push(element.title);
          });
    },
    err => {
      console.log(err);
    },
    () => { });
}
trendingTopicsForNewBlog=[];
getAllTopicsForNewBlog() {
  this.isStartLoader = true;
  this.publishService.getAllTrendingTopicsService().subscribe(
    (trendResponse: any) => {
      console.log(trendResponse.description);
      this.trendingTopicsForNewBlog = trendResponse.description;
    }, (err) => {

    }, () => {
     // console.log(this.trendingTopicsData);
      this.isStartLoader = false;
      for (const key in this.trendingTopicsForNewBlog) {
        if (this.trendingTopicsForNewBlog.hasOwnProperty(key)) {
          this.trendingTopicsForNewBlog[key].isTrendTitleChecked = false;
      }
    }
    this.blogTopicClick(Object.keys(this.trendingTopicsForNewBlog)[0]);
    });
}
  // is blog topic checked
blogTopicClick(key) {
  if (this.trendingTopicsForNewBlog.hasOwnProperty(key)) {
   if(this.trendingTopicsForNewBlog[key].isTrendTitleChecked) {
    this.trendingTopicsForNewBlog[key].isTrendTitleChecked = false;
   } else {
    this.trendingTopicsForNewBlog[key].isTrendTitleChecked = true;
   }
  }
 // console.log(this.trendingTopicsData[key].isTrendTitleChecked);
}
 
  selectedTopicForCrateNewBlog(key,index){
    for (const topickey in this.trendingTopicsForNewBlog) {
         if(topickey===key)
          {
                this.isTopicSelected=true;
                this.createAndUpdateTheBlogForm.patchValue({
                  title:(this.trendingTopicsForNewBlog[key])[index].title,
                  topicId:(this.trendingTopicsForNewBlog[key])[index].id
                })
                this.blogTitle=(this.trendingTopicsForNewBlog[key])[index].title;
                this.selectedTopicId=(this.trendingTopicsForNewBlog[key])[index].id;
          }
    }
  }
  blogTypes=[];
  getBlogTypes(){
     this.isStartLoader = true;
  this.publishService.getBlogTypes().subscribe(
    (blogTypes: any) => {
      console.log(blogTypes);
      this.blogTypes=blogTypes;
    }, (err) => {

    }, () => {
      this.blogTypes.forEach((btype, index) =>{
            if(index==0)
             {
                btype.selected=true;
             }
            else{
               btype.selected=false;
            }
              
      })
    });
  }
  // upload publish comment image
  uploadPublishImage() {
    
    const fileBrowser = this.filePublishInput.nativeElement;
     if (fileBrowser.files && fileBrowser.files[0]) {
      if(fileBrowser.files[0].size/1024/1024 > 9) {
        this.imageUploadAlert = true;
        this.imageerrorAlert = false;
        // this.imageSrc = "";
        this.filePublishInput.nativeElement.value = '';
        return false;
      }
      this.imageUploadAlert = false;
      this.imageerrorAlert = false;
      this.isLoaderForUpdateBlog=true;
     // console.log(fileBrowser.files[0]);
      const fd = new FormData();
      for(var key=0;key<fileBrowser.files.length;key++)
     {
        if(key==0)
          fd.append('file', fileBrowser.files[key]);
       else{
         fd.append('file'+key, fileBrowser.files[key]);
       }
        
     }
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      //fd.append('file', fileBrowser.files[0]);
      fd.append('userid', currentuser.id);
      fd.append('username', currentuser.username);
      fd.append('password', currentuser.pwd);
      fd.append('encode', 'true');
      fd.append('auth_key', currentuser.auth);
      
      this.authService.uploadImageService(fd).subscribe(res => {
        // do stuff w/my uploaded file
        console.log(res);
      //  console.log(res.description[0].url);
        if(res.description==undefined)
        {
             // console.log("error");
              this.imageUploadAlert = false;
              this.imageerrorAlert=true;
        }else{
          res.description.forEach(image=>{
          this.imageSrc.push(image.url);
        })
          //this.imageSrc.push(res.description[0].url);
          this.isStartLoader = false; 
        }         
        
      },(err) => {
        this.isLoaderForUpdateBlog=false;
        //this.isStartLoader = false;
       }, () => {
         this.filePublishInput.nativeElement.value = '';
         this.isLoaderForUpdateBlog=false;
        //this.isStartLoader = false;
      });
    }
  }
  removeImage(index){
      this.imageSrc.splice(index,1);
      this.imageerrorAlert=false;
      this.imageUploadAlert = false;
  }
  // Publish the blog
  publishTheBlog(blog) {
    console.log(blog);
    this.publishService.getBlogDetailViewService(blog.postid).subscribe( 
    (blogResponse: any) => {
       
        this.createdDate=blogResponse.publish_up;
        this.createdTime=blogResponse.publish_up;
        this.dateChange(this.createdDate);
        this.timeChange(this.createdDate);
         this.blogViewData = blogResponse;
       console.log(this.blogViewData);
    })
      if(blog.tags.length!=0)
          {
            blog.tags.forEach(tag=>{
                this.blogTags.push(tag.title);
            })
          }
    //this.postionizeorpublish=blog;
    this.isPublishNow = true;
    console.log(blog);
    
  }
  // ionize the draft
  //postionizeorpublish="";
  ionizeTheDraft(blog) {
    console.log(blog);
     //console.log(blog);
     this.blogTags=[];
    this.publishService.getBlogDetailViewService(blog.postid).subscribe( 
    (blogResponse: any) => {
       this.createdDate=''
       this.createdTime=''
       this.blogViewData = blogResponse;
       console.log(this.blogViewData);
    })
      if(blog.tags.length!=0)
          {
            blog.tags.forEach(tag=>{
                this.blogTags.push(tag.title);
            })
          }
    //this.postionizeorpublish=blog;
    this.isIonizeNow = true;
  }
  
  typeselected(type){
    console.log(type);
    this.blogCategory=type.id;
    console.log( this.blogCategory);
    this.createAndUpdateTheBlogForm.value.type=type.id;
    this.blogTypes.forEach(btype=>{
        btype.selected=false;
        console.log(btype);
        if(btype.id==type.id)
          {
            type.selected=true;
            this.createAndUpdateTheBlogForm.value.type=btype.id;
            
          }
    })
   console.log(this.createAndUpdateTheBlogForm.value.type);
  }
  deleteCoverImage(i){
    console.log(i);
    this.coverImages.splice(i,1);
    this.imageerrorAlert=false;
    this.imageUploadAlert = false;
  }
  deleteCoverImageFromPublish(){
    this.createAndUpdateTheBlogForm.patchValue({
      image:''
    })
  }
  closeTrendingtopics(){
    this.isTrendingTopicsList = false;
    this.clearTheForm();
  }
  clearTheForm(){
    this.createAndUpdateTheBlogForm.reset();
    this.draftCurrentClass='';
    this.blogTitle="";
    this.coverImages=[];
    this.imageSrc=[];
    this.blogTags=[];
    this.isBlogComments=true;
    this.showPublishedDate="";
    this.showPublishedTime="";
    this.comment="";
    this.noofdays='';
    this.showDate="";
    this.showDay="";
    this.showMonth="";
    this.showTime="";
    this.createAndUpdateTheBlogForm.patchValue({
      title:'',
      content:'',
      type:'',
      image:'',
      topicId:'', 
      status:'',
      postid:'',
      createdDate:'',
      createdTime:''
    })
  }
  validateAllFormFields(formGroup: FormGroup) {         //{1}
        Object.keys(formGroup.controls).forEach(field => {  //{2}
         // console.log(field);
          const control = formGroup.get(field);             //{3}
          if (control instanceof FormControl) { 
            if(this.draftCurrentClass!=='save')          //{4}
                 control.markAsTouched({ onlySelf: true });
            else{
              if(field=='createdDate' ||field=='createdTime')
                {}
                else{
                  control.markAsTouched({ onlySelf: true });
                }
            }
          } else if (control instanceof FormGroup) {        //{5}
            //this.validateAllFormFields(control);            //{6}
             if(this.draftCurrentClass!=='save')          //{4}
                 this.validateAllFormFields(control);
            else{
              if(field=='createdDate' || field=='createdTime')
                {}
                else{
                  this.validateAllFormFields(control);
                }
            }
          }
        });
   }
  blogsCount:any=[];
  getBlogCountInCalendar(fromdate){
        this.publishService.getBlogCountInCalendar(fromdate).subscribe(
                (blogsCount: any) => {
                   this.blogsCount= blogsCount.description[0]
                }, (err) => {

                }, () => {
                
        })
      }

      closeConfirmation(){
        console.log(this.createAndUpdateTheBlogForm);
        if(this.createAndUpdateTheBlogForm.value.title == '' && this.createAndUpdateTheBlogForm.value.content==''){
          this.isOpenEditor=false;
          //this.clearTheForm();
         // console.log("false");
        }
        else{
          if (window.confirm("Do you really want to leave?")) { 
            this.clearTheForm();
            this.isOpenEditor=false;
            this.isEditorForEditTheDraft = false;
          }
          
        }
       
      }
       
      //format(date, [format], [options])
      showDate="";
      showDay="";
      showMonth="";
      showTime="";
      dateChange(createdDate){
        console.log(createdDate);
        //format(input10Moment, ['yyyy-mm-dd'])
        this.showDate=this.format(createdDate, ['DD']);
        this.showDay= this.format(createdDate, ['ddd']);
        this.showMonth=this.format(createdDate, ['MMMM']);
      }
       timeChange(createdTime){
        //format(input10Moment, ['yyyy-mm-dd'])
        this.showTime=this.format(createdTime, ['hh:mm a']);
        //this.showDay= this.format(input10Moment, ['ddd']);
        //this.showMonth=this.format(input10Moment, ['MMMM']);
      }
}