

import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { logOutAction } from '../../auth/store/actions/logOut.action';
import { Store, select } from '@ngrx/store';
import { Observable,mergeMap,of, reduce} from 'rxjs';
import { isLoggedInSelector,} from '../../auth/store/auth.selector';
import {Chart} from 'chart.js';
import {NgChartsModule } from 'ng2-charts';
import { CurrentUserInterface } from '../../auth/shared/types/currentUser.interface';
import { Semester } from '../types/semester.interface';
import { GoalService } from '../service/goal.service';
import { Week } from '../types/week.interface';




@Component({
    selector: 'app-first-page',
    standalone: true,
    imports: [
      CommonModule,
      NgChartsModule,
      RouterModule
    
    ],
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.css']
  })

export class GoalComponent implements OnInit{
  constructor(private store:Store,private router:Router,private authService:AuthService,private goalService:GoalService){}

  isLoggedIn$:Observable<boolean>;
  user: Observable<CurrentUserInterface>
  userId:number
  userGoalData:Observable<Semester>
  weeksAndGrade:Week[]
  maxAcademGrade$:Observable<number>
  avgAcademGrade$:Observable<number>
  maxPractiseGrade$:Observable<number>
  avgPractiseGrade$:Observable<number>
  subjectList$:Observable<string[]>
  academChartDiagram:Chart
  pratctiseChartDiagram:Chart


  ngOnInit(): void {
    this.initializeIsLoggedIn()
    this.getUserAcademData()
    this.getUserPractiseData()
    this.getUserSubjectsList()

  }

  academChart(weeksAndGrade:Week[]){

    function sortByWeeks(weeksAndGrade) {
      return weeksAndGrade.sort((a, b) => {
          return a.weekCount - b.weekCount;
      });
    }
  

  
  const sortedWeeksAndGrade = sortByWeeks(weeksAndGrade);
  
  const labels = [];
  const data = [];
  
  sortedWeeksAndGrade.forEach(week => {
      labels.push(week.weekCount);
      data.push(week.avgGrade);
  });
    
    
  this.academChartDiagram= new Chart('academDiagram', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Академическая успеваемость',
          data: data,
          borderWidth: 1,
          
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  practiseChart(weeksAndGrade:Week[]){

    function sortByWeeks(weeksAndGrade) {
      return weeksAndGrade.sort((a, b) => {
          return a.weekCount - b.weekCount;
      });
    }
  
    const sortedWeeksAndGrade = sortByWeeks(weeksAndGrade);
    
    const labels = [];
    const data = [];
  
    sortedWeeksAndGrade.forEach(week => {
        labels.push(week.weekCount);
        data.push(week.avgGrade);
    });
    
    
    this.pratctiseChartDiagram = new Chart('practiseDiagram', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Практическая успеваемость',
          data: data,
          borderWidth: 1,
          
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
 


  logOutFun():void{
    this.store.dispatch(logOutAction())
    this.router.navigate(['/login']);
  }

  initializeIsLoggedIn() {
    this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector));
  
    this.store.pipe(select(isLoggedInSelector)).subscribe(isLoggedIn => {
        if (isLoggedIn === null) {
            return; // Первый вызов, пока значение не установлено
        }
      
        if (!isLoggedIn) {
            this.router.navigate(['/login']);
        }
    });
  }

  getUserSubjectsList(): void {
    this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
      const userId = user.id;
          this.goalService.getUserSubjects(userId).subscribe(data => {
            this.subjectList$ = of(data); 
          });
      });
  }



  getUserAcademData(): void {
      this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
          const userId = user.id;
          this.goalService.getAcademDataGrade(userId).subscribe(userData => {
              const weeksAndGrade = this.processData(userData.week);
              this.updateAcademChart(weeksAndGrade);
          });
      });
  }

  getUserPractiseData(): void {
    this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
        const userId = user.id;
        this.goalService.getPractiseDataGrade(userId).subscribe(userData => {
            const weeksAndGrade = this.processData(userData.week);
            this.updatePractiseChart(weeksAndGrade);
        });
    });
  }

  chooseSubjectButton(subject: string) {
      this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
          const userId = user.id;
          this.goalService.changeAcademSubject(subject, userId).subscribe(
              (userData) => {
                  const weeksAndGrade = this.processData(userData.week);
                  this.updateAcademChart(weeksAndGrade);
              },
              (error) => {
                  console.error(error);
              }
          );

          this.goalService.changePractiseSubject(subject, userId).subscribe(
            (userData) => {
                const weeksAndGrade = this.processData(userData.week);
                this.updatePractiseChart(weeksAndGrade);
            },
            (error) => {
                console.error(error);
            }
          );
    });
  }

// Общая функция для обновления графика с новыми данными
  private updateAcademChart(weeksAndGrade: any[]): void {
      if (this.academChartDiagram) {
          this.academChartDiagram.destroy(); // Уничтожаем предыдущий график, если он существует
      }

      this.maxAcademGrade$ = of(weeksAndGrade.map(week => Math.max(...week.grade))).pipe(
          mergeMap(maxValues => maxValues),
          reduce((acc, curr) => Math.max(acc, curr))
      );

      const sumOfGrades = weeksAndGrade.reduce((total, week) => total + week.avgGrade, 0);
      const totalNumberOfGrades = weeksAndGrade.length;
      const averageGrade = sumOfGrades / totalNumberOfGrades;
      const roundedAverageGrade = Math.round(averageGrade);
      this.avgAcademGrade$ = of(roundedAverageGrade);
      

      this.academChart(weeksAndGrade);
  }

  private updatePractiseChart(weeksAndGrade: any[]): void {

    if (this.pratctiseChartDiagram) {
        this.pratctiseChartDiagram.destroy(); // Уничтожаем предыдущий график, если он существует
    }

    this.maxPractiseGrade$ = of(weeksAndGrade.map(week => Math.max(...week.grade))).pipe(
        mergeMap(maxValues => maxValues),
        reduce((acc, curr) => Math.max(acc, curr))
    );

    const sumOfGrades = weeksAndGrade.reduce((total, week) => total + week.avgGrade, 0);
    const totalNumberOfGrades = weeksAndGrade.length;
    const averageGrade = sumOfGrades / totalNumberOfGrades;
    const roundedAverageGrade = Math.round(averageGrade);
    this.avgPractiseGrade$ = of(roundedAverageGrade);
    

    this.practiseChart(weeksAndGrade);
  }

  private processData(weeks: any[]): any[] {
      return weeks.map(week => ({
          grade: [],
          ...week,
          avgGrade: week.grade.reduce((total, grade) => total + grade, 0) / week.grade.length
      }));
  }




  




}
