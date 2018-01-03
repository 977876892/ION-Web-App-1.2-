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
    this.isStartLoader = true;
    this.loginService.loginUser(this.loginForm.value).subscribe(
      (loginUserResponse: any) => {
         if (loginUserResponse.code === '200') {
           this.loginService.getCommonDetails(loginUserResponse.teamid).subscribe(
                (commonDetails: any) => {
                  console.log(loginUserResponse);
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
                        profilepic: loginUserResponse.profile_image,
                        cliniclogo:loginUserResponse.clinic_logo,
                        analyticId: commonDetails.description[0].ganalytics,
                        username: this.loginForm.value.username,
                        pwd: btoa(this.loginForm.value.password),
                        categoryid: loginUserResponse.parent_category_id,
                        publishid:loginUserResponse.publishid,
                        smsSenderId:commonDetails.description[0].sender_id
                      }));
                    this.router.navigate(['home']);
                }, (err) => {
                      this.errorMessage = 'Team id is Empty.';
                }, () => {
 
                })
         }
         // console.log(loginUserResponse);
          }, (err) => {
            this.isStartLoader = false;
            this.errorMessage = 'Username and password do not match or you do not have an account yet';
          }, () => {
           // this.isStartLoader = false;
          });

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
