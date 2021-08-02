import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ReactiveFormsModule} from "@angular/forms";
import { MatTableModule } from "@angular/material/table";

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    AppComponent
  ],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatButtonModule,
		MatSortModule
	],
  providers: [
  	MatTableModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
