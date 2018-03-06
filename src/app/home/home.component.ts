import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../shared/services/dashboard/dashboard.service';
import { PromotionsService } from '../shared/services/promotions/promotions.service';
import { ICarouselConfig, AnimationConfig } from 'angular4-carousel';
import { NgxCarousel } from 'ngx-carousel';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import { FormBuilder, FormControl, FormGroup,FormArray } from '@angular/forms';
import { LeadsService,DataService } from '../shared/services/leads/leads.service';
import { IonServer } from '../shared/globals/global';
import { PublishService } from '../shared/services/publish/publish.service';
import { QueriesService } from '../shared/services/queries/queries.service';
declare var require: any;
import { ErrorService } from '../shared/services/error/error.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [DashboardService, PromotionsService,AuthserviceService,LeadsService,PublishService,QueriesService,ErrorService]
})
export class HomeComponent implements OnInit {
    format = require('date-fns/format');
  today=new Date();
  stopDates=this.format(this.today, ['YYYY-MM-DD']);
dashboardData: any = [];
dashboardFeedData: any = [];
blogCommentsData: any = [];
quriesResponse:any=[];
questionId: any = '';
loginUserId: number;
homeimageSrc: any = [];
sliderFullView:any=[]; 
currentuser=localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
loginUserGroupId=this.currentuser.userGroup;
//today=new Date();
//stopDates=this.today.getFullYear()+"-"+(this.today.getMonth()+1)+"-"+this.today.getDate();
isStartLoader;
imageSrc: any = '';
notificationsData: any = [];
isPromoPopupOpen: boolean = false;
isSelectSlider:boolean=false;
publishOrNot:boolean=true;
publishOrNotValue:number=1;
isAddtoQuickReply:boolean=false;
isEditLead: boolean = false;
imageerrorAlert:boolean=false;
imageUploadAlert: boolean = false;
isSelectPromo: boolean = false;
numLength:number=0;
isPromoSelected: boolean = false;
isSelectAddLeads:boolean=false;
alertMessage: string = '';
isShowImgDeleteButt:boolean=false;
isSelectReplayPop:boolean=false;
promotionsData: any = [];
public imageSources: string[] = [];
public config: ICarouselConfig;
isSelectBlog: boolean = false;
images: any[] = [];
leadId: number;
isReplyEmpty=false;
phoneMinlength:boolean=false;
@ViewChild('fileInput') fileInput;
@ViewChild('fileQuerieInput') fileQuerieInput;
tags: string = '';
isAlertPopup: boolean = false;
spaceComment=IonServer.Space_Not_required;  
f_name_req_comm=IonServer.f_name_required;
l_name_required_comm=IonServer.l_name_required;
f_name_length_comm=IonServer.f_name_length;
email_required_comm=IonServer.email_required;
invalid_email_comm=IonServer.invalid_email;
num_required_comm=IonServer.num_required;
promotion_Social_imgpath=IonServer.promotion__imgpath;
imgerror="Choose Only Image.";
imgsize="The file size can not exceed 8MB.";
leadForm: FormGroup = this.builder.group({
  firstname: new FormControl(''),
  surname: new FormControl(''),
  email: new FormControl(''),
  phone: new FormControl(''),
  sex: new FormControl('Male'),
  dob: new FormControl(''),
  city: new FormControl(''),
  area: new FormControl(''),
  remarks: new FormControl(''),
  ctags:new FormControl(''),
  ptype:new FormControl(''),
  age:new FormControl(''),
  id:new FormControl(''),
  source:new FormControl('')
});
checkboxGroup: FormGroup;
gender=[{checked:true},{checked:false}];
autoComplete=[];

public carouselBannerItems: Array<any> = [];
public carouselBanner: NgxCarousel;
constructor(private router: Router,private leadsService: LeadsService,private authService: AuthserviceService,private builder: FormBuilder, private dashboardService: DashboardService, private promotionService: PromotionsService,private Publishservice:PublishService,private quriesService: QueriesService,private errorservice:ErrorService,private santizer:DomSanitizer) {

 }

