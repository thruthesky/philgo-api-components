import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApiPostSearch, ApiForum, ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentService } from '../../../service/component.service';

@Component({
  selector: 'app-forum-basic-list',
  templateUrl: './forum-basic-list.component.html',
  styleUrls: ['../../../scss/index.scss', './forum-basic-list.component.scss']
})
export class ForumBasicListComponent implements OnInit {

  @Input() autoViewContent = false;
  @Output() load = new EventEmitter<ApiPostSearch>();
  @Output() edit = new EventEmitter<ApiPost>();

  forum: ApiForum = null;
  posts: Array<ApiPost> = [];


  /**
   * Post view
   */
  postView: ApiPost;

  /**
   * Page navigation
   */
  post_id = '';
  page_no = 1;
  limit = 20;
  noMorePosts = false;



  /**
   *
   */
  show = {
    firstPageLoader: true
  };


  constructor(
    activatedRoute: ActivatedRoute,
    public readonly philgo: PhilGoApiService,
    private componentService: ComponentService
  ) {
    activatedRoute.paramMap.subscribe(params => {
      this.post_id = params.get('post_id');
      const idx = params.get('idx');
      this.loadPage({ view: idx });
    });
  }

  ngOnInit() {
  }

  loadPage(options: { view: string } = <any>{}) {
    const req: ApiPostSearch = { post_id: this.post_id, page_no: this.page_no, limit: this.limit };
    if (options.view) {
      req.view = options.view;
    }
    this.philgo.postSearch(req).subscribe(search => {
      this.load.emit(search);
      console.log('search: ', search);
      this.show.firstPageLoader = false;
      this.page_no++;
      this.forum = search;
      /**
       * Show post in view
       */
      if (search && search.view && search.view.idx) {
        this.postView = search.view;
        this.postView.show = true;
      }
      if (!search.posts || !search.posts.length) {
        this.noMorePosts = true;
        return;
      }


      /**
       * Don't show the post of view (on top) in the post-list.
       */
      if (this.postView && this.postView.idx) {
        const pos = search.posts.findIndex(v => v.idx === this.postView.idx);
        if (pos !== -1) {
          search.posts.splice(pos, 1);
        }
      }

      this.posts = this.posts.concat(search.posts);
    }, e => {
      this.show.firstPageLoader = false;
      this.componentService.alert(e);
    });
  }





  onView(post: ApiPost) {
    if (this.postView && this.postView.idx && this.postView.idx === post.idx) {
      return;
    } else {
      post.show = !post.show;
      history.pushState({}, post.subject, `/forum/${post.post_id}/${post.idx}`);
    }
  }


}
