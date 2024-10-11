import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from 'app/_models/student.model';
import { studentservice } from 'app/_services/student.service';
import { ToastrService } from 'ngx-toastr';
import { InstituteService } from 'app/_services/institute.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  studentForm: FormGroup;
  countries: string[];
  institutes: any;
  fileError: string = '';
  selectedImage: any;
  isEditMode: boolean = false;
  selectedInstitute: any;
  selectedFile: any;

  constructor(
    private studentservice: studentservice,
    private instituteService: InstituteService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.studentForm = this.fb.group({
      id: [0],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(3)]],
      address: [''],
      country: ['', Validators.required],
      instituteName: ['', Validators.required],
      intake: ['', Validators.required],
      courseTitle: ['', [Validators.required, Validators.minLength(3)]],
      studentIdCard: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getStudents();
    this.getCountries();
    this.getInstitutes();
  }

  getCountries() {
    this.studentservice.getCountries().subscribe(
      countries => {
        this.countries = countries;
      },
      error => {
        console.error('Error fetching countries:', error);
        this.toastr.error('Failed to load countries.');
      }
    );
  }

  getStudents() {
    this.studentservice.getStudents().subscribe(data => {
      this.students = data;
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formData = new FormData();
  
      Object.keys(this.studentForm.controls).forEach(key => {
        const controlValue = this.studentForm.get(key)?.value;
  
        if (key === 'instituteName') {
          formData.append('instituteId', controlValue); // Adjust institute name to institute ID
        } else {
          const valueToAppend = key === 'intake' ? new Date(controlValue).toISOString() : controlValue;
          formData.append(key, key === 'studentIdCard' && controlValue ? `data:image/jpeg;base64,${controlValue}` : valueToAppend);
        }
      });
  
      if (this.isEditMode) {
        formData.append('id', this.studentForm.get('id')?.value); // Append student ID for update
        this.studentservice.updateStudent(formData).subscribe(
          response => {
            this.toastr.success('Student updated successfully');
            this.getStudents(); // Refresh the list of students
            this.resetForm();   // Reset the form after successful update
          },
          error => this.toastr.error('Failed to update student')
        );
      } else {
        this.studentservice.saveStudent(formData).subscribe(
          response => {
            this.toastr.success('Student saved successfully');
            this.getStudents(); // Refresh the list of students
            this.resetForm();   // Reset the form after successful save
          },
          error => this.toastr.error('Failed to save student')
        );
      }
    }
  }
  
  onEdit(student: Student) {
    this.studentForm.patchValue({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      address: student.address,
      country: student.country,
      instituteName: student.instituteId,
      intake: student.intake,
      courseTitle: student.courseTitle
    });
  
    this.selectedImage = student.studentIdCard ? `data:image/jpeg;base64,${student.studentIdCard}` : null;
    this.isEditMode = true;
  }

  
  getInstitutes(){
    this.instituteService.getInstitutes().subscribe(data => {
      this.institutes = data;
    });
  }

  onInstituteSelection(event: any) {
    this.selectedInstitute = event.value;
  }
  
  onDelete(studentId: number) {
    this.studentservice.deleteStudent(studentId).subscribe(
      response => {
        this.toastr.success('Student deleted successfully!');
        this.getStudents();
      },
      error => {
        this.toastr.error('Failed to delete student!');
      }
    );
  }

  resetForm() {
    this.studentForm.reset({
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      instituteName: '',
      intake: '',
      courseTitle: '',
      studentIdCard: null
    });
    this.fileError = '';
    this.selectedImage = null;
    this.isEditMode = false;
  }
  
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validTypes.includes(file.type) && file.size < 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result.split(',')[1];
          this.studentForm.patchValue({ studentIdCard: base64String });
          this.selectedImage = e.target.result; // Show preview of the selected image
          this.fileError = '';
        };
        reader.readAsDataURL(file);
      } else {
        this.fileError = 'Invalid file type or size. Please upload a jpg or png file smaller than 2MB.';
        this.selectedImage = null; // Reset the image if it's invalid
      }
    }
  }
  
}
