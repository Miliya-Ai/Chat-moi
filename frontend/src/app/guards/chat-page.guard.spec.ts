import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ChatPageGuard } from './chat-page.guard';
import {HttpClientModule} from "@angular/common/http";

describe('chatPageGuard', () => {
  //let garde = typeof ChatPageGuard;
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ChatPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
        //imports: [HttpClientModule],
    });
    //garde = TestBed.inject(ChatPageGuard);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
