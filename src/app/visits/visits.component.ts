import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { VisitsService } from '../shared/services/visits/visits.service';
import { LeadsService } from '../shared/services/leads/leads.service';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import * as _ from 'underscore';
import { IonServer } from '../shared/globals/global';
declare var require: any;
import {CsvService} from 'angular2-json2csv';
import * as alasql from 'alasql';
//import * as html2canvas from "html2canvas";
// import * as jsPDF from 'jspdf'
// import * as autoTable from 'jspdf'
let jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  providers: [VisitsService, AuthserviceService,LeadsService,CsvService],
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {
  format = require('date-fns/format');
  today=new Date();
  stopDates=this.today.getFullYear()+"-"+(this.today.getMonth()+1)+"-"+this.today.getDate();
  visitsData: any = [];
  isStartLoader;
  isAddVisit: boolean = false;
  grouped: any = [];
  tags:string="";
  isShowPatientDetails: boolean = false;
  isShowImgDeleteButt: boolean = false;
  imageerrorAlert:boolean=false;
  patientDetailsData: any = {};
  visitCategeoryData: any = [];
  visitDoctorsData: any = [];
  doctorsListForFilter=[];
  timeSlotsData: any = [];
  spaceComment=IonServer.Space_Not_required;  
  imgerror="Choose Only Image.";
  imgsize="The file size can not exceed 8MB.";
  //select_column=[{name:'Age'},{name:'Phone'},{name:'Email'},{name:'Time'},{name:'Status'},{name:'Paid Amnt'}];
  select_column=[{title:'Name',value:6,Checked: true,dataKey: "name"},{title:'Doctor',value:6,Checked: true,dataKey: "resname"},{title:'Age',value:1, Checked: true,dataKey: "age"},{title:'Phone',value:2, Checked: true,dataKey: "mobile"},{title:'Email',value:3,Checked: true,dataKey: "email"},{title:'Time',value:4,Checked: true,dataKey: "starttime"},{title:'Status',value:5,Checked: true,dataKey: "request_status"},{title:'Paid_Amnt',value:6,Checked: true,dataKey: "booking_deposit"}];
  // status_fields = [{id: 'new', value: 'New'}, {id: 'accepted', value: 'Accepted'}, {id: 'canceled', value: 'Cancelled'},{id: 'Review', value: 'Review'}];
  @ViewChild('fileInput') fileInput;
  //@ViewChild('visitsListing') listing;
  imageSrc: any = '';
  isEditVisit: boolean = false;
  orderVal: string = '';
  visitsTempData: any = [];
  isAlertPopup: boolean = false;
  alertMessage: string = '';
  isAddVisitLoader:boolean=false;
  imageUploadAlert: boolean = false;
  isPrintClicked: boolean = false;
  isPrinting: boolean = false;
  selectedDateValue:Date=new Date();
  
  visitForm: FormGroup = this.builder.group({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    startdate: new FormControl(''),
    request_status: new FormControl(''),
    starttime: new FormControl(''),
    booking_deposit: new FormControl(''),
    comments: new FormControl(''),
    dob: new FormControl(''),
    res_id: new FormControl(''),
    sex: new FormControl('Male'),
    category: new FormControl(''),
    booking_total: new FormControl(''),
    booking_due: new FormControl(''),
    enddate: new FormControl(''),
    req_id: new FormControl(''),
    tags: new FormControl(''),
    ce_id:new FormControl(''),
    age:new FormControl('')
  });
  visitDownloadForm: FormGroup =this.builder.group({
    selectDuration: new FormControl(''),
    today:new FormControl({value: '', disabled: false}),
    tomorrow:new FormControl({value: '', disabled: false}),
    fromDate:new FormControl(''),
    toDate:new FormControl(''),
    selecedDoctor:new FormControl('')
  });
  gender=[{checked:true},{checked:false}];
  excelOrPdf="excel";
  constructor(private router: Router, private visitsService: VisitsService, private route: ActivatedRoute,
     private builder: FormBuilder,  private authService: AuthserviceService,private leadsService:LeadsService,private csvService: CsvService) { }

  ngOnInit() {
     
    if (localStorage.getItem('user') =='' || localStorage.getItem('user')==null) {
      this.router.navigate(['login']);
       
    } else {
     //this.getVisits();
     this.getLeadTags();
    }
    // if(localStorage.getItem("user")!='')
    // else{
    //   this.router.navigate(['login']);
    // }
  }
  // Getting All Visits
 getVisits() {
  this.isStartLoader = true;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var date=this.selectedDate;
  var dd:any=date.getDate();
  var mm:any=(date.getMonth()+1);

  if(dd<10){
    dd='0'+dd;
  } 
  if(mm<10){
    mm='0'+mm;
  } 
  var current_date=date.getFullYear()+"-"+mm+"-"+dd;
  this.visitsService.getVisitsListService(current_date).subscribe(
    (visitsResponse: any) => {
      //console.log(visitsResponse.data.length);
      
         this.grouped = _.chain(visitsResponse.data).groupBy('startdate').pairs();
          for(let i = 0; i < this.grouped._wrapped.length; i++) {
              let date = new Date((this.grouped._wrapped[i])[0]).getDate();
              let month = new Date((this.grouped._wrapped[i])[0]).getMonth();
              this.grouped._wrapped[i][0] = months[month] + ' ' + date;
            }
         // console.log((this.grouped._wrapped));
          this.visitsTempData = this.grouped._wrapped;
       
     
    }, (err) => {
      console.log(err);
        this.isStartLoader = false;
    }, () => {
      this.isStartLoader = false;
      this.route.params.forEach((params: Params) => {
        if (params.isAddVisitParam != '' && params.isAddVisitParam != undefined) {
          console.log(params.isAddVisitParam);
          this.isAddVisit = true;
          this.addVisitPopup();
        }
      });
      this.getFilterByDoctorsData('');
      this.getDoctors('');
    });
}
  selectedDate=new Date();
onEventChanged(selectedValue: any) {
  //console.log(selectedValue);
  this.selectedDate=selectedValue;
  this.getVisits();
}
// filter by doctors
showNovisitsAvailable=false;
getFilterByDoctorsData(resId) {
  this.showNovisitsAvailable=false;
  console.log(resId);
 if(resId == undefined || resId == '' || resId == null) {
  this.visitsData = this.visitsTempData;
 }else {
  this.visitsData = [];
  console.log(this.visitsData);
  this.visitsTempData.forEach((resdata) => {
    const tempArr = [];
    resdata[1].forEach((visitnewdata) => {
     if(visitnewdata.resource == resId) {
      tempArr.push(visitnewdata);
     }
  });
  if (tempArr.length > 0) {
    this.visitsData.push([resdata[0], tempArr]);
  }
 
 
 });
 }
console.log(this.visitsData);
if(this.visitsData.length==0)
  {
    this.showNovisitsAvailable=true;
  }
}
numValue="";
numLength:number=0;
stop:boolean = false;
phoneMinlength:boolean=false;
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
// add a visit call

addVisit() {
 // console.log(this.visitForm.value);
  //this.isStartLoader = true;
         //console.log(this.numValue.length);
        if(this.numLength!=10 && this.numLength!=0)
        {
           this.phoneMinlength=true;
        }
        else{
          this.phoneMinlength=false;
        }
        let strUDFs = '';
         if(this.visitForm.value.sex=='')
          {
              this.visitForm.value.sex="Male";
          }
        strUDFs += 2 + ';' + this.visitForm.value.sex + '~';
        if(this.visitForm.value.dob !== '') {
          strUDFs += 3 + ';' + this.visitForm.value.dob + '~';
          //this.calculateAge(new Date(this.visitForm.value.dob),new Date());
          strUDFs += 4 + ';' + this.visitForm.value.age + '~';
        }
          for (const eachslot of this.timeSlotsData) {
               if(eachslot.id === this.visitForm.value.starttime) {
                 this.visitForm.value.starttime = eachslot.timeslot_starttime;
                 this.visitForm.value.endtime = eachslot.timeslot_endtime;
               }
          }
          for (const eachdocotr of this.visitDoctorsData) {
            if(eachdocotr.id_resources === this.visitForm.value.res_id) {
              this.visitForm.value.booking_total = eachdocotr.rate;
            }
       }
      
          this.visitForm.value.enddate = this.visitForm.value.startdate;
          this.visitForm.value.image = this.imageSrc;
          this.visitForm.value.name = this.visitForm.value.firstname + ' ' + this.visitForm.value.lastname;
          console.log(this.visitForm.value.tags);
          if(this.visitForm.value.tags!=null && this.visitForm.value.tags.length!=0 )
            {
                for(var i=0;i<this.visitForm.value.tags.length;i++)
                  {
                    this.tags +=this.visitForm.value.tags[i].value +",";
                  }
            this.visitForm.value.tags=this.tags;
            }
         
           
          console.log(this.visitForm.value);
          
       if (this.visitForm.valid &&  !this.phoneMinlength) {
         this.isAddVisitLoader=true;
          this.visitsService.addVisitService(this.visitForm.value, strUDFs).subscribe(
          (leadResponse: any) => {
            console.log(leadResponse);
            if(leadResponse.status === 'ok') {
                this.isAlertPopup = true;
                this.alertMessage = 'Visit added successfully.';
                this.isAddVisit = false;
                this.closeAddAndEditVisit();
                this.getVisits();
            }
          }, (err) => {
       
          }, () => {
            this.isAddVisitLoader=false;
           // this.isStartLoader = false;
           if(this.router.url == '/visits/homeaddvisit')
            {
              this.router.navigate(['/visits']);
            }
           this.clearForm();
          });
          //console.log('form submitted');
        } else {
          console.log("else");
          this.validateAllFormFields(this.visitForm); //{7}
        }

  
  
}
// patient details func
patientDetails(pid) {
  this.isShowPatientDetails = true;
  this.patientEditDetails(pid);
}

addVisitPopup() {
  this.clearForm();
  this.getCategeories();
}
// get Categeories function
getCategeories() {
  this.isAddVisitLoader = true;
  this.visitsService.getCategeoriesService().subscribe(
    (categeoryResponse: any) => {
      // console.log(visitsResponse.data);
      this.visitCategeoryData = categeoryResponse.data;
      //this.getDoctors(this.visitCategeoryData[0].id_categeories);
    }, (err) => {

    }, () => {
      this.isAddVisitLoader = false;
      //this.getDoctors(this.visitCategeoryData[0].id_categeories);
    });
}
// get doctors list function
getDoctors(catId) {
  if(catId!='')
    {
      this.isAddVisitLoader=true;
    }
    else{
      this.isStartLoader = true;
    }
  //console.log(catId);
  this.visitsService.getDoctorsService(catId).subscribe(
    (doctorsResponse: any) => {
       console.log(doctorsResponse.data);
       console.log(catId);
       if(catId=='')
        {
            this.doctorsListForFilter=doctorsResponse.data;
        }
        else{
          this.visitForm.patchValue({
                res_id:''
              })
            this.visitDoctorsData = doctorsResponse.data;
        }
      
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.isAddVisitLoader=false;
      // this.getDoctorTimeSlots(this.visitDoctorsData[0].id_resources, '2017/10/31');

    });
}
  getDoctorsForUpdate(catId) {
  this.isStartLoader = true;
  //console.log(catId);
  this.visitsService.getDoctorsService(catId).subscribe(
    (doctorsResponse: any) => {
            this.visitDoctorsData = doctorsResponse.data;
    }, (err) => {
    }, () => {
      this.isStartLoader = false;
      // this.getDoctorTimeSlots(this.visitDoctorsData[0].id_resources, '2017/10/31');
    });
}
// get time slots function
getDoctorTimeSlots(resId, tsDate) {
  console.log(resId);
  console.log(tsDate);
   
  //console.log(tsDate);
  if(tsDate!==undefined && tsDate!='' && resId!='' ){
        //this.isStartLoader = true;
        var month=(tsDate.getMonth()+1);
        var date=tsDate.getDate();
        var year=tsDate.getFullYear();
        if (month < 10)
        {
              month = '0' + month;
        }
        if(date<10)
        {
              date = '0' + date;
        }
        var passdate=tsDate.getFullYear()+"-"+month+"-"+date;
        console.log(passdate);
        this.visitForm.patchValue({
          startdate:passdate
        });
        this.isAddVisitLoader=true;
        this.visitsService.getTimeSlotsService(resId, passdate).subscribe(
          (timeslotResponse: any) => {
            let selectdate=new Date(tsDate);
            let todayDate=new Date();
             if(selectdate.getFullYear()==todayDate.getFullYear()&&selectdate.getMonth()==todayDate.getMonth()&&selectdate.getDate()==todayDate.getDate())
            {
               
                let timeslots=[];
                let hours=todayDate.getHours();
                console.log(timeslotResponse.data[0].Message);
                console.log(typeof timeslotResponse.data[0].Message=="undefined");
                if(timeslotResponse.data[0].Message===undefined)
                  {
                      for(var i=0;i<timeslotResponse.data.length;i++) 
                      {
                          if(parseInt(timeslotResponse.data[i].timeslot_endtime.split(":")[0])>=hours)
                          {
                              timeslotResponse.data[i].isDisabled=false;
                          }
                          else{
                              timeslotResponse.data[i].isDisabled=true;
                            }
                      }
                  }
            } 
            else
            {        
                this.timeSlotsData = timeslotResponse.data;
            } 
            if(timeslotResponse.data[0].Message=='Day Off')
            {
                  timeslotResponse.data[0].startendtime="No time Slots Available.";
                  this.timeSlotsData = timeslotResponse.data;
            }
            
            //  if(selectdate.getFullYear()==todayDate.getFullYear()&&selectdate.getMonth()==todayDate.getMonth()&&selectdate.getDate()==todayDate.getDate())
            // {
            //     let timeslots=[];
            //     let hours=todayDate.getHours();
            //     console.log(timeslotResponse.data[0].Message);
            //     console.log(typeof timeslotResponse.data[0].Message=="undefined");
            //     if(typeof timeslotResponse.data[0].Message=="undefined")
            //       {
            //           for(var i=0;i<timeslotResponse.data.length;i++) 
            //           {
            //               if(parseInt(timeslotResponse.data[i].timeslot_endtime.split(":")[0])>=hours)
            //               {
            //                   timeslotResponse.data[i].isDisabled=false;
            //               }
            //               else{
            //                   timeslotResponse.data[i].isDisabled=true;
            //                 }
            //           }
            //       }
            // } 
            // else
            // {  
            //     for(var i=0;i<timeslotResponse.data.length;i++) 
            //     {
            //         timeslotResponse.data[i].isDisabled=false;
            //     }
            // }
            //this.timeSlotsData = timeslotResponse.data;
            // if(this.timeSlotsData[0].Message=='Day Off')
            //   {
            //         this.timeSlotsData[0].startendtime="No time Slots Available.";
            //   }
            
            this.visitForm.patchValue({
                starttime:''
              })
            }, (err) => {

            }, () => {
              this.isAddVisitLoader=false;
              //this.isStartLoader = false;
          });
  }
 
}
// upload image
upload() {
  
  const fileBrowser = this.fileInput.nativeElement;
  console.log(fileBrowser.files[0]);
  // if (fileBrowser.files && fileBrowser.files[0]) {
   // console.log(fileBrowser.files[0]);
   if(fileBrowser.files[0])
    {
     
      if(fileBrowser.files[0].size/1024/1024 > 9) {
        this.imageUploadAlert = true;
        this.imageerrorAlert = false;
        // this.imageSrc = "";
        this.fileInput.nativeElement.value = '';
        return false;
      }

      this.imageUploadAlert = false;
      this.imageerrorAlert = false;
        this.isAddVisitLoader = true;
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
          console.log(res.description)
          if(res.description==undefined)
          {
               // console.log("error");
                this.imageUploadAlert = false;
                this.imageerrorAlert=true;
          }else{
              this.imageSrc = res.description[0].url;
              this.isStartLoader = false;
              this.isShowImgDeleteButt=true;
          }
        
        },(err) => {
             
        }, () => {
          this.fileInput.nativeElement.value = '';
          this.isAddVisitLoader = false;
        });
    }
    
    
  
}
uploadImgeDelete(){
  this.imageSrc="";
   this.isShowImgDeleteButt=false;
  console.log( this.imageSrc);
  this.imageerrorAlert=false;
  this.imageUploadAlert = false;
}

