import { NgModule } from "@angular/core";
import { MainRoutingModule } from "./main-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../mateial/material.module";
import { CommonModule } from "@angular/common";
import { MainComponent } from "./main.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HttpClientModule } from "@angular/common/http";
import { CarListComponent } from "./components/car-list/car-list.component";
import { CarCreateComponent } from './components/car-create/car-create.component';
import { TwoDecimalNumberDirective } from "./utils/decimal.directive";

@NgModule({
	imports: [MainRoutingModule, MaterialModule, ReactiveFormsModule, CommonModule, HttpClientModule],
	declarations: [MainComponent, DashboardComponent, CarListComponent, CarCreateComponent, TwoDecimalNumberDirective],
})
export class MainModule { }

