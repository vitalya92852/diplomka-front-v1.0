import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StudentInterface } from "../types/student.interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class StudentResumeService{
    constructor(private http:HttpClient){}
    getStudent(userId: number): Observable<StudentInterface> {
        const url = `http://localhost:8080/api/createResume/getStudent?userId=${userId}`;
        return this.http.get<StudentInterface>(url);
    }

    uploadFile(resume:File,userId:number){

        const url = `http://localhost:8080/api/createResume/uploadResume?userId=${userId}`

        const formData = new FormData();
        formData.append('resume', resume);
        this.http.post(url, formData).subscribe(response => {
            console.log('все ок')
        });
    }
}