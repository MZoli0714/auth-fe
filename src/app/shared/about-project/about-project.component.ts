import { Component } from '@angular/core';

@Component({
  selector: 'app-about-project',
  templateUrl: './about-project.component.html',
  styleUrls: ['./about-project.component.scss']
})
export class AboutProjectComponent {

  userLogin: boolean = true;
  userRegister: boolean = true;
  userShow: boolean = true;
  userEdit: boolean = true;
  userRD: boolean = true;
  articleCRUD: boolean = true;
  
}
