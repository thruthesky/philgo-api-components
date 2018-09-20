import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
    ApiErrorResponse, ApiProfileUpdateRequest,
    ApiRegisterResponse, ApiProfileResponse, ApiErrorFileNotSelected, ApiErrorFileUploadError, PhilGoApiService, URL_PROFILE_PHOTO
} from '../../../philgo-api/philgo-api.service';
import { HttpErrorResponse } from '@angular/common/http';


import { SimpleLibrary as _ } from 'ng-simple-library';
import { ComponentService } from '../../service/component.service';


@Component({
    selector: 'app-register-component',
    templateUrl: 'register.component.html',
    styleUrls: ['../../scss/index.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit {
    @Input() domain = 'sonub';
    @Output() error = new EventEmitter<ApiErrorResponse>();
    @Output() register = new EventEmitter<ApiRegisterResponse>();
    @Output() update = new EventEmitter<ApiProfileResponse>();
    _ = _;
    form;
    loader = {
        profile: false,
        submit: false
    };
    percentage = 0;
    constructor(
        public philgo: PhilGoApiService,
        private componentService: ComponentService
    ) {
        this.resetForm();
    }
    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        if (this.philgo.isLoggedIn()) {
            this.loader.profile = true;
            this.philgo.profile().subscribe(user => {
                this.loader.profile = false;
                this.form = user;
                console.log('user: ', user);
            }, e => this.componentService.alert(e));
        } else {
            this.resetForm();
        }
    }

    resetForm() {
        this.form = {
            email: '',
            password: '',
            name: '',
            nickname: '',
            mobile: '',
            url_profile_photo: ''
        };
    }

    onSubmit(event?: Event) {
        if (event) {
            event.preventDefault();
        }

        if (this.philgo.isLoggedIn()) {
            // console.log('going to update profile');
            const data: ApiProfileUpdateRequest = {
                name: this.form.name,
                mobile: this.form.mobile
            };
            console.log(data);
            this.philgo.profileUpdate(data).subscribe(user => {
                console.log('updaet: ', user);

                this.loader.submit = false;
                this.update.emit(user);
            }, e => {
                this.loader.submit = false;
                this.error.emit(e);
                this.componentService.alert(e);
            });
        } else {
            this.form['domain'] = this.domain;
            this.philgo.register(this.form).subscribe(user => {
                this.loader.submit = false;
                this.register.emit(user);
            }, e => {
                this.loader.submit = false;
                this.error.emit(e);
                this.componentService.alert({ content: e.message });
            });
        }

        return false;
    }


    onChangePrimaryPhoto(event: Event) {
        this.onUpload(event.target['files']);
    }

    onUpload(files: FileList) {
        this.philgo.uploadPrimaryPhotoWeb(files).subscribe(re => {
            // console.log(event);
            if (typeof re === 'number') {
                // console.log(`File is ${re}% uploaded.`);
                this.percentage = re;
            } else if (re['code'] && re['idx'] === void 0) {
                // console.log('error: ', re);
            } else if (re['idx'] !== void 0 && re['idx']) {
                /**
                 * Success. Profile photo has changed already.
                 */
                console.log('file upload success: ', re);
                // this.photo = re;
                this.form.url_profile_photo = re['src'];
                this.philgo.loginUser(URL_PROFILE_PHOTO, re['src']);
                this.percentage = 0;
            }
        }, (e: HttpErrorResponse) => {
            console.log('error subscribe: ', e);
            if (e.error instanceof Error) {
                console.log('Client-side error occurred.');
            } else {
                // console.log(err);
                if (e.message === ApiErrorFileNotSelected) {
                    console.log('file is not selected');
                } else if (e['code'] !== void 0 && e['code'] === ApiErrorFileUploadError) {
                    console.log('File upload error:', e.message);
                } else {
                    console.log('Other error. May be FILE TOO LARGE. See error message on network tab. ' + e.message);
                }
            }
            console.log('file upload failed');
            const err = this.philgo.error(ApiErrorFileUploadError, 'File upload failed');
            this.error.emit(err);
            this.componentService.alert({ content: err.message });
        });
    }

    onClickDeletePrimaryPhoto(event: Event) {
        event.stopPropagation();
        const idx = this.form.url_profile_photo.split('/').pop();
        this.philgo.deleteFile(parseInt(idx, 10)).subscribe(res => {
            // console.log('res: ', res);
            this.form.url_profile_photo = '';
        }, e => alert(e.message));
    }
}

