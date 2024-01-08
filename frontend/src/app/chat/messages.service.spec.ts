import { TestBed } from "@angular/core/testing";

import { MessagesService } from "./messages.service";
import {HttpClientModule} from "@angular/common/http";

describe("MessagesService", () => {
  let service: MessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(MessagesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
