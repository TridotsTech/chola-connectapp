import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LoadingController, Platform } from '@ionic/angular';
// import { FileOpener } from 'capacitor-file-opener';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './payroll-detail.component.html',
  styleUrls: ['./payroll-detail.component.scss'],
})
export class PayrollDetailComponent implements OnInit {
  @Input() detail_name: any;
  @Input() employee: any;
  earning_details: any;
  total_earnings = 0;
  total_deductions = 0;
  total_salary = 0;
  today: any;
  year: any;
  month: any;
  daysInMonth: any;
  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  search_data: any;
  tabs:boolean = false
  page_title="Salary slip"
  months = [
    { value: "January", name: "Jan", },
    { value: "February", name: "Feb" },
    { value: "March", name: "Mar" },
    { value: "April", name: "Apr" },
    { value: "May", name: "May" },
    { value: "June", name: "Jun" },
    { value: "July", name: "Jul" },
    { value: "August", name: "Aug" },
    { value: "September", name: "Sep" },
    { value: "October", name: "Oct" },
    { value: "November", name: "Nov" },
    { value: "December", name: "Dec" }
  ]
  currentYearValue: any;
  currentMonthValue: any;
  sub: any;
  skeleton = false
  no_products = false
  constructor(public loadingCtrl:LoadingController, private file: File, private fileOpener: FileOpener,public db: DbService, public route: ActivatedRoute,private platform: Platform) { }

  ngOnInit() {

    const currentDate = new Date();
    this.currentYearValue = currentDate.getFullYear(); // Returns the 4-digit year (e.g., 2024)
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 to convert to 1-based index
    this.currentMonthValue = currentMonth.toString().padStart(2, '0');

    this.months.map((res, i) => {
      if (i == (currentMonth - 1)) {
        res['isActive'] = true;
      }
    })
    this.get_doc_details()

    this.sub = this.db.selectedYearSubject.subscribe((res) => {
      if (res && res == 'getYear' && this.db.selected_year) {
        this.db.selected_year = false
        this.currentYearValue = this.db.selectedYear
        this.get_doc_details();
      }
    })

  }

  getDateDifference(startDate: Date) {
    const endDate = new Date(); // Current date

    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjusting months and years if necessary
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    return `${yearsDiff} yr, ${monthsDiff} mn`;
  }


  formatDate(data){
    const now = new Date(data);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

   return `${year}-${month}-${day}`;
  }

  async get_doc_details() {
    this.skeleton = true;
    let data = {
      doctype: "Salary Slip",
      name: this.detail_name,
    }
    
    if(this.tabs){
      let firstDay = await this.formatDate(new Date(this.currentYearValue, this.currentMonthValue - 1, 1));
      let lastDay = await this.formatDate(new Date(this.currentYearValue, this.currentMonthValue, 0));
      data['filters'] = {
        start_date: ["between", [firstDay, lastDay]],
        end_date: ["between", [firstDay, lastDay]],
        employee: this.employee
      }

      delete data.name
    }

    this.db.doc_detail(data).subscribe(res => {
      this.skeleton = false;
      if (res && res.message && res.message[0].status == "Success") {
        this.earning_details = res.message[1]
        if (this.earning_details.start_date) {
          const dateString = this.earning_details.start_date;
          const date = new Date(dateString);
          const monthIndex = date.getMonth();
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const monthName = monthNames[monthIndex];
          this.earning_details.title = 'Salary slip (' + monthName + ')'

          let dateSplit = this.earning_details.start_date.split('-')

          this.db.selectedYear = dateSplit[0]
        }
        const currentDate = new Date(this.earning_details.start_date);
        this.currentYearValue = currentDate.getFullYear(); // Returns the 4-digit year (e.g., 2024)
        this.currentMonthValue = currentDate.getMonth() + 1
        this.currentMonthValue = this.currentMonthValue.toString().padStart(2, '0');

        let monthValue = Number(this.currentMonthValue) - 1;
        this.db.tab_buttons(this.months, this.months[monthValue].name, 'name');

        // this.initialCall(this.earning_details.creation)
        this.initialCall(this.earning_details.start_date)
        this.no_products = false
      } else {
        this.earning_details = undefined;
        this.no_products = true
      }
      if (this.earning_details) {
        this.earning_details.earnings.map(ear_res => {
          this.total_earnings = this.total_earnings + ear_res.amount
        })
        this.earning_details.deductions.map(ded_res => {
          this.total_deductions = this.total_deductions + ded_res.amount
        })
        this.total_salary = this.total_salary + (this.total_earnings + this.total_deductions)
      }
    })
  }

