import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TeacherService } from "../service/teacher.service";
import { Observable, of } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import { CurrentUserInterface } from "../../auth/shared/types/currentUser.interface";
import { StudentInterface } from "../types/student.interface";
import { Store } from "@ngrx/store";
import { logOutAction } from "../../auth/store/actions/logOut.action";
import { Router } from "@angular/router";

@Component({
    selector: 'platanus-login',
    templateUrl: './teacher.component.html',
    styleUrls: ['./teacher.component.css'],
    standalone:true,
    imports:[
      CommonModule,
      ReactiveFormsModule,
    ],
    
  })

export class TeacherComponent implements OnInit{

    subjectList$:Observable<string[]>
    studentList$:Observable<StudentInterface[]>

    user$: Observable<CurrentUserInterface>
    
    constructor(private teacherService:TeacherService,private authService:AuthService,private store:Store,private router:Router){}

    ngOnInit(): void {
        this.getSubjects()
        this.getCurrentUser()
        // this.getStudents()
    }

    getCurrentUser(){
      this.user$ = this.authService.getCurrentUser()
    }

    // getStudents(){
    //   this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
    //     this.teacherService.getStudents(user.id).subscribe((students: StudentInterface[]) => {
    //       console.log(students); // Выводим список студентов в консоль
    //       this.studentList$ = of(students); // Присваиваем список студентов переменной studentList$
    //     });
    //   });
      
    // }

    selectedSubject(value: Event){
      const target = event.target as HTMLSelectElement;
      let selectedSubjectValue = target.value;
      this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
        this.teacherService.getStudents(user.id,selectedSubjectValue).subscribe((students: StudentInterface[]) => {
          console.log(students); 
          this.studentList$ = of(students); 
        });
      });
    }

    getSubjects(){
      this.authService.getCurrentUser().subscribe((user:CurrentUserInterface)=>{
        this.subjectList$= this.teacherService.getSubjects(user.id)
      })
    }

    logOutFun():void{
      console.log('asdads')
      this.store.dispatch(logOutAction())
      this.router.navigate(['/login']);
    }

    toggleCollapsed(): void {
      const body = document.querySelector(".body");
      const scroll = document.querySelector(".scroll")
      scroll.classList.add('scroll-margin')
      body.classList.toggle('collapsed');
      
    }

    choosenLinkItem(pageId:string,switchPageParam:string){
      const page = document.querySelectorAll('.tooltip.link-item')
      page.forEach(page=>page.classList.remove('active'))
      const switchPage = document.querySelectorAll('.container-content')
      switchPage.forEach(switchPage=>switchPage.classList.remove('choose'))
      const currentSwitchPage = document.getElementById(switchPageParam)
      const currentPage = document.getElementById(pageId)
      console.log(switchPageParam)
      if(currentPage){
        currentPage.classList.add('active')
        document.documentElement.scrollTop = 0;
      }
      if(currentSwitchPage){
        currentSwitchPage.classList.add('choose')
      }

    }
    
}