  ngOnInit() {
    if (localStorage.getItem('user') == null || localStorage.getItem('user') == '') {
      this.router.navigate(['login']);
    } else {
         this.leadsService.getLeadTags().subscribe(res => {
         res.description.forEach(element => {
                this.autoComplete.push(element.title);
              });
          },(err) => {
          }, () => {
            
          })
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      this.getDashboardStatistics();
        const OneSignal = window['OneSignal'] || [];
      OneSignal.push(['init', {
        appId: 'ef7de815-6fae-466b-8f5b-ea582555a873',
        notificationClickHandlerMatch: 'focus',
        autoRegister: true,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false
        }
      }]);
      // OneSignal.push(function () {
      //   console.log('Register For Push');

      //   OneSignal.push(["registerForPushNotifications"])
      // });
      OneSignal.push(function () {
        // Occurs when the user's subscription changes to a new value.
        OneSignal.on('subscriptionChange', function (isSubscribed) {
          // console.log("The user's subscription state is now:", isSubscribed);
          OneSignal.getUserId().then(function (userId) {
            // console.log("User ID is", userId);
          });
        });
      });
      OneSignal.push(['sendTags', {'userid': currentuser.id,'categoryid':currentuser.publishid,'teamid':currentuser.teamid}]); 
    }
     //OneSignal.push(['sendTag', 'userid', currentuser.id]); 
    // const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    // this.getDashboardStatistics();
    // if(currentuser.onesignal==='')
    //   {
    //         currentuser.onesignal='done';
    //         localStorage.setItem("user",JSON.stringify(currentuser));
    //         const OneSignal = window['OneSignal'] || [];
    //         OneSignal.push(['init', {
    //                 appId: 'ef7de815-6fae-466b-8f5b-ea582555a873',
    //                   //notificationClickHandlerMatch: 'focus',
    //                   //autoRegister: true,
    //                   //allowLocalhostAsSecureOrigin: true,
    //                   // notifyButton: {
    //                   //   enable: false
    //                   // }
    //         }]);

    //         OneSignal.push(function () {
    //           OneSignal.push(["registerForPushNotifications"])
    //         });
    //           //OneSignal.push(['sendTag', 'userid', currentuser.id]); 
    //           OneSignal.push(['sendTags', {'userid': currentuser.id,'categoryid':currentuser.publishid,'teamid':currentuser.teamid}]); 
    //         }
     
