// Niruma Aluminum Profile Optimizer - Export & Display Functions

// ============================================================================
// RESULTS DISPLAY
// ============================================================================

function displayResults() {
    const container = document.getElementById('resultsContent');
    
    if (!optimizationResults) {
        container.innerHTML = '<p style="color: #7f8c8d; text-align: center; padding: 40px">No results yet</p>';
        return;
    }
    
    const r = optimizationResults;
    let html = '<div class="alert alert-success">Smart Cost-Optimized Results for Project <strong>' + r.project + '</strong></div>';
    
    // Export buttons
    html += `
    <div class="import-export-section">
        <div style="text-align: center; margin-bottom: 15px;"><strong style="font-size: 16px;">📦 Project Management</strong></div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
            <button class="btn btn-primary" onclick="exportProject()">💾 Export Project (JSON)</button>
            <button class="btn btn-primary" onclick="importProject()">📂 Import Project (JSON)</button>
            <button class="btn btn-success" onclick="exportFullResultsExcel()">📊 Export Excel</button>
            <button class="btn btn-danger" onclick="exportFullResultsPDF()">📄 Export PDF</button>
        </div>
    </div>
    <div class="import-export-section">
        <div style="text-align: center; margin-bottom: 15px;"><strong style="font-size: 16px;">📤 Share Results</strong></div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
            <button class="btn btn-success" onclick="shareViaWhatsApp()">📱 Share via WhatsApp</button>
            <button class="btn btn-primary" onclick="shareViaEmail()">✉️ Share via Email</button>
            <button class="btn btn-warning" onclick="generatePrintableLabels()">🏷️ Print Labels (A4)</button>
        </div>
    </div>`;
    
    // Cost breakdown
    const materialCost = parseFloat(r.stats.totalCost || 0);
    const wastePercentage = parseFloat(r.stats.totalWaste || 0) / (parseFloat(r.stats.totalUsed || 1) + parseFloat(r.stats.totalWaste || 0));
    const wasteCost = (materialCost * wastePercentage).toFixed(0);
    const usedCost = (materialCost - wasteCost).toFixed(0);
    
    html += `<div class="cost-breakdown-card">
        <h3 style="margin-top: 0;">💰 Cost Breakdown</h3>
        <div class="cost-breakdown-row"><span>Material (Used)</span><span><strong>₹${usedCost}</strong></span></div>
        <div class="cost-breakdown-row"><span>Material (Waste)</span><span><strong>₹${wasteCost}</strong></span></div>
        <div class="cost-breakdown-row" style="border-bottom: 2px solid white; font-size: 18px;">
            <span><strong>Total Cost</strong></span><span><strong>₹${r.stats.totalCost}</strong></span>
        </div>
    </div>`;
    
    // Stats grid
    html += '<div class="stats-grid">';
    html += '<div class="stat-card"><h4>Total Sticks</h4><p>' + r.stats.totalSticks + '</p></div>';
    html += '<div class="stat-card"><h4>Used Length</h4><p>' + r.stats.totalUsed + '"</p></div>';
    html += '<div class="stat-card"><h4>Waste Length</h4><p>' + r.stats.totalWaste + '"</p></div>';
    html += '<div class="stat-card"><h4>Efficiency</h4><p>' + r.stats.efficiency + '%</p></div>';
    html += '</div>';
    
    // Material details
    for (const [material, plans] of Object.entries(r.results)) {
        const materialUsed = plans.reduce((sum, p) => sum + p.used, 0);
        const materialWaste = plans.reduce((sum, p) => sum + p.waste, 0);
        const materialTotal = materialUsed + materialWaste;
        const materialEfficiency = ((materialUsed / materialTotal) * 100).toFixed(2);
        
        const stockCounts = {};
        plans.forEach(plan => {
            const stockSize = plan.stock.replace('"', '');
            stockCounts[stockSize] = (stockCounts[stockSize] || 0) + 1;
        });
        
        const requirementStr = Object.entries(stockCounts)
            .map(([size, count]) => size + '" - ' + count + ' nos')
            .join(', ');
        
        html += '<div class="material-section">';
        html += '<h3>📏 ' + material + '</h3>';
        html += `<div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #4caf50">
            <strong style="font-size: 15px; color: #2e7d32">Material Summary</strong><br>
            <div style="margin-top: 8px; font-size: 14px; line-height: 1.8">
                <strong>Requirements:</strong> ${requirementStr}<br>
                <strong>Total Used Length:</strong> ${materialUsed.toFixed(2)}" 
                <strong>Total Waste:</strong> ${materialWaste.toFixed(2)}" 
                <strong>Efficiency:</strong> ${materialEfficiency}%
            </div>
        </div>`;
        
        html += '<table><thead><tr><th>Stick #</th><th>Stock</th><th>Cut Sequence</th><th>Pieces</th><th>Used</th><th>Waste</th><th>Efficiency</th><th>Cost</th></tr></thead><tbody>';
        
        let cutNumber = 1;
        plans.forEach((plan, idx) => {
            const piecesStr = plan.pieces.map(p => p.length.toFixed(2) + '" (' + p.label + ')').join(', ');
            const cutSequence = plan.pieces.map(() => '#' + (cutNumber++)).join(', ');
            
            html += '<tr>';
            html += '<td>' + (idx + 1) + '</td>';
            html += '<td>' + plan.stock + '</td>';
            html += '<td><strong>' + cutSequence + '</strong></td>';
            html += '<td>' + piecesStr + '</td>';
            html += '<td>' + plan.used.toFixed(2) + '"</td>';
            html += '<td>' + plan.waste.toFixed(2) + '"</td>';
            html += '<td>' + plan.efficiency + '%</td>';
            html += '<td>₹' + plan.cost + '</td>';
            html += '</tr>';
            
            const stockLength = parseFloat(plan.stock.replace('"', ''));
            const diagram = generateCuttingDiagram(plan, stockLength);
            html += '<tr><td colspan="8"><div class="cutting-diagram">' + diagram + '</div></td></tr>';
        });
        
        html += '</tbody></table></div>';
    }
    
    container.innerHTML = html;
}

