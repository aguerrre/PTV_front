import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../service/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public viewPass = false;
  public formSubmitted = false;

  public loginForm = this.fb.group({
    dni: ['', [Validators.required]],
    user: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public alertController: AlertController) { }

  ngOnInit() {
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.authService.login(this.loginForm.value).subscribe({
        next: (resp: any) => {
          localStorage.setItem('token', resp.data.token);
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          console.log(err);
          if (err.error.msg.tecnico) {
            this.showAlert('Error', err.error.msg.tecnico);
          } else {
              this.showAlert('Error', 'Ha ocurrido un error, consulte al administrador.');
          }
        }
      });
    }
  }

  notValidField(field: string): boolean {
    return this.loginForm.get(field)?.invalid && this.formSubmitted ? true : false;
  }
  changePassVisibility() {
    return this.viewPass ? this.viewPass = false : this.viewPass = true;
  }
  async showAlert(myHeader, myMessage) {

    const alert = await this.alertController.create({
      header: myHeader,
      message: myMessage,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

}
