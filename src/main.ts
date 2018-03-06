import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import './polyfills';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'rxjs/Rx';


enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
