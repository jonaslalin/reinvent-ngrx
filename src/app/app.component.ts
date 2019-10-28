import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, mapTo, scan, startWith } from 'rxjs/operators';
import { Action } from './action';

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
              class="btn btn-danger mr-2"
              (click)="truncate()"
            >
              Truncate
            </button>
            <button type="button" class="btn btn-danger" (click)="reset()">
              Reset
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
export class AppComponent implements OnInit, AfterViewInit {
  stack$: Observable<string[]>;
  @ViewChild('newItem', { static: true })
  private newItem: ElementRef<HTMLInputElement>;

  private initialState = ['Item 3', 'Item 2', 'Item 1'];
  private push$ = new Subject<string>();
  private pop$ = new Subject<void>();
  private truncate$ = new Subject<void>();
  private reset$ = new Subject<void>();
  private action$: Observable<Action>;

  constructor() {}

  ngOnInit() {
    this.action$ = merge(
      this.push$.pipe(
        startWith(...this.initialState.map((_, i, a) => a[a.length - i - 1])), // reverse
        map(newItem => ({ type: '[Stack] Push', payload: newItem }))
      ),
      this.pop$.pipe(mapTo({ type: '[Stack] Pop' })),
      this.truncate$.pipe(mapTo({ type: '[Stack] Truncate' })),
      this.reset$.pipe(mapTo({ type: '[Stack] Reset' })) // can also initialize
    );

    this.stack$ = this.action$.pipe(
      scan(
        (state: string[], action: Action) => this.stackReducer(state, action),
        []
      )
    );
  }

  ngAfterViewInit() {
    this.newItem.nativeElement.focus();
    this.newItem.nativeElement.value = 'Item 4';
  }

  push(newItem: string) {
    this.push$.next(newItem);
  }

  pop() {
    this.pop$.next();
  }

  truncate() {
    this.truncate$.next();
  }

  reset() {
    this.reset$.next();
  }

  private stackReducer(state: string[], action: Action) {
    console.log('state:', state, 'action:', action);

    switch (action.type) {
      case '[Stack] Push':
        return [action.payload, ...state];
      case '[Stack] Pop':
        return state.slice(1);
      case '[Stack] Truncate':
        return [];
      case '[Stack] Reset':
        return this.initialState;
      default:
        return state;
    }
  }
}
