import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { PdfViewerPage } from 'src/app/pages/Go1-onsite/pdf-viewer/PdfViewerPage';
import { ShowImageComponent } from 'src/app/components/show-image/show-image.component';

@Component({
  selector: 'app-employee-referral',
  templateUrl: './employee-referral.page.html',
  styleUrls: ['./employee-referral.page.scss'],
})
export class EmployeeReferralPage implements OnInit {
  employeeReferralList: any = [];
  skeleton = true;
  page_no: any = 1;
  no_referrals = false;
  searchTxt: any;
  selectFilters: any = {};
  totalFilterCount: any = 0;

  constructor(public db: DbService, public modalCntrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.get_employee_referral_list();
  }

  get_employee_referral_list() {
    let filters: any = {
      "referrer": localStorage['employee_id']
    };
    
    if (this.searchTxt) {
      filters["full_name"] = ['Like', '%' + this.searchTxt + '%'];
    }

    let data = {
      doctype: 'Employee Referral',
      fields: ["name", "full_name", "status", "for_designation", "email", "contact_no", "custom_date_of_birth", "resume"],
      page_no: this.page_no,
      page_size: 20,
      filters: filters
    }

    this.db.get_list(data).subscribe(res => {
      this.skeleton = false;
      if (res && res.message && res.message.length != 0) {
        if (this.page_no == 1) {
          this.employeeReferralList = res.message;
        } else {
          this.employeeReferralList = [...this.employeeReferralList, ...res.message];
        }
      } else {
        this.no_referrals = true;
        this.page_no == 1 ? this.employeeReferralList = [] : null;
      }
    });
  }

  load_more(event) {
    if (!this.no_referrals) {
      let value = event.target.offsetHeight + event.target.scrollTop + 1;
      value = value.toFixed();
      if (value >= event.target.scrollHeight) {
        this.page_no += 1;
        this.get_employee_referral_list();
      }
    }
  }

  searchPro(event) {
    this.searchTxt = event.target.value;
    this.page_no = 1;
    this.no_referrals = false;
    this.get_employee_referral_list();
  }

  clear_txt(event) {
    this.searchTxt = '';
    this.page_no = 1;
    this.no_referrals = false;
    this.get_employee_referral_list();
  }

  getFormattedDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'accepted':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }

  async openReferralDetail(item) {
    // You can implement a detail modal here similar to job referral detail
    // console.log('Referral detail:', item);
  }

  async viewResume(event: Event, item: any) {
    event.stopPropagation(); // Prevent triggering the parent click event
    
    if (!item.resume) {
      this.db.alert('No resume available');
      return;
    }

    const resumeUrl = item.resume;
    const fileExtension = resumeUrl.split('.').pop()?.toLowerCase();
    
    // Check if it's an image file
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const isImage = imageExtensions.includes(fileExtension || '');
    
    if (isImage) {
      // Open image viewer
      const modal = await this.modalCntrl.create({
        component: ShowImageComponent,
        cssClass: 'web_site_form',
        componentProps: {
          image: resumeUrl,
          delete_btn: false
        }
      });
      await modal.present();
    } else {
      // Open PDF viewer for PDFs and other documents
      const modal1 = await this.modalCntrl.create({
        component: PdfViewerPage,
        cssClass: this.db.ismobile ? '' : 'web_site_form',
        componentProps: {
          image: resumeUrl,
          modalView: true
        }
      });
      await modal1.present();
    }
  }

}
