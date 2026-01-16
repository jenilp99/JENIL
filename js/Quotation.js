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

// Helper to get next quotation number
function getNextQuotationNumber() {
    let lastNo = localStorage.getItem('lastQuoteNo') || 1000;
    lastNo = parseInt(lastNo) + 1;
    localStorage.setItem('lastQuoteNo', lastNo);
    return `QT-${lastNo}`;
}

function generateQuotation() {
    const projectSelector = document.getElementById('projectSelector');
    const selectedProject = projectSelector.value;

    if (!selectedProject) {
        showAlert('⚠️ Please select a project first!');
        return;
    }

    // Show confirmation if optimization hasn't been run for current project
    if (!optimizationResults || !optimizationResults.results || optimizationResults.project !== selectedProject) {
        showConfirm('⚠️ Users can generate quotations anytime, but quantities will be more accurate after running Smart Optimization!\n\nDo you want to proceed with estimated quantities?', () => {
            const projectWindows = windows.filter(w => w.projectName === selectedProject);
            if (projectWindows.length === 0) {
                showAlert('⚠️ No windows found for this project!');
                return;
            }
            showQuotationInputDialog(projectWindows, selectedProject);
        });
        return;
    }

    const projectWindows = windows.filter(w => w.projectName === selectedProject);

    if (projectWindows.length === 0) {
        showAlert('⚠️ No windows found for this project!');
        return;
    }

    // Verify sections configured
    if (!verifySectionsConfigured()) return;

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

// PDF EXPORT FUNCTIONS (STUBS/IMPLEMENTATIONS)
function generateMaterialPurchaseListPDF(projectWindows, selectedProject) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`Material Purchase List: ${selectedProject}`, 14, 20);

    const body = [];
    for (const [key, data] of Object.entries(optimizationResults.results)) {
        const section = optimizationResults.componentSections ? optimizationResults.componentSections[key] : null;
        body.push([
            section ? section.sectionNo : '-',
            key,
            data.length,
            formatInchesToFeet(data[0].stockLength),
            (data.reduce((sum, p) => sum + (section ? section.weight : 0), 0)).toFixed(2)
        ]);
    }

    doc.autoTable({
        startY: 30,
        head: [['Section No', 'Description', 'Qty', 'Length', 'Weight (Kg)']],
        body: body,
        theme: 'grid'
    });
    doc.save(`Material_Purchase_${selectedProject}.pdf`);
}

function generateHardwarePurchaseListPDF(projectWindows, selectedProject) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`Hardware Purchase List: ${selectedProject}`, 14, 20);

    const hardwareMap = aggregateProjectHardware(projectWindows, optimizationResults);
    const body = Object.entries(hardwareMap).map(([name, data]) => [
        name, Math.ceil(data.qty), data.unit
    ]);

    doc.autoTable({
        startY: 30,
        head: [['Hardware Item', 'Qty', 'Unit']],
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96] }
    });
    doc.save(`Hardware_Purchase_${selectedProject}.pdf`);
}

function generateOptimizedCutListPDF(projectWindows, selectedProject) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let currentY = 20;
    doc.text(`Workshop Cut List: ${selectedProject}`, 14, currentY);
    currentY += 10;

    for (const [key, plans] of Object.entries(optimizationResults.results)) {
        if (currentY > 260) { doc.addPage(); currentY = 20; }
        doc.setFontSize(12);
        doc.text(`Material: ${key}`, 14, currentY);
        currentY += 7;

        const body = plans.map((p, idx) => [
            idx + 1,
            p.stockLength + '"',
            p.pieces.map(pc => pc.length + '" (' + pc.label + ')').join(', '),
            p.waste.toFixed(2) + '"'
        ]);

        doc.autoTable({
            startY: currentY,
            head: [['Stick', 'Stock', 'Cut Sequence', 'Waste']],
            body: body,
            theme: 'striped',
            styles: { fontSize: 8 }
        });
        currentY = doc.lastAutoTable.finalY + 10;
    }
    doc.save(`CutList_${selectedProject}.pdf`);
}

