import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { User } from '../../services/auth/user';
import { UserService } from '../../services/user/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  errorMessage:String="";
  user?:User;
  userLoginOn:boolean=false;
  editMode:boolean=false;

  userProfile=this.formBuilder.group({
    id:[''],
    lastname:['',Validators.required],
    firstname:['', Validators.required],
    picture:['',Validators.required]
  })

  constructor(private userService:UserService, private formBuilder:FormBuilder, private loginService:LoginService  ){
    this.userService.getUser(environment.userId).subscribe({
      next: (userData) => {
        this.user=userData;
        this.userProfile.controls.id.setValue(userData.id.toString());
        this.userProfile.controls.firstname.setValue( userData.firstname);
        this.userProfile.controls.lastname.setValue( userData.lastname);
        this.userProfile.controls.picture.setValue( userData.picture);
      },
      error: (errorData) => {
        this.errorMessage=errorData
      },
      complete: () => {
        console.info("User Data ok");
      }
    })

    this.loginService.userLoginOn.subscribe({
      next:(userLoginOn) => {
        this.userLoginOn=userLoginOn;
      }
    })
    
  }

  get firstname()
  {
    return this.userProfile.controls.firstname;
  }

  get lastname()
  {
    return this.userProfile.controls.lastname;
  }

  get picture()
  {
    return this.userProfile.controls.picture;
  }

  savePersonalDetailsData()
  {
    if (this.userProfile.valid)
    {
      this.userService.updateUser(this.userProfile.value as unknown as User).subscribe({
        next:() => {
          this.editMode=false;
          this.user=this.userProfile.value as unknown as User;
        },
        error:(errorData)=> console.error(errorData)
      })
    }
  }
}
