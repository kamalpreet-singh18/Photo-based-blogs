import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{
    posts: Post[] = [];
    postsSub: Subscription;
    authStatusSub: Subscription;
    isLoading=false
    totalPosts=10;
    postsPerPage=2;
    currentPage=1;
    userId: string;
    pageSizeOptions= [1,2,5,10];
    userIsAuth=false;

    constructor(public postsService: PostsService, private authService: AuthService){}

    ngOnInit(){
        this.isLoading=true;
        this.postsService.getPosts(this.postsPerPage,this.currentPage);
        this.userId=this.authService.getUserId();
        this.postsSub=this.postsService.getPostUpdateListener().subscribe((postData: {posts:Post[],postCount:number})=>{
            this.isLoading=false;
            this.posts=postData.posts;
            this.totalPosts=postData.postCount
        });
        this.userIsAuth=this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
            this.userIsAuth=isAuthenticated;
            this.userId=this.authService.getUserId();
        });

        
    };

    onChangedPage(pageData: PageEvent){
        this.isLoading=true
        this.currentPage=pageData.pageIndex +1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage,this.currentPage);
    }

    ngOnDestroy(){
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(postId: string){
        this.isLoading=true
        this.postsService.deletePost(postId).subscribe(()=>{
            this.postsService.getPosts(this.postsPerPage,this.currentPage);
        });
    }

}