  download_payroll(info) {
    let data = {'salary_slip_select_year': '2024-2025', 'salary_slip_select_month': 'December', 'employee': info.employee, 'doctype': 'Salary Slip'}
    this.db.get_salary_slip_content({filters:{'salary_slip_select_year': '2024-2025', 'salary_slip_select_month': 'November', 'employee': info.employee, 'doctype': 'Salary Slip'}}).subscribe(res => {
      // console.log(res)
      if (res && res.status && res.status == 'Success') {
      //   this.detail_name = res.message;
      //   this.get_doc_details()
      // 

      const fileContent = res.message.fcontent;
    const fileName = res.message.fname
    const blob = new Blob([new Uint8Array(fileContent)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    console.log(url)
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();

    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }, 5000);

    // const downloadLink = document.createElement("a");
    // const url = URL.createObjectURL(blob);
    // downloadLink.href = url;
    // downloadLink.download = fileName;
    // document.body.appendChild(downloadLink);
    // downloadLink.click();
    // URL.revokeObjectURL(url);
  } else {
      this.db.alert('No Further Records')
    }

    }, error => {
      console.error(error)
    })
    
    // const fileContent = response.message.fcontent;
    // const fileName = response.message.fname
    // const blob = new Blob([new Uint8Array(fileContent)], { type: "application/pdf" });
    // const downloadLink = document.createElement("a");
    // const url = URL.createObjectURL(blob);
    // downloadLink.href = url;
    // downloadLink.download = fileName;
    // downloadLink.click();
    // URL.revokeObjectURL(url);
    // let url = this.db.baseUrl + `printview?doctype=Salary%20Slip&name=${this.detail_name}&format=Salary%20Slip%20Standard&no_letterhead=0&letterhead=Tridots&settings=%7B%7D&_lang=en`
    // window.open(url, '_blank');
  }

  async downloadAndOpenPDF(info) {
    try {
      let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      setTimeout(() => {
        loader.dismiss();
      }, 10000);
      this.db.get_salary_slip_content({filters:{'salary_slip_select_year': '2024-2025', 'salary_slip_select_month': 'November', 'employee': info.employee, 'doctype': 'Salary Slip'}}).subscribe(async res => {
        if (res && res.status && res.status == 'Success') {
        const fileContent = res.message.fcontent;
        const fileName = res.message.fname
      // Step 1: Download the PDF file from the URL
      // const response = await Http.get({ url: this.pdfUrl, responseType: 'arraybuffer' });
    const pdfBlob = new Blob([new Uint8Array(fileContent)], { type: "application/pdf" });
    // console.log(pdfBlob)

      // const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      // Step 2: Save the PDF file to the device's filesystem
      // const fileName = 'downloaded_file.pdf';
      const filePath = await this.saveFileToDevice(pdfBlob, fileName);
          // console.log(filePath,'filepath')
      // Step 3: Open the downloaded PDF file
      await this.openFile(filePath);
      setTimeout(() => {
        loader.dismiss();
      }, 2000);
    } else {
      this.db.alert('No Further Records')
      setTimeout(() => {
        loader.dismiss();
      }, 450);
    }

    }, error => {
      console.error(error)
    })
    } catch (error) {
      console.error('Error downloading or opening PDF file', error);
    }
  }