// ============================================================================
// PROJECT EXPORT/IMPORT
// ============================================================================

function exportProject() {
    const projectData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        windows: windows,
        seriesFormulas: seriesFormulas,
        stockMaster: stockMaster,
        kerf: kerf,
        unitMode: unitMode
    };
    
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Niruma_Project_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Project exported successfully!');
}

function importProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const projectData = JSON.parse(event.target.result);
                
                if (!projectData.windows || !projectData.seriesFormulas || !projectData.stockMaster) {
                    throw new Error('Invalid project file format');
                }
                
                windows = projectData.windows;
                seriesFormulas = projectData.seriesFormulas;
                stockMaster = projectData.stockMaster;
                kerf = projectData.kerf || 0.125;
                unitMode = projectData.unitMode || 'inch';
                
                document.getElementById('kerfGlobal').value = kerf;
                document.getElementById('unitToggle').checked = (unitMode === 'mm');
                
                // Save to local storage
                autoSaveWindows();
                autoSaveFormulas();
                autoSaveStock();
                autoSaveSettings();
                
                refreshAllUI();
                alert(`✅ Project imported successfully!\n${windows.length} windows loaded.`);
            } catch (error) {
                alert('❌ Error importing project: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// ============================================================================
// WHATSAPP SHARING
// ============================================================================

function shareViaWhatsApp() {
    if (!optimizationResults) {
        alert('⚠️ Please run optimization first!');
        return;
    }
    
    const r = optimizationResults;
    let message = `*Niruma Aluminum Profile Optimizer*\n*Project:* ${r.project}\n\n*SUMMARY*\nTotal Sticks: ${r.stats.totalSticks}\nTotal Cost: ₹${r.stats.totalCost}\nEfficiency: ${r.stats.efficiency}%\n\n*PURCHASE LIST*\n`;
    
    for (const [material, plans] of Object.entries(r.results)) {
        const stockCounts = {};
        plans.forEach(plan => {
            const stockSize = plan.stock.replace('"', '');
            stockCounts[stockSize] = (stockCounts[stockSize] || 0) + 1;
        });
        
        message += `\n${material}:\n`;
        for (const [size, count] of Object.entries(stockCounts)) {
            message += `  • ${size}" - ${count} nos\n`;
        }
    }
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================================================
// EMAIL SHARING
// ============================================================================

function shareViaEmail() {
    if (!optimizationResults) {
        alert('⚠️ Please run optimization first!');
        return;
    }
    
    const r = optimizationResults;
    let body = `NIRUMA ALUMINUM PROFILE OPTIMIZER\nProject: ${r.project}\n\nSUMMARY\nTotal Sticks: ${r.stats.totalSticks}\nTotal Cost: ₹${r.stats.totalCost}\nEfficiency: ${r.stats.efficiency}%\n\nPURCHASE LIST\n`;
    
    for (const [material, plans] of Object.entries(r.results)) {
        const stockCounts = {};
        plans.forEach(plan => {
            const stockSize = plan.stock.replace('"', '');
            stockCounts[stockSize] = (stockCounts[stockSize] || 0) + 1;
        });
        
        body += `\n${material}:\n`;
        for (const [size, count] of Object.entries(stockCounts)) {
            body += `  ${size}" - ${count} nos\n`;
        }
    }
    
    window.location.href = `mailto:?subject=${encodeURIComponent('Niruma Cutting Plan - ' + r.project)}&body=${encodeURIComponent(body)}`;
}

// ============================================================================
// PRINTABLE LABELS
// ============================================================================

function generatePrintableLabels() {
    if (!optimizationResults) {
        alert('⚠️ Please run optimization first!');
        return;
    }
    
    const r = optimizationResults;
    let labelHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cutting Labels - ${r.project}</title><style>
@page { size: A4; margin: 10mm; }
body { font-family: 'Courier New', monospace; }
.label-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; padding: 0; }
.label-item { border: 2px solid #000; padding: 3mm; height: 25mm; display: flex; flex-direction: column; justify-content: center; font-size: 10pt; page-break-inside: avoid; }
.label-header { font-weight: bold; font-size: 12pt; border-bottom: 1px solid #000; margin-bottom: 2mm; }
@media print { .no-print { display: none; } }
</style></head><body>
<div class="no-print" style="text-align: center; padding: 20px;">
    <h2>Niruma Labels - ${r.project}</h2>
    <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; cursor: pointer;">🖨️ Print Labels</button>
</div>
<div class="label-grid">`;
    
    for (const [material, plans] of Object.entries(r.results)) {
        let cutNumber = 1;
        plans.forEach((plan, stickIdx) => {
            plan.pieces.forEach(piece => {
                const windowId = piece.label.split(' - ')[0];
                labelHTML += `<div class="label-item">
                    <div class="label-header">${r.project}</div>
                    <div><strong>Window:</strong> ${windowId}</div>
                    <div><strong>Material:</strong> ${material}</div>
                    <div><strong>Cut #:</strong> ${cutNumber}</div>
                    <div><strong>Length:</strong> ${piece.length.toFixed(2)}"</div>
                </div>`;
                cutNumber++;
            });
        });
    }
    
    labelHTML += `</div></body></html>`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(labelHTML);
    printWindow.document.close();
}

// ============================================================================
// EXCEL EXPORT
// ============================================================================

function exportFullResultsExcel() {
    if (!optimizationResults) {
        alert('⚠️ No results to export!');
        return;
    }
    
    const r = optimizationResults;
    const wb = XLSX.utils.book_new();
    
    const summaryData = [
        ['Niruma Aluminum Profile Optimizer'],
        ['Project:', r.project],
        [''],
        ['Overall Statistics'],
        ['Total Sticks', r.stats.totalSticks],
        ['Total Used Length', r.stats.totalUsed + '"'],
        ['Total Waste Length', r.stats.totalWaste + '"'],
        ['Overall Efficiency', r.stats.efficiency + '%'],
        ['Total Cost', '₹' + r.stats.totalCost],
        ['']
    ];
    
    for (const [material, plans] of Object.entries(r.results)) {
        const materialUsed = plans.reduce((sum, p) => sum + p.used, 0);
        const materialWaste = plans.reduce((sum, p) => sum + p.waste, 0);
        const materialTotal = materialUsed + materialWaste;
        const materialEfficiency = ((materialUsed / materialTotal) * 100).toFixed(2);
        
        const stockCounts = {};
        plans.forEach(plan => {
            const stockSize = plan.stock.replace('"', '');
            stockCounts[stockSize] = (stockCounts[stockSize] || 0) + 1;
        });
        
        const requirementStr = Object.entries(stockCounts)
            .map(([size, count]) => `${size}" - ${count} nos`)
            .join(' | ');
        
        summaryData.push([`Material: ${material}`]);
        summaryData.push(['Requirements', requirementStr]);
        summaryData.push(['Used Length', materialUsed.toFixed(2) + '"']);
        summaryData.push(['Waste Length', materialWaste.toFixed(2) + '"']);
        summaryData.push(['Efficiency', materialEfficiency + '%']);
        summaryData.push(['']);
        
        summaryData.push(['Detailed Cutting Plan']);
        summaryData.push(['Stick #', 'Stock', 'Pieces', 'Used', 'Waste', 'Efficiency', 'Cost']);
        
        plans.forEach((plan, idx) => {
            const piecesStr = plan.pieces.map(p => `${p.length.toFixed(2)}" (${p.label})`).join(' | ');
            summaryData.push([
                idx + 1,
                plan.stock,
                piecesStr,
                plan.used.toFixed(2) + '"',
                plan.waste.toFixed(2) + '"',
                plan.efficiency + '%',
                '₹' + plan.cost
            ]);
        });
        
        summaryData.push(['']);
    }
    
    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws, 'Full Results');
    XLSX.writeFile(wb, `${r.project}_Full_Results.xlsx`);
}

// ============================================================================
// PDF EXPORT
// ============================================================================

function exportFullResultsPDF() {
    if (!optimizationResults) {
        alert('⚠️ No results to export!');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const r = optimizationResults;
    
    doc.setFontSize(18);
    doc.text('Niruma Aluminum Profile Optimizer', 14, 20);
    doc.setFontSize(12);
    doc.text(`Project: ${r.project}`, 14, 30);
    
    doc.setFontSize(14);
    doc.text('Overall Statistics', 14, 45);
    
    doc.autoTable({
        startY: 50,
        head: [['Metric', 'Value']],
        body: [
            ['Total Sticks', r.stats.totalSticks],
            ['Total Used Length', r.stats.totalUsed + '"'],
            ['Total Waste Length', r.stats.totalWaste + '"'],
            ['Overall Efficiency', r.stats.efficiency + '%'],
            ['Total Cost', '₹' + r.stats.totalCost]
        ],
        theme: 'grid',
        headStyles: { fillColor: [52, 152, 219] }
    });
    
    let currentY = doc.lastAutoTable.finalY + 10;
    
    for (const [material, plans] of Object.entries(r.results)) {
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }
        
        const materialUsed = plans.reduce((sum, p) => sum + p.used, 0);
        const materialWaste = plans.reduce((sum, p) => sum + p.waste, 0);
        const materialTotal = materialUsed + materialWaste;
        const materialEfficiency = ((materialUsed / materialTotal) * 100).toFixed(2);
        
        const stockCounts = {};
        plans.forEach(plan => {
            const stockSize = plan.stock.replace('"', '');
            stockCounts[stockSize] = (stockCounts[stockSize] || 0) + 1;
        });
        
        const requirementStr = Object.entries(stockCounts)
            .map(([size, count]) => `${size}" - ${count} nos`)
            .join(' | ');
        
        doc.setFontSize(14);
        doc.text(`Material: ${material}`, 14, currentY);
        currentY += 7;
        
        doc.setFontSize(10);
        doc.text(`Requirements: ${requirementStr}`, 14, currentY);
        currentY += 5;
        doc.text(`Used: ${materialUsed.toFixed(2)}" | Waste: ${materialWaste.toFixed(2)}" | Efficiency: ${materialEfficiency}%`, 14, currentY);
        currentY += 10;
        
        const tableData = plans.map((plan, idx) => {
            const piecesStr = plan.pieces.map(p => `${p.length.toFixed(2)}" (${p.label})`).join(' | ');
            return [
                idx + 1,
                plan.stock,
                piecesStr,
                plan.used.toFixed(2) + '"',
                plan.waste.toFixed(2) + '"',
                plan.efficiency + '%',
                '₹' + plan.cost
            ];
        });
        
        doc.autoTable({
            startY: currentY,
            head: [['#', 'Stock', 'Pieces', 'Used', 'Waste', 'Eff%', 'Cost']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [46, 125, 50] },
            styles: { fontSize: 8 }
        });
        
        currentY = doc.lastAutoTable.finalY + 10;
    }
    
    doc.save(`${r.project}_Full_Results.pdf`);
}
