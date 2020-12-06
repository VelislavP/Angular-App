import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../_models';
@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User>('/users');
    }

    register(user: User) {
        const header = new HttpHeaders()
        .set('Content-type', 'application/json');
        const body = JSON.stringify(user);
        const baseUrl = 'https://localhost:44377' + '/register';
        return this.http.post<User>(baseUrl, body, { headers: header} )
    }
   
}