import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../shared/services/search/search.service';
import { FormBuilder, FormControl, FormGroup,FormArray } from '@angular/forms';
import { LeadsService } from '../shared/services/leads/leads.service';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import { PromotionsService } from '../shared/services/promotions/promotions.service';
declare var require: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [SearchService,AuthserviceService,LeadsService,PromotionsService],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isSearchPopup: boolean = false;
  isStartLoader: boolean = false;
  isNoResult:boolean=false;
  imageSrc: any = '';
  alertMessage: string = '';
  numLength:number=0;
  isShowImgDeleteButt:boolean=false;
  tags: string = '';
  imageerrorAlert:boolean=false;
  imageUploadAlert: boolean = false;
  phoneMinlength:boolean=false;
  isShowHeader=false;
  searchResposne:any=[];
  todayDate=new Date().getDate();
  isPromoPopupOpen: boolean = false;
  isAlertPopup: boolean = false;
  isSelectAddLeads:boolean=false;
  gender=[{checked:true},{checked:false}];
  @ViewChild('fileInput') fileInput;
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
  constructor(private router: Router, private searchService: SearchService,private authService: AuthserviceService,private builder: FormBuilder,private leadsService: LeadsService,private promotionService:PromotionsService) { }

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
      isSelectPromo=false;
      isPromoSelected=false;
      promotionsData: any = [];
      getPromotionsCall() {
    this.isSelectPromo = false;
    this.isPromoPopupOpen = false;
    this.isPromoSelected = true;
    this.isStartLoader = true;
    this.promotionService.getPromotionsData().subscribe(
      (promotionResponse: any) => {
        console.log(promotionResponse);
        this.promotionsData = promotionResponse;
      }, (err) => {
        this.isStartLoader = false;
      }, () => {
        this.isStartLoader = false;
      });

  }
  selectPromo(eachpromotion){
  this.router.navigate(['promotions/promotiondemo',eachpromotion.id,eachpromotion.avatar,eachpromotion.title]);
  // console.log("promo");
  // console.log(eachpromotion);
}
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
    
    this.authService.uploadImageService(fd).subscribe(res => {
      // do stuff w/my uploaded file
      console.log(res);
      
      if(res.description==undefined){
        this.imageUploadAlert = false;
        this.imageerrorAlert=true;
      }else{
        this.imageSrc = res.description[0].url;
         this.isShowImgDeleteButt=true;
      }
    
    },(err) => {

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
  console.log(this.imageSrc);
  this.imageerrorAlert=false;
  this.imageUploadAlert = false;
}
clearForm() {
  this.imageSrc='';
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
// add lead call

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
                 console.log(age);
                 this.leadForm.patchValue({
                   age:age
                 })
         }

 onTypeNumValid(numValue) { 
  this.numLength=numValue.length; 
      console.log(numValue);
      if(numValue.length > 10 ){
        this.phoneMinlength=true;
      }
      else{
         this.phoneMinlength=false;
      }
  }
addLeads() {
  console.log(this.leadForm.value);
  //console.log(this.leadId);
 
 if(this.numLength!=10 && this.numLength!=0)
        {
           this.phoneMinlength=true;
        }
        else{
          this.phoneMinlength=false;
        }
  this.tags="";
 // //this.leadForm.value.id=this.leadId;
 // console.log( this.leadForm.value);
 this.isStartLoader = true;

 if(this.leadForm.value.dob!="0000-00-00" && this.leadForm.value.dob!='')
 {
 this.calculateAge(new Date(this.leadForm.value.dob),new Date());
 var format = require('date-fns/format');
 var created_date=format(new Date(this.leadForm.value.dob), ['YYYY-MM-DD']);
 this.leadForm.value.dob=created_date;
 }
 
//  console.log(this.leadForm.value.ctags);
      if(this.leadForm.value.ctags !==undefined && this.leadForm.value.ctags.length != 0)
      {
          for(let i=0; i<this.leadForm.value.ctags.length; i++)
            {
              // this.tags +=this.leadForm.value.ctags[i].value +",";
              //  console.log(this.tags);
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
                      console.log(leadResponse);
                      if(leadResponse.status === 'success' ||leadResponse.status==='ok') {
                        this.isAlertPopup = true;
                        this.alertMessage = 'Lead added successfully.';
                          this.isSelectAddLeads=false;
                      }
                    }, (err) => {
                            
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
}
