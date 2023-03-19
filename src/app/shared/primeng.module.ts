import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    CheckboxModule,
    PanelModule,
    CardModule,
    TableModule,
    ConfirmPopupModule,
    DialogModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
  ]
})
export class PrimengModule { }