function showReportPreview(type) {
    const projectSelector = document.getElementById('projectSelector');
    const selectedProject = projectSelector.value;

    if (!selectedProject) {
        showAlert('⚠️ Please select a project first!');
        return;
    }

    const projectWindows = windows.filter(w => w.projectName === selectedProject);
    if (projectWindows.length === 0) {
        showAlert('⚠️ No windows found for this project!');
        return;
    }

    // Toggle Preview Section
    const previewSection = document.getElementById('section-preview');
    previewSection.style.display = 'block';
    scrollToSection('section-preview');

    const previewContent = document.getElementById('reportPreviewContent');
    let html = '';

    if (type === 'quotation') {
        html = generateQuotationHTML(projectWindows, selectedProject);
        document.getElementById('downloadExportBtn').onclick = () => generateQuotationPDF(projectWindows, selectedProject, getNextQuotationNumber(), 'Maintenance');
    } else if (type === 'purchase_material') {
        html = generateMaterialPurchaseHTML(projectWindows, selectedProject);
        document.getElementById('downloadExportBtn').onclick = () => generateMaterialPurchaseListPDF(projectWindows, selectedProject);
    } else if (type === 'purchase_hardware') {
        html = generateHardwarePurchaseHTML(projectWindows, selectedProject);
        document.getElementById('downloadExportBtn').onclick = () => generateHardwarePurchaseListPDF(projectWindows, selectedProject);
    } else if (type === 'cutlist') {
        html = generateCutListHTML(projectWindows, selectedProject);
        document.getElementById('downloadExportBtn').onclick = () => generateOptimizedCutListPDF(projectWindows, selectedProject);
    }

    previewContent.innerHTML = html;
}

function closeExportPreview() {
    document.getElementById('section-preview').style.display = 'none';
    scrollToSection('section-results');
}

function generatePurchaseListPDF() {
    const projectSelector = document.getElementById('projectSelector');
    const selectedProject = projectSelector.value;

    if (!selectedProject) {
        showAlert('⚠️ Please select a project first!');
        return;
    }

    // Show confirmation if optimization hasn't been run for current project
    if (!optimizationResults || !optimizationResults.results || optimizationResults.project !== selectedProject) {
        showConfirm('⚠️ Users can generate purchase lists anytime, but quantities will be more accurate after running Smart Optimization!\n\nDo you want to proceed with estimated quantities?', () => {
            const projectWindows = windows.filter(w => w.projectName === selectedProject);
            if (projectWindows.length === 0) {
                showAlert('⚠️ No windows found for this project!');
                return;
            }
            _continueGeneratePurchaseList(projectWindows, selectedProject);
        });
        return;
    }

    const projectWindows = windows.filter(w => w.projectName === selectedProject);

    if (projectWindows.length === 0) {
        showAlert('⚠️ No windows found for this project!');
        return;
    }

    // Verify sections configured
    if (!verifySectionsConfigured()) return;

    _continueGeneratePurchaseList(projectWindows, selectedProject);
}

function _continueGeneratePurchaseList(projectWindows, selectedProject) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    let currentY = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const quoteDate = new Date().toLocaleDateString('en-GB');

    // ========== HEADER ==========
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text('NIRUMA - Aluminium Section', 14, currentY);

    currentY += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Trimandir Trust, Fatepura, Nadiad - 387001, Gujarat', 14, currentY);

    currentY += 4;
    doc.text('Ph: +91 90999 99887', 14, currentY);

    currentY += 8;
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(0.5);
    doc.line(14, currentY, pageWidth - 14, currentY);

    currentY += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text('Hardware / Purchase List', 14, currentY);

    currentY += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Project: ${selectedProject}`, 14, currentY);

    currentY += 4;
    doc.text(`Date: ${quoteDate}`, 14, currentY);

    currentY += 4;
    doc.text(`Total Windows: ${projectWindows.length}`, 14, currentY);

    currentY += 8;

    // ========== ALUMINIUM SECTION PURCHASE LIST ==========
    if (optimizationResults && optimizationResults.results) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(46, 125, 50);
        doc.text('Aluminium Profile Purchase List (Sticks)', 14, currentY);
        currentY += 6;

        const sectionData = [];
        let totalSticks = 0;
        let totalWeight = 0;

        Object.entries(optimizationResults.results).forEach(([material, data]) => {
            const stockItems = data.stockUsage || [];
            stockItems.forEach(stock => {
                const stockInfo = findStockInfo(material, stock.stockLength);
                const weightPerStick = stockInfo ? (stockInfo.weight || 0) : 0;
                const sectionNo = stockInfo ? (stockInfo.sectionNo || 'N/A') : 'N/A';
                const thickness = stockInfo ? (stockInfo.thickness || 0) : 0;
                const totalW = stock.qty * weightPerStick;

                sectionData.push([
                    material,
                    sectionNo,
                    thickness > 0 ? `${thickness} mm` : 'N/A',
                    `${stock.qty} pcs`,
                    `${stock.stockLength}"`,
                    weightPerStick > 0 ? `${weightPerStick.toFixed(3)} Kg` : 'N/A',
                    totalW > 0 ? `${totalW.toFixed(3)} Kg` : 'N/A'
                ]);

                totalSticks += stock.qty;
                totalWeight += totalW;
            });
        });

        doc.autoTable({
            startY: currentY,
            head: [['Material', 'Sec No.', 'T', 'Qty', 'Len', 'Wt/Stick', 'Total Wt']],
            body: sectionData,
            theme: 'grid',
            headStyles: { fillColor: [46, 125, 50] },
            styles: { fontSize: 8 }
        });

        currentY = doc.lastAutoTable.finalY + 8;
        doc.setFontSize(10);
        doc.text(`Total Sticks: ${totalSticks} | Total Approx Weight: ${totalWeight.toFixed(2)} Kg`, 14, currentY);
        currentY += 10;
    }

    // ========== PURCHASE LIST TABLE (HARDWARE) ==========
    const purchaseListData = generatePurchaseListTable(projectWindows, optimizationResults);
    const hardwareTotalCost = calculatePurchaseListTotal(projectWindows, optimizationResults);

    doc.autoTable({
        startY: currentY,
        head: [['Hardware Item', 'Qty', 'Unit', 'Rate (₹)', 'Cost (₹)']],
        body: purchaseListData,
        theme: 'grid',
        headStyles: {
            fillColor: [46, 125, 50],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 8
        },
        columnStyles: {
            0: { cellWidth: 90, halign: 'left' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
        }
    });

    currentY = doc.lastAutoTable.finalY + 5;

    // ========== TOTALS ==========
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text(`Total Hardware Cost: Rs. ${hardwareTotalCost.toFixed(0)}`, 14, currentY);

    // ========== SAVE PDF ==========
    doc.save(`PurchaseList_${selectedProject}_${quoteDate.replace(/\//g, '-')}.pdf`);

    showAlert(`✅ Purchase List generated successfully!\n\nProject: ${selectedProject}\nWindows: ${projectWindows.length}\nHardware Cost: Rs. ${hardwareTotalCost.toFixed(0)}`);
}

