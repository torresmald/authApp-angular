import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  public authService = inject(AuthService)
  public fb = inject(FormBuilder)
  public router = inject(Router)

  public form: FormGroup = this.fb.group({
    email: ['jonathan@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  })

  public onSubmit(){
    const {email, password} = this.form.value    
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['dashboard']),
      error: (error) => {
        console.log(error);
        
        Swal.fire('Error', error, 'error')}
      
    })
  }

}
