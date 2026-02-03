import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { getUserData } from '../../../util/session';
import ReactDOMServer from 'react-dom/server';
import AdvancedInvoiceTemplate from './AdvancedInvoiceTemplate';

// Language configurations (unchanged)
const LANGUAGES = {
  marathi: {
    name: 'मराठी',
    font: 'Arial, sans-serif',
    labels: {
      taxInvoice: 'कर चलन',
      originalForRecipient: 'प्राप्तकर्त्यासाठी मूळ',
      detailsOfBuyer: 'खरेदीदाराचे तपशील | बिल:',
      detailsOfConsignee: 'प्राप्तकर्त्याचे तपशील | पाठवले:',
      name: 'नाव',
      address: 'पत्ता',
      phone: 'फोन',
      gstin: 'जीएसटीआयएन',
      pan: 'पॅन',
      placeOfSupply: 'पुरवठा स्थान',
      country: 'देश',
      state: 'राज्य',
      invoiceNo: 'चलन क्रमांक',
      invoiceDate: 'चलन तारीख',
      workOrder: 'कार्य आदेश',
      workOrderDate: 'कार्य आदेश तारीख',
      serialNo: 'अनुक्रमांक',
      nameOfProductService: 'उत्पादन/सेवेचे नाव',
      hsnSac: 'HSN/SAC',
      qty: 'प्रमाण',
      rate: 'दर',
      taxableValue: 'करपात्र मूल्य',
      cgst: 'CGST',
      sgst: 'SGST',
      total: 'एकूण',
      percent: '%',
      amount: 'रक्कम',
      totalInWords: 'एकूण शब्दांत',
      bankDetails: 'बँक तपशील',
      bank: 'बँक',
      branch: 'शाखा',
      accNumber: 'खाते क्रमांक',
      ifsc: 'IFSC',
      termsAndConditions: 'अटी आणि शर्ती',
      subjectToJurisdiction: 'आमच्या घरगुती न्यायाधिकरणाच्या अधीन.',
      responsibilityCeases: 'आमची जबाबदारी वस्तू आमच्या परिसरातून निघताच संपते.',
      goodsOnceSold: 'एकदा विकलेल्या वस्तू परत घेतल्या जाणार नाहीत.',
      deliveryExPremises: 'डिलिव्हरी एक्स-परिसर.',
      taxableAmount: 'करपात्र रक्कम',
      add: 'जोडा',
      totalTax: 'एकूण कर',
      totalAmountAfterTax: 'करानंतरची एकूण रक्कम',
      eAndOE: '(E & O.E.)',
      certified: 'प्रमाणित की वरील तपशील सत्य आणि योग्य आहेत.',
      for: 'साठी',
      authorizedSignatory: 'अधिकृत स्वाक्षरी',
      rupees: 'रुपये',
      only: 'फक्त',
    },
  },
  bengali: {
    name: 'বাংলা',
    font: "'Noto Sans Bengali', Arial, sans-serif",
    labels: {
      taxInvoice: 'কর চালান',
      originalForRecipient: 'প্রাপকের জন্য মূল',
      detailsOfBuyer: 'ক্রেতার বিবরণ | বিল:',
      detailsOfConsignee: 'প্রাপকের বিবরণ | পাঠানো:',
      name: 'নাম',
      address: 'ঠিকানা',
      phone: 'ফোন',
      gstin: 'জিএসটিআইএন',
      pan: 'প্যান',
      placeOfSupply: 'সরবরাহের স্থান',
      country: 'দেশ',
      state: 'রাজ্য',
      invoiceNo: 'চালান নম্বর',
      invoiceDate: 'চালানের তারিখ',
      workOrder: 'কাজের আদেশ',
      workOrderDate: 'কাজের আদেশের তারিখ',
      serialNo: 'ক্রমিক নং',
      nameOfProductService: 'পণ্য/সেবার নাম',
      hsnSac: 'HSN/SAC',
      qty: 'পরিমাণ',
      rate: 'হার',
      taxableValue: 'করযোগ্য মূল্য',
      cgst: 'CGST',
      sgst: 'SGST',
      total: 'মোট',
      percent: '%',
      amount: 'পরিমাণ',
      totalInWords: 'মোট কথায়',
      bankDetails: 'ব্যাংকের বিবরণ',
      bank: 'ব্যাংক',
      branch: 'শাখা',
      accNumber: 'অ্যাকাউন্ট নম্বর',
      ifsc: 'IFSC',
      termsAndConditions: 'নিয়ম ও শর্তাবলী',
      subjectToJurisdiction: 'আমাদের গৃহ এখতিয়ারের অধীন।',
      responsibilityCeases: 'পণ্য আমাদের প্রাঙ্গণ ছেড়ে যাওয়ার সাথে সাথে আমাদের দায়বদ্ধতা শেষ।',
      goodsOnceSold: 'একবার বিক্রিত পণ্য ফেরত নেওয়া হবে না।',
      deliveryExPremises: 'ডেলিভারি এক্স-প্রাঙ্গণ।',
      taxableAmount: 'করযোগ্য পরিমাণ',
      add: 'যোগ',
      totalTax: 'মোট কর',
      totalAmountAfterTax: 'করের পর মোট পরিমাণ',
      eAndOE: '(E & O.E.)',
      certified: 'প্রত্যয়িত যে উপরের বিবরণগুলি সত্য এবং সঠিক।',
      for: 'জন্য',
      authorizedSignatory: 'অনুমোদিত স্বাক্ষরকারী',
      rupees: 'টাকা',
      only: 'মাত্র',
    },
  },
  english: {
    name: 'English',
    font: 'Arial, sans-serif',
    labels: {
      taxInvoice: 'TAX INVOICE',
      originalForRecipient: 'ORIGINAL FOR RECIPIENT',
      detailsOfBuyer: 'Detail of Customer:',
      detailsOfConsignee: 'Detail of Company:',
      name: 'Name',
      address: 'Address',
      phone: 'Phone',
      gstin: 'GSTIN',
      pan: 'PAN',
      placeOfSupply: 'Place of Supply',
      country: 'Country',
      state: 'State',
      invoiceNo: 'Invoice No.',
      invoiceDate: 'Invoice Date',
      workOrder: 'Work Order',
      workOrderDate: 'Work Order Date',
      serialNo: 'Sr. No.',
      nameOfProductService: 'Name of Product / Service',
      hsnSac: 'HSN / SAC',
      qty: 'Qty',
      rate: 'Rate',
      taxableValue: 'Taxable Value',
      cgst: 'CGST',
      sgst: 'SGST',
      total: 'Total',
      percent: '%',
      amount: 'Amount',
      totalInWords: 'Total in words',
      bankDetails: 'Bank Details',
      bank: 'Bank',
      branch: 'Branch',
      accNumber: 'Acc. Number',
      ifsc: 'IFSC',
      termsAndConditions: 'Terms and Conditions',
      subjectToJurisdiction: 'Subject to our home Jurisdiction.',
      responsibilityCeases: 'Our Responsibility Ceases as soon as goods leaves our Premises.',
      goodsOnceSold: 'Goods once sold will not taken back.',
      deliveryExPremises: 'Delivery Ex-Premises.',
      taxableAmount: 'Taxable Amount',
      add: 'Add',
      totalTax: 'Total Tax',
      totalAmountAfterTax: 'Total Amount After Tax',
      eAndOE: '(E & O.E.)',
      certified: 'Certified that the particulars given above are true and correct.',
      for: 'For',
      authorizedSignatory: 'Authorised Signatory',
      rupees: 'RUPEES',
      only: 'ONLY',
    },
  },
  tamil: {
    name: 'தமிழ்',
    font: "'Noto Sans Tamil', Arial, sans-serif",
    labels: {
      taxInvoice: 'வரி விலைப்பட்டியல்',
      originalForRecipient: 'பெறுபவருக்கான அசல்',
      detailsOfBuyer: 'வாங்குபவரின் விவரங்கள் | பில்:',
      detailsOfConsignee: 'பெறுபவரின் விவரங்கள் | அனுப்பப்பட்டது:',
      name: 'பெயர்',
      address: 'முகவரி',
      phone: 'தொலைபேசி',
      gstin: 'ஜிஎஸ்டிஐஎன்',
      pan: 'பான்',
      placeOfSupply: 'வழங்கல் இடம்',
      country: 'நாடு',
      state: 'மாநிலம்',
      invoiceNo: 'விலைப்பட்டியல் எண்.',
      invoiceDate: 'விலைப்பட்டியல் தேதி',
      workOrder: 'பணி உத்தரவு',
      workOrderDate: 'பணி உத்தரவு தேதி',
      serialNo: 'வ.எண்.',
      nameOfProductService: 'பொருள் / சேவையின் பெயர்',
      hsnSac: 'HSN / SAC',
      qty: 'அளவு',
      rate: 'விகிதம்',
      taxableValue: 'வரிக்குரிய மதிப்பு',
      cgst: 'CGST',
      sgst: 'SGST',
      total: 'மொத்தம்',
      percent: '%',
      amount: 'தொகை',
      totalInWords: 'மொத்தம் வார்த்தைகளில்',
      bankDetails: 'வங்கி விவரங்கள்',
      bank: 'வங்கி',
      branch: 'கிளை',
      accNumber: 'கணக்கு எண்',
      ifsc: 'IFSC',
      termsAndConditions: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
      subjectToJurisdiction: 'எங்கள் வீட்டு அதிகார வரம்புக்கு உட்பட்டது.',
      responsibilityCeases: 'பொருட்கள் எங்கள் வளாகத்தை விட்டு வெளியேறும் முன்பே எங்கள் பொறுப்பு முடிவடைகிறது.',
      goodsOnceSold: 'ஒருமுறை விற்கப்பட்ட பொருட்கள் திரும்ப எடுக்கப்படமாட்டாது.',
      deliveryExPremises: 'டெலிவரி எக்ஸ்-வளாகம்.',
      taxableAmount: 'வரிக்குரிய தொகை',
      add: 'சேர்க்க',
      totalTax: 'மொத்த வரி',
      totalAmountAfterTax: 'வரிக்குப் பிறகு மொத்தத் தொகை',
      eAndOE: '(E & O.E.)',
      certified: 'மேலே கொடுக்கப்பட்ட விவரங்கள் உண்மை மற்றும் சரியானவை என்று சான்றளிக்கப்படுகிறது.',
      for: 'க்காக',
      authorizedSignatory: 'அங்கீகரிக்கப்பட்ட கையொப்பம்',
      rupees: 'ரூபாய்',
      only: 'மட்டும்',
    },
  },
};

