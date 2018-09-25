import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiPostSearch, ApiForum, ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentService } from '../../../service/component.service';
import { InfiniteScrollService } from '../../../../philgo-api/infinite-scroll';

@Component({
  selector: 'app-forum-basic-list',
  templateUrl: './forum-basic-list.component.html',
  styleUrls: ['../../../scss/index.scss', './forum-basic-list.component.scss']
})
export class ForumBasicListComponent implements OnInit, AfterViewInit, OnDestroy {

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
  forumLoaded = false;
  loading = false;

  /**
   *
   */
  infiniteScrollSubscription;


  //
  constructor(
    activatedRoute: ActivatedRoute,
    public readonly philgo: PhilGoApiService,
    private componentService: ComponentService,
    private scroll: InfiniteScrollService
  ) {
    window['comp'] = this;
    activatedRoute.paramMap.subscribe(params => {
      this.post_id = params.get('post_id');
      const idx = params.get('idx');
      this.loadPage({ view: idx });
    });
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.infiniteScrollSubscription = this.scroll.watch('section.forum-basic-list', 300).subscribe(e => this.loadPage());
  }
  ngOnDestroy() {
    this.infiniteScrollSubscription.unsubscribe();
  }

  loadPage(options: { view: string } = <any>{}) {
    if (this.loading || this.noMorePosts) {
      console.log('in loading. or no more post just return');
      return;
    } else {
      console.log('Going to list post page');
    }
    this.loading = true;
    const req: ApiPostSearch = { post_id: this.post_id, page_no: this.page_no, limit: this.limit };
    if (options.view) {
      req.view = options.view;
    }
    console.log('req: ', req);
    this.philgo.postSearch(req).subscribe(search => {
      this.loading = false;
      this.load.emit(search);
      console.log('ForumBasicListComponent::loadPage() => search: ', search);
      this.forumLoaded = true;
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
          /**
           * bug fix. Length of array is important to check if no-more-posts
           */
          search.posts.splice(pos, 1, <any>{});
        }
      }

      this.posts = this.posts.concat(search.posts);

      if (search.posts.length < this.limit) {
        this.noMorePosts = true;
        return;
      }
    }, e => {
      this.forumLoaded = true;
      this.loading = false;
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
