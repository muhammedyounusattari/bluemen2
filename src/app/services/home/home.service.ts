import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data-service';
import { ServiceUrls } from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private dataService: DataService) {
  }

   /**
     * @method getLoggedUsers
     */
  public getLoggedUsers(): Observable<any> {
    const orgId = sessionStorage.getItem("orgId");
    return this.dataService.callGetService(ServiceUrls.GET_ORG_BASED_USER_LIST+'/'+orgId);
  }

  /**
     * @method getLoggedUsers
     */
  public changePassword(payload: any) {
    return this.dataService.callPutService(ServiceUrls.PUT_CHANGE_PASSWORD , payload);
  }

  public getSecurityQuestionList(){
    return this.dataService.callGetService(ServiceUrls.GET_SECURITY_QUESTIONS);
  }

  postSecurityQuestion(request: any): Observable<any> {
    return this.dataService.callPostService(ServiceUrls.POST_SECURITY_QUESTIONS, request);
}


  public getRealmIdFromState() {
    let stateDB = sessionStorage.getItem('state');
    if (stateDB) {
      const state = JSON.parse(stateDB);
      return state?.body.session_state;
    }
  }
}
