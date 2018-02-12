import { Component, OnInit,ViewChild,HostListener} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PromotionsService } from '../shared/services/promotions/promotions.service';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import { LeadsService ,DataService} from '../shared/services/leads/leads.service';
import { IonServer } from '../shared/globals/global';
@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  providers: [PromotionsService,AuthserviceService,LeadsService],
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  promotionsData: any = [];
  ionizedBlogData: any = [];
  isStartLoader=false;
  isPromotionFullView: boolean = false;
  isPromotionDemo: boolean = false;
  isSMSPromotion: boolean = false;
  isPatientGroups: boolean = false;
  isOpenEditor:boolean=false;
  promotionId:string='';
  showRequestIsTaken=false;
  submitEnabled: boolean = false;
  ionizedPromotionTitle="";
  showErrorForSms:boolean=false;
  connect_err=IonServer.nointernet_connection_err;
  currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  smsBalance=this.currentuser.smsbalance;
   @ViewChild('fileInput') fileInput;
   imageSrc=[];
   smsTags:any=[];
   selectedTags:any=[];
   phoneNumbers:string="";
   sendSmsTags:string="";
   images:any=[];
   aboutImages:string="";
   promotionImage:string="";
   promotionTitle:string="";
   showError:boolean=false;
   promotionStatus:any='';
   imageUploadAlert: boolean = false;
   showtextareaError:boolean=false;

  constructor(private router: Router, private promotionService: PromotionsService, 
    private route: ActivatedRoute,private authService:AuthserviceService, private leadsService: LeadsService) { }

  ngOnInit() {
    if (localStorage.getItem('user') == '' || localStorage.getItem('user')==null) {
      this.router.navigate(['login']);
    } else {
    this.getPromotions();
    this.getSmsTags();
    this.route.params.forEach((params: Params) => {
      if (params.view != '' && params.view == 'fullview') {
        this.isPromotionFullView = true;
        this.isPromotionDemo = false;
        this.isSMSPromotion = false;
      }
    });
    this.route.params.forEach((params: Params) => {
      if (params.view != '' && params.view == 'promotiondemo' &&params.id!='') {
        this.promotionId=params.id;
        this.promotionImage=params.avatar;
        this.promotionTitle=params.title;
        this.isPromotionFullView = false;
        this.isPromotionDemo = true;
        this.isSMSPromotion = false;
      }
    });
    this.route.params.forEach((params: Params) => {
      if (params.view != '' && params.view == 'smspromotions') {
        this.phoneNumbers=DataService.dataFromService;
        DataService.dataFromService='';
        this.isPromotionFullView = false;
        this.isPromotionDemo = false;
        this.isSMSPromotion = true;
      }
    });
  
    if(this.selectedTags == '' || this.phoneNumbers == '')
    {
      this.submitEnabled=false;
    }
    else{
      this.submitEnabled=true;
    }
    }
    
  }
  
  // event trigger function
  onEventChanged(ptype: any) {
    this.isStartLoader=true;
    if(ptype === 'smspromotion') {
      this.isPromotionFullView = false;
      this.isPromotionDemo = false;
      this.isSMSPromotion = true;
      this.isStartLoader=false;
    } else if(ptype === 'designposters') {
      this.isPromotionFullView = false;
      this.isPromotionDemo = false;
      this.isSMSPromotion = false;
    }
  }
 // Getting promotions
 getPromotions() {
  this.isStartLoader = true;
  this.promotionService.getPromotionsData().subscribe(
    (promotionResponse: any) => {
      this.promotionsData = promotionResponse;
    }, (err) => {
      this.isStartLoader = false;
      this.isAlertPopup=true;
      this.alertMessage=this.connect_err;
    }, () => {
      this.isStartLoader = false;
      this.getIonizedBlogsData();
    });
}
 // get Inonized blogs
 getIonizedBlogsData() {
  this.isStartLoader = true;
  this.promotionService.getIonizedBlogs().subscribe(
    (blogResponse: any) => {
      this.ionizedBlogData = blogResponse.data;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
    });
}
// promotions full view call
promotionFull() {
 this.router.navigate(['promotions/fullview']);
 this.getPromotions();
}
// promotion demo func
promotionDemo(eachpromotion) {
  this.router.navigate(['promotions/promotiondemo',eachpromotion.id,eachpromotion.avatar,eachpromotion.title]);
}
// add promotion
addPromotion() {

}
getPatientGroups() {
  this.isPatientGroups = true;
}
upload(){
   this.showError=false;
  const fileBrowser = this.fileInput.nativeElement;
  // if (fileBrowser.files && fileBrowser.files[0]) {
    if(fileBrowser.files[0].size/1024/1024 > 9) {
      this.imageUploadAlert = true;
      // this.imageSrc = "";
      this.fileInput.nativeElement.value = '';
      return false;
    }
    this.isStartLoader = true;
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
      if(res.description[0].url !== '') {
         res.description.forEach(image=>{
          this.imageSrc.push(image.url);
        });
        // this.imageSrc = res.description[0].url;
        // this.images[0]=res.description[0].url;
        
        this.isStartLoader = false;
      }
    },(err) => {
 this.isAlertPopup=true;
 this.alertMessage=this.connect_err;
 this.isStartLoader = false;
     }, () => {
      this.isStartLoader = false;
    });
}
  removeImage(index){
      this.imageSrc.splice(index,1);
  }

 getSmsTags(){
    var alltag={'title':'all'};
    this.leadsService.getLeadTags().subscribe(res => {
        this.smsTags=res.description;
        if(res.description.length>0)
            this.smsTags.push(alltag);
      },(err) => {
      }, () => {
        this.smsTags.forEach((smsTag) => {
          smsTag.isSelectedclass = '';
          smsTag.isChecked=false;
        });
      })
  }

    selectedGroups=[];
     selectPatientGroup(indx) {
      this.notselectTags=false;
      if(this.smsTags[indx].isSelectedclass === 'selected') {
        this.smsTags[indx].isSelectedclass = '';
        var index=this.selectedGroups.indexOf(indx);
        this.selectedGroups.splice(index,1);
         
      }else {
        this.selectedGroups.push(indx);
        this.smsTags[indx].isSelectedclass = 'selected';
      }
  }
  deSelectPatientgroups(){
    this.notselectTags=false;
     if(this.selectedTags.length==0)
      {
          for(let tags of this.smsTags)
          {
            tags.isSelectedclass='';
          }
      }
      else
        {
          for(let tags of this.smsTags)
            {
                  for(let selected of this.selectedTags)
                  if(tags.title===selected)
                    {
                      tags.isSelectedclass="selected";
                      break;
                    }
                    else{
                       tags.isSelectedclass='';
                    }
            }

        }
        

  }
