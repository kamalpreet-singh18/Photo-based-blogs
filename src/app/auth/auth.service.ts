import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private token: string;
    isAuthenticated=false;
    private tokenTimer: NodeJS.Timer;
    private authListener = new Subject<boolean>()
    constructor(private http: HttpClient, private router: Router){}

    createUser(username: string, password: string){
        let authData: AuthData= {
            email:username,
            password: password
        }
        this.http.post("http://localhost:3000/api/user/signup",authData)
                 .subscribe(response =>{
                     console.log(response)
                 })
    };

    login(username: string, password: string){
        let authData: AuthData= {
            email:username,
            password: password
        }
        this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login",authData)
                 .subscribe(response =>{
                     const token = response.token;
                     this.token=token;
                     if(token){
                        const expiresInDuration = response.expiresIn;
                        this.setAuthTimer(expiresInDuration);
                        this.authListener.next(true);
                        this.isAuthenticated=true

                        const now = new Date();
                        const expirationDate =new Date(now.getTime()+expiresInDuration*1000);
                        this.saveAuthData(token,expirationDate);
                        this.router.navigate(['/']);

                     }
                 })
    };

    getToken(){
        return this.token;
    }

    getAuthStatusListener(){
        return this.authListener.asObservable();

    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    autoAuthUser(){
        const authData=this.getAuthData();
        if(!authData){
            return;
        }
        const now =  new Date();
        const isInFuture = authData.expirationDate.getTime()-now.getTime();
        if(isInFuture>0){
            this.setAuthTimer(isInFuture/1000);
            this.token=authData.token;
            this.isAuthenticated=true;
            this.authListener.next(true);
        }
    }

    logout(){
        this.token=null;
        this.isAuthenticated=false;
        this.authListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }


    private saveAuthData(token: string, expirationDate: Date){
        localStorage.setItem("token",token);
        localStorage.setItem("expiration",expirationDate.toISOString());
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration")
    }

    private getAuthData(){
        
        const token = localStorage.getItem("token");
        const expiration = localStorage.getItem("expiration");
        if (!token || !expiration){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expiration)
        }
    }

    private setAuthTimer(duration: number){
        this.tokenTimer=setTimeout(()=>{
            this.logout();
        },duration*1000)
    }
    
}