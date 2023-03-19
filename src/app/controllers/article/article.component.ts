import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/models/article';
import { RestService } from 'src/app/services/rest.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {
  
  @ViewChild('dt1') table: any;
  first:number = 0;
  rows:number = 10;
  getAllArticles: Subscription | undefined;
  favoriteSub: Subscription | undefined;
  deleteArtSub: Subscription | undefined;
  updateArtSub: Subscription | undefined;
  articles: any;
  articleNew: any;
  submitted: boolean = false;
  productDialog: boolean = false;
  articleupdateDIalog: boolean = false;
  articleEditForm!: FormGroup;
  articleUpdateEditForm!: FormGroup;

  constructor(private restApi: RestService, private authService: UserAuthService,
    private messageService: MessageService, private ngZone: NgZone,
    private confirmationService: ConfirmationService, private fb: FormBuilder) {}

  ngOnDestroy():void {
    if(this.favoriteSub)
      this.favoriteSub.unsubscribe();
    if(this.getAllArticles)
      this.getAllArticles.unsubscribe();
    if(this.deleteArtSub)
      this.deleteArtSub.unsubscribe();
    if(this.updateArtSub)
      this.updateArtSub.unsubscribe();
  }
  ngOnInit():void {
 
    this.articleEditForm = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
      tagList: new FormControl('', Validators.required)
    });

    this.articleUpdateEditForm = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
      tagList: new FormControl('', Validators.required)
    });

    this.getAllArticles = this.restApi.getAllArticles()
    .subscribe({
      next: (result) => {
        this.articles = result
        // this.messageService.add({severity:'info', summary:'Register', detail:'User has been created'});
      },
      error: (e) => {
        this.messageService.add({severity:'error', summary:e.error?.message, detail:JSON.stringify(e.error.errors)});
      },
      complete: () => {
        // this.articles = [...this.articles[0]]
      }
  });
  }

  confirm(event: any, slug: string): void {
    this.confirmationService.confirm({
      target: event.target,
      message: `Are you sure that you want to delete ${slug}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({severity:'info', summary:'In progress', detail:`Deleting article for ${slug}`});
        this.deleteArticle(slug);
      },
      reject: () => {
        this.messageService.add({severity:'info', summary:'Rejected', detail:'You have rejected'});
      }
    });
  }

  deleteArticle(slug: string): void{
    this.deleteArtSub = this.restApi.deleteArticle(slug)
      .subscribe({
        error: (e) => {
          this.messageService.add({severity:'error', summary:'Error', detail: JSON.stringify(e.error.errors)});
        },
        complete: () => {
          const updatedArticles = this.articles.articles.filter((article: { slug: any; }) => article.slug !== slug);
          this.articles.articles = [...updatedArticles]
          this.messageService.add({severity:'success', summary:'Deleted', detail:`${slug} has been deleted`});
        }
      })
  }

  favorite(slug: string): void {
    this.favoriteSub = this.restApi.favoriteArticle(slug)
    .subscribe({
      next: (result) => {
      },
      error: (e) => {
        this.messageService.add({severity:'error', summary:e.error?.message, detail:JSON.stringify(e.error.errors)});
      },
      complete: () => {
      }
  });
  }

  updateOnSubmit(): void {
    let updatedObj: Article = {
      body: this.articleUpdateEditForm.value['body'],
      description: this.articleUpdateEditForm.value['description'],
      tagList: this.articleUpdateEditForm.value['tagList'],
      title: this.articleUpdateEditForm.value['title']
    };
  
    this.updateArtSub = this.restApi.updateArticle(updatedObj, this.slugForUpdate)
    .subscribe({
      next: (result: any) => {
        for(let i = 0; i < this.articles.articles.length; i++) {
          if(this.articles.articles[i].slug === this.slugForUpdate) {
            this.articles.articles[i] = result.article;
          }
        }
      },
      error: (e) => {
        this.messageService.add({severity:'error', summary:e.error?.message, detail:JSON.stringify(e.error.errors)});
      },
      complete: () => {
        this.messageService.add({severity:'success', summary:'Update', detail:'Successfully Article update'});
        this.articleupdateDIalog = false;
      }
  });
  }

  onSubmit(): void{

    let registerObj: Article = {
      body: this.articleEditForm.value['body'],
      description: this.articleEditForm.value['description'],
      tagList: this.articleEditForm.value['tagList'],
      title: this.articleEditForm.value['title']
    };

    this.restApi.createArticle(registerObj)
      .subscribe({
        next: (result) => {
          this.articles.articles.push(result)
        },
        error: (e) => {
          this.messageService.add({severity:'error', summary:e.error?.message, detail:JSON.stringify(e.error.errors)});
        },
        complete: () => {
          this.messageService.add({severity:'success', summary:'Create', detail:'Successfully Article create'});
          this.productDialog = false;
        }
    });
  }

  applyFilterGlobal($event: any, stringVal: any): void {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openNew() {
    this.articleNew = {};
    this.submitted = false;
    this.productDialog = true;
  }

  slugForUpdate: string = "";
  openUpdate(slug:string) {

    this.restApi.getArticleBySlug(slug)
      .subscribe({
        next: (result) => {
          this.articleUpdateEditForm = this.fb.group({
            title: result.article.title,
            description: result.article.description,
            body: result.article.body,
            tagList: result.article.tagList
          });
        },
        error: (e) => {
          this.messageService.add({severity:'error', summary:e.error?.message, detail:JSON.stringify(e.error.errors)});
        },
        complete: () => {
          this.messageService.add({severity:'success', summary:'Get Article', detail:'Successfully Article get'});
          this.productDialog = false;
        }
    });
    this.slugForUpdate = slug;
    this.articleupdateDIalog = true;
  }

  next(): void {
    this.first = this.first + this.rows;
  }

  prev(): void {
    this.first = this.first - this.rows;
  }

  reset(): void {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.articles ? this.first === (this.articles.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.articles ? this.first === 0 : true;
  }

}
