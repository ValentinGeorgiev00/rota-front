import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { UnAuthGuard } from './auth/guards/un-auth.guard';

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () =>
			import('./auth/auth.module').then((m) => m.AuthModule),
		canActivate: [UnAuthGuard]
	},
	{
		path: '',
		loadChildren: () =>
			import('./main/main.module').then((m) => m.MainModule),
		canLoad: [AuthGuard]
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
