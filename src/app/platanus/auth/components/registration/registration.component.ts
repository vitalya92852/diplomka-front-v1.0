import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {  validationError } from "../../store/auth.selector";
import { RegistrationRequestInterface } from "../../types/registrationRequestInterface";
import { registrationAction } from "../../store/actions/registration.action";
import { AuthService } from "../../services/auth.service";
import { group } from "@angular/animations";



@Component({
    selector: 'registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
    standalone:true,
    imports:[
      
      ReactiveFormsModule,
      RouterModule,
      CommonModule,
    ],
    
  })

export class RegistrationComponent implements OnInit{

    form: FormGroup
    isSubmitting$: Observable<boolean>
    validError$: Observable<String>

    studentGroups:string[]


    constructor(private fb: FormBuilder, private store: Store,private router:Router,private authService:AuthService) {
        
    }

    ngOnInit(): void {
        this.userAlreadyExitsFun()
        this.initializeForm()
        this.getStudentGroups()
    }

    userAlreadyExitsFun(){
        this.validError$ = this.store.select(validationError);
    }

    initializeForm(): void {
        this.form = this.fb.group({
          username: ['', Validators.required],
          password: ['', Validators.required],
          name:['',Validators.required],
          lastname:['',Validators.required],
          surname:['',Validators.required],
          course:['',Validators.required],
          confirmPassword:['',Validators.required],
          group:['',Validators.required]
        })

    }
    
      onSubmit(): void {
        console.log(this.form.value)
        const request: RegistrationRequestInterface = {
            user:this.form.value
        }
        this.store.dispatch(registrationAction({request}))
        
      }

      getStudentGroups(){
        this.authService.getStudentGroups().subscribe(data=>{
          this.studentGroups = data
        })
      }

      onGroupChange(value: Event){
        const target = event.target as HTMLSelectElement;
        this.form.patchValue({
          group:target.value
        })
      }

    

}