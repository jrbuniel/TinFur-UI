import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PetDetailComponent } from './pet/pet-detail/pet-detail.component';
import { PetEditComponent } from './pet/pet-edit/pet-edit.component';
import { PetListComponent } from './pet/pet-list/pet-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'pets',
    component: PetListComponent
  },
  {
    path: 'pets/:id',
    component: PetDetailComponent
  },
  {
    path: 'pets/:id/edit',
    component: PetEditComponent
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