// Delete visits call
deleteVisit(vId) {
  this.isStartLoader = true;
  this.visitsService.deleteVisitService(vId).subscribe(
    (delResponse: any) => {
      this.isAlertPopup = true;
      this.alertMessage = delResponse;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;

    });
}
// visit edit
visitEdit(pId) {
  console.log("venkat");
  this.isEditVisit = true;
  this.isAddVisit = false;
  this.getCategeories();
  for (const eachentry of this.visitsTempData) {
     for (const eachdata of eachentry[1]) {
      if(eachdata.id === pId) {
          this.getDoctorsForUpdate(eachdata.category);
      }
    }
  }
  this.patientEditDetails(pId);
}
// visit status update
visitStateChange() {

}
// patient details for edit function
patientEditDetails(pid) {
    this.isStartLoader = true;
    for (const eachentry of this.visitsTempData) {
     for (const eachdata of eachentry[1]) {
      if(eachdata.id === pid) {
        
        this.visitsService.getTimeSlotsService(eachdata.resource, eachdata.startdate).subscribe(
        (timeslotResponse: any) => {
          console.log(timeslotResponse.data);
            let selectdate=new Date(eachdata.startdate);
            let todayDate=new Date();
          
             if(selectdate.getFullYear()==todayDate.getFullYear()&&selectdate.getMonth()==todayDate.getMonth()&&selectdate.getDate()==todayDate.getDate())
            {
                let timeslots=[];
                let hours=todayDate.getHours();
                console.log(timeslotResponse.data[0].Message);
                console.log(typeof timeslotResponse.data[0].Message=="undefined");
                if(typeof timeslotResponse.data[0].Message=="undefined")
                  {
                      for(var i=0;i<timeslotResponse.data.length;i++) 
                      {
                          if(parseInt(timeslotResponse.data[i].timeslot_endtime.split(":")[0])>=hours)
                          {
                              timeslotResponse.data[i].isDisabled=false;
                          }
                          else{
                              timeslotResponse.data[i].isDisabled=true;
                            }
                      }
                  }
            } 
            else
            {  
                for(var i=0;i<timeslotResponse.data.length;i++) 
                {
                    timeslotResponse.data[i].isDisabled=false;
                }
            } 
        this.timeSlotsData = timeslotResponse.data;
        for(const eachtimeslot of timeslotResponse.data)
          {
            if(eachdata.starttime === eachtimeslot.timeslot_starttime)
              {
                 this.visitForm.patchValue({
                    starttime: eachtimeslot.id
                 });
              }
          }
             var name=eachdata.name.split(" ");
             var firstname="";
             var lastname="";
             if(name.length>=2)
              {
                  for(var i=0;i<name.length-1;i++)
                  {
                      if(firstname=="")
                        {
                          firstname=name[i];  
                        }
                        else{
                          firstname=firstname+" "+name[i];  
                        }
                      
                  }
                  lastname=name[name.length-1];
              }
              else{
                  firstname=name[0];
                  lastname='';
              }
        // var nameArray=eachdata.name.split(" ");
        // var lastname=nameArray[nameArray.length-1];
         if(eachdata.sex=='Male')
          {
              this.gender[0].checked=true;
              this.gender[1].checked=false;
          }
            else  if(eachdata.sex=='Female')
          {
            this.gender[0].checked=false;
              this.gender[1].checked=true;
          }
            else{
              this.gender[0].checked=false;
              this.gender[1].checked=false;
            }

        this.patientDetailsData = eachdata;
        console.log(eachdata);
        this.imageSrc=eachdata.image;
        if(this.isEditVisit) {
          this.visitForm.patchValue({
            startdate: eachdata.startdate,
            request_status: eachdata.request_status,
            booking_deposit: eachdata.booking_deposit,
            res_id: eachdata.resource,
            category: eachdata.category,
            sex: eachdata.sex,
            booking_total: eachdata.booking_total,
            booking_due: eachdata.booking_due,
            enddate: eachdata.startdate,
            req_id: eachdata.id,
            firstname: firstname,
            lastname: lastname,
            email: eachdata.email,
            phone: eachdata.mobile,
            comments: eachdata.remarks,
            dob: eachdata.birthday,
            ce_id:eachdata.ce_id
          });
        }
      
        }, (err) => {

        }, () => {
          this.isStartLoader = false;

        });
      }
     }
  }
}
// UPDATE VISITS
visitUpdate() {
  //this.isStartLoader = true;
   if(this.numLength!=10 && this.numLength!=0)
        {
           this.phoneMinlength=true;
        }
        else{
          this.phoneMinlength=false;
        }
    for (const eachslot of this.timeSlotsData) {
      console.log(this.visitForm.value.starttime);
         if(eachslot.id === this.visitForm.value.starttime) {
           this.visitForm.value.starttime = eachslot.timeslot_starttime;
           this.visitForm.value.endtime = eachslot.timeslot_endtime;
         }
    }
    this.visitForm.value.image = this.imageSrc;
    // console.log(this.visitForm.value);
    // console.log(this.visitForm.value.request_status);
    console.log(this.visitForm.value);
    
    if(this.visitForm.value.request_status!="" && this.visitForm.value.starttime.toString().includes(":") && this.visitForm.value.res_id!='' && this.visitForm.value.category!=''  && !this.phoneMinlength &&this.visitForm.valid) {
      console.log("update visit");
      console.log(this.visitForm.value);
        var strUDFs="";
        strUDFs += 2 + ';' + this.visitForm.value.sex + '~';
        if(this.visitForm.value.dob !== '') {
          strUDFs += 3 + ';' + this.visitForm.value.dob + '~';
          strUDFs += 4 + ';' + this.visitForm.value.age + '~';
        }
      this.visitForm.value.name = this.visitForm.value.firstname + ' ' + this.visitForm.value.lastname;
      this.isAddVisitLoader=true;    
      this.visitsService.updateVisitService(this.visitForm.value,strUDFs).subscribe(
                (vistUpdateResponse: any) => {
                  //console.log(vistUpdateResponse.data[0]);
                  if(vistUpdateResponse.data[0].status === 'ok') {
                    this.isAlertPopup = true;
                    this.alertMessage = 'Visit updated successfully.';
                      this.isEditVisit = false;
                      this.closeAddAndEditVisit();
                      this.getVisits();
                  }
                }, (err) => {
                  console.log(err);
            this.isAddVisitLoader=false;
                }, () => {
                  this.isAddVisitLoader=false;
                  //this.isStartLoader = false;
                  this.clearForm();
                });
  } else {
               this.validateAllFormFields(this.visitForm);
  }
       

}
timeChange=false;
timechange(){
  this.timeChange=false;
}
// to clear from fields
clearForm() {
  this.visitForm.reset();
  this.imageSrc='';
  this.visitForm.patchValue({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    startdate: '',
    request_status: '',
    starttime: '',
    booking_deposit: '',
    comments: '',
    dob: '',
    res_id: '',
    sex: '',
    category: ''
  });
}

 printToCart(){ 
    let printContents, popupWin;
    printContents = document.getElementById('printSectionId').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          table {
              border-collapse: collapse;
          }
          table, th, td {
              border: 1px solid black;
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  printOptionsClick(printSectionId: string) {
    
    this.isPrintClicked = true;

  }
  showTodayOrTomorrowError=false;
  showBetweenError=false;
  
  showPrintScreen() {
    console.log(this.select_column);
    console.log(this.visitDownloadForm.value);
    console.log(this.visitDownloadForm.value);
    if(this.visitDownloadForm.value.selectDuration==0||this.visitDownloadForm.value.selectDuration==''||this.visitDownloadForm.value.selectDuration==null)
      {
          if(this.visitDownloadForm.value.today=='' ||this.visitDownloadForm.value.today==null)
            {
              if(this.visitDownloadForm.value.tomorrow==''||this.visitDownloadForm.value.tomorrow==null)
                {
                     this.showTodayOrTomorrowError=true;
                      this.showBetweenError=false;
                      return;
                }
            }
      }
      else{
         if(this.visitDownloadForm.value.fromDate==''||this.visitDownloadForm.value.toDate==''||
          this.visitDownloadForm.value.fromDate==null||this.visitDownloadForm.value.toDate==null
        )
            {
                this.showTodayOrTomorrowError=false;
                this.showBetweenError=true;
                return;
            }
      }
          console.log("venkat");
      this.showTodayOrTomorrowError=false;
      this.showBetweenError=false;   
      this.getAppintmentsBetweenDates(this.visitDownloadForm.value);    
    
  }

    downloadFilteredVisits(){
      console.log(this.excelOrPdf);
    if(this.excelOrPdf!='')
      {
          if(this.excelOrPdf=='pdf')
          {
              var doc = new jsPDF('p','pt');
              var col = [];
        
                this.select_column.forEach(column=>{
                    if(column.Checked)
                      {
                        col.push(column);
                      }
                })
                console.log(col);
                console.log(this.filteredVisits);
                doc.autoTable(col, this.filteredVisits);
                doc.save('Test.pdf');
          }
          else{
             var sqlquery="";
            this.select_column.forEach((column,key)=>{
              if(column.Checked)
                {
                        sqlquery+=column.dataKey+" as "+column.title+","
                }
            })
              sqlquery=sqlquery.substring(0, sqlquery.length - 1);
              console.log(sqlquery);
              var query='SELECT  '+sqlquery+' INTO CSV(" venkat ",{headers:true}) FROM ?';
              alasql(query, [this.filteredVisits]);
             //this.csvService.download(this.filteredVisits, 'visits');
          }
      }
    }
downloadVisits(){
      console.log("download");
      this.visitsService.downloadVisits().subscribe(res => {
        console.log(res);
        let blob = new Blob([res], { type: 'text/csv' });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
            a.href = url;
            a.download = 'visits.csv';
            document.body.appendChild(a);
            a.click();        
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

      },(err) => {
      }, () => {
        this.isStartLoader = false;
      })
}
// print visits
printVisits() {
  this.visitsService.downloadVisits().subscribe(res => {
    console.log(res);
    var response="<html><head><style>table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #dddddd;}</style></head><body><table><tr><th>Company</th><th>Contact</th><th>Country</th></tr><tr><td>Alfreds Futterkiste</td><td>Maria Anders</td><td>Germany</td></tr></table></body></html>"
     var file = new Blob([res]);
  var fileURL =window.URL.createObjectURL(file);
  var w=window.open(fileURL);
  w.print();
    },(err) => {
    }, () => {
      this.isStartLoader = false;
    })
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
  this.visitForm.patchValue({
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
                
               this.visitForm.patchValue({
                 age:age
               })
        }
  closeAddAndEditVisit(){
    this.visitDoctorsData=[];
    this.timeSlotsData=[];
    this.visitForm.reset();
    this.isShowImgDeleteButt=false;
    this.gender=[{checked:true},{checked:false}];
  }
  filteredVisits:any=[];
  getAppintmentsBetweenDates(data){
     //var date=new Date();
     console.log(data);
     var doctor:any="";
      var fromDate:any="";
      var diff_date:any="";
      if(data.selectDuration==''||data.selectDuration==0||data.selectDuration==null)
        {
           if(data.tomorrow){
              var date =new Date();
              fromDate=this.format((date).setDate(date.getDate() + 1), ['YYYY-MM-DD']);
              diff_date = 1;
            }
          else if(data.today)
            {
              console.log(data.today);
              fromDate=this.format(new Date(), ['YYYY-MM-DD']);
              diff_date = 0;
            }
           
        }
          else{
              fromDate=this.format(data.fromDate, ['YYYY-MM-DD']);
              var minutes = 1000*60;
              var hours = minutes*60;
              var days = hours*24;
              diff_date = Math.round((data.toDate-data.fromDate)/days)+1;
          }
      if(data.selecedDoctor==null)
        {
          data.selecedDoctor="";
        }
        console.log(fromDate);
     this.visitsService.getAppintmentsBetweenDates(data.selecedDoctor,fromDate,diff_date).subscribe(res => {
      console.log(res);
      this.filteredVisits=res.data;
      this.filteredVisits.forEach(visit=>{
        console.log(visit);
      })
      console.log(this.filteredVisits);
      this.isPrintClicked = false;
      this.isPrinting = true;
      },(err) => {
        console.log(err);
      }, () => {
        this.isStartLoader = false;
      })
  }
    autoComplete=[];
    
    getLeadTags(){
    this.leadsService.getLeadTags().subscribe(res => {
         res.description.forEach(element => {
            this.autoComplete.push(element.title);
          });
       // console.log(this.leadtagsForFilter);
      },(err) => {
      }, () => {
      })
  }

}
