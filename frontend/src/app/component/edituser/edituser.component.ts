import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../api-service.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {
  userForm: FormGroup;
  id ='';
  Message = '';
  obj={};
  user_detail={};
  selectedFile = null;
  constructor(private apiService : ApiServiceService,private route: ActivatedRoute,private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email:['',Validators.required],
      phone: ['', Validators.required],
      image :"" 
    }); 
    this.id = this.route.snapshot.paramMap.get('id');

    this.obj = {
      'url' : 'getUser/'+this.id

    }
    this.apiService.call_api_get(this.obj).subscribe({
      next: response => {
        if(response['status']){
          this.user_detail = response['data'];

          this.userForm.setValue({
            firstname: this.user_detail['first_name'],
            lastname: this.user_detail['last_name'],
            email: this.user_detail['email'],
            phone: this.user_detail['phone_number'] ,
            image: ""
          })
        }
      },
      error: error => {

      }
    });
  }
  onFileSelected(e) {
    this.selectedFile = e && e.target.files.length > 0 ? e.target.files[0] : '';
  }
  onSubmit() {
      const userForm: FormData = new FormData();
      userForm.append('image', this.selectedFile);
      userForm.append("firstname", this.userForm.value['firstname'],);
      userForm.append("lastname", this.userForm.value['lastname']);
      userForm.append("email", this.userForm.value['email'],);
      userForm.append("phone", this.userForm.value['phone']);
      userForm.append("url", 'updateUser/'+this.id);

    this.apiService.call_api_put(userForm).subscribe({
      next: data => {
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
