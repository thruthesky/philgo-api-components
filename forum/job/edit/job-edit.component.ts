import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { PhilGoApiService, ApiPost, ApiFile } from '../../../../philgo-api/philgo-api.service';
import { ComponentService } from '../../../service/component.service';
import { SimpleLibrary as _ } from 'ng-simple-library';

import * as N from './../job.defines';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['../../../scss/index.scss', './job-edit.component.scss']
})
export class JobEditComponent implements OnInit, AfterViewInit {

  @Input() data: ApiPost = <any>{};
  @Input() group_id = '';
  form: ApiPost = <ApiPost>{};

  month = null;
  day = null;
  year = null;

  provinces: Array<string> = [];
  cities: Array<string> = [];
  showCities = false;

  province = '';
  city = '';

  pageTitle = '';
  percentage = 0;
  fileCode = null;


  N = N;

  _ = _;

  minAge = new Date().getFullYear() - 17;


  constructor(private router: Router,
              public philgo: PhilGoApiService,
              public readonly componentService: ComponentService,
              public activatedRoute: ActivatedRoute
  ) {
    console.log('editComponent');
    this.philgo.provinces().subscribe(provinces => {
      // console.log('provinces:: ', provinces);
      this.provinces = provinces;
    }, e => {
      this.componentService.alert(e);
    });
  }

  ngOnInit() {
    if (this.philgo.isLoggedOut()) {
      this.componentService.alert({content: this.philgo.t({ko: '먼저 로그인하십시오.', en: 'Please sign-in first.'})});
      this.router.navigateByUrl('/job');
      return;
    }

    this.activatedRoute.paramMap.subscribe(params => {
      const idx = params.get('idx');
      if (idx) {
        this.philgo.postLoad(idx).subscribe(res => {
          console.log('postLoad', res);
          if ( !res ) {
            this.componentService.alert({content: this.philgo.t({ko: '소식이 없습니다.', en: 'Post doesnt exist.'})});
            this.router.navigateByUrl('/job');
            return;
          }
          if ( res.idx_member === this.philgo.myIdx() ) {
            this.data = res;
            this.form = this.data;
            this.pageTitle = this.philgo.t({en: `Job Editing ##no`, ko: `구인구직 수정 ##no`}, {no: this.data['idx']});

            if (this.data[N.province]) {
              this.province = this.data[N.province];
              this.city = this.data[N.city];
              this.getCities();
            }

            console.log('this.data[N.birthday]', this.data[N.birthday]);
            if (this.data[N.birthday]) {
              const b = '' + this.data[N.birthday];
              this.year = b.substr(0, 4);
              this.month = b.substr(4, 2);
              this.day = b.substr(6, 2);
            }
          } else {
            this.componentService.alert({content: this.philgo.t({ko: '이 게시물을 소유하고 있지 않습니다.', en: 'You dont own this post.'})});
            this.router.navigateByUrl('/job');
            return;
          }
        }, e => {
          this.componentService.alert(e);
        });
      } else {
        this.form.post_id = 'wanted';
        this.form[N.name] = this.philgo.myName();
        this.form[N.gender] = this.philgo.myGender();
        this.form[N.mobile] = this.philgo.myMobile();
        this.form[N.email] = this.philgo.myEmail();
        this.year = this.philgo.myBirthYear();
        this.month = this.philgo.add0(this.philgo.myBirthMonth());
        this.day = this.philgo.add0(this.philgo.myBirthDay());

        const forumName = this.philgo.forumName(this.data.post_id);
        const categoryName = this.philgo.forumName(this.data.post_id, this.data.category);
        this.pageTitle = `${forumName} >> ${categoryName}`;
      }
    });
  }

  ngAfterViewInit() {
    console.log('form: ', this.form);
    setTimeout(() => {
      if (!this.form.gid) {
        this.form.gid = _.randomString(19, this.philgo.myIdx());
        console.log(this.form.gid);
      }
    });
  }

