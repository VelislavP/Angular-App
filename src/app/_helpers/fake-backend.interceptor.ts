import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable,of,throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../_models';
import { AuthenticationService } from '../_services';

const users: User = AuthenticationService.loggedInUser;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
      // wrap in delayed observable to simulate server api call
      return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
        switch (true) {
            case url.endsWith('/users') && method === 'GET':
                return getUsers();
            default:
                // pass through any requests not handled above
                return next.handle(request);
        }    
    }

    // route functions
    function getUsers() {
        
        if (!isLoggedIn()) return unauthorized();
        return ok(users);
    }

    // helper functions

    function ok(body?) {
        return of(new HttpResponse({ status: 200, body }))
    }

    function error(message) {
        return throwError({ error: { message } });
    }

    function unauthorized() {
        console.log("401!");
        return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
        console.log(AuthenticationService.loggedInUser.token);
        return headers.get('Authorization') === `Bearer ${AuthenticationService.loggedInUser.token}`;
    }
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};