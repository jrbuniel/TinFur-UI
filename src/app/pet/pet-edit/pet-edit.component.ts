import { Component, OnInit, OnDestroy, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Pet } from '../pet';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-pet-edit',
  templateUrl: './pet-edit.component.html',
  styleUrls: ['./pet-edit.component.css']
})
export class PetEditComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  pageTitle = 'Pet Edit';
  errorMessage!: string;
  petForm!: FormGroup;
  tranMode!: string;
  pet!: Pet;
  private sub!: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService) {

    this.validationMessages = {
      name: {
        required: 'Pet name is required.',
        minlength: 'Pet name must be at least three characters.',
        maxlength: 'Pet name cannot exceed 50 characters.'
      },
      breed: {
        required: 'Pet breed name is required.',
      },
      gender: {
        required: 'Pet gender name is required.',
      }
    };
  }

  ngOnInit(): void {
    this.tranMode = "new";
    this.petForm = this.fb.group({
      name: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
      ]],
      breed: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');
        const breed = params.get('breed');
        const gender = params.get('gender');

        if (id == '0') {
          const pet: Pet = { id: "0", name: "", breed: "", gender: "" };
          this.displayPet(pet);
        }
        else {
          this.getPet(id);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getPet(id: string | null): void {
    this.petService.getPet(id)
      .subscribe({
        next: (pet: Pet) => this.displayPet(pet),
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get pet in pet edit')
      });
  }

  displayPet(pet: Pet): void {
    if (this.petForm) {
      this.petForm.reset();
    }
    this.pet = pet;
    if (this.pet.id == '0') {
      this.pageTitle = 'Add Pet';
    } else {
      this.pageTitle = `Edit Pet: ${this.pet.name}`;
    }
    this.petForm.patchValue({
      name: this.pet.name,
      breed: this.pet.breed,
      gender: this.pet.gender
    });
  }

  deletePet(): void {
    if (this.pet.id == '0') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Pet: ${this.pet.name}?`)) {
        this.petService.deletePet(this.pet.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: (err) => this.errorMessage = <any>err,
            complete: () => console.info('Delete Pet in pet edit')
          });
      }
    }
  }

  savePet(): void {
    if (this.petForm.valid) {
      if (this.petForm.dirty) {
        const e = { ...this.pet, ...this.petForm.value };
        if (e.id === '0') {
          this.petService.createPet(e)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err) => this.errorMessage = <any>err,
              complete: () => console.info('Create pet in pet edit')
            });
        } else {
          this.petService.updatePet(e)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err) => this.errorMessage = <any>err,
              complete: () => console.info('Update pet in pet edit')
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.petForm.reset();
    this.router.navigate(['/pets']);
  }

}
