

import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { logOutAction } from '../../auth/store/actions/logOut.action';
import { Store, select } from '@ngrx/store';
import { Observable,Subject,combineLatest,map,mergeMap,of, reduce, switchMap, tap} from 'rxjs';
import { hasRoleSelector, isLoggedInSelector,} from '../../auth/store/auth.selector';
import {Chart} from 'chart.js';
import {NgChartsModule } from 'ng2-charts';
import { CurrentUserInterface } from '../../auth/shared/types/currentUser.interface';
import { Semester } from '../types/semester.interface';
import { GoalService } from '../service/goal.service';
import { Week } from '../types/week.interface';
import { SubjectAndAvgGradeInterface } from '../types/subjectAndAvgGrade.interface';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';




@Component({
    selector: 'app-first-page',
    standalone: true,
    imports: [
      CommonModule,
      NgChartsModule,
      RouterModule,
      FormsModule
    
    ],
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.css']
  })

export class GoalComponent implements OnInit{
  constructor(private store:Store,private router:Router,private authService:AuthService,private goalService:GoalService){}

  isLoggedIn$:Observable<boolean>;
  user$: Observable<CurrentUserInterface>
  userId:number
  userGoalData:Observable<Semester>
  weeksAndGrade:Week[]

  /* Изменение цвета фона выборанного предмета */
  selectedSubject: number = 0;

  /* Оповещении если пользователь уже запросил оценку */
  showSuccesNotification:boolean = false

  /* Пользователь  запросил оценку */
  showBadNotification:boolean = false

  profileUserName$:Observable<string>

  maxAcademGrade$:Observable<number>
  avgAcademGrade$:Observable<number>
  lowAcademGrade$:Observable<number>

  maxPractiseGrade$:Observable<number>
  avgPractiseGrade$:Observable<number>
  lowPractiseGrade$:Observable<number>

  selectedRequestGrade:number = 101
  isButtonRequestGradeDisabled:boolean = true
  isNeedOneGradeForRequest:boolean = false
  currentChooseSubject:string = null
  requestGrade$:Observable<any> = of('?')

  academChartDiagram:Chart
  pratctiseChartDiagram:Chart
  adviceChart:Chart
  academCombinedChart:Chart
  practiseCombinedChart:Chart
  academChartCircle: Chart<"pie", number[], string>;
  practiseChartCircle: Chart<"pie", number[], string>;
  subjectAndAvgGrade$:Observable<SubjectAndAvgGradeInterface>



  getCurrentUser(){
    this.user$ = this.authService.getCurrentUser()
    
  }

  

  ngOnInit(): void {
    this.initializeIsLoggedIn()
    this.getUserAcademData()
    this.getUserPractiseData()
    this.bellCurveChart()
    this.getCurrentUser()
    this.subjectGrade()
    this.academCircleChart()
    this.getCombinedAvgGrade()

    
  }

  // ---------------------------------CHARTS------------------------------- //


