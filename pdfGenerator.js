/**
 * PDF Generation Utility for Gas Piping Inspection Report
 * GPS1 Form - Exact Match to Official NYC Form
 * 
 * This generator produces a PDF that exactly matches the official GPS1 form
 * dated 03/21 (March 2021 version)
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';

export const generateInspectionPDF = async (formData, emailDirectly = false) => {
  try {
    const htmlContent = generateHTMLReport(formData);

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (emailDirectly) {
      const isMailAvailable = await MailComposer.isAvailableAsync();
      if (isMailAvailable) {
        await MailComposer.composeAsync({
          recipients: [formData.plumberEmail || 'markhenryplumbing@gmail.com'],
          subject: `Gas Piping Inspection Report - ${formData.ownerName || 'Property'} - ${new Date().toLocaleDateString()}`,
          body: `Please find attached the Gas Piping Inspection Report for:\n\nProperty: ${formData.ownerName}\nAddress: ${formData.houseNo} ${formData.streetName}\n\nInspected by: ${formData.plumberFirstName} ${formData.plumberLastName}\nCompany: ${formData.plumberCompany}\n\nThis report is in compliance with NYC Administrative Code Article 318.`,
          attachments: [uri],
        });
      } else {
        throw new Error('Email composer is not available on this device.');
      }
    } else {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Inspection Report',
          UTI: 'com.adobe.pdf',
        });
      } else {
        throw new Error('Sharing is not available on this device.');
      }
    }

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

const generateHTMLReport = (formData) => {
  const currentDate = new Date().toLocaleDateString();
  const inspectionDate = formData.inspectionDate || currentDate;
  
  // Helper to safely render values
  const val = (v) => (v === undefined || v === null || v === '') ? '' : String(v);
  
  // Checkbox helper - matches GPS1 form
  const checkbox = (checked) => checked ? '☑' : '☐';
  
  // Header helper
  const renderHeader = () => `
    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; position: relative;">
      <div style="width: 140px;">
        <div style="font-family: 'Arial Black', Arial, sans-serif; font-size: 34pt; font-weight: 900; line-height: 0.9; letter-spacing: 0px; color: #000; text-shadow: 1px 0 0 #000, -1px 0 0 #000;">NYC</div>
        <div style="font-family: Arial, sans-serif; font-size: 11pt; font-weight: bold; margin-top: 0px; color: #000;">Buildings</div>
      </div>
      <div style="flex: 1; text-align: center; padding: 0 10px;">
        <div style="font-family: Arial, sans-serif; font-size: 13pt; font-weight: bold; line-height: 1.15; color: #000;">
          GPS1: Gas Piping System<br/>Periodic Inspection Report
        </div>
        <div style="font-family: Arial, sans-serif; font-size: 8pt; font-style: italic; margin-top: 4px; color: #000;">Form must be typewritten.</div>
      </div>
      <div style="width: 100px; text-align: right; padding-top: 2px;">
        <div style="font-family: Arial, sans-serif; font-size: 7pt; line-height: 1.2; color: #000; margin-bottom: 2px;">
          Orient and affix BIS<br/>job number label here
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 5px; margin-top: 3px;">
          <div style="width: 15px; height: 15px; border: 1.5px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11pt; color: #000;">✓</div>
          <div style="width: 15px; height: 15px; border: 1.5px solid #000; display: flex; align-items: center; justify-content: center; font-size: 11pt; color: #000;">✗</div>
        </div>
      </div>
    </div>
  `;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GPS1: Gas Piping System Periodic Inspection Report</title>
  <style>
    @page {
      size: letter;
      margin: 0.45in 0.55in;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #000;
      background: #fff;
    }
    
    .page {
      width: 100%;
      page-break-after: always;
      padding: 0;
      background: #fff;
    }
    
    .page:last-child {
      page-break-after: auto;
    }
    
    /* Section headers with thick box */
    .section-box {
      border: 2.5px solid #000;
      padding: 3px 6px;
      margin: 8px 0 4px 0;
      background-color: #fff;
      display: flex;
      align-items: center;
    }
    
    .section-number {
      font-family: Arial, sans-serif;
      font-size: 14pt;
      font-weight: bold;
      color: #000;
      margin-right: 5px;
      min-width: 18px;
    }
    
    .section-header {
      font-family: Arial, sans-serif;
      font-size: 9pt;
      font-weight: bold;
      color: #000;
      flex: 1;
    }
    
    .section-header-note {
      font-weight: normal;
      font-style: italic;
      font-size: 7pt;
    }
    
    /* Tables - Info Sections (1-3) - No borders, just underlines */
    table.info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 0 4px 0;
      font-family: Arial, sans-serif;
      font-size: 8pt;
      color: #000;
    }
    
    table.info-table td {
      border: none;
      border-bottom: 1px solid #000;
      padding: 2px 3px;
      vertical-align: bottom;
      line-height: 1.15;
    }
    
    table.info-table tr:last-child td {
      border-bottom: 1px solid #000;
    }
    
    .field-label {
      font-family: Arial, sans-serif;
      font-weight: normal;
      font-size: 7pt;
      color: #000;
      padding-right: 2px;
    }
    
    .field-value {
      font-family: Arial, sans-serif;
      font-size: 8pt;
      font-weight: bold;
      color: #000;
      min-height: 14px;
    }
    
    /* Section 4 inspection table specific */
    .inspection-table {
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
      margin: 0 0 4px 0;
      border-collapse: collapse;
    }
    
    .inspection-table td {
      padding: 3px 4px;
      border: 1px solid #000;
      vertical-align: top;
    }
    
    .inspection-table th {
      border: 1px solid #000;
      padding: 3px 4px;
      background-color: #fff;
      font-family: Arial, sans-serif;
      font-weight: bold;
      text-align: left;
      vertical-align: top;
      font-size: 7.5pt;
      color: #000;
      line-height: 1.15;
    }
    
    .category-num {
      text-align: center;
      font-weight: bold;
      width: 25px;
      font-size: 9pt;
      vertical-align: middle;
      padding: 2px;
    }
    
    .category-desc {
      width: 28%;
      padding: 2px 4px;
      vertical-align: top;
    }
    
    .category-details {
      width: auto;
      padding: 2px 4px;
      vertical-align: top;
    }
    
    .checkbox-option {
      margin: 1px 0;
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
      line-height: 1.2;
    }
    
    .or-divider {
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
      margin: 1px 0;
      font-weight: normal;
      color: #000;
    }
    
    .category-title {
      font-family: Arial, sans-serif;
      font-weight: normal;
      font-size: 7.5pt;
      color: #000;
      margin-bottom: 2px;
      line-height: 1.15;
    }
    
    /* Certification text */
    .cert-text {
      font-family: Arial, sans-serif;
      font-size: 6.5pt;
      line-height: 1.2;
      text-align: justify;
      margin: 4px 0;
      color: #000;
    }
    
    /* Signature section - prevent page breaks */
    .signature-section {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-top: 8px;
      margin-bottom: 12px;
      clear: both;
    }
    
    .signature-row {
      display: flex;
      gap: 40px;
      align-items: flex-start;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .signature-block {
      flex: 1;
      min-width: 180px;
    }
    
    .sig-label {
      font-family: Arial, sans-serif;
      font-weight: normal;
      font-size: 7pt;
      margin-top: 4px;
      margin-bottom: 1px;
      color: #000;
    }
    
    .sig-label-name {
      font-family: Arial, sans-serif;
      font-weight: normal;
      font-size: 7pt;
      font-style: italic;
      margin-bottom: 1px;
      color: #000;
    }
    
    .sig-line {
      border-bottom: 1px solid #000;
      padding-bottom: 1px;
      min-height: 16px;
      margin-bottom: 4px;
    }
    
    .sig-name {
      font-family: Arial, sans-serif;
      font-weight: bold;
      font-size: 9pt;
      color: #000;
    }
    
    .date-entry {
      font-family: Arial, sans-serif;
      font-size: 8pt;
      color: #000;
    }
    
    .seal-container {
      flex: none;
      width: 150px;
      page-break-inside: avoid;
      break-inside: avoid;
      text-align: center;
    }
    
    .seal-label {
      font-family: Arial, sans-serif;
      font-weight: normal;
      font-size: 7pt;
      font-style: italic;
      margin-bottom: 6px;
      line-height: 1.1;
      color: #000;
    }
    
    .seal-box {
      border: 1.5px dotted #000;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      position: relative;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    /* Footer */
    .page-footer {
      font-family: Arial, sans-serif;
      font-size: 8pt;
      margin-top: 10px;
      text-align: right;
      color: #000;
    }
    
    /* Additional Comments box */
    .comments-box {
      border: 1px solid #000;
      min-height: 60px;
      padding: 4px;
      margin: 0 0 6px 0;
      font-family: Arial, sans-serif;
      font-size: 8pt;
      color: #000;
      background: #fff;
    }
    
    @media print {
      .page {
        page-break-inside: avoid;
      }
      
      .inspection-table {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .signature-section,
      .signature-row,
      .seal-container,
      .seal-box {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .section-box {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page">
  ${renderHeader()}
  
  <!-- Section 1: Location Information -->
  <div class="section-box">
    <div class="section-number">1</div>
    <div class="section-header">Location Information <span class="section-header-note">(required for all reports)</span></div>
  </div>
  <table class="info-table">
    <tr>
      <td style="width: 12%;" class="field-label">House No(s)</td>
      <td style="width: 18%;" class="field-value">${val(formData.houseNo)}</td>
      <td style="width: 12%;" class="field-label">Street Name</td>
      <td style="width: 25%;" class="field-value">${val(formData.streetName)}</td>
      <td style="width: 10%;" class="field-label">Owner Name:</td>
      <td style="width: 23%;" class="field-value">${val(formData.ownerName)}</td>
    </tr>
    <tr>
      <td class="field-label">Borough</td>
      <td class="field-value">${val(formData.borough)}</td>
      <td class="field-label">Block</td>
      <td class="field-value">${val(formData.block)}</td>
      <td class="field-label">Lot</td>
      <td class="field-value">${val(formData.lot)}</td>
    </tr>
    <tr>
      <td class="field-label">Number of Stories</td>
      <td class="field-value">${val(formData.numberOfStories)}</td>
      <td class="field-label">Total Number of Meters:</td>
      <td class="field-value">${val(formData.numberOfMeters)}</td>
      <td class="field-label">Total Number of Active Meters:</td>
      <td class="field-value">${val(formData.activeMeters)}</td>
    </tr>
  </table>
  
  <!-- Section 2: Licensed Master Plumber Information -->
  <div class="section-box">
    <div class="section-number">2</div>
    <div class="section-header">Licensed Master Plumber Information <span class="section-header-note">(required for all reports; fax and mobile telephone are optional)</span></div>
  </div>
  <table class="info-table">
    <tr>
      <td style="width: 15%;" class="field-label">Last Name</td>
      <td style="width: 20%;" class="field-value">${val(formData.plumberLastName || 'JOZWIK')}</td>
      <td style="width: 15%;" class="field-label">First Name</td>
      <td style="width: 20%;" class="field-value">${val(formData.plumberFirstName || 'MARK')}</td>
      <td style="width: 15%;" class="field-label">Middle Initial</td>
      <td class="field-value" style="font-size: 8pt;">${val(formData.plumberMiddleName || 'H')}</td>
    </tr>
    <tr>
      <td class="field-label">Business Name</td>
      <td colspan="3" class="field-value">${val(formData.plumberCompany || 'MARK HENRY PLUMBING AND HEATING CORP')}</td>
      <td class="field-label">Business Telephone</td>
      <td class="field-value">${val(formData.plumberPhone || '347 354 2727')}</td>
    </tr>
    <tr>
      <td class="field-label">Business Address</td>
      <td colspan="3" class="field-value">${val(formData.plumberAddress || '104-24 JAMAICA AVENUE')}</td>
      <td class="field-label">Business Fax</td>
      <td class="field-value">${val(formData.plumberFax || '')}</td>
    </tr>
    <tr>
      <td class="field-label">City</td>
      <td class="field-value">${val(formData.plumberCity || 'RICHMOND HILL')}</td>
      <td class="field-label">State</td>
      <td class="field-value">${val(formData.plumberState || 'NY')}</td>
      <td class="field-label">Zip</td>
      <td class="field-value">${val(formData.plumberZip || '11418')}</td>
    </tr>
    <tr>
      <td colspan="3" class="field-label">Mobile Telephone</td>
      <td colspan="3" class="field-value">${val(formData.plumberCellPhone || '718 306 7926')}</td>
    </tr>
    <tr>
      <td class="field-label">Email</td>
      <td colspan="5" class="field-value">${val(formData.plumberEmail || 'MARKHENRYPLUMBING@GMAIL.COM')}</td>
    </tr>
    <tr>
      <td class="field-label">License Number</td>
      <td class="field-value">${val(formData.plumberLicense || '2513')}</td>
      <td colspan="4"></td>
    </tr>
  </table>
  
  <!-- Section 3: Individual Performing Inspection -->
  <div class="section-box">
    <div class="section-number">3</div>
    <div class="section-header">Individual Performing Inspection (Qualified Individual) Information <span class="section-header-note">(required where a qualified individual performed inspection under LMP supervision; fax and mobile telephone are optional)</span></div>
  </div>
  <table class="info-table">
    <tr>
      <td style="width: 15%;" class="field-label">Last Name</td>
      <td style="width: 20%;" class="field-value">${val(formData.indLastName || '')}</td>
      <td style="width: 15%;" class="field-label">First Name</td>
      <td style="width: 20%;" class="field-value">${val(formData.indFirstName || '')}</td>
      <td style="width: 15%;" class="field-label">Middle Initial</td>
      <td class="field-value" style="font-size: 8pt;">${val(formData.indMiddleName || '')}</td>
    </tr>
    <tr>
      <td class="field-label">Business Name</td>
      <td colspan="3" class="field-value">${val(formData.indBusinessName || '')}</td>
      <td class="field-label">Business Telephone</td>
      <td class="field-value">${val(formData.indBusinessPhone || '')}</td>
    </tr>
    <tr>
      <td class="field-label">Business Address</td>
      <td colspan="3" class="field-value">${val(formData.indBusinessAddress || '')}</td>
      <td class="field-label">Business Fax</td>
      <td class="field-value">${val(formData.indBusinessFax || '')}</td>
    </tr>
    <tr>
      <td class="field-label">City</td>
      <td class="field-value">${val(formData.indCity || '')}</td>
      <td class="field-label">State</td>
      <td class="field-value">${val(formData.indState || '')}</td>
      <td class="field-label">Zip</td>
      <td class="field-value">${val(formData.indZip || '')}</td>
    </tr>
    <tr>
      <td colspan="3" class="field-label">Mobile Telephone</td>
      <td colspan="3" class="field-value">${val(formData.indMobile || '')}</td>
    </tr>
    <tr>
      <td class="field-label">Email</td>
      <td colspan="5" class="field-value">${val(formData.indEmail || '')}</td>
    </tr>
    <tr>
      <td class="field-label">Employer Name:</td>
      <td colspan="5" class="field-value">${val(formData.employerName || '')}</td>
    </tr>
  </table>
  
  <!-- Section 4: Certification of Inspection Results (Categories 1-4 only on Page 1) -->
  <div class="section-box">
    <div class="section-number">4</div>
    <div class="section-header">Certification of Inspection Results <span class="section-header-note">(required for all reports)</span></div>
  </div>
  <table class="inspection-table">
    <tr>
      <th class="category-num" style="text-align: center;">Relevant Category</th>
      <th class="category-desc" style="text-align: left;">Check only <strong>one</strong> for each relevant category</th>
      <th class="category-details" style="text-align: left;">List conditions observed for each category (e.g., floor number & location of condition(s) observed, etc.). Attach additional sheets if necessary.</th>
    </tr>
    <tr>
      <td class="category-num" rowspan="2" style="vertical-align: middle;">1</td>
      <td class="category-desc">
        <div class="category-title">Improper Use of Flex Hose</div>
      </td>
      <td class="category-details" rowspan="2" style="vertical-align: top;">Conditions observed:<br/>${val(formData.improperFlexHoseDetails)}</td>
    </tr>
    <tr>
      <td class="category-desc" style="padding-left: 20px;">
        <div class="checkbox-option">${checkbox(formData.improperFlexHose === 'no')} No Condition(s) Observed</div>
        <div class="or-divider">or</div>
        <div class="checkbox-option">${checkbox(formData.improperFlexHose === 'yes')} Condition(s) Observed</div>
      </td>
    </tr>
    <tr>
      <td class="category-num" rowspan="2" style="vertical-align: middle;">2</td>
      <td class="category-desc">
        <div class="category-title">Evidence of Illegal Connections/Non-Code Compliant Installations</div>
      </td>
      <td class="category-details" rowspan="2" style="vertical-align: top;">Conditions observed:<br/>${val(formData.illegalConnectionsDetails)}</td>
    </tr>
    <tr>
      <td class="category-desc" style="padding-left: 20px;">
        <div class="checkbox-option">${checkbox(formData.illegalConnections === 'no')} No Condition(s) Observed</div>
        <div class="or-divider">or</div>
        <div class="checkbox-option">${checkbox(formData.illegalConnections === 'yes')} Condition(s) Observed</div>
      </td>
    </tr>
    <tr>
      <td class="category-num" rowspan="2" style="vertical-align: middle;">3</td>
      <td class="category-desc">
        <div class="category-title">Gas Leak (0.1% gas or more in air)</div>
      </td>
      <td class="category-details" rowspan="2" style="vertical-align: top;">Conditions observed:<br/>${val(formData.gasLeakDetails)}</td>
    </tr>
    <tr>
      <td class="category-desc" style="padding-left: 20px;">
        <div class="checkbox-option">${checkbox(formData.gasLeak === 'no')} No Condition(s) Observed</div>
        <div class="or-divider">or</div>
        <div class="checkbox-option">${checkbox(formData.gasLeak === 'yes')} Condition(s) Observed</div>
      </td>
    </tr>
    <tr>
      <td class="category-num" rowspan="2" style="vertical-align: middle;">4</td>
      <td class="category-desc">
        <div class="category-title">Worn Part(s) Affecting Safe and Reliable Operation</div>
      </td>
      <td class="category-details" rowspan="2" style="vertical-align: top;">Conditions observed:<br/>${val(formData.wornPartsDetails)}</td>
    </tr>
    <tr>
      <td class="category-desc" style="padding-left: 20px;">
        <div class="checkbox-option">${checkbox(formData.wornPartsAffectingSafety === 'no')} No Condition(s) Observed</div>
        <div class="or-divider">or</div>
        <div class="checkbox-option">${checkbox(formData.wornPartsAffectingSafety === 'yes')} Condition(s) Observed</div>
      </td>
    </tr>
  </table>
  
  <div class="page-footer">03/21</div>
</div>

<!-- PAGE 2 -->
<div class="page">
  ${renderHeader()}
  
  <!-- Section 4 Continued: Category 5 -->
  <table class="inspection-table">
    <tr>
      <th class="category-num" style="text-align: center;">Relevant Category</th>
      <th class="category-desc" style="text-align: left;">Check only <strong>one</strong> for each relevant category</th>
      <th class="category-details" style="text-align: left;">List conditions observed for each category (e.g., floor number & location of condition(s) observed, etc.). Attach additional sheets if necessary.</th>
    </tr>
    <tr>
      <td class="category-num" rowspan="2" style="vertical-align: middle;">5</td>
      <td class="category-desc">
        <div class="category-title">Other Unsafe Condition(s)</div>
      </td>
      <td class="category-details" rowspan="2" style="vertical-align: top;">Conditions observed:<br/>${val(formData.otherUnsafeDetails)}</td>
    </tr>
    <tr>
      <td class="category-desc" style="padding-left: 20px;">
        <div class="checkbox-option">${checkbox(formData.otherUnsafeConditions === 'no')} No Condition(s) Observed</div>
        <div class="or-divider">or</div>
        <div class="checkbox-option">${checkbox(formData.otherUnsafeConditions === 'yes')} Condition(s) Observed</div>
      </td>
    </tr>
  </table>
  
  <!-- 5 Additional Comments -->
  <div class="section-box">
    <div class="section-number">5</div>
    <div class="section-header">Additional Comments</div>
  </div>
  <div class="comments-box">${val(formData.additionalComments)}</div>
  
  <!-- Section 6: Certification of Licensed Master Plumber -->
  <div class="section-box">
    <div class="section-number">6</div>
    <div class="section-header">Certification of Licensed Master Plumber <span class="section-header-note">(required for all reports)</span></div>
  </div>
  <div class="cert-text">
    I hereby state that I have personally inspected, or the individual identified in Section 7 of this form has inspected under my direct and continuing supervision, the gas piping system(s) of the building listed herein pursuant to Article 318 of Title 28 of the New York City Administrative Code and Section 103-10 of Title 1 of the Rules of the City of New York and in accordance with all applicable Code, rules, bulletins and laws. Furthermore, I have personally reviewed the contents of this form and hereby affirm that all statements and information contained herein are correct and complete to the best of my knowledge. I understand that a copy of this inspection report must be submitted to the building owner/owner’s authorized representative no later than 30 days from the date this inspection was performed. 
  </div>
  <div class="cert-text">
    Falsification of any statement is a misdemeanor under §§28-211.1, 28-201.2.1(2), and 28-203.1(1) of the NYC Administrative Code and is punishable by a fine or imprisonment, or both. I understand that if I am found after hearing to have knowingly or negligently made a false statement or to have knowingly or negligently falsified or allowed to be falsified any certificate, form, signed statement, application, report or certification of the correction of a violation required under the provisions of the New York City Administrative Code or of a rule of any agency, I may be barred from filing further applications or documents with the Department.  It is unlawful to give to a City employee, or for a City employee to accept, any benefit, monetary or otherwise, either as a gratuity for properly performing the job or in exchange for special consideration.  Violation is punishable by imprisonment or fine or both.  
  </div>
  
  <div class="signature-section">
    <div class="signature-row">
      <div class="signature-block">
        <div class="sig-label-name">Name <span style="font-style: italic;">(please print)</span></div>
        <div class="sig-line">
          <div class="sig-name">${val(formData.plumberFirstName || 'MARK')} ${val(formData.plumberLastName || 'JOZWIK')}</div>
        </div>
        
        <div class="sig-label">Signature</div>
        <div class="sig-line"></div>
        
        <div class="sig-label">Date</div>
        <div class="sig-line">
          <div class="date-entry">${inspectionDate}</div>
        </div>
      </div>
      
      <div class="seal-container">
        <div class="seal-label">LMP Seal <span style="font-style: italic;">(apply seal, then sign and date over seal)</span></div>
        <div class="seal-box"></div>
      </div>
    </div>
  </div>
  
  <!-- Section 7: Certification of Individual Performing Inspection -->
  <div class="section-box">
    <div class="section-number">7</div>
    <div class="section-header">Certification of Individual Performing Inspection <span class="section-header-note">(required where a Non-LMP performed inspection under LMP supervision)</span></div>
  </div>
  <div class="cert-text">
    I hereby state that I have personally inspected, under the direct and continuing supervision of the licensed master plumber identified in section 6 of this form, the gas piping system(s) of the building listed herein pursuant to Article 318 of Title 28 of the New York City Administrative Code and Section 103-10 of Title 1 of the Rules of the City of New York and in accordance with all applicable code, rules, bulletins and laws.  Furthermore, I have personally reviewed the contents of this form and hereby affirm that all statements and information contained herein are correct and complete to the best of my knowledge. 
  </div>
  <div class="cert-text">
    Falsification of any statement is a misdemeanor under §§28-211.1, 28-201.2.1(2), and 28-203.1(1) of the NYC Administrative Code and is punishable by a fine or imprisonment, or both. I understand that if I am found after hearing to have knowingly or negligently made a false statement or to have knowingly or negligently falsified or allowed to be falsified any certificate, form, signed statement, application, report or certification of the correction of a violation required under the provisions of the New York City Administrative Code or of a rule of any agency, I may be barred from filing further applications or documents with the Department. It is unlawful to give to a City employee, or for a City employee to accept, any benefit, monetary or otherwise, either as a gratuity for properly performing the job or in exchange for special consideration.  Violation is punishable by imprisonment or fine or both.  
  </div>
  
  <div class="signature-section">
    <div class="signature-row">
      <div class="signature-block">
        <div class="sig-label-name">Name <span style="font-style: italic;">(please print)</span></div>
        <div class="sig-line">
          <div class="sig-name">${val(formData.indFirstName || '')} ${val(formData.indLastName || '')}</div>
        </div>
        
        <div class="sig-label">Signature</div>
        <div class="sig-line"></div>
        
        <div class="sig-label">Date</div>
        <div class="sig-line">
          <div class="date-entry">${val(formData.indDate || '')}</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="page-footer">03/21</div>
</div>

</body>
</html>
  `;
};

export default generateInspectionPDF;