// Number to words conversion function
const numberToWords = (number, language = 'english') => {
  if (number === 0) return LANGUAGES[language].labels.zero || 'Zero';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  // Language-specific number words
  const langUnits = {
    english: units,
    marathi: ['', 'एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ'],
    bengali: ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়'],
    tamil: ['', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது'],
  };
  const langTeens = {
    english: teens,
    marathi: ['दहा', 'अकरा', 'बारा', 'तेरा', 'चौदा', 'पंधरा', 'सोळा', 'सतरा', 'अठरा', 'एकोणीस'],
    bengali: ['দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোল', 'সতেরো', 'আঠারো', 'উনিশ'],
    tamil: ['பத்து', 'பதினொன்று', 'பன்னிரண்டு', 'பதின்மூன்று', 'பதினான்கு', 'பதினைந்து', 'பதினாறு', 'பதினேழு', 'பதினெட்டு', 'பத்தொன்பது'],
  };
  const langTens = {
    english: tens,
    marathi: ['', '', 'वीस', 'तीस', 'चाळीस', 'पन्नास', 'साठ', 'सत्तर', 'ऐंशी', 'नव्वद'],
    bengali: ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'],
    tamil: ['', '', 'இருபது', 'முப்பது', 'நாற்பது', 'ஐம்பது', 'அறுபது', 'எழுபது', 'எண்பது', 'தொண்ணூறு'],
  };
  const langScales = {
    english: { thousand: 'Thousand', lakh: 'Lakh', crore: 'Crore' },
    marathi: { thousand: 'हजार', lakh: 'लाख', crore: 'कोटी' },
    bengali: { thousand: 'হাজার', lakh: 'লক্ষ', crore: 'কোটি' },
    tamil: { thousand: 'ஆயிரம்', lakh: 'லட்சம்', crore: 'கோடி' },
  };

  const convertHundreds = (num, lang) => {
    let result = '';
    if (num >= 100) {
      result += langUnits[lang][Math.floor(num / 100)] + ' ' + (lang === 'english' ? 'Hundred' : lang === 'marathi' ? 'शे' : lang === 'bengali' ? 'শত' : 'நூறு') + ' ';
      num %= 100;
    }
    if (num >= 20) {
      result += langTens[lang][Math.floor(num / 10)];
      if (num % 10 > 0) result += ' ' + langUnits[lang][num % 10];
    } else if (num >= 10) {
      result += langTeens[lang][num - 10];
    } else if (num > 0) {
      result += langUnits[lang][num];
    }
    return result.trim();
  };

  let words = '';
  let num = Math.floor(number);
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    words += convertHundreds(crores, language) + ' ' + langScales[language].crore + ' ';
    num %= 10000000;
  }
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    words += convertHundreds(lakhs, language) + ' ' + langScales[language].lakh + ' ';
    num %= 100000;
  }
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    words += convertHundreds(thousands, language) + ' ' + langScales[language].thousand + ' ';
    num %= 1000;
  }
  if (num > 0) {
    words += convertHundreds(num, language);
  }
  return (words.trim() + ' ' + LANGUAGES[language].labels.rupees + ' ' + LANGUAGES[language].labels.only).trim();
};

