import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const materialModules = [
	MatCardModule,
	MatInputModule,
	MatButtonModule,
	MatTableModule,
	MatSnackBarModule,
	MatDialogModule,
	MatSelectModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatIconModule,
	MatAutocompleteModule,
];

@NgModule({
	exports: [...materialModules],
	imports: [...materialModules],
})
export class MaterialModule { }