function generateQuotationPDF(projectWindows, selectedProject, quoteNo, requestingDept) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const quoteDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const validUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

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

            img.onload = function () {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                const pngData = canvas.toDataURL('image/png');
                URL.revokeObjectURL(url);
                resolve(pngData);
            };

            img.onerror = function (err) {
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

        // Calculate required cell height for diagrams
        // SVG Source: 200px width × 140px height = aspect ratio 1.4286:1
        // PDF rendering width: 40pt
        // Calculate height maintaining aspect ratio: height = width / (svgWidth / svgHeight)
        const svgSourceWidth = 200;
        const svgSourceHeight = 140;
        const pdfDiagramWidth = 40;
        const aspectRatio = svgSourceWidth / svgSourceHeight;
        const diagramWidth = pdfDiagramWidth;
        const diagramHeight = Math.round(pdfDiagramWidth / aspectRatio); // 40 / 1.4286 ≈ 28pt

        // Cell height = diagram height + padding (top 15 + bottom 15) + border buffer (6)
        const cellPaddingVertical = 30;
        const borderBuffer = 6;
        const requiredCellHeight = diagramHeight + cellPaddingVertical + borderBuffer;

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
            didDrawCell: function (data) {
                if (data.column.index === 1 && data.cell.section === 'body') {
                    const rowIndex = data.row.index;
                    if (pngImages[rowIndex]) {
                        const cellX = data.cell.x + 2;
                        const cellY = data.cell.y + (data.cell.height - diagramHeight) / 2;
                        doc.addImage(pngImages[rowIndex], 'PNG', cellX, cellY, diagramWidth, diagramHeight);
                    }
                }
            },
            minCellHeight: requiredCellHeight
        });

        currentY = doc.lastAutoTable.finalY + 15;

        // ========== COST BIFURCATION TABLE ==========
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('Project Cost Bifurcation', 14, currentY);
        currentY += 6;

        let grandTotal = 0;
        const summaryRows = [];

        projectWindows.forEach(win => {
            const glass = calculateGlassDimensions(win);
            const glassRate = glass ? (ratesConfig.glass[win.glassType] || 0) : 0;
            const glassCost = glass ? glass.area * glass.qty * glassRate : 0;
            const hardware = calculateWindowHardware(win, optimizationResults);
            const hardwareCost = hardware.reduce((sum, h) => sum + h.total, 0);

            let pcCost = 0;
            let wt = 0;
            if (optimizationResults && optimizationResults.results) {
                for (const [key, data] of Object.entries(optimizationResults.results)) {
                    let purchasedLenForWindow = 0;
                    let weightForWindow = 0;
                    let compName = key.includes('|') ? key.split('|')[1].trim() : key;
                    const pcRate = ratesConfig.powderCoating[compName] || 1;

                    data.forEach(plan => {
                        const stockLen = parseFloat(plan.stock);
                        const totalUsedInStick = plan.used;
                        if (totalUsedInStick <= 0) return;

                        plan.pieces.forEach(p => {
                            if (p.label && p.label.startsWith(win.configId)) {
                                const shareRatio = p.length / totalUsedInStick;
                                purchasedLenForWindow += shareRatio * stockLen;

                                const sec = optimizationResults.componentSections ? optimizationResults.componentSections[key] : null;
                                if (sec && sec.weight) {
                                    // Weight is per 12ft (144"), but we purchased stockLen
                                    const stickWeight = (stockLen / 144) * sec.weight;
                                    weightForWindow += shareRatio * stickWeight;
                                }
                            }
                        });
                    });

                    pcCost += (purchasedLenForWindow / 12) * pcRate;
                    wt += weightForWindow;
                }
            }
            const profCost = wt * (typeof aluminumRate !== 'undefined' ? aluminumRate : 280);
            const sub = profCost + pcCost + glassCost + hardwareCost;
            grandTotal += sub;

            summaryRows.push([
                win.configId,
                wt.toFixed(2),
                profCost.toFixed(0),
                pcCost.toFixed(0),
                glassCost.toFixed(0),
                hardwareCost.toFixed(0),
                sub.toFixed(0)
            ]);
        });

        doc.autoTable({
            startY: currentY,
            head: [['ID', 'Wt(Kg)', 'Profile', 'Coating', 'Glass', 'Hard.', 'Total']],
            body: summaryRows,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 8, halign: 'right' },
            columnStyles: { 0: { halign: 'left' } }
        });

        currentY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(44, 62, 80);
        doc.rect(140, currentY, 56, 12, 'F');
        doc.text(`Total: Rs. ${grandTotal.toFixed(0)}`, 142, currentY + 8);

        doc.save(`Quotation_${selectedProject}_${quoteNo}.pdf`);
        showAlert(`✅ Quotation generated successfully!\nNo: ${quoteNo}`);
    }).catch(err => {
        console.error(err);
        showAlert('Error generating PDF');
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
    svg += `<text x="${svgWidth / 2}" y="12" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#2c3e50">${config.windowId} - ${typeStr}</text>`;

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

        // Top track
        svg += `<rect x="${trackX}" y="${startY + 3}" width="${trackWidth}" height="${frameThickness}" 
                fill="#7f8c8d" stroke="#5d6d7e" stroke-width="0.5" opacity="0.6" rx="1"/>`;

        svg += `<text x="${trackX + trackWidth / 2}" y="${startY - 2}" text-anchor="middle" 
                font-family="Arial, sans-serif" font-size="7" fill="#5d6d7e" font-weight="bold">T${i + 1}</text>`;
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
            svg += `<line x1="${shutterX + shutterWidth / 2}" y1="${shutterY + 4}" 
                    x2="${shutterX + shutterWidth / 2}" y2="${shutterY + shutterHeight - 4}" 
                    stroke="#3498db" stroke-width="2"/>`;
        }

        // Handle - Only on corner shutters (first and last)
        // First shutter: lock on left side, Last shutter: lock on right side
        if (i === 0) {
            // First shutter - lock on LEFT side
            const handleX = shutterX + 5;
            const handleY = shutterY + shutterHeight / 2;
            svg += `<rect x="${handleX}" y="${handleY - 6}" width="5" height="12" 
                    fill="#2c3e50" rx="1.5"/>`;
            svg += `<circle cx="${handleX + 2.5}" cy="${handleY}" r="2" fill="#34495e"/>`;
        } else if (i === config.shutters - 1) {
            // Last shutter - lock on RIGHT side
            const handleX = shutterX + shutterWidth - 10;
            const handleY = shutterY + shutterHeight / 2;
            svg += `<rect x="${handleX}" y="${handleY - 6}" width="5" height="12" 
                    fill="#2c3e50" rx="1.5"/>`;
            svg += `<circle cx="${handleX + 2.5}" cy="${handleY}" r="2" fill="#34495e"/>`;
        }

        // Shutter label
        svg += `<text x="${shutterX + shutterWidth / 2}" y="${shutterY + 18}" text-anchor="middle" 
                font-family="Arial, sans-serif" font-size="11" fill="#2980b9" font-weight="bold">S${i + 1}</text>`;

        // Sliding arrow - shows direction of shutter movement toward center
        const arrowY = shutterY + shutterHeight - 15;
        if (i === 0) {
            // First shutter - arrow points RIGHT (slides right)
            svg += `<path d="M ${shutterX + shutterWidth / 2 - 8},${arrowY} L ${shutterX + shutterWidth / 2 + 4},${arrowY} 
                    L ${shutterX + shutterWidth / 2},${arrowY - 4} M ${shutterX + shutterWidth / 2 + 4},${arrowY} 
                    L ${shutterX + shutterWidth / 2},${arrowY + 4}" 
                    stroke="#e74c3c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
        } else if (i === config.shutters - 1) {
            // Last shutter - arrow points LEFT (slides left)
            svg += `<path d="M ${shutterX + shutterWidth / 2 + 8},${arrowY} L ${shutterX + shutterWidth / 2 - 4},${arrowY} 
                    L ${shutterX + shutterWidth / 2},${arrowY - 4} M ${shutterX + shutterWidth / 2 - 4},${arrowY} 
                    L ${shutterX + shutterWidth / 2},${arrowY + 4}" 
                    stroke="#e74c3c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
        } else {
            // Middle shutters - alternating directions
            if (i % 2 === 0) {
                svg += `<path d="M ${shutterX + shutterWidth / 2 - 8},${arrowY} L ${shutterX + shutterWidth / 2 + 4},${arrowY} 
                        L ${shutterX + shutterWidth / 2},${arrowY - 4} M ${shutterX + shutterWidth / 2 + 4},${arrowY} 
                        L ${shutterX + shutterWidth / 2},${arrowY + 4}" 
                        stroke="#e74c3c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
            } else {
                svg += `<path d="M ${shutterX + shutterWidth / 2 + 8},${arrowY} L ${shutterX + shutterWidth / 2 - 4},${arrowY} 
                        L ${shutterX + shutterWidth / 2},${arrowY - 4} M ${shutterX + shutterWidth / 2 - 4},${arrowY} 
                        L ${shutterX + shutterWidth / 2},${arrowY + 4}" 
                        stroke="#e74c3c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
            }
        }
    }

    // Mosquito shutter indicator
    if (config.mosquitoShutters > 0) {
        svg += `<circle cx="${svgWidth - 8}" cy="8" r="5" fill="#e74c3c"/>`;
        svg += `<text x="${svgWidth - 8}" y="11" text-anchor="middle" 
                font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">MS</text>`;
    }

    // Draw bottom tracks last so they appear on top (visible)
    for (let i = 0; i < config.tracks; i++) {
        const trackX = startX + frameThickness + (i * trackWidth * 0.7);
        svg += `<rect x="${trackX}" y="${startY + windowHeight - frameThickness - 2}" width="${trackWidth}" height="${frameThickness}" 
                fill="#7f8c8d" stroke="#5d6d7e" stroke-width="0.5" opacity="0.6" rx="1"/>`;
    }

    svg += '</svg>';

    return svg;
}

