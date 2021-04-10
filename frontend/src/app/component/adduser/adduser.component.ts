import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../api-service.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  userForm: FormGroup;
  obj={};
  id ='';
  Message = '';
  selectedFile = null;

  constructor(private apiService : ApiServiceService,private route: ActivatedRoute,private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email:['',Validators.required],
      phone: ['', Validators.required],
      image: ['', Validators.required],
    }); 
  }
  onSubmit() {
    const userForm: FormData = new FormData();
    userForm.append('image', this.selectedFile);
    userForm.append("firstname", this.userForm.value['firstname'],);
    userForm.append("lastname", this.userForm.value['lastname']);
    userForm.append("email", this.userForm.value['email'],);
    userForm.append("phone", this.userForm.value['phone']);
    userForm.append("url", 'adduser');

    this.apiService.call_api_post(userForm).subscribe({
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
  onFileSelected(e) {
    this.selectedFile = e && e.target.files.length > 0 ? e.target.files[0] : '';
}
  FadeOutMessage() {
    setTimeout( () => {
          this.Message = "";
        }, 1500);
   }
}