  // Академ график //
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
        datasets: [
          {
            label: 'Series A',
            data: data,
            backgroundColor: 'transparent',
            borderColor: '#7f7a7a',
            borderWidth: 2, // установка толщины линий
            pointBorderColor: 'darkgoldenrod',
            pointBackgroundColor: 'white', // установка цвета фона точек
            pointHoverBackgroundColor: 'white',
            pointHoverBorderColor: 'darkgoldenrod',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointStyle: 'circle'
          }
        ]
      },
      options: {
        scales: {
            x:{
                ticks:{
                    color:'#89879f',
                    font: {
                        size:16,
                        family: 'Rounded',
                    }
                },
                title:{
                  display:true,
                  text:'Недели',
                  color: '#89879f',
                  font: {
                    family: 'Rounded',
                    size: 16
                  }
                }
            },
            y:{
                ticks:{
                    color:'#89879f',
                    font: {
                        family: 'Rounded',
                        size:16
                    }
                },
                grid:{
                    color:'white',
                },
                title:{
                  display:true,
                  text:'Баллы',
                  color: '#89879f',
                  font: {
                    family: 'Rounded',
                    size: 16
                  }
                }
            }

        }
      }
    });
  }



  // Академ график справа //
  academCircleChart(){

  
    const data = {
      datasets: [{
          label: 'Dataset',
          data: [10,40], // Общая сумма данных должна быть равна 360
          backgroundColor: [
              'white',
              'rgb(255, 205, 86)',
          ],
          borderWidth: 1, // Толщина границы для каждого сегмента
          borderColor: '#89879f' // Цвет границы для каждого сегмента
      }]
    };

    const options = {
      plugins: {
          title: {
              display: true,
              fontSize: 1
          },
          centerText: {
              display: true,
              text: '90 д',
              color: 'black',
              fontStyle: 'bold',
          }
      },

      cutout: '80%',
      responsive: true,
    };

    this.academChartCircle = new Chart<"pie", number[], string>('academChartCircle', {
      type: 'pie',
      data: data,
      options: options
    });


    

    // Регистрация кастомного элемента для центрального текста
    Chart.register({
      id: 'centerText',
      beforeDraw: function(chart, args, options) {
        if (options['display']) {
            var width = chart.width,
                height = chart.height,
                ctx = chart.ctx;
    
            ctx.restore();
            var fontSize = options['fontSize'] || 50;
            ctx.font = fontSize + "px Rounded";
            ctx.fillStyle = options['color'] || 'black';
            ctx.textBaseline = 'middle';
    
            var text = options['text'],
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 1.75;
    
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    }
    
    });
  }




  // Практический график //
  
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

    Chart.defaults.plugins.legend.display = false;
 
    this.pratctiseChartDiagram = new Chart('practiseDiagram', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Практическая успеваемость',
          data: data,
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.canvas.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(54, 162, 235, 0.8)'); 
            gradient.addColorStop(1, 'rgba(54, 162, 235, 0.2)'); 
            return gradient;
          }
        }]
      },
      options: {
        scales: {
            x:{
                ticks:{
                    color:'#89879f',
                    font: {
                        size:16,
                        family: 'Rounded',
                    }
                },
                title:{
                  display:true,
                  text:'Недели',
                  color: '#89879f',
                  font: {
                    family: 'Rounded',
                    size: 16
                  }
                }
            },
            y:{
                ticks:{
                    color:'#89879f',
                    font: {
                        family: 'Rounded',
                        size:16
                    }
                },
                grid:{
                    color:'white',
                },
                title:{
                  display:true,
                  text:'Баллы',
                  color: '#89879f',
                  font: {
                    family: 'Rounded',
                    size: 16
                  }
                }
            }

        }
      }
    });
    
  }

  // Практический график справа //
  practiseCircleChart(combinedAvgGrade:number){
    if(this.practiseChartCircle)
    this.practiseChartCircle.destroy()
    
    const data = {
      datasets: [{
          label: 'Dataset',
          data: [100-combinedAvgGrade,combinedAvgGrade], // Общая сумма данных должна быть равна 360
          backgroundColor: [
              'white',
              'rgb(255, 205, 86)',
          ],
          borderWidth: 1, // Толщина границы для каждого сегмента
          borderColor: '#89879f'
      }]
    };

    

    const options = {
      plugins: {
          title: {
              display: true,
              fontSize: 20
          },
          centerText: {
              display: true,
              text: combinedAvgGrade,
              color: 'black',
              fontStyle: 'bold',
          }
      },

      cutout: '80%',
      responsive: true,
    };

    this.practiseChartCircle = new Chart<"pie", number[], string>('practiseChartCircle', {
      type: 'pie',
      data: data,
      options: options
    });

    // Регистрация кастомного элемента для центрального текста
    Chart.register({
      id: 'centerText',
      beforeDraw: function(chart, args, options) {
        if (options['display']) {
            var width = chart.width,
                height = chart.height,
                ctx = chart.ctx;
    
            ctx.restore();
            var fontSize = options['fontSize'] || 50;
            ctx.font = fontSize + "px Rounded";
            ctx.fillStyle = options['color'] || 'black';
            ctx.textBaseline = 'middle';
    
            var text = options['text'],
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 1.75;
    
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    }
    
    });
  }

  // Вывод практического графика справа+ высчитывание среднего значения академ+практик 

  getCombinedAvgGrade(){
    this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
      const userId = user.id;
      this.goalService.getCombinedAvgGradeFirstPage(userId).subscribe(combinedAvgGrade => {
        this.practiseCircleChart(combinedAvgGrade)
      });
    });
  }

  // Bell curve график //


  bellCurveChart() {

    if (this.adviceChart) {
      this.adviceChart.destroy();
    }

    Chart.defaults.plugins.legend.display = false;
    this.adviceChart = new Chart('advice-chart-interface', {
      type: 'line',
      data: {
        labels: ['90-100%', '70-89%', '60-69%', '50-59%', '0-49%'],
        datasets: [
          {
            label: '',
            data: [10,25,30,25,10],
            backgroundColor: 'transparent',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointStyle: 'circle'
          }
        ]
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: '#89879f',
              font: {
                size: 16,
                family: 'Rounded',
              }
            }
          },
          y: {
            ticks: {
              color: '#89879f',
              font: {
                family: 'Rounded',
                size: 16
              }
            },
            grid: {
              color: 'white', // Устанавливаем цвет линий сетки
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: false 
          }
        },
        elements: {
          line: {
            tension: 0 
          }
        },
        responsive: true,
        // maintainAspectRatio: false
      }
    });
  }

  // Совмещенный график bell curve и академ график //

  academCombinedChartFun(arr:number[]){

    const data = arr;

    this.academCombinedChart = new Chart('academ-combined-chart-interface', {
      type: 'line',
      data: {
        labels: ['90-100%', '70-89%', '60-69%', '50-59%', '0-49%'],
        datasets: [
          {
            label: '',
            data: [10,25,30,25,10],
            backgroundColor: 'transparent',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointStyle: 'circle'
          },
          {
            label: '',
            data,
            backgroundColor: 'transparent',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointStyle: 'circle'
          }
        ]
      },
      options: {
          scales: {
              x:{
                  ticks:{
                      color:'#89879f',
                      font: {
                          size:16,
                          family: 'Rounded',
                      }
                  }
              },
              y:{
                  ticks:{
                      color:'#89879f',
                      font: {
                          family: 'Rounded',
                          size:16
                      }
                  },
                  grid:{
                      color:'white',
                  } 
              }

          }
        }
    });
  }

  // Совмещенный график bell curve с практическим

  practiseCombinedChartFun(arr:number[]){

    const data = arr

    this.practiseCombinedChart = new Chart('practise-combined-chart-interface', {
      type: 'line',
      data: {
        labels: ['90-100%', '70-89%', '60-69%', '50-59%', '0-49%'],
        datasets: [
          {
            label: '',
            data: [10,25,30,25,10],
            backgroundColor: 'transparent',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointStyle: 'circle'
          },
          {
            label: '',
            data,
            backgroundColor: 'transparent',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointStyle: 'circle'
          }
        ]
      },
      options: {
          scales: {
              x:{
                  ticks:{
                      color:'#89879f',
                      font: {
                          size:16,
                          family: 'Rounded',
                      }
                  }
              },
              y:{
                  ticks:{
                      color:'#89879f',
                      font: {
                          family: 'Rounded',
                          size:16
                      }
                  },
                  grid:{
                      color:'white',
                  } 
              }

          }
        }
    });
  }

  //------------------------------------------------------------ //
  
  // ------------------Выход из системы------------------------- //


  logOutFun():void{
    this.store.dispatch(logOutAction())
    this.router.navigate(['/login']);
  }

  // ----------------------------------------------------------- //

  // ------------------Проверка авторизации -------------------- //

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

