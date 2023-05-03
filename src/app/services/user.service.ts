import { EventEmitter, Injectable } from '@angular/core';
import { login, signUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  invalidUserAuth = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(user: signUp){                    //this is used in user-auth.component.ts
    //console.warn(user);
    return this.http.post('http://localhost:3000/user', user, { observe: 'response'})
      .subscribe((result)=>{
        console.warn(result);

        if (result) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }
      });
  }

  userAuthReload(){                     //this is used in user-auth.component.ts. If user is already login then it will redirect it to home page.
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
  }

  userLogin(data: login){
    //console.warn(data);
    //API call code will be here
    this.http.get<signUp[]>(`http://localhost:3000/user?email=${data.email}&password=${data.password}`,
      { observe: 'response' })
      .subscribe((result: any) => {
        if(result && result.body && result.body.length){
          //console.warn(result);
          this.invalidUserAuth.emit(false)
          localStorage.setItem('user', JSON.stringify(result.body[0]));
          this.router.navigate(['/']);
        }else{
          this.invalidUserAuth.emit(true)
        }
        
      });
  }
}