// ============================================================================
// HARDWARE CALCULATIONS
// ============================================================================

// Safe evaluation helper for hardware formulas
function safeEval(formula, context, defaultValue = 0) {
    try {
        const { W, H, S, MS, T, P, GL, F, VW, TW, MW, BW } = context;
        // Use Function constructor for isolation and safety
        const fn = new Function('W', 'H', 'S', 'MS', 'T', 'P', 'GL', 'F', 'VW', 'TW', 'MW', 'BW', `return ${formula}`);
        const result = fn(W, H, S, MS, T, P, GL, F, VW, TW, MW, BW);
        return isNaN(result) ? defaultValue : result;
    } catch (e) {
        console.error('SafeEval Error (Hardware):', e, 'Formula:', formula);
        return defaultValue;
    }
}

function calculateWindowHardware(window, optimizationResults = null) {
    /**
     * Calculate hardware quantities for a single window based on series
     * Returns object with hardware items and their quantities
     */
    const series = window.series;
    const shutters = window.shutters || 0;
    const mosquitoShutters = window.mosquitoShutters || 0;
    const width = window.width || 0;
    const height = window.height || 0;

    // Helper to get total length of a material for this window from optimization results
    const GL = (materialName) => {
        if (!optimizationResults || !optimizationResults.results) return 0;
        let total = 0;

        // The results are now keyed by "Series | Material"
        const expectedKey = `${series} | ${materialName}`.toLowerCase();
        const fallbackKey = materialName.toLowerCase(); // For backward compatibility

        for (const [key, plans] of Object.entries(optimizationResults.results)) {
            const lowerKey = key.toLowerCase();
            if (lowerKey === expectedKey || lowerKey === fallbackKey) {
                plans.forEach(plan => {
                    plan.pieces.forEach(piece => {
                        if (piece.label && piece.label.startsWith(window.configId)) {
                            total += piece.length;
                        }
                    });
                });
            }
        }
        return total;
    };

    // Get hardware items for this series
    let hardwareList = hardwareMaster[series];
    if (!hardwareList) {
        // Fallback for migrated names
        if (series === '1') hardwareList = hardwareMaster['1"'];
        else if (series === '1"') hardwareList = hardwareMaster['1'];
    }

    if (!hardwareList) {
        console.warn(`No hardware items found for series: ${series}`);
        return [];
    }

    const context = {
        W: window.width,
        H: window.height,
        S: window.shutters,
        MS: window.mosquitoShutters || 0,
        T: window.tracks,
        F: window.frame || 0, // Frame for doors (1=YES, 0=NO)
        // Profile widths for doors (stored in mm, convert to inches)
        VW: (window.verticalWidth || 47.5) / 25.4,
        TW: (window.topWidth || 47.5) / 25.4,
        MW: (window.middleWidth || 47.5) / 25.4,
        BW: (window.bottomWidth || 85) / 25.4,
        P: (window.width * 2 + window.height * 2),
        GL: GL // Passing the helper function itself
    };

    let results = [];

    hardwareList.forEach(item => {
        let quantity = safeEval(item.formula, context, 0);

        // Round quantity to 2 decimal places to prevent floating point issues in reports
        quantity = Math.round(quantity * 100) / 100;

        if (quantity > 0) {
            results.push({
                hardware: item.hardware,
                qty: quantity,
                unit: item.unit,
                rate: item.rate,
                total: Math.round(quantity * item.rate * 100) / 100
            });
        }
    });

    // Add Glass Rubber automatically if glass is selected
    const glass = calculateGlassDimensions(window);
    if (glass) {
        const rubberFeet = glass.perimeter * glass.qty * 1.05; // 5% extra
        results.push({
            hardware: '5mm Aluminum Rubber',
            qty: rubberFeet,
            unit: 'Ft',
            rate: ratesConfig.global.rubberRate || 5,
            total: Math.round(rubberFeet * (ratesConfig.global.rubberRate || 5))
        });
    }

    return results;
}

