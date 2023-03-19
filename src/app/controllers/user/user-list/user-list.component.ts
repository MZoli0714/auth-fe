import { Component, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { UserProfileComponent } from 'src/app/modals/user-profile/user-profile.component';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  @ViewChild('profileUser') profileUser: UserProfileComponent | undefined;
  @ViewChild('dt1') table: any;
  profileUserName: string = '';
  getAllUsers: Subscription | undefined;
  deleteUserSub: Subscription | undefined;
  userList: User[] = [];
  first:number = 0;
  rows:number = 10;

  constructor(private restApi: RestService, private authService: UserAuthService,
        private messageService: MessageService, private ngZone: NgZone,
        private confirmationService: ConfirmationService) {}
  
  ngOnInit(): void{
    this.getAllUsers = this.restApi.getAllUsers().subscribe(
      users => this.userList = users
    )
  }

  ngOnDestroy(): void{
    if(this.deleteUserSub)
      this.deleteUserSub.unsubscribe();
    if(this.getAllUsers)
      this.getAllUsers.unsubscribe();
  }
  openModal(user: string) {
    if(this.profileUser != undefined) {
      this.profileUserName = user;
      this.profileUser.showModalDialog(user);
    }
  }

  private deleteUser(email: string): void{
    this.deleteUserSub = this.authService.deleteUser(email)
      .subscribe({
        next: () => {
          this.userList = this.userList.filter(user => user.email !== email)
          this.ngZone.run(() => {});
        },
        error: (e) => {
          this.messageService.add({severity:'error', summary:'Error', detail: JSON.stringify(e.error.errors)});
        },
        complete: () => {
          this.messageService.add({severity:'success', summary:'Deleted', detail:`${email} has been deleted`});
        }
      })
  }

  applyFilterGlobal($event: any, stringVal: any): void {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  confirm(event: any, email: string): void {
    this.confirmationService.confirm({
      target: event.target,
      message: `Are you sure that you want to delete ${email}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({severity:'info', summary:'In progress', detail:`Deleting user for ${email}`});
        this.deleteUser(email);
      },
      reject: () => {
        this.messageService.add({severity:'info', summary:'Rejected', detail:'You have rejected'});
      }
    });
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
    return this.userList ? this.first === (this.userList.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.userList ? this.first === 0 : true;
  }
}
