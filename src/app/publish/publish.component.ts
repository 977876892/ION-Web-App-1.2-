import { Component, OnInit,ViewChild,Input, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { PublishService } from '../shared/services/publish/publish.service';
import { ErrorService } from '../shared/services/error/error.service';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import * as CryptoJS from 'crypto-js';
import {DomSanitizer} from '@angular/platform-browser';
declare var require: any;
import { IonServer } from '../shared/globals/global';
declare var $: any;

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  providers: [PublishService, AuthserviceService,ErrorService]
})
export class PublishComponent implements OnInit {
  //format = require('date-fns/format');
  topicsDate=new Date();
  //today=new Date();
  format = require('date-fns/format');
  today=new Date();
  //stopDates=this.today.getFullYear()+"-"+(this.today.getMonth()+1)+"-"+this.today.getDate();
  stopDates=this.format(this.today, ['YYYY-MM-DD']);
  stopDatesForIonize=this.format(this.today.setDate(this.today.getDate() + 7), ['YYYY-MM-DD']);
  isStartLoader;
  isPageStartLoader;
  bigSizeImg:any=[];
  bigSizecoverImg:any=[];
  publishedData: any = [];
  pstatus: any = 1;
  publishType: any = 'publish';
  isBlogEditor:false;
  blogViewData: any;
  isBlogDraft: boolean = false;
  isIonizingBlog: boolean = false;
  showRequestIsTaken: boolean = false;
  imageerrorAlert:boolean=false;
  isAlertPopuperror:boolean=false;
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
  imgerror="Choose Only Images.";
  imgsize="The file size can not exceed 8MB.";
  currentLoginUser="";
   @ViewChild('filePublishInput') filePublishInput;
   @ViewChild('calendarPopup') calendarPopup;
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
  currentuser=localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  loginUserGroupId=this.currentuser.userGroup;
  loginUser=this.currentuser.id;//login user id for blog credentials.
  constructor(private router: Router,
    private publishService: PublishService,
    private authService: AuthserviceService,private errorservice:ErrorService,
    private route: ActivatedRoute, private builder: FormBuilder,private santizer:DomSanitizer) {
      document.addEventListener('click', this.offClickHandler.bind(this));
      document.addEventListener('click', this.calendarClickHandler.bind(this));
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
    calendarClickHandler(event: any) {
      if (this.calendarPopup && !this.calendarPopup.nativeElement.contains(event.target)) {
        //  this.publishedData.forEach((eachData) => {
        //   eachData.isClickOnEdit = false;
        // });
        PublishComponent.showDraft=false;
        PublishComponent.showIonize=false;
        PublishComponent.showPublished=false;
        PublishComponent.showScheduled=false;
        PublishComponent.showIonized=false;
      }
    }
  ngOnInit() {
    
    if (localStorage.getItem('user') =='' || localStorage.getItem('user')==null) {
      this.router.navigate(['login']);
    } else {
      this.getAllTopicsForNewBlog();
      this.getCategories();
      this.getBlogTags();
      //this.getBlogTypes();
       this.publishService.getBlogTypes().subscribe(
    (blogTypes: any) => {
      this.blogTypes=blogTypes;
    }, (err) => {

    }, () => {
      if(this.blogTypes.length>0)
        {
             this.blogTypes.forEach((btype, index) =>{
            if(index==0)
             {
                btype.selected=true;
             }
            else{
               btype.selected=false;
            }
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
      })
        }

    else{
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
    }
    });
      // setTimeout(() =>{
      //   this.route.params.forEach((params: Params) => {
      //   if (params.isnewpost !== '' && params.isnewpost !== undefined) {
          
      //     if(params.isnewpost == 'selecttopic') {
      //       this.isCalendarView = false;
      //       this.pstatus = 5;
      //       this.publishType = 'publish';
      //       this.getPublishedBlogs(0,20);
      //       this.startNewBlogWithTopic();
      //     }else if(params.isnewpost == 'newpost') {
      //       this.isCalendarView = false;
      //       this.pstatus = 5;
      //       this.publishType = 'publish';
      //       this.getPublishedBlogs(0,20);
      //       this.startNewBogWithOutTopic();
      //     }
      //   }
      // });
      // },3000)
      
      this.currentLoginUser=localStorage? JSON.parse(localStorage.getItem('user')) : 0;
      this.blogCount=localStorage? JSON.parse(localStorage.getItem('blogs')) : 0;
      $.FroalaEditor.RegisterCommand('videoUpload', {
        title: 'Youtube Video Upload',
        focus: false,
        undo: false,
        refreshAfterCallback: false,
  
        callback: function () {
          this.router.navigate(['login']);
          // alert("hello")
          // this.router.navigate(['publish']);
        }
      });
      if(this.router.url == '/publish/calendar') {
        this.scrollForBlogs=false;
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
                 paragraphFormat: {
                        N: 'Normal',
                        H1: 'Heading 1',
                        H2: 'Heading 2'
                      },
                      linkList: [
                        {
                          text: 'GetION',
                          href: 'http://getion.in/',
                          target: '_blank'
                        },
                        {
                          text: 'Google',
                          href: 'http://google.com',
                          target: '_blank'
                        },
                        {
                          text: 'Facebook',
                          href: 'https://facebook.com/',
                          target: '_blank'
                        }],
                        videoInsertButtons: ['videoByURL'],
                        imageInsertButtons:['imageUpload', 'imageByURL'],
                //paragraphMultipleStyles: false,
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
                imageMaxSize: 8 * 1024 * 1024,
        
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
                        // bucket: 'sairamtest',
                        // // Your bucket region.
                        // region: 's3',
                        // keyStart: '',
                        // params: {
                        //   acl: 'public-read', // ACL according to Amazon Documentation.
                        //   AWSAccessKeyId: 'AKIAJCPS7FEJDBMXTWOQ', // Access Key from Amazon.
                        //   policy: policy, // Policy string computed in the backend.
                        //   signature: base64, // Signature computed in the backend.
                        // }
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
                      // 'froalaEditor.image.beforeUpload':function (e, editor, response) {
                      //   this.buttonsDisabled=true;
                      //       // Image was uploaded to the server.
                      // },
                      // 'froalaEditor.image.inserted': function (e, editor, $img, response) {
                      //   this.buttonsDisabled=false;
                      // },
                      'froalaEditor.video.inserted': function (e, editor, $video) {
                              var videoSource = $video.contents().get(0).src;
                              $video.html('<iframe width="640" height="360" src="'+videoSource+'&rel=0&showinfo=0" frameborder="0" allowfullscreen="false"></iframe>');
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
        //if (this.totalrecordLength > this.currentRecordCount) {
          if(this.scrollForBlogs){
          this.startsFrom = this.startsFrom + 20;
          this.endTo = this.endTo + 20;
          this.isPageStartLoader = true;
          this.getPublishedBlogs(this.startsFrom, 20);
        }
      }
      // this.windowBottom=(windowHeight + window.pageYOffset)-880;
       if(!this.isEditorForEditThePublish && !this.isEditorForEditTheDraft && !this.isEditorForEditTheOnline && !this.isBlogDraft && !this.isIonizingBlog && !this.isPublishedBlog && !this.isIonizeNow && !this.isPublishNow)
             {
               //this.windowBottom=(windowHeight + window.pageYOffset)-650;
               this.windowBottom= window.pageYOffset;
             }
       else{
          //this.windowBottom=(windowHeight + window.pageYOffset)-700;
       }
    }
  };
  // uploadTextEditor() {
  // }
  // upload image
  buttonsDisabled=false;
  imageerrorcoverAlert:boolean=false;
  coverImageUpload=false;
uploadCoverImage() {
  this.bigSizecoverImg=[];
  var bigsizeImgcontinue=false;
  this.isPageStartLoader=false;
  const fileBrowser = this.fileInput.nativeElement;

  // fileBrowser.files.FileList.forEach(file=>{
  // })
  if (fileBrowser.files && fileBrowser.files[0]) {
  // if(fileBrowser.files[0].size/1024/1024 > 9) {

  //   //  this.isStartLoader = true;
  //   // this.imageSrc = "";
  //   this.imageUploadAlert = true;
  //   this.fileInput.nativeElement.value = '';
  //   return false;
  // }
  this.isStartLoader = true;
  this.imageerrorcoverAlert=false;
  //this.imageUploadAlert = false;
  // if (fileBrowser.files && fileBrowser.files[0]) {
    this.buttonsDisabled=true;
    const fd = new FormData();
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    for(var key=0;key<fileBrowser.files.length;key++)
    {
       if(fileBrowser.files[key].size/1024/1024 > 9){
        //this.imageUploadAlert = false;
        this.bigSizecoverImg.push(fileBrowser.files[key].name + "  size can not exceed 8MB.");
        if(fileBrowser.files.length==1)
          {
            this.buttonsDisabled=false;
            this.isStartLoader=false;
            return false;
          }
       }else{
        bigsizeImgcontinue=true;
            if(key==0)
            fd.append('file', fileBrowser.files[key]);
            else{
              fd.append('file'+key, fileBrowser.files[key]);
            }
       }
     }
    //fd.append('file', fileBrowser.files[0]);
    fd.append('userid', currentuser.id);
    fd.append('username', currentuser.username);
    fd.append('password', currentuser.pwd);
    fd.append('encode', 'true');
    fd.append('auth_key', currentuser.auth);
    this.fileInput.nativeElement.value = '';
    this.coverImageUpload=true;
    if(bigsizeImgcontinue){
    this.authService.uploadImageService(fd).subscribe(res => {
   
    //  //do stuff w/my uploaded file
    //  else 
      if(res.description==undefined){
        this.coverImageUpload=false;
        this.isStartLoader=false;
        this.buttonsDisabled=false;
        //this.imageerrorcoverAlert=true;

      }else{
        res.description.reverse();
        if(this.coverImageUpload)
          {
               if(this.coverImages.length==0)
                {
                    this.createAndUpdateTheBlogForm.patchValue({
                      image:res.description[0].url
                    })
                }
                res.description.forEach(image=>{
                  this.coverImages.push(image.url);
                })
          }
       
        //this.coverImages.push(res.description[0].url);
        if(this.isOpenEditor && this.coverImages.length>1)
          {
            this.draftCurrentClass='ionize';
          }
        
        
        this.buttonsDisabled=false;
        this.isStartLoader = false;
        this.coverImageUpload=false;
      }
          if(res.errors.fileerror!==undefined)
            {
                this.coverImageUpload=false;
                this.isStartLoader=false;
                this.buttonsDisabled=false;
                this.imageerrorcoverAlert=true;
            }
    },(err) => {
          this.coverImageUpload=false;
          console.log(err);
     }, () => {
      this.coverImageUpload=false;
      this.fileInput.nativeElement.value = '';
      this.isStartLoader = false;
    });}else{
      this.isStartLoader = false;
    }
  }
}
// Getting All published blogs list
scrollForBlogs=true;
getPublishedBlogs(startfrom, limitto) {
  this.scrollForBlogs=true;
  this.isPageStartLoader = true;
  this.showNoBlogsAvailable=false;
  this.publishService.getAllPublishMessages(this.pstatus, startfrom, limitto).subscribe(
    (publishResponse: any) => {
      if(startfrom==0)
        {
            this.publishedData = publishResponse.data;
        }
      else{
            this.publishedData = this.publishedData.concat(publishResponse.data);
      }
      
      if(this.publishedData.length==0)
        {
          this.showNoBlogsAvailable=true;
          this.scrollForBlogs=false;
        }
        if((this.publishedData.length%20)!=0)
        {
          this.scrollForBlogs=false;
        }

    }, (err) => {
      var errorMessage= this.errorservice.logError(err);
      this.alertMessage=errorMessage;
      this.isScrolled = false;
      this.isNoRecords = true;
      this.isPageStartLoader = false;
      this.isAlertPopuperror=true;
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
  this.isStartLoader=true;
  this.publishService.getBlogDetailViewService(bid).subscribe(
    (blogResponse: any) => {
      if(this.blogTypes.length>0)
      {
        this.blogTypes.forEach(category=>{
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
      if(this.blogViewData.published_date==null)
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
          this.isIonizingBlog = false;
          this.isBlogDraft = true;
          this.isPublishedBlog=false;
        } else
        if(viewType == 'publish') {
          this.isBlogDraft = false;
          this.isIonizingBlog = true;
          this.isPublishedBlog=false;
        } else {
          this.isPublishedBlog=true;
           this.isBlogDraft = false;
          this.isIonizingBlog = false;
        }
    }, (err) => {
      var errorMessage= this.errorservice.logError(err);
      this.isPageStartLoader = false;
      this.isStartLoader=false;
      this.isIonizingBlog=false;
      this.isAlertPopuperror=true;
      PublishComponent.showIonize=false;
      PublishComponent.showPublished=false;
      PublishComponent.showScheduled=false;
        this.alertMessage=errorMessage;
    }, () => {
        this.isStartLoader=false;
        this.isPageStartLoader = false;
        PublishComponent.showDraft=false;
        PublishComponent.showIonize=false;
        PublishComponent.showPublished=false;
        PublishComponent.showScheduled=false;
        PublishComponent.showIonized=false;
        this.getBlogComments(bid);
    });
}
// get blog comments call
getBlogComments(bid) {
  this.blogCommentsData=[];
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  this.loginUserId = currentuser.id;
  //this.isStartLoader = true;
  this.publishService.getBlogCommentsService(bid).subscribe(
    (commentsResponse: any) => {
      this.blogCommentsData = commentsResponse.description;
    }, (err) => {

    }, () => {
      this.isLoaderForUpdateBlog=false;
      this.isStartLoader = false;
    });
}
// add blog comment call
showCommentError=false;
showCommentErrorMsg="";
addBlogComment(bid, comment) {
  var comment=comment.trim();
  var images="";
  if(typeof comment=="undefined")
    {
      comment="";
    }
  if(this.imageSrc.length>0)
    {
      this.imageSrc.forEach((image,index)=>{
        images=images+image+",";
              //comment=comment+'<img src="'+image+'"/>';
      })
    }
  if(comment!=""||images!='')
    {
        //comment=comment.replace(/&/g, "%26");
        this.isLoaderForUpdateBlog = true;
        this.publishService.addBlogCommentsService(bid, comment,images).subscribe(
          (blogResponse: any) => {
            this.blogCommentsData = blogResponse.data;
            this.getBlogComments(bid);
            this.imageSrc=[];
          }, (err) => {
            var errorMessage= this.errorservice.logError(err);
            this.isLoaderForUpdateBlog=false;
         this.isAlertPopup=true;
         this.alertMessage=errorMessage;
          }, () => {
            //this.isLoaderForUpdateBlog = false;
          });
    }
        else{
          this.showCommentError=true;
          this.showCommentErrorMsg="At least Text Or Image Required.";
        }

}
// publish Calendar
blogCalendarCall() {
 
  this.isCalendarView = true;
  var str_month='';
  this.dateStore=new Date();
  //var month=this.dateStore.getMonth()+1;
  //var year=this.dateStore.getFullYear();
  this.showDisplayMonthAndYear=this.format(this.dateStore,['MMMM YYYY']);
  var pssed_year=this.format(this.dateStore,['MM/YYYY']);
   var month_count=this.format(this.dateStore,['YYYY-MM']);
  this.getCalendarEventsByMonth(pssed_year,this.dateStore);
  this.getBlogCountInCalendar(month_count);
  // if (month < 10)
  //   {
  //         str_month = '0' + month;
  //         this.getBlogCountInCalendar(year+"-"+str_month);
  //         this.getCalendarEventsByMonth(str_month+"/"+year,year+"-"+month);
  //   }
  // else{
  //         this.getBlogCountInCalendar(year+"-"+month);
  //         this.getCalendarEventsByMonth(month+"/"+year,year+"-"+month);
  // }


}
// get calendat=r events by month call
dateStore:Date=new Date();

prevMonth(){
   PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showScheduled=false;
  PublishComponent.showIonized=false;
   var str_month=''
  this.dateStore.setMonth(this.dateStore.getMonth() - 1);
  var pssed_year=this.format(this.dateStore,['MM/YYYY']);
   var month_count=this.format(this.dateStore,['YYYY-MM']);
  //var month=this.dateStore.getMonth()+1;
  //var year=this.dateStore.getFullYear();
  this.getCalendarEventsByMonth(pssed_year,this.dateStore);
    this.getBlogCountInCalendar(month_count);
  //this.showDisplayMonthAndYear=this.monthsList[month-1] +" "+year;
  this.showDisplayMonthAndYear=this.format(this.dateStore,['MMMM YYYY']);
  // if (month < 10)
  //   {
  //         str_month = '0' + month;
  //         this.getBlogCountInCalendar(year+"-"+str_month);
  //         this.getCalendarEventsByMonth(str_month+"/"+year,year+"-"+month);
  //   }
  // else{
  //         this.getBlogCountInCalendar(year+"-"+month);
  //         this.getCalendarEventsByMonth(month+"/"+year,year+"-"+month);
  // }
}
showDisplayMonthAndYear="";
nextMonth(){
  PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showScheduled=false;
  PublishComponent.showIonized=false;
  this.dateStore.setMonth(this.dateStore.getMonth() + 1);
  var pssed_year=this.format(this.dateStore,['MM/YYYY']);
  var month_count=this.format(this.dateStore,['YYYY-MM']);
  //var month=this.dateStore.getMonth()+1;
  //var year=this.dateStore.getFullYear();
  
  // var str_month='';
  this.showDisplayMonthAndYear=this.format(this.dateStore,['MMMM YYYY']);
  this.getBlogCountInCalendar(month_count);
  this.getCalendarEventsByMonth(pssed_year,this.dateStore);

  // if (month < 10)
  //   {
  //         str_month = '0' + month;
  //         this.getBlogCountInCalendar(year+"-"+str_month);
  //         this.getCalendarEventsByMonth(str_month+"/"+year,this.dateStore);
  //   }
  // else{
  //         this.getBlogCountInCalendar(year+"-"+month);
  //         this.getCalendarEventsByMonth(month+"/"+year,this.dateStore);
  // }


}

showCalendar=false;
getCalendarEventsByMonth(month,defaultdate) {
  
  PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showScheduled=false;
  PublishComponent.showIonized=false;
  this.showCalendar=false;
  this.isStartLoader = true;
  let calendarResponse: any = [];
  this.calendarEventsData=[];
  this.publishService.getPublishCalendarByMonthService(month).subscribe(
    (calResponse: any) => {
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
      var time=this.format(resdata.publish_up,['hh:mm A']);
      var tempObj = {"4":"publish_cale_status publish_s_ionizing","3":"publish_cale_status publish_s_draft","2":"publish_cale_status publish_s_scheduled","1":"publish_cale_status publish_s_Online","0":"publish_cale_status publish_s_ionized"};
          this.calendarEventsData.push({postid: resdata.postid, title: resdata.title, start: resdata.publish_up,className:tempObj[resdata.published],state:resdata.published,author:resdata.author,category:resdata.category,time:time,userid:resdata.created_by});
     });
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
     this.calendarOptions = {
       editable: false,
       //disableDragging:true,
       eventLimit: true,
       defaultDate: new Date(defaultdate),
       header: {
         left: '',
         center: '',
         right: ''
       },
       events: this.calendarEventsData,
       eventMouseover: function(event, jsEvent, view) {
           let elemPos = $(this).offset();
           event.offsetTop = elemPos.top - 50;
           event.offsetLeft = (elemPos.left+10) + $(this).parent().width();

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
static showScheduled=false;
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
  PublishComponent.showScheduled=false;
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
        else if(view.state==2)
        {
          PublishComponent.showScheduled=true;
        }
        else {
         PublishComponent.showIonized=true;
        }

 // PublishComponent.showDraft=true;
  //PublishComponent.id=view.id;
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
   get staticShowScheduled() {
    return PublishComponent.showScheduled;
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
  this.displayEvent = model;
}

// currentDateObj(event) {
// }
eventClick(model: any) {
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
}
// add new topics call
currentMonthForTrendingtopics:Date;
addNewTopicsCall() {
  this.currentMonthForTrendingtopics=new Date();
  PublishComponent.showDraft=false;
  PublishComponent.showIonize=false;
  PublishComponent.showPublished=false;
  PublishComponent.showScheduled=false;
  PublishComponent.showIonized=false;
  this.isAddNewTopic = true;
  this.getTrendingTopicsByMonth(this.currentMonthForTrendingtopics);
  //this.getAllTrendingTopicsCall();
}
// get all trending topics  call
getAllTrendingTopicsCall() {
  this.isStartLoader = true;

  this.publishService.getAllTrendingTopicsService().subscribe(
    (trendResponse: any) => {
      this.trendingTopicsData = trendResponse.description;
    }, (err) => {

    }, () => {
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

nextMonthTrendingTopics(){
  this.selectedTrendTopics=[];
  this.totalTopicselect=0;
  this.currentMonthForTrendingtopics.setMonth(this.currentMonthForTrendingtopics.getMonth() + 1);
  this.getTrendingTopicsByMonth(this.currentMonthForTrendingtopics);
}
prevMonthTrendingTopics(){
  this.selectedTrendTopics=[];
  this.totalTopicselect=0;
  this.currentMonthForTrendingtopics.setMonth(this.currentMonthForTrendingtopics.getMonth() - 1);
  this.getTrendingTopicsByMonth(this.currentMonthForTrendingtopics);
}
// get trending topics by month call
showMonthAndDate='';
ShowNoTopicsAreAvailable=false;
getTrendingTopicsByMonth(date) {
  this.isPageStartLoader = true;
  this.ShowNoTopicsAreAvailable=false;
  var month=this.format(date, ['YYYY-MM']);
  this.showMonthAndDate=this.format(date, ['MMMM YYYY']);;
  this.trendingTopicsData=[];
  this.publishService.getTrendingTopicsService(month).subscribe(
    (trendResponse: any) => {
      this.trendingTopicsData = trendResponse.description;
      if(this.trendingTopicsData.length==0)
        {
          this.ShowNoTopicsAreAvailable=true;
        }
    }, (err) => {
      var errorMessage= this.errorservice.logError(err);
        this.isAlertPopuperror=true;
        this.alertMessage=errorMessage;
        this.isPageStartLoader = false;
        this.isAddNewTopic=false;
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
                data.isdateselected=true;
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
    this.showSelectedTopicDateError=false;
    if (this.trendingTopicsData.hasOwnProperty(ikey)) {
      if(ischecked) {
        this.trendingTopicsData[ikey][jindx].ischecked = true;
        (this.trendingTopicsData[ikey][jindx]).isdateselected=false;
        this.totalTopicselect=this.totalTopicselect+1;
        // const topicObj = {ikey : this.trendingTopicsData[ikey][jindx]};
        // this.selectedTrendTopics.push(topicObj);
      } else {
         this.trendingTopicsData[ikey][jindx].ischecked = false;
        (this.trendingTopicsData[ikey][jindx]).isdateselected=true;
         this.totalTopicselect=this.totalTopicselect-1;
        //  const index = this.deepIndexOf(this.selectedTrendTopics, ikey);
        // this.selectedTrendTopics.splice(index, 1);
    }
    //this.showSelectedTopicDateError=false;
   // this.totalTopicselect=
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
 dateSelectedForTrendingTopic(key,index,date)
  {
    this.showSelectedTrendingError=false;
    this.showSelectedTopicDateError=false;
    this.selectTheDate='';
     for (const topickey in this.trendingTopicsData) {
         if(topickey===key)
          {
            (this.trendingTopicsData[key])[index].selectedDate=date;
          }
    }
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
}
showSelectedTrendingError=false;
showSelectedTopicDateError=false;
selectTheDate="";
addToCalendar(){
  if(this.totalTopicselect==0)
    {
        this.showSelectedTrendingError=true;
    }
      else{
        var proceed=false;
        var idAndDate="";
        for (const key in this.trendingTopicsData) {
          var topics=this.trendingTopicsData[key];
          for(let data of topics)
          {
             if(!data.isdateselected && data.selectedDate!='0000-00-00')
              {
                var selectedDate=this.format(data.selectedDate, ['YYYY-MM-DD']);
                idAndDate=idAndDate+data.id+":"+selectedDate+",";                      
              }
             else{
                  if(!data.isdateselected)
                    {
                        this.showSelectedTopicDateError=true;
                        this.selectTheDate=data.title;
                    }
                }
          }
    }
              if(!this.showSelectedTrendingError && !this.showSelectedTopicDateError){
                this.buttonsDisabled=true;
                this.isPageStartLoader=true;
                  this.publishService.addTopicToCalendar(idAndDate).subscribe(
                    data =>{
                        this.isStartLoader=false;
                        this.isAddNewTopic = false;
                        this.isAddNewTopicButton=true;
                        this.totalTopicselect=0;
                        this.selectedTrendTopics=[];
                        this.buttonsDisabled=false;
                        this.blogCalendarCall();
                  },
                  err =>{
                    var errorMessage= this.errorservice.logError(err);
                    this.isAddNewTopic=false;
                    this.isAlertPopuperror=true;
                    this.alertMessage=errorMessage;
                    this.isPageStartLoader=false;
                  },()=>{
                    this.isPageStartLoader=false;
                  });
              }
              

      }
 
    }


// add Trending topic new
addNewTrendingTopic() {
  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  if(this.newTrendTopicForm.valid)
    {
      this.buttonsDisabled=true;
      const resData = 
      {
        'created_by' : currentuser.teamid,
        'title' : this.newTrendTopicForm.value.title,
        'tag' : this.newTrendTopicForm.value.tag
      };
    this.isPageStartLoader=true;
    this.publishService.createTrendingTopic(resData,this.currentMonthForTrendingtopics).subscribe(
      data=>{
        this.buttonsDisabled=false;
        this.isAddNewTopicButton=true;
        this.totalTopicselect=0;
        //this.getAllTrendingTopicsCall();
        this.getTrendingTopicsByMonth(this.currentMonthForTrendingtopics);
      },
      err=>{
        var errorMessage= this.errorservice.logError(err);
        this.isPageStartLoader=false;
        this.isAlertPopuperror=true;
        this.alertMessage=errorMessage;
        this.isAddNewTopic=false;
      },
      ()=>{
        this.newTrendTopicForm.reset();
        this.newTrendTopicForm.patchValue({
          title:'',
          tag:''
        })
        //this.isPageStartLoader=false;
      }
    )
    }
    else{
        this.validateAddTopicFormFields(this.newTrendTopicForm);
    }
  

}
// ionizeTheBlog() {
  // var content='';
  // content =content + this.aboutImages +"<br>";
  // for(let image of this.images)
  //   {
  //       content=content+'<img src="'+image+'"'+">";
  //   }
  //     this.publishService.ionizeBlogService(this.promotionId,content,this.promotionTitle).subscribe(res => {
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
creaditsCount:number;
creditsError=false;
createTheBlog(blogStatus){
    //this.isStartLoader = true;
    var tags="";
    var content="";
    this.blogTags.forEach(data=>{
         tags +=data.value+",";
    })
         if(this.coverImages.length>1)
          {
            this.coverImages.forEach((image,index)=>{
                    if(index>0)
                    content=content+'<img src="'+image+'"/><br>';
            })
            this.createAndUpdateTheBlogForm.value.content=this.createAndUpdateTheBlogForm.value.content+content;
            //this.createAndUpdateTheBlogForm.value.content=content;
          }
          if(this.blogTypes.length==0)
            {
                var currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
                this.createAndUpdateTheBlogForm.patchValue({
                    type:currentuser.publishid
                })
            }
          this.createAndUpdateTheBlogForm.value.status=blogStatus;
    // if(this.createAndUpdateTheBlogForm.value.status==3)
    //   {
    //     if(this.createAndUpdateTheBlogForm.value.content=='' || this.createAndUpdateTheBlogForm.value.title=='')
    //       {
    //         this.validateAllFormFields(this.createAndUpdateTheBlogForm);
    //       }
    //       else{
    //         this.isLoaderForEditor=true;
    //       this.publishService.createTheBlogService(this.createAndUpdateTheBlogForm.value,tags)
    //         .subscribe(
    //         (cteateBlogResponse: any) => {
    //           this.createAndUpdateTheBlogForm.patchValue({
    //             status:blogStatus
    //           })
    //           this.isOpenEditor=false;
    //           this.isLoaderForEditor=false;
              
              
    //           //testing script
    //           // var minutes = 1000*60;
    //           // var hours = minutes*60;
    //           // var days = hours*24;
              
    //           // var start_date:any = new Date();
    //           // var end_date:any = new Date(this.createAndUpdateTheBlogForm.value.createdDate);
    //           // var diff_date = Math.round((end_date - start_date)/days);
    //           // this.noofdays=diff_date;
    //           if(this.createAndUpdateTheBlogForm.value.createdDate!='' && this.createAndUpdateTheBlogForm.value.createdDate!=null)
    //           {
    //               this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['YYYY-MM-DD']);
    //               this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
    //           }
    //             else{
    //                this.showPublishedDate='';
    //               this.showPublishedTime='';
    //             }
                
    //           this.getPublishedBlogs(0,20);
    //           this.showRequestIsTaken=true;
              
    //         }, (err) => {
    //                 console.log(err);
    //         }, () => {
              
    //        });

    //       }
    //   }
    // else
    //   {
        if(this.createAndUpdateTheBlogForm.valid)
      {
          this.isLoaderForEditor=true;
          this.buttonsDisabled=true;
          this.publishService.createTheBlogService(this.createAndUpdateTheBlogForm.value,tags)
            .subscribe(
            (cteateBlogResponse: any) => {
              if(cteateBlogResponse.code==404)
                {
                  this.isLoaderForEditor=false;
                  this.buttonsDisabled=false;
                  this.creditsError=true;
                  this.alertMessage=" * Please add some description."
                }
              else if(cteateBlogResponse.status==="error")
                {
                      this.creditsError=true;
                      this.isLoaderForEditor=false;
                      this.alertMessage=cteateBlogResponse.message;
                      this.buttonsDisabled=false;
                      // this.isOpenEditor=false;
                      // this.buttonsDisabled=false;
                      // this.isAlertPopuperror=true;
                      //this.alertMessage="You don't have enough credits to crrate the blog";
                      //this.clearTheForm();
                }
                else{
                  this.createAndUpdateTheBlogForm.patchValue({
                    status:blogStatus
                  })
                  this.isOpenEditor=false;
                  this.isLoaderForEditor=false;
                  
                  //testing script
                  // var minutes = 1000*60;
                  // var hours = minutes*60;
                  // var days = hours*24;
                  // var differenceInCalendarDays = require('date-fns/difference_in_calendar_days');
                  // var diff_date = differenceInCalendarDays(
                  //       new Date(this.createAndUpdateTheBlogForm.value.createdDate),      
                  //       new Date());
                  // var start_date:any = new Date();
                  // var end_date:any = new Date(this.createAndUpdateTheBlogForm.value.createdDate);
                  // var diff_date = Math.round((end_date - start_date)/days);
                  this.noofdays=cteateBlogResponse.daysleft;
                  this.creaditsCount=cteateBlogResponse.credits;
                  
                  if(blogStatus==2){
                        this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['DD MMMM, YYYY']);
                        this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                  }
                  else if(blogStatus==1){
                        //this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['DD MMMM, YYYY']);
                        this.showPublishedDate="Today";
                        this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                  }
                  else if(blogStatus==4 ||blogStatus==3){
                        this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['MMM DD YYYY']);
                        this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                  }
                    this.showRequestIsTaken=true;
                    this.getPublishedBlogs(0,20);
                    this.buttonsDisabled=false;
                  //this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['YYYY-MM-DD']);
                  //this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                    }
            }, (err) => {
                  this.buttonsDisabled=false;
                  var errorMessage= this.errorservice.logError(err);
                  this.isAlertPopuperror=true; 
                  this.alertMessage=errorMessage;
                  this.isLoaderForEditor=false;
            }, () => {
              
           });
      }
      else{
        this.validateAllFormFields(this.createAndUpdateTheBlogForm);
      }
    
    //  }
       
      
}

isLoaderForUpdateBlog:boolean=false;
createdDate="";
createdTime="";
showDateRequired=false;
showTimeRequired=false;
updateTheBlogDirectly(blogStatus) {
  // blog subcategory mandatory.
   var keepGoing = true;
   if(blogStatus!=0||blogStatus!=1)
    {
      if(this.blogTypes.length>0)
        {
          this.blogTypes.forEach(btype=>{

            if(btype.selected)
              {
                  this.blogtypeSelected=true;
                  keepGoing=false;
              }
            else{
              if(keepGoing)
                  this.blogtypeSelected=false;
            }
          });
          if(!this.blogtypeSelected)
            {
                return;
            }
      }
  }
  // blog subcategory mandatory.
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
      this.createAndUpdateTheBlogForm.patchValue({
          title:this.blogViewData.title,
          content:this.blogViewData.text,
          postid:this.blogViewData.postid,
          status:blogStatus,
          image:this.blogViewData.image.url,
          createdDate:this.createdDate,
          createdTime:this.createdTime
      })
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
    this.isStartLoader = true;
    this.buttonsDisabled=true;
    this.publishService.updateBlogService(this.createAndUpdateTheBlogForm.value, tags)
    .subscribe(
    (updateblogResponse: any) => {
                if(updateblogResponse.status==="error")
                { 
                      // this.isIonizeNow = false;  
                      // this.isStartLoader=false;
                      // this.buttonsDisabled=false;
                      // this.isAlertPopuperror=true;
                      // this.alertMessage=updateblogResponse.message;
                      // //this.alertMessage="You don't have enough credits to crrate the blog";
                      // this.clearTheForm();
                      this.creditsError=true;
                      this.isStartLoader=false;
                      this.alertMessage=updateblogResponse.message;
                      this.buttonsDisabled=false;
                }
                else{
                  this.creaditsCount=updateblogResponse.credits;
                  this.isIonizingBlog = false;
                  this.isBlogDraft = false;
                  this.isPublishNow = false;
                  this.isIonizeNow = false;
                  var differenceInCalendarDays = require('date-fns/difference_in_calendar_days');
                  var diff_date = differenceInCalendarDays(
                        new Date(this.createAndUpdateTheBlogForm.value.createdDate),      
                        new Date());
                  // var minutes = 1000*60;
                  // var hours = minutes*60;
                  // var days = hours*24;
                  // var start_date:any = new Date();
                  // var end_date:any = new Date(this.createdDate);
                  // var diff_date = Math.round((end_date - start_date)/days);
                  this.noofdays=updateblogResponse.daysleft;
                  var showPublishedDate=new Date(this.createdDate).toString().split(" ");
                  this.buttonsDisabled=false;
                  //this.showPublishedDate=showPublishedDate[2]+" "+showPublishedDate[1]+" "+showPublishedDate[3];
                  //var showPublishedTime=new Date(this.createdTime).toString().split(" ");
                  //this.showPublishedTime=showPublishedTime[4];
                  // this.showPublishedDate=this.format(this.createdDate, ['YYYY-MM-DD']);
                  // this.showPublishedTime=this.format(this.createdTime, ['hh:mm A']);
                  
                  if(blogStatus==2)
                            {
                                  this.showPublishedDate=this.format(this.createdDate, ['DD MMMM, YYYY']);
                                  this.showPublishedTime=this.format(this.createdTime, ['hh:mm A']);
                            }
                          else if(blogStatus==1){
                                  //this.showPublishedDate=this.format(this.createdDate, ['DD MMMM, YYYY']);
                                  this.showPublishedDate="Today";
                                  this.showPublishedTime=this.format(this.createdTime, ['hh:mm A']);
                          }
                          else if(blogStatus==4)
                            {
                                this.showPublishedDate=this.format(this.createdDate, ['MMM DD YYYY']);
                                  this.showPublishedTime=this.format(this.createdTime, ['hh:mm A']);
                        
                            }
                          this.showRequestIsTaken=true;
                          if(this.router.url == '/publish/calendar') {
                              this.blogCalendarCall();
                          }
                          else{
                              this.getPublishedBlogs(0,20);
                          }
                  //this.getPublishedBlogs(0,20);
                
                  //this.clearTheForm();
                  
                  //this.isLoaderForEditor=false;
                  // if(blogStatus == 1) {
                  //   this.showRequestIsTaken = true;
                  //  // this.alertMessage = 'Blog Published Successfully.';
                  //   } else {
                  //     this.isAlertPopup = true;
                  //     this.alertMessage = 'blog Inoized Successfully.';
                  //   }
                    // this.trendingTopicsData = trendResponse.description;
                }
      
    }, (err) => {
      this.buttonsDisabled=false;
      var errorMessage= this.errorservice.logError(err);
         this.isAlertPopuperror=true;
         this.alertMessage=errorMessage;
         this.isLoaderForUpdateBlog=false;
         this.isStartLoader = false;
    }, () => {
      this.isLoaderForUpdateBlog=false;
      this.isStartLoader = false;
    });
    }
  


}
  blogtypeSelected=true;
  updateTheBlogFromEdit(blogStatus) {
   // blog subcategory mandatory.
    var keepGoing = true;
    if(blogStatus!=0||blogStatus!=1)
    {
    if(this.blogTypes.length>0)
      {
        //var blogtypeSelected=false;
        //for()
          this.blogTypes.forEach(btype=>{

            if(btype.selected)
              {
                  this.blogtypeSelected=true;
                  keepGoing=false;
              }
            else{
              if(keepGoing)
                  this.blogtypeSelected=false;
            }
          });
          if(!this.blogtypeSelected)
            {
                return;
            }
      }
    }
    // blog subcategory mandatory.
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
    var content="";
    if(this.coverImages.length>1)
          {
            this.coverImages.forEach((image,index)=>{
                    if(index>0)
                    content=content+'<img src="'+image+'"/><br>';
            })
            this.createAndUpdateTheBlogForm.value.content=this.createAndUpdateTheBlogForm.value.content+content;
            //this.createAndUpdateTheBlogForm.value.content=content;
          }
   this.createAndUpdateTheBlogForm.value.status=blogStatus;
    // if(this.createAndUpdateTheBlogForm.value.status==3)
    //   {
    //     if(this.createAndUpdateTheBlogForm.value.content=='' || this.createAndUpdateTheBlogForm.value.title=='')
    //       {
    //         this.validateAllFormFields(this.createAndUpdateTheBlogForm);
    //       }
    //       else{
    //         this.isLoaderForUpdateBlog=true;
    //        this.publishService.updateBlogService(this.createAndUpdateTheBlogForm.value,tags)
    //         .subscribe(
    //         (updateblogResponse: any) => {
    //            this.createAndUpdateTheBlogForm.patchValue({
    //               status:blogStatus
    //             })
    //           this.isEditorForEditThePublish=false;
    //           this.isEditorForEditTheDraft=false;
    //           this.isEditorForEditTheOnline=false;
              
              
    //           var minutes = 1000*60;
    //           var hours = minutes*60;
    //           var days = hours*24;
             
    //           if(this.createAndUpdateTheBlogForm.value.createdDate!='' && this.createAndUpdateTheBlogForm.value.createdDate!=null)
    //           {
    //               var start_date:any = new Date();
    //               var end_date:any = new Date(this.createAndUpdateTheBlogForm.value.createdDate);
    //               var diff_date = Math.round((end_date - start_date)/days);
    //               this.noofdays=diff_date;
    //               this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['YYYY-MM-DD']);
    //               this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
    //           }
    //             else{
    //                this.showPublishedDate='';
    //                this.showPublishedTime='';
    //             }
    //           this.showRequestIsTaken=true;
    //           this.isLoaderForUpdateBlog=false;
    //           if(this.router.url == '/publish/calendar') {
    //               this.blogCalendarCall();
    //           }
    //           else{
    //               this.getPublishedBlogs(0,20);
    //           }
             
    //         }, (err) => {

    //         }, () => {
    //           //this.isStartLoader = false;
    //         });
    //       }
    //   }
    // else
    //   {
          if(this.createAndUpdateTheBlogForm.valid)
          {
           this.isLoaderForUpdateBlog=true;
           this.buttonsDisabled=true;
           this.publishService.updateBlogService(this.createAndUpdateTheBlogForm.value,tags)
            .subscribe(
            (updateblogResponse: any) => {
               if(updateblogResponse.code==404)
                {
                  this.isLoaderForUpdateBlog=false;
                  this.buttonsDisabled=false;
                  this.creditsError=true;
                  this.alertMessage=" * Please add some description."
                }
                else if(updateblogResponse.status==="error")
                {
                      this.creditsError=true;
                      this.isLoaderForUpdateBlog=false;
                      this.alertMessage=updateblogResponse.message;
                      this.buttonsDisabled=false;
                      // this.isEditorForEditThePublish=false;
                      // this.isEditorForEditTheDraft=false;
                      // this.isEditorForEditTheOnline=false;
                      // this.isLoaderForUpdateBlog=false;
                      // this.buttonsDisabled=false;
                      // this.isAlertPopuperror=true;
                      // this.alertMessage=updateblogResponse.message;
                      // //this.alertMessage="You don't have enough credits to crrate the blog";
                      // this.clearTheForm();
                }
                else{
                  this.createAndUpdateTheBlogForm.patchValue({
                      status:blogStatus
                  })
                  this.creaditsCount=updateblogResponse.credits;
                  this.isEditorForEditThePublish=false;
                  this.isEditorForEditTheDraft=false;
                  this.isEditorForEditTheOnline=false;
                  this.getPublishedBlogs(0,20);
                  this.showRequestIsTaken=true;
                  //   var differenceInCalendarDays = require('date-fns/difference_in_calendar_days');
                  // var diff_date = differenceInCalendarDays(
                  //       new Date(this.createAndUpdateTheBlogForm.value.createdDate),      
                  //       new Date());
                  // var minutes = 1000*60;
                  // var hours = minutes*60;
                  // var days = hours*24;
                  // var start_date:any = new Date();
                  // var end_date:any = new Date(this.createAndUpdateTheBlogForm.value.createdDate);
                  // var diff_date = Math.round((end_date - start_date)/days);
                  this.noofdays=updateblogResponse.daysleft;
                  this.getPublishedBlogs(0,20);
                  if(blogStatus==2)
                  {
                        this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['DD MMMM, YYYY']);
                        this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                  }
                  else if(blogStatus==1){
                        //this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['DD MMMM, YYYY']);
                        this.showPublishedDate="Today";
                        this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                  }
                  else if(blogStatus==4 ||blogStatus==3||blogStatus==0)
                  {
                        this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['MMM DD YYYY']);
                        this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                  }
                  this.buttonsDisabled=false;
                  //this.showPublishedDate=this.format(this.createAndUpdateTheBlogForm.value.createdDate, ['YYYY-MM-DD']);
                  //this.showPublishedTime=this.format(this.createAndUpdateTheBlogForm.value.createdTime, ['hh:mm A']);
                    this.isLoaderForUpdateBlog=false;

                    if(this.router.url == '/publish/calendar') {
                      this.blogCalendarCall();
                  }
                  else{
                      this.getPublishedBlogs(0,20);
                  }
                }
               
            }, (err) => {
                  this.buttonsDisabled=false;
                  var errorMessage= this.errorservice.logError(err);
                  this.isAlertPopuperror=true;
                  this.alertMessage=errorMessage;
                  this.isLoaderForUpdateBlog=false;

            }, () => {
              //this.isStartLoader = false;
            });
      }
          else{
            this.validateAllFormFields(this.createAndUpdateTheBlogForm);
          }
     // }
      
}


//   ionizeTheBlog(){
//     this.isStartLoader = true;
//     let publish=4;
//     this.publishService.updateBlogService(this.blogViewData,publish)
//     .subscribe(
//     (updateblogResponse: any) => {
//         // this.trendingTopicsData = trendResponse.description;
//     }, (err) => {

//     }, () => {
//       this.isStartLoader = false;
//     });


// }
// Edit the Blog
isEditorForEditThePublish=false;
isEditorForEditTheDraft=false;
isEditorForEditTheOnline=false;

editBlogCall(eachData,type) {
    this.isPageStartLoader=true;
   this.blogTags=[];
   this.getBlogComments(eachData.postid);
   this.publishService.getBlogDetailViewService(eachData.postid).subscribe(data=>{
   if(data.tags.length!=0)
          {
            data.tags.forEach(tag=>{
                this.blogTags.push(tag.title);
            })
          } 
    if(this.blogTypes.length>0)
      {
        this.blogTypes.forEach(category=>{
          if(category.id==data.category.categoryid)
            {
                  category.selected=true;
            }
            else{
                  category.selected=false;
            }
        })
      }
      if(data.published_date==null)
        {
             this.dateChange('');
             this.timeChange('');
             if(data.image.url!=''&& data.image.url!=null)
                this.coverImages.push(data.image.url);
             this.createAndUpdateTheBlogForm.patchValue({
              title:data.title,
              content:data.text,
              postid:data.postid,
              type:data.category.categoryid,
              status:data.published,
              image:data.image.url,
              createdDate:'',
              createdTime:'',
          })
        }
        else{
            this.dateChange(data.publish_up);
            this.timeChange(data.publish_up);
            if(data.image.url!=''&& data.image.url!=null)
                 this.coverImages.push(data.image.url);
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
        }
   
   
       
   if(type=='publish')
    {
      this.isPageStartLoader=false;
        this.isEditorForEditThePublish=true;
    }
    else if(type=='draft')
      {
      //  this.createAndUpdateTheBlogForm.patchValue({
      //   createdDate:'',
      //   createdTime:''
      //  })
      this.isPageStartLoader=false;
        this.isEditorForEditTheDraft=true;
      }
      else{
        this.isPageStartLoader=false;
        this.isEditorForEditTheOnline=true;
      }
   },err=>{
    var errorMessage= this.errorservice.logError(err);
    this.isAlertPopuperror=true;
    this.alertMessage=errorMessage;
    PublishComponent.showDraft=false;
    PublishComponent.showIonized=false;
    this.isPageStartLoader=false;
   },
  ()=>{
    PublishComponent.showDraft=false;
    PublishComponent.showIonize=false;
    PublishComponent.showPublished=false;
    PublishComponent.showIonized=false;
    PublishComponent.showScheduled=false;
  })

  
}
//used for view the blogs of other users. 
isIonizedBlog=false; 
getBlogView(eachData,type) {
    this.isPageStartLoader=true;
    PublishComponent.showDraft=false;
    PublishComponent.showIonize=false;
    PublishComponent.showPublished=false;
    PublishComponent.showIonized=false;
    PublishComponent.showScheduled=false;

    this.blogTags=[];
    this.getBlogComments(eachData.postid);
    this.publishService.getBlogDetailViewService(eachData.postid).subscribe(data=>{
      data.text=this.santizer.bypassSecurityTrustHtml(data.text);
      this.blogViewData=data;
    if(type=='publish')
      {
          this.isPageStartLoader=false;
          this.isIonizedBlog=true;
      }
      else if(type=='draft')
      {
          this.isPageStartLoader=false;
          this.isBlogDraft=true;
      }
      },err=>{
          this.isPageStartLoader=false;
      },
      ()=>{
      })
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
  //    this.isAlertPopup = true;
  //    this.alertMessage = '';
  // }, (err) => {

  // }, () => {
  //   this.isStartLoader = false;
  // });
}
deleteTheBlog(){
  this.isDeleteAlertPopup = false;
   this.isPageStartLoader = true;
  this.publishService.deleteBlogService(this.deleteBlogId)
  .subscribe(
  (blogResponse: any) => {
     
     this.alertMessage = '';
     this.publishedData.splice(this.deleteBlogIndex,1);
  }, (err) => {
    var errorMessage= this.errorservice.logError(err);
    this.isAlertPopuperror=true;
    this.isDeleteAlertPopup = false;
      this.alertMessage=errorMessage;
  }, () => {
    this.isPageStartLoader = false;
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
                this.createAndUpdateTheBlogForm.patchValue({
                    type:btype.id
                })
             }
            else{
               btype.selected=false;
            }    
        })
    }
    else{
      var currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      this.createAndUpdateTheBlogForm.value.type=currentuser.publishid;
    }
    this.isCreateBlog=false;
    this.isOpenEditor=true;
  }
  startTheBlogWithTopic(){
     if(this.blogTitle!="")
        {
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
              this.blogTypes.forEach((btype, index) =>{
                  if(index==0)
                  {
                      btype.selected=true;
                      this.createAndUpdateTheBlogForm.patchValue({
                          type:btype.id
                      })
                  }
                  else{
                    btype.selected=false;
                  }    
                })
        }
        else{
          var currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
          this.createAndUpdateTheBlogForm.value.type=currentuser.publishid;
        }
        this.isTrendingTopicsList=false;
        this.isOpenEditor=true;
  }
  // get tags
  getBlogTags(){
    this.publishService.getBlogTags().subscribe(data=>{
        data.forEach(element => {
            this.autoComplete.push(element.title);
          });
    })
  }
  
// get categories
categories=[];
getCategories(){
    this.publishService.getCategories().subscribe(data=>{
          this.categories=data.description;
          //  data.forEach(element => {
          //   this.autoComplete.push(element.title);
          // });
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
      this.trendingTopicsForNewBlog = trendResponse.description;
    }, (err) => {

    }, () => {
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
  // getBlogTypes(){
  //    this.isStartLoader = true;
  // this.publishService.getBlogTypes().subscribe(
  //   (blogTypes: any) => {
  //     this.blogTypes=blogTypes;
  //   }, (err) => {

  //   }, () => {
  //     this.blogTypes.forEach((btype, index) =>{
  //           if(index==0)
  //            {
  //               btype.selected=true;
  //            }
  //           else{
  //              btype.selected=false;
  //           }
              
  //     })
  //   });
  // }
  // upload publish comment image
  uploadCommentsImage=false;
  uploadPublishImage() {
    this.bigSizeImg=[];
    var bigimgcontinue=false;
    const fileBrowser = this.filePublishInput.nativeElement;
    this.buttonsDisabled=true;
     if (fileBrowser.files && fileBrowser.files[0]) {
      // if(fileBrowser.files[0].size/1024/1024 > 9) {
      //   this.imageUploadAlert = true;
      //   this.imageerrorAlert = false;
      //   // this.imageSrc = "";
      //   this.filePublishInput.nativeElement.value = '';
      //   return false;
      // }
      this.imageUploadAlert = false;
      this.imageerrorAlert = false;
      this.isLoaderForUpdateBlog=true;
      const fd = new FormData();
      for(var key=0;key<fileBrowser.files.length;key++)
      {
        if(fileBrowser.files[key].size/1024/1024 > 9){
          //this.buttonsDisabled=false;
          //this.imageUploadAlert = false;
          this.bigSizeImg.push(fileBrowser.files[key].name + "  size can not exceed 8MB.");
          if(fileBrowser.files.length==1)
            {
              this.buttonsDisabled=false;
              this.isLoaderForUpdateBlog=false;
              return false;
            }
        }else{
          bigimgcontinue=true;
              if(key==0)
              fd.append('file', fileBrowser.files[key]);
              else{
                fd.append('file'+key, fileBrowser.files[key]);
              }
        }
      }
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      //fd.append('file', fileBrowser.files[0]);
      fd.append('userid', currentuser.id);
      fd.append('username', currentuser.username);
      fd.append('password', currentuser.pwd);
      fd.append('encode', 'true');
      fd.append('auth_key', currentuser.auth);
      this.uploadCommentsImage=true;
     if(bigimgcontinue){ 
      this.authService.uploadImageService(fd).subscribe(res => {
       
      // else
         if(res.description==undefined)
        {
              this.isLoaderForUpdateBlog=false;
              this.buttonsDisabled=false;
              this.imageUploadAlert = false;
              //this.imageerrorAlert=true;
        }else{
          if(this.uploadCommentsImage)
            {
                 res.description.forEach(image=>{
                  this.imageSrc.push(image.url);
                })
            }
             
          //this.imageSrc.push(res.description[0].url);
          //this.isStartLoader = false; 
        }
         if(res.errors.fileerror!==undefined)
          {
              this.isLoaderForUpdateBlog=false;
              this.uploadCommentsImage=false;          
              this.buttonsDisabled=false;
              this.imageerrorAlert=true;
          }
        this.uploadCommentsImage=false;       
        this.buttonsDisabled=false;
      },(err) => {
        this.buttonsDisabled=false;
        this.uploadCommentsImage=false;
        var errorMessage= this.errorservice.logError(err);
        this.isLoaderForUpdateBlog=false;
        this.isAlertPopuperror=true;
        this.alertMessage=errorMessage;
        //this.isStartLoader = false;
       }, () => {
         this.uploadCommentsImage=false;
         this.buttonsDisabled=false;
         this.filePublishInput.nativeElement.value = '';
         this.isLoaderForUpdateBlog=false;
        //this.isStartLoader = false;
      });}else{
        this.isLoaderForUpdateBlog=false;
      }
    }
  }
  removeImage(index){
      this.imageSrc.splice(index,1);
      this.imageerrorAlert=false;
      this.imageUploadAlert = false;
      this.imageerrorcoverAlert=false;
  }
  // Publish the blog
  publishTheBlog(blog) {
    this.isPageStartLoader=true;
    this.publishService.getBlogDetailViewService(blog.postid).subscribe( 
    (blogResponse: any) => {
        this.createdDate=blogResponse.publish_up;
        this.createdTime=blogResponse.publish_up;
        this.dateChange(this.createdDate);
        this.timeChange(this.createdDate);
         this.blogViewData = blogResponse;
         this.isPageStartLoader=false;
       if(blogResponse.tags.length!=0)
          {
            blog.tags.forEach(tag=>{
                this.blogTags.push(tag.title);
            })
          }
          this.createAndUpdateTheBlogForm.patchValue({
                    btype:blogResponse.category.categoryid
          })
      //this.postionizeorpublish=blog;
    this.isPublishNow = true;
    PublishComponent.showDraft=false;
    PublishComponent.showIonize=false;
    PublishComponent.showPublished=false;
    PublishComponent.showScheduled=false;
    PublishComponent.showIonized=false;
      //   this.blogTypes.forEach(category=>{
      //   if(category.id==blogResponse.category.categoryid)
      //     {
      //           category.selected=true;
      //           return false;
      //     }
      //     else{
      //           category.selected=false;
      //     }
      // })
    }, (err) => {
      var errorMessage= this.errorservice.logError(err);
      this.isStartLoader=false;
      this.isPageStartLoader=false;
      this.isAlertPopuperror=true;
      this.isPublishNow=false;
      PublishComponent.showIonized=false;
      this.alertMessage=errorMessage;
    }, () => {
    });
    
  }
  // ionize the draft
  //postionizeorpublish="";
  ionizeTheDraft(blog) {
    this.isPageStartLoader=true;
     this.blogTags=[];
    this.publishService.getBlogDetailViewService(blog.postid).subscribe( 
    (blogResponse: any) => { 
      this.isPageStartLoader=false;
      // if(blogResponse.published_date==null)
      //   {
      //     this.createdDate='';
      //     this.createdTime=''
      //     this.dateChange('');
      //     this.timeChange('');
      //   }
      //   else{
          this.createdDate=blogResponse.publish_up;
          this.createdTime=blogResponse.publish_up;
          this.dateChange(this.createdDate);
          this.timeChange(this.createdDate);
        //}
       this.blogViewData = blogResponse;
        if(blogResponse.tags.length!=0)
          {
            blogResponse.tags.forEach(tag=>{
                this.blogTags.push(tag.title);
            })
          }
          if(this.blogTypes.length>0)
      {
        this.blogTypes.forEach(category=>{
          if(category.id==blogResponse.category.categoryid)
            {
                  this.createAndUpdateTheBlogForm.patchValue({
                    type:blogResponse.category.categoryid
                  })
                  category.selected=true;
            }
            else{
                  category.selected=false;
            }
        })
      }
    //this.postionizeorpublish=blog;
    this.isIonizeNow = true;
    PublishComponent.showDraft=false;
    PublishComponent.showIonize=false;
    PublishComponent.showPublished=false;
    PublishComponent.showScheduled=false;
    PublishComponent.showIonized=false;
    }, (err) => {
      var errorMessage= this.errorservice.logError(err);
      this.isAlertPopuperror=true;
      this.isIonizeNow=false;
      this.isPageStartLoader=false;
      PublishComponent.showDraft=false;
      this.alertMessage=errorMessage;
    }, () => {
    });
     
  }
  typeselected(type){
    this.blogTypes.forEach(btype=>{
        btype.selected=false;
        this.blogtypeSelected=true;
        
        if(btype.id==type.id)
          {
            type.selected=true;
            this.createAndUpdateTheBlogForm.patchValue({
                  type:btype.id
            })
            //this.createAndUpdateTheBlogForm.value.type=btype.id;
          }
    })
        // this.createAndUpdateTheBlogForm.patchValue({
        //   type:btype.id
        // })
  }
  deleteCoverImage(i){
    this.coverImages.splice(i,1);
    this.imageerrorAlert=false;
    this.imageUploadAlert = false;
     if(this.coverImages.length>0){
             this.createAndUpdateTheBlogForm.patchValue({
              image:this.coverImages[0]
            })
        }
          else{
             this.createAndUpdateTheBlogForm.patchValue({
              image:''
            })
          }
        
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
    this.imageerrorcoverAlert=false;
    this.coverImageUpload=false;
    this.creditsError=false;
    this.isStartLoader=false;
    this.uploadCommentsImage=false;
    this.isLoaderForUpdateBlog=false;
    this.blogtypeSelected=true;
    this.bigSizeImg=[];
    this.bigSizecoverImg=[];
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
    this.imageUploadAlert = false;
    this.enablePublish=false;
    this.enableSchedule=false;
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
    this.showCommentErrorMsg="";
    if(this.router.url == '/publish/selecttopic' || this.router.url =='/publish/newpost')
      {
          this.router.navigate(['publish']);
      }
  }
  validateAllFormFields(formGroup: FormGroup) {         //{1}
        Object.keys(formGroup.controls).forEach(field => {  //{2}
          const control = formGroup.get(field);             //{3}
              if (control instanceof FormControl) {             //{4}
                  control.markAsTouched({ onlySelf: true });
              } else if (control instanceof FormGroup) {        //{5}
                  this.validateAllFormFields(control);            //{6}
              }
        });
   }
  // validateAllFormFields(formGroup: FormGroup) {         //{1}
  //       Object.keys(formGroup.controls).forEach(field => {  //{2}
  //         const control = formGroup.get(field);             //{3}
  //         if (control instanceof FormControl) { 
  //           if(this.draftCurrentClass!=='save')          //{4}
  //                control.markAsTouched({ onlySelf: true });
  //           else{
  //             if(field=='createdDate' ||field=='createdTime')
  //               {}
  //               else{
  //                 control.markAsTouched({ onlySelf: true });
  //               }
  //           }
  //         } else if (control instanceof FormGroup) {        //{5}
  //           //this.validateAllFormFields(control);            //{6}
  //            if(this.draftCurrentClass!=='save')          //{4}
  //                this.validateAllFormFields(control);
  //           else{
  //             if(field=='createdDate' || field=='createdTime')
  //               {}
  //               else{
  //                 this.validateAllFormFields(control);
  //               }
  //           }
  //         }
  //       });
  //  }
       validateAddTopicFormFields(formGroup: FormGroup) {         //{1}
              Object.keys(formGroup.controls).forEach(field => {  //{2}
                const control = formGroup.get(field);             //{3}
                if (control instanceof FormControl) {             //{4}
                  control.markAsTouched({ onlySelf: true });
                } else if (control instanceof FormGroup) {        //{5}
                  this.validateAddTopicFormFields(control);            //{6}
                }
        });
  this.isStartLoader=false;
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
        if(this.createAndUpdateTheBlogForm.value.title == '' && this.createAndUpdateTheBlogForm.value.content==''){
          this.isOpenEditor=false;
          this.isEditorForEditTheDraft=false;
          this.isEditorForEditThePublish=false;
          this.clearTheForm();
        }
        else{
          if (window.confirm("Do you really want to leave?")) { 
            this.clearTheForm();
            this.isOpenEditor=false;
            this.isEditorForEditTheDraft = false;
            this.isEditorForEditThePublish=false;
          }
          
        }
       
      }
       
      //format(date, [format], [options])
      showDate="";
      showDay="";
      showMonth="";
      showTime="";
      enablePublish=false;
      enableSchedule=false;
      stopTimes="";
      //today_date=new Date();
      dateChange(createdDate){
        var format = /[-]+/;
        var today_date=new Date();
        today_date.setHours(0,0,0,0);
        if(format.test(createdDate)){
          createdDate=new Date(createdDate.replace(/-/g, "/"));
          }
        createdDate.setHours(0,0,0,0);
        if(createdDate==''||createdDate==null)
          {
              this.showDate='';
              this.showDay= '';
              this.showMonth='';
              this.enablePublish=false;
              this.enableSchedule=false;
          }
          else{
          // var current_date=this.format(today, ['DD']);
          // var current_month=this.format(today, ['MM']);
          // var current_year=this.format(today, ['YYYY']);
          // var selected_month=this.format(createdDate, ['MM']);
          // var selected_year=this.format(createdDate, ['YYYY']);
          this.showDate=this.format(createdDate, ['DD']);
          this.showDay= this.format(createdDate, ['ddd']);
          this.showMonth=this.format(createdDate, ['MMMM']);
        if(createdDate.getTime()>today_date.getTime())
          {
              this.stopTimes='';
              this.enablePublish=true;
              this.enableSchedule=false;
          }
          else{
              this.stopTimes=this.format(today_date, ['YYYY-MM-DD HH:mm:ss']);
              this.enablePublish=false;
              this.enableSchedule=true;
          }
        // if(current_date===this.showDate && current_month==selected_month && current_year== selected_year)
        //   {
             
        //   }
        //   else{
              
        //   }
          }
        
      }
       timeChange(createdTime){
        //format(input10Moment, ['yyyy-mm-dd'])
        if(createdTime!='')
          {
              this.showTime=this.format(createdTime, ['hh:mm a']);
          }
          else{
              this.showTime='';
          }
        
        //this.showDay= this.format(input10Moment, ['ddd']);
        //this.showMonth=this.format(input10Moment, ['MMMM']);
      }
      putDateAndTimeAsEmpty(){
        this.createAndUpdateTheBlogForm.patchValue({
          createdDate:'',
          createdTime:''
        })
        this.showTime='';
        this.showDate='';
        this.showDay='';
        this.showMonth='';
      }
}