// Helper to calculate glass dimensions for a window
function calculateGlassDimensions(window) {
    if (!window.glassType || window.glassType === 'none') return null;

    const offset = ratesConfig.global.glassOffset || 1.5;
    let shutterW = 0;
    let shutterH = 0;

    if (optimizationResults && optimizationResults.results) {
        for (const [key, plans] of Object.entries(optimizationResults.results)) {
            plans.forEach(plan => {
                plan.pieces.forEach(p => {
                    if (p.label && p.label.startsWith(window.configId)) {
                        if (p.label.toLowerCase().includes('shutter') || p.label.toLowerCase().includes('handle') || p.label.toLowerCase().includes('interlock')) {
                            // Heuristic to detect vertical vs horizontal
                            if (p.desc && (p.desc.toLowerCase().includes('vertical') || p.desc.toLowerCase().includes('handle') || p.desc.toLowerCase().includes('interlock'))) {
                                shutterH = p.length;
                            } else {
                                shutterW = p.length;
                            }
                        }
                    }
                });
            });
        }
    }

    // Fallback if not optimized
    if (!shutterW) shutterW = (window.width / window.shutters) - 1.5;
    if (!shutterH) shutterH = window.height - 1.5;

    const gw = Math.max(0, shutterW - offset);
    const gh = Math.max(0, shutterH - offset);

    return {
        width: gw,
        height: gh,
        area: (gw * gh) / 144, // sqft
        perimeter: (gw * 2 + gh * 2) / 12, // feet
        qty: window.shutters
    };
}

