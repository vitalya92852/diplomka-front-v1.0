import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Semester } from "../types/semester.interface";
import { SubjectAndAvgGradeInterface } from "../types/subjectAndAvgGrade.interface";

@Injectable({
    providedIn:'root'
})
export class GoalService{

    constructor(private http: HttpClient){}

    getAcademDataGrade(userId:number):Observable<Semester>{
        const url = `http://localhost:8080/goal/goalAcademData?userId=${userId}`
        return this.http.get<Semester>(url)

    }

    getPractiseDataGrade(userId:number):Observable<Semester>{
        const url = `http://localhost:8080/goal/goalPractiseData?userId=${userId}`
        return this.http.get<Semester>(url)

    }

    getUserSubjects(userId:number):Observable<string[]>{
        const url = `http://localhost:8080/goal/getSubjects?userId=${userId}`
        return this.http.get<string[]>(url)

    }

    changeAcademSubject(academSubjectName:string,userId:number):Observable<Semester>{
        const url = `http://localhost:8080/goal/changeAcademSubject?academSubjectName=${academSubjectName}&userId=${userId}`
        return this.http.get<Semester>(url)

    }

    changePractiseSubject(practiseSubjectName:string,userId:number):Observable<Semester>{
        const url = `http://localhost:8080/goal/changePractiseSubject?practiseSubjectName=${practiseSubjectName}&userId=${userId}`
        return this.http.get<Semester>(url)

    }

    getSubjectAndAvgGrade(userId:number){
        const url = `http://localhost:8080/goal/getSubjectAndAvgGrade?userId=${userId}`
        return this.http.get<SubjectAndAvgGradeInterface>(url)
    }

    getCombinedAvgGradeFirstPage(userId:number){
        const url = `http://localhost:8080/goal/getCombinedAvgGradeFirstPage?userId=${userId}`
        return this.http.get<number>(url)
    }

    getCombinedAvgGrade(subjectName:string,userId:number){
        const url = `http://localhost:8080/goal/getCombinedAvgGrade?subjectName=${subjectName}&userId=${userId}`
        return this.http.get<number>(url)
    }

    getRequestGrade(userId:number,requestGrade:number,currentSubject:string){
        const url = `http://localhost:8080/goal/getRequestGrade?requestGrade=${requestGrade}&userId=${userId}&currentSubject=${currentSubject}`
        return this.http.get<number>(url)
    }

    postRequestGrade(grade:number,currentSubject:string,userId:number){
        const url = `http://localhost:8080/goal/postRequestGrade`
        const data = {
            grade: grade,
            subjectName: currentSubject,
            userId: userId
          };
          console.log(data.grade)
        return this.http.post(url, data);
    }


}