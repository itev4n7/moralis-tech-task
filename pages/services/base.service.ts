import { APIRequestContext } from 'playwright/test';

export abstract class BaseService {
  readonly request;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
}
