import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyCustomComponentComponent } from './my-custom-component/my-custom-component.component';

@NgModule({
  declarations: [
    AppComponent,
    MyCustomComponentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [
    AppComponent,
    MyCustomComponentComponent
  ]
})
export class AppModule { 

  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {

    const { injector } = this;

    // create custom elements from angular components
    const ngCustomElement = createCustomElement(MyCustomComponentComponent, { injector });

    // define in browser registry
    customElements.define('ng-el', ngCustomElement);

  }

}
