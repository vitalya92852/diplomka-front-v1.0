import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { PersistanceService } from "./persistance.service";


// @Injectable()
// export class AuthInerseptor implements HttpInterceptor{
//     constructor(private persistanceService:PersistanceService){}
//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const token = this.persistanceService.get('accessToken')
//         request = request.clone({
//             setHeaders:{
//                 Authorization: token ? `Token ${token}`: ''
//             }
//         })
//         return next.handle(request)
//     }

// }

export const loadinterceptor: HttpInterceptorFn = (request,next)=>{
        const persistanceService = inject(PersistanceService);
        const token = persistanceService.get('accessToken')
        request = request.clone({
            setHeaders:{
                Authorization: token ? `Token ${token}`: ''
            }
        })
        return next(request)
}