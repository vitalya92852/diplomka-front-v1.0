import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TeacherService } from "../service/teacher.service";
import { Observable, of, switchMap } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import { CurrentUserInterface } from "../../auth/shared/types/currentUser.interface";
import { StudentInterface } from "../types/student.interface";
import { Store, select } from "@ngrx/store";
import { logOutAction } from "../../auth/store/actions/logOut.action";
import { Router } from "@angular/router";
import { StudentRequestInterface } from "../types/studentRequest.interface";
import { hasRoleSelector, isLoggedInSelector } from "../../auth/store/auth.selector";

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

    isLoggedIn$:Observable<boolean>;

    subjectList$:Observable<string[]>
    studentList$:Observable<StudentInterface[]>

    selectedSubjectName:string

    subjectRequestGradeList$:Observable<string[]>
    studentRequestGradeList$:Observable<StudentRequestInterface[]>

    user$: Observable<CurrentUserInterface>
    
    constructor(private teacherService:TeacherService,private authService:AuthService,private store:Store,private router:Router){}

    ngOnInit(): void {
        this.getSubjects()
        this.getCurrentUser()
        this.getRequestGradeSubjects()
        this.initializeIsLoggedIn()
    }

    getCurrentUser(){
      this.user$ = this.authService.getCurrentUser()
    }



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

    getRequestGradeSubjects(){
      this.authService.getCurrentUser().subscribe((user:CurrentUserInterface)=>{
        this.subjectRequestGradeList$= this.teacherService.getRequestGradeSubjects(user.id)
      })
    }

    selectedRequestGradeSubject(value: Event){
      const target = event.target as HTMLSelectElement;
      this.selectedSubjectName = target.value;
      this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
        this.teacherService.getStudentsRequest(user.id,this.selectedSubjectName).subscribe((students: StudentRequestInterface[]) => {
          console.log(students); 
          this.studentRequestGradeList$ = of(students); 
        });
      });
    }

    rejectRequest(studentId:number,requestGrade:number,){
      this.authService.getCurrentUser().pipe(
        switchMap((user:CurrentUserInterface) => {
          const userId = user.id;
          return this.teacherService.rejectRequest(userId,requestGrade,studentId,this.selectedSubjectName);
        })
      ).subscribe(
        ()=>{
          console.log('Запрос на оценку отклонен');
          this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
            this.teacherService.getStudentsRequest(user.id,this.selectedSubjectName).subscribe((students: StudentRequestInterface[]) => {
              this.studentRequestGradeList$ = of(students); 
            });
          });
        },
        (error) => {
          console.error('Ошибка при отправке запроса:', error);
        }
      );
    }
    
    

    acceptRequest(studentId:number,requestGrade:number){
      this.authService.getCurrentUser().pipe(
        switchMap((user:CurrentUserInterface) => {
          const userId = user.id;
          return this.teacherService.acceptRequest(userId,requestGrade,studentId,this.selectedSubjectName);
        })
      ).subscribe(
        ()=>{
          console.log('Запрос на оценку принят');
          this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
            this.teacherService.getStudentsRequest(user.id,this.selectedSubjectName).subscribe((students: StudentRequestInterface[]) => {
              console.log(students); 
              this.studentRequestGradeList$ = of(students); 
            });
          });
        },
        (error) => {
          console.error('Ошибка при отправке запроса:', error);
        }
      );
    }


    initializeIsLoggedIn() {
      this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector));
    
      this.store.pipe(select(isLoggedInSelector)).subscribe(isLoggedIn => {
          if (isLoggedIn === null) {
              return; 
          }
        
          if (!isLoggedIn) {
              this.router.navigate(['/login']);
          } else{
            this.store.pipe(select(hasRoleSelector)).subscribe(role => {
              if (!Array.isArray(role)) {
                  if (role !== "ROLE_TEACHER") {
                      this.router.navigate(['']);
                  } else {
                      // Действия при совпадении
                  }
              } else if (!role.includes("ROLE_TEACHER")) {
                  this.router.navigate(['']);
              }
          });
          }
      });
    }

    
    
}