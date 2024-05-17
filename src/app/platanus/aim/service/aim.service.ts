import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AimListInterface } from "../types/aimList.interface";
import { Observable } from "rxjs";
import { AimEditInterface } from "../types/aimEdit.interface";

@Injectable({
    providedIn:'root'
})

export class AimService{

    constructor(private http: HttpClient){}
    getAimList(userId:number):Observable<AimListInterface>{
        const url = `http://localhost:8080/api/aim/getAimList?userId=${userId}`

        return this.http.get<AimListInterface>(url)
    }

    chooseAim(userId:number,aimName:string){
        const url = `http://localhost:8080/api/aim/chooseAim?userId=${userId}&aimName=${aimName}`

        return this.http.get(url)

    }

    editAim(userId:number,aimEdit:AimEditInterface){
        const url = 'http://localhost:8080/api/aim/editAim'

        return this.http.put(url,aimEdit)
    }
}