const formatNumber = (num) => {
  if (isNaN(num) || num === null || num === undefined) return '0.00';
  return Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatChargeType = (chargeType) => {
  const chargeTypeMap = {
    'travelling_charge': 'Travelling Charges',
    'service_charge': 'Service Charges',
    'other_charges': 'Other Charges'
  };
  return chargeTypeMap[chargeType] || chargeType.replace('_', ' ');
};

const InvoiceTemplate = ({
  companyInfo = {},
  formData = {},
  logs = [],
  operators = [],
  rows = [],
  prices = [],
  filteredLogs = [],
  totalInWords = 'N/A',
  workTypeMap = {},
}) => {
  console.log("logs");
  console.log(logs);
  const labels = LANGUAGES[formData.language || 'english'].labels;
  const font = LANGUAGES[formData.language || 'english'].font;

  // // Calculate total amount from filteredLogs
  // const totalAmount = formData.is_fixed_bid
  //   ? Number(formData.totalAmount || 0) // ✅ Use Fixed Bid Total
  //   : logs.reduce((acc, l) => {
  //     const start = Number(l.data.machine_start ?? l.data.start_reading ?? 0) || 0;
  //     const end = Number(l.data.machine_end ?? l.data.end_reading ?? 0) || 0;
  //     const total = l.data.actual_machine_hr != null && !isNaN(Number(l.data.actual_machine_hr))
  //       ? Number(l.data.actual_machine_hr)
  //       : Math.max(0, end - start);
  //     const price = Number(l.data.price_per_hour) || 0;
  //     return acc + total * price;
  //   }, 0);

  // // Convert total amount to words
  // const calculatedTotalInWords = numberToWords(totalAmount, formData.language || 'english');


  // ✅ UPDATED: Calculate total with additional charges
  const logsTotal = formData.is_fixed_bid
    ? Number(formData.totalAmount || 0)
    : logs.reduce((acc, l) => {
      const start = Number(l.data.machine_start ?? l.data.start_reading ?? 0) || 0;
      const end = Number(l.data.machine_end ?? l.data.end_reading ?? 0) || 0;
      const total = l.data.actual_machine_hr != null && !isNaN(Number(l.data.actual_machine_hr))
        ? Number(l.data.actual_machine_hr)
        : Math.max(0, end - start);
      const price = Number(l.data.price_per_hour) || 0;
      return acc + total * price;
    }, 0);

  // ✅ ADD: Calculate additional charges total
  const additionalChargesTotal = (formData.additionalCharges || []).reduce(
    (sum, c) => {
      const amt = Number(c.amount) || 0;
      const isDeduct = c.amount_deduct || c.charge_definition?.amount_deduct;
      return isDeduct ? sum - amt : sum + amt;
    },
    0
  );

  // ✅ UPDATED: Grand total includes additional charges
  const totalAmount = logsTotal + additionalChargesTotal;

  // Convert total amount to words
  const calculatedTotalInWords = numberToWords(totalAmount, formData.language || 'english');


  // Helper to get machine name
  const getMachineName = (machineId) => {
    if (!machineId || rows.length === 0) return 'N/A';
    const m = rows.find(r => String(r.id) === String(machineId));
    return m?.machine_name || 'N/A';
  };

  return (
    <div style={{ fontFamily: font, border: '2px solid #3075d2', fontSize: '10px', padding: '5mm', width: '190mm', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        {companyInfo.logo && (
          <div style={{ marginBottom: '5px' }}>
            <img
              src={`img/${companyInfo.logo}`}
              alt="Company Logo"
              style={{ maxWidth: '100px', maxHeight: '60px' }}
            />
          </div>
        )}
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '2px 0', color: '#3075d2' }}>
          {labels.taxInvoice}
        </h2>
        <p style={{ fontSize: '10px', margin: '2px 0' }}>{labels.originalForRecipient}</p>
      </div>

      {/* Buyer and Consignee Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: "3px", border: "1px solid #3075d2" }}>
        <div style={{ flex: '1', marginRight: '10px', borderRight: "1px solid #3075d2" }}>

          <p style={{ fontWeight: 'bold', paddingLeft: "3px", fontSize: '13px', backgroundColor: '#e7f2fc', borderBottom: '1px solid #3075d2' }}>{labels.detailsOfConsignee}</p>
          <p style={{ margin: '2px 0', paddingLeft: "3px" }}><strong>{labels.name}:</strong> {companyInfo.company_name || 'N/A'}</p>
          <p style={{ margin: '3px 0', paddingLeft: "3px" }}><strong>{labels.address}:</strong> {companyInfo.land_mark || ''}, {companyInfo.Tal || ''}, {companyInfo.Dist || ''}, {companyInfo.pincode || ''}</p>
          <p style={{ margin: '3px 0', paddingLeft: "3px" }}><strong>{labels.phone}:</strong> {companyInfo.phone_no || 'N/A'}</p>
          <p style={{ margin: '3px 0', paddingLeft: "3px" }}><strong>{`Email`}:</strong> {companyInfo.email_id || 'N/A'}</p>
          {formData.consignee?.gst_number && (
            <p style={{ margin: '3px 0', paddingLeft: "3px" }}><strong>{labels.gstin}:</strong> {formData.consignee?.gst_number}</p>
          )}
        </div>
        <div style={{ flex: '1', borderRight: "1px solid #3075d2" }}>
          <p style={{ fontWeight: 'bold', fontSize: '13px', backgroundColor: '#e7f2fc', borderBottom: '1px solid #3075d2' }}>{labels.detailsOfBuyer}</p>
          <p style={{ margin: '2px 0' }}><strong>{labels.name}:</strong> {formData?.name || 'N/A'}</p>
          <p style={{ margin: '3px 0' }}><strong>{labels.address}:</strong> {formData?.address || 'N/A'}</p>
          <p style={{ margin: '3px 0' }}><strong>{labels.phone}:</strong> {formData?.mobile || 'N/A'}</p>
          {formData.gst_number && (
            <p style={{ margin: '3px 0' }}><strong>{labels.gstin}:</strong> {formData.gst_number}</p>
          )}
        </div>
        <div style={{ flex: '1', paddingLeft: "3px", marginBottom: '10px' }}>
          <p style={{ margin: '3px 0' }}><strong>{labels.invoiceNo}:</strong> {formData.invoice_number || 'N/A'}</p>
          <p style={{ margin: '3px 0' }}><strong>{labels.invoiceDate}:</strong> {formData.date || 'N/A'}</p>
          {formData.is_fixed_bid && (
            <>
              {formData.transaction_id && (
                <p style={{ margin: '3px 0' }}><strong>Transaction ID:</strong> {formData.transaction_id}</p>
              )}
              {formData.paymentMode && (
                <p style={{ margin: '3px 0' }}><strong>Mode:</strong> {formData.paymentMode}</p>
              )}
            </>
          )}
        </div>
      </div>


      {/* ✅ Fixed Bid Description OR Machine Logs Table */}
      {formData.is_fixed_bid ? (
        <>
          {/* // <div style={{ marginBottom: '10px', border: '1px solid #3075d2', padding: '10px' }}>
        //   <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Description:</p>
        //   <p style={{ whiteSpace: 'pre-wrap' }}>{formData.remark || 'Fixed Bid Work'}</p>
        // </div> */}

          {/* Description Section */}

          <div style={{ marginBottom: '10px', border: '1px solid #3075d2', padding: '10px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Description:</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{formData.remark || 'Fixed Bid Work'}</p>
          </div>

          {/* Payment Summary for Fixed Bid */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
            {/* Total in Words */}
            <div style={{ flex: '1' }}>
              <div style={{ marginBottom: '5px', border: '1px solid #3075d2' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', backgroundColor: '#e7f2fc', padding: '4px' }}>
                  {labels.totalInWords}
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', padding: '4px' }}>
                  {calculatedTotalInWords}
                </p>
              </div>
            </div>

            {/* Payment Details Table */}
            <div style={{ flex: '1' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #3075d2' }}>
                <tbody>
                  {/* Total Amount */}
                  <tr>
                    <td style={{ padding: '4px', fontWeight: 'bold', border: '1px solid #3075d2' }}>
                      Total Amount
                    </td>
                    <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold', border: '1px solid #3075d2' }}>
                      ₹{formatNumber(totalAmount)}
                    </td>
                  </tr>

                  {/* Paid Amount */}
                  <tr>
                    <td style={{ padding: '4px', fontWeight: 'bold', border: '1px solid #3075d2' }}>
                      Paid Amount (Total)
                    </td>
                    <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold', border: '1px solid #3075d2' }}>
                      ₹{formatNumber(formData?.amountPaid || 0)}
                    </td>
                  </tr>

                  {/* Remaining Amount */}
                  <tr>
                    <td style={{ backgroundColor: '#e7f2fc', padding: '4px', fontWeight: 'bold', border: '1px solid #3075d2' }}>
                      Remaining Amount
                    </td>
                    <td style={{ backgroundColor: '#e7f2fc', padding: '4px', textAlign: 'right', fontWeight: 'bold', border: '1px solid #3075d2' }}>
                      ₹{formatNumber(totalAmount - (formData?.amountPaid || 0))}
                    </td>
                  </tr>

                  {/* Payment mode */}
                  {/* <tr>
                <td style={{ padding: '4px', fontWeight: 'bold', border: '1px solid #3075d2' }}>
                  Payment mode
                </td>
                <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold', border: '1px solid #3075d2' }}>
                  {formData?.paymentMode}
                </td>
              </tr> */}

                  {/* E & O.E. */}
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '8px', padding: '2px', border: '1px solid #3075d2' }}>
                      {labels.eAndOE}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Certification Text */}
              <p style={{ margin: '5px 0', fontSize: '9px', fontStyle: 'italic' }}>
                {labels.certified}
              </p>

              {/* Signature Section */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '10px', fontWeight: 'bold' }}>
                  {labels.for} {companyInfo.company_name || 'Kamthe Enterprises'}
                </p>
                {companyInfo.sign && (
                  <div style={{ height: '40px', borderBottom: '1px solid #3075d2', margin: '0 0 5px 0' }}>
                    <img src={`img/${companyInfo.sign}`} alt="Signature" style={{ maxWidth: '80px', maxHeight: '40px' }} />
                  </div>
                )}
                <p style={{ margin: '0', fontSize: '10px', fontWeight: 'bold' }}>
                  {labels.authorizedSignatory}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div style={{ textAlign: 'center', fontSize: '8px', color: '#666', marginTop: '5px' }}>
            <p style={{ margin: '0' }}>This invoice is computer generated and authorized.</p>
          </div>
        </>
      ) : (
        logs.length > 0 && (
          <div className="section" style={{ marginTop: '2rem', marginBottom: '10px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table
                className="table table-bordered"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #3075d2', // Updated border color
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#e7f2fc' }}> {/* Updated header background */}
                    <th style={{ width: '40px', border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Sr No</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Work Date</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Machine</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Mode</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Operator</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Work Type</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Start Reading</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>End Reading</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Net Reading</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Price per reading</th>
                    <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>Total Price</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log, idx) => {
                    const netReading =
                      (Number(log.data?.end_reading) || 0) - (Number(log.data?.start_reading) || 0);
                    const totalPrice = netReading * (Number(log.data?.price_per_hour) || 0);

                    return (
                      <tr key={log.id}>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {idx + 1}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {(log.data?.work_date || '').toString().slice(0, 10).split('-').reverse().join('-') || 'N/A'}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {getMachineName(log.data?.machine_id) || 'N/A'}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {prices.find((op) => op.id === log.data?.mode_id)?.mode || 'N/A'}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {operators.find(
                            (op) => String(op.id) === String(log.data?.operator_id)
                          )?.name || 'N/A'}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {workTypeMap[log.data?.work_type_id] || 'N/A'}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {formatNumber(Number(log.data?.start_reading) || 0)}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {formatNumber(Number(log.data?.end_reading) || 0)}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {formatNumber(netReading)}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {formatNumber(Number(log.data?.price_per_hour) || 0)}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {formatNumber(totalPrice)}
                        </td>
                      </tr>
                    );
                  })}



                  {/* Grand Total Row */}
                  {/* {(() => {
                    const totalNetReading = logs.reduce(
                      (sum, log) =>
                        sum +
                        ((Number(log.data?.end_reading) || 0) -
                          (Number(log.data?.start_reading) || 0)),
                      0
                    );
                    const grandTotal = logs.reduce((sum, log) => {
                      const netReading =
                        (Number(log.data?.end_reading) || 0) - (Number(log.data?.start_reading) || 0);
                      return sum + netReading * (Number(log.data?.price_per_hour) || 0);
                    }, 0);

                    return (
                      <tr
                        className="table-secondary"
                        style={{
                          fontWeight: 'bold',
                          background: '#e9ecef', // Updated footer background
                          borderTop: '2px solid #3075d2', // Updated border color
                        }}
                      >
                        <td colSpan="8" style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'right' }}>
                          Grand Total:
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          {formatNumber(totalNetReading)}
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px' }}></td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'center' }}>
                          ₹{formatNumber(grandTotal)}
                        </td>
                      </tr>
                    );
                  })()} */}
                </tbody>
              </table>
              {/* Additional Charges Table - ADD THIS SECTION */}
              {formData.additionalCharges && formData.additionalCharges.length > 0 && (
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #3075d2' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#e7f2fc' }}>
                        <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'left' }}>
                          Additional Charges
                        </th>
                        <th style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'right', width: '150px' }}>
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.additionalCharges.map((charge, idx) => (
                        <tr key={idx}>
                          <td style={{ border: '1px solid #3075d2', padding: '6px' }}>
                            {/* {charge.charge_type.replace('_', ' ').toUpperCase()} */}
                            {formatChargeType(charge.charge_type)} {charge.amount_deduct ? '(-)' : '(+)'}
                            {charge.remark && (
                              <div style={{ fontSize: '9px', color: '#666', fontStyle: 'italic', marginTop: '2px' }}>
                                {charge.remark}
                              </div>
                            )}
                          </td>
                          <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'right', color: charge.amount_deduct ? 'red' : 'inherit' }}>
                            {charge.amount_deduct ? '-' : ''}₹{formatNumber(Number(charge.amount) || 0)}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'right' }}>
                          Total Additional Charges:
                        </td>
                        <td style={{ border: '1px solid #3075d2', padding: '6px', textAlign: 'right' }}>
                          ₹{formatNumber(additionalChargesTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Columns */}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
              <div style={{ flex: '1' }}>
                <div style={{ marginBottom: '5px', border: '1px solid #3075d2' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', backgroundColor: '#e7f2fc', padding: '4px' }}>
                    {labels.totalInWords}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', padding: '4px' }}>
                    {calculatedTotalInWords}
                  </p>
                </div>

              </div>
              <div style={{ flex: '1' }}>


                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #3075d2' }}>
                  <tbody>
                    {/* ✅ ADDED: Show Logs Total separately if there are additional charges */}
                    {formData.additionalCharges && formData.additionalCharges.length > 0 && (
                      <tr>
                        <td style={{ padding: '4px', fontWeight: 'bold' }}>Logs Total</td>
                        <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>
                          ₹{formatNumber(logsTotal)}
                        </td>
                      </tr>
                    )}

                    {/* ✅ ADDED: Show Additional Charges Total */}
                    {formData.additionalCharges && formData.additionalCharges.length > 0 && (
                      <tr>
                        <td style={{ padding: '4px', fontWeight: 'bold' }}>Additional Charges</td>
                        <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>
                          ₹{formatNumber(additionalChargesTotal)}
                        </td>
                      </tr>
                    )}

                    {/* ✅ UPDATED: Changed label based on whether there are additional charges */}
                    <tr>
                      <td style={{ padding: '4px', fontWeight: 'bold' }}>
                        {formData.additionalCharges && formData.additionalCharges.length > 0
                          ? 'Grand Total'
                          : 'Total Amount'}
                      </td>
                      <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>
                        ₹{formatNumber(totalAmount)}
                      </td>
                    </tr>

                    {/* Breakdown of Paid Amount - NO CHANGES HERE */}
                    {(() => {
                      const totalPaid = formData?.amountPaid || 0;
                      const advancePaid = formData?.repayments
                        ?.filter(r => r.from_advance)
                        ?.reduce((sum, r) => sum + Number(r.payment), 0) || 0;
                      const cashPaid = Math.max(0, totalPaid - advancePaid);

                      return (
                        <>
                          <tr>
                            <td style={{ padding: '4px', fontWeight: 'bold' }}>{`Paid Amount (Total)`}</td>
                            <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>
                              ₹{formatNumber(totalPaid)}
                            </td>
                          </tr>
                          {advancePaid > 0 && (
                            <tr style={{ fontSize: '10px', color: '#666' }}>
                              <td style={{ padding: '2px 4px', fontStyle: 'italic' }}> - From Advance</td>
                              <td style={{ padding: '2px 4px', textAlign: 'right', fontStyle: 'italic' }}>
                                ₹{formatNumber(advancePaid)}
                              </td>
                            </tr>
                          )}
                          {cashPaid > 0 && advancePaid > 0 && (
                            <tr style={{ fontSize: '10px', color: '#666' }}>
                              <td style={{ padding: '2px 4px', fontStyle: 'italic' }}> - Direct Payment</td>
                              <td style={{ padding: '2px 4px', textAlign: 'right', fontStyle: 'italic' }}>
                                ₹{formatNumber(cashPaid)}
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })()}

                    {/* ✅ NO CHANGES: Remaining Amount - calculation already uses updated totalAmount */}
                    <tr>
                      <td style={{ backgroundColor: '#e7f2fc', padding: '4px', fontWeight: 'bold' }}>{`Remaining Amount`}</td>
                      <td style={{ backgroundColor: '#e7f2fc', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>
                        ₹{formatNumber(totalAmount - (formData?.amountPaid || 0))}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '8px', padding: '2px', border: '1px solid #3075d2' }}>
                        {labels.eAndOE}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style={{ margin: '5px 0', fontSize: '9px', fontStyle: 'italic' }}>
                  {labels.certified}
                </p>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '10px', fontWeight: 'bold' }}>
                    {labels.for} {companyInfo.company_name || 'Kamthe Enterprises'}
                  </p>
                  {companyInfo.sign && (
                    <div style={{ height: '40px', borderBottom: '1px solid #3075d2', margin: '0 0 5px 0' }}>
                      <img src={`img/${companyInfo.sign}`} alt="Signature" style={{ maxWidth: '80px', maxHeight: '40px' }} />
                    </div>
                  )}
                  <p style={{ margin: '0', fontSize: '10px', fontWeight: 'bold' }}>
                    {labels.authorizedSignatory}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '8px', color: '#666', marginTop: '5px' }}>
              <p style={{ margin: '0' }}>This invoice is computer generated and authorized.</p>
            </div>
          </div>
        )
      )
      }


    </div >
  );
};


export function generateMultiLanguagePDF(
  formData,
  logs,
  operators,
  rows,
  prices,
  filteredLogs,
  language = 'english',
  mode = 'blob',
  workTypeMap = {}
) {
  const ci = getUserData()?.company_info;

  if (!ci) throw new Error('Company Info not found.');
  if (!formData || !formData.invoice_number) throw new Error('Invalid formData structure.');

  const lang = LANGUAGES[language] || LANGUAGES['english'];

  // ✅ If it's an advance payment, use separate PDF template

  console.log("FOrm ::", formData);


  if (formData.is_advance) {
    console.log('Generating Advance Payment Receipt...');
    const template = (
      <AdvancedInvoiceTemplate
        companyInfo={ci}
        formData={formData}
        language={language}
      />
    );
    const renderedContent = ReactDOMServer.renderToString(template);

    if (!renderedContent) throw new Error('No content rendered for Advance Payment PDF.');

    const element = document.createElement('div');
    element.innerHTML = renderedContent;

    const options = {
      margin: [5, 5, 5, 5],
      filename: `advance-${formData?.invoice_number}-${formData?.name}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    const pdfInstance = html2pdf().set(options).from(element);
    return mode === 'blob' ? pdfInstance.output('blob') : pdfInstance.save();
  }

  // 🧾 Else use normal invoice rendering
  let invoiceContent = '';
  const logsPerPage = 10;

  // For Fixed Bid, we don't have logs, so we force 1 page.
  // For others, we calculate pages based on logs.
  const totalPages = formData.is_fixed_bid ? 1 : Math.ceil((logs?.length || 0) / logsPerPage);

  for (let i = 0; i < totalPages; i++) {
    const startIndex = i * logsPerPage;
    const pageLogs = formData.is_fixed_bid ? [] : logs.slice(startIndex, startIndex + logsPerPage);
    const isLastPage = i === totalPages - 1;

    const template = (
      <InvoiceTemplate
        companyInfo={ci}
        formData={{ ...formData, language }}
        logs={logs}
        operators={operators}
        rows={rows}
        prices={prices}
        filteredLogs={pageLogs}
        workTypeMap={workTypeMap}
      />
    );

    const renderedContent = ReactDOMServer.renderToString(template);
    invoiceContent += `<div style="page-break-after: ${isLastPage ? 'auto' : 'always'}">${renderedContent}</div>`;
  }

  if (!invoiceContent) throw new Error('No content rendered for Invoice PDF.');

  const element = document.createElement('div');
  element.innerHTML = invoiceContent;

  const options = {
    margin: [5, 5, 5, 5],
    filename: `invoice-${formData?.invoice_number}-${formData?.name}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  const pdfInstance = html2pdf().set(options).from(element);
  return mode === 'blob' ? pdfInstance.output('blob') : pdfInstance.save();
}

export default function UnifiedInvoicePdf() {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const sampleFormData = {

    name: selectedLanguage === 'tamil' ? 'ஸ்கான் ப்ராஜெக்ட்ஸ் பிரைவேட் லிமிடெட்' :
      selectedLanguage === 'bengali' ? 'স্কন প্রজেক্টস প্রাইভেট লিমিটেড' :
        selectedLanguage === 'marathi' ? 'स्कॉन प्रोजेक्ट्स प्रायव्हेट लिमिटेड' :
          'Scon Projects Private Limited',
    address: selectedLanguage === 'tamil' ? 'வார்ஜே, புனே, மகாராஷ்டிரா - 411058' :
      selectedLanguage === 'bengali' ? 'ওয়ার্জে, পুনে, মহারাষ্ট্র - ৪১১০৫৮' :
        selectedLanguage === 'marathi' ? 'वर्जे, पुणे, महाराष्ट्र - 411058' :
          'Hissa No. 3/1, 3/3, 3/10 S.no. 116, Samarth House, Warje, Pune, Maharashtra - 411058',
    mobile: '9876543210',
    gst_number: '27AAMCS9980N1Z6',

    consignee: {
      name: selectedLanguage === 'tamil' ? 'நோவா இன்ஜினியரிங் சொல்யூஷன்ஸ்' :
        selectedLanguage === 'bengali' ? 'নোভা ইঞ্জিনিয়ারিং সলিউশনস' :
          selectedLanguage === 'marathi' ? 'नोव्हा इंजिनीअरिंग सोल्युशन्स' :
            'Nova Engineering Solutions',
      address: selectedLanguage === 'tamil' ? 'ஹின்ஜேவாடி, புனே, மகாராஷ்டிரா, இந்தியா - 411057' :
        selectedLanguage === 'bengali' ? 'হিন্জেওয়াড়ি, পুনে, মহারাষ্ট্র, ভারত - ৪১১০৫৭' :
          selectedLanguage === 'marathi' ? 'हिंजवडी, पुणे, महाराष्ट्र, भारत - 411057' :
            'Plot No. 5, Hinjewadi Phase 1, Pune, Maharashtra, India - 411057',
      phone_no: '9123456789',
      gst_number: '27XYZCS1234P1Q2',
    },
    DeliveryDate: '2025-09-10',
    workOrder: 'VIB-WO-HO-250912001',
    workOrderDate: '2025-09-01',
    lat: 'Plot No. 5, Hinjewadi Phase 1, Pune, Maharashtra',
    invoice_number: 'INV-2025-003',
    date: '2025-09-01',
    totalAmount: 311400.0,
    finalAmount: 367452.0,
    amountPaid: 100000.0,
    paymentMode: selectedLanguage === 'tamil' ? 'ஆன்லைன்' :
      selectedLanguage === 'bengali' ? 'অনলাইন' :
        selectedLanguage === 'marathi' ? 'ऑनलाइन' :
          'Online',
  };

  const sampleLogs = [
    {
      id: 1,
      project_id: '123',
      machine_id: '1',
      operator_id: '1',
      work_date: '2025-09-01',
      machine_start: 100,
      machine_end: 150,
      actual_machine_hr: 50,
      price_per_hour: 1000,
      mode_id: '1',
    },
    {
      id: 2,
      project_id: '123',
      machine_id: '2',
      operator_id: '2',
      work_date: '2025-09-02',
      machine_start: 200,
      machine_end: 250,
      actual_machine_hr: 50,
      price_per_hour: 1200,
      mode_id: '2',
    },
  ];

  const sampleOperators = [
    { id: '1', name: 'Operator 1' },
    { id: '2', name: 'Operator 2' },
  ];

  const sampleRows = [
    { id: '1', machine_name: 'Excavator' },
    { id: '2', machine_name: 'Bulldozer' },
  ];

  const samplePrices = [
    { id: 1, mode: 'Standard' },
    { id: 2, mode: 'Premium' },
  ];

  // Calculate total amount for sample data
  const totalAmount = sampleLogs.reduce((acc, l) => {
    const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0;
    const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0;
    const total = l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
      ? Number(l.actual_machine_hr)
      : Math.max(0, end - start);
    const price = Number(l.price_per_hour) || 0;
    return acc + total * price;
  }, 0);

  // Convert total amount to words
  const totalInWords = numberToWords(totalAmount, selectedLanguage);

  const handleDownload = () => {
    generateMultiLanguagePDF(
      { ...sampleFormData, totalAmount, totalAmountWords: totalInWords },
      sampleLogs,
      sampleOperators,
      sampleRows,
      samplePrices,
      sampleLogs,
      selectedLanguage,
      'blob'
    ).then(pdfBlob => {
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sampleFormData.invoice_number}-${sampleFormData?.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }).catch(error => {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check the console for details.');
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Professional Tax Invoice Generator (Based on PDF Format)</h2>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{ padding: '5px', fontSize: '16px' }}
        >
          {Object.entries(LANGUAGES).map(([key, lang]) => (
            <option key={key} value={key}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleDownload}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {selectedLanguage === 'tamil' ? 'வரி விலைப்பட்டியல் பதிவிறக்கம்' :
          selectedLanguage === 'bengali' ? 'কর চালান ডাউনলোড' :
            selectedLanguage === 'marathi' ? 'कर चलन डाउनलोड करा' :
              'Download Tax Invoice'}
      </button>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #dee2e6' }}>
        <h3>Updated Features:</h3>
        <ul style={{ marginBottom: '10px' }}>
          <li>✅ Professional Tax Invoice header format</li>
          <li>✅ Separate Buyer and Consignee details sections</li>
          <li>✅ Machine logs table integration</li>
          <li>✅ Multi-language support for all sections</li>
          <li>✅ Multi-page support with 10 logs per page</li>
          <li>✅ Fixed blank PDF issue with proper prop handling</li>
          <li>✅ Added debugging for rendered HTML</li>
          <li>✅ Total amount from table displayed and converted to words</li>
        </ul>
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '3px', border: '1px solid #c3e6cb' }}>
          <strong>Sample Data:</strong> Includes machine logs for testing multi-page functionality.
        </div>
      </div>
      <h3>Invoice Preview:</h3>
      <InvoiceTemplate
        companyInfo={getUserData()?.company_info || {
          company_name: 'Kamthe Enterprises',
          land_mark: 'House No 495',
          Tal: 'Mhalunge Gaon',
          Dist: 'Pune',
          pincode: '411045',
          owner_name: 'Tanaji Gulab Kamthe',
          phone_no: '8055553434',
          email_id: 'tanajikamthe3434@gmail.com',
          gst_number: '27BOTPK6358B1ZL',
          bank_name: 'CANARA BANK',
          branch: 'AUNDH BANER ROAD PUNE',
          account_no: '125004620112',
          IFSC_code: 'CNRB0003334',
          is_gst: true,
        }}
        formData={{ ...sampleFormData, language: selectedLanguage }}
        logs={sampleLogs}
        operators={sampleOperators}
        rows={sampleRows}
        prices={samplePrices}
        filteredLogs={sampleLogs}
        totalInWords={totalInWords}
      />
    </div>
  );
}