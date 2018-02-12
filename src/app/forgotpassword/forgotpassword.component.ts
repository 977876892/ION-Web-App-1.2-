import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthserviceService } from '../shared/services/login/authservice.service';

@Component({
  selector: 'app-forgotpassword',
  providers: [ AuthserviceService],
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  isStartLoader:boolean=false;
  isAlertPopup:boolean=false;
  forgotPasswordForm: FormGroup = this.builder.group({
    username: new FormControl(''),
  });

  constructor(private router: Router,
    private builder: FormBuilder,
    private loginService: AuthserviceService) { }

  ngOnInit() {
  }
  showErrorMessage=false;
  recoveryPassword() {
    this.loginService.forgotPasswordService(this.forgotPasswordForm.value.username).subscribe(
      (loginUserResponse: any) => {
        if (loginUserResponse.status === 'set') {
          // this.storage.session = Object.assign(
          //   this.storage.session, {
          //     user: {
          //       id: loginUserResponse.id,
          //       name: loginUserResponse.name,
          //       email: loginUserResponse.email,
          //       auth: loginUserResponse.auth,
          //     },
          //   });
            this.router.navigate(['login']);
        }
          else{
              this.showErrorMessage=true;
          }
      }, (err) => {

      }, () => {

      });

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
