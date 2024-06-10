import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableModule } from './table/table.module';
import { HomeComponent } from './home/home.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserFromComponent } from './user-from/user-from.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateFormatDirective } from './user-from/directives/date-format.directive';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserFromComponent,
    DateFormatDirective
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
