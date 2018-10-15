import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PhilGoApiService, ApiPost } from 'share/philgo-api/philgo-api.service';


@Component({
  selector: 'app-adv',
  templateUrl: './adv.component.html',
  styleUrls: ['./adv.component.scss']
})
export class AdvComponent implements OnInit, AfterViewInit {

  @Input() design: 'title-up' | 'title-bottom' = 'title-bottom';
  @Input() code: string;
  @Input() place = 'all';
  post: ApiPost;
  constructor(
    public philgo: PhilGoApiService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadAdv();
  }

  loadAdv() {

    const today = this.philgo.Ymd();
    let where = `post_id='ads'`;
    if ( this.code ) {
      where += ` AND access_code = '${this.code}' `;
    } else {
      where += ` AND varchar_1='${this.place}' AND int_2 >= ${today} AND no_of_first_image > 0 `;
    }

    this.philgo.debug = true;
    this.philgo.postQuery({
      fields: ` idx, gid, subject, int_1, int_2, varchar_1, varchar_3, varchar_4, link `,
      where: where,
      orderby: ``,
      limit: 1
    }).subscribe(res => {
      // console.log('postQuery: ', res);
      if (res && res.length) {
        this.post = res[0];
      }
    }, e => console.error(e));

  }

}