function generateQuotationHTML(projectWindows, selectedProject) {
    let html = `<div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2980b9; margin: 0;">NIRUMA ALUMINUM</h1>
        <p style="margin: 5px 0; color: #7f8c8d;">Internal Project Quotation for <strong>${selectedProject}</strong></p>
    </div>`;

    let grandTotal = 0;

    projectWindows.forEach(win => {
        const glass = calculateGlassDimensions(win);
        const glassRate = glass ? (ratesConfig.glass[win.glassType] || 0) : 0;
        const glassCost = glass ? glass.area * glass.qty * glassRate : 0;
        const rubberFeet = glass ? glass.perimeter * glass.qty * 1.05 : 0;
        const rubberCost = rubberFeet * (ratesConfig.global.rubberRate || 5);
        const hardware = calculateWindowHardware(win, optimizationResults);
        const hardwareCost = hardware.reduce((sum, h) => sum + h.total, 0);

        let powderCoatingCost = 0;
        let weightTotal = 0;

        if (optimizationResults && optimizationResults.results) {
            for (const [key, data] of Object.entries(optimizationResults.results)) {
                let purchasedLenForWindow = 0;
                let weightForWindow = 0;
                let compName = key.includes('|') ? key.split('|')[1].trim() : key;
                const pcRate = ratesConfig.powderCoating[compName] || 1;

                data.forEach(plan => {
                    const stockLen = parseFloat(plan.stock);
                    const totalUsedInStick = plan.used;
                    if (totalUsedInStick <= 0) return;

                    plan.pieces.forEach(p => {
                        if (p.label && p.label.startsWith(win.configId)) {
                            const shareRatio = p.length / totalUsedInStick;
                            purchasedLenForWindow += shareRatio * stockLen;

                            const section = optimizationResults.componentSections ? optimizationResults.componentSections[key] : null;
                            if (section && section.weight) {
                                const stickWeight = (stockLen / 144) * section.weight;
                                weightForWindow += shareRatio * stickWeight;
                            }
                        }
                    });
                });
                powderCoatingCost += (purchasedLenForWindow / 12) * pcRate;
                weightTotal += weightForWindow;
            }
        }

        const profileCost = weightTotal * (typeof aluminumRate !== 'undefined' ? aluminumRate : 280);
        const winTotal = profileCost + powderCoatingCost + glassCost + hardwareCost + rubberCost;
        grandTotal += winTotal;

        html += `
        <div style="border: 1px solid #eee; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">
                Window ${win.configId} (${win.width}" x ${win.height}") - ${win.description}
            </h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: #f8f9fa;">
                    <th style="text-align: left; padding: 8px;">Category</th>
                    <th style="text-align: right; padding: 8px;">Cost (₹)</th>
                </tr>
                <tr><td style="padding: 8px;">Aluminum Profiles (${weightTotal.toFixed(2)} Kg)</td><td style="text-align: right; padding: 8px;">${profileCost.toFixed(0)}</td></tr>
                <tr><td style="padding: 8px;">Powder Coating</td><td style="text-align: right; padding: 8px;">${powderCoatingCost.toFixed(0)}</td></tr>
                ${glass ? `<tr><td style="padding: 8px;">Glass Area (${(glass.area * glass.qty).toFixed(1)} sqft)</td><td style="text-align: right; padding: 8px;">${glassCost.toFixed(0)}</td></tr>` : ''}
                <tr><td style="padding: 8px;">Hardware & Rubber</td><td style="text-align: right; padding: 8px;">${(hardwareCost + rubberCost).toFixed(0)}</td></tr>
                <tr style="font-weight: bold;"><td style="padding: 8px;">Subtotal</td><td style="text-align: right; padding: 8px;">₹${winTotal.toFixed(0)}</td></tr>
            </table>
        </div>`;
    });

    html += `<h2 style="text-align: right; background: #34495e; color: white; padding: 15px; border-radius: 5px;">Total: ₹${grandTotal.toFixed(0)}</h2>`;
    return html;
}

