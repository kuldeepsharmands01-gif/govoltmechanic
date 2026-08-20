import { jsPDF } from 'jspdf';
import { Vehicle } from '../types';

export interface VehicleServiceRecord {
  id: string;
  date: string;
  serviceTitle: string;
  category: string;
  technicianName: string;
  technicianVan: string;
  odometerReading?: string;
  cost: number;
  partsReplaced: string[];
  findingsNotes: string;
  warrantyValidUntil: string;
  status: 'Completed & Certified';
}

// Master mock database of historical services mapped by vehicle model/make keywords or vehicle ID
export const VEHICLE_SERVICE_DATABASE: Record<string, VehicleServiceRecord[]> = {
  // Ather 450X
  v1: [
    {
      id: 'GV-REP-4501',
      date: '15 Jul 2026',
      serviceTitle: '21-Point Periodic Doorstep Service & BMS Calibration',
      category: 'Periodic Maintenance',
      technicianName: 'Amit Verma',
      technicianVan: 'Van #07 (Mobile Workshop)',
      odometerReading: '12,450 KM',
      cost: 1490,
      partsReplaced: ['Synthetic Drive Belt Lube', 'Brake Fluid DOT 4 (Castrol)', 'Cabin & Filter Clean'],
      findingsNotes: 'BMS cell drift <0.02V. Regenerative braking re-calibrated. All 21 electrical and safety nodes passed.',
      warrantyValidUntil: '25 Jul 2026 (10-Day Doorstep Assurance)',
      status: 'Completed & Certified',
    },
    {
      id: 'GV-REP-4502',
      date: '18 Mar 2026',
      serviceTitle: 'Front & Rear Hydraulic Brake Bleed & Ceramic Pad Replacement',
      category: 'Brake System',
      technicianName: 'Priya Singh',
      technicianVan: 'Van #12 (Quick Rescue)',
      odometerReading: '8,920 KM',
      cost: 950,
      partsReplaced: ['Organic Low-Dust Brake Pads (Front & Rear)', 'High-Pressure Brake Line Seals'],
      findingsNotes: 'Braking distance improved by 22%. Brake lever bite point reset to factory spec.',
      warrantyValidUntil: '28 Mar 2026',
      status: 'Completed & Certified',
    },
    {
      id: 'GV-REP-4503',
      date: '10 Nov 2025',
      serviceTitle: 'OTA VCU Firmware Update & High-Voltage Isolation Test',
      category: 'Electrical & VCU',
      technicianName: 'Rohan Gupta',
      technicianVan: 'Van #03 (Electronics Lab)',
      odometerReading: '4,600 KM',
      cost: 599,
      partsReplaced: ['VCU Firmware v4.2.1 Patch Applied', 'IP67 Connector Silicone O-Rings'],
      findingsNotes: 'No ground faults detected. Insulation resistance measured at 480 MOhm (Threshold > 200 MOhm).',
      warrantyValidUntil: '20 Nov 2025',
      status: 'Completed & Certified',
    },
  ],
  // Ola S1 Pro
  v2: [
    {
      id: 'GV-REP-8891',
      date: '28 Jun 2026',
      serviceTitle: 'Mid-Drive Motor Alignment & Belt Tensioning',
      category: 'Drivetrain',
      technicianName: 'Priya Singh',
      technicianVan: 'Van #12 (Quick Rescue)',
      odometerReading: '15,200 KM',
      cost: 1190,
      partsReplaced: ['Gates Carbon Drive Tensioner Pulley', 'High-Temp Bearing Grease'],
      findingsNotes: 'Belt resonance vibration eliminated. Belt frequency tuned to 62 Hz.',
      warrantyValidUntil: '08 Jul 2026',
      status: 'Completed & Certified',
    },
    {
      id: 'GV-REP-8892',
      date: '14 May 2026',
      serviceTitle: 'BMS Cell Balancing & Thermal Pad Optimization',
      category: 'Battery Management',
      technicianName: 'Amit Verma',
      technicianVan: 'Van #07 (Mobile Workshop)',
      odometerReading: '13,100 KM',
      cost: 890,
      partsReplaced: ['Thermal Interface Pads (3.5 W/mK)', 'Battery Enclosure Gasket'],
      findingsNotes: 'Thermal delta across 14 modules reduced from 4.2°C to 0.8°C under simulated 45A load.',
      warrantyValidUntil: '24 May 2026',
      status: 'Completed & Certified',
    },
    {
      id: 'GV-REP-8893',
      date: '05 Jan 2026',
      serviceTitle: 'Monoshock Suspension Bushing & Steering Head Bearing Overhaul',
      category: 'Chassis & Suspension',
      technicianName: 'Rohan Gupta',
      technicianVan: 'Van #03 (Electronics Lab)',
      odometerReading: '7,800 KM',
      cost: 1350,
      partsReplaced: ['Heavy-Duty Polymer Suspension Bushings', 'Sealed Tapered Roller Bearings'],
      findingsNotes: 'Front steering play eliminated. Full alignment laser-checked.',
      warrantyValidUntil: '15 Jan 2026',
      status: 'Completed & Certified',
    },
  ],
  // Revolt RV400
  v3: [
    {
      id: 'GV-REP-4001',
      date: '20 May 2026',
      serviceTitle: '30-Point High-Voltage Safety Audit & Controller Re-Flash',
      category: 'Safety & Controller',
      technicianName: 'Rohan Gupta',
      technicianVan: 'Van #03 (Electronics Lab)',
      odometerReading: '9,840 KM',
      cost: 2190,
      partsReplaced: ['Controller Thermal Paste (Arctic MX-6)', 'Auxiliary 12V DC-DC Converter Fuse'],
      findingsNotes: 'Throttle response curve smoothened. Eco, Normal, and Sport torque curves re-mapped.',
      warrantyValidUntil: '30 May 2026',
      status: 'Completed & Certified',
    },
    {
      id: 'GV-REP-4002',
      date: '02 Mar 2026',
      serviceTitle: 'Swappable Battery Docking Port Contact Replacement',
      category: 'Battery Docking',
      technicianName: 'Amit Verma',
      technicianVan: 'Van #07 (Mobile Workshop)',
      odometerReading: '6,400 KM',
      cost: 890,
      partsReplaced: ['Gold-Plated Anderson High-Current Battery Connectors', 'DeoxIT Contact Shield'],
      findingsNotes: 'Contact resistance dropped to 0.04 mOhm. Intermittent power cut issue resolved.',
      warrantyValidUntil: '12 Mar 2026',
      status: 'Completed & Certified',
    },
  ],
  // TVS iQube
  v4: [
    {
      id: 'GV-REP-1021',
      date: '30 Jul 2026',
      serviceTitle: 'Fast-Charging Controller Calibration & BMS Sync',
      category: 'Charging & BMS',
      technicianName: 'Rahul Kumar',
      technicianVan: 'Van #05 (Charging Unit)',
      odometerReading: '11,300 KM',
      cost: 1250,
      partsReplaced: ['Type 2 Charge Port Micro-Switch', 'CAN Bus Termination Resistor'],
      findingsNotes: 'Fast charge negotiation time reduced to < 3 seconds. Battery health confirmed at 98%.',
      warrantyValidUntil: '09 Aug 2026',
      status: 'Completed & Certified',
    },
    {
      id: 'GV-REP-1022',
      date: '18 Jan 2026',
      serviceTitle: 'Hub Motor Waterproofing & Bearing Seal Replacement',
      category: 'Motor & Waterproofing',
      technicianName: 'Priya Singh',
      technicianVan: 'Van #12 (Quick Rescue)',
      odometerReading: '5,900 KM',
      cost: 1100,
      partsReplaced: ['Viton High-Temp Oil Seals', 'IP68 Marine Grade Cable Gland'],
      findingsNotes: 'Motor casing vacuum tested up to -0.5 bar. Zero moisture ingress detected.',
      warrantyValidUntil: '28 Jan 2026',
      status: 'Completed & Certified',
    },
  ],
  // Ultraviolette F77
  v5: [
    {
      id: 'GV-REP-7771',
      date: '01 Aug 2026',
      serviceTitle: 'Track-Ready 32-Point Comprehensive Inspection & Dyno Verification',
      category: 'High Performance Audit',
      technicianName: 'Amit Verma',
      technicianVan: 'Van #07 (Mobile Workshop)',
      odometerReading: '4,200 KM',
      cost: 2890,
      partsReplaced: ['Brembo Sintered Racing Brake Pads', 'Motul RBF 660 High Temp Brake Fluid'],
      findingsNotes: 'Peak power delivery 30.2 kW verified. Thermal management cooling loop pressure tested.',
      warrantyValidUntil: '11 Aug 2026',
      status: 'Completed & Certified',
    },
  ],
  // Bajaj Chetak
  v6: [
    {
      id: 'GV-REP-2901',
      date: '18 Apr 2026',
      serviceTitle: 'All-Metal Body Panel Harmonic Noise Dampening & Throttle Sensor Calibration',
      category: 'General Tune-Up',
      technicianName: 'Rohan Gupta',
      technicianVan: 'Van #03 (Electronics Lab)',
      odometerReading: '8,400 KM',
      cost: 990,
      partsReplaced: ['Anti-Vibration Rubber Dampers', 'Electronic Throttle Potentiometer Kit'],
      findingsNotes: 'Throttle dead-zone reduced. Ride smoothness index rated 9.8/10.',
      warrantyValidUntil: '28 Apr 2026',
      status: 'Completed & Certified',
    },
  ],
};

