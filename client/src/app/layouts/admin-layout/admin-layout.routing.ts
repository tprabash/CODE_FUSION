import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { StudentsComponent } from 'app/students/students.component';
import { InstituteComponent } from 'app/institute/institute.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'institutes',   component: InstituteComponent },
    { path: 'students',   component: StudentsComponent },
];
