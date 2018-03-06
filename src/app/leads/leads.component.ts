import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup,FormArray } from '@angular/forms';
import { LeadsService,DataService } from '../shared/services/leads/leads.service';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import { PagerService } from '../shared/services/leads/pagination.service'
import { IonServer } from '../shared/globals/global';
declare var require: any;
import { ErrorService } from '../shared/services/error/error.service';
@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  providers: [LeadsService, AuthserviceService,PagerService,ErrorService]
})
export class LeadsComponent implements OnInit {
  format = require('date-fns/format');
  today=new Date();
  stopDates=this.format(this.today, ['YYYY-MM-DD']);
  // today=new Date();
  // stopDates=this.today.getFullYear()+"-"+(this.today.getMonth()+1)+"-"+this.today.getDate();
  leadsData: any = [];
  isStartLoader;
  isAddLead: boolean = false;
  isEditLead: boolean = false;
  isCheckBoxChecked: boolean = false;
  isAlertPopupError:boolean=false;
  leadId: number;
  phoneMinlength:boolean=false;
  numLength:number=0;
  spaceComment=IonServer.Space_Not_required;  
  f_name_req_comm=IonServer.f_name_required;
  l_name_required_comm=IonServer.l_name_required;
  f_name_length_comm=IonServer.f_name_length;
  email_required_comm=IonServer.email_required;
  invalid_email_comm=IonServer.invalid_email;
  num_required_comm=IonServer.num_required;
  @ViewChild('fileInput') fileInput;
  @ViewChild('editcontainer') editcontainer;
  imageSrc: any = '';
  page: number = 1;
  pageItems: any[];
  isAllFilters: boolean = false;
  imageerrorAlert:boolean=false;
  leadtags: any = [];
  leadtagsForFilter:any=[];
  tags: string = '';
  orderVal: string = '';
  isPatientGroups: boolean = false;
  selectedLeadArr: any = [];
  isAlertPopup: boolean = false;
  isDeleteAlertPopup: boolean = false;
  alertMessage: string = '';
  selectedIds:any =[];
  selectedPhoneNumbers:any=[];
  imgerror="Choose Only Image.";
  imgsize="The file size can not exceed 8MB.";
  isShowImgDeleteButt: boolean = false;
  imageUploadAlert: boolean = false;
  leadForm: FormGroup = this.builder.group({
    firstname: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    // amount_due: new FormControl(''),
    // doctor: new FormControl(''),
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
  buttonsDisabled=false;
  checkboxGroup: FormGroup;
  gender=[{checked:true},{checked:false}];
 
  leadFilterForm: FormGroup = this.builder.group({
    gender: new FormControl(''),
    ageFrom: new FormControl(''),
    ageTo: new FormControl(''),
    includesPhone: new FormControl(''),
    includesEmail: new FormControl(''),
    sourceLead: new FormControl(''),
    sourceQuery: new FormControl(''),
    sourceVisit: new FormControl(''),
    source:new FormControl(''),
    tags: new FormControl('')
  });
  leadFilterResetForm: FormGroup = this.builder.group({
    gender: new FormControl(''),
    ageFrom: new FormControl(''),
    ageTo: new FormControl(''),
    includesPhone: new FormControl(''),
    includesEmail: new FormControl(''),
    sourceLead: new FormControl(''),
    sourceQuery: new FormControl(''),
    sourceVisit: new FormControl(''),
    source:new FormControl(''),
    tags: new FormControl('')
  });
  tagsArray:any=[];
  @ViewChild('filtercontainer') filtercontainer; 
  currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;

  constructor(private router: Router, private leadsService: LeadsService, private route: ActivatedRoute,
      private builder: FormBuilder, private authService: AuthserviceService,private pagerService: PagerService,
      private _eref: ElementRef,private errorservice:ErrorService) { 
        document.addEventListener('click', this.offClickHandler.bind(this));
        document.addEventListener('click', this.leadtagsSuggestion.bind(this));
      }
      offClickHandler(event:any) {
        if (this.filtercontainer && !this.filtercontainer.nativeElement.contains(event.target)) { // check click origin
            this.isAllFilters = false;
            if(!this.isApplyFilter)
            {
                this.leadtagsForFilter.forEach(tag=>{
                    tag.isChecked=false;
                })
                this.tagsArray=[];
                this.leadFilterForm.patchValue({
                  gender:'',
                  ageFrom: '',
                  ageTo:'',
                  includesPhone: '',
                  includesEmail:'',
                  sourceLead: '',
                  sourceQuery: '',
                  sourceVisit: '',
                  source:'',
                  tags: ''
                });
            }
        }
    }
  ngOnInit() {
    if (localStorage.getItem('user') == ''|| localStorage.getItem('user')==null) {
      this.router.navigate(['login']);
    } else {
      if(this.currentuser.userGroup!=17)
        {
          this.router.navigate(['home']);
        }
        else{
              this.getLeads();
              this.getLeadTags();
        }
   
    }
  }
  leadtagsSuggestion(event: any) {
  if (this.editcontainer && !this.editcontainer.nativeElement.contains(event.target)) {
    this.pageItems.forEach((eachData) => {
     eachData.isClickOnDottedLine = false;
   });
 }
}
   changeTagClick(tag) {
      // const tagsArray = <FormArray>this.leadFilterForm.controls.tags;
      if(!tag.isChecked) {
        tag.isChecked=true;
        //this.tagsArray.push(tag.title);
      } else {
        tag.isChecked=false;
       // const index = this.deepIndexOf(this.tagsArray, tag.title);
       // this.tagsArray.splice(index,1);
      }
     // this.leadFilterForm.controls.tags=tagsArray;
  }
  deepIndexOf(arr, obj) {
    return arr.findIndex(function (cur) {
      return Object.keys(obj).every(function (key) {
        return obj[key] === cur[key];
      });
    });
  }
// Getting All leads
getLeads() {
  
  this.setPage(this.page);
  // this.leadsService.getLeadsListService().subscribe(
  //   (leadsResponse: any) => {
  //     this.leadsData = leadsResponse.description;
  //      this.setPage(1);
  //   }, (err) => {

  //   }, () => {
  //     this.isStartLoader = false;
  //     this.leadsData.forEach((lead) => {
  //        lead.isChecked = false;
  //     });
  //   });
}

// add lead call
addLeadStatus="";
zeroInput:boolean=false;
addLeads() {
 console.log(this.leadForm.value.phone);
  
  if(this.leadForm.value.firstname=='')
    {
      this.firstnameError=true;
    }
 if(this.numLength!=10 && this.numLength!=0)
        {
           this.phoneMinlength=true;
           this.zeroInput=false;
        }
    else{
      this.phoneMinlength=false;
    }
  if(this.leadForm.value.phone == '0'){
      if(!this.phoneMinlength){
        this.zeroInput=true;
      }
     else{
      this.zeroInput=false;
     }
    }else{
    this.zeroInput=false;
    }
 this.tags="";
 this.leadForm.value.id=this.leadId;
 this.isStartLoader = true;
 if(this.leadForm.value.dob!="0000-00-00" && this.leadForm.value.dob!='')
  {
      this.calculateAge(new Date(this.leadForm.value.dob),new Date());
      var format = require('date-fns/format');
      var created_date=format(new Date(this.leadForm.value.dob), ['YYYY-MM-DD']);
      this.leadForm.value.dob=created_date;
  }
 
      if(this.leadForm.value.ctags.length != 0)
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
 if(this.isAddLead)
  {
      if(this.leadForm.value.sex=='')    
          this.leadForm.value.sex="Male";
      if (this.leadForm.valid  &&  !this.phoneMinlength && !this.zeroInput) {
                this.buttonsDisabled=true;
                this.leadsService.addLeadService(this.leadForm.value).subscribe(
                    (leadResponse: any) => { 
                      if(leadResponse.status === 'success' ||leadResponse.status==='ok') {
                        this.isAlertPopup = true;
                        this.alertMessage = 'Lead added successfully.';
                          this.isAddLead = false;
                          this.addLeadStatus=leadResponse.status;
                          //this.getLeads();
                      }
                      else{
                        this.isAlertPopup = true;
                        this.alertMessage = leadResponse.info;
                        this.isAddLead = false;
                        this.addLeadStatus=leadResponse.status;
                      }
                      this.buttonsDisabled=false;
                    }, (err) => {
                      this.buttonsDisabled=false;
                      var errorMessage= this.errorservice.logError(err);
                      this.isAlertPopupError=true;
                      this.alertMessage=errorMessage;
                      this.isStartLoader=false;
                      this.isAddLead = false;
                    }, () => {
                      this.buttonsDisabled=false;
                      this.isStartLoader = false;
                      this.clearForm();
                    });
      } else {
        this.validateAllFormFields(this.leadForm); //{7}
       // this.isStartLoader = false;
      }
  }
  else{
          if (this.leadForm.valid &&  !this.phoneMinlength && !this.zeroInput) {
            this.buttonsDisabled=true;
              this.leadsService.updateLeadService(this.leadForm.value).subscribe(
                  (leadResponse: any) => {
                    this.buttonsDisabled=false;
                    if(leadResponse.status === 'ok') {
                      this.isAlertPopup = true;
                      this.alertMessage = 'Lead updated successfully.';
                        this.isEditLead = false;
                        //this.getLeads();
                    }
                  }, (err) => {
                    this.buttonsDisabled=false;
                    var errorMessage= this.errorservice.logError(err);
                    this.isAlertPopupError=true;
                    this.alertMessage=errorMessage;
                    this.isStartLoader=false;
                    this.isEditLead = false;
                  }, () => {
                    this.isStartLoader = false;
                    this.clearForm();
                  });
          } else {
            this.validateAllFormFields(this.leadForm); //{7}
          }
  }
}
onTypeNumValid(numValue) { 
this.numLength=numValue.length;
    if(numValue.length > 10 ){
      this.phoneMinlength=true;
      this.zeroInput=false;
    }
    else{
       this.phoneMinlength=false;
       this.zeroInput=false;
    }
}
// selectedLead(indx) {
//   if(this.leadsData[indx].isChecked) {
//      this.leadsData[indx].isChecked = false;
//   }else {
//     this.leadsData[indx].isChecked = true;
//   }
//   for(let i = 0; i < this.leadsData.length; i++) {
//     if (this.leadsData[i].isChecked === true) {
//       this.isCheckBoxChecked = true;
//       break;
//     } else {
//       this.isCheckBoxChecked = false;
//     }
// }
// }
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
    this.buttonsDisabled=true;
    this.authService.uploadImageService(fd).subscribe(res => {
      // do stuff w/my uploaded file
      
      if(res.description==undefined){
        this.imageUploadAlert = false;
        this.imageerrorAlert=true;
      }else{
        this.imageSrc = res.description[0].url;
         this.isShowImgDeleteButt=true;
      }
        this.buttonsDisabled=false;
    
    },(err) => {

     }, () => {
      this.fileInput.nativeElement.value = '';
       setTimeout (() => {
            this.buttonsDisabled=false;
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
  this.firstnameError=false;
  this.leadForm.reset();
  this.isShowImgDeleteButt=false;
  this.zeroInput=false;
  this.gender[0].checked=true;
  this.gender[1].checked=false;
  this.phoneMinlength=false;
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
    age:'',
    id:''
  });
}

//pagination code
  pager: any = {};
  limitstart:number;
  leadcount:number;
  limit:number;
  showNoleadsAvailable=false;
       setPage(page: number) {
        window.scrollTo(0, 0);
        this.isStartLoader = true;
        this.page=page;
        this.limitstart=(page-1)*25;
        this.limit=25;
        this.pageItems=[];
        if(this.leadFilterForm.value.ageFrom!='' && this.leadFilterForm.value.ageFrom!=null)
          {
            this.leadFilterForm.value.age=this.leadFilterForm.value.ageFrom+"-"+this.leadFilterForm.value.ageTo;
          }
          else{
            this.leadFilterForm.value.age='';
          }
        this.leadsService.getLeadsListServiceByLimit(this.limitstart,this.limit,this.leadFilterForm).subscribe(
              (leadsResponse: any) => {
                
                this.leadcount=leadsResponse.count;
                if(this.leadcount==0)
                  {
                    this.showNoleadsAvailable=true;
                  }
                  else{
                      this.showNoleadsAvailable=false;
                      this.pageItems=leadsResponse.description;
                      for (var i = 0; i < this.pageItems.length; i++) {
                        this.pageItems[i].color = ('#' + Math.floor(Math.random() * 16777215).toString(16));
                        }
                     for(let i = 0; i < this.pageItems.length; i++) {
                        this.pageItems[i].tagArr=[];
                        if(this.pageItems[i].leadsTags != "") {
                        this.pageItems[i].tagArr= this.pageItems[i].leadsTags.split(/\s*,\s*/);
                        }                    
                      }
                      if(this.selectedIds.length!=0)
                        {
                            for(let i = 0; i < this.pageItems.length; i++) {
                                  for(let j=0;j<this.selectedIds.length;j++)
                                  {
                                      if (this.pageItems[i].id === this.selectedIds[j]) {
                                        this.pageItems[i].isChecked=true;
                                        this.isCheckBoxChecked = true;
                                      }
                                  }                   
                              }
                        }
                      
                  }
                      this.isStartLoader=false;
                      this.pager = this.pagerService.getPager(this.leadcount, page);
                
              },(err)=>{
                var errorMessage= this.errorservice.logError(err);
                console.log(err);
                this.isAlertPopupError=true;
                this.alertMessage=errorMessage;
                this.isStartLoader=false;
              },()=>{
                this.pageItems.forEach(item=>{
                    item.isClickOnDottedLine=false;
                })
              });
        // get pager object from service
        // get current page of items
        //this.pageItems = this.leadsData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

// pagination code
// edit lead function

editLeadFunction(editLead){
  this.leadtags=[];
  this.leadId=editLead.id;
  this.leadForm.value.id=editLead.id;
  this.imageSrc=editLead.image;
  this.isEditLead=true;
  this.leadtags = editLead.leadsTags.split(',');
  this.leadtags.forEach((tag,key)=>{
    if(tag=='')
      {
        this.leadtags.splice(key,1);
      }
  })
  if(editLead.sex=='Male')
    {
        this.gender[0].checked=true;
        this.gender[1].checked=false;
    }
      else  if(editLead.sex=='Female')
    {
       this.gender[0].checked=false;
        this.gender[1].checked=true;
    }
      else{
        this.gender[0].checked=false;
        this.gender[1].checked=false;
      }
  if(editLead.birthday=='0000-00-00')
    {
      editLead.birthday='';
    }    
  this.leadForm.patchValue({
    firstname:editLead.firstname,
    surname: editLead.surname,
    email: editLead.email,
    phone: editLead.mobile,
    sex: editLead.sex,
    dob: editLead.birthday,
    city: editLead.city,
    area: editLead.area,
    remarks: editLead.remarks,
    source:editLead.source,
    id:editLead.id
    // image: editLead.image

  })
}
// edit lead function

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
// calculate age function
// get all filters
allFiltersCall() {
  this.isAllFilters = !this.isAllFilters;
  if(!this.isApplyFilter)
    {
        this.leadFilterForm.reset();
    }
}
//get lead tags
autoComplete=[];
  getLeadTags(){
    this.leadsService.getLeadTags().subscribe(res => {
        this.leadtagsForFilter=res.description;
        //this.autoComplete=res.description.splice(0,1);
         res.description.forEach(element => {
            this.autoComplete.push(element.title);
          });
      },(err) => {
      }, () => {
        this.isStartLoader = false;
        this.leadtagsForFilter.forEach((leadfilter) => {
          leadfilter.isSelectedclass = '';
          leadfilter.isChecked=false;
        });
      })
  }
  // select patient group
  selectPatientGroup(indx) {
    if(this.leadtagsForFilter[indx].isSelectedclass == 'selected') {
      this.leadtagsForFilter[indx].isSelectedclass = '';
    }else {
     this.leadtagsForFilter[indx].isSelectedclass = 'selected';
    }
  }
  isApplyFilter=false;
    applyFilter(){
      // if(this.isResetForm)
      //   {
      //     this.clearFilterForm();
      //     this.isApplyFilter=false;
      //     this.page=1;
      //     this.getLeads();
      //   }
      this.tagsArray=[];
          this.leadtagsForFilter.forEach(tag=>{
            if(tag.isChecked)
              {
                this.tagsArray.push(tag.title);
              }
          })
             this.isApplyFilter=true;
      this.leadFilterForm.value.source='';
      //this.leadFilterForm.value.includesEmail='';
      //this.leadFilterForm.value.includesPhone='';
      //this.leadFilterForm.value.gender='';
      if(this.leadFilterForm.value.gender==null)
        {
          this.leadFilterForm.value.gender='';
        }
      if(this.leadFilterForm.value.sourceLead)
        {
          this.leadFilterForm.value.source="lead,"
        }
        if(this.leadFilterForm.value.sourceQuery)
          {
            this.leadFilterForm.value.source=this.leadFilterForm.value.source+"query,"
          }
          if(this.leadFilterForm.value.sourceVisit)
            {
              this.leadFilterForm.value.source=this.leadFilterForm.value.source+"visit,"
            }
            if(this.leadFilterForm.value.includesEmail)
              {
                 this.leadFilterForm.value.includesEmail="1"
              }
            else{
              this.leadFilterForm.value.includesEmail='';
            }
                if(this.leadFilterForm.value.includesPhone)
                  {
                    this.leadFilterForm.value.includesPhone="1";
                  }
                  else{
                    this.leadFilterForm.value.includesPhone='';
                  }
   
      if(this.tagsArray.length!=0)
        {
                for(let i=0;i<this.tagsArray.length;i++)
                {
                  if(i==0)
                    {
                        this.tags=this.tagsArray[i]+",";
                    }
                    else{
                        this.tags=this.tags+this.tagsArray[i]+",";
                      }
                  
                } 
              this.leadFilterForm.value.tags=this.tags;
              this.tags="";       
        }
            else{
               this.leadFilterForm.value.tags='';
            }
              this.leadFilterResetForm.patchValue({
              gender:this.leadFilterForm.value.gender,
              ageFrom: this.leadFilterForm.value.ageFrom,
              ageTo:this.leadFilterForm.value.ageTo,
              includesPhone:this.leadFilterForm.value.includesPhone,
              includesEmail: this.leadFilterForm.value.includesEmail,
              sourceLead:this.leadFilterForm.value.sourceLead,
              sourceQuery: this.leadFilterForm.value.sourceQuery,
              sourceVisit: this.leadFilterForm.value.sourceVisit,
              source:this.leadFilterForm.value.source,
            })
            this.page=1;
            this.getLeads();
      // this.leadsService.filterLeads(this.leadFilterForm).subscribe(res => {
      //   // this.leadtagsForFilter=res.description;
      // },(err) => {
      // }, () => {
      //   this.isStartLoader = false;
      // })
      
     
    }
    downloadLeads(){
      this.isStartLoader = true;
      this.leadsService.downloadLeads().subscribe(res => {
        this.isStartLoader = false;
        let blob = new Blob([res], { type: 'text/csv' });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
            a.href = url;
            a.download = 'leads.csv';
            document.body.appendChild(a);
            a.click();        
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
      },(err) => {
        var errorMessage= this.errorservice.logError(err);
        this.isAlertPopupError=true;
        this.isStartLoader = false;
        this.alertMessage=errorMessage;
      }, () => {
        this.isStartLoader = false;
      })
    }
    ids:String;
    deleteSelectedLeads(){
      this.isDeleteAlertPopup=true;
      this.selectedIds.forEach((item, index) => {
        if(index==0)
            {
                this.ids=item+",";
            }
            else{
                this.ids=this.ids+item+",";
              }
        });
      
    }
      deleteSuccessPopup=false;
    deleteAlertPopup(){
              this.isDeleteAlertPopup=false;
              this.isCheckBoxChecked=false;
              this.isStartLoader = true;
               this.selectedPhoneNumbers=[];
              this.leadsService.deleteLeads(this.ids).subscribe(res => {
                const responseObj = JSON.parse(res);
                
                this.isStartLoader = false;
                this.alertMessage = "Lead(s) Deleted Successfully.";
                this.deleteSuccessPopup=true;
                //this.setPage(this.page);
                // this.leadsService.getLeadsListServiceByLimit(this.limitstart,this.limit,this.leadFilterForm).subscribe(
                //   (leadsResponse: any) => {
                //     this.pageItems=leadsResponse.description;
                //   });
              },(err) => {
                var errorMessage= this.errorservice.logError(err);
                this.isStartLoader=false;
                this.isDeleteAlertPopup=false;
                this.isAlertPopupError=true;
                this.isCheckBoxChecked = true;
                this.alertMessage=errorMessage;
            }, () => {
              this.isStartLoader = false;
            });
    }
    
    selectedLeadUsingId(lead) {
       for(let item of this.pageItems){
             if (item.id === lead.id) {
              if(item.isChecked)
                {
                    item.isChecked=true;
                    this.selectedIds.push(item.id);
                    this.selectedPhoneNumbers.push(item.mobile);
                    this.isCheckBoxChecked = true;
                } else {
                  item.isChecked=false;

                  var index = this.selectedIds.indexOf(item.id);
                   this.selectedIds.splice(index, 1);
                   this.selectedPhoneNumbers.splice(index,1);
                  if(this.selectedIds.length==0) {
                      this.isCheckBoxChecked = false;
                  }
                }
            }
          }
    }
     // add to groups
     addToGroups() {
      this.isPatientGroups = true;
    }  
    clearFilterForm(){
      //this.isApplyFilter=false;
      this.leadFilterForm.reset();
      //this.isResetForm=false;
      //this.tagsArray=[];
      //this.getLeadTags();
      this.leadFilterForm.patchValue({
            gender:'',
            ageFrom: '',
            ageTo:'',
            includesPhone:'',
            includesEmail: '',
            sourceLead:'',
            sourceQuery: '',
            sourceVisit: '',
            source:'',
            tags:''
        });
     
    }
    isResetForm=false;
    resetTheform(){
        this.isResetForm=true;
        this.leadFilterResetForm.patchValue({
          gender:this.leadFilterForm.value.gender,
          ageFrom: this.leadFilterForm.value.ageFrom,
          ageTo:this.leadFilterForm.value.ageTo,
          includesPhone:this.leadFilterForm.value.includesPhone,
          includesEmail: this.leadFilterForm.value.includesEmail,
          sourceLead:this.leadFilterForm.value.sourceLead,
          sourceQuery: this.leadFilterForm.value.sourceQuery,
          sourceVisit: this.leadFilterForm.value.sourceVisit,
          source:this.leadFilterForm.value.source,
        })
   this.clearFilterForm();
   this.leadtagsForFilter.forEach(tag=>{
      tag.isChecked=false;
   })
}
    cancelTheFilter(){
      if(!this.isApplyFilter)
        {
            this.leadtagsForFilter.forEach(tag=>{
                tag.isChecked=false;
            })
            this.tagsArray=[];
            this.leadtagsForFilter.forEach(tag=>{
                  tag.isChecked=false;
            })
        }
          else{
            if(this.isResetForm)
              {
                  this.leadFilterForm.patchValue({
                        gender:this.leadFilterResetForm.value.gender,
                        ageFrom: this.leadFilterResetForm.value.ageFrom,
                        ageTo:this.leadFilterResetForm.value.ageTo,
                        includesPhone:this.leadFilterResetForm.value.includesPhone,
                        includesEmail: this.leadFilterResetForm.value.includesEmail,
                        sourceLead:this.leadFilterResetForm.value.sourceLead,
                        sourceQuery: this.leadFilterResetForm.value.sourceQuery,
                        sourceVisit: this.leadFilterResetForm.value.sourceVisit,
                        source:this.leadFilterResetForm.value.source,
                      })
                  this.leadtagsForFilter.forEach(tag=>{
                    this.tagsArray.forEach(selected=>{
                      if(tag.title===selected)
                        {
                          tag.isChecked=true;
                        }
                    })
                  })
              }
                else if(this.applyFilter)
                  {
                     this.leadFilterForm.patchValue({
                        gender:this.leadFilterResetForm.value.gender,
                        ageFrom: this.leadFilterResetForm.value.ageFrom,
                        ageTo:this.leadFilterResetForm.value.ageTo,
                        includesPhone:this.leadFilterResetForm.value.includesPhone,
                        includesEmail: this.leadFilterResetForm.value.includesEmail,
                        sourceLead:this.leadFilterResetForm.value.sourceLead,
                        sourceQuery: this.leadFilterResetForm.value.sourceQuery,
                        sourceVisit: this.leadFilterResetForm.value.sourceVisit,
                        source:this.leadFilterResetForm.value.source,
                      })
                     this.leadtagsForFilter.forEach(tag=>{
                      this.tagsArray.forEach(selected=>{
                        if(tag.title!==selected)
                          {
                            tag.isChecked=false;
                          }
                      })
                    })
                  }
          }
        this.isResetForm=false;
    }
    addGroupsToSeceltedLeads()
    {
          this.selectedPhoneNumbers=[];
          this.isStartLoader=true;    
          var finalids="",filaltags="";
          for(let tag of this.leadtagsForFilter){
            if(tag.isSelectedclass=='selected')
                {
                  filaltags=filaltags+tag.title+",";
                  tag.isSelectedclass='';
                }
          }
          for(let ids of this.selectedIds)
          {
            finalids=finalids+ids+","
          }
          this.isPatientGroups=false;
          this.leadsService.addTagsToContacts(filaltags,finalids).subscribe(res => {
                   this.isStartLoader=false;
                  this.isCheckBoxChecked = false;
                  this.selectedIds=[];
                  //this.setPage(this.page);
                  this.isAlertPopup = true;
                  this.alertMessage = "Groups Added Successfully To Selected Leads.";
          },(err) => {
            var errorMessage= this.errorservice.logError(err);
              this.isStartLoader=false;
              this.isAlertPopupError=true;
              this.selectedLeadUsingId;
              this.alertMessage=errorMessage;
          }, () => {
            this.isStartLoader = false;
          })
    }
    deSeletePatientGroups(){
         for(let tag of this.leadtagsForFilter){
            if(tag.isSelectedclass=='selected')
                {
                  tag.isSelectedclass='';
                }
          }
    }
        numbers:string="";
        sendSms(){
           for(let ids of this.selectedPhoneNumbers)
          {
            this.numbers=this.numbers+ids+","
          }
          DataService.dataFromService = this.numbers;
          this.router.navigate(['promotions/smspromotions']);
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
clickedOnDottedLine(indx) {
  if(this.pageItems[indx].isClickOnDottedLine) {
    this.pageItems[indx].isClickOnDottedLine = false;
  }else {
   this.pageItems[indx].isClickOnDottedLine = true;
  }
}
firstnameError=false;
firstnameChange(value){
  if(value==''|| value.length<3)
    {
      this.firstnameError=true;
    }
    else{
      this.firstnameError=false;
    }
}
omit_special_char(event) {
  var k;  
  k = event.charCode; 
  return(k!=35);
}
 windowBottom:number;
           @HostListener("window:scroll", [])
            onWindowScroll()  {
              if(!this.isDeleteAlertPopup)
                this.windowBottom= window.pageYOffset;
          }
}
