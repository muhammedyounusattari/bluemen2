import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class Config {
  getHeader() {
    const state = sessionStorage.getItem("state");
    let access_token = "";
    if (state) {
      access_token = JSON.parse(state)?.access_token;
    } else {
      //here we need to add redirect call, if the session expired
      // alert("Please login again, your session got expired");
      return;
    }

    return new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
       "Accept": "application/json" ,
      'Authorization': 'Bearer '+ access_token
    });
  }
}
