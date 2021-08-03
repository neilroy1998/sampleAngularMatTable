import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {v4 as uuidv4} from 'uuid';

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
	renderedRows;
	isEditing: boolean = false;

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
		if (row.status === "DISABLED") return true;
		return row.invalid;
	}

	submit(row: FormGroup, i: number) {
		row.disable();
		console.log(i);
		console.log(row.getRawValue());
	}

	ngOnInit() {
		this.tableFormGroup = this.fb.group({
			rows: this.fb.array([])
		});

		this.getData("../assets/data/data.json").then((res) => {
			this.setRows(true);
		});

		/*setTimeout(() => {
			this.getData("../assets/data/data2.json").then((res) => {
				this.setRows(true);
			});
		}, 5000)*/
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

		this.tableData.connect().subscribe(d => this.renderedRows = d);
	}

	ac2fa(grp: AbstractControl): FormArray {
		return grp as FormArray;
	}

	getRows(row: schoolMarks): FormGroup {
		return this.fb.group({
			id: [{value: row ? row.id : uuidv4(), disabled: true}, Validators.required],
			name: [{value: row ? row.name : "", disabled: true}, Validators.required],
			subject: [{value: row ? row.subject : "", disabled: true}],
			marks: [{value: row ? row.marks : 0, disabled: true}, Validators.min(40)],
			passed: [{value: row ? row.passed : false, disabled: false}, Validators.requiredTrue],
		})
	}

	addRow() {
		const formCtrl = this.tableFormGroup.get('rows') as FormArray;
		formCtrl.push(this.getRows(null));
		this.tableData._updateChangeSubscription();
	}

	logData() {
		console.log(this.tableData.data);
		console.log(this.tableFormGroup.getRawValue());
	}

	edit(row: FormGroup, i) {
		if (row.enabled) {
			row.disable();
			this.isEditing = false;
		}
		else if (row.disabled) {
			row.enable();
			this.isEditing = true;
		}
	}

	delete(row, i) {
		let formCtrl = this.tableFormGroup.get('rows') as FormArray;
		let ix: number;
		formCtrl.value.find((val, i) => {
			if (val.id === row.value.id) {
				ix = i;
				return;
			}
		});

		console.log(ix);

		formCtrl.removeAt(ix);
		this.tableData._updateChangeSubscription();
	}

	enable(row, i, column: string) {
		console.log(row.getRawValue())
		row.get(column).enable();
		console.log(row.getRawValue())
	}
}
