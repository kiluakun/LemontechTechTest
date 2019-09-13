import { Component, OnInit } from '@angular/core';
import { BasicAuthService } from './services/basic-auth.service';
import { StepOneResponse, ErrorResponse } from './models/response';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title:String = 'Rabbit Guru';
  rabbitLogo:String  = '../assets/img/logo.png';
  thisIsMe:String = 'sebastian.segovia.urtubia@gmail.com';
  magicPassword:String = 'c2ViYXN0aWFuLnNlZ292aWEudXJ0dWJpYUBnbWFpbC5jb20=';
  stepOneResponse:StepOneResponse;
  currentStepResults:String = '';
  isStepOneEnabled:boolean = true;
  isStepTwoEnabled:boolean = false;
  isStepThreeEnabled:boolean = false;
  errorResponse:ErrorResponse;
  awfulError:String;
  teapot:String = '../assets/img/teapot2.gif';

  constructor(
    private service: BasicAuthService
  ) {}

  ngOnInit() {}

  stepOne(){
    this.title = 'Currently asking the bunny!!';
    this.currentStepResults = 'heee hooooo click click click';
    this.service.stepOne(this.thisIsMe, this.magicPassword).subscribe((data: StepOneResponse) => {
      this.stepOneResponse = data;
      this.isStepOneEnabled = false;
      this.isStepTwoEnabled = true;
    });
  }

  stepTwo(){
    this.currentStepResults = 'heee hooooo click click click';
    let userToUpdate:User = new User();
    userToUpdate.id = 5;
    userToUpdate.name = 'lemontech';
    this.service.stepTwo(this.thisIsMe, this.magicPassword, userToUpdate).subscribe((data: any) => {
      if(data !== undefined){
        this.isStepOneEnabled = false;
        this.isStepTwoEnabled = false;
        this.isStepThreeEnabled = true;
      }
      else{
        this.resetSteps();
        this.awfulError = `
        Update fallido, normalmente se emplea PUT como verbo de 
        actualizacion de elementos individuales, y su payload es 
        el resultado final, es decir, el objeto actualizado. 
        Desconozco el payload, creo que por eso mi update falla :C.
        Intente los siguientes payloads, basandome en las 
        instrucciones recibidas en el paso previo:
        
        {
          "recurso":{
            "user": {
              "id":"5",
              "name": "lemontech"
            }
          }
        }
        
        {
          "recurso":{
            "user": {
              "name": "lemontech"
            }
          }
        }
        
        {
          "resource":{
            "user": {
              "id":"5",
              "name": "lemontech"
            }
          }
        }
        
        {
          "resource":{
            "user": {
              "name": "lemontech"
            }
          }
        }
        
        {
          "user": {
            "name": "lemontech"
          }
        }
        
        {
          "user": {
            "id": 5,
            "name": "lemontech"
          }
        }
        
        {
          "id": 5,
          "name": "lemontech"
        }
        
        Luego hice caso al 418, y me fui a tomar un te :C`;
      }
    });
  }

  resetSteps(){
    this.isStepOneEnabled = true;
    this.isStepTwoEnabled = false;
    this.isStepThreeEnabled = false;

    this.stepOneResponse = null;
  }
}
