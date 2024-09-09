import dotenv from "dotenv";
import MockDate from "mockdate";
import fetch from "node-fetch";
import { server } from "src/mocks/server";

import "@testing-library/jest-dom";

// @ts-expect-error
global.fetch = fetch;
// @ts-expect-error
global.Headers = fetch.Headers;
// @ts-expect-error
global.Request = fetch.Request;
// @ts-expect-error
global.Response = fetch.Response;

// Establish API mocking before all tests.
beforeAll(() => {
  MockDate.set("2020-04-24");
  server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => {
  MockDate.reset();
  server.close();
});

dotenv.config({ path: ".env.local" });
