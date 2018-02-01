import { Component, OnInit , Inject, ViewChild,HostListener} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup,FormArray } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { Users } from './userlist';
import { SettingsService } from '../shared/services/settings/settings.service';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import { IonServer } from '../shared/globals/global';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [SettingsService,AuthserviceService]
})
export class SettingsComponent implements OnInit {

@ViewChild('deleteUser') deleteUser;
  constructor(private router: Router, private route: ActivatedRoute, private settingsService:SettingsService,private builder: FormBuilder,private authService: AuthserviceService,) { 
      document.addEventListener('click', this.offClickHandler.bind(this));
  }
  offClickHandler(event: any) {
  if (this.deleteUser && !this.deleteUser.nativeElement.contains(event.target)) {
    //this.isDeleteButtonClick=false;
     this.usersList.forEach(user=>{
         user.isClickOnDottedLine=false;
       })
 }
}
  showProfile: boolean=true;
  showContactus:boolean=false;
  showSubscription:boolean=false;
  showUsers:boolean=false;
  isShowUserPopup: boolean = false; 
  isHelpPopup:boolean=false;
  phoneMinlength:boolean=false;
  isDeleteAlertPopup:boolean=false;
  isDeleteButtonClick:boolean=false;
  isClickOnEdit:boolean=false;
  isShowImgDeleteButt: boolean = false;
  imageUploadAlert:boolean=false;
  isAddVisitLoader:boolean=false;
  imageerrorAlert:boolean=false;
  queryBoxAlert:boolean=false;
  isHelpButtonPopup:boolean=true;
  connect_err=IonServer.nointernet_connection_err;
  f_name_req_comm=IonServer.f_name_required;
  f_name_length_comm=IonServer.f_name_length;
  spaceComment=IonServer.Space_Not_required; 
  l_name_required_comm=IonServer.l_name_required;
  email_required_comm=IonServer.email_required;
  invalid_email_comm=IonServer.invalid_email;
  imgsize="The file size can not exceed 8MB.";
  fname:string;
  lname:string;
  query_des:string='';
  userMangement_select_card_delete='';
  email:string;
  mobile:string;
  aboutme:string;
  numLength:number;
  role:string;
  //profile_pic:string;
  item= new Users();
  useritem= new Users();
  pwditem=new Users();
  usersList:any;
  allcategoryname=[];
  getcategoryname:any[];
  getcategoryid:any[];
  dropdownList = [];
  userselectedItems = [];
  selectedItems=[];
  dropdownSettings = {};
  isStartLoader=false;
  imgerror="Choose Only Image.";
  isGroupsRequied:boolean=false;
  pwdNotMatch:boolean=false;
  imageSrc='';
  pic="";
  userDetails:any=[];
  profileForm: FormGroup = this.builder.group({
    firstname: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    role:new FormControl(''),
    aboutme:new FormControl(''),
    profile_pic : new FormControl('')
  });
  @ViewChild('fileInput') fileInput;
    userDetailsForm: FormGroup = this.builder.group({
    firstname: new FormControl(''),
    surname: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    reTypePassword:new FormControl(''),
    groups:new FormControl(''),
    categories:new FormControl(''),
    image:new FormControl('')
   
    //receivingSystemEmail:new FormControl('')
  });
  currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  userGroups=[{name:"Doctor",value:10,checked:false},{name:"Frontdesk Team",value:15,checked:false},{name:"Junior Doctors",value:16,checked:false},{name:"Business Head",value:17,checked:false}]
    ngOnInit() {
    if (localStorage.getItem('user') == '' || localStorage.getItem('user')==null) {
      this.router.navigate(['login']);
    } else {
      this.getIonSubscriptionDetails();
        console.log(localStorage.getItem('user'));
      const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
      this.profileForm.patchValue({
        firstname: currentuser.firstname,
        surname:  currentuser.lastname,
        email:   currentuser.email,
        phone: currentuser.mobile,
        role: currentuser.role,
        aboutme:currentuser.aboutme,
        profile_pic:currentuser.profilepic
      })
      this.userDetails = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
console.log(this.userDetails);
      this.dropdownSettings = {
              singleSelection: false,
              text:"Select Query",
              selectAllText:'Select All',
              unSelectAllText:'UnSelect All',
              enableSearchFilter: true,
              classes:"myclass custom-class"
        };
   
      this.settingsService.selectCategoriesService()
      .subscribe(
        (userdataResponse: any) => {
            //console.log(userdataResponse);
           this.dropdownList=userdataResponse.description;
           for(let i=0;i<this.dropdownList.length;i++){
            this.getcategoryname=this.dropdownList[i].category_name;
            this.getcategoryid=this.dropdownList[i].id;

                this.allcategoryname.push(
                    {
                      "id":i,
                      "itemName": this.getcategoryname,
                      "itemid":this.getcategoryid
                    }

                );
                //    this.selectedItems.push(
                //     {
                //       "id":i,
                //       "itemName": this.getcategoryname,
                //       "itemid":this.getcategoryid
                //     }
                // );
          }
         //  console.log(this.allcategoryname);
         //  console.log(this.dropdownList);
        });
    }
     if(this.router.url == '/settings') {
        //this.blogCalendarCall();
        //this.getCategories();
        this.showProfile=true;
          this.showContactus=false;
          this.showSubscription=false;
          this.showUsers=false;
      } else if(this.router.url == '/settings/contactus') {
        this.showProfile=false;
          this.showContactus=true;
          this.showSubscription=false;
          this.showUsers=false;
      } else if(this.router.url == '/settings/users') {
        
      if(this.currentuser.userGroup!=17)
        {
          this.router.navigate(['home']);
        }
        else{
          this.showProfile=false;
          this.showContactus=false;
          this.showSubscription=false;
          this.showUsers=true;
           this.getUserData();
        }
      } else {
         this.showProfile=false;
          this.showContactus=false;
          this.showSubscription=true;
          this.showUsers=false;
      }

    
    
  }
  // onEventChanged(stype: any) {
  //       if (stype === 'profile') {
  //         this.showProfile=true;
  //         this.showContactus=false;
  //         this.showSubscription=false;
  //         this.showUsers=false;
  //       } else if (stype === 'contactus') {
  //         this.showProfile=false;
  //         this.showContactus=true;
  //         this.showSubscription=false;
  //         this.showUsers=false;
  //       }
  //       else if (stype === 'users') {
  //         this.showProfile=false;
  //         this.showContactus=false;
  //         this.showSubscription=false;
  //         this.showUsers=true;
  //       }else  {
  //         this.showProfile=false;
  //         this.showContactus=false;
  //         this.showSubscription=true;
  //         this.showUsers=false;
  //       }

