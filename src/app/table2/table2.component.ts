import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import { v4 as uuidv4 } from 'uuid';


interface schoolMarks {
	id: String,
	name: String,
	subject: String,
	marks: number,
	passed: boolean
}

@Component({
	selector: 'app-table2',
	templateUrl: './table2.component.html',
	styleUrls: ['./table2.component.css']
})
export class Table2Component implements OnInit {

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('matTableSchool') matTableSchool: MatTable<any>;

	data: schoolMarks[];
	tableData: MatTableDataSource<any>;

	displayedCols: String[] = [
		"action",
		"name",
		"subject",
		"marks",
		"passed"
	];

	tableFormGroup: FormGroup;

	subscription: Subscription[] = [];

	constructor(private fb: FormBuilder,
				private cdr: ChangeDetectorRef) {
	}

	getData(location) {
		return fetch(location).then(res => res.json()).then((res: schoolMarks[]) => {
			this.data = res;
		})
	}

	any2Int(ctrl: any): schoolMarks {
		return ctrl as schoolMarks;
	}

	isInvalid(row: FormGroup): boolean {
		return row.invalid;
	}

	submit(row: FormGroup, i: number) {
		console.log(i);
		console.log(row.value);
	}

	ngOnInit() {
		this.tableFormGroup = this.fb.group({
			rows: this.fb.array([])
		});

		this.getData("../assets/data/data.json").then((res) => {
			this.setRows(true);
		});

		setTimeout(() => {
			this.getData("../assets/data/data2.json").then((res) => {
				this.setRows(true);
			});
		}, 5000)
	}

	setRows(clear = false) {
		const formCtrl = this.tableFormGroup.get('rows') as FormArray;

		if (clear) formCtrl.clear();

		console.log(formCtrl.value)

		this.data.forEach((d) => {
			formCtrl.push(this.getRows(d));
		});
		this.tableData = new MatTableDataSource<any>((<FormArray>this.tableFormGroup.get("rows")).controls);
		this.tableData.sortingDataAccessor = (item, property) => {
			if (typeof item.value[property] === "string") return item.value[property].toLowerCase();
			else return item.value[property];
		}
		this.tableData.sort = this.sort;
	}

	ac2fa(grp: AbstractControl): FormArray {
		return grp as FormArray;
	}

	getRows(row: schoolMarks): FormGroup {
		return this.fb.group({
			id: [row ? row.id : uuidv4(), Validators.required],
			name: [row ? row.name : "", Validators.required],
			subject: [row ? row.subject : ""],
			marks: [row ? row.marks : 0, Validators.min(40)],
			passed: [row ? row.passed : false, Validators.requiredTrue],
		})
	}

	addRow() {
		const formCtrl = this.tableFormGroup.get('rows') as FormArray;
		formCtrl.push(this.getRows(null));
		this.tableData._updateChangeSubscription();
	}

	logData() {
		console.log(this.tableData.data);
		console.log(this.tableFormGroup.value);
	}

}