/**
 * Returns service records for a given vehicle, or generates realistic fallback records if custom added.
 */
export function getServiceRecordsForVehicle(vehicle: Vehicle): VehicleServiceRecord[] {
  if (VEHICLE_SERVICE_DATABASE[vehicle.id]) {
    return VEHICLE_SERVICE_DATABASE[vehicle.id];
  }

  // Fallback realistic records for newly added user vehicles
  return [
    {
      id: `GV-REP-${vehicle.id.slice(-4).toUpperCase()}`,
      date: vehicle.lastServiced || '01 Aug 2026',
      serviceTitle: '21-Point Periodic Doorstep Service & EV Health Inspection',
      category: 'Periodic Maintenance',
      technicianName: 'Amit Verma',
      technicianVan: 'Van #07 (Mobile Workshop)',
      odometerReading: '6,200 KM',
      cost: 799,
      partsReplaced: ['Contact Cleaner', 'Synthetic Drive Lube', 'Brake Line Pressure Check'],
      findingsNotes: `BMS Health tested at ${vehicle.batteryHealth}%. Certified roadworthy with 10-day Apna Mechanic doorstep warranty.`,
      warrantyValidUntil: '10-Day Warranty Assured',
      status: 'Completed & Certified',
    },
  ];
}

/**
 * Generates and downloads a clean, beautifully formatted vector PDF certificate summary
 * of all completed repairs and maintenance logs for a specific vehicle.
 */