  // }
  
  clickedOnDottedLine(index) {
    // console.log(id);
    // this.isDeleteButtonClick=!this.isDeleteButtonClick;
    // this.userMangement_select_card_delete=id;
    //console.log(this.usersList);
    this.usersList.forEach(user=>{
      user.isClickOnDottedLine=false;
    })
    this.userMangement_select_card_delete=this.usersList[index].id;
    this.usersList[index].isClickOnDottedLine = true;
  //    if(this.usersList[index].isClickOnDottedLine) {
  //       this.usersList[index].isClickOnDottedLine = false;
  // }else {
        
  // }
  }
  userCardDelete(){
    //console.log("id");
     this.usersList.forEach(user=>{
         user.isClickOnDottedLine=false;
       })
    this.isDeleteAlertPopup=true;
    this.isDeleteButtonClick=false;
  }
  deleteTheUser(){
    this.isDeleteAlertPopup=false;
    this.isStartLoader=true;
    this.settingsService.DeleteUserService(this.userMangement_select_card_delete).subscribe(res=>{
      console.log(res);
      this.isStartLoader=false;
      this.getUserData();
    },(err)=>{
      this.isStartLoader=false;
      this.isAlertPopup=true;
      this.isDeleteAlertPopup=false;
      this.alertMessage=this.connect_err;
    })
  }
  onTypeNumValid(numValue) { 
    //this.numLength=numValue.length; 
    console.log(numValue.length)
        if(numValue.length > 10){
          this.phoneMinlength=true;
        }
        else{
           this.phoneMinlength=false;
        }
    }
  profile_sub() {
    console.log(this.profileForm.value);
    console.log((this.profileForm.value.phone).toString().length);
    if((this.profileForm.value.phone).toString().length!=10)
    {
       this.phoneMinlength=true;
    }
    else{
      this.phoneMinlength=false;
    }
  if(this.profileForm.valid && !this.phoneMinlength){
    this.isStartLoader = true;
    this.settingsService.editProfileListService(this.profileForm.value).subscribe(data => {
      localStorage.setItem('user', JSON.stringify({
        email: this.profileForm.value.email,
        firstname: this.profileForm.value.firstname,
        lastname: this.profileForm.value.surname,
        mobile: this.profileForm.value.phone,
        aboutme: this.profileForm.value.aboutme,
        role: this.profileForm.value.role,
        profilepic:this.profileForm.value.profile_pic,
        name:this.profileForm.value.firstname+' '+this.profileForm.value.surname,
        cliniclogo:this.userDetails.cliniclogo,
        id: this.userDetails.id,
        teamid: this.userDetails.teamid,
        auth: this.userDetails.auth,
       analyticId: this.userDetails.analyticId,
        username: this.userDetails.username,
        pwd: this.userDetails.pwd,
        categoryid:this.userDetails.categoryid,
        publishid:this.userDetails.publishid,
        smsSenderId:this.userDetails.smsSenderId,
        userGroup:this.userDetails.userGroup,
        smsbalance:this.userDetails.smsbalance
      }));
      this.isStartLoader = false; 
      this.isAlertPopup=true;
      this.alertMessage="Profile Updated Successfully.";
     this.isShowImgDeleteButt=false;
         console.log(localStorage.getItem('user'));
              },(err)=>{
                this.isStartLoader = false; 
                this.isAlertPopup=true;
                this.alertMessage=this.connect_err;
              },()=>{});
     }else{
      this.isStartLoader = false;
       this.validateAllFormFields(this.profileForm);
     }  
  }
 