  async saveFileToDevice(blob: Blob, fileName: string): Promise<string> {
    // const filePath = this.platform.is('ios') ? this.file.documentsDirectory : this.file.externalDataDirectory;
    const base64Data = await this.convertBlobToBase64(blob);
    // console.log(base64Data,'base64')
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents,
      encoding: Encoding.Base64,
    });
    // console.log(savedFile,'save')
    return savedFile.uri;  // Return the file URI for later use
  }

  async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  async openFile(filePath: string) {
    this.fileOpener.open(filePath, 'application/pdf')
          .then(() => {
            alert('success')
          })
          .catch(err => {
            // this.loader = false
            alert('faild')
            console.error('Error opening PDF', err)
            // this.alert1('Loading failed', 'Menu', 'failed')
          });
  }

  initialCall(dates) {
    this.today = new Date();
    const currentDate = new Date(dates);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    this.getMonthAndYear(year, month);
  }

  getMonthAndYear(year, month) {
    this.year = year;
    this.month = this.monthNames[Number(month) - 1];
  }


  goToPreviousDay() {
    let year = this.year;
    let month = this.monthNames.findIndex((res) => { return res == this.month });
    let day = 1;

    if (month === 0) { // January case
      month = 11; // December
      year--; // Previous year
    } else {
      month--; // Previous month
    }

    // Handle the case where the previous month has fewer days than the current day
    const previousMonthDate = new Date(year, month, day);
    if (previousMonthDate.getMonth() !== month) {
      // This handles cases like moving from March 31 to February (which doesn't have 31 days)
      previousMonthDate.setDate(0); // Go to the last day of the previous month
    }

    this.year = year;
    this.month = this.monthNames[Number(month)];
    this.next_doc(0)
  }

  goToNextDay() {
    const today = new Date();
    const date = new Date(today);

    let year = this.year;
    let month = this.monthNames.findIndex((res) => { return res == this.month });
    let day = 1;

    // Calculate the next month
    if (month === 11) { // December case
      month = 0; // January
      year++; // Next year
    } else {
      month++; // Next month
    }

    // Handle the case where the next month has fewer days than the current day
    const nextMonthDate = new Date(year, month, day);
    if (nextMonthDate.getMonth() !== month) {
      // This handles cases like moving from January 31 to February (which doesn't have 31 days)
      nextMonthDate.setDate(0); // Go to the last day of the previous month
    }

    this.year = year;
    this.month = this.monthNames[Number(month)];
    this.next_doc(1)

  }

  async next_doc(name) {

    let data = {
      "doctype": "Salary Slip",
      "value": this.earning_details.name,
      "filters": [],
      "prev": name
    }
    this.db.next_doc(data).subscribe(res => {
      // console.log(res)
      if (res && res.status && res.status == 'Success') {
        this.detail_name = res.message;
        this.get_doc_details()
      } else {
        this.db.alert('No Further Records')
      }

    }, error => {
      console.error(error)
    })
  }


  menu_name(eve: any) {

    if (eve.name) {
      // console.log(eve, "eve")
      let index = this.months.findIndex(res => { return res.name == eve.name })
      if (index >= 0) {
        index = index + 1;
        this.currentMonthValue = index.toString().padStart(2, '0');
        this.tabs = true
        // this.currentMonthValue = index;
        this.skeleton = true;
        this.earning_details = undefined;
        this.get_doc_details()
      }
    }

  }

  menu_name1(eve: any) {
    // this.db.tabs_button(this.get_saleslist.options,eve.name,'value')

    this.skeleton = true;

    this.earning_details = undefined;

    this.no_products = false;


    let search_data: any = {};
    let search_data_1 = this.search_data ? JSON.parse(this.search_data) : {};
    search_data_1.status = eve.route;
    search_data = { ...search_data, ...search_data_1 };
    this.search_data = JSON.stringify(search_data);
    // this.db.store_old_tab = this.search_data;
    this.get_doc_details();
  }

}