function generateMaterialPurchaseHTML(projectWindows, selectedProject) {
    let html = `<h2 style="color: #2c3e50;">Raw Material Purchase List - ${selectedProject}</h2>`;
    if (!optimizationResults) return html + '<p>No optimization results found.</p>';

    html += `<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background: #3498db; color: white;">
            <th style="padding: 10px; text-align: left;">Section No</th>
            <th style="padding: 10px; text-align: left;">Description</th>
            <th style="padding: 10px; text-align: center;">Qty (Sticks)</th>
            <th style="padding: 10px; text-align: center;">Length</th>
            <th style="padding: 10px; text-align: right;">Total Weight (Kg)</th>
        </tr>`;

    for (const [key, data] of Object.entries(optimizationResults.results)) {
        const section = optimizationResults.componentSections ? optimizationResults.componentSections[key] : null;
        const totalWeight = data.reduce((sum, plan) => sum + (section ? section.weight : 0), 0);

        // Collect unique stock lengths
        const lengths = [...new Set(data.map(plan => parseFloat(plan.stock)))];
        const lengthStr = lengths.map(l => formatInchesToFeet(l)).join(', ');

        html += `<tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${section ? section.sectionNo : '-'}</td>
            <td style="padding: 10px;">${key}</td>
            <td style="padding: 10px; text-align: center;">${data.length}</td>
            <td style="padding: 10px; text-align: center;">${lengthStr}</td>
            <td style="padding: 10px; text-align: right;">${totalWeight.toFixed(2)}</td>
        </tr>`;
    }
    html += `</table>`;
    return html;
}

function generateHardwarePurchaseHTML(projectWindows, selectedProject) {
    let html = `<h2 style="color: #2c3e50;">Hardware Purchase List - ${selectedProject}</h2>`;
    const hardwareMap = aggregateProjectHardware(projectWindows, optimizationResults);

    html += `<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background: #27ae60; color: white;">
            <th style="padding: 10px; text-align: left;">Hardware Item</th>
            <th style="padding: 10px; text-align: center;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Unit</th>
        </tr>`;

    for (const [name, data] of Object.entries(hardwareMap)) {
        html += `<tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${name}</td>
            <td style="padding: 10px; text-align: center;">${Math.ceil(data.qty)}</td>
            <td style="padding: 10px;">${data.unit}</td>
        </tr>`;
    }
    html += `</table>`;
    return html;
}

