import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pet } from '../pet';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.css']
})
export class PetDetailComponent implements OnInit {
  pageTitle = 'Pet Detail';
  errorMessage = '';
  pet: Pet | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private petService: PetService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getPet(id);
    }
  }

  getPet(id: string) {
    this.petService.getPet(id)
      .subscribe({
        next: (pet) => this.pet = pet,
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get pet in pet details')
      });
  }

  onBack(): void {
    this.router.navigate(['/pets']);
  }

}
