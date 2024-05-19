import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmartFormatPipe } from './pipes/SmartFormat.pipe';



@NgModule({
  declarations: [
    CustomTableComponent,
    SmartFormatPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    CustomTableComponent
  ],
})
export class TableModule { }
