import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Student } from 'app/_models/student.model';
import { studentservice } from 'app/_services/student.service';
import { ToastrService } from 'ngx-toastr';
import { InstituteService } from 'app/_services/institute.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

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
  myFilterControl = new FormControl;

  constructor(
    private studentservice: studentservice,
    private instituteService: InstituteService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
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
      console.log("this.students", this.students);
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formData = new FormData();

      Object.keys(this.studentForm.controls).forEach(key => {
        const controlValue = this.studentForm.get(key)?.value;

        if (key === 'instituteName') {
          formData.append('instituteId', controlValue);
        } else {
          const valueToAppend = key === 'intake' ? new Date(controlValue).toISOString() : controlValue;
          formData.append(key, key === 'studentIdCard' && controlValue ? `${controlValue}` : valueToAppend);
        }
      });

      if (this.isEditMode) {
        const payload = new FormData();
        payload.append('id', this.studentForm.get('id')?.value);
        payload.append('firstName', this.studentForm.get('firstName')?.value);
        payload.append('lastName', this.studentForm.get('lastName')?.value);
        payload.append('email', this.studentForm.get('email')?.value);
        payload.append('phone', this.studentForm.get('phone')?.value);
        payload.append('address', this.studentForm.get('address')?.value);
        payload.append('country', this.studentForm.get('country')?.value);
        payload.append('instituteId', this.selectedInstitute);
        payload.append('intake', new Date(this.studentForm.get('intake')?.value).toISOString());
        payload.append('instituteName', this.studentForm.get('instituteName')?.value);
        payload.append('courseTitle', this.studentForm.get('courseTitle')?.value);
        payload.append('studentIdCard', this.studentForm.get('studentIdCard')?.value ? `${this.studentForm.get('studentIdCard')?.value}` : null);

        this.studentservice.updateStudent(payload).subscribe(
          response => {
            this.toastr.success('Student updated successfully');
            this.getStudents();
            this.resetForm();
          },
          error => this.toastr.error('Failed to update student')
        );
      } else {
        this.studentservice.saveStudent(formData).subscribe(
          response => {
            this.toastr.success('Student saved successfully');
            this.getStudents();
            this.resetForm();
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
    this.studentForm.get('studentIdCard')?.setValue(this.selectedImage);
    this.isEditMode = true;
    this.selectedInstitute = student.instituteId;
  }


  getInstitutes() {
    this.instituteService.getInstitutes().subscribe(data => {
      this.institutes = data;
    });
  }

  onInstituteSelection(event: any) {
    this.selectedInstitute = event.value;
  }

  onDelete(studentId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this student?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
    });
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
      if (validTypes.includes(file.type) && file.size < 10 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result.split(',')[1];
          this.studentForm.patchValue({ studentIdCard: base64String });
          this.selectedImage = e.target.result;
          this.fileError = '';
        };
        reader.readAsDataURL(file);
      } else {
        this.fileError = 'Invalid file type or size. Please upload a jpg or png file smaller than 10MB.';
        this.selectedImage = null;
      }
    }
  }

  openDialog(studentIdCard: string) {
    this.dialog.open(ImageDialogComponent, {
      data: { studentIdCard },
    });
  }

}
