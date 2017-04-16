import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    MomentModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    MomentModule
  ]
})
export class SharedModule { }
