import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Observable, take } from "rxjs"
import { Store, select } from "@ngrx/store"
import { LoginRequestInterface } from "../../types/loginRequest.interface"





import { AppStateInterface } from "../../shared/types/appState.interface"
import { Route, Router } from "@angular/router"
import { loginAction } from "../../store/actions/login.action"
import { logOutAction } from "../../store/actions/logOut.action"
import { isLoggedInSelector } from "../../store/auth.selector"





@Component({
  selector: 'platanus-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:true,
  imports:[
    CommonModule,
    ReactiveFormsModule,
  ],
  
})
export class LoginComponent implements OnInit {
  form: FormGroup
  isSubmitting$: Observable<boolean>
  isLoggedIn$:Observable<boolean>

  constructor(private fb: FormBuilder, private store: Store,private router:Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeIsLoggedIn();


  }

  initializeIsLoggedIn(){
    this.isLoggedIn$= this.store.pipe(select(isLoggedInSelector))
    this.store.pipe(select(isLoggedInSelector)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([''])
      } else {
      }
    })
  }

  initializeForm(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(): void {

    this.isSubmitting$ = this.store.select(isLoggedInSelector)

    const request: LoginRequestInterface = {
      user: this.form.value
    }
    this.store.dispatch(loginAction({request}))
  }




}