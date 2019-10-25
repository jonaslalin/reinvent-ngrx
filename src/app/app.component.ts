import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <div class="card mt-5">
        <h1 class="card-header">Reinvent NgRx</h1>
        <div class="card-body">
          <h2 class="card-title">Stack fun<i>(ctionality)</i></h2>
          <div class="form-inline mb-3">
            <div class="form-group mr-2">
              <label for="newItem" class="mr-2">New item</label>
              <input
                type="text"
                class="form-control"
                id="newItem"
                #newItem
                (keyup.enter)="push(newItem.value)"
              />
            </div>
            <button
              type="button"
              class="btn btn-primary mr-2"
              (click)="push(newItem.value)"
            >
              Push
            </button>
            <button
              type="button"
              class="btn btn-secondary mr-2"
              (click)="pop()"
            >
              Pop
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              (click)="truncate()"
            >
              Truncate
            </button>
          </div>
          <div *ngIf="notEmpty$ | async; else empty">
            <ul class="list-group">
              <li class="list-group-item" *ngFor="let item of stack$ | async">
                {{ item }}
              </li>
            </ul>
          </div>
          <ng-template #empty>
            <p class="card-text">The stack is empty.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements AfterViewInit {
  stack$: Observable<string[]>;
  notEmpty$: Observable<boolean>;
  @ViewChild('newItem', { static: true })
  private newItem: ElementRef<HTMLInputElement>;

  constructor() {
    this.stack$ = of(['Item 3', 'Item 2', 'Item 1']);

    this.notEmpty$ = this.stack$.pipe(map(stack => stack.length > 0));
  }

  ngAfterViewInit() {
    this.newItem.nativeElement.focus();
  }

  push(newItem: string) {}

  pop() {}

  truncate() {}
}
