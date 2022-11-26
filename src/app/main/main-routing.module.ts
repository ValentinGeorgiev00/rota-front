import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarCreateComponent } from './components/car-create/car-create.component';
import {AdminGuard} from './guards/admin.guard'

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		children: [
			{
				path: '',
				component: DashboardComponent,
			},
			{
				path: 'cars',
				children: [
					{
						path: '',
						component: CarListComponent,
					}
					,
					{
						path: 'create',
						component: CarCreateComponent,
						canActivate: [AdminGuard]
					}
				]
			},
			{
				path: 'cars',
				component: CarListComponent,
				children: []
			},
		]
	},
	{
		path: '**',
		redirectTo: '',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MainRoutingModule { }
