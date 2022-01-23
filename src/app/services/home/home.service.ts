import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data-service';
import {ServiceUrls} from '../../constants/serviceUrl';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private dataService: DataService) {
  }

/**
   * @method getLoggedUsers
   */
  public getLoggedUsers() {
    return this.dataService.callGetService(ServiceUrls.GET_LOGGED_USERS);
  }

  /**
     * @method getLoggedUsers
     */
    public changePassword(payload:any) {
      let realmId = ''+sessionStorage.getItem('realmId');;
      let id = this.getRealmIdFromState();
      let URL = ServiceUrls.PUT_CHANGE_PASSWORD+realmId+'/resetPassword/v1/'+id;
      console.log("id is {} and url is {}", id,URL);

      return this.dataService.callPutService(URL, payload);
    }


   public getRealmIdFromState() {
    let stateDB = sessionStorage.getItem('state');
    if(stateDB){
      const state = JSON.parse(stateDB);
      return state?.body.session_state;
    }
   }
}
