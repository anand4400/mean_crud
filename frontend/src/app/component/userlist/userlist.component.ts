import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../api-service.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  Message = '';
  obj = {};
  all_list=[];
  constructor(private apiService : ApiServiceService,) { }

  ngOnInit(): void {
    this.obj = {
      'url' : 'getuser'
    }
    this.apiService.call_api_get(this.obj).subscribe({
      next: response => {

        if(response['status']){
          this.all_list = response['data'];
        }
      },
      error: error => {
        this.Message = "Network error! Try again Later";
      }
    });
  }
  deleteuser(ID:any){
    this.obj = {
      'url' : 'deleteUser/'+ID
    }
    this.apiService.call_api_delete(this.obj).subscribe({
      next: data => {
          this.ngOnInit();
          this.Message =data['data'];
          this.FadeOutMessage();
      },
      error: error => {

        this.Message = "Internal Server Error! Try again later";
        this.FadeOutMessage();
      }
    });

  }
  
  FadeOutMessage() {
    setTimeout( () => {
          this.Message = "";
        }, 1500);
   }
}
