import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HomeService} from 'src/app/services/home/home.service';


@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.html'
})
export class ChangePasswordComponent implements OnInit{

    public userName:string;
    public password:string;
    public newPassword:string;
    public confPassword:string;
    public securityQues1:any;
    public securityQues2:any;
    public answer1:string;
    public answer2:string;
    public securityQuesLst1:any = [];
    public securityQuesLst2:any = [];
    public passwordLength:string="fa fa-close";;
    public isUppercase:string="fa fa-close";;
    public isLowercase:string="fa fa-close";;
    public isNumber:string="fa fa-close";;
    public isSpecialChar:string="fa fa-close";;
    public passwordMatch:string = "fa fa-close";

    constructor(public homeService:HomeService) {

    }

   ngOnInit() {

    let username = sessionStorage.getItem('username');
    this.userName = username?username:'';
    this.securityQuesLst1 = ["--Select Question--","What is your pet's name?","Which city were you born in?","What was the make/model of your first car?","What is your favorite sports team? ","Which street did you grow up on?","Name of your favorite childhood friend?","What was your favorite food as a child?","What school did you attend for sixth grade?","In what city was your first job?","What was the last name of your first boss?"];
    this.securityQuesLst2 = ["--Select Question--","What was your favorite restaurant growing up?","What was your high school mascot?","What is your oldest cousin’s first name?","Your spouse/partner's mother's maiden name?","In what city did your parents meet?","Who was your favorite teacher in high school?","What was the licence plate number for your first car?","When you were young, what did you want to be when you grew up?","Who was your childhood hero?","Where was your best family vacation as a kid?"];

    }

    onSubmit(){

     this.validatePassword();

      let payload = {
                      "temporary": true,
                      "type": "password",
                      "value": this.newPassword
                    }
      this.homeService.changePassword(payload).subscribe((result)=>{
      });
    }

    isFieldInvalid(input:string){

    }


    validatePassword(){

        let value = this.newPassword;

        if(!value){
          return;
        }

        if(value.length>=12 && value.length<=50){
          this.passwordLength= "fa fa-check";
        } else {
          this.passwordLength = "fa fa-close";
        }

        let upperCaseCharacters = /[A-Z]/
         if (upperCaseCharacters.test(value) === false) {
           this.isUppercase="fa fa-close";
         } else {
          this.isUppercase = "fa fa-check";
         }

         let lowerCaseCharacters = /[a-z]+/g
         if (lowerCaseCharacters.test(value) === false) {
           this.isLowercase = "fa fa-close";
         } else {
           this.isLowercase = "fa fa-check";
         }


         let numberCharacters = /[0-9]+/g
         if (numberCharacters.test(value) === false) {
          this.isNumber = "fa fa-close";
         } else {
          this.isNumber = "fa fa-check";
         }

         let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
         if (specialCharacters.test(value) === false) {
          this.isSpecialChar = "fa fa-close";
         } else {
          this.isSpecialChar ="fa fa-check";
         }

    }

    passwordMatchCompare() {
    this.validatePassword();
    if(this.newPassword && this.confPassword ) {
          if(this.newPassword === this.confPassword){
            this.passwordMatch = "fa fa-check";
          } else {
            this.passwordMatch = "fa fa-close";
          }
        }
    }
}
