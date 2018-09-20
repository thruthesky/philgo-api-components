import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-forum-basic-view',
  templateUrl: './forum-basic-view.component.html',
  styleUrls: ['../../../scss/index.scss', './forum-basic-view.component.scss']
})
export class ForumBasicViewComponent implements OnInit {

  @Input() post: ApiPost;

  @Output() view = new EventEmitter();
  @Output() vote = new EventEmitter();
  @Output() menu = new EventEmitter();


  constructor(
    public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
  }

  show(post) {
    return post['show'];
  }

}