  needhelp(){
    this.isHelpPopup=!this.isHelpPopup;
    this.isHelpButtonPopup=false;
  }

  // submit_query
  submit_query(query_des){
    if( query_des == ''){
      this.queryBoxAlert=true;
    }
    else{
      this.queryBoxAlert=false;
    //this.userDetailsForm.value.query_des
    this.isStartLoader=true;
     console.log(query_des);
     this.settingsService.postAskYourQuery(query_des).subscribe(data =>{
      this.isAlertPopup=true;
      this.alertMessage="Your Query Successfully Added"
      this.isStartLoader=false;
      this.query_des='';
     },(err)=>{
       this.isAlertPopup=true;
       this.alertMessage=this.connect_err;
       this.isStartLoader=false;
     },()=>{});
    }
  }
  query_text(query_des){
    console.log(query_des)
    if( query_des == ''){
      this.queryBoxAlert=true;
       }else{
        this.queryBoxAlert=false;
       }
  }

// upload image

uploadprofilepic() {
  this.isStartLoader=true;
  const fileBrowser = this.fileInput.nativeElement;
  console.log(fileBrowser.files[0]);
  // if (fileBrowser.files && fileBrowser.files[0]) {
   // console.log(fileBrowser.files[0]);
   if(fileBrowser.files[0])
    {
     
      if(fileBrowser.files[0].size/1024/1024 > 9) {
        this.imageUploadAlert = true;
        this.imageerrorAlert = false;
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
          console.log(res)
          if(res.description==undefined)
          {
               // console.log("error");
                this.imageUploadAlert = false;
                this.imageerrorAlert=true;
          }else{
              //this.imageSrc = res.description[0].url;
             // this.item.profile_pic = res.description[0].url;
             this.profileForm.patchValue({
               profile_pic:res.description[0].url
             })
              this.isStartLoader = false;
              this.isShowImgDeleteButt=true;
              
          }
        
        },(err) => {
          this.isStartLoader = false; 
          this.isAlertPopup=true;
          this.alertMessage=this.connect_err;
        }, () => {
          this.fileInput.nativeElement.value = '';
          this.isStartLoader = false;
        });
    }
    
    
  
}
uploadprofilepicDelete(){
  this.isStartLoader=true;
  this.profileForm.patchValue({
    profile_pic:''
  })
  this.imageSrc="";
   this.isShowImgDeleteButt=false;
  console.log( this.imageSrc);
  this.imageerrorAlert=false;
  this.imageUploadAlert = false;
  this.isStartLoader=false;

}
  changepassword(pwditem){
    //console.log(pwditem);
    this.isStartLoader=true;
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    //console.log(currentuser.pwd);
    if (currentuser.pwd == btoa(pwditem.oldpwd)) {
            if (pwditem.newpwd == pwditem.conpwd){
                  this.settingsService.changePwdListService(pwditem.newpwd)
                  .subscribe(data => {
                      console.log("success");
                      this.isStartLoader=false;
                      this.isAlertPopup=true;
                      this.alertMessage="Password Changed Successfully.";
              },(err)=>{
                this.isAlertPopup=true;
                this.alertMessage=this.connect_err;
                this.isStartLoader=false;
              });
            }else{console.log("newpwd and conpwd not matching");}
    }else {
      console.log(" error ");
    }
  }

 getUserData(){
   console.log("test");
   this.isStartLoader=true;
   this.settingsService.getUsersListService().subscribe(
     (userdataResponse: any) => {
         console.log(userdataResponse);
        this.usersList=userdataResponse.description;
        // this.usersList.forEach(user=>{
        //   user.email=user.email.split("@");
        // })
        this.isStartLoader=false;
     },(err)=>{
      this.isStartLoader = false; 
      this.isAlertPopup=true;
      this.alertMessage=this.connect_err;
     },()=>{
       this.usersList.forEach(user=>{
         user.isClickOnDottedLine=false;
       })
     });
 }

 isAddUser=false;
 userid="";
 isStartLoaderForUserPopup=false;
 openUserDialog(userId){
   this.selectedItems=[];
   this.isDeleteButtonClick=false;
  if(typeof userId=="undefined")
    {
       
        this.userDetailsForm.patchValue({
                    firstname: '',
                    surname: '',
                    username: '',
                    email: '',
                    password: '',
                    reTypePassword:'',
                    image:''
        })
        this.userGroups=[{name:"Doctor",value:10,checked:false},{name:"Frontdesk Team",value:15,checked:false},{name:"Junior Doctors",value:16,checked:false},{name:"Business Head",value:17,checked:false}];
        this.isAddUser=true;
    }else{
       this.isStartLoaderForUserPopup=true;
      this.userid=userId;
      console.log(userId);
      this.settingsService.getUserDetails(userId).subscribe(
        (userdataResponse: any) => {
            console.log(userdataResponse);
             this.userGroups.forEach(group=>{
               console.log(userdataResponse.groups===group.value);
               if(parseInt(userdataResponse.groups)===group.value)
                {
                  group.checked=true;
                }
             })
            //this.groupsArray.push(userdataResponse.groups)
            // for (let key in userdataResponse.groups) {
            //   for(let user of this.userGroups)
            //     {
            //       console.log(user.value == parseInt(key));
            //       if(user.value == parseInt(key))
            //         {
            //             user.checked=true;
            //         }
            //     }
            // }
            console.log(userdataResponse.category_id);
            if(userdataResponse.category_id!=null)
              {
                for(let key of userdataResponse.category_id)
                  {
                          this.selectedItems.push(
                          {
                            "id":key.id,
                            "itemName": key.category_name,
                          }
                      );
                  }
              }
            
            this.userDetailsForm.patchValue({
                    firstname: userdataResponse.firstname,
                    surname:  userdataResponse.lastname,
                    username:  userdataResponse.username,
                    email:  userdataResponse.email,
                    password: '',
                    reTypePassword:'',
                    image:userdataResponse.avatar
            })
        },err=>{
          this.isStartLoaderForUserPopup=false;
          this.isAlertPopup=true;
          this.isShowUserPopup = false;
          this.alertMessage=this.connect_err;
        },()=>{ this.isStartLoaderForUserPopup=false;})
         
    }
  this.isShowUserPopup = true;
 }
