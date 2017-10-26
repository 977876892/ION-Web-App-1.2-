import {PollyfillDriver} from './PolyfillDriver';
import {Driver} from './Driver';
import {MemoryStorage} from './MemoryStorage';
import {CookieStorage} from './CookieStorage';

export const DRIVERS = Object.freeze({
  COOKIE: new Driver(new CookieStorage()),
  LOCAL: new PollyfillDriver(localStorage),
  MEMORY: new PollyfillDriver(new MemoryStorage()),
  SESSION: new PollyfillDriver(sessionStorage),
});
