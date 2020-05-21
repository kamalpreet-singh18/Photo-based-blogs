import { Component, EventEmitter, Output, OnInit} from '@angular/core'
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

    
    enteredContent=''
    enteredTitle=''
    postForm: FormGroup;
    private mode= 'create';
    private postId:string;
    imagePreview: string;
    isLoading=false;
    post:Post;
    constructor(public postsService: PostsService,public route: ActivatedRoute){}

    ngOnInit() {
        this.postForm= new FormGroup({
            title: new FormControl(null,[Validators.required,Validators.minLength(5)]),
            content: new FormControl(null,[Validators.required]),
            image: new FormControl(null,{validators: [Validators.required], asyncValidators: [mimeType]})
        })

        this.route.paramMap.subscribe((params)=>{
            if(params.has('postId')){
                this.mode='edit';
                this.postId=params.get('postId');
                this.isLoading=true
                this.postsService.getPost(this.postId).subscribe(data=>{
                    this.isLoading=false;
                    this.post = {id: data._id,title: data.title,content: data.content,imagePath: data.imagePath}
                    this.postForm.setValue({title: data.title,content: data.content,image: data.imagePath})
                })
            }else{ 
                this.mode='create';
                this.postId=null;
            }
        })
    }
 
    onAddPost(){
        if(this.postForm.invalid){
            return;
        }   
        this.isLoading=true; 
        if(this.mode=='create'){ 
        this.postsService.addPost(this.postForm.value.title,this.postForm.value.content,this.postForm.value.image);
        this.postForm.reset();
        }else{
            this.postsService.updatePost(this.postId,this.postForm.value.title,this.postForm.value.content,this.postForm.value.image);
            this.postForm.reset();
        }
    }

    onImagePicked(event: Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.postForm.patchValue({image:file});
        this.postForm.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = ()=>{
            this.imagePreview=reader.result as string;
        }
        reader.readAsDataURL(file);
    }
}