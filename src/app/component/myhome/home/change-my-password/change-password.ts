import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HomeService} from 'src/app/services/home/home.service';
import { ToastrService } from 'ngx-toastr';


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

    constructor(public homeService:HomeService,
                private toastr: ToastrService) {
    }

   ngOnInit() {

    let username = sessionStorage.getItem('username');
    this.userName = username?username:'';
    this.securityQuesLst1 = [];
    this.securityQuesLst2 = [];

    this.homeService.getSecurityQuestionList().subscribe((result)=>{
            if (result) {
              this.securityQuesLst1 = result.body.question1;
              this.securityQuesLst2 = result.body.question2;
            }
         /* },
          (error: any) => {
            const errorResponse = JSON.parse(error.error);
            this.toastr.error(errorResponse.message, '', {
              timeOut: 5000,
              closeButton: true
            });
          });*/
        });

    }

    onSubmit(){

     this.validatePassword();

      let payload = {
                      "password": this.password,
                      "confPassword": this.confPassword,
                      "securityQuestion1":this.securityQues1,
                      "securityQuestion2":this.securityQues2,
                      "securityAnswer1":this.answer1,
                      "securityAnswer2":this.answer2
                    }
      this.homeService.changePassword(payload).subscribe((result)=>{
      debugger;
      alert(result);
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
