import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SimpleLibrary as _ } from 'ng-simple-library';
import { PhilGoApiService, ApiPost } from '../../../philgo-api/philgo-api.service';
import { ComponentService } from '../../service/component.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnInit, AfterViewInit {

  @Input() root: ApiPost; // post only
  @Input() post: ApiPost; // post or comment
  form: ApiPost = <any>{
    gid: _.randomString(19, this.philgo.myIdx())
  };
  percentage = 0;

  loader = {
    submit: false
  };
  constructor(
    public philgo: PhilGoApiService,
    public componentService: ComponentService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if ( this.post['edit'] ) {
        this.form = this.post;
      } else {
        this.form.idx_parent = this.post.idx;
      }
    }, 10);
  }

  onSubmit() {
    if ( this.loader.submit ) {
      return;
    }
    console.log('onSubmit() this.form: ', this.form);

    this.loader.submit = true;
    /**
     * Edit
     */
    if (this.post['edit']) {
      this.form.idx = this.post.idx;
      this.philgo.postEdit(this.form).subscribe(res => {
        console.log('edited: ', res);
        Object.assign(this.post, res);
        this.post['edit'] = false;
        this.form.files = [];
        this.loader.submit = false;
      }, e => {
        this.componentService.alert(e);
        this.loader.submit = false;
      });
    } else {

      console.log('create');
      /**
       * Reply
       */
      this.philgo.postCreate(this.form).subscribe(res => {
        console.log('created: ', res);

        if (this.root.comments && this.root.comments.length) {

        } else {
          this.root.comments = [];
        }
        console.log('post, root, res', this.post, this.root, res);

        /**
         * Find parent position
         */
        const pos = this.root.comments.findIndex(comment => comment.idx === this.post.idx);
        if (pos !== -1) { // if found
          this.root.comments.splice(pos + 1, 0, <any>res);
        } else { // if not found
          this.root.comments.push(<any>res);
        }
        // clear
        this.post['reply'] = false; // being used in 'view template' to show reply form.
        this.form.content = '';
        this.form.files = [];
        this.form.gid = _.randomString(19, this.philgo.myIdx());
        this.loader.submit = false;
      }, e => {
        this.componentService.alert(e);
        this.loader.submit = false;
      });
    }
  }



  onChangeFile(event: Event) {
    this.uploadFile(<any>event.target['files']);
  }

  uploadFile(files: FileList) {

    console.log('files: ', files);
    if (files === void 0 || !files.length || files[0] === void 0) {
      const e = { code: -1, message: this.philgo.t({ en: 'Please select a file', ko: '업로드 할 파일을 선택해주세요.' }) };
      // this.componentService.alert(e);
      return;
    }

    this.philgo.fileUpload(files, { gid: this.form.gid, user_password: this.form.user_password }).subscribe(res => {
      if (typeof res === 'number') {
        console.log('percentage: ', res);
        this.percentage = res;
      } else {
        console.log('file upload success: ', res);
        if (!this.form.files || !this.form.files.length) {
          this.form.files = [];
        }
        this.form.files.push(res);
        this.percentage = 0;
      }
    }, e => {
      console.error(e);
      this.percentage = 0;
      this.componentService.alert(e);
    });
  }


}
