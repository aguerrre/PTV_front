import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';

import { AuthService } from '../service/auth.service';
import { FormsService } from '../service/forms.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  public signaturePad: SignaturePad;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('canvas') canvasElement: ElementRef;
  public signatureImg: string;
  public formSubmitted = false;
  public signatureValid = false;
  public loading = false;

  constructor(
    public authService: AuthService,
    private formsService: FormsService,
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.canvasElement.nativeElement);
  }

  /**
   * Cierra la sesión del usuario y revoca el token en el backend.
   */
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.showAlert('Cierre de sesión', `El usuario ${this.authService.user.name} cerró sesión.`);
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      },
      error: () => this.showAlert('Error', 'Ha ocurrido un error. Consulte al administrador.')
    });
  }

  /** Métodos para manejar los eventos que muestran el trazo dibujado en el canvas */
  startDrawing(event: Event) {
    this.signatureValid = true;
  }
  moved(event: Event) { }

  /**
   * Método que limpia el canvas
   */
  clearPad() {
    this.signaturePad.clear();
  }

  /**
   * Método que guarda la imagen y llama al servicio para mandar el pdf.
   */
  savePad() {
    this.formSubmitted = true;
    if (this.signaturePad.isEmpty()) {
      this.signatureValid = false;
      return;
    } else {
      const base64Data = this.signaturePad.toDataURL();
      this.signatureImg = base64Data;
      this.loading = true;
      this.sendForm();
    }
  }

  private sendForm() {
    if (this.signatureValid === true && this.signatureImg !== null) {
      this.formsService.createForm(this.signatureImg).subscribe({
        next: (resp: any) => {
          this.loading = false;
          this.showAlert('Email enviado', `Documento enviado a ${resp.to}. Compruebe su bandeja de entrada`);
        },
        error: (err) => {
          this.loading = false;
          if (err.msg) {
            this.showAlert('Error', err.msg);
          } else {
            this.showAlert('Error', 'Ha ocurrido un error, consulte al administrador.');
          }
        }
      });
      this.formSubmitted = false;
      this.signatureValid = false;
      this.clearPad();
    } else {
      this.showAlert('Error', 'Ha ocurrido un error al enviar el email. Compruebe los datos introducidos.');
    }
  }

  /**
   * Muestra mensajes al usuario.
   *
   * @param myHeader
   * @param myMessage
   */
  private async showAlert(myHeader, myMessage) {

    const alert = await this.alertController.create({
      header: myHeader,
      message: myMessage,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

}
