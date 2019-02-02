import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateDisplayService {

  constructor() {
  }

  parseDate(date: string): string {
    return moment(date).format('DD.MM.YY HH:mm');
  }
}
