import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { GlobalModule } from '../global/global.module';




@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    GlobalModule,
  ],
  exports: [
    MaterialModule,
    GlobalModule,
  ]
})
export class SharedModule { }
