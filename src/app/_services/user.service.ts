import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../_models';
@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User>('/users');
    }

    signUp(user: User) {
        const header = new HttpHeaders()
        .set('Content-type', 'application/json');
        const body = JSON.stringify(user);
        return this.http.post<User>('https://localhost:44377/register', body, { headers: header} )
    }
   
}