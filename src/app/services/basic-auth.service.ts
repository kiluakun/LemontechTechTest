import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { StepOneResponse, ErrorResponse } from '../models/response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthService {

  // endpoint = 'http://applications.lemontech.com/api/login';
  // endpoint = 'api/login';


  constructor(private http: HttpClient) { }

   private extractData(res: StepOneResponse) {
    let body = res;
    return body || { };
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.log(error);
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public stepOne(username:String, base64pwd:String): Observable<any> {

    let headerOptions = new HttpHeaders();
    headerOptions = headerOptions.append("Authorization", "Basic " + btoa(`${username}:${base64pwd}`));
    headerOptions = headerOptions.append('Access-Control-Allow-Origin', '*, http://localhost:4200');

    const httpOptions = {
      headers: headerOptions
    };

    return this.http.post('api/login', httpOptions).pipe(
      map(this.extractData));
  }
  

  public stepTwo (username:String, base64pwd:String, user:User): Observable<any> {
    let headerOptions = new HttpHeaders();
    headerOptions = headerOptions.append("Authorization", "Basic " + btoa(`${username}:${base64pwd}`));
    // headerOptions = headerOptions.append("Content-Type", "application/x-www-form-urlencoded");
    headerOptions = headerOptions.append('Access-Control-Allow-Origin', '*, http://localhost:4200');
    // headerOptions = headerOptions.append('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
    // headerOptions = headerOptions.append('Access-Control-Request-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
    headerOptions = headerOptions.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // headerOptions = headerOptions.append('Access-Control-Request-Method', 'GET, POST, OPTIONS, PUT, DELETE');

    const httpOptions = {
      headers: headerOptions
    };

    return this.http.put(`api/users/${user.id}`, user, httpOptions).pipe(
      tap(_ => {
        console.log('response:', _);
        console.log(`updated user id=${user.id}`)
      }),
      catchError(this.handleError<ErrorResponse>('updateProduct'))
    );
  }

  
  
}
