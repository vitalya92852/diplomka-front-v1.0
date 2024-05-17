import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import { AuthResponseInterface } from '../types/authResponse.interface'

import { LoginRequestInterface } from '../types/loginRequest.interface'
import { CurrentUserInterface } from '../shared/types/currentUser.interface'
import { PersistanceService } from '../shared/services/persistance.service'
import { Store } from '@ngrx/store'
import { isLoggedInSelector } from '../store/auth.selector'
import { RegistrationRequestInterface } from '../types/registrationRequestInterface'



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,private persistanceService:PersistanceService,private store:Store) {}


  getUser(response: CurrentUserInterface): CurrentUserInterface {
    return response; 
  }

  registration(data: RegistrationRequestInterface): Observable<CurrentUserInterface> {
    const url = 'http://localhost:8080/registration';
    return this.http.post<CurrentUserInterface>(url, {
        login: data.user.username,
        password:data.user.password,
        confirmPassword:data.user.confirmPassword,
        name:data.user.name,
        lastname:data.user.lastname,
        surname:data.user.surname,
        group:data.user.group,
        course:data.user.course
    }
      )
  } 

  login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = 'http://localhost:8080/login';

    return this.http
      .post<CurrentUserInterface>(url, {
        username: data.user.username,
        password: data.user.password
      })
      .pipe(
        map((response: CurrentUserInterface) =>{  return this.getUser(response)  } ) 
      );
  }

  getCurrentUser():Observable<CurrentUserInterface>{
    const url = 'http://localhost:8080/user';
    const token = this.persistanceService ? this.persistanceService.get('accessToken') : null;

    // Проверяем, есть ли токен
    if (token) {
      // Формируем заголовки с токеном
      const headers = new HttpHeaders({
        'Authorization': token
      });
      // Отправляем GET-запрос с заголовками
      return this.http.get<CurrentUserInterface>(url, { headers: headers });
    } else {
      // Если токен отсутствует, вернуть ошибку или обработать по вашему усмотрению
      return new Observable<CurrentUserInterface>(observer => {
        observer.error('Токен отсутствует');
      });
    }
  }

  getStudentGroups(){
    const url = 'http://localhost:8080/api/registration/getGroups';
    return this.http.get<string[]>(url)
  }







  
  
}
