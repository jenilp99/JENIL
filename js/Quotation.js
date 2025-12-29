// Initialize quotation counter in localStorage
function initQuotationCounter() {
    if (!localStorage.getItem('quotationCounter')) {
        localStorage.setItem('quotationCounter', '0');
    }
}

// Get next quotation number
function getNextQuotationNumber() {
    initQuotationCounter();
    let counter = parseInt(localStorage.getItem('quotationCounter')) + 1;
    localStorage.setItem('quotationCounter', counter.toString());
    const year = new Date().getFullYear();
    return `TRM/QT/${year}/${String(counter).padStart(5, '0')}`;
}

function generateQuotation() {
    const projectSelector = document.getElementById('projectSelector');
    const selectedProject = projectSelector.value;
    
    if (!selectedProject) {
        alert('⚠️ Please select a project first!');
        return;
    }
    
    const projectWindows = windows.filter(w => w.projectName === selectedProject);
    
    if (projectWindows.length === 0) {
        alert('⚠️ No windows found for this project!');
        return;
    }
    
    // Show quotation input dialog
    showQuotationInputDialog(projectWindows, selectedProject);
}

function showQuotationInputDialog(projectWindows, selectedProject) {
    const { jsPDF } = window.jspdf;
    
    const userQuoteNo = prompt('Enter Quotation Number (leave blank for auto-generated):', '');
    const quoteNo = (userQuoteNo && userQuoteNo.trim()) ? userQuoteNo.trim() : getNextQuotationNumber();
    
    const requestingDept = prompt('Enter Requesting Department:', 'Maintenance Department');
    const dept = (requestingDept && requestingDept.trim()) ? requestingDept.trim() : 'Maintenance Department';
    
    generateQuotationPDF(projectWindows, selectedProject, quoteNo, dept);
}

