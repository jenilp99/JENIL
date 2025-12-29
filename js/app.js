// Niruma Aluminum Profile Optimizer - Main App Logic

// Global data store
let windows = [];
let seriesFormulas = {};
let stockMaster = {};
let hardwareMaster = {};
let optimizationResults = null;
let kerf = 0.125;
let unitMode = 'inch';

const MM_TO_INCH = 0.0393701;
const INCH_TO_MM = 25.4;

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeDefaults() {
    // Only initialize if no data loaded from storage
    if (Object.keys(seriesFormulas).length === 0) {
        seriesFormulas = {
            'Domal': [
                { component: 'Domal Shutter', qty: '2*S', length: 'H-2.75', desc: 'Shutter Vertical' },
                { component: 'Domal Shutter', qty: '2*S', length: '(W-3+2.5*(S-1))/S', desc: 'Shutter Horizontal' },
                { component: 'Domal Clip', qty: '2*(S-1)', length: 'H-2.75', desc: 'Domal Clip' },
                { component: 'Domal Track', qty: '1', length: 'W', desc: 'Track Top' },
                { component: 'Domal Track', qty: '1', length: 'W', desc: 'Track Bottom' },
                { component: 'Domal Track', qty: '2', length: 'H', desc: 'Track Sides' },
                { component: 'Domal C-channel', qty: '2*MS', length: 'H-2.75', desc: 'MS C-channel Vertical' },
                { component: 'Domal C-channel', qty: '2*MS', length: '(W-3+2.5*(S-1))/S', desc: 'MS C-channel Horizontal' },
                { component: 'Domal Shutter', qty: '2*MS', length: 'H-2.75', desc: 'MS Shutter Vertical' },
                { component: 'Domal Shutter', qty: '2*MS', length: '(W-3+2.5*(S-1))/S', desc: 'MS Shutter Horizontal' },
                { component: 'Domal Clip', qty: '1*MS', length: 'H-2.75', desc: 'MS Domal Clip' }
            ],
            '3/4': [
                { component: '3/4 Handle', qty: '2', length: 'H-1.5', desc: 'Handles' },
                { component: '3/4 Interlock', qty: '2*S-2', length: 'H-1.5', desc: 'Interlocks' },
                { component: '3/4 Bearing Bottom', qty: '2*S', length: '(W-5-1.5*(S-1))/S', desc: 'Bearing Bottom' },
                { component: '3/4 Track Top', qty: '1', length: 'W', desc: 'Track Top' },
                { component: '3/4 Track Top', qty: '2', length: 'H', desc: 'Track Sides' },
                { component: '3/4 Track Bottom', qty: '1', length: 'W', desc: 'Track Bottom' },
                { component: '3/4 Handle', qty: '1*MS', length: 'H-1.5', desc: 'MS Handle' },
                { component: '3/4 Interlock', qty: '1*MS', length: 'H-1.5', desc: 'MS Interlock' },
                { component: '3/4 Bearing Bottom', qty: '2*MS', length: '(W-5-1.5*(S-1))/S', desc: 'MS Bearing Bottom' },
                { component: '3/4 C-channel', qty: '2*MS', length: 'H-1.5', desc: 'MS C-channel Vertical' },
                { component: '3/4 C-channel', qty: '2*MS', length: '(W-5-1.5*(S-1))/S', desc: 'MS C-channel Horizontal' }
            ],
            '1': [
                { component: '1" Handle', qty: '2', length: 'H-1.125', desc: 'Handles' },
                { component: '1" Interlock', qty: '2*S-2', length: 'H-1.125', desc: 'Interlocks' },
                { component: '1" Bearing Bottom', qty: '2*S', length: '(W-5-2*(S-1))/S', desc: 'Bearing Bottom' },
                { component: '1" Track Top', qty: '1', length: 'W', desc: 'Track Top' },
                { component: '1" Track Top', qty: '2', length: 'H', desc: 'Track Sides' },
                { component: '1" Track Bottom', qty: '1', length: 'W', desc: 'Track Bottom' },
                { component: '1" Handle', qty: '1*MS', length: 'H-1.125', desc: 'MS Handle' },
                { component: '1" Interlock', qty: '1*MS', length: 'H-1.125', desc: 'MS Interlock' },
                { component: '1" Bearing Bottom', qty: '2*MS', length: '(W-5-2*(S-1))/S', desc: 'MS Bearing Bottom' },
                { component: '1" C-channel', qty: '2*MS', length: 'H-1.125', desc: 'MS C-channel Vertical' },
                { component: '1" C-channel', qty: '2*MS', length: '(W-5-2*(S-1))/S', desc: 'MS C-channel Horizontal' }
            ]
        };
    }

    if (Object.keys(stockMaster).length === 0) {
        stockMaster = {
            'Domal': [
                { material: 'Domal Shutter', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: 'Domal Clip', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: 'Domal Track', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: 'Domal C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
            ],
            '3/4': [
                { material: '3/4 Handle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4 Interlock', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4 Bearing Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4 Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4 Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4 C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
            ],
            '1': [
                { material: '1" Handle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Interlock', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Bearing Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
            ]
        };
    }

    // Initialize Hardware Master
    if (!localStorage.getItem('hardwareMaster')) {
        const hardwareMaster = {
            'Domal': [
                { hardware: 'Domal Shutter Lock', unit: 'Nos', rate: 50 },
                { hardware: 'Domal Wool Pile Weather Strip', unit: 'Meter', rate: 25 },
                { hardware: 'Domal Bearing', unit: 'Nos', rate: 30 },
                { hardware: 'Silicon', unit: 'Bottle', rate: 150 },
                { hardware: 'Corner Cleat', unit: 'Nos', rate: 15 },
                { hardware: 'Shutter Wing Connector', unit: 'Nos', rate: 20 },
                { hardware: 'Interlock Cap', unit: 'Nos', rate: 10 }
            ],
            '3/4': [
                { hardware: '3/4 Sliding Shutter Lock', unit: 'Nos', rate: 45 },
                { hardware: '3/4 Wool Pile Weather Strip', unit: 'Meter', rate: 22 },
                { hardware: '3/4 Bearing', unit: 'Nos', rate: 28 },
                { hardware: 'Silicon', unit: 'Bottle', rate: 150 }
            ],
            '1': [
                { hardware: '1" Sliding Shutter Lock', unit: 'Nos', rate: 48 },
                { hardware: '1" Wool Pile Weather Strip', unit: 'Meter', rate: 24 },
                { hardware: '1" Bearing', unit: 'Nos', rate: 32 },
                { hardware: 'Silicon', unit: 'Bottle', rate: 150 }
            ]
        };
        localStorage.setItem('hardwareMaster', JSON.stringify(hardwareMaster));
    } else {
        // Load hardwareMaster from localStorage
        const savedHardwareMaster = localStorage.getItem('hardwareMaster');
        if (savedHardwareMaster) {
            hardwareMaster = JSON.parse(savedHardwareMaster);
        }
    }

    if (windows.length === 0) {
        windows = [{
            configId: 'W01',
            projectName: 'check',
            width: 65,
            height: 56,
            tracks: 3,
            shutters: 3,
            mosquitoShutters: 0,
            series: '3/4',
            description: 'Living Room Main'
        }];
    }

    refreshAllUI();
}

// ============================================================================
// UI MANAGEMENT
// ============================================================================

function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'windows') displayWindows();
    if (tabName === 'formulas') refreshFormulasDisplay();
    if (tabName === 'stock') {
        refreshStockMaster();
        refreshHardwareMaster();
    }
    if (tabName === 'optimize') refreshProjectSelector();
}

function refreshAllUI() {
    refreshSeriesDropdown();
    refreshFormulasDisplay();
    refreshStockMaster();
    refreshProjectSelector();
    displayWindows();
}

function refreshSeriesDropdown() {
    const selects = [
        document.getElementById('series'),
        document.getElementById('editSeries'),
        document.getElementById('newStockSeries')
    ];
    
    selects.forEach(select => {
        if (select) {
            select.innerHTML = '';
            Object.keys(seriesFormulas).forEach(series => {
                select.innerHTML += `<option value="${series}">${series} Series</option>`;
            });
        }
    });
}

function updateUnitLabels() {
    const unit = unitMode === 'inch' ? 'inches' : 'mm';
    document.querySelectorAll('.unit-label').forEach(el => {
        if (el.tagName === 'SPAN' && el.classList.contains('unit-label')) {
            el.textContent = '(' + unit + ')';
        } else {
            el.textContent = unit;
        }
    });
}

// ============================================================================
// UNIT CONVERSION
// ============================================================================

function convertToInches(value) {
    return unitMode === 'mm' ? value * MM_TO_INCH : value;
}

function convertFromInches(value) {
    return unitMode === 'mm' ? value * INCH_TO_MM : value;
}

function toggleUnit() {
    unitMode = unitMode === 'inch' ? 'mm' : 'inch';
    updateUnitLabels();
    displayWindows();
    if (optimizationResults) displayResults();
    autoSaveSettings();
}

// ============================================================================
// WINDOW MANAGEMENT
// ============================================================================

function addWindow(event) {
    event.preventDefault();
    
    const window = {
        configId: document.getElementById('configId').value,
        projectName: document.getElementById('projectName').value,
        width: convertToInches(parseFloat(document.getElementById('width').value)),
        height: convertToInches(parseFloat(document.getElementById('height').value)),
        tracks: parseInt(document.getElementById('tracks').value),
        shutters: parseInt(document.getElementById('shutters').value),
        mosquitoShutters: parseInt(document.getElementById('mosquitoShutters').value),
        series: document.getElementById('series').value,
        description: document.getElementById('description').value
    };
    
    windows.push(window);
    autoSaveWindows();
    
    const lastNum = parseInt(window.configId.substring(1));
    document.getElementById('configId').value = 'W' + String(lastNum + 1).padStart(2, '0');
    
    alert('✅ Window ' + window.configId + ' added successfully!');
    refreshProjectSelector();
}

function clearForm() {
    document.getElementById('windowForm').reset();
    document.getElementById('configId').value = 'W01';
    document.getElementById('projectName').value = 'check';
}

function displayWindows() {
    const container = document.getElementById('windowList');
    
    if (windows.length === 0) {
        container.innerHTML = '<p style="color: #7f8c8d; text-align: center; padding: 40px;">No windows added yet.</p>';
        return;
    }
    
    let html = '';
    windows.forEach((w, idx) => {
        html += `<div class="window-card">
            <div>
                <h3>${w.configId} - ${w.description}</h3>
                <div class="window-details">
                    <div><strong>Project:</strong> ${w.projectName}</div>
                    <div><strong>Size:</strong> ${w.width}" × ${w.height}"</div>
                    <div><strong>Tracks:</strong> ${w.tracks}</div>
                    <div><strong>Shutters:</strong> ${w.shutters}</div>
                    <div><strong>Mosquito Shutters:</strong> ${w.mosquitoShutters}</div>
                    <div><strong>Series:</strong> ${w.series}</div>
                </div>
                <div class="window-actions">
                    <button class="btn btn-warning btn-sm" onclick="editWindow(${idx})">✏️ Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteWindow(${idx})">🗑️ Delete</button>
                </div>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

function editWindow(idx) {
    const win = windows[idx];
    document.getElementById('editWindowIndex').value = idx;
    document.getElementById('editConfigId').value = win.configId;
    document.getElementById('editProjectName').value = win.projectName;
    document.getElementById('editWidth').value = convertFromInches(win.width);
    document.getElementById('editHeight').value = convertFromInches(win.height);
    document.getElementById('editTracks').value = win.tracks;
    document.getElementById('editShutters').value = win.shutters;
    document.getElementById('editMosquitoShutters').value = win.mosquitoShutters;
    document.getElementById('editSeries').value = win.series;
    document.getElementById('editDescription').value = win.description;
    document.getElementById('editWindowModal').classList.add('active');
}

function closeEditWindowModal() {
    document.getElementById('editWindowModal').classList.remove('active');
}

function saveWindowEdit(event) {
    event.preventDefault();
    const idx = parseInt(document.getElementById('editWindowIndex').value);
    
    windows[idx] = {
        configId: document.getElementById('editConfigId').value,
        projectName: document.getElementById('editProjectName').value,
        width: convertToInches(parseFloat(document.getElementById('editWidth').value)),
        height: convertToInches(parseFloat(document.getElementById('editHeight').value)),
        tracks: parseInt(document.getElementById('editTracks').value),
        shutters: parseInt(document.getElementById('editShutters').value),
        mosquitoShutters: parseInt(document.getElementById('editMosquitoShutters').value),
        series: document.getElementById('editSeries').value,
        description: document.getElementById('editDescription').value
    };
    
    autoSaveWindows();
    closeEditWindowModal();
    displayWindows();
    refreshProjectSelector();
    alert('✅ Window updated successfully!');
}

function deleteWindow(idx) {
    showConfirm('Delete this window?', () => {
        windows.splice(idx, 1);
        autoSaveWindows();
        displayWindows();
        refreshProjectSelector();
    });
}

// ============================================================================
// FORMULA MANAGEMENT
// ============================================================================

function refreshFormulasDisplay() {
    const container = document.getElementById('formulasList');
    let html = '';
    
    Object.entries(seriesFormulas).forEach(([series, formulas]) => {
        html += `<div class="formula-card">
            <h3>${series} Series
                <button class="btn btn-success btn-sm" style="float: right; margin-left: 10px;" onclick="showAddComponentModal('${series}')">➕ Add Component</button>
                <button class="btn btn-danger btn-sm" style="float: right;" onclick="deleteSeries('${series}')">🗑️ Delete Series</button>
            </h3>`;
        
        formulas.forEach((f, idx) => {
            html += `<div class="formula-item">
                <div class="formula-content">
                    <strong>${f.desc}:</strong><br>
                    Component: <code>${f.component}</code><br>
                    Quantity: <code>${f.qty}</code> pieces<br>
                    Length: <code>${f.length}</code> inches
                </div>
                <div class="formula-actions">
                    <button class="btn btn-warning btn-sm" onclick="editFormula('${series}', ${idx})">✏️ Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFormula('${series}', ${idx})">🗑️</button>
                </div>
            </div>`;
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function showAddComponentModal(series) {
    document.getElementById('addComponentSeries').value = series;
    document.getElementById('modalComponentName').value = '';
    document.getElementById('modalComponentQty').value = '';
    document.getElementById('modalComponentLength').value = '';
    document.getElementById('modalComponentDesc').value = '';
    document.getElementById('addComponentModal').classList.add('active');
}

function closeAddComponentModal() {
    document.getElementById('addComponentModal').classList.remove('active');
}

function saveNewComponent(event) {
    event.preventDefault();
    const series = document.getElementById('addComponentSeries').value;
    const component = document.getElementById('modalComponentName').value;
    const qty = document.getElementById('modalComponentQty').value;
    const length = document.getElementById('modalComponentLength').value;
    const desc = document.getElementById('modalComponentDesc').value;
    
    if (!seriesFormulas[series]) {
        seriesFormulas[series] = [];
    }
    
    seriesFormulas[series].push({ component, qty, length, desc });
    autoSaveFormulas();
    closeAddComponentModal();
    refreshFormulasDisplay();
    alert('✅ Component added successfully!');
}

function editFormula(series, idx) {
    const formula = seriesFormulas[series][idx];
    document.getElementById('editFormulaSeries').value = series;
    document.getElementById('editFormulaIndex').value = idx;
    document.getElementById('editFormulaComponent').value = formula.component;
    document.getElementById('editFormulaDesc').value = formula.desc;
    document.getElementById('editFormulaQty').value = formula.qty;
    document.getElementById('editFormulaLength').value = formula.length;
    document.getElementById('editFormulaModal').classList.add('active');
}

function closeEditFormulaModal() {
    document.getElementById('editFormulaModal').classList.remove('active');
}

function saveFormulaEdit(event) {
    event.preventDefault();
    const series = document.getElementById('editFormulaSeries').value;
    const idx = parseInt(document.getElementById('editFormulaIndex').value);
    
    seriesFormulas[series][idx] = {
        component: document.getElementById('editFormulaComponent').value,
        desc: document.getElementById('editFormulaDesc').value,
        qty: document.getElementById('editFormulaQty').value,
        length: document.getElementById('editFormulaLength').value
    };
    
    autoSaveFormulas();
    closeEditFormulaModal();
    refreshFormulasDisplay();
    alert('✅ Formula updated successfully!');
}

function deleteFormula(series, idx) {
    showConfirm('Delete this formula?', () => {
        seriesFormulas[series].splice(idx, 1);
        autoSaveFormulas();
        refreshFormulasDisplay();
    });
}

function addNewSeries(event) {
    event.preventDefault();
    const seriesName = document.getElementById('newSeriesName').value;
    
    if (!seriesFormulas[seriesName]) {
        seriesFormulas[seriesName] = [];
        stockMaster[seriesName] = [];
    }
    
    seriesFormulas[seriesName].push({
        component: document.getElementById('newComponentName').value,
        qty: document.getElementById('newQtyFormula').value,
        length: document.getElementById('newLengthFormula').value,
        desc: document.getElementById('newComponentDesc').value
    });
    
    autoSaveFormulas();
    autoSaveStock();
    alert('✅ Component added to ' + seriesName + ' series!');
    document.getElementById('newSeriesForm').reset();
    refreshAllUI();
}

function deleteSeries(series) {
    showConfirm('Delete entire ' + series + ' series?', () => {
        delete seriesFormulas[series];
        delete stockMaster[series];
        autoSaveFormulas();
        autoSaveStock();
        refreshAllUI();
    });
}

// ============================================================================
// STOCK MANAGEMENT
// ============================================================================

function refreshStockMaster() {
    const container = document.getElementById('stockMasterList');
    let html = '';
    
    Object.entries(stockMaster).forEach(([series, stocks]) => {
        html += `<div class="stock-material-card">
            <h4>${series} Series Materials</h4>
            <table>
                <thead>
                    <tr>
                        <th>Material</th>
                        <th>Stock 1 (in)</th>
                        <th>Cost (₹)</th>
                        <th>Stock 2 (in)</th>
                        <th>Cost (₹)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;
        
        stocks.forEach((stock, idx) => {
            html += `<tr>
                <td>${stock.material}</td>
                <td><input type="number" value="${stock.stock1}" onchange="updateStock('${series}', ${idx}, 'stock1', this.value)" style="width: 80px; padding: 5px;"></td>
                <td><input type="number" value="${stock.stock1Cost}" onchange="updateStock('${series}', ${idx}, 'stock1Cost', this.value)" style="width: 80px; padding: 5px;"></td>
                <td><input type="number" value="${stock.stock2}" onchange="updateStock('${series}', ${idx}, 'stock2', this.value)" style="width: 80px; padding: 5px;"></td>
                <td><input type="number" value="${stock.stock2Cost}" onchange="updateStock('${series}', ${idx}, 'stock2Cost', this.value)" style="width: 80px; padding: 5px;"></td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteStock('${series}', ${idx})">🗑️</button></td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
    });
    
    container.innerHTML = html;
}

function addNewStock(event) {
    event.preventDefault();
    const series = document.getElementById('newStockSeries').value;
    
    if (!stockMaster[series]) {
        stockMaster[series] = [];
    }
    
    stockMaster[series].push({
        material: document.getElementById('newStockMaterial').value,
        stock1: parseFloat(document.getElementById('newStock1').value),
        stock1Cost: parseFloat(document.getElementById('newStock1Cost').value),
        stock2: parseFloat(document.getElementById('newStock2').value),
        stock2Cost: parseFloat(document.getElementById('newStock2Cost').value)
    });
    
    autoSaveStock();
    alert('✅ Stock material added!');
    document.getElementById('newStockForm').reset();
    refreshStockMaster();
}

function updateStock(series, idx, field, value) {
    stockMaster[series][idx][field] = parseFloat(value);
    autoSaveStock();
}

function deleteStock(series, idx) {
    showConfirm('Delete this stock material?', () => {
        stockMaster[series].splice(idx, 1);
        autoSaveStock();
        refreshStockMaster();
    });
}

function updateKerf() {
    kerf = parseFloat(document.getElementById('kerfGlobal').value);
    autoSaveSettings();
}

// ============================================================================
// HARDWARE MASTER MANAGEMENT
// ============================================================================

function refreshHardwareMaster() {
    const container = document.getElementById('hardwareMasterList');
    let html = '';
    
    Object.entries(hardwareMaster).forEach(([series, hardwareItems]) => {
        html += `<div class="stock-material-card">
            <h4>${series} Series Hardware</h4>
            <table>
                <thead>
                    <tr>
                        <th>Hardware Item</th>
                        <th>Unit</th>
                        <th>Rate (₹)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;
        
        hardwareItems.forEach((item, idx) => {
            html += `<tr>
                <td>${item.hardware}</td>
                <td>${item.unit}</td>
                <td><input type="number" value="${item.rate}" onchange="updateHardwareRate('${series}', ${idx}, this.value)" style="width: 100px; padding: 5px;"></td>
                <td><button class="btn btn-secondary btn-sm" onclick="resetHardwareRate('${series}', ${idx})">🔄</button></td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
    });
    
    container.innerHTML = html;
}

function updateHardwareRate(series, idx, newRate) {
    hardwareMaster[series][idx].rate = parseFloat(newRate);
    autoSaveHardwareMaster();
}

function resetHardwareRate(series, idx) {
    if (confirm('Reset this hardware rate to default?')) {
        // Get default from initialization
        const defaultRates = {
            'Domal': [
                { hardware: 'Domal Shutter Lock', unit: 'Nos', rate: 50 },
                { hardware: 'Domal Wool Pile Weather Strip', unit: 'Meter', rate: 25 },
                { hardware: 'Domal Bearing', unit: 'Nos', rate: 30 },
                { hardware: 'Silicon', unit: 'Bottle', rate: 150 },
                { hardware: 'Corner Cleat', unit: 'Nos', rate: 15 },
                { hardware: 'Shutter Wing Connector', unit: 'Nos', rate: 20 },
                { hardware: 'Interlock Cap', unit: 'Nos', rate: 10 }
            ],
            '3/4': [
                { hardware: '3/4 Sliding Shutter Lock', unit: 'Nos', rate: 45 },
                { hardware: '3/4 Wool Pile Weather Strip', unit: 'Meter', rate: 22 },
                { hardware: '3/4 Bearing', unit: 'Nos', rate: 28 },
                { hardware: 'Silicon', unit: 'Bottle', rate: 150 }
            ],
            '1': [
                { hardware: '1" Sliding Shutter Lock', unit: 'Nos', rate: 48 },
                { hardware: '1" Wool Pile Weather Strip', unit: 'Meter', rate: 24 },
                { hardware: '1" Bearing', unit: 'Nos', rate: 32 },
                { hardware: 'Silicon', unit: 'Bottle', rate: 150 }
            ]
        };
        
        hardwareMaster[series][idx].rate = defaultRates[series][idx].rate;
        autoSaveHardwareMaster();
        refreshHardwareMaster();
        alert('✅ Hardware rate reset to default!');
    }
}

function autoSaveHardwareMaster() {
    localStorage.setItem('hardwareMaster', JSON.stringify(hardwareMaster));
}

function toggleHardwareFormulas() {
    const formulasRef = document.getElementById('hardwareFormulasRef');
    const toggle = document.getElementById('formulasToggle');
    
    if (formulasRef.style.display === 'none') {
        formulasRef.style.display = 'block';
        toggle.textContent = '▲';
    } else {
        formulasRef.style.display = 'none';
        toggle.textContent = '▼';
    }
}

// ============================================================================
// PROJECT SELECTOR
// ============================================================================

function refreshProjectSelector() {
    const select = document.getElementById('projectSelector');
    const projects = [...new Set(windows.map(w => w.projectName))];
    
    select.innerHTML = '<option value="">-- Select Project --</option>';
    projects.forEach(proj => {
        const count = windows.filter(w => w.projectName === proj).length;
        select.innerHTML += `<option value="${proj}">${proj} (${count} windows)</option>`;
    });
    
    select.onchange = function() {
        const info = document.getElementById('projectInfo');
        if (this.value) {
            const count = windows.filter(w => w.projectName === this.value).length;
            const seriesTypes = [...new Set(windows.filter(w => w.projectName === this.value).map(w => w.series))];
            info.innerHTML = `<strong>${count}</strong> windows | Series: <strong>${seriesTypes.join(', ')}</strong>`;
        } else {
            info.innerHTML = 'No project selected';
        }
    };
}

// ============================================================================
// CLEAR DATA
// ============================================================================

// ----------------------------
// Confirm modal helper
// ----------------------------
let __confirmCallback = null;
function showConfirm(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const msg = document.getElementById('confirmModalMessage');
    if (!modal || !msg) {
        // Fallback to browser confirm
        if (confirm(message)) onConfirm && onConfirm();
        return;
    }
    msg.textContent = message;
    __confirmCallback = onConfirm;
    modal.classList.add('active');
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.classList.remove('active');
    __confirmCallback = null;
}

// wire up buttons (if present)
function _wireConfirmButtons() {
    const ok = document.getElementById('confirmOkBtn');
    const cancel = document.getElementById('confirmCancelBtn');
    if (ok) {
        // avoid attaching multiple handlers
        ok.removeEventListener && ok.removeEventListener('click', ok._confirmHandler);
        ok._confirmHandler = function() {
            const cb = __confirmCallback; // capture before closing
            closeConfirmModal();
            if (typeof cb === 'function') cb();
        };
        ok.addEventListener('click', ok._confirmHandler);
    }
    if (cancel) {
        cancel.removeEventListener && cancel.removeEventListener('click', cancel._cancelHandler);
        cancel._cancelHandler = function() {
            closeConfirmModal();
        };
        cancel.addEventListener('click', cancel._cancelHandler);
    }
}

// Attempt immediate wiring and also wire on DOMContentLoaded as a fallback
_wireConfirmButtons();
document.addEventListener('DOMContentLoaded', _wireConfirmButtons);

function clearAllData() {
    showConfirm('⚠️ This will delete ALL saved data. Continue?', () => {
        StorageManager.clearAll();
        // Replace alert with modal-less notification or simple reload
        // you can add a toast later; for now reload to reflect cleared state
        location.reload();
    });
}

// ============================================================================
// INITIALIZATION ON PAGE LOAD
// ============================================================================

window.onload = function() {
    loadAllData();
    initializeDefaults();
    refreshAllUI();
};
