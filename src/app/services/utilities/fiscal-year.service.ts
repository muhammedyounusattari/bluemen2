import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root',
})
export class FiscalYearService {
  constructor(private dataService: DataService) {}

  /**
   * @method updateFiscalYear
   * @param request
   */
  public updateFiscalYear(request: any): Observable<any> {
    return this.dataService.callPostService(
      ServiceUrls.UPDATE_FISCAL_YEAR,
      JSON.stringify(request)
    );
  }
}
