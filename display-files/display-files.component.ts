import { Component, OnInit, Input } from '@angular/core';
import { PhilGoApiService, ApiFile, ApiPost } from '../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-display-files',
  templateUrl: './display-files.component.html',
  styleUrls: ['../scss/index.scss', './display-files.component.scss']
})
export class DisplayFilesComponent implements OnInit {

  @Input() edit = false;
  @Input() post: ApiPost;
  @Input() percentage = 0;

  constructor(
    public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
  }


  photos(): Array<ApiFile> {
    return this.post.files.filter(file => file.type.indexOf('image') === 0);
  }

  attachments(): Array<ApiFile> {
    return this.post.files.filter(file => file.type.indexOf('image') !== 0);
  }

  onClickDeleteButton(file: ApiFile) {
    const req = { idx: file.idx, gid: this.post.gid, user_password: this.post.user_password };
    console.log('going to delete file: ', file, req);
    this.philgo.fileDelete(req).subscribe(res => {
      console.log('file delete success', res);
      const pos = this.post.files.findIndex(orgFile => orgFile.idx === res.idx);
      if (pos !== -1) {
        this.post.files.splice(pos, 1);
      }
    }, e => alert(e));
  }
}