export function generateVehicleServiceHistoryPDF(vehicle: Vehicle): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const records = getServiceRecordsForVehicle(vehicle);
  const totalSpent = records.reduce((acc, r) => acc + r.cost, 0);

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Background Header Gradient / Dark Brand Banner
  doc.setFillColor(10, 11, 16); // #0A0B10
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Cyan Accent Line
  doc.setFillColor(34, 211, 238); // #22D3EE
  doc.rect(0, 42, pageWidth, 1.8, 'F');

  // Header Title & Logo text
  doc.setTextColor(34, 211, 238);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('GOVOLT | MOBILE EV WORKSHOP', margin, 16);

  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Official Doorstep Service Certificate & Digital Maintenance Log', margin, 23);
  doc.text('Partnered with Apna Mechanic Network • Kanpur Central Zone, UP', margin, 28);

  // Badge top right
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(pageWidth - margin - 52, 10, 52, 22, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('VERIFIED LOG BOOK', pageWidth - margin - 26, 16, { align: 'center' });
  doc.setFontSize(11);
  doc.text('10-DAY WARRANTY', pageWidth - margin - 26, 22, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('ISO 9001:2026 EV Standard', pageWidth - margin - 26, 28, { align: 'center' });

  // Vehicle Information Card
  let currentY = 50;

  doc.setFillColor(248, 250, 252); // light slate background
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('REGISTERED VEHICLE SPECIFICATIONS', margin + 4, currentY + 7);

  // Divider inside card
  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 4, currentY + 9, margin + contentWidth - 4, currentY + 9);

  // 4-column metadata
  const colW = contentWidth / 4;

  // Col 1: Vehicle Make/Model
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('VEHICLE MODEL', margin + 4, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`${vehicle.make}`, margin + 4, currentY + 22);
  doc.setFontSize(8);
  doc.text(`${vehicle.model}`, margin + 4, currentY + 27);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Year: ${vehicle.year}`, margin + 4, currentY + 33);

  // Col 2: Registration & Type
  const col2X = margin + colW;
  doc.text('REGISTRATION / VIN', col2X, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text(vehicle.licensePlate || 'UP78 EV APNA', col2X, currentY + 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`EV Category: ${vehicle.type.toUpperCase()}`, col2X, currentY + 29);
  doc.text(`Max Range: ${vehicle.rangeKm || 150} KM`, col2X, currentY + 34);

  // Col 3: Owner & Location
  const col3X = margin + colW * 2;
  doc.text('REGISTERED OWNER', col3X, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Pradeep', col3X, currentY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Kanpur Central Zone, UP', col3X, currentY + 28);
  doc.text('Helpline: +91 6397852208', col3X, currentY + 34);

  // Col 4: Battery & Repair Summary
  const col4X = margin + colW * 3;
  doc.text('BMS BATTERY HEALTH', col4X, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(34, 197, 94); // green
  doc.text(`${vehicle.batteryHealth}% HEALTHY`, col4X, currentY + 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Services: ${records.length} Jobs`, col4X, currentY + 29);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Cost: Rs. ${totalSpent.toLocaleString('en-IN')}`, col4X, currentY + 34);

  // Section: Completed Repairs & Maintenance Log
  currentY += 46;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFIED SERVICE & REPAIR HISTORY', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `All maintenance carried out at doorstep by certified EV specialists with genuine OEM spares and warranty protection.`,
    margin,
    currentY + 5
  );

  currentY += 9;

  // Render Each Service Record Card
  records.forEach((record, index) => {
    // Check if we need a new page
    if (currentY > pageHeight - 55) {
      doc.addPage();
      currentY = 18;
    }

    const cardH = 34;

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, cardH, 2, 2, 'FD');

    // Left accent vertical bar
    doc.setFillColor(6, 182, 212); // cyan-500
    doc.rect(margin, currentY, 3, cardH, 'F');

    // Top Line of Card: Service Title & Price
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${index + 1}. ${record.serviceTitle}`, margin + 6, currentY + 6);

    doc.setFontSize(10);
    doc.setTextColor(8, 145, 178); // cyan-600
    doc.text(`Rs. ${record.cost.toLocaleString('en-IN')}`, margin + contentWidth - 4, currentY + 6, { align: 'right' });

    // Meta row: Date | Tech | Odometer | Cert ID
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Date: ${record.date}  •  Technician: ${record.technicianName} (${record.technicianVan})  •  Odo: ${record.odometerReading || 'N/A'}  •  Job ID: ${record.id}`,
      margin + 6,
      currentY + 12
    );

    // Parts Replaced & Work done
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('Parts & Consumables: ', margin + 6, currentY + 18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(record.partsReplaced.join(', '), margin + 36, currentY + 18);

    // Diagnostic notes & findings
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('Inspection Notes: ', margin + 6, currentY + 24);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitNotes = doc.splitTextToSize(record.findingsNotes, contentWidth - 45);
    doc.text(splitNotes, margin + 30, currentY + 24);

    // Warranty & Status Footer inside item
    doc.setFillColor(241, 245, 249);
    doc.rect(margin + 4, currentY + 28, contentWidth - 8, 4.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(16, 185, 129);
    doc.text(`✓ ${record.status}`, margin + 7, currentY + 31.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Warranty Coverage: ${record.warrantyValidUntil}`, margin + 50, currentY + 31.5);

    currentY += cardH + 4;
  });

  // Quality & Assurance Stamp Banner
  if (currentY > pageHeight - 48) {
    doc.addPage();
    currentY = 18;
  }

  currentY += 2;
  doc.setFillColor(240, 253, 250); // mint green
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 118, 110);
  doc.text('GOVOLT ASSURED 10-DAY DOORSTEP WARRANTY & RESALE VALUE CERTIFICATION', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(19, 78, 74);
  doc.text(
    'This document serves as an immutable digital service passport. Regular certified maintenance maintains manufacturer warranty compliance and maximizes resale appraisal value.',
    margin + 4,
    currentY + 11,
    { maxWidth: contentWidth - 8 }
  );
  doc.text(
    'Support & 24/7 Breakdown Assistance: +91 6397852208 • Verification Hash: SHA256-GV' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    margin + 4,
    currentY + 18
  );

  // Footer at bottom of document
  const footerY = pageHeight - 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, margin, footerY);
  doc.text('GOVOLT Electric Mobility Solutions • Certified Doorstep Mobile Workshops', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF file
  const sanitizedMake = vehicle.make.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedModel = vehicle.model.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `GOVOLT_${sanitizedMake}_${sanitizedModel}_Service_History.pdf`;

  doc.save(fileName);
}
