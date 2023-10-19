import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { SalaryService } from '../salary/salary.service';
import { AddSalaryComponent } from '../../../../common/add-salary/add-salary.component';
import { GenerateSalarySlipComponent } from '../../../../common/generate-salary-slip/generate-salary-slip.component';
import { ActivatedRoute } from '@angular/router';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent {
  employeeId: any = '';
  employeeSalaryDetail: any = {};
  employeeSalarySlipRequest: any = {};
  employeeSalarySlipDetail: any = {};
  SelectedPageSize: number = 10;
  employeeName: string = '';
  employeePicture: string = '';
  empPhotoType: string = '';
  employeeDept: string = '';
  companyName: string = '';
  companyLogo: string = '';
  employeeDesignation: string = '';
  accountNum: string = '';
  config_pgShowJob = {
    id: "pg_showJob",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  years: number[] = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
  @ViewChild('salaryContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  @ViewChild('salarySlipContainer', { read: ViewContainerRef }) dialogContainerSalarySlip?: ViewContainerRef;

  constructor(private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService, private salaryService: SalaryService,
    private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
    });
  }

  ngOnInit() {
    this.setSalaryForm();
    this.getEmployeeSalaryById();
    this.setSalarySlipform();
    this.setSalarySlipSearch();
    this.getEmployeeSalaryByEmployeeIdSlip();
  }

  setEmployeeSalaryPopup() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AddSalaryComponent);
    const data: any =
    {
      salaryObj: this.employeeSalaryDetail
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      if (status)
        this.getEmployeeSalaryById();
    });
  }

  getEmployeeSalaryById() {
    this.spinnerService.show();
    this.salaryService.GetEmployeeSalaryById(this.employeeId).subscribe(data => {
      if (data.status && data.employeeSalaryDetail) {
        this.employeeSalaryDetail = data.employeeSalaryDetail;
        this.employeeSalaryDetail.action = 'update';
      }
      else {
        this.employeeSalaryDetail.action = 'save';
      }
      this.spinnerService.hide();
    });
  }

  setSalaryForm() {
    this.employeeSalaryDetail.payType = '';
    this.employeeSalaryDetail.monthlyPay = 0;
    this.employeeSalaryDetail.hourlyPay = 0;
    this.employeeSalaryDetail.hoursWorked = 0;
    this.employeeSalaryDetail.dailyPay = 0;
    this.employeeSalaryDetail.weeklyPay = 0;
    this.employeeSalaryDetail.weeksWorked = 0;
    this.employeeSalaryDetail.Id = this.employeeId;
  }

  setEmployeeSalarySlipPopup() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(GenerateSalarySlipComponent);
    const data: any =
    {
      salaryObj: this.employeeSalaryDetail
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainerSalarySlip?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      if (status)
        this.getEmployeeSalaryByEmployeeIdSlip();
    });
  }

  setSalarySlipform() {
    this.employeeSalarySlipDetail.month = '';
    this.employeeSalarySlipDetail.basicPay = 0;
    this.employeeSalarySlipDetail.deductions = 0;
    this.employeeSalarySlipDetail.allowances = 0;
    this.employeeSalarySlipDetail.netSalary = 0;
    this.employeeSalarySlipDetail.Id = this.employeeId;
    this.employeeSalarySlipDetail.employeeSalaryID = this.employeeSalaryDetail.employeeSalaryID;
  }

  getEmployeeSalaryByEmployeeIdSlip() {
    this.employeeSalarySlipRequest.pageIndex = this.config_pgShowJob.currentPage - 1;
    this.employeeSalarySlipRequest.pageSize = this.config_pgShowJob.itemsPerPage;
    this.employeeSalarySlipRequest.employeeID = this.employeeId;
    this.spinnerService.show();
    this.salaryService.getEmployeeSalaryByEmployeeIdSlip(this.employeeSalarySlipRequest).subscribe(
      (data: any) => {
        if (data.status && data.employeeSalarySlipDetail) {
          this.employeeSalarySlipDetail = data.employeeSalarySlipDetail;
          this.employeeSalarySlipDetail.action = 'update';
          this.employeeName = data.employeeName;
          this.employeePicture = data.employeePicture;
          this.empPhotoType = data.empPhotoType;
          this.employeeDept = data.employeeDept;
          this.companyName = data.companyName;
          this.companyLogo = data.companyLogo;
          this.accountNum = data.accountNum;
          this.employeeDesignation = data.employeeDesignation;
        } else {
          this.employeeSalarySlipDetail.action = 'save';
        }
        this.spinnerService.hide();
      },
      (error: any) => {
        console.error(error);
        this.spinnerService.hide();
      }
    );
  }

  setSalarySlipSearch() {
    this.employeeSalarySlipRequest.month = '';
    this.employeeSalarySlipRequest.year = 0;
  }

  resetSalarySlipSearch() {
    this.employeeSalarySlipRequest.month = '';
    this.employeeSalarySlipRequest.year = 0;
    this.getEmployeeSalaryByEmployeeIdSlip();
  }

  changeSalarySlipDownloadStatus(salarySlipDetail: any, statusClicked: string) {
    this.spinnerService.show();
    salarySlipDetail.statusClicked = statusClicked;
    this.salaryService.changeSalarySlipDownloadStatus(salarySlipDetail).subscribe(
      (data: any) => {
        this.toastrService.success("Status has been changed");
        this.getEmployeeSalaryByEmployeeIdSlip();
        this.spinnerService.hide();
      },
      (error: any) => {
        console.error(error);
        this.spinnerService.hide();
      }
    );
  }

  async SalarySlipDownloadPdf(salarySlipDetail: any): Promise<void> {
    this.spinnerService.show();
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Set up fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Create a new page
    const page = pdfDoc.addPage();

    // Set up page dimensions and properties
    const { width, height } = page.getSize();
    const margin = 50;
    const contentWidth = width - 2 * margin;
    const lineHeight = 20;

    // Helper function to draw text
    const drawText = (x: any, y: any, text: any, fontSize = 12, bold = false) => {
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    };
    const payslipData = {
      monthYear: '',
      workingBranch: '',
      empCode: '',
      empName: '',
      pfNo: '',
      nod: '',
      esiNo: '',
      modeOfPay: '',
      designation: '',
      acNo: '',
      earnings: [
        { label: 'Basic', amount: salarySlipDetail.basicPay.toString() },
        { label: 'Allowances', amount: salarySlipDetail.allowances.toString() },
        // Add more earnings as needed
      ],
      deductions: [
        { label: 'Detuctions', amount: salarySlipDetail.deductions.toString() },
        // Add more deductions as needed
      ],
      netPay: salarySlipDetail.netSalary.toString(),
    };

    // Set up payslip data
    const {
      earnings,
      deductions,
      netPay,
    } = payslipData;

    let currentY = height - margin;

    const companyName = this.companyName;
    const companyNameFontSize = 14;
    const companyNameWidth = font.widthOfTextAtSize(companyName, companyNameFontSize);

    const companyNameX = width / 2 - companyNameWidth / 2; // Center align the company name
    const companyNameY = height - margin - 10; // Adjust the vertical position as needed
    drawText(companyNameX, companyNameY, companyName, companyNameFontSize);

    currentY -= 2 * lineHeight; // Adjust the spacing between the company name and payslip heading

    // Draw payslip header
    const heading = 'Employee Payslip';
    const headingFontSize = 18;
    const headingWidth = font.widthOfTextAtSize(heading, headingFontSize);

    const headingX = width / 2 - headingWidth / 2; // Center align the heading
    const headingY = currentY;
    drawText(headingX, headingY, heading, headingFontSize, true);

    currentY -= 1.5 * lineHeight;


    // Draw payment slip section
    const paymentSlipText = 'Payment slip for the ' + salarySlipDetail.paidFullDate;
    const paymentSlipFontSize = 12;
    const paymentSlipWidth = font.widthOfTextAtSize(paymentSlipText, paymentSlipFontSize);

    const paymentSlipX = width / 2 - paymentSlipWidth / 2; // Center align the payment slip section
    const paymentSlipY = currentY; // Use the updated value of currentY for the payment slip section

    drawText(paymentSlipX, paymentSlipY, paymentSlipText, paymentSlipFontSize);

    currentY -= 1.5 * lineHeight;

    const fontSize = 12; // Set the desired font size for the employee details
    const boldFont: any = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Embed the bold font

    drawText(margin, currentY, 'Employee Name:', fontSize, boldFont);
    drawText(margin + 120, currentY, this.employeeName ? this.employeeName : '', fontSize);
    currentY -= 1.5 * lineHeight;

    drawText(margin, currentY, 'Designation:', fontSize, boldFont);
    drawText(margin + 120, currentY, this.employeeDesignation ? this.employeeDesignation : '', fontSize);
    currentY -= 1.5 * lineHeight;

    drawText(margin, currentY, 'Department:', fontSize, boldFont);
    drawText(margin + 120, currentY, this.employeeDept ? this.employeeDept : '', fontSize);
    currentY -= 1.5 * lineHeight;

    drawText(margin, currentY, 'Ac No.:', fontSize, boldFont);
    drawText(margin + 120, currentY, this.accountNum ? this.accountNum : '', fontSize);
    currentY -= 2 * lineHeight;

    // Draw earnings and deductions table
    const tableX = margin;
    const tableY = currentY;
    const columnWidth = contentWidth / 2;

    drawText(tableX, tableY, 'Earnings', 14, true);
    drawText(tableX + columnWidth, tableY, 'Deductions', 14, true);

    currentY -= lineHeight;

    const drawTableRow = (x: any, y: any, label: any, amount: any) => {
      drawText(x, y, label, 12);
      drawText(x + columnWidth, y, amount, 12);
    };

    for (let i = 0; i < earnings.length; i++) {
      const { label, amount } = earnings[i];
      currentY -= lineHeight;
      drawTableRow(tableX, currentY, label, amount);
    }

    currentY -= 1.5 * lineHeight;

    for (let i = 0; i < deductions.length; i++) {
      const { label, amount } = deductions[i];
      currentY -= lineHeight;
      drawTableRow(tableX + columnWidth, currentY, label, amount);
    }

    currentY -= 1.5 * lineHeight;
    drawText(tableX, currentY, 'Total Earning', 12, true);
    drawText(tableX + columnWidth, currentY, 'Total Deductions', 12, true);

    currentY -= lineHeight;
    drawTableRow(tableX, currentY, '', netPay);
    drawTableRow(tableX + columnWidth, currentY, '', '');

    currentY -= 2 * lineHeight;

    // Draw net pay
    drawText(tableX, currentY, `Net Pay : ${netPay}`, 14, true);

    currentY -= 1.5 * lineHeight;

    // Draw net pay in words
    drawText(tableX, currentY, 'In Words', 12, true);
    currentY -= lineHeight;
    drawText(tableX, currentY, this.convertNumberToWords(netPay));

    currentY -= 3 * lineHeight;

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'salary_slip.pdf';
    link.click();
    this.spinnerService.hide();
  }

  convertNumberToWords(number: number): string {
    // Define the units, tens, and scales arrays
    const units = [
      'zero',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen'
    ];

    const tens = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety'
    ];

    const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

    if (number === 0) {
      return 'zero';
    }

    // Convert the number to a string
    const numberString = number.toString();

    // Split the number into groups of three digits
    const groups = numberString.match(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g);

    if (!groups) {
      // Handle the case where there are no groups (number is less than 1000)
      return this.convertGroupToWords(number);
    }

    let result = '';

    for (let i = 0; i < groups.length; i++) {
      let group = parseInt(groups[i]);

      let groupResult = this.convertGroupToWords(group);

      // Append the scale (thousand, million, billion, etc.) for groups larger than the first
      if (i > 0) {
        groupResult += ' ' + scales[i];
      }

      result = groupResult + ' ' + result;
    }

    return result.trim();
  }

  convertGroupToWords(group: number): string {
    // Define the units and tens arrays
    const units = [
      'zero',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen'
    ];

    const tens = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety'
    ];

    let result = '';

    // Extract the hundreds digit and convert it to words
    const hundreds = Math.floor(group / 100);
    if (hundreds !== 0) {
      result += units[hundreds] + ' hundred ';
    }

    // Extract the tens and ones digits
    const tensAndOnes = group % 100;

    if (tensAndOnes !== 0) {
      if (tensAndOnes < 20) {
        // Numbers below 20 can be looked up directly from the units array
        result += units[tensAndOnes];
      } else {
        // For numbers above 20, look up the tens and ones separately
        const tensDigit = Math.floor(tensAndOnes / 10);
        const onesDigit = tensAndOnes % 10;

        result += tens[tensDigit];
        if (onesDigit !== 0) {
          result += ' ' + units[onesDigit];
        }
      }
    }

    return result;
  }
}