    //   }
   
    
    this.carouselBanner = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 300px;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngxcarouselPoint li.active {
              background: white;
              width: 10px;
          }
        `
      },
      load: 2,
      loop: true,
      touch: true
    }
  }
 
get user(): any {
  return JSON.parse(localStorage.getItem('user'));
}
  getDashboardStatistics() {
    this.isStartLoader = true;
    this.dashboardService.getDashboardStatistics().subscribe(
      (dashboardResponse: any) => {
         localStorage.setItem('queries', JSON.stringify({
              unanswered: dashboardResponse.description[0].unanswered,
              answered:dashboardResponse.description[0].answered,
              popular: dashboardResponse.description[0].popular,
          }));
             localStorage.setItem('blogs', JSON.stringify({
              draft: dashboardResponse.description[0].draft,
              publish:dashboardResponse.description[0].publish,
              online: dashboardResponse.description[0].online,
          }));
        this.dashboardData = dashboardResponse.description;
      }, (err) => {
        var errorMessage= this.errorservice.logError(err);
        this.isStartLoader = false;
        this.isAlertPopup=true;
        this.alertMessage=errorMessage;
      }, () => {        
        this.getDashboardFeeds();       
      });

  }
selectPromo(eachpromotion){
  this.router.navigate(['promotions/promotiondemo',eachpromotion.id,eachpromotion.avatar,eachpromotion.title]);
}
  // Get dashboard feeds
  getDashboardFeeds() {
    this.isStartLoader = true;
    this.dashboardService.getDashboardFeeds().subscribe(
      (dashboardResponse: any) => {
        this.dashboardFeedData = dashboardResponse.description;
      }, (err) => {
        var errorMessage= this.errorservice.logError(err);
        this.isStartLoader = false;
        this.isAlertPopup=true;
        this.alertMessage=errorMessage;
      }, () => {
        this.getDashboardNotifications();
      });

  }
  // Get dashboard feeds
  getDashboardNotifications() {
    this.isStartLoader = true;
    this.dashboardService.getDashboardNotificationFeeds().subscribe(
      (feedsResponse: any) => {
        this.notificationsData = feedsResponse.data;
      }, (err) => {
        var errorMessage= this.errorservice.logError(err);
        this.isStartLoader = false;
        this.isStartLoader = false;
        this.isAlertPopup=true;
        this.alertMessage=errorMessage;
      }, () => {
        this.isStartLoader = false;
        this.config = {
          verifyBeforeLoad: true,
          log: false,
          animation: true,
          animationType: AnimationConfig.SLIDE,
          autoplay: true,
          autoplayDelay: 2000,
          stopAutoplayMinWidth: 768
        };
        this.carouselBannerLoad();
      });

  }
  public carouselBannerLoad() {  
    const len = this.carouselBannerItems.length;
    if (this.notificationsData.length > 0 && len==0 ) {
      this.carouselBannerItems=this.notificationsData;
      // for (let i = 0; i < this.images.length; i++) {
      //   this.carouselBannerItems=this.images;
      // }
    }
  }
  getBlogComments(bid) {
    this.blogCommentsData=[];
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    this.loginUserId = currentuser.id;
    this.isStartLoader = true;
    this.Publishservice.getBlogCommentsService(bid).subscribe(
      (blogResponse: any) => {
        this.blogCommentsData = blogResponse.description;
      }, (err) => {
        var errorMessage= this.errorservice.logError(err);
        this.isStartLoader = false;
        this.isAlertPopup=true;
        this.alertMessage=errorMessage;
      }, () => {
        this.isStartLoader = false;
      });
  }
  testingFunction(id){
      this.isStartLoader = true;
      this.Publishservice.getBlogDetailViewService(id).subscribe(
        (blogResponse: any)=>{
         blogResponse.text= this.santizer.bypassSecurityTrustHtml(blogResponse.text);
         this.sliderFullView=blogResponse;
        this.isSelectSlider=true;
      },(err)=> {
        this.isStartLoader = false;
        this.isSelectSlider=false;
        this.isAlertPopup=true;
        var errorMessage= this.errorservice.logError(err);
        this.alertMessage=errorMessage;
      },()=>{
        this.isStartLoader = false;
      });
      this.getBlogComments(id);
      
  }
  ConvertToInt(val) {
    return parseInt(val);
  }

  // get promotions
  getPromotionsCall() {
    this.isSelectPromo = false;
    this.isPromoPopupOpen = false;
    this.isPromoSelected = true;
    this.isStartLoader = true;
    this.promotionService.getPromotionsData().subscribe(
      (promotionResponse: any) => {
        this.promotionsData = promotionResponse;
      }, (err) => {
        var errorMessage= this.errorservice.logError(err);
        this.isStartLoader = false;
        this.isAlertPopup=true;
        this.alertMessage=errorMessage;
      }, () => {
        this.isStartLoader = false;
      });

  }

  // congratulate

  congaratulate(id){
    this.isStartLoader = true;
    this.dashboardService.congartulate(id).subscribe(
      (congratulateResponse: any) => {
        // this.notificationsData = feedsResponse.data[0];
        this.getDashboardFeeds();
      }, (err) => {
       // this.isStartLoader = false;
       var errorMessage= this.errorservice.logError(err);
        this.isAlertPopup=true;
        this.alertMessage=errorMessage;
      }, () => {
        //this.isStartLoader = false;
      });
    
  }
     congaratulated(id){
    this.dashboardService.congartulated(id).subscribe(
      (congratulateResponse: any) => {
        // this.notificationsData = feedsResponse.data[0];
        this.getDashboardFeeds();
      }, (err) => {
        var errorMessage= this.errorservice.logError(err);
        this.isStartLoader = false;
        this.isAlertPopup=true;
        this.alertMessage=errorMessage;
      }, () => {
        this.isStartLoader = false;
      });
    
  }

 //addleads
 buttonsDisbled=false;
 // upload image
upload() {
  
  let fileBrowser = this.fileInput.nativeElement; 
   if (fileBrowser.files && fileBrowser.files[0]) {       
    if(fileBrowser.files[0].size/1024/1024 > 9) {
      this.imageUploadAlert = true;
      this.imageerrorAlert=false;
      this.imageSrc = "";
      this.fileInput.nativeElement.value = '';
      return false;
    }
    this.imageUploadAlert = false;
    this.imageerrorAlert = false;
    this.isStartLoader = true;
    const fd = new FormData();
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    fd.append('file', fileBrowser.files[0]);
    fd.append('userid', currentuser.id);
    fd.append('username', currentuser.username);
    fd.append('password', currentuser.pwd);
    fd.append('encode', 'true');
    fd.append('auth_key', currentuser.auth);
    this.buttonsDisbled=true;
    this.authService.uploadImageService(fd).subscribe(res => {
      // do stuff w/my uploaded file
      if(res.description==undefined){
        this.imageUploadAlert = false;
        this.imageerrorAlert=true;
      }else{
        this.imageSrc = res.description[0].url;
         this.isShowImgDeleteButt=true;
      }
      this.buttonsDisbled=false;
    
    },(err) => {
      this.buttonsDisbled=false;
      var errorMessage= this.errorservice.logError(err);
      this.isStartLoader = false;
      this.isAlertPopup=true;
      this.alertMessage=errorMessage;
     }, () => {
      this.fileInput.nativeElement.value = '';
       setTimeout (() => {
            this.isStartLoader = false;
    }, 3000)
    });
  }
}
 uploadImgeDelete(){
  this.imageSrc="";
   this.isShowImgDeleteButt=false;
  this.imageerrorAlert=false;
  this.imageUploadAlert = false;
}
clearForm() {
  this.imageSrc='';
  this.imgsize='';
  this.isReplyEmpty=false;
  this.isAddtoQuickReply=false;
  this.imgerror='';
  this.homeimageSrc=[];
  this.leadForm.reset();
  this.isShowImgDeleteButt=false;
  this.gender[0].checked=true;
  this.gender[1].checked=false;
  this.leadForm.patchValue({
    firstname: '',
    surname: '',
    email: '',
    phone: '',
    amount_due: '',
    doctor: '',
    sex: '',
    dob: '',
    city: '',
    area: '',
    remarks: '',
    ctags:'',
    age:''
  });
}
// calculate age function
dobSelected(dob){
  var date=dob;
  var dd:any=date.getDate();
  var mm:any=(date.getMonth()+1);

  if(dd<10){
    dd='0'+dd;
  } 
  if(mm<10){
    mm='0'+mm;
  } 
  this.leadForm.patchValue({
    dob:date.getFullYear()+"-"+mm+"-"+dd
  })
  //this.visitForm.value.dob=date.getFullYear()+"-"+mm+"-"+dd;
  this.calculateAge(new Date(dob),new Date());
}
calculateAge(dateOfBirth, dateToCalculate) {
  
                 let age = dateToCalculate.getFullYear() - dateOfBirth.getFullYear();
                 let ageMonth = dateToCalculate.getMonth() - dateOfBirth.getMonth();
                 let ageDay = dateToCalculate.getDate() - dateOfBirth.getDate();
 
                 if (ageMonth < 0 || (ageMonth == 0 && ageDay < 0)) {
                     age =age - 1;
                 }
                 this.leadForm.patchValue({
                   age:age
                 })
         }

 onTypeNumValid(numValue) { 
  this.numLength=numValue.length; 
      if(numValue.length > 10 ){
        this.phoneMinlength=true;
      }
      else{
         this.phoneMinlength=false;
      }
  }
// add lead call

addLeads() {
  if(this.numLength!=10 && this.numLength!=0)
         {
            this.phoneMinlength=true;
         }
         else{
           this.phoneMinlength=false;
         }
   this.tags="";
  // //this.leadForm.value.id=this.leadId;
  this.isStartLoader = true;
 
  if(this.leadForm.value.dob!="0000-00-00" && this.leadForm.value.dob!='')
  {
  this.calculateAge(new Date(this.leadForm.value.dob),new Date());
  var format = require('date-fns/format');
  var created_date=format(new Date(this.leadForm.value.dob), ['YYYY-MM-DD']);
  this.leadForm.value.dob=created_date;
  }
  
       if(this.leadForm.value.ctags !==undefined && this.leadForm.value.ctags.length != 0)
       {
           for(let i=0; i<this.leadForm.value.ctags.length; i++)
             {
               // this.tags +=this.leadForm.value.ctags[i].value +",";
             if(typeof this.leadForm.value.ctags[i].value != "undefined")
               {
                   this.tags +=this.leadForm.value.ctags[i].value + ',';
               } else {
                   if(this.leadForm.value.ctags[i] != '') {
                   this.tags += this.leadForm.value.ctags[i] + ',';
                   }
                 }
             }
       }
   this.leadForm.value.ctags=this.tags;
   this.leadForm.value.image = this.imageSrc;
   
       if(this.leadForm.value.sex=='')    
           this.leadForm.value.sex="Male";
       if (this.leadForm.valid  &&  !this.phoneMinlength ) {
                 this.leadsService.addLeadService(this.leadForm.value).subscribe(
                     (leadResponse: any) => {
                       if(leadResponse.status === 'success' ||leadResponse.status==='ok') {
                         this.isAlertPopup = true;
                         this.alertMessage = 'Lead added successfully.';
                           this.isSelectAddLeads=false;
                       }
                     }, (err) => {
                      var errorMessage= this.errorservice.logError(err);
                      this.isAlertPopup=true;
                      this.isSelectAddLeads=false;
                      this.alertMessage=errorMessage;
                      this.isStartLoader = false;
                     }, () => {
                       this.isStartLoader = false;
                       this.clearForm();
                     });
       } else {
         this.validateAllFormFields(this.leadForm); 
         this.isStartLoader = false;
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
   this.isStartLoader=false;
}

replayQueries(id){
  this.isStartLoader=true;
  this.questionId=id;
    this.quriesService.getDetailQuerie(id).subscribe((querieRes: any)=>{
      this.quriesResponse=querieRes.posts;
      this.isStartLoader = false;
      this.isSelectReplayPop=true;
    },(err)=>{
      var errorMessage= this.errorservice.logError(err);
      this.isAlertPopup=true;
      this.isSelectReplayPop=false;
      this.alertMessage=errorMessage;
      this.isStartLoader = false;
    },()=>{});
}
// upload publish comment image
uploadImage() {
  
  const fileBrowser = this.fileQuerieInput.nativeElement;
  // if (fileBrowser.files && fileBrowser.files[0]) {
    if(fileBrowser.files[0].size/1024/1024 > 9) {
      this.imageUploadAlert = true;
      this.imageerrorAlert = false;
      // this.imageSrc = "";
      this.fileQuerieInput.nativeElement.value = '';
      return false;
    }
    this.isStartLoader = true;
    this.imageerrorAlert = false;
    this.imageUploadAlert = false;
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
      if(res.description==undefined)
      {
            this.imageUploadAlert = false;
            this.imageerrorAlert=true;
      }else{
        res.description.forEach(image=>{
          this.homeimageSrc.push(image.url);
        })
       //this.homeimageSrc.push(res.description.url);
        this.isStartLoader = false;          
      }
    },(err) => {
      var errorMessage= this.errorservice.logError(err);
      this.isStartLoader = false;
      this.isAlertPopup=true;
      this.alertMessage=errorMessage;
     }, () => {
      this.fileQuerieInput.nativeElement.value = '';
      this.isStartLoader = false;
    });
}
  removeImage(index){
    this.homeimageSrc.splice(index,1);
    this.imageerrorAlert=false;
    this.imageUploadAlert = false;
  }
  omit_special_char(event) {
    var k;  
    k = event.charCode; 
    return(k!=35);
  }
  answerAQuerie(replyData, qId){

    if(this.publishOrNot==true)
    {
      this.publishOrNotValue=0;
    }
    else{
      this.publishOrNotValue=1;
    }
    replyData=replyData.trim();
    if(replyData=='')
    {
      this.isReplyEmpty=true;
    }
    else{
      var attachments="";
      if(this.homeimageSrc.length>0)
        {
          attachments="&attachments="+this.homeimageSrc.length;
          this.homeimageSrc.forEach((image,key)=>{
            attachments=attachments+"&attachment"+(key+1)+"="+image;
          })
        }
        
        this.isStartLoader = true;
        this.quriesService.addAnswerToQuerie(btoa(replyData), qId,this.publishOrNotValue,attachments).subscribe(
        (qResponse: any) => {
          this.homeimageSrc=[];
          this.isSelectReplayPop=false;
          this.isAlertPopup=true;
          this.alertMessage="Reply Added Successfully."
        }, (err) => {
               console.log(err);
               var errorMessage= this.errorservice.logError(err);
               this.isStartLoader=false;
               this.isAlertPopup=true;
               this.alertMessage=errorMessage;
        }, () => {
          this.isStartLoader = false;
                if (this.isAddtoQuickReply) {
                        this.quriesService.addQuerieReplyTemplate(btoa(replyData)).subscribe(
                          (qResponse: any) => {
                            this.isAddtoQuickReply=false;
                          }, (err) => {
                            var errorMessage= this.errorservice.logError(err);
                            this.isStartLoader = false;
                            this.isAlertPopup=true;
                            this.alertMessage=errorMessage;
                          }, () => {
                            this.isStartLoader = false;
                          });
                }
        });
    }
    
  }















}

