/**
 * PDF Generation Utility for Gas Piping Inspection Reports
 * 
 * To use this in production:
 * 1. Install required packages:
 *    npm install expo-print expo-sharing expo-mail-composer expo-file-system
 * 
 * 2. Import this function in App.js:
 *    import { generateInspectionPDF } from './pdfGenerator';
 * 
 * 3. Replace the generatePDF function with:
 *    const generatePDF = async () => {
 *      await generateInspectionPDF(formData);
 *    };
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';

export const generateInspectionPDF = async (formData, emailDirectly = false) => {
  try {
    // Generate HTML content for PDF
    const htmlContent = generateHTMLReport(formData);

    // Create PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (emailDirectly) {
      // Direct email option
      const isMailAvailable = await MailComposer.isAvailableAsync();
      
      if (isMailAvailable) {
        await MailComposer.composeAsync({
          recipients: [formData.plumberEmail || 'markhenryplumbing@gmail.com'],
          subject: `Gas Piping Inspection Report - ${formData.ownerName || 'Property'} - ${new Date().toLocaleDateString()}`,
          body: `Please find attached the Gas Piping Inspection Report for:\n\nProperty: ${formData.ownerName}\nAddress: ${formData.houseNo} ${formData.streetName}\nBorough: ${formData.borough || 'N/A'}\n\nInspected by: ${formData.plumberFirstName} ${formData.plumberLastName}\nCompany: ${formData.plumberCompany}\n\nThis report is in compliance with NYC Administrative Code Article 318.`,
          attachments: [uri],
        });
      } else {
        throw new Error('Email composer is not available on this device.');
      }
    } else {
      // Share option (includes email, messages, save to files, etc.)
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
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Gas Piping System Periodic Inspection Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #333;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #2196F3;
          padding-bottom: 15px;
        }
        
        .header h1 {
          color: #2196F3;
          font-size: 20pt;
          margin-bottom: 5px;
        }
        
        .header p {
          color: #666;
          font-size: 10pt;
        }
        
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .section-title {
          background-color: #2196F3;
          color: white;
          padding: 10px 15px;
          font-size: 13pt;
          font-weight: bold;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .info-item {
          padding: 8px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .info-label {
          font-weight: bold;
          color: #555;
          font-size: 9pt;
          margin-bottom: 3px;
        }
        
        .info-value {
          color: #333;
          font-size: 11pt;
        }
        
        .inspection-item {
          background-color: #f5f5f5;
          padding: 12px;
          margin-bottom: 10px;
          border-left: 4px solid #2196F3;
          border-radius: 4px;
        }
        
        .inspection-item h4 {
          color: #2196F3;
          margin-bottom: 8px;
          font-size: 11pt;
        }
        
        .inspection-result {
          margin-bottom: 8px;
        }
        
        .result-label {
          font-weight: bold;
          display: inline-block;
          min-width: 120px;
        }
        
        .result-value {
          display: inline-block;
          padding: 2px 8px;
          background-color: #e3f2fd;
          border-radius: 3px;
        }
        
        .result-yes {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .result-no {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .details-box {
          background-color: white;
          padding: 10px;
          margin-top: 8px;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-size: 10pt;
        }
        
        .certification-list {
          list-style: none;
          padding: 0;
        }
        
        .certification-list li {
          padding: 10px;
          margin-bottom: 8px;
          background-color: #f9f9f9;
          border-left: 3px solid #4CAF50;
          border-radius: 3px;
        }
        
        .certification-list li.checked::before {
          content: "✓ ";
          color: #4CAF50;
          font-weight: bold;
          font-size: 13pt;
          margin-right: 8px;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
          text-align: center;
          font-size: 9pt;
          color: #666;
        }
        
        .signature-section {
          margin-top: 30px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        
        .signature-line {
          border-top: 2px solid #333;
          margin-top: 40px;
          padding-top: 5px;
          width: 300px;
        }
        
        @media print {
          body {
            padding: 15px;
          }
          
          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Gas Piping System Periodic Inspection Report</h1>
        <p>Report Generated: ${currentDate}</p>
      </div>

      <!-- Location Information -->
      <div class="section">
        <div class="section-title">Location Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">House Number(s)</div>
            <div class="info-value">${formData.houseNo || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Street Name</div>
            <div class="info-value">${formData.streetName || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Owner Name</div>
            <div class="info-value">${formData.ownerName || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Borough</div>
            <div class="info-value">${formData.borough || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Block</div>
            <div class="info-value">${formData.block || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Lot</div>
            <div class="info-value">${formData.lot || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">BIN</div>
            <div class="info-value">${formData.bin || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Community Board No.</div>
            <div class="info-value">${formData.communityBoard || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Number of Stories</div>
            <div class="info-value">${formData.numberOfStories || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Number of Meters</div>
            <div class="info-value">${formData.numberOfMeters || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Active Meters</div>
            <div class="info-value">${formData.activeMeters || 'N/A'}</div>
          </div>
        </div>
      </div>

      <!-- Inspector Information -->
      <div class="section">
        <div class="section-title">Inspector Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${formData.plumberFirstName} ${formData.plumberMiddleName}. ${formData.plumberLastName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Company</div>
            <div class="info-value">${formData.plumberCompany}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone</div>
            <div class="info-value">${formData.plumberPhone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Cell Phone</div>
            <div class="info-value">${formData.plumberCellPhone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${formData.plumberEmail}</div>
          </div>
          <div class="info-item">
            <div class="info-label">License Number</div>
            <div class="info-value">${formData.plumberLicense}</div>
          </div>
          <div class="info-item" style="grid-column: 1 / -1;">
            <div class="info-label">Address</div>
            <div class="info-value">${formData.plumberAddress}, ${formData.plumberCity}, ${formData.plumberState} ${formData.plumberZip}</div>
          </div>
        </div>
      </div>

      <!-- Inspection Results -->
      <div class="section">
        <div class="section-title">Inspection Results</div>

        <div class="inspection-item">
          <h4>LMP200 Equipment Check</h4>
          <div class="inspection-result">
            <span class="result-label">Device turned on outside:</span>
            <span class="result-value ${formData.lmp200TurnedOn === 'yes' ? 'result-no' : 'result-yes'}">
              ${formData.lmp200TurnedOn === 'yes' ? 'YES' : 'NO'}
            </span>
          </div>
        </div>

        <div class="inspection-item">
          <h4>Worn Part(s) Affecting Safe and Reliable Operation</h4>
          <div class="inspection-result">
            <span class="result-label">Conditions Observed:</span>
            <span class="result-value ${formData.wornPartsAffectingSafety === 'yes' ? 'result-yes' : 'result-no'}">
              ${formData.wornPartsAffectingSafety === 'yes' ? 'YES' : 'NO'}
            </span>
          </div>
          ${formData.wornPartsDetails ? `<div class="details-box"><strong>Details:</strong><br>${formData.wornPartsDetails}</div>` : ''}
        </div>

        <div class="inspection-item">
          <h4>Other Unsafe Condition(s)</h4>
          <div class="inspection-result">
            <span class="result-label">Conditions Observed:</span>
            <span class="result-value ${formData.otherUnsafeConditions === 'yes' ? 'result-yes' : 'result-no'}">
              ${formData.otherUnsafeConditions === 'yes' ? 'YES' : 'NO'}
            </span>
          </div>
          ${formData.otherUnsafeDetails ? `<div class="details-box"><strong>Details:</strong><br>${formData.otherUnsafeDetails}</div>` : ''}
        </div>

        <div class="inspection-item">
          <h4>Gas Leak (0.1% gas or more in air)</h4>
          <div class="inspection-result">
            <span class="result-label">Leak Detected:</span>
            <span class="result-value ${formData.gasLeak === 'yes' ? 'result-yes' : 'result-no'}">
              ${formData.gasLeak === 'yes' ? 'YES' : 'NO'}
            </span>
          </div>
          ${formData.gasLeakDetails ? `<div class="details-box"><strong>Details:</strong><br>${formData.gasLeakDetails}</div>` : ''}
        </div>

        <div class="inspection-item">
          <h4>Improper Use of Flex Hose</h4>
          <div class="inspection-result">
            <span class="result-label">Conditions Observed:</span>
            <span class="result-value ${formData.improperFlexHose === 'yes' ? 'result-yes' : 'result-no'}">
              ${formData.improperFlexHose === 'yes' ? 'YES' : 'NO'}
            </span>
          </div>
          ${formData.improperFlexHoseDetails ? `<div class="details-box"><strong>Details:</strong><br>${formData.improperFlexHoseDetails}</div>` : ''}
        </div>

        <div class="inspection-item">
          <h4>Evidence of Illegal Connections / Non-Code Compliant Installations</h4>
          <div class="inspection-result">
            <span class="result-label">Conditions Observed:</span>
            <span class="result-value ${formData.illegalConnections2 === 'yes' ? 'result-yes' : 'result-no'}">
              ${formData.illegalConnections2 === 'yes' ? 'YES' : 'NO'}
            </span>
          </div>
          ${formData.illegalConnections2Details ? `<div class="details-box"><strong>Details:</strong><br>${formData.illegalConnections2Details}</div>` : ''}
        </div>
      </div>

      <!-- Additional Comments -->
      ${formData.additionalComments ? `
      <div class="section">
        <div class="section-title">Additional Comments</div>
        <div class="details-box">
          ${formData.additionalComments}
        </div>
      </div>
      ` : ''}

      <!-- Certifications -->
      <div class="section">
        <div class="section-title">Certifications</div>
        
        <div class="info-item" style="margin-bottom: 20px;">
          <div class="info-label">Date of Initial Inspection</div>
          <div class="info-value">${formData.inspectionDate || currentDate}</div>
        </div>

        <ul class="certification-list">
          ${formData.noGasPiping ? '<li class="checked">Building contains no gas piping system</li>' : ''}
          ${formData.personalInspection ? '<li class="checked">Inspector personally performed inspection pursuant to Article 318 of Title 28 of the NYC Administrative Code</li>' : ''}
          ${formData.directSupervision ? '<li class="checked">Inspector exercised direct and continuing supervision over individual who performed the required inspection</li>' : ''}
        </ul>

        ${formData.certificationOption === 'noConditions' ? '<p style="margin-top:15px; padding:10px; background:#e8f5e9; border-left:4px solid #4CAF50;"><strong>✓ No conditions requiring correction were identified</strong></p>' : ''}
        ${formData.certificationOption === 'conditionsIdentified' ? '<p style="margin-top:15px; padding:10px; background:#fff3e0; border-left:4px solid #ff9800;"><strong>⚠ Conditions requiring correction were identified</strong></p>' : ''}
        ${formData.certificationOption === 'additionalTime' ? '<p style="margin-top:15px; padding:10px; background:#fff3e0; border-left:4px solid #ff9800;"><strong>⚠ Correction will take additional time (180 days from original inspection date)</strong></p>' : ''}
        ${formData.certificationOption === 'allCorrected' ? '<p style="margin-top:15px; padding:10px; background:#e8f5e9; border-left:4px solid #4CAF50;"><strong>✓ All identified conditions have been corrected</strong></p>' : ''}
      </div>

      <!-- Signature Section -->
      <div class="signature-section">
        <p><strong>Inspector Signature</strong></p>
        <div class="signature-line">
          <p>${formData.plumberFirstName} ${formData.plumberLastName}</p>
          <p style="font-size:9pt; color:#666;">License: ${formData.plumberLicense}</p>
        </div>
      </div>

      <div class="footer">
        <p><strong>Gas Piping System Periodic Inspection Report</strong></p>
        <p>${formData.plumberCompany}</p>
        <p>Generated on ${currentDate}</p>
        <p style="margin-top:10px; font-size:8pt;">This report is generated in compliance with NYC Administrative Code Article 318</p>
      </div>
    </body>
    </html>
  `;
};

export default generateInspectionPDF;