notselectTags:boolean=false;
  seceltedGroups(){
     if(this.selectedGroups.length == 0 && this.sendSmsTags==''){
        this.notselectTags=true;
        this.isPatientGroups=true;
      }
      else{
           this.sendSmsTags=""; 
      for(let tag of this.smsTags){
        if(tag.isSelectedclass=='selected')
            {
                this.sendSmsTags=this.sendSmsTags+tag.title+",";
            }
      }
    var tags=this.sendSmsTags.split(',')
    //this.sendSmsTags=finaltags;
    tags.pop();
    this.selectedTags=tags;
    this.isPatientGroups=false;
      }
  }
  smsText="";
  isAlertPopup=false;
  showErrorForSmsContent=false;
  alertMessage="Messages Are Delivered Successfully."
  isSendSmspopup=false;
  sendSmsToUsers(){
          this.isStartLoader=true;
          this.selectedTags=[];
          this.smsText=this.smsText.replace(/&/g, "%26");
          if(this.sendSmsTags!=''){
         
          this.promotionService.SEND_SMS_USING_TAGS(this.sendSmsTags,this.smsText).subscribe(res => {
           if(this.phoneNumbers!='')
            {
                 this.promotionService.SEND_SMS_USING_PHONE_NUMBERS(this.phoneNumbers,this.smsText).subscribe(res => {
                 },(err) => {
                   this.isStartLoader=false;
                    }, () => {
                      this.isStartLoader=false;
                    })
            }
           // alert("message sended successfully");
          },(err) => {
            this.isStartLoader=false;
          }, () => {
          this.isStartLoader=false;
          this.phoneNumbers="";
          this.sendSmsTags="";
          this.smsText="";
          this.isAlertPopup=true;
          this.getSmsTags();
          })
          
          // this.promotionService.sendSms()
      }
        else if(this.phoneNumbers!=''){
                 this.promotionService.SEND_SMS_USING_PHONE_NUMBERS(this.phoneNumbers,this.smsText).subscribe(res => {
                      this.phoneNumbers="";
                      this.smsText="";
                      this.getSmsTags();
                      this.router.navigate(['promotions/smspromotions']);
                      this.isAlertPopup=true;
                 },(err) => {
                   this.isStartLoader=false;
                    }, () => {
                      this.isStartLoader=false;
                    })

        }
  }
  sendToAll(){
      
      if(this.smsText=='')
        {
              this.showErrorForSmsContent=true;
        }
        else if(this.sendSmsTags=='' && this.phoneNumbers=='')
        {
             this.showErrorForSms=true;
        }
        else{
          this.getMessagesCount(this.sendSmsTags)
            
      //     this.isStartLoader=true;
      //     this.selectedTags=[];
      //     if(this.sendSmsTags!=''){
         
      //     this.promotionService.SEND_SMS_USING_TAGS(this.sendSmsTags,this.smsText).subscribe(res => {
      //      if(this.phoneNumbers!='')
      //       {
      //            this.promotionService.SEND_SMS_USING_PHONE_NUMBERS(this.phoneNumbers,this.smsText).subscribe(res => {
      //            },(err) => {
      //              this.isStartLoader=false;
      //               }, () => {
      //                 this.isStartLoader=false;
      //               })
      //       }
      //      // alert("message sended successfully");
      //     },(err) => {
      //       this.isStartLoader=false;
      //     }, () => {
      //     })
      //     this.phoneNumbers="";
      //     this.sendSmsTags="";
      //     this.smsText="";
      //     this.isAlertPopup=true;
      //     this.getSmsTags();
      //     // this.promotionService.sendSms()
      // }
      //   else if(this.phoneNumbers!=''){
      //            this.promotionService.SEND_SMS_USING_PHONE_NUMBERS(this.phoneNumbers,this.smsText).subscribe(res => {
      //                 this.phoneNumbers="";
      //                 this.smsText="";
      //                 this.getSmsTags();
      //                 this.router.navigate(['promotions/smspromotions']);
      //                 this.isAlertPopup=true;
      //            },(err) => {
      //              this.isStartLoader=false;
      //               }, () => {
      //                 this.isStartLoader=false;
      //               })

      //   }
        }
     
  }
    doctorName="";
    ionizedDate="";
    creadisCount:number=0;
    ionizeThePromotion(){
      var content="";
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if(this.aboutImages=="")
        {
         // content=content+this.promotionTitle+"<br>";
          content=this.promotionTitle;
        }
        else{
          //content =content+this.aboutImages +"<br>";
          content =this.aboutImages +"<br>";
        }
        if(this.aboutImages=='' && this.imageSrc.length==0){
            this.showtextareaError=true;
            this.showError=true;
        }
        else if(this.aboutImages!=''&& this.imageSrc.length==0)
        {
            this.showError=true;
        }
        else if(this.aboutImages==''&& this.imageSrc.length!=0){
            this.showtextareaError=true;
        }
        else{
         // this.showtextareaError=false;
          if(this.imageSrc.length>1)
            {
                for(let image of this.imageSrc)
                  {
                      content=content+'<img src="'+image+'"'+">";
                  }
            }
            this.isStartLoader=true;
            const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            var someDate = new Date();
            someDate.setDate(someDate.getDate() + 7);
            var dd = someDate.getDate();
            var m = someDate.getMonth();
            var y = someDate.getFullYear();

            this.ionizedDate = months[m] +" "+ dd +" "+ y;
            this.doctorName=currentuser.name;
            this.promotionService.addPromotionService(this.promotionId,content,this.imageSrc[0],this.promotionTitle).subscribe(res => {
            this.isStartLoader=false;
            this.promotionStatus=4;
            this.creadisCount=res.credits;
            this.showRequestIsTaken=true;
            },(err) => {
              this.isAlertPopup=true;
              this.alertMessage=this.connect_err;
              this.isStartLoader=false;
            }, () => {
            })
        }
     
    }
    closeRequestTakenPopUp(){
      this.router.navigate(['promotions']);
      this.showRequestIsTaken=!this.showRequestIsTaken;
    }
    promotionLink='';
    promotionfullviewimg(promotion){
     console.log(promotion);
      this.isOpenEditor=true;
     this.ionizedPromotionTitle=promotion.title;
     this.promotionLink=promotion.textplain;
    }
    downLoadImage(image){

        var a = document.createElement('a');
        a.href = image;
        a.download = "output.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    noOfMessages=0;
    smsTextChange(text){
      if(text.length>120)
          this. noOfMessages=Math.ceil(text.length/120);
      else if(text.length>0){
          this.noOfMessages=1;
        }
        else{
          this.noOfMessages=0;
        }
      }
     publishThePromotion(promotionblog){
        this.ionizedPromotionTitle=promotionblog.title;
        const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
          this.promotionService.updateThePromotion(promotionblog.postid,promotionblog.image.url,promotionblog.title,promotionblog.category.categoryid).subscribe(res => {
            this.promotionStatus=1;
            this.alertMessage="Your Promotion Will publish soon..";
            this.isAlertPopup=true;
            this.getIonizedBlogsData();
            },(err) => {
              this.isAlertPopup=true;
              this.alertMessage=this.connect_err;
              this.isStartLoader=false;
            }, () => {
            })

     }
          messagesCount=0;
          getMessagesCount(tags){
            this.isStartLoader=true;
            const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
            this.authService.getCommonDetails(currentuser.teamid).subscribe(res => {
              //localStorage.setItem('user.smsbalance',res.description[0].smsbalance);
              this.smsBalance=res.description[0].smsbalance;
              if(tags!=''&&tags!=null)
              {
               this.promotionService.getMessagesCount(tags).subscribe(res => {
                    this.messagesCount=res.count;
                    this.isSendSmspopup=true;
                    },(err) => {
                      this.isStartLoader=false;
                      this.isAlertPopup=true;
                      this.alertMessage=this.connect_err;
                    }, () => {
                      this.isStartLoader=false;
                    })
              }
                  else{
                    this.isStartLoader=false;
                    this.messagesCount=0;
                    this.isSendSmspopup=true;
                  }
            },(err) => {this.alertMessage=this.connect_err;}, () => {});
            
               
          }

          windowBottom:number;
           @HostListener("window:scroll", [])
            onWindowScroll()  {
                this.windowBottom= window.pageYOffset;
          }
        omit_special_char(event) {
                var k;  
                k = event.charCode; 
                console.log(k); //         k = event.keyCode;  (Both can be used)
                return(k!=60 &&k!=62);
        }
}
