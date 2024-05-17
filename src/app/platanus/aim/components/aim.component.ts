import { CommonModule } from "@angular/common";
import { AfterViewChecked, AfterViewInit, Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { logOutAction } from "../../auth/store/actions/logOut.action";
import { Router } from "@angular/router";
import { Observable, map, of, take } from "rxjs";
import { CurrentUserInterface } from "../../auth/shared/types/currentUser.interface";
import { AuthService } from "../../auth/services/auth.service";
import { AimListInterface } from "../types/aimList.interface";
import { AimService } from "../service/aim.service";
import { AimTableInterface } from "../types/aimTable.interface";
import { hasRoleSelector, isLoggedInSelector } from "../../auth/store/auth.selector";
import { AimEditInterface } from "../types/aimEdit.interface";




@Component({
    selector: 'platanus-login',
    templateUrl: './aim.component.html',
    styleUrls: ['./aim.component.css'],
    standalone:true,
    imports:[
      CommonModule,
      ReactiveFormsModule,
      FormsModule
      
    ],
    
    
  })

  export class AimComponent implements OnInit{

    user$: Observable<CurrentUserInterface>
    aimList:AimListInterface

    isLoggedIn$:Observable<boolean>

    countCompletedNumber:number = 0
    countPendingNumber:number = 0
    countFailedNumber:number = 0

    aimTableData$: Observable<AimTableInterface>;

    showModalConfirm: boolean = false;
    aimName:string

    modalChange = false;
    recordForEdit: any = ''

    aimInfo:string


    constructor(private store:Store,private router:Router,private authService:AuthService,private aimService:AimService) { 
      this.aimTableData$ = of({ aims: [] });
    }

    getCurrentUser(){
      this.user$ = this.authService.getCurrentUser()
    }




   
    itemsOnPage = 5;
    start = 1;
  
    numberOfPages: number;
  
    mappedRecords$: Observable<any[]>;
  
    linkList: { pageNumber: number, isActive: boolean }[] = [];
  
    
  
    ngOnInit(): void {
        this.getCurrentUser()
        this.getAimList()
        this.getTableData()
        this.getStatus()
        this.initializeIsLoggedIn()
    }

    

   
  
    setActive(link: { pageNumber: number, isActive: boolean }): void {
        this.start = link.pageNumber;
        this.updatePagination();
        this.generateMappedRecords();
    }

 

    
    toggleCollapsed(): void {
      const body = document.querySelector(".body");
      const scroll = document.querySelector(".scroll")
      scroll.classList.add('scroll-margin')
      body.classList.toggle('collapsed');
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


    logOutFun():void{
      this.store.dispatch(logOutAction())
      this.router.navigate(['/login']);
    }

    getAimList(): Observable<AimListInterface> {
      return new Observable<AimListInterface>((observer) => {
        this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
          const userId = user.id;
          this.aimService.getAimList(userId).subscribe((data: AimListInterface) => {
            observer.next(data);
            observer.complete();
          }, (error) => {
            observer.error(error);
          });
        });
      });
    }

    getStatus(){
      this.getAimList().subscribe(
        (aimListData: AimListInterface) => {
          this.aimList = aimListData
          let countCom = 0;
          let countFail = 0;
          let countPen = 0;
          for (const key in aimListData) {
            if (this.aimList.hasOwnProperty(key)) {

              if (this.aimList[key].status === 'Одобрено') {
                countCom++;
              } 
              if (this.aimList[key].status === 'В ожидании') {
                countPen++;
              } 
              if (this.aimList[key].status === 'Отклонено') {
                countFail++;
                
              } 
            }
          }
          this.countCompletedNumber = countCom;
          this.countFailedNumber = countFail;
          this.countPendingNumber = countPen;
        },
        (error) => {
          console.error('An error occurred:', error);
        }
      );
    }

    getTableData() {
      this.getAimList().subscribe(
        (aimListData: AimListInterface) => {
          this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
            const aimsToAdd = []; // Создаем массив для хранения новых целей
            
            for (const key in aimListData) {
              if (aimListData.hasOwnProperty(key)) {
                const newAim = {
                  src: "/assets/images/profile.png",
                  name: user.name,
                  aimId: aimListData[key].aimId,
                  objectName: key,
                  category: 'Цель',
                  status: `${aimListData[key].status}`,
                  description: `${aimListData[key].description}`
                };
                if (`${aimListData[key].status}` === 'none') {
                  continue;
                }
                aimsToAdd.push(newAim); 
              }
            }
            this.aimTableData$.subscribe(data => {
              data.aims.push(...aimsToAdd);
              this.generateMappedRecords();
              this.updatePagination();
            });
          });
        },
        (error) => {
          console.error('An error occurred:', error);
        }
      );
    }
    getTableData2() {
      this.getAimList().subscribe(
        (aimListData: AimListInterface) => {
          this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
            const aimsToAdd = []; // Создаем массив для хранения новых целей
            for (const key in aimListData) {
              if (aimListData.hasOwnProperty(key)) {
                const newAim = {
                  src: "/assets/images/profile.png",
                  name: user.name,
                  objectName: key,
                  category: 'Цель',
                  status: `${aimListData[key].status}`,
                  description: `${aimListData[key].description}`

                };
                if (`${aimListData[key].status}` === 'none') {
                  continue;
                }
                aimsToAdd.push(newAim); 
              }
            }
            
            this.aimTableData$.subscribe(data => {
              data.aims.push(...aimsToAdd);
              this.generateMappedRecords();
              this.updatePagination();
            });
          });
        },
        (error) => {
          console.error('An error occurred:', error);
        }
      );
    }

    updateData(){
      this.getTableData2()
      this.start = 1
      const startIndex = (this.start - 1) * this.itemsOnPage;
        const endIndex = startIndex + this.itemsOnPage;
        this.mappedRecords$ = this.aimTableData$.pipe(
          map(data => {
            return data.aims.slice(startIndex, endIndex);

          })
        );
    }
    



     generateMappedRecords(): void {
        const startIndex = (this.start - 1) * this.itemsOnPage;
        const endIndex = startIndex + this.itemsOnPage;
        this.mappedRecords$ = this.aimTableData$.pipe(
          map(data => {
            console.log(data)
            return data.aims.slice(startIndex, endIndex);

          })
        );
      }



    updatePagination(): void {
            this.aimTableData$.subscribe(data => {
              this.numberOfPages = Math.ceil(data.aims.length / this.itemsOnPage);
            });
            this.linkList = [];
            for (let i = 0; i < this.numberOfPages; i++) {
                const pageNumber = i + 1;
                this.linkList.push({
                    pageNumber: pageNumber,
                    isActive: pageNumber === this.start
                });
            }
    }

    confirm() {

      this.showModalConfirm = false; 

      this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
        const userId = user.id;
        this.aimService.chooseAim(userId,this.aimName).subscribe(() => {
          this.getStatus()
          this.getAimList().subscribe(
            (aimListData: AimListInterface) => {
              this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
                const aimsToAdd = []; // Создаем массив для хранения новых целей
                for (const key in aimListData) {
                  if (aimListData.hasOwnProperty(key)) {
                    const newAim = {
                      src: "/assets/images/profile.png",
                      name: user.name,
                      objectName: key,
                      category: 'Цель',
                      status: `${aimListData[key].status}`
                    };
                    if (`${aimListData[key].status}` === 'none') {
                      continue;
                    }
                    aimsToAdd.push(newAim); 
                  }
                }
                
                this.aimTableData$.subscribe(data => {
                  data.aims = []
                  data.aims.push(...aimsToAdd);
                  this.generateMappedRecords();
                  this.updatePagination();
                });
              });
            },
            (error) => {
              console.error('An error occurred:', error);
            }
          );
        });
      });
    }

    closeModal() {
        this.showModalConfirm = false;
    }



    chooseAim(aimName: string) {
      this.aimName = aimName; 
      this.showModalConfirm = true;
      console.log(this.showModalConfirm)
  }

    
  progressPercentage: number = 90; // Пример процентного значения

  generateProgressBar(percent: number): string {
    return `
      <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">${percent}%</div>
      </div>
    `;
  }

    modalChangeToggle(record:any){
      this.recordForEdit = record;
      this.modalChange = true
    }

    close(){
      this.modalChange = false
    }

    cancel() {
      this.modalChange = false


    }
    save(aimName:string,description:string,aimId:number) {
     
   
      
      this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
        const userId = user.id;
        const aimEdit:AimEditInterface = {
          aimId: aimId,
          aimName:aimName,
          aimDescription:description,
          userId:userId
        }
        console.log(aimEdit)
        this.aimService.editAim(userId,aimEdit).subscribe(data=>{

        })
      });
      this.modalChange = false
    }



  
    

    
  }
