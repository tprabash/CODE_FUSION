import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  downloadImage() {
    const link = document.createElement('a');
    link.href = 'data:image/jpeg;base64,' + this.data.studentIdCard;
    link.download = 'student_id_card.jpg';
    link.click();
  }
}
