import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {

    public onClose: Subject<boolean>;

    constructor(private _bsModalRef: BsModalRef) {

    }

    public ngOnInit(): void {
        this.onClose = new Subject();
    }

    public onConfirm(): void {
        this.onClose.next(true);
        this._bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this._bsModalRef.hide();
    }
}