//-------------------------------------------------------------- //

//-------------Получения данных для академ графика-------------- //

  getUserAcademData(): void {
      this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
          const userId = user.id;
          
          this.goalService.getAcademDataGrade(userId).subscribe(userData => {
              const weeksAndGrade = this.processData(userData.week);
              this.updateAcademChart(weeksAndGrade);
              this.updateAcademCombinedBellCurveChart(userData.week)
          });
      });
  }

//-------------------------------------------------------------- //

//----------Получения данных для практического графика---------- //

  getUserPractiseData(): void {
    this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
        const userId = user.id;
        this.goalService.getPractiseDataGrade(userId).subscribe(userData => {
            const weeksAndGrade = this.processData(userData.week);
            this.updatePractiseChart(weeksAndGrade);
            this.updatePractiseCombinedBellCurveChart(userData.week)
        });
    });
  }

//-------------------------------------------------------------- //

//---------Изменение графика взависимости от предмета----------- //



  chooseSubjectButton(subject: string) {
      this.currentChooseSubject = subject
      this.selectedRequestGrade = 101;
      this.updateButtonAvailability()
      this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
          const userId = user.id;
          this.goalService.changeAcademSubject(subject, userId).subscribe(
              (userData) => {
                  const weeksAndGrade = this.processData(userData.week);
                  this.updateAcademChart(weeksAndGrade);
                  this.updateAcademCombinedBellCurveChart(userData.week)
              },
              (error) => {
                  console.error(error);
              }
          );

          this.goalService.changePractiseSubject(subject, userId).subscribe(
            (userData) => {
                const weeksAndGrade = this.processData(userData.week);
                this.updatePractiseChart(weeksAndGrade);
                this.updatePractiseCombinedBellCurveChart(userData.week)
            },
            (error) => {
                console.error(error);
            }
          );

          this.goalService.getCombinedAvgGrade(subject,userId).subscribe(data=>{
            this.practiseCircleChart(data)
          })
    });
  }

  private updateAcademCombinedBellCurveChart(arr:Week[]):void{
    if(this.academCombinedChart)
      this.academCombinedChart.destroy()
    let bellCurveArrayNum:number[];
    bellCurveArrayNum = [];
    arr.forEach((week)=>{
      week.grade.forEach((gradeArr)=>{
        bellCurveArrayNum.push(gradeArr)
      })
    })

    const percentages = this.countBellCurveCombinedArray(bellCurveArrayNum)

      this.academCombinedChartFun(percentages.reverse())
  
  }


  private updatePractiseCombinedBellCurveChart(arr:Week[]):void{
    if(this.practiseCombinedChart)
    this.practiseCombinedChart.destroy()
    let bellCurveArrayNum:number[];
    bellCurveArrayNum = [];
    arr.forEach((week)=>{
      week.grade.forEach((gradeArr)=>{
        bellCurveArrayNum.push(gradeArr)
      })
    })

    let percentages = this.countBellCurveCombinedArray(bellCurveArrayNum)

      this.practiseCombinedChartFun(percentages.reverse())
  
  }


  private countBellCurveCombinedArray(arr:number[]):number[]{
    let count0_49 = 0;
    let count50_59 = 0;
    let count60_69 = 0;
    let count70_89 = 0;
    let count90_100 = 0;
    const totalNumbers = arr.length;

    arr.forEach(number => {
        if (number >= 0 && number <= 49) {
            count0_49++;
        } else if (number >= 50 && number <= 59) {
            count50_59++;
        } else if (number >= 60 && number <= 69) {
            count60_69++;
        } else if (number >= 70 && number <= 89) {
            count70_89++;
        } else if (number >= 90 && number <= 100) {
            count90_100++;
        }
    });

    const percentages = [];
    if (count0_49 > 0) percentages.push((count0_49 / totalNumbers) * 100);
    else percentages.push(0);
    if (count50_59 > 0) percentages.push((count50_59 / totalNumbers) * 100);
    else percentages.push(0);
    if (count60_69 > 0) percentages.push((count60_69 / totalNumbers) * 100);
    else percentages.push(0);
    if (count70_89 > 0) percentages.push((count70_89 / totalNumbers) * 100);
    else percentages.push(0);
    if (count90_100 > 0) percentages.push((count90_100 / totalNumbers) * 100);
    else percentages.push(0);

    return percentages
  }



  private updateAcademChart(weeksAndGrade: any[]): void {
      if (this.academChartDiagram) {
          this.academChartDiagram.destroy(); 
      }

      this.maxAcademGrade$ = of(weeksAndGrade.map(week => Math.max(...week.grade))).pipe(
          mergeMap(maxValues => maxValues),
          reduce((acc, curr) => Math.max(acc, curr))
      );
      this.lowAcademGrade$ = of(weeksAndGrade.map(week => Math.min(...week.grade))).pipe(
        mergeMap(minValues => minValues),
        reduce((acc, curr) => Math.min(acc, curr))
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
        this.pratctiseChartDiagram.destroy(); 
    }

    this.maxPractiseGrade$ = of(weeksAndGrade.map(week => Math.max(...week.grade))).pipe(
        mergeMap(maxValues => maxValues),
        reduce((acc, curr) => Math.max(acc, curr))
    );
    this.lowPractiseGrade$ = of(weeksAndGrade.map(week => Math.min(...week.grade))).pipe(
      mergeMap(minValues => minValues),
      reduce((acc, curr) => Math.min(acc, curr))
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

  //-------------------------------------------------------------- //

  //----------------------Изменить страницу----------------------- //

  showPage(pageId,diagramButton) {
    const pages = document.querySelectorAll('.content__container');
    pages.forEach(page => page.classList.remove('active'));
    const chooseButton = document.querySelectorAll('.link-border');
    chooseButton.forEach(button=>button.classList.remove('choose'))
    chooseButton.forEach(button=>button.classList.remove('fill-svg'))
    
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.classList.add('active');
        document.documentElement.scrollTop = 0;
    }

    const buttonToShow = document.getElementById(diagramButton)

    if (buttonToShow) {
        buttonToShow.classList.add('choose');
        buttonToShow.classList.add('fill-svg')
        document.documentElement.scrollTop = 0;
    }
  };

  //-------------------------------------------------------------- //

  //--------------Изменить комбинированный график----------------- //

  combinedChartFn(chartId,button){

      const chart = document.querySelectorAll('.advice-chart');
      const colorButton = document.querySelectorAll('.advice-chart-action-link')
      chart.forEach(chart => chart.classList.remove('show'));
      colorButton.forEach(button=> button.classList.remove('choose-chart'))
      
      const chartToShow = document.getElementById(chartId);
      if (chartToShow) {
          chartToShow.classList.add('show');
          document.documentElement.scrollTop = 0;
      }

      const colorButtonShow = document.getElementById(button)
      if(button){
        colorButtonShow.classList.add('choose-chart')
      }
  }

  //-------------------------------------------------------------- //


  
  //------------------------Вывод эмоджи и предметов-------------- //

  subjectGrade(){
    this.authService.getCurrentUser().subscribe((user: CurrentUserInterface) => {
      const userId = user.id;
      this.subjectAndAvgGrade$ = this.goalService.getSubjectAndAvgGrade(userId)
    });
  }

  //-------------------------------------------------------------- //

  //------------------Запрос оценки от студента------------------- //
  requestGrade() {
    
    this.authService.getCurrentUser().pipe(
      switchMap((user: CurrentUserInterface) => {
        const userId = user.id;
        let requestGrade
        this.requestGrade$.subscribe(data=>{
          requestGrade = data
        })
        return this.goalService.postRequestGrade(requestGrade, this.currentChooseSubject, userId);
      }),
    ).subscribe(
      () => {
        this.showSuccesNotification = true;
        this.isButtonRequestGradeDisabled = true;
        setTimeout(() => {
          this.showSuccesNotification = false
          this.isButtonRequestGradeDisabled = false;
        }, 6000);
        console.log(this.showSuccesNotification)
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.showBadNotification = true;
          this.isButtonRequestGradeDisabled = true;
          setTimeout(() => {
            this.showBadNotification = false
            this.isButtonRequestGradeDisabled = false
          }, 6000);
          console.log(this.showBadNotification)
        } else {

          console.error('Произошла ошибка:', error);
        }
      }
    );
  }

    updateButtonAvailability(): void {
      this.authService.getCurrentUser().subscribe((user:CurrentUserInterface)=>{
        this.userId = user.id
        this.avgAcademGrade$.subscribe(data=>{
          if(data<this.selectedRequestGrade){
            this.goalService.getRequestGrade(this.userId,this.selectedRequestGrade,this.currentChooseSubject).subscribe((grade:number)=>{
              if(grade!==0){
                this.isButtonRequestGradeDisabled = false
                this.isNeedOneGradeForRequest = true
                this.requestGrade$ = of(grade);
              }else{
                this.isButtonRequestGradeDisabled = true
                this.isNeedOneGradeForRequest = false
                this.requestGrade$ = of('?');
              }
            })
          }
        
      })
      })


    }

    

    toggleCollapsed(): void {
      const body = document.querySelector(".body");
      const scroll = document.querySelector(".scroll")
      scroll.classList.add('scroll-margin')
      body.classList.toggle('collapsed');
      
    }
    

  //-------------------------------------------------------------- //
  
 




  


  




}
