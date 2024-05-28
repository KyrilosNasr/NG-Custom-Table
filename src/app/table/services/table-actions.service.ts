import { Injectable } from '@angular/core';
import { TableActionsDetails } from '../interfaces/table-details.interface';
import { stateActionMapping } from '../utilities/action.constants';

@Injectable({
  providedIn: 'root'
})
export class TableActionsService {

  constructor() { }

  getActionsForState(stateId: number, availableActions: TableActionsDetails[]): TableActionsDetails[] {
    const allowedActionNames = stateActionMapping[stateId];
    
    if (!allowedActionNames) {
      console.error(`No actions defined for state with ID ${stateId}`);
      return [];
    }
    
    let actions = availableActions.filter(action => allowedActionNames.includes(action.actionName));        
    return actions
  }

}
