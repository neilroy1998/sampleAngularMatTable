import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";

interface schoolMarks {
	name: String,
	subject: String,
	marks: number,
	passed: boolean
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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

	getData() {
		return fetch("../assets/data/data.json").then(res => res.json()).then((res: schoolMarks[]) => {
			this.data = res;
		})
	}

	any2Int(ctrl: any): schoolMarks {
		return ctrl as schoolMarks;
	}

	logger(i: number) {
		for (let i = 0; i < this.tableData.data.length; i++) {
			this.subscription.forEach((sub) => {
				sub.unsubscribe();
			})
		}

		const data = this.tableFormGroup.get("rows").value[i];
		this.tableData.data.push(data);
		this.tableData.data.splice(i, 1);
		this.tableData._updateChangeSubscription();

		for (let i = 0; i < this.tableData.data.length; i++) {
			this.subscription.push(this.tableFormGroup.get("rows").get(`${i}`).valueChanges.subscribe((newVal) => {
				console.log(newVal);
			}));
		}

		console.log(this.tableData.data)
	}

	ngOnInit() {
		this.tableFormGroup = this.fb.group({
			rows: this.fb.array([])
		});

		this.getData().then((res) => {
			console.log(this.data);

			this.setRows();

			for (let i = 0; i < this.data.length; i++) {
				this.subscription.push(this.tableFormGroup.get("rows").get(`${i}`).valueChanges.subscribe((newVal) => {
					console.log(newVal);
				}));
			}
		});
	}

	setRows() {
		const formCtrl = this.tableFormGroup.get('rows') as FormArray;
		this.data.forEach((d) => {
			formCtrl.push(this.getRows(d));
		});
		this.tableData = new MatTableDataSource<any>(this.data);
		this.tableData.sort = this.sort;
	}

	getRows(row: schoolMarks): FormGroup {
		return this.fb.group({
			name: [row ? row.name : "", Validators.required],
			subject: [row ? row.subject : ""],
			marks: [row ? row.marks : 0, Validators.min(40)],
			passed: [row ? row.passed : false, Validators.requiredTrue],
		})
	}

	addRow() {
		const formCtrl = this.tableFormGroup.get('rows') as FormArray;
		formCtrl.push(this.getRows(null));
		this.tableData.data.push(this.getRows(null).value);
		this.tableData._updateChangeSubscription();


		console.log(this.tableFormGroup.value)

		for (let i = 0; i < this.tableFormGroup.value.length; i++) {
			this.tableFormGroup.get("rows").get(`${i}`).valueChanges.subscribe((newVal) => {
				console.log(newVal);
			});
		}
	}

	logData() {
		console.log(this.tableData);
		console.log(this.tableFormGroup.value);
	}
}
