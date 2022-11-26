import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { MaterialModule } from './mateial/material.module';

@NgModule({
	declarations: [AppComponent, HeaderComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		MaterialModule,
		HttpClientModule,
	],
	providers: [
		{provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor, multi:true},
		{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor, multi:true}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
