import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import { ComponentService } from '../../../service/component.service';
import { AppService } from '../../../../../projects/pwa/src/services/app.service';



@Component({
  selector: 'app-forum-basic-view',
  templateUrl: './forum-basic-view.component.html',
  styleUrls: ['../../../scss/index.scss', './forum-basic-view.component.scss']
})
export class ForumBasicViewComponent implements OnInit, AfterViewInit {

  @Input() post: ApiPost;

  @Output() view = new EventEmitter<ApiPost>();
  @Output() edit = new EventEmitter<ApiPost>();
  @Output() delete = new EventEmitter<ApiPost>();

  // @ViewChild('postContent') postContent: HTMLDivElement;

  content;
  constructor(
    public a: AppService,
    public philgo: PhilGoApiService,
    public componentService: ComponentService
  ) {
    window['showImage'] = this.showImage.bind(this);
  }

  showImage(img) {
    console.log('popup this image:', img);
    this.a.openImageModal(img);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      let content = this.post.content;
      if (content) {
        content = content.replace(/<img/ig, `<img class="pointer" onclick="showImage(this.src)"`);
        this.content = content;
      }
    }, 100);
  }

  ngOnInit() {

  }


  show(post) {
    return post['show'];
  }

  onReport(post: ApiPost) {
    if (post['loaderReport']) {
      return;
    }
    post['loaderReport'] = true;
    this.philgo.postReport(post.idx).subscribe(res => {
      this.componentService.alert({
        content: this.philgo.t({ en: 'This post has been reported.', ko: '본 글은 신고되었습니다.' })
      });
      post['loaderReport'] = false;
    }, e => {
      this.componentService.alert(e);
      post['loaderReport'] = false;
    });

  }

  onVote(post: ApiPost, mode: 'good' | 'bad') {
    if (post['loaderVote']) {
      return;
    }
    post['loaderVote'] = true;
    post['vote'] = mode;
    this.philgo.postLike({ idx: post.idx, mode: mode }).subscribe(res => {
      console.log('res: ', res);
      post[mode] = res.result;
      post['loaderVote'] = false;
    }, e => {
      this.componentService.alert(e);
      post['loaderVote'] = false;
    });
  }
  onDelete(post: ApiPost) {
    if (post['loaderDelete']) {
      return;
    }
    post['loaderDelete'] = true;
    this.philgo.postDelete({ idx: post.idx }).subscribe(res => {
      console.log('delete success: ', res);
      post.subject = this.philgo.textDeleted();
      post.content = this.philgo.textDeleted();
      post['loaderDelete'] = false;
    }, e => {
      this.componentService.alert(e);
      post['loaderDelete'] = false;
    });
  }

}

