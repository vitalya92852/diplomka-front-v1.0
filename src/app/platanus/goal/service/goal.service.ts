import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Semester } from "../types/semester.interface";

@Injectable({
    providedIn:'root'
})
export class GoalService{

    constructor(private http: HttpClient){}

    getAcademDataGrade(userId:number):Observable<Semester>{
        const url = `http://localhost:8080/goal/goalAcademData?userId=${userId}`
        console.log(url)
        return this.http.get<Semester>(url)

    }

    getPractiseDataGrade(userId:number):Observable<Semester>{
        const url = `http://localhost:8080/goal/goalPractiseData?userId=${userId}`
        console.log(url)
        return this.http.get<Semester>(url)

    }

    getUserSubjects(userId:number):Observable<string[]>{
        const url = `http://localhost:8080/goal/getSubjects?userId=${userId}`
        console.log(url)
        return this.http.get<string[]>(url)

    }

    changeAcademSubject(academSubjectName:string,userId:number):Observable<Semester>{
        const url = `http://localhost:8080/goal/changeAcademSubject?academSubjectName=${academSubjectName}&userId=${userId}`
        console.log(url)
        return this.http.get<Semester>(url)

    }

    changePractiseSubject(practiseSubjectName:string,userId:number):Observable<Semester>{
        const url = `http://localhost:8080/goal/changePractiseSubject?practiseSubjectName=${practiseSubjectName}&userId=${userId}`
        console.log(url)
        return this.http.get<Semester>(url)

    }


}