import { Injectable } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PhilGoApiService, ApiPost } from '../../philgo-api/philgo-api.service';
import { DialogComponent } from './dialog/dialog.component';
import { PromptComponent } from './prompt/prompt.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';


export interface ModalData {
  title?: string;
  content: string;
  ok?: string; // Okay button for alert.
  yes?: string; //  For confirm, it will be 'Yes' button
  no?: string; // No button for confirm.
  maxWidth?: string;
  type?: 'alert' | 'confirm';
}


@Injectable()
export class ComponentService {


  dialogRef: MatDialogRef<DialogComponent> = null;

  constructor(
    private sanitizer: DomSanitizer,
    private readonly philgo: PhilGoApiService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }


  sanitizeData(data: ModalData) {
    if (!data.ok) {
      data.ok = 'OK';
    }
    if (!data.yes) {
      data.yes = 'YES';
    }
    if (!data.no) {
      data.no = 'NO';
    }
    if (data.content) {
      data.content = <any>this.sanitizer.bypassSecurityTrustHtml(data.content);
    }
    if (!data.maxWidth) {
      data.maxWidth = '800px';
    }
    if (!data.type) {
      data.type = 'alert';
    }
    return data;
  }

  /**
 * Show a alert modal box
 * @param data data to display on modal
 *
 * @return boolean of Observable
 *      true will be returned after close.
 */
  alert(data: ModalData): Observable<boolean> {
    this.sanitizeData(data);
    this.dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      maxWidth: data.maxWidth,
      data: data
    });
    return this.dialogRef.afterClosed();
  }


  // async alert(options: { header?: string, message: string , action?: string }) {
  //   if (!options) {
  //     return;
  //   }
  //   if (!options.action) {
  //     options.action = this.philgo.t({ en: 'OK', ko: '확인' });
  //   }

  //   options['type'] = 'alert';

  //   const dialogRef = this.dialog.open(DialogComponent, options);
  //   await dialogRef.afterClosed().toPromise().then( result => result ).catch( e => console.error(e) );
  // }


  // toast(options: { message: string , action: string }) {
  //   if (!options) {
  //     return;
  //   }

  //   if (!options.action) {
  //     options.action = this.philgo.t({ en: 'OK', ko: '확인' });
  //   }

  //   this.snackBar.open( options.message, options.action, {
  //     duration: 3000
  //   });

  // }

  // async checkPostUserPassword(post: ApiPost): Promise<string> {

  //   const dialogRef = this.dialog.open(PromptComponent, {
  //       header: this.philgo.t({ en: 'Password', ko: '비밀번호' }),
  //       message: this.philgo.t({ en: 'Please input password!', ko: '비밀번호를 입력하세요.' }),
  //       ok: this.philgo.t({ en: 'Ok', ko: '확인' }),
  //       no: this.philgo.t({ en: 'Cancel', ko: '취소' })
  //   });

  //   const re = await dialogRef.afterClosed().toPromise().then( result => result ).catch( e => this.alert(e));
  //   console.log('result: ', re, re.data, re.role);
  //   if (re.role && re.role === 'ok') {
  //     if ( re.role && re.input ) {
  //       return await this.philgo.postCheckPassword({ idx: post.idx, user_password: re.data.values.user_password }).toPromise()
  //         .then(res => res['user_password'])
  //         .catch(() => {
  //           this.alert({ message: this.philgo.t({ en: 'You have input wrong password.', ko: '비밀번호가 틀립니다.' }) });
  //           return '';
  //         });
  //     } else {
  //       this.alert({ message: this.philgo.t({ en: 'Please input password', ko: '비밀번호를 입력하세요.' }) });
  //     }
  //   }
  //   return '';
  // }

  // async deletePostWithMemberLogin(post: ApiPost) {

  //   const dialogRef = this.dialog.open(DialogComponent, {
  //       header: 'Delete Post #' . post.idx,
  //       message: 'Are you sure you want to delete this post?',
  //       yes: this.philgo.t({ en: 'Yes', ko: '확인' }),
  //       no: this.philgo.t({ en: 'Cancel', ko: '취소' }),
  //       type: 'confirm'
  //   });

  //   const re = await dialogRef.afterClosed().toPromise().then( result => result ).catch( e => this.alert(e));

  //   if (re.role === 'yes') {
  //     return await this.philgo.postDelete({ idx: post.idx }).toPromise().then(res => {
  //       console.log('delete success: ', res);
  //       post.subject = this.philgo.textDeleted();
  //       post.content = this.philgo.textDeleted();
  //       return 'success';
  //     }).catch(async e => {
  //       this.alert(e);
  //       return 'failed';
  //     });
  //   } else {
  //     return 'failed';
  //   }
  // }

  // async deletePostWithPassword(post: ApiPost) {

  //   const dialogRef = this.dialog.open(PromptComponent, {
  //     header: this.philgo.t({ en: 'Password', ko: '비밀번호' }),
  //     message: this.philgo.t({ en: 'Please input password!', ko: '비밀번호를 입력하세요.' }),
  //     ok: this.philgo.t({ en: 'Ok', ko: '확인' }),
  //     no: this.philgo.t({ en: 'Cancel', ko: '취소' }),
  //   });

  //   const re = await dialogRef.afterClosed().toPromise().then( result => result );

  //   if (re.role === 'ok') {
  //     return await this.philgo.postDelete({ idx: post.idx, user_password: re.data.values['user_password'] }).toPromise()
  //       .then(res => {
  //         console.log('delete success: ', res);
  //         post.subject = this.philgo.textDeleted();
  //         post.content = this.philgo.textDeleted();
  //         return 'success';
  //       }).catch(async e => {
  //         this.alert({
  //           message: this.philgo.t({ en: `Failed to delete: #reason`, ko: '글 삭제 실패: #reason' }, { reason: e.message })
  //         });
  //         return 'failed';
  //       });
  //   } else {
  //     return 'failed';
  //   }
  // }

}
