import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContainerComponent } from './components/container/container.component';
import { AddContainerComponent } from './components/add-container/add-container.component';
import { AlertModule } from './_alert';
import { MoveContainerComponent } from './components/move-container/move-container.component';
import { AddinentoryComponent } from './components/addinentory/addinentory.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    AddContainerComponent,
    MoveContainerComponent,
    AddinentoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
