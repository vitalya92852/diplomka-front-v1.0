import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { logOutAction } from "../../auth/store/actions/logOut.action";
import { Router } from "@angular/router";
import { CurrentUserInterface } from "../../auth/shared/types/currentUser.interface";
import { Observable, of, switchMap } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import { StudentRequestInterface } from "../../teacher/types/studentRequest.interface";
import { StudentResumeService } from "../service/studentResume.service";
import { StudentInterface } from "../types/student.interface";
import { hasRoleSelector, isLoggedInSelector } from "../../auth/store/auth.selector";
import { ResumeRequestInterface } from "../types/resumeRequest.interface";


@Component({
    selector: 'platanus-create-resume',
    templateUrl: './studentResume.component.html',
    styleUrls: ['./studentResume.component.css'],
    standalone:true,
    imports:[
      CommonModule,
      ReactiveFormsModule,
      FormsModule
    ],
    
  })
  export class CreateResumeComponent implements OnInit {
    isLoggedIn$:Observable<boolean>;
    user$: Observable<CurrentUserInterface>
    student$:Observable<StudentInterface>

    // Форма отправки резюме
    form: FormGroup
    selectedProfession:string
    selectedStudy:string

    // Загрузка готового резюме
    selectedFile: File;
    fileNotUploded:boolean = false;
    showSuccesNotification:boolean = false
    showBadNotification: boolean = false;
    isButtonDisabled:boolean = false
    showNoFileUploadedMessage:boolean = false;

    constructor(private store:Store,private router:Router,private authService:AuthService,private studentResumeService:StudentResumeService,private fb: FormBuilder){}

    getCurrentUser(){
      this.user$ = this.authService.getCurrentUser()
    }

    ngOnInit() {
        this.getCurrentUser()
        this.getStudent()
        this.initializeIsLoggedIn()
        this.initializeForm()
    }

    logOutFun():void{
      this.store.dispatch(logOutAction())
      this.router.navigate(['/login']);
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
                  if (role !== "ROLE_USER") {
                      this.router.navigate(['']);
                  } else {
                      // Действия при совпадении
                  }
              } else if (!role.includes("ROLE_USER")) {
                  this.router.navigate(['']);
              }
          });
          }
      });
    }
    
    toggleCollapsed(): void {
      const body = document.querySelector(".body");
      const scroll = document.querySelector(".scroll")
      scroll.classList.add('scroll-margin')
      body.classList.toggle('collapsed');
    }

    getStudent(): Observable<StudentInterface> {
      this.student$ = this.authService.getCurrentUser().pipe(
        switchMap((user: CurrentUserInterface) => {
          const userId = user.id;
          return this.studentResumeService.getStudent(userId);
        })
      );
      return this.student$; 
    }
    

    onPositionChange(value:Event): void {
      const target = event.target as HTMLSelectElement;
      this.selectedProfession = target.value
      this.form.patchValue({
        position: target.value
      });
    }

    onStudyChange(value:Event): void {
      const target = event.target as HTMLSelectElement;
      this.selectedProfession = target.value
      this.form.patchValue({
        specialization: target.value
      });
    }

    initializeForm(): void {
      // Инициализация формы без данных студента
      this.form = this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        surname: ['', Validators.required],
        contactInfo: ['', Validators.required],
        address: ['', Validators.required],
        education: ['', Validators.required],
        specialization: ['', Validators.required],
        yearsOfEducation: ['', Validators.required],
        nameOfOrganization: ['', Validators.required],
        position: ['', Validators.required],
        deadLine: ['', Validators.required],
        achievement: ['', Validators.required],
        skills: ['', Validators.required],
        additionallyInfo: ['', Validators.required],
        otherInfo: ['', Validators.required]
      });
    
      this.getStudent().subscribe((student: StudentInterface) => {
        this.form.patchValue({
          name: student.name,
          lastname: student.lastname,
          surname: student.surname

        });
      });
    }
    

    createResume(){
      const request: ResumeRequestInterface = {
        resume: this.form.value
      }

      
      console.log(request)


      this.form.reset()
    }

    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    }

    uploadFile(){
      this.authService.getCurrentUser().subscribe((user:CurrentUserInterface)=>{
        const userId = user.id
        if(this.selectedFile!=undefined){
          this.studentResumeService.uploadFile(this.selectedFile,userId)
          this.isButtonDisabled = true
          this.showSuccesNotification = true
          setTimeout(() => {
            this.isButtonDisabled = false
            this.showSuccesNotification = false
          }, 6000);
        } else{
          this.fileNotUploded = true
          this.isButtonDisabled = true
          this.showBadNotification = true
          setTimeout(() => {
            this.fileNotUploded = false
            this.isButtonDisabled = false
            this.showBadNotification = false
          }, 6000);
        }
        
      })
    }













    @ViewChild('dropzoneBox') dropzoneBox: ElementRef<HTMLElement> | undefined;
    @ViewChild('uploadFileInput') uploadFileInput: ElementRef<HTMLInputElement> | undefined;
    @ViewChild('dropZoneElement') dropZoneElement: ElementRef<HTMLElement> | undefined;

    
    
    ngAfterViewInit() {
      if (this.uploadFileInput && this.dropZoneElement) {
        const inputElement = this.uploadFileInput.nativeElement;
        const dropZoneElement = this.dropZoneElement.nativeElement;
    
        inputElement.addEventListener("change", (e) => {
          if (inputElement.files && inputElement.files.length) {
            this.updateDropzoneFileList(dropZoneElement, inputElement.files[0]);
          }
        });
    
        dropZoneElement.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropZoneElement.classList.add("dropzone--over");
        });
    
        ["dragleave", "dragend"].forEach((type) => {
          dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("dropzone--over");
          });
        });
    
        dropZoneElement.addEventListener("drop", (e) => {
          e.preventDefault();
    
          if (e.dataTransfer.files && e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            this.updateDropzoneFileList(dropZoneElement, e.dataTransfer.files[0]);
          }
    
          dropZoneElement.classList.remove("dropzone--over");
        });
      }
    }
    
    updateDropzoneFileList(dropzoneElement: HTMLElement, file: File) {
      let dropzoneFileMessage = dropzoneElement.querySelector(".message");
    
      if (dropzoneFileMessage) {
        dropzoneFileMessage.innerHTML = `
          ${file.name}, ${file.size} байт(ов)
        `;
      }
    }
  
    
    
    onReset() {
      if (this.dropZoneElement) {
        let dropzoneFileMessage = this.dropZoneElement.nativeElement.querySelector(".message");
        if (dropzoneFileMessage) {
          dropzoneFileMessage.innerHTML = `Файл не выбран`;
        }
      }
      this.selectedFile = null; 
    }
    
    onDragOver(event: DragEvent) {
      event.preventDefault();
    }
    
    onDragLeave(event: DragEvent) {
      event.preventDefault();
    }
    
    onDrop(event: DragEvent) {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        this.selectedFile = event.dataTransfer.files[0];
      }
    }
    
  }