import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthserviceService } from '../shared/services/login/authservice.service';
import { ErrorService } from '../shared/services/error/error.service';
// import { Storage } from '../shared/storage/storage';

@Component({
  selector: 'app-login',
  providers: [ AuthserviceService,ErrorService],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.builder.group({
    password: new FormControl(''),
    username: new FormControl(''),
  });
  errorMessage: string;
  errorMessageEmpty="";
  isStartLoader;
  isAlertPopup=false;
  constructor(private router: Router,
    private builder: FormBuilder,
    private loginService: AuthserviceService,
  private errorservice:ErrorService) {}

  ngOnInit() {
  }
  // Singn function
  signIn() {
    if(this.loginForm.value.password == '' && this.loginForm.value.username==''){
      this.errorMessageEmpty = 'Please Enter Username And Password';
      this.errorMessage="";
    }else{
    this.isStartLoader = true;
    this.loginService.loginUser(this.loginForm.value).subscribe(
      (loginUserResponse: any) => {
         if (loginUserResponse.code === '200') {
           this.loginService.getCommonDetails(loginUserResponse.teamid).subscribe(
                (commonDetails: any) => {
                  loginUserResponse.groups.split(",");
                        localStorage.setItem('user', JSON.stringify({
                        id: loginUserResponse.id,
                        teamid: loginUserResponse.teamid,
                        name: loginUserResponse.name,
                        email: loginUserResponse.email,
                        auth: loginUserResponse.auth,
                        firstname: loginUserResponse.firstname,
                        lastname: loginUserResponse.lastname,
                        mobile: loginUserResponse.phone,
                        aboutme: loginUserResponse.aboutme,
                        role: loginUserResponse.role,
                        profilepic: loginUserResponse.profile_image,
                        cliniclogo:commonDetails.description[0].clinic_logo,
                        analyticId: commonDetails.description[0].ganalytics,
                        username: this.loginForm.value.username,
                        pwd: btoa(this.loginForm.value.password),
                        categoryid: loginUserResponse.parent_category_id,
                        publishid:loginUserResponse.publishid,
                        smsSenderId:commonDetails.description[0].sender_id,
                        userGroup:(loginUserResponse.groups.split(","))[0],
                        smsbalance:commonDetails.description[0].smsbalance,
                        onesignal:''
                      }));
                    this.router.navigate(['home']);
                }, (err) => {
                      //this.errorMessage = 'Team id is Empty.';
                      this.errorMessage = "You don't have the access to login.";
                      this.isStartLoader = false;
                }, () => {
 
                })
         }
          }, (err) => {
            this.isStartLoader = false;
            this.errorMessage= this.errorservice.logErrorForLogin(err);
            this.errorMessageEmpty ="";
            //this.errorMessage = 'Username and password do not match or you do not have an account yet';
          }, () => {
           // this.isStartLoader = false;
          });
        }

  }
  username_field(user){
    if(this.loginForm.value.password == '' && this.loginForm.value.username==''){
      this.errorMessageEmpty = 'Please Enter Username And Password';
      this.errorMessage="";
    }
    else{
      this.errorMessageEmpty ="";
    }
  }
termsdata:any="";
heading:any="";
  termsCondition(){
   
    this.isStartLoader = true;
    return this.loginService.termsandcondition()
    .subscribe(
      (termdataResponse: any) => {
         this.heading="Terms & Conditions";
         this.isAlertPopup = true;
         this.termsdata=termdataResponse.introtext;
         this.isStartLoader = false;
      }) 
  }
    privacyPolicy(){
    this.isStartLoader = true;
    return this.loginService.privacyPolicy()
    .subscribe(
      (termdataResponse: any) => {
        this.heading="Privacy Policy";
         this.isAlertPopup = true;
         this.termsdata=termdataResponse.introtext;
         this.isStartLoader = false;
      }) 
  }

  
}
