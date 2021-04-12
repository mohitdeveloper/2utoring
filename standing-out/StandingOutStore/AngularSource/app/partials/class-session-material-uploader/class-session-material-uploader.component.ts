import { Component, EventEmitter, Output, Input, OnInit } from "@angular/core";
import { SessionDocumentsService } from "../../services";
import { SessionDocument } from "../../models";
import { FileUploader, ParsedResponseHeaders } from "ng2-file-upload";
import { ServiceHelper } from "../../helpers";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DocumentPermissionModalComponent } from "../../components";

@Component({
    selector: 'app-class-session-material-uploader',
    templateUrl: './class-session-material-uploader.component.html',
    styleUrls: ['./class-session-material-uploader.component.scss']
})

export class ClassSessionMaterialUploaderComponent implements OnInit {
    constructor(private sessionDocumentsService: SessionDocumentsService, private toastr: ToastrService, private modalService: NgbModal) { }

    serviceHelper: ServiceHelper = new ServiceHelper();

    @Input() titleInput: string;
    @Input() subtitleInput: string;

    @Input() type: string;
    @Input() classSessionId: string;

    @Output() emitLoaded = new EventEmitter<boolean>();

    sessionDocuments: SessionDocument[] = [];
    public uploader: FileUploader = new FileUploader({ url: this.serviceHelper.baseApi + `/api/sessionDocuments/${this.type}/upload/` + this.classSessionId, method: 'POST' });
    public dropZoneOver: boolean = false;
    uploaderShow: boolean = true;

    ngOnInit(): void {
        this.uploader.options.url = this.serviceHelper.baseApi + `/api/sessionDocuments/${this.type}/upload/` + this.classSessionId;

        this.sessionDocumentsService.getFiles(this.classSessionId, this.type)
            .subscribe(success => {
                this.sessionDocuments = success;
                this.emitLoaded.emit(true);
            }, error => {
            });
    };

    public fileOver(e: any): void {
        debugger;
        this.dropZoneOver = e;
    }

    public fileDropped(e: any): void {
        debugger;
        if (this.uploader.queue.length > 0) {
            $('.loading').show();
            this.uploader.uploadAll();
            this.uploaderShow = false;
            this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
                if (status == 200) {
                    this.uploader.clearQueue();
                    this.uploaderShow = true;
                    this.ngOnInit();
                } else {
                    $('.loading').hide();
                    this.uploader.clearQueue();
                    this.uploaderShow = true;
                    this.toastr.error('We were unable to upload your document');
                }
            }
        }
    }

    deleteSessionDocument(sessionDocument: SessionDocument): void {
        $('.loading').show();
        this.sessionDocumentsService.delete(this.classSessionId, sessionDocument.id)
            .subscribe(success => {
                this.ngOnInit();
            }, error => {
            });
    };

    sharedPermissions() {
            this.toastr.warning('This feature is coming soon!');
            return;
    }

    setPermissions(sessionDocument: SessionDocument): void {
        debugger;
        
        const modalRef = this.modalService.open(DocumentPermissionModalComponent, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.fileIds = [sessionDocument.id];
        modalRef.componentInstance.type = this.type;
        modalRef.componentInstance.classSessionId = this.classSessionId;

        //handle the response

        modalRef.result.then((result) => {
            this.ngOnInit();
        }, (reason) => {
            console.log('dsmissed - closed no action');
        });
    };
}