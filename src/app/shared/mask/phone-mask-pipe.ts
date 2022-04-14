import { Pipe, PipeTransform } from '@angular/core';
  
@Pipe({name: 'phoneMask'})
export class PhoneMaskPipe implements PipeTransform {

  constructor(){}
   
  transform(currentValue: any ,value: any) {
     let finalVal='';
    if(value){
      finalVal = currentValue.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
    }
    if(finalVal == "() -"){
      finalVal = '';
    }
    return finalVal;
  }
   
}