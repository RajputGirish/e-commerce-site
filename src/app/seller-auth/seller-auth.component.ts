import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { signUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {

  constructor(private seller: SellerService, private router: Router) { }

  showLogin: boolean = false;    //base on this false & true we can decide that which one to show out of SignUp or Login
  authError:string = '';

  ngOnInit(): void {
    this.seller.reloadSeller()
  }

  signUp(data: signUp): void {
    console.warn(data);
    this.seller.userSignUp(data);
  }
  login(data: signUp): void {
    // console.warn(data);
    this.authError="";
    this.seller.userLogin(data);
    this.seller.isLoginError.subscribe((isError)=>{
      if(isError){
        this.authError="Email.or Password is not correct"
      }
    })
  }

  openLogin() {
    this.showLogin = true
  }
  openSignUp() {
    this.showLogin = false
  }
}
