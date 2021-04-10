import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../api-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit {
  id ='';
  obj={};
  user_detail={};
  image_src='';
  constructor(private apiService : ApiServiceService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.obj = {
      'url' : 'getuser/'+this.id

    }
    this.apiService.call_api_get(this.obj).subscribe({
      next: response => {
        if(response['status']){
          this.user_detail = response['data'];
          this.image_src=response['data']['image']['url']
          
        }
      },
      error: error => {

      }
    });
  }

}
