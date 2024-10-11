import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Institute } from 'app/_models/institute.model';
import { InstituteService } from 'app/_services/institute.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.css']
})
export class InstituteComponent implements OnInit {
  studentForm: FormGroup;
  institutes: any;

  constructor(
    private instituteService: InstituteService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.studentForm = this.fb.group({
      id: [0],
      instituteName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getInstitutes();
  }

  getInstitutes() {
    this.instituteService.getInstitutes().subscribe(
      institutes => {
        this.institutes = institutes;
      },
      error => {
        console.error('Error fetching institutes:', error);
        this.toastr.error('Failed to load institutes.');
      }
    );
  }

  onSubmit() {
    if (this.studentForm.valid) {
      if (this.studentForm.get('id')?.value === 0) {
        // Add Institute
        const formData = new FormData();
        formData.append('instituteName', this.studentForm.get('instituteName')?.value);
  
        this.instituteService.saveInstitute(formData).subscribe(
          response => {
            this.toastr.success('Institute added successfully!');
            this.getInstitutes();
            this.resetForm();
          },
          error => {
            this.toastr.error('Failed to add institute!');
          }
        );
      } else {
        // Update Institute
        const institute = {
          id: this.studentForm.get('id')?.value,
          instituteName: this.studentForm.get('instituteName')?.value,
        };
        this.instituteService.updateInstitute(institute).subscribe(
          response => {
            this.toastr.success('Institute updated successfully!');
            this.getInstitutes();
            this.resetForm();
          },
          error => {
            this.toastr.error('Failed to update institute!');
          }
        );
      }
    }
  }

  onEdit(institute: Institute) {
    this.studentForm.patchValue(institute);
  }

  onDelete(instituteId: number) {
    this.instituteService.deleteInstitute(instituteId).subscribe(
      response => {
        this.toastr.success('Institute deleted successfully!');
        this.getInstitutes();
      },
      error => {
        this.toastr.error('Failed to delete institute!');
      }
    );
}

  resetForm() {
    this.studentForm.reset({
      id: 0,
      instituteName: '',
    });
  }
}
