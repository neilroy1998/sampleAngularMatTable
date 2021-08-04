import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatTableModule } from "@angular/material/table";

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";
import { Table2Component } from './table2/table2.component';

@NgModule({
  declarations: [
    AppComponent,
    Table2Component
  ],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatButtonModule,
		MatSortModule,
		FormsModule
	],
  providers: [
  	MatTableModule
  ],
  bootstrap: [Table2Component]
})
export class AppModule { }
