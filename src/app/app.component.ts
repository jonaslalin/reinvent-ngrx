import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';

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
          <div *ngIf="stack$ | async as stack; else emptyStack">
            <ul class="list-group" *ngIf="stack.length; else emptyStack">
              <li class="list-group-item" *ngFor="let item of stack">
                {{ item }}
              </li>
            </ul>
          </div>
          <ng-template #emptyStack>
            <p class="card-text">The stack is empty.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements AfterViewInit {
  stack$: Observable<string[]>;
  @ViewChild('newItem', { static: true })
  private newItem: ElementRef<HTMLInputElement>;

  constructor() {
    this.stack$ = of(['Item 3', 'Item 2', 'Item 1']);
  }

  ngAfterViewInit() {
    this.newItem.nativeElement.focus();
    this.newItem.nativeElement.value = 'Item 4';
  }

  push(newItem: string) {}

  pop() {}

  truncate() {}
}
