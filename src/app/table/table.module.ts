import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmartFormatPipe } from './pipes/SmartFormat.pipe';
import { DragDropAreaComponent } from './components/drag-drop-area/drag-drop-area.component';


@NgModule({
  declarations: [
    CustomTableComponent,
    SmartFormatPipe,
    DragDropAreaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports:[
    CustomTableComponent
  ],
})
export class TableModule { }
