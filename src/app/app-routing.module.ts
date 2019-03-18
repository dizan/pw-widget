import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PwWidgetComponent} from './widget/pw-widget/pw-widget.component';

const routes: Routes = [
  {path: '', component: PwWidgetComponent, pathMatch: 'full'},
  {path: 'widget', component: PwWidgetComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
