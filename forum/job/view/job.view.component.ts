import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import * as N from '../job.defines';
import { SimpleLibrary as _ } from 'ng-simple-library';
import { AppService } from '../../../../../projects/pwa/src/services/app.service';


@Component({
  selector: 'app-job-view',
  templateUrl: './job.view.component.html',
  styleUrls: ['../../../scss/index.scss', './job.view.component.scss']
})
export class JobViewComponent implements OnInit {

  @Input() post: ApiPost;
  @Output() View = new EventEmitter();
  @Output() Edit = new EventEmitter();
  @Output() Delete = new EventEmitter();


  N = N;
  _ = _;

  constructor(public philgo: PhilGoApiService,
              public a: AppService) {
  }

  ngOnInit() {
  }

  show(post) {
    return post['show'];
  }


  onClickNotVerified(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // this.tooltip.present(event, {
    //     title: this.philgo.t({ en: 'Not Verfieid', ko: '확인 안됨' }),
    //     subTitle: this.philgo.t({ en: 'Profile is not verfied, yet.', ko: '프로필이 확인되지 않았습니다.' }),
    //     content: this.philgo.t({ en: 'The profile of this person is not yet verified.', ko: '이 구직자의 프로필이 아직 검증되지 않았습니다.' })
    // });
  }

  onClickLink(event) {
    event.preventDefault();
    event.stopPropagation();
    window.open(this.post[N.link]);
  }

}

