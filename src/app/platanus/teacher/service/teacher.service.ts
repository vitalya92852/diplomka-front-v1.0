import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StudentInterface} from "../types/student.interface";
import { StudentRequestInterface } from "../types/studentRequest.interface";

@Injectable({
    providedIn:'root'
})

export class TeacherService{

    constructor(private http: HttpClient){}

    getStudents(userId:number,subject:string):Observable<StudentInterface[]>{
        const url = `http://localhost:8080/api/teacher/getStudents?userId=${userId}&subject=${subject}`

        return this.http.get<StudentInterface[]>(url)
    }

    getSubjects(userId:number):Observable<string[]>{
        const url = `http://localhost:8080/api/teacher/getSubjects?userId=${userId}`
        
        return this.http.get<string[]>(url)
    }

    getRequestGradeSubjects(userId:number):Observable<string[]>{
        const url = `http://localhost:8080/api/teacher/getRequestGradeSubjects?userId=${userId}`
            
        return this.http.get<string[]>(url)
    }

    getStudentsRequest(userId:number,subject:string){
        const url = `http://localhost:8080/api/teacher/getStudentsRequest?userId=${userId}&subject=${subject}`
        
        return this.http.get<StudentRequestInterface[]>(url)
    }

    rejectRequest(userId:number,requestGrade:number,studentId:number,subjectName:string){
        const data = {
            userId:userId,
            requestGrade:requestGrade,
            studentId:studentId,
            subjectName:subjectName

        }
        const url = 'http://localhost:8080/api/teacher/rejectRequest'
        return this.http.put<string>(url,data)
    }

    acceptRequest(userId:number,requestGrade:number,studentId:number,subjectName:string){
        const data = {
            userId:userId,
            requestGrade:requestGrade,
            studentId:studentId,
            subjectName:subjectName

        }
        const url = 'http://localhost:8080/api/teacher/acceptRequest'
        return this.http.put<string>(url,data)
    }





}