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
          this.isStartLoader = false;
          localStorage.setItem('user', JSON.stringify({
            id: loginUserResponse.id,
            teamid:loginUserResponse.teamid,
            name: loginUserResponse.name,
            email: loginUserResponse.email,
            auth: loginUserResponse.auth,
            profilepic: loginUserResponse.profile_image,
            username: this.loginForm.value.username,
            pwd: btoa(this.loginForm.value.password)
          }));
            this.router.navigate(['home']);
        }
        console.log(loginUserResponse);
      }, (err) => {
        this.errorMessage = 'Username and password do not match or you do not have an account yet';
      }, () => {
        this.isStartLoader = false;
      });

  }
}
