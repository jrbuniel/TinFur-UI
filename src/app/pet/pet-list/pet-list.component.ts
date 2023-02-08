import { Component, OnInit } from '@angular/core';
import { Pet } from '../pet';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css']
})
export class PetListComponent implements OnInit {
  pageTitle = 'Pet List';
  filteredPets: Pet[] = [];
  pets: Pet[] = [];
  errorMessage = '';

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredPets = this.listFilter ? this.performFilter(this.listFilter) : this.pets;
  }

  constructor(private petService: PetService) { }

  performFilter(filterBy: string): Pet[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.pets.filter((pet: Pet) =>
    pet.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    this.getPetData();
  }

  getPetData() {
    this.petService.getPets()
      .subscribe({
        next: (pets) => {
          console.log('pets', pets);
          this.pets = pets;
          this.filteredPets = pets;
        },
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get pets in pet list')
      });
  }

  deletePet(id: string, name: string): void {
    if (id === '') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Pet: ${name}?`)) {
        this.petService.deletePet(id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: (err) => this.errorMessage = <any>err,
            complete: () => console.info('Delete pet in pet list')
          });
      }
    }
  }

  onSaveComplete(): void {
    this.petService.getPets()
      .subscribe({
        next: (pets) => {
          this.pets = pets;
          this.filteredPets = pets;
        },
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get pets in pet list')
      });
  }

}
