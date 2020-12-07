import {AfterViewInit, Component, ElementRef} from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { UserService} from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    user: User;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(user => {
            this.loading = false;
            this.user = user;
        });
    }
}
@Component({ templateUrl: 'home.component.html' })
export class AppComponent implements AfterViewInit {
    constructor(private elementRef: ElementRef){

    }
    ngAfterViewInit(){
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'white';
   }
}