function generateQuotationPDF(projectWindows, selectedProject, quoteNo, requestingDept) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const quoteDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const validUntil = new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    let currentY = 20;
    
    // ========== HEADER ==========
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('NIRUMA', 14, currentY);
    
    currentY += 8;
    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    doc.text('ALUMINUM SECTIONS', 14, currentY);
    
    currentY += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 140, 141);
    doc.text('Premium Aluminum Profiles & Fabrication', 14, currentY);
    
    // Right side
    doc.setFontSize(9);
    doc.setTextColor(52, 73, 94);
    doc.text('Aluminium Section', 200, 20, { align: 'right' });
    doc.text('Adalaj, Gandhinagar, Gujarat', 200, 25, { align: 'right' });
    doc.text('Phone: +91 90999 99887', 200, 30, { align: 'right' });
    
    currentY = 45;
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(14, currentY, 196, currentY);
    
    // ========== QUOTATION HEADER ==========
    currentY += 8;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('INTERNAL QUOTATION', 14, currentY);
    
    currentY += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(52, 73, 94);
    
    doc.text(`Quotation No: ${quoteNo}`, 14, currentY);
    doc.text(`Date: ${quoteDate}`, 14, currentY + 5);
    doc.text(`Valid Until: ${validUntil}`, 14, currentY + 10);
    doc.text(`Project: ${selectedProject}`, 14, currentY + 15);
    
    doc.text('Requesting Department:', 120, currentY);
    doc.text(requestingDept, 120, currentY + 5);
    doc.text('Contact: [Department Head]', 120, currentY + 10);
    
    currentY += 25;
    
    // ========== WINDOW DETAILS WITH DIAGRAMS ==========
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text('Window Configuration Details', 14, currentY);
    
    currentY += 8;
    
    // Convert SVG to PNG helper function
    function svgToPng(svgString, width, height) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            const img = new Image();
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            img.onload = function() {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                const pngData = canvas.toDataURL('image/png');
                URL.revokeObjectURL(url);
                resolve(pngData);
            };
            
            img.onerror = function(err) {
                URL.revokeObjectURL(url);
                reject(err);
            };
            
            img.src = url;
        });
    }
    
    // Generate and convert all diagrams
    const diagramPromises = projectWindows.map((window) => {
        const svg = generateWindowDiagram({
            tracks: window.tracks,
            shutters: window.shutters,
            mosquitoShutters: window.mosquitoShutters,
            width: window.width,
            height: window.height,
            windowId: window.configId
        });
        return svgToPng(svg, 200, 140);
    });
    
    Promise.all(diagramPromises).then(pngImages => {
        // Create table with images
        const windowTableData = projectWindows.map((window, idx) => [
            idx + 1,
            '', // Placeholder for diagram
            window.configId,
            `${window.tracks}T${window.shutters}S${window.mosquitoShutters > 0 ? window.mosquitoShutters + 'MS' : ''}`,
            window.description || '-',
            `${window.width} × ${window.height}`,
            window.series
        ]);
        
        doc.autoTable({
            startY: currentY,
            head: [['#', 'Diagram', 'ID', 'Type', 'Description', 'Size (mm)', 'Series']],
            body: windowTableData,
            theme: 'grid',
            headStyles: { 
                fillColor: [52, 152, 219],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 8
            },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 45, halign: 'center', valign: 'middle' },
                2: { cellWidth: 15, halign: 'center' },
                3: { cellWidth: 30, halign: 'center' },
                4: { cellWidth: 40 },
                5: { cellWidth: 25, halign: 'center' },
                6: { cellWidth: 20, halign: 'center' }
            },
            didDrawCell: function(data) {
                if (data.column.index === 1 && data.cell.section === 'body') {
                    const rowIndex = data.row.index;
                    if (pngImages[rowIndex]) {
                        const cellX = data.cell.x + 2;
                        const cellY = data.cell.y + (data.cell.height - 35) / 2;
                        doc.addImage(pngImages[rowIndex], 'PNG', cellX, cellY, 40, 30);
                    }
                }
            },
            minCellHeight: 40
        });
        
        currentY = doc.lastAutoTable.finalY + 10;
        
        // ========== COST SUMMARY ==========
        if (optimizationResults && optimizationResults.project === selectedProject) {
            const r = optimizationResults;
            
            if (currentY > 240) {
                doc.addPage();
                currentY = 20;
            }
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(46, 125, 50);
            doc.text('Cost Summary', 14, currentY);
            
            currentY += 8;
            
            const materialCost = parseFloat(r.stats.totalCost || 0);
            const laborCharges = (materialCost * 0.10).toFixed(0);
            const transportation = 500;
            const subtotal = (materialCost + parseFloat(laborCharges) + transportation).toFixed(0);
            const gst = (parseFloat(subtotal) * 0.18).toFixed(0);
            const grandTotal = (parseFloat(subtotal) + parseFloat(gst)).toFixed(0);
            
            const costData = [
                ['Material Cost (Aluminum Profiles)', `₹ ${materialCost.toFixed(0)}`],
                ['Labor/Fabrication Charges (10%)', `₹ ${laborCharges}`],
                ['Transportation (Internal)', `₹ ${transportation}`],
                ['Subtotal', `₹ ${subtotal}`],
                ['GST @ 18%', `₹ ${gst}`],
                ['Grand Total', `₹ ${grandTotal}`]
            ];
            
            doc.autoTable({
                startY: currentY,
                body: costData,
                theme: 'plain',
                bodyStyles: {
                    fontSize: 10
                },
                columnStyles: {
                    0: { cellWidth: 140, fontStyle: 'bold', textColor: [52, 73, 94] },
                    1: { cellWidth: 44, halign: 'right', fontStyle: 'bold', textColor: [52, 73, 94] }
                },
                didParseCell: function(data) {
                    if (data.row.index === 5) {
                        data.cell.styles.fillColor = [46, 125, 50];
                        data.cell.styles.textColor = [255, 255, 255];
                        data.cell.styles.fontSize = 11;
                    }
                    if (data.row.index === 3) {
                        data.cell.styles.fillColor = [236, 240, 241];
                    }
                }
            });
            
            currentY = doc.lastAutoTable.finalY + 5;
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(127, 140, 141);
            doc.text(`(Rupees ${numberToWords(grandTotal)} Only)`, 14, currentY);
        }
        
        // ========== SAVE PDF ==========
        doc.save(`Quotation_${selectedProject}_${quoteDate.replace(/\//g, '-')}.pdf`);
        
        alert(`✅ Quotation generated successfully!\n\nQuotation No: ${quoteNo}\nProject: ${selectedProject}\nWindows: ${projectWindows.length}\nDepartment: ${requestingDept}`);
        
    }).catch(err => {
        console.error('Error processing diagrams:', err);
        alert('⚠️ Error generating diagrams. Please try again.');
    });
}

// ============================================================================
// WINDOW DIAGRAM GENERATOR - SVG BASED
// ============================================================================

function generateWindowDiagram(config) {
    // config = { tracks: 2, shutters: 2, mosquitoShutters: 1, width: 1143, height: 1121, windowId: "W1" }
    
    const svgWidth = 200;
    const svgHeight = 140;
    const frameThickness = 8;
    const trackWidth = 10;
    const shutterGap = 3;
    
    // Calculate proportional window size maintaining aspect ratio
    const aspectRatio = config.width / config.height;
    let windowWidth = 200;
    let windowHeight = 200 / aspectRatio;
    
    if (windowHeight > 130) {
        windowHeight = 130;
        windowWidth = 130 * aspectRatio;
    }
    
    const startX = (svgWidth - windowWidth) / 2;
    const startY = 25;
    
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Title - Include mosquito shutter info
    const typeStr = `${config.tracks}T${config.shutters}S${config.mosquitoShutters > 0 ? config.mosquitoShutters + 'MS' : ''}`;
    svg += `<text x="${svgWidth/2}" y="12" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#2c3e50">${config.windowId} - ${typeStr}</text>`;
    
    // Draw outer frame
    svg += `<rect x="${startX}" y="${startY}" width="${windowWidth}" height="${windowHeight}" 
            fill="#d5d8dc" stroke="#34495e" stroke-width="${frameThickness}" rx="4"/>`;
    
    // Top frame shadow
    svg += `<rect x="${startX}" y="${startY}" width="${windowWidth}" height="${frameThickness * 1.5}" 
            fill="#34495e" opacity="0.4"/>`;
    
    // Bottom sill
    svg += `<rect x="${startX}" y="${startY + windowHeight - frameThickness}" 
            width="${windowWidth}" height="${frameThickness}" fill="#34495e" opacity="0.4"/>`;
    
    // Draw tracks
    const trackStartY = startY + frameThickness * 1.5;
    const trackHeight = windowHeight - frameThickness * 2.5;
    
    for (let i = 0; i < config.tracks; i++) {
        const trackX = startX + frameThickness + (i * trackWidth * 0.7);
        
        svg += `<rect x="${trackX}" y="${startY + 3}" width="${trackWidth}" height="${frameThickness}" 
                fill="#7f8c8d" stroke="#5d6d7e" stroke-width="0.5" opacity="0.6" rx="1"/>`;
        
        svg += `<text x="${trackX + trackWidth/2}" y="${startY - 2}" text-anchor="middle" 
                font-family="Arial, sans-serif" font-size="7" fill="#5d6d7e" font-weight="bold">T${i+1}</text>`;
    }
    
    // Draw shutters
    const availableWidth = windowWidth - frameThickness * 2;
    const shutterWidth = (availableWidth - (config.shutters - 1) * shutterGap) / config.shutters;
    
    for (let i = 0; i < config.shutters; i++) {
        const shutterX = startX + frameThickness + (i * (shutterWidth + shutterGap));
        const shutterY = trackStartY;
        const shutterHeight = trackHeight;
        
        // Shutter frame
        svg += `<rect x="${shutterX}" y="${shutterY}" width="${shutterWidth}" height="${shutterHeight}" 
                fill="#ffffff" stroke="#3498db" stroke-width="2.5" rx="2"/>`;
        
        // Glass area
        svg += `<rect x="${shutterX + 4}" y="${shutterY + 4}" width="${shutterWidth - 8}" height="${shutterHeight - 8}" 
                fill="#e8f4f8" stroke="#85c1e9" stroke-width="1" rx="1"/>`;
        
        // Glass reflection
        svg += `<rect x="${shutterX + 6}" y="${shutterY + 6}" width="${shutterWidth - 12}" height="${shutterHeight * 0.25}" 
                fill="white" opacity="0.4"/>`;
        
        // Horizontal mullions
        const mullionCount = Math.max(2, Math.floor(shutterHeight / 50));
        for (let m = 1; m < mullionCount; m++) {
            const mullionY = shutterY + (shutterHeight * m / mullionCount);
            svg += `<line x1="${shutterX + 4}" y1="${mullionY}" x2="${shutterX + shutterWidth - 4}" y2="${mullionY}" 
                    stroke="#3498db" stroke-width="2"/>`;
        }
        
        // Vertical mullion for wider shutters
        if (shutterWidth > 40) {
            svg += `<line x1="${shutterX + shutterWidth/2}" y1="${shutterY + 4}" 
                    x2="${shutterX + shutterWidth/2}" y2="${shutterY + shutterHeight - 4}" 
                    stroke="#3498db" stroke-width="2"/>`;
        }
        
        // Handle
        const handleX = shutterX + shutterWidth - 10;
        const handleY = shutterY + shutterHeight / 2;
        svg += `<rect x="${handleX}" y="${handleY - 6}" width="5" height="12" 
                fill="#2c3e50" rx="1.5"/>`;
        svg += `<circle cx="${handleX + 2.5}" cy="${handleY}" r="2" fill="#34495e"/>`;
        
        // Shutter label
        svg += `<text x="${shutterX + shutterWidth/2}" y="${shutterY + 18}" text-anchor="middle" 
                font-family="Arial, sans-serif" font-size="11" fill="#2980b9" font-weight="bold">S${i+1}</text>`;
        
        // Sliding arrow
        const arrowY = shutterY + shutterHeight - 15;
        if (i % 2 === 0) {
            svg += `<path d="M ${shutterX + shutterWidth/2 - 8},${arrowY} L ${shutterX + shutterWidth/2 + 4},${arrowY} 
                    L ${shutterX + shutterWidth/2},${arrowY - 4} M ${shutterX + shutterWidth/2 + 4},${arrowY} 
                    L ${shutterX + shutterWidth/2},${arrowY + 4}" 
                    stroke="#e74c3c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
        } else {
            svg += `<path d="M ${shutterX + shutterWidth/2 + 8},${arrowY} L ${shutterX + shutterWidth/2 - 4},${arrowY} 
                    L ${shutterX + shutterWidth/2},${arrowY - 4} M ${shutterX + shutterWidth/2 - 4},${arrowY} 
                    L ${shutterX + shutterWidth/2},${arrowY + 4}" 
                    stroke="#e74c3c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
        }
    }
    
    // Mosquito shutter indicator
    if (config.mosquitoShutters > 0) {
        svg += `<circle cx="${svgWidth - 8}" cy="8" r="5" fill="#e74c3c"/>`;
        svg += `<text x="${svgWidth - 8}" y="11" text-anchor="middle" 
                font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">MS</text>`;
    }
    
    svg += '</svg>';
    
    return svg;
}

// ============================================================================
// HELPER: NUMBER TO WORDS (INDIAN SYSTEM)
// ============================================================================

function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    
    num = parseInt(num);
    
    if (num >= 10000000) {
        const crore = Math.floor(num / 10000000);
        const remainder = num % 10000000;
        return numberToWords(crore) + ' Crore ' + (remainder > 0 ? numberToWords(remainder) : '');
    }
    
    if (num >= 100000) {
        const lakh = Math.floor(num / 100000);
        const remainder = num % 100000;
        return numberToWords(lakh) + ' Lakh ' + (remainder > 0 ? numberToWords(remainder) : '');
    }
    
    if (num >= 1000) {
        const thousand = Math.floor(num / 1000);
        const remainder = num % 1000;
        return numberToWords(thousand) + ' Thousand ' + (remainder > 0 ? numberToWords(remainder) : '');
    }
    
    if (num >= 100) {
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        return ones[hundred] + ' Hundred ' + (remainder > 0 ? numberToWords(remainder) : '');
    }
    
    if (num >= 20) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    
    if (num >= 10) {
        return teens[num - 10];
    }
    
    return ones[num];
}
