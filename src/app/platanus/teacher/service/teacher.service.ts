import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StudentInterface} from "../types/student.interface";

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

    getStudentsRequest(userId:number,subject:string){

    }



}