import { Component, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  title = 'firebase-demo';
  courses$: any[] = [];
  course$: any;
  subscription: Subscription | undefined;
  authors$ : any

  constructor(private db : AngularFireDatabase) {
    this.getCourses();
    this.course$ = db.object('/courses/1').valueChanges()
    this.authors$ = db.object('/authors/1').valueChanges()
  }


/**
 * This returns list of course from firebase realtime database
 * This means, if something changes on DB, by eny other user, this will automatically be updated
 * Problem is memory leak, so we should unsubscribe from this once we leave the page.
 */
  getCourses() {
    this.subscription = this.db.list('/courses')
      .snapshotChanges()
      .pipe(
      )
      .subscribe(courses => {
        this.courses$ = courses.map((course) => course.payload.val());
        console.log(this.courses$); // Optional: to see the data in the console
      });
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe()

  }

  add(course: HTMLInputElement){
    this.courses$.push({name: course.value,
       price: 100, isLive: true,
       sections : [
            {title: 'Components'},
            {title: 'Directives'},
            {title: 'Template'},
    ]})
    course.value = '';
  }
}
