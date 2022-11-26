import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../mateial/material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
	imports: [
		AuthRoutingModule,
		CommonModule,
		ReactiveFormsModule,
		MaterialModule,
	],
	declarations: [AuthComponent, LoginComponent, RegisterComponent],
})
export class AuthModule { }
