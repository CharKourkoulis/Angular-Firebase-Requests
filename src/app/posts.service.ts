import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from './app.component';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = {
      title: title,
      content: content
    };

    this.http
    .post(
      'https://httprequests-b74b1.firebaseio.com/posts.json',
      postData
    )
    .subscribe(responseData => {
      console.log(responseData);
    },
      err => {
        this.error.next(err.message);
      });
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>('https://httprequests-b74b1.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({"Custom-Header": 'Hello'}),
        params: new HttpParams().set('print', 'pretty')
      }
    )
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for(const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray .push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(error => {
          return throwError(error);
        })
      );

  }

  deletePosts() {
    return this.http.delete('https://httprequests-b74b1.firebaseio.com/posts.json');
  }

}
