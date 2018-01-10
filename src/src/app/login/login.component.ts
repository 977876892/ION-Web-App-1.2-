import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthserviceService } from '../shared/services/login/authservice.service';
// import { Storage } from '../shared/storage/storage';

@Component({
  selector: 'app-login',
  providers: [ AuthserviceService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
    private loginService: AuthserviceService) {}

  ngOnInit() {
   // console.log(window.bota(this.loginForm.value.password));
  }
  // Singn function
  signIn() {
    console.log(this.loginForm.value)
    if(this.loginForm.value.password == '' && this.loginForm.value.username==''){
      this.errorMessageEmpty = 'Please Enter Username And Password';
      this.errorMessage="";
      console.log(this.loginForm.value)
    }else{
    this.isStartLoader = true;
    this.loginService.loginUser(this.loginForm.value).subscribe(
      (loginUserResponse: any) => {
         if (loginUserResponse.code === '200') {
           this.loginService.getCommonDetails(loginUserResponse.teamid).subscribe(
                (commonDetails: any) => {
                  console.log(loginUserResponse);
                  loginUserResponse.groups.split(",");
                  console.log(commonDetails);
                        // this.isStartLoader = false;
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
                        profilepic: commonDetails.description[0].avatar,
                        cliniclogo:loginUserResponse.clinic_logo,
                        analyticId: commonDetails.description[0].ganalytics,
                        username: this.loginForm.value.username,
                        pwd: btoa(this.loginForm.value.password),
                        categoryid: loginUserResponse.parent_category_id,
                        publishid:loginUserResponse.publishid,
                        smsSenderId:commonDetails.description[0].sender_id,
                        userGroup:(loginUserResponse.groups.split(","))[0]
                      }));
                    this.router.navigate(['home']);
                }, (err) => {
                      //this.errorMessage = 'Team id is Empty.';
                      this.errorMessage = "You don't have the access to login.";
                      this.isStartLoader = false;
                }, () => {
 
                })
         }
         // console.log(loginUserResponse);
          }, (err) => {
            this.isStartLoader = false;
            this.errorMessageEmpty ="";
            this.errorMessage = 'Username and password do not match or you do not have an account yet';
          }, () => {
           // this.isStartLoader = false;
          });
        }

  }
  username_field(user){
    console.log(user);
    if(this.loginForm.value.password == '' && this.loginForm.value.username==''){
      this.errorMessageEmpty = 'Please Enter Username And Password';
      this.errorMessage="";
    }
    else{
      this.errorMessageEmpty ="";
    }
  }
termsdata:any=[];  
  termsCondition(){
   
    this.isStartLoader = true;
    return this.loginService.termsandcondition()
    .subscribe(
      (termdataResponse: any) => {
         // console.log(termdataResponse);
         this.isAlertPopup = true;
         this.termsdata=termdataResponse.introtext;
         console.log(this.termsdata);
         this.isStartLoader = false;
        // console.log(this.termsdata);
      }) 
  }

  
}
