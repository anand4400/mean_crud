import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserlistComponent } from './component/userlist/userlist.component';
import { AdduserComponent } from './component/adduser/adduser.component';
import { EdituserComponent } from './component/edituser/edituser.component';
import { ViewuserComponent } from './component/viewuser/viewuser.component';

const routes: Routes = [
  {path: '',  component: UserlistComponent},
  {path: 'userlist',  component: UserlistComponent},
  {path: 'adduser',  component: AdduserComponent},
  {path: 'edituser/:id',  component: EdituserComponent},
  {path: 'viewuser/:id',  component: ViewuserComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
