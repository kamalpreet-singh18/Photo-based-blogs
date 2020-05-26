import {Component, OnInit, OnDestroy} from '@angular/core'
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
    
})
export class HeaderComponent implements OnInit,OnDestroy{
    private authListenerSub: Subscription;
    public userIsAuthenticated=false;
    constructor(public authService: AuthService){};

    ngOnInit(){
        this.userIsAuthenticated=this.authService.getIsAuth();
        this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isAutheticated=>{
            this.userIsAuthenticated=isAutheticated
        });
    }

    ngOnDestroy(){
        this.authListenerSub.unsubscribe();
    }

    onLogout(){
        this.authService.logout();
    }
}