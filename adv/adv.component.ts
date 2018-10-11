import { Component, OnInit, Input } from '@angular/core';
import { PhilGoApiService } from 'share/philgo-api/philgo-api.service';


@Component({
  selector: 'app-adv',
  templateUrl: './adv.component.html',
  styleUrls: ['./adv.component.scss']
})
export class AdvComponent implements OnInit {

  @Input() place = 'all';
  constructor(
    public philgo: PhilGoApiService
  ) {
    this.loadAdv();
  }

  ngOnInit() {
  }

  loadAdv() {


    const today = this.philgo.Ymd();
    this.philgo.debug = true;
    this.philgo.postQuery({
      fields: ` idx, subject, int_1, int_2, varchar_1, varchar_3, varchar_4, varchar_5 `,
      where: ` post_id='ads' AND varchar_1='${this.place}' AND int_2 >= ${today} AND no_of_first_image > 0 `,
      orderby: ` `,
      limit: 1
    }).subscribe(res => {
      console.log('postQuery: ', res);
    }, e => console.error(e));

  }

}
