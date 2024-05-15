import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './components/custom-table/custom-table.component';



@NgModule({
  declarations: [
    CustomTableComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    CustomTableComponent
  ],
})
export class TableModule { }