  onSubmit() {

    if (!this.form.category) {
      return this.componentService.alert({content: this.philgo.t({ko: '직책을 선택하십시오.', en: 'Please choose Job Title.'})});
    }
    if (!this.form[N.name]) {
      return this.componentService.alert({content: this.philgo.t({ko: '이름을 입력하십시오.', en: 'Please input Name.'})});
    }
    if (!this.form[N.mobile]) {
      return this.componentService.alert({
        content: this.philgo.t({
          ko: '휴대 전화 번호를 입력하십시오.',
          en: 'Please input mobile number.'
        })
      });
    }
    if (!this.form[N.email]) {
      return this.componentService.alert({content: this.philgo.t({ko: '이메일을 입력하십시오.', en: 'Please input Email.'})});
    }
    if (!this.province) {
      return this.componentService.alert({
        content: this.philgo.t({
          ko: '지방을 선택하십시오.',
          en: 'Please choose a province.'
        })
      });
    }
    if (!this.city) {
      return this.componentService.alert({content: this.philgo.t({ko: '도시를 선택하십시오.', en: 'Please choose a city.'})});
    }
    if (!this.form[N.address]) {
      return this.componentService.alert({content: this.philgo.t({ko: '주소를 입력하십시오.', en: 'Please input address.'})});
    }
    if (!this.month) {
      return this.componentService.alert({
        content: this.philgo.t({
          ko: '태어난 달을 선택하십시오.',
          en: 'Please select birth month.'
        })
      });
    }
    if (!this.day) {
      return this.componentService.alert({
        content: this.philgo.t({
          ko: '태어난 일을 선택하십시오.',
          en: 'Please select birth day.'
        })
      });
    }
    if (!this.year) {
      return this.componentService.alert({
        content: this.philgo.t({
          ko: '태어난 년도를 선택하십시오.',
          en: 'Please select birth year.'
        })
      });
    }
    if (!this.form[N.gender]) {
      return this.componentService.alert({content: this.philgo.t({ko: '성별을 선택하십시오.', en: 'Please select gender.'})});
    }
    if (!this.form[N.experience]) {
      return this.componentService.alert({
        content: this.philgo.t({
          ko: '경력을 선택하십시오.',
          en: 'Please select year of experience.'
        })
      });
    }
    if (!this.form[N.intro]) {
      return this.componentService.alert({
        content: this.philgo.t({
          ko: '자기 소개를 입력하십시오.',
          en: 'Please input self introduction.'
        })
      });
    }
    // if (!this.form[N.link]) {
    //   return this.componentService.alert({
    //     content: this.philgo.t({ ko: '프로필 URL (페이스북 등) 을 입력하십시오.', en: 'Please input your profile link like facebook URL.' }) });
    // }

    if (this.form[N.link]) {
      if (this.form[N.link].indexOf('http://') === 0 || this.form[N.link].indexOf('https://') === 0) {
        // link is ok
      } else {
        return this.componentService.alert({
          content: this.philgo.t({
            ko: '잘못된 URL 링크입니다. 링크는 http:// 또는 https:// 로 시작해야합니다.',
            en: 'Malformed URL link. Link should start with http:// or https://'
          })
        });
      }
    }

    if (!this.form.files || this.form.files.length < 2) {
      return this.componentService.alert({
        content: this.philgo.t({
          ko: '모든 사진을 업로드하십시오.',
          en: 'Please upload required photo.'
        })
      });
    }


    /**
     * Pass job category
     */
    // this.form.category = this.data.category;

    //

    this.form[N.birthday] = this.year + this.month + this.day;


    this.form[N.province] = this.province;
    this.form[N.city] = this.city;

    this.form.group_id = this.group_id;
    /**
     * Edit
     */
    if (this.form.idx) {
      this.philgo.postEdit(this.form).subscribe(res => {
        this.router.navigateByUrl(`/job/${this.form.category}/${this.form.idx}`);
      }, e => {
        this.componentService.alert(e);
      });
    } else {
      /**
       * Create
       */
      this.philgo.postCreate(this.form).subscribe(res => {
        console.log('create res: ', res);
        this.router.navigateByUrl(`/job/${this.form.category}/${this.form.idx}`);
      }, e => {
        this.componentService.alert(e);
      });
    }
  }


  onDelete() {
    this.philgo.postDelete({idx: this.form.idx}).subscribe(res => {
      console.log('delete: res', res);
      alert('delete ok');
    }, e => this.componentService.alert(e));
  }


  onChangeFile(event: Event, code: string) {
    const files = <any>event.target['files'];
    this.onUpload(files, code);
  }

  onUpload(files: FileList, code: string) {

    this.fileCode = code;

    console.log('files: ', files);
    if (files === void 0 || !files.length || files[0] === void 0) {
      const e = {code: -1, content: this.philgo.t({en: 'Please select a file', ko: '업로드 할 파일을 선택해주세요.'})};
      // this.componentService.alert(e);
      return;
    }

    this.philgo.fileUpload(files, {gid: this.form.gid, code: code}).subscribe(res => {
      if (typeof res === 'number') {
        console.log('percentage: ', res);
        this.percentage = res;
      } else {
        console.log('file success: ', res);
        this.insertUploadedPhoto(res);
        this.percentage = 0;
      }
    }, e => {
      console.error(e);
      this.componentService.alert(e);
      this.percentage = 0;
    });
  }

  /**
   * Insert upload photo into this.form.files array.
   * @param file upload file
   */
  insertUploadedPhoto(file: ApiFile) {
    if (!this.form.files || !this.form.files.length) {
      this.form.files = [];
      this.form.files.push(file);
    } else {
      const pos = this.form.files.findIndex(v => v.code === file.code);
      console.log('src: ', file, 'post: ', pos);
      if (pos !== -1) {
        this.form.files.splice(pos, 1, file);
      } else {
        this.form.files.push(file);
      }
    }
    console.log('file list:', this.form.files);
  }


  /**
   * Returns the src of uploaded photo
   * @param code code of uploaded photo
   */
  src(code): string {
    const src = this.philgo.getSrc(this.form.files, code);
    if (src) {
      return src;
    } else {
      return this.philgo.anonymousPhotoURL;
    }
  }


  onClickProvince() {
    console.log('onClickProvince:: ', this.province);
    if (this.province) {
      // this.city = this.province;
      this.getCities();
    }
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
    const keys = Object.keys(this.cities);
    keys.splice(0, 1);
    return keys;
  }

  onClose() {
    this.router.navigateByUrl('/job');
  }


}

