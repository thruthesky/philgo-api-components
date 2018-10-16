import { Component, OnInit, Input, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhilGoApiService, ApiForum, ApiPost, ApiPostSearch } from '../../../../philgo-api/philgo-api.service';

import * as N from '../job.defines';
import { ComponentService } from '../../../service/component.service';
import { SimpleLibrary as _ } from 'ng-simple-library';
import { Subscription } from 'rxjs';
import { InfiniteScrollService } from '../../../../philgo-api/infinite-scroll';
import { JobEditComponent } from '../edit/job-edit.component';

@Component({
  selector: 'app-job-list-component',
  templateUrl: 'job-list.component.html',
  styleUrls: ['../../../scss/index.scss', './job-list.component.scss']
})

export class JobListComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {


  @Input() category;
  @Input() group_id = ''; // user domain to search jobs from.

  showSearch = false;
  forum: ApiForum = null;
  posts: Array<ApiPost> = [];
  postView: ApiPost = null;

  form: ApiPost = <ApiPost>{};
  provinces: Array<string> = [];
  cities: Array<string> = [];
  showCities = false;
  province = '';
  city = '';

  age_min = 18;
  age_max = 70;

  ageRange = {
    lower: this.age_min,
    upper: this.age_max
  };

  /**
   * Page nav
   */
  post_id = 'wanted';
  page_no = 1;
  limit = 48;
  noMorePosts = false;
  loading = false;
  // inifite scroll subscription
  infiniteScrollSubscription: Subscription = null;


  /**
   *
   */
  N = N;

  _ = _;


  mostSearch = {
    'Manila': {province: 'Metro Manila', city: 'Metro Manila - Manila'},
    'Cebu': {province: 'Cebu', city: 'Cebu'},
    'Angeles': {province: 'Pampanga', city: 'Pampanga - Angeles'},
    // 'Pampanga': {province: 'Pampanga', city: 'Pampanga'},
    //   'Metro Manila': { province: 'Metro Manila', city: 'Metro Manila' },
    //   'Baguio': { province: 'Benguet', city: 'Benguet - Baguio' },
    // 'Quezon': {province: 'Metro Manila', city: 'Metro Manila - Quezon'},
    // 'Mandaluyong': {province: 'Metro Manila', city: 'Metro Manila - Mandaluyong'},
    // 'Muntinlupa': {province: 'Metro Manila', city: 'Metro Manila - Muntinlupa'},
  };

  loader = {
    delete: false
  };