selectedGroup(i){
  if(this.userGroups[i].checked == true) {
      this.userGroups[i].checked == false;
    }else {
     this.userGroups[i].checked == true;
    }
}
 selectCategory=[];
 onItemSelect(item:any){
     console.log(item);
     //console.log(this.itemName);
     this.selectCategory.push(item.itemid);
    // console.log(this.selectCategory);
 }

ids:any;
isAlertPopup=false;
alertMessage="";
groupClick(group)
{
    console.log(group);
    this.userDetailsForm.value.groups=group;
    this.isGroupsRequied=false;
}
 
addNewUser(){
  // console.log(this.userDetailsForm.value.password);
  // console.log(this.userDetailsForm.value.reTypePassword);

  var categeries="";
  console.log(this.userDetailsForm.value);
    for(let cat of this.selectedItems){
            categeries=categeries+cat.id+",";
    }
        console.log(categeries);

        //console.log(ids);
        //this.userDetailsForm.value.groups=ids;
        if(this.userDetailsForm.value.groups=='' ||this.userDetailsForm.value.groups==null){
          this.isGroupsRequied=true;
        }
        this.userDetailsForm.value.categories=categeries;
        if(this.userDetailsForm.value.password == this.userDetailsForm.value.reTypePassword){
          this.pwdNotMatch=false;
          console.log(this.pwdNotMatch);
          console.log("true");
                if(this.userDetailsForm.valid && !this.isGroupsRequied)
                  {
                      this.isStartLoaderForUserPopup=true;
                      this.settingsService.addNewUserService(this.userDetailsForm.value)
                 .subscribe(
                        data => {console.log(data);
                          //this.isStartLoader=true;
                          

                          if(data.message=="The username is already taken, try another.")
                            {
                               this.alertMessage=data.message;
                               this.isStartLoaderForUserPopup=false;
                               this.isAlertPopup=true;
                            }else if(data.message=="This email address is already registered.")
                              {
                                this.alertMessage=data.message;
                                this.isStartLoaderForUserPopup=false;
                                this.isAlertPopup=true;
                              }
                              else{
                                    this.isStartLoaderForUserPopup=false;
                                    this.imageSrc="";
                                    this.alertMessage="User Added Successfully."
                                    this.isAlertPopup=true;
                                    this.closeUserPopUp();
                                    //this.getUserData();
                                    console.log("success");
                              }
                         },
                        err => {
                          this.isStartLoaderForUserPopup=false;
                          this.isAlertPopup=true;
                          this.alertMessage=this.connect_err;
                        }
                  );
                  }
                  else{
                      this.validateAllFormFields(this.userDetailsForm);
                    }
          }
          else{
                this.pwdNotMatch=true;
                 console.log(this.pwdNotMatch);
                 console.log("false");
         // this.isShowUserPopup=true;
          }
        
         
 }
  updateUser(){
    if(this.userDetailsForm.value.password != this.userDetailsForm.value.reTypePassword){
       console.log("false");
       this.pwdNotMatch=true;

     }
     else{
        this.pwdNotMatch=false;
        var ids="",categeries="";
         for(let groups of this.userGroups)
          {
            if(groups.checked)
              {
                  ids=ids+groups.value+",";
              }
          }
          for(let cat of this.selectedItems){
                  categeries=categeries+cat.id+",";
          }
              console.log(categeries);
              console.log(ids);
              this.userDetailsForm.value.groups=ids;
              this.userDetailsForm.value.categories=categeries;
              console.log( this.userDetailsForm.value);
              //this.isStartLoader=true;
              this.isStartLoaderForUserPopup=true;
               this.settingsService.updateUserService(this.userDetailsForm.value,this.userid)
               .subscribe(
                      data => {
                        // this.isStartLoader=false;
                        this.isStartLoaderForUserPopup=false;
                        this.isAlertPopup=true;
                        this.alertMessage="User Updated Successfully."
                         this.closeUserPopUp();
                         //this.getUserData();
                        console.log(data);console.log("success");},
                      err =>{
                       this.isStartLoader=false;
                       this.isAlertPopup=true;
                       this.alertMessage=this.connect_err;
                      }
                );
          }
  
 }

