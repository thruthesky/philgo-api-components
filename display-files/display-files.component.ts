import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PhilGoApiService, ApiFile, ApiPost } from '../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-display-files',
  templateUrl: './display-files.component.html',
  styleUrls: ['../scss/index.scss', './display-files.component.scss']
})
export class DisplayFilesComponent implements OnInit, OnChanges {

  @Input() edit = false;
  @Input() post: ApiPost;
  @Input() percentage = 0;
  @Input() showWhenContentHasImage = false;
  @Input() showWhenContentHasNoImage = false;


  /**
   * If it is true, then, images are inserted into editor(view content).
   */
  contentHasImage = false;

  constructor(
    public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
    this.initFiles();
  }

  ngOnChanges() {
    this.initFiles();
  }

  initFiles() {
    if (this.post && this.post.content) {
      this.contentHasImage = this.post.content.indexOf('editor-image') !== -1;
    }

  }


  get photos(): Array<ApiFile> {
    if (this.post && this.post.files && this.post.files.length) {
      return this.post.files.filter(file => file.type.indexOf('image') === 0);
    } else {
      return [];
    }
  }
  get attachments(): Array<ApiFile> {
    if (this.post && this.post.files && this.post.files.length) {
      return this.post.files.filter(file => file.type.indexOf('image') !== 0);
    } else {
      return [];
    }
  }

  display(): boolean {
    if (this.edit) {
      return true;
    }
    if (this.contentHasImage) {
      return this.showWhenContentHasImage;
    } else {
      return this.showWhenContentHasNoImage;
    }
  }


  onClickDeleteButton(file: ApiFile) {

    // todo add delete loader according to file.

    const req = { idx: file.idx, gid: this.post.gid, user_password: this.post.user_password };
    console.log('going to delete file: ', file, req);
    this.philgo.fileDelete(req).subscribe(res => {
      console.log('file delete success', res);
      const pos = this.post.files.findIndex(orgFile => orgFile.idx === res.idx);
      if (pos !== -1) {
        this.post.files.splice(pos, 1);
      }
    }, e => alert(e.message));
  }

  onClickFeature(file: ApiFile) {
    console.log('going to set imaeg as featured: ', file);
    this.philgo.fileFeature(file.idx).subscribe(res => {
      console.log('file feature success', res);
      this.post.files.find(orgFile => {
        if (orgFile.code === 'featured') {
          orgFile.code = '';
          return true;
        }
      });
      file.code = 'featured';
    }, e => alert(e.message));
  }
}