  //
  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly componentService: ComponentService,
              public philgo: PhilGoApiService,
              public scroll: InfiniteScrollService,
              public router: Router) {

    window['comp'] = this;
  }

  ngOnInit() {
  }

  ngOnChanges( event ) {
    console.log(event);
    if ( event['category'] && ! event['category']['firstChange'] ) {
      this.showSearch = true;
      this.onSearch();
    }
  }

  ngAfterViewInit() {
    // setTimeout(() => this.onClickPost(), 200);

    this.activatedRoute.paramMap.subscribe(params => {
      const idx = params.get('idx');
      setTimeout(() => {
        this.loadPage({view: idx});
      });
    });

    this.philgo.provinces().subscribe(provinces => {
      // console.log('provinces:: ', provinces);
      this.provinces = provinces;
      console.log('provinces: ', this.provinces);
    }, e => {
      this.componentService.alert(e);
    });

    // Which element do you want to watch for scroll?
    // update `section.post-list` as you need.
    this.infiniteScrollSubscription = this.scroll.watch('.layout-content', 500).subscribe(e => this.loadPage());
  }

  // Un-subscription or you may get multiple events.
  ngOnDestroy() {
    this.infiniteScrollSubscription.unsubscribe();
  }


  onSearch() {
    this.page_no = 1;
    this.posts = [];
    this.noMorePosts = false;
    this.loadPage();
  }


  loadPage(options: { view: string } = <any>{}) {
    console.log('loading', this.loading, 'nomoreposst', this.noMorePosts);
    if (this.loading || this.noMorePosts) {
      console.log('You are in the middle of loading or no more posts . just return');
      return;
    }
    const and = [];
    if (this.form[N.gender]) {
      and.push(`${N.gender}='${this.form[N.gender]}'`);
    }
    if (this.city) {
      and.push(`${N.city} LIKE '${this.city}%'`);
    }

    if (this.ageRange['lower'] > this.age_min || this.ageRange['upper'] < this.age_max) {
      const n = new Date();
      const min = n.getFullYear() - this.ageRange['lower'];
      const max = n.getFullYear() - this.ageRange['upper'];
      and.push(`${N.birthday}>=${max}0101 AND ${N.birthday}<=${min}1231`);
    }

    const req: ApiPostSearch = {
      post_id: this.post_id, page_no: this.page_no, group_id: this.group_id, limit: this.limit, deleted: 0
    };
    if (this.category) {
      req.category = this.category;
    }

    req.and = and.join(' AND ');
    if (options.view) {
      req.view = options.view;
    }
    console.log('re: ', req);
    // this.philgo.debug = true;

    // setTimeout(() => this.loading = true);
    this.loading = true;

    this.philgo.debug = true;
    this.philgo.postSearch(req).subscribe(search => {
      this.loading = false;
      console.log('search: ', search);
      this.page_no++;
      this.forum = search;
      if (search && search.view && search.view.idx) {
        this.postView = search.view;
        this.postView['show'] = true;
      }

      if (this.postView && this.postView.idx) {
        const pos = search.posts.findIndex(v => v.idx === this.postView.idx);
        if (pos !== -1) {
          search.posts.splice(pos, 1);
        }
      }

      this.posts = this.posts.concat(search.posts);


      if (!search.posts || !search.posts.length || search.posts.length < this.limit) {
        this.noMorePosts = true;
        return;
      }

    }, e => {
      this.loading = false;
      this.componentService.alert(e);
    });
  }

  onView(post: ApiPost) {
    console.log(post);
    if (this.postView && this.postView.idx && this.postView.idx === post.idx) {
      return;
    } else {
      post.show = !post.show;
      history.pushState({}, post.subject, `/job/${post.category}/${post.idx}`);
    }
  }

  /**
   * Opens Job edit box.
   * @param post  job post
   */
  onEdit(post: ApiPost) {
    console.log('onEdit', post);

    this.router.navigateByUrl(`/job-post/${post.idx}`);

  }

  onDelete(post: ApiPost) {
    console.log(post);

    if ( this.loader.delete ) {
      return;
    }
    this.componentService.deletePostWithMemberLogin(post).subscribe(res => {
      console.log('deletePostWithMemberLogin', res);
      if (res.role === 'yes') {

        this.loader.delete = true;
        this.philgo.postDelete({idx: post.idx}).subscribe(result => {
          console.log('postDelete:: ', result);

          if ( this.postView.idx  === post.idx ) {
            this.postView.idx = null;
            return;
          }
          const pos = this.posts.findIndex(p => p.idx === post.idx);
          console.log('pos: ', pos);
          if (pos !== -1) {
            this.posts.splice(pos, 1);
          }
          this.loader.delete = false;
        }, e => {
          this.loader.delete = false;
          this.componentService.alert(e);
        });
      }
    }, e => {
      this.componentService.alert(e);
    });


  }

  onClickProvince(o?: { province?: string, city?: string }) {
    if (o && o.province) {
      this.province = o.province;
    }
    console.log('onClickProvince:: ', this.province);
    if (this.province) {
      /**
       * Select entire province of the province by default by giving province name on city.
       */
      if (o && o.city) {
        this.city = o.city;
      } else {
        this.city = this.province;
      }
      this.getCities();
    }
    // }
  }

  getCities() {
    this.showCities = false;
    this.philgo.cities(this.province).subscribe(cities => {
      console.log('getCities:: ', this.city);
      this.cities = cities;
      this.showCities = true;
    }, e => {
      this.componentService.alert(e);
      this.showCities = false;
    });
  }

  get cityKeys() {
    return Object.keys(this.cities);
  }

  onClickCity() {
    console.log(this.city);
  }
}