groupId:any;
selectedIds=[];
 updateCheckedOptions(option, event) {
    this.groupId=event.srcElement.defaultValue;
    var index = this.selectedIds.indexOf(this.groupId);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
       }
      else
      this.selectedIds.push(this.groupId);
 }
 
 OnItemDeSelect(item:any){
     console.log(item);
     console.log(this.userselectedItems);
 }
 onSelectAll(items: any){
     console.log(items);
 }
 onDeSelectAll(items: any){
     console.log(items);
 }
    closeUserPopUp()
    {
      this.isShowUserPopup = false;
      this.isShowImgDeleteButt=false;
      this.isAddUser=false;
      this.userDetailsForm.reset();
      this.isGroupsRequied=false;
      this.selectedItems=[];
      for(let user of this.userGroups)
              user.checked=false;     
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
    // blockUser(value){
    //     //console.log(value);
    //     this.userDetailsForm.value.blockUser=value;
    // }
    //   receiveMail(value){
    //     this.userDetailsForm.value.receiveMail=value
    //   }
    subscriptionDetails="";
    subscriptionStart:any=[];
    subscriptionEnd:any=[];
    getIonSubscriptionDetails(){
      this.settingsService.getIonSubscriptionDetails().subscribe(data=>{
          console.log(data.description[0]);
          this.subscriptionDetails=data.description[0];
          this.subscriptionStart=data.description[0].subscription.split(" ");
          this.subscriptionEnd=data.description[0].expiration.split(" ");
      },
      err=>{
        this.isAlertPopup=true;
        this.alertMessage=this.connect_err;
        this.isStartLoader=false;
      },()=>{})
    }

    upload() {
  this.isStartLoader = true;
  this.isStartLoaderForUserPopup=true;
  this.imageerrorAlert=false;
  const fileBrowser = this.fileInput.nativeElement;
   if (fileBrowser.files && fileBrowser.files[0]) {
   // console.log(fileBrowser.files[0]);
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
   //   console.log(res);
        if(res.description==undefined)
        {
              this.imageerrorAlert=true;
              this.isStartLoader = false;
        }else{

                this.imageSrc = res.description[0].url;
                this.isShowImgDeleteButt=true;
                this.userDetailsForm.patchValue({
                    image:res.description[0].url
                })
                  setTimeout (() => {
                    this.isStartLoader = false;
              console.log("Hello from setTimeout");
            }, 2000)
        }
        //this.userDetailsForm.value.image=this.imageSrc;
       // this.isStartLoader = false;
     // }
    },(err) => {
        this.fileInput.nativeElement.value = '';
        this.isStartLoader = false;
        this.isStartLoader=false;
        this.isAlertPopup=true;
        this.alertMessage=this.connect_err;
     }, () => {
       this.isStartLoaderForUserPopup=false;
      //this.isStartLoader = false;
    });
  }
}
 uploadImgeDelete(){
  this.userDetailsForm.patchValue({
            image:''
        })
   this.isShowImgDeleteButt=false;
   this.imageerrorAlert=false;
  // this.imageUploadAlert = false;
 // console.log(this.userDetailsForm.controls['image'].value);
}
passwordchanges(){
  this.pwdNotMatch=false;
}
isScrolled: boolean = false;
  isNoRecords: boolean = false;
  windowBottom:any="";
  @HostListener("window:scroll", [])
   onWindowScroll() {
     if(this.showUsers){
      if (!this.isScrolled && !this.isNoRecords) {
      let windowHeight = "innerHeight" in window ? window.innerHeight
        : document.documentElement.offsetHeight;
      
      if(!this.isShowUserPopup)
        {
            //console.log(windowHeight + window.pageYOffset);
            this.windowBottom=window.pageYOffset;
        }
    }
}
  };

}