function generateCutListHTML(projectWindows, selectedProject) {
    let html = `<h2 style="color: #2c3e50;">Workshop Cut List - ${selectedProject}</h2>`;
    if (!optimizationResults) return html + '<p>No optimization results found.</p>';

    for (const [key, plans] of Object.entries(optimizationResults.results)) {
        html += `<div style="margin-top: 20px; border: 1px solid #ddd; padding: 10px;">
            <h4 style="margin: 0; background: #f1c40f; padding: 5px;">${key}</h4>`;

        plans.forEach((plan, idx) => {
            html += `<div style="margin: 10px 0; padding: 5px; border-left: 3px solid #f39c12;">
                <strong>Stick #${idx + 1} (${parseFloat(plan.stock)}"):</strong>
                <div style="display: flex; gap: 5px; margin-top: 5px; flex-wrap: wrap;">`;
            plan.pieces.forEach(p => {
                html += `<span style="background: #ecf3f9; padding: 2px 8px; border: 1px solid #bdc3c7; border-radius: 3px;">
                    ${p.length}" <small>(${p.label})</small>
                </span>`;
            });
            html += `<span style="background: #fee; padding: 2px 8px; border: 1px solid #fab; color: #c0392b;">Waste: ${plan.waste.toFixed(2)}"</span>`;
            html += `</div></div>`;
        });
        html += `</div>`;
    }
    return html;
}

function aggregateProjectHardware(projectWindows, optimizationResults = null) {
    const aggregated = {};
    projectWindows.forEach(window => {
        const windowHardware = calculateWindowHardware(window, optimizationResults);
        windowHardware.forEach(item => {
            if (!aggregated[item.hardware]) {
                aggregated[item.hardware] = { qty: 0, unit: item.unit, rate: item.rate };
            }
            aggregated[item.hardware].qty += item.qty;
        });
    });
    return aggregated;
}

function generatePurchaseListTable(projectWindows, optimizationResults = null) {
    /**
     * Generate purchase list showing hardware items with quantities and costs
     */
    const aggregatedHardware = aggregateProjectHardware(projectWindows, optimizationResults);
    const purchaseListData = [];

    Object.entries(aggregatedHardware).forEach(([hardwareName, data]) => {
        let cost = 0;
        const qty = data.qty;
        const rate = data.rate;

        // For Wool Pile (in meters), calculate cost directly
        // For other items (in Nos), round up the quantity
        if (hardwareName.toLowerCase().includes('wool pile')) {
            cost = qty * rate;
        } else {
            cost = Math.ceil(qty) * rate;
        }

        purchaseListData.push([
            hardwareName,
            hardwareName.toLowerCase().includes('wool pile') ? qty.toFixed(2) : Math.ceil(qty),
            data.unit,
            `Rs. ${rate}`,
            `Rs. ${cost.toFixed(0)}`
        ]);
    });

    // Sort by hardware name for consistent display
    purchaseListData.sort((a, b) => a[0].localeCompare(b[0]));

    return purchaseListData;
}

function calculatePurchaseListTotal(projectWindows, optimizationResults = null) {
    /**
     * Calculate total hardware cost for the project
     */
    const aggregatedHardware = aggregateProjectHardware(projectWindows, optimizationResults);
    let totalHardwareCost = 0;

    Object.values(aggregatedHardware).forEach(data => {
        totalHardwareCost += (data.qty * data.rate);
    });

    return totalHardwareCost;
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

function verifySectionsConfigured() {
    if (!optimizationResults || !optimizationResults.results) return true;

    const missing = [];
    Object.keys(optimizationResults.results).forEach(key => {
        const selected = optimizationResults.componentSections ? optimizationResults.componentSections[key] : null;
        if (!selected) {
            missing.push(key);
        }
    });

    if (missing.length > 0) {
        showAlert(`⚠️ Missing Thickness Selection!\n\nPlease select the thickness (section) for the following components in the results section before generating a quotation:\n\n${missing.join('\n')}`);
        scrollToSection('section-results');
        return false;
    }
    return true;
}

function findStockInfo(materialKey, length) {
    /**
     * Helper to find weight and section info.
     * Prefers data from componentSections in optimizationResults.
     */
    if (optimizationResults && optimizationResults.componentSections && optimizationResults.componentSections[materialKey]) {
        const choice = optimizationResults.componentSections[materialKey];
        return {
            sectionNo: choice.sectionNo,
            thickness: choice.t,
            weight: choice.weight,
            supplier: choice.supplier
        };
    }

    // Fallback to stockMaster
    const [series, material] = materialKey.includes(' | ') ? materialKey.split(' | ') : ['', materialKey];

    for (const [sName, stocks] of Object.entries(stockMaster)) {
        if (series && sName !== series) continue;
        const stock = stocks.find(s => s.material === material);
        if (stock) return stock;
    }
    return null;
}
function formatInchesToFeet(totalInches) {
    if (!totalInches || totalInches <= 0) return '0\'';
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    if (inches === 0) return `${feet}'`;
    return `${feet}' - ${inches}"`;
}
