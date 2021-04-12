import { Component, OnInit, Input, Inject, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassSessionsMaterialComponent } from '../../class-sessions/class-sessions-material/class-sessions-material.component';

@Component({
    selector: 'app-course-class-sessions-dialog',
    templateUrl: './course-upload-dialog.component.html',
    styleUrls: ['./course-upload-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CourseUploadDialogComponent {

    classSessionId: string;
    selectedTutorId: string;
    selectedIndex: any;
    @ViewChild('classsSessionRef') classsSessionRef: ClassSessionsMaterialComponent;
    @Output() passData = new EventEmitter();
    constructor(
        public dialogRef: MatDialogRef<CourseUploadDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        debugger;
        this.classSessionId = data.classSessionId;
        this.selectedTutorId = data.selectedTutorId;
        this.selectedIndex = data.selectedIndex ? data.selectedIndex : -1;
        }
    closeLessonDialog(): void {
        this.passData.emit(this.classsSessionRef);
        this.dialogRef.close();
    }

    // ngOnInit() {
    //     this.classSessionId = this.data.classSessionId;
    // }

}

