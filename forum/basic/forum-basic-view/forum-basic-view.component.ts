import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import { ComponentService } from '../../../service/component.service';

@Component({
  selector: 'app-forum-basic-view',
  templateUrl: './forum-basic-view.component.html',
  styleUrls: ['../../../scss/index.scss', './forum-basic-view.component.scss']
})
export class ForumBasicViewComponent implements OnInit {

  @Input() post: ApiPost;

  @Output() view = new EventEmitter<ApiPost>();
  @Output() edit = new EventEmitter<ApiPost>();
  @Output() delete = new EventEmitter<ApiPost>();


  constructor(
    public philgo: PhilGoApiService,
    public componentService: ComponentService
  ) { }

  ngOnInit() {
  }

  show(post) {
    return post['show'];
  }

  onReport(post: ApiPost) {

    this.philgo.postReport(post.idx).subscribe(res => {
      this.componentService.alert({
        content: this.philgo.t({ en: 'This post has been reported.', ko: '본 글은 신고되었습니다.' })
      });
    }, e => {
      this.componentService.alert(e);
    });

  }

  onVote(post: ApiPost, mode: 'good' | 'bad') {
    this.philgo.postLike({ idx: post.idx, mode: mode }).subscribe(res => {
      console.log('res: ', res);
      post[mode] = res.result;
    }, e => {
      this.componentService.alert(e);
    });
  }
  onDelete(post: ApiPost) {
    this.philgo.postDelete({ idx: post.idx }).subscribe(res => {
      console.log('delete success: ', res);
      post.subject = this.philgo.textDeleted();
      post.content = this.philgo.textDeleted();
    }, e => this.componentService.alert(e));
  }
}

