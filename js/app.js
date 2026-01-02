// Niruma Aluminum Profile Optimizer - Main App Logic

// ============================================================================
// HARDWARE MASTER CONFIGURATION
// ============================================================================

let hardwareMaster = {
    'Domal': [
        { hardware: 'Domal Shutter Lock', unit: 'Nos', rate: 150, formula: '2 + (MS > 0 ? 1 : 0)' },
        { hardware: 'Domal Wool Pile Weather Strip', unit: 'Meter', rate: 50, formula: '((GL("Domal Shutter") * 2) + GL("Domal Clip")) * 0.0254' },
        { hardware: 'Domal Bearing', unit: 'Nos', rate: 20, formula: '2 * (S + MS)' },
        { hardware: 'Silicon', unit: 'Bottle', rate: 80, formula: 'Math.ceil(P * 0.0254 / 1)' },
        { hardware: 'Corner Cleat', unit: 'Nos', rate: 10, formula: '4 * (S + MS)' },
        { hardware: 'Shutter Wing Connector', unit: 'Nos', rate: 5, formula: '8 * S + 8 * MS' },
        { hardware: 'Interlock Cap', unit: 'Nos', rate: 15, formula: 'S + MS' }
    ],
    '3/4': [
        { hardware: '3/4 Sliding Shutter Lock', unit: 'Nos', rate: 120, formula: '2 + (MS > 0 ? 1 : 0)' },
        { hardware: '3/4 Wool Pile Weather Strip', unit: 'Meter', rate: 45, formula: '(P * T + GL("Interlock")) * 0.0254' },
        { hardware: '3/4 Bearing', unit: 'Nos', rate: 18, formula: '2 * (S + MS)' },
        { hardware: 'Silicon', unit: 'Bottle', rate: 80, formula: 'Math.ceil(P * 0.0254 / 1)' }
    ],
    '1"': [
        { hardware: '1" Sliding Shutter Lock', unit: 'Nos', rate: 130, formula: '2 + (MS > 0 ? 1 : 0)' },
        { hardware: '1" Wool Pile Weather Strip', unit: 'Meter', rate: 48, formula: '(P * T + GL("Interlock")) * 0.0254' },
        { hardware: '1" Bearing', unit: 'Nos', rate: 20, formula: '2 * (S + MS)' },
        { hardware: 'Silicon', unit: 'Bottle', rate: 80, formula: 'Math.ceil(P * 0.0254 / 1)' }
    ]
};


// Global data store
let windows = [];
let seriesFormulas = {};
let stockMaster = {};
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
            '3/4"': [
                { component: '3/4" Handle', qty: '2', length: 'H-1.5', desc: 'Handles' },
                { component: '3/4" Interlock', qty: '2*S-2', length: 'H-1.5', desc: 'Interlocks' },
                { component: '3/4" Bearing Bottom', qty: '2*S', length: '(W-5-1.5*(S-1))/S', desc: 'Bearing Bottom' },
                { component: '3/4" Track Top', qty: '1', length: 'W', desc: 'Track Top' },
                { component: '3/4" Track Top', qty: '2', length: 'H', desc: 'Track Sides' },
                { component: '3/4" Track Bottom', qty: '1', length: 'W', desc: 'Track Bottom' },
                { component: '3/4" Handle', qty: '1*MS', length: 'H-1.5', desc: 'MS Handle' },
                { component: '3/4" Interlock', qty: '1*MS', length: 'H-1.5', desc: 'MS Interlock' },
                { component: '3/4" Bearing Bottom', qty: '2*MS', length: '(W-5-1.5*(S-1))/S', desc: 'MS Bearing Bottom' },
                { component: '3/4" C-channel', qty: '2*MS', length: 'H-1.5', desc: 'MS C-channel Vertical' },
                { component: '3/4" C-channel', qty: '2*MS', length: '(W-5-1.5*(S-1))/S', desc: 'MS C-channel Horizontal' }
            ],
            '1"': [
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
            '3/4"': [
                { material: '3/4" Handle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" Interlock', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" Bearing Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
            ],
            '1"': [
                { material: '1" Handle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Interlock', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Bearing Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
            ]
        };
    }

    // Initialize Hardware Master if not loaded
    const defaultHardwareMaster = {
        'Domal': [
            { hardware: 'Domal Shutter Lock', unit: 'Nos', rate: 150, formula: '2 + (MS > 0 ? 1 : 0)' },
            { hardware: 'Domal Wool Pile Weather Strip', unit: 'Meter', rate: 50, formula: '((GL("Domal Shutter") * 2) + GL("Domal Clip")) * 0.0254' },
            { hardware: 'Domal Bearing', unit: 'Nos', rate: 20, formula: '2 * (S + MS)' },
            { hardware: 'Silicon', unit: 'Bottle', rate: 80, formula: 'Math.ceil(P * 0.0254 / 1)' },
            { hardware: 'Corner Cleat', unit: 'Nos', rate: 10, formula: '4 * (S + MS)' },
            { hardware: 'Shutter Wing Connector', unit: 'Nos', rate: 5, formula: '8 * S + 8 * MS' },
            { hardware: 'Interlock Cap', unit: 'Nos', rate: 15, formula: 'S + MS' }
        ],
        '3/4"': [
            { hardware: '3/4" Sliding Shutter Lock', unit: 'Nos', rate: 120, formula: '2 + (MS > 0 ? 1 : 0)' },
            { hardware: '3/4" Wool Pile Weather Strip', unit: 'Meter', rate: 45, formula: '(P * T + GL("Interlock")) * 0.0254' },
            { hardware: '3/4" Bearing', unit: 'Nos', rate: 18, formula: '2 * (S + MS)' },
            { hardware: 'Silicon', unit: 'Bottle', rate: 80, formula: 'Math.ceil(P * 0.0254 / 1)' }
        ],
        '1"': [
            { hardware: '1" Sliding Shutter Lock', unit: 'Nos', rate: 130, formula: '2 + (MS > 0 ? 1 : 0)' },
            { hardware: '1" Wool Pile Weather Strip', unit: 'Meter', rate: 48, formula: '(P * T + GL("Interlock")) * 0.0254' },
            { hardware: '1" Bearing', unit: 'Nos', rate: 20, formula: '2 * (S + MS)' },
            { hardware: 'Silicon', unit: 'Bottle', rate: 80, formula: 'Math.ceil(P * 0.0254 / 1)' }
        ]
    };

    if (Object.keys(hardwareMaster).length === 0) {
        hardwareMaster = JSON.parse(JSON.stringify(defaultHardwareMaster));
        autoSaveHardwareMaster();
    } else {
        // Ensure formulas exist for existing items (migration helper)
        let updated = false;
        Object.entries(hardwareMaster).forEach(([series, items]) => {
            const defaults = defaultHardwareMaster[series] || [];
            items.forEach(item => {
                if (!item.formula) {
                    const defaultItem = defaults.find(d => d.hardware === item.hardware);
                    if (defaultItem) {
                        item.formula = defaultItem.formula;
                        updated = true;
                    }
                }
            });
        });
        if (updated) autoSaveHardwareMaster();
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
            series: '3/4"',
            description: 'Living Room Main'
        }];
    }

    refreshAllUI();
}

// ============================================================================
// UI MANAGEMENT
// ============================================================================

// Smooth scroll to sections - called from navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Refresh content based on which section we're scrolling to
        const sectionName = sectionId.replace('section-', '');
        refreshSectionContent(sectionName);

        // Ensure section is expanded if it was collapsed
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');
        if (header && header.classList.contains('collapsed')) {
            header.classList.remove('collapsed');
        }
        if (content && content.classList.contains('collapsed-content')) {
            content.classList.remove('collapsed-content');
        }
        if (section.classList.contains('collapsed-section')) {
            section.classList.remove('collapsed-section');
        }

        // Smooth scroll with native behavior
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Keep showTab for backward compatibility (for any inline onclick handlers)
function showTab(tabName) {
    // Map old tab names to new section IDs
    const sectionMap = {
        'input': 'section-add-windows',
        'windows': 'section-window-list',
        'formulas': 'section-formulas',
        'stock': 'section-stock',
        'hardware': 'section-hardware',
        'optimize': 'section-optimize',
        'results': 'section-results'
    };

    const sectionId = sectionMap[tabName] || 'section-' + tabName;
    scrollToSection(sectionId);
}

/**
 * Toggles a collapsible section
 * @param {HTMLElement} header - The header element of the section
 */
function toggleSection(header) {
    const section = header.parentElement;
    const content = header.nextElementSibling;

    if (!content || !content.classList.contains('collapsible-content')) {
        console.warn('No collapsible content found after header');
        return;
    }

    const isExpanding = header.classList.contains('collapsed');

    header.classList.toggle('collapsed');
    content.classList.toggle('collapsed-content');
    section.classList.toggle('collapsed-section');

    // If expanding, refresh the content inside
    if (isExpanding) {
        const sectionId = section.getAttribute('id') || '';
        const sectionName = sectionId.replace('section-', '');
        refreshSectionContent(sectionName);
    }
}

// Global helper to refresh specific section data
function refreshSectionContent(sectionName) {
    if (sectionName === 'window-list') {
        displayWindows();
    } else if (sectionName === 'formulas') {
        refreshFormulasDisplay();
    } else if (sectionName === 'stock') {
        refreshStockMaster();
    } else if (sectionName === 'hardware') {
        refreshHardwareMaster();
    } else if (sectionName === 'optimize') {
        refreshProjectSelector();
    } else if (sectionName === 'results') {
        if (typeof displayResults === 'function') displayResults();
    }
}

/**
 * Updates the statistics shown on the dashbaord tiles
 */
function updateDashboardStats() {
    const windowCountEl = document.getElementById('stat-window-count');
    const stockCountEl = document.getElementById('stat-stock-count');

    if (windowCountEl) {
        windowCountEl.textContent = `${windows.length} Windows Added`;
    }

    if (stockCountEl) {
        let totalMaterials = 0;
        Object.values(stockMaster).forEach(list => totalMaterials += list.length);
        stockCountEl.textContent = `${totalMaterials} Stock Items`;
    }
}

function refreshAllUI() {
    refreshSeriesDropdown();
    refreshFormulasDisplay();
    displayWindows();
    refreshStockMaster();
    refreshHardwareMaster();
    refreshProjectSelector();
    updateDashboardStats();
    renderSupplierMaster(); // New
    updateSupplierDatalist(); // New
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

    // Sync all unit toggle checkboxes
    const allUnitToggles = document.querySelectorAll('input[id*="unitToggle"]');
    const isMetric = unitMode === 'mm';
    allUnitToggles.forEach(toggle => {
        if (toggle) {
            toggle.checked = isMetric;
        }
    });

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

    // Get values
    const widthRaw = parseFloat(document.getElementById('width').value);
    const heightRaw = parseFloat(document.getElementById('height').value);
    const tracks = parseInt(document.getElementById('tracks').value, 10);
    const shutters = parseInt(document.getElementById('shutters').value, 10);

    // Validation
    if (widthRaw <= 0 || heightRaw <= 0) {
        showAlert('❌ Error: Width and Height must be greater than zero.', 'error');
        return;
    }
    if (shutters <= 0) {
        showAlert('❌ Error: Number of shutters must be at least 1.', 'error');
        return;
    }

    const window = {
        configId: document.getElementById('configId').value,
        projectName: document.getElementById('projectName').value,
        width: convertToInches(widthRaw),
        height: convertToInches(heightRaw),
        tracks: tracks,
        shutters: shutters,
        mosquitoShutters: parseInt(document.getElementById('mosquitoShutters').value),
        series: document.getElementById('series').value,
        description: document.getElementById('description').value
    };

    windows.push(window);
    autoSaveWindows();

    const lastNum = parseInt(window.configId.substring(1));
    document.getElementById('configId').value = 'W' + String(lastNum + 1).padStart(2, '0');

    showAlert('✅ Window ' + window.configId + ' added successfully!');
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

    const widthRaw = parseFloat(document.getElementById('editWidth').value);
    const heightRaw = parseFloat(document.getElementById('editHeight').value);
    const shutters = parseInt(document.getElementById('editShutters').value, 10);

    // Validation
    if (widthRaw <= 0 || heightRaw <= 0) {
        showAlert('❌ Error: Width and Height must be greater than zero.', 'error');
        return;
    }
    if (shutters <= 0) {
        showAlert('❌ Error: Number of shutters must be at least 1.', 'error');
        return;
    }

    windows[idx] = {
        configId: document.getElementById('editConfigId').value,
        projectName: document.getElementById('editProjectName').value,
        width: convertToInches(widthRaw),
        height: convertToInches(heightRaw),
        tracks: parseInt(document.getElementById('editTracks').value),
        shutters: shutters,
        mosquitoShutters: parseInt(document.getElementById('editMosquitoShutters').value),
        series: document.getElementById('editSeries').value,
        description: document.getElementById('editDescription').value
    };

    autoSaveWindows();
    closeEditWindowModal();
    displayWindows();
    refreshProjectSelector();
    showAlert('✅ Window updated successfully!');
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
    showAlert('✅ Component added successfully!');
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
    showAlert('✅ Formula updated successfully!');
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
    let seriesName = document.getElementById('newSeriesName').value.trim();

    // Market Standard Normalization
    if (seriesName === '1') seriesName = '1"';
    if (seriesName === '3/4') seriesName = '3/4"';

    if (!seriesFormulas[seriesName]) {
        seriesFormulas[seriesName] = [];
        stockMaster[seriesName] = [];
        hardwareMaster[seriesName] = []; // Ensure hardware entry exists too
    }

    seriesFormulas[seriesName].push({
        component: document.getElementById('newComponentName').value,
        qty: document.getElementById('newQtyFormula').value,
        length: document.getElementById('newLengthFormula').value,
        desc: document.getElementById('newComponentDesc').value
    });

    autoSaveFormulas();
    autoSaveStock();
    showAlert('✅ Component added to ' + seriesName + ' series!');
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
    if (!container) return;
    container.innerHTML = '';

    Object.entries(stockMaster).forEach(([series, stocks]) => {
        const card = document.createElement('div');
        card.className = 'stock-material-card';
        card.innerHTML = `
            <h4>${series} Series Materials</h4>
            <table>
                <thead>
                    <tr>
                        <th>Material</th>
                        <th>Supplier / Section</th>
                        <th>Stock 1 (in)</th>
                        <th>Cost (₹)</th>
                        <th>Stock 2 (in)</th>
                        <th>Cost (₹)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;

        const tbody = card.querySelector('tbody');
        stocks.forEach((stock, idx) => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${stock.material}</td>
                <td style="font-size: 0.8em; color: #666;">
                    ${stock.supplier || 'N/A'}<br>
                    ${stock.sectionNo || 'N/A'}
                </td>
                <td><input type="number" value="${stock.stock1}" onchange="updateStock('${series}', ${idx}, 'stock1', this.value)" style="width: 70px; padding: 5px;"></td>
                <td><input type="number" value="${stock.stock1Cost}" onchange="updateStock('${series}', ${idx}, 'stock1Cost', this.value)" style="width: 70px; padding: 5px;"></td>
                <td><input type="number" value="${stock.stock2}" onchange="updateStock('${series}', ${idx}, 'stock2', this.value)" style="width: 70px; padding: 5px;"></td>
                <td><input type="number" value="${stock.stock2Cost}" onchange="updateStock('${series}', ${idx}, 'stock2Cost', this.value)" style="width: 70px; padding: 5px;"></td>
                <td style="text-align:center">
                    <button class="btn btn-danger btn-sm" onclick="deleteStock('${series}', ${idx})">🗑️</button>
                </td>
            `;
        });

        container.appendChild(card);
    });
}

function addNewStock(event) {
    event.preventDefault();
    const series = document.getElementById('newStockSeries').value;

    if (!stockMaster[series]) {
        stockMaster[series] = [];
    }

    stockMaster[series].push({
        material: document.getElementById('newStockMaterial').value,
        supplier: document.getElementById('newStockSupplier').value,
        sectionNo: document.getElementById('newStockSectionNo').value,
        thickness: tempSupData.t,
        weight: tempSupData.weight,
        stock1: parseFloat(document.getElementById('newStock1').value),
        stock1Cost: parseFloat(document.getElementById('newStock1Cost').value),
        stock2: parseFloat(document.getElementById('newStock2').value),
        stock2Cost: parseFloat(document.getElementById('newStock2Cost').value)
    });

    autoSaveStock();
    showAlert('✅ Stock material added!');
    document.getElementById('newStockForm').reset();
    tempSupData = { t: 0, weight: 0 };
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
    if (!container) return;
    let html = '';

    Object.entries(hardwareMaster).forEach(([series, hardwareItems]) => {
        html += `< div class="stock-material-card" >
            <h4>${series} Series Hardware
                <button class="btn btn-success btn-sm" style="float: right;" onclick="showAddHardwareModal('${series}')">➕ Add Item</button>
            </h4>
            <div style="overflow-x: auto;">
                <table class="hardware-table">
                    <thead>
                        <tr>
                            <th style="width: 25%">Hardware Item</th>
                            <th style="width: 10%">Unit</th>
                            <th style="width: 40%">Quantity Formula <span class="formula-info-icon" title="H: Height, W: Width, S: Shutters, MS: Mosquito, T: Tracks, GL: Get Length">ⓘ</span></th>
                            <th style="width: 15%">Rate (₹)</th>
                            <th style="width: 10%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>`;

        hardwareItems.forEach((item, idx) => {
            html += `<tr>
                <td>${item.hardware}</td>
                <td><input type="text" value="${item.unit || 'Nos'}" onchange="updateHardwareField('${series}', ${idx}, 'unit', this.value)" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td><input type="text" value="${item.formula || ''}" onchange="updateHardwareField('${series}', ${idx}, 'formula', this.value)" style="width: 100%; font-family: monospace; padding: 5px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td><input type="number" value="${item.rate}" onchange="updateHardwareField('${series}', ${idx}, 'rate', this.value)" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteHardwareItem('${series}', ${idx})">🗑️</button></td>
            </tr>`;
        });

        html += '</tbody></table></div></div > ';
    });

    container.innerHTML = html;
}

function updateHardwareField(series, idx, field, value) {
    if (field === 'rate') {
        hardwareMaster[series][idx][field] = parseFloat(value);
    } else {
        hardwareMaster[series][idx][field] = value;
    }
    autoSaveHardwareMaster();
}

function showAddHardwareModal(series) {
    document.getElementById('addHardwareSeries').value = series;
    document.getElementById('modalHardwareName').value = '';
    document.getElementById('modalHardwareUnit').value = 'Nos';
    document.getElementById('modalHardwareFormula').value = '';
    document.getElementById('modalHardwareRate').value = '';
    document.getElementById('addHardwareModal').classList.add('active');
}

function closeAddHardwareModal() {
    document.getElementById('addHardwareModal').classList.remove('active');
}

function saveNewHardwareItem(event) {
    event.preventDefault();
    const series = document.getElementById('addHardwareSeries').value;
    const hardware = document.getElementById('modalHardwareName').value;
    const unit = document.getElementById('modalHardwareUnit').value;
    const formula = document.getElementById('modalHardwareFormula').value;
    const rate = parseFloat(document.getElementById('modalHardwareRate').value) || 0;

    if (!hardwareMaster[series]) hardwareMaster[series] = [];

    hardwareMaster[series].push({ hardware, unit, formula, rate });
    autoSaveHardwareMaster();
    closeAddHardwareModal();
    refreshHardwareMaster();
    showAlert('✅ Hardware item added!');
}

function deleteHardwareItem(series, idx) {
    showConfirm(`Delete ${hardwareMaster[series][idx].hardware}?`, () => {
        hardwareMaster[series].splice(idx, 1);
        autoSaveHardwareMaster();
        refreshHardwareMaster();
    });
}

function autoSaveHardwareMaster() {
    localStorage.setItem('hardwareMaster', JSON.stringify(hardwareMaster));
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

    select.onchange = function () {
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
// Custom themed alert & confirm modals
// ----------------------------
let __confirmCallback = null;

function showAlert(message, type = 'info', title = 'Notification') {
    const modal = document.getElementById('alertModal');
    const msgEl = document.getElementById('alertModalMessage');
    const titleEl = document.getElementById('alertModalTitle');
    const iconEl = document.getElementById('alertModalIcon');
    const okBtn = modal ? modal.querySelector('.btn-modal-success') : null;

    if (!modal || !msgEl) {
        alert(message);
        return;
    }

    // Set content
    msgEl.textContent = message;
    if (titleEl) titleEl.textContent = title;

    // Handle icons & button colors based on type
    if (iconEl) {
        if (message.includes('✅') || type === 'success') iconEl.textContent = '✅';
        else if (message.includes('⚠️') || type === 'warning') iconEl.textContent = '⚠️';
        else if (message.includes('❌') || type === 'error') iconEl.textContent = '❌';
        else iconEl.textContent = 'ℹ️';
    }

    if (okBtn) {
        // Reset classes
        okBtn.className = 'btn-modal';
        if (type === 'error' || message.includes('❌')) okBtn.classList.add('btn-modal-confirm');
        else okBtn.classList.add('btn-modal-success');
    }

    // Strip leading icon if found in text to avoid duplication
    msgEl.textContent = message.replace(/^[✅⚠️❌ℹ️]\s*/, '');

    modal.classList.add('active');
}

function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    if (modal) modal.classList.remove('active');
}

function showConfirm(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const msg = document.getElementById('confirmModalMessage');
    const iconEl = document.getElementById('confirmModalIcon');

    if (!modal || !msg) {
        if (confirm(message)) onConfirm && onConfirm();
        return;
    }

    msg.textContent = message;

    // Auto-detect warning icon
    if (iconEl) {
        if (message.includes('⚠️')) iconEl.textContent = '⚠️';
        else if (message.includes('🗑️')) iconEl.textContent = '🗑️';
        else iconEl.textContent = '❓';
    }

    // Strip icon from text
    msg.textContent = message.replace(/^[⚠️🗑️❓]\s*/, '');

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
        ok._confirmHandler = function () {
            const cb = __confirmCallback; // capture before closing
            closeConfirmModal();
            if (typeof cb === 'function') cb();
        };
        ok.addEventListener('click', ok._confirmHandler);
    }
    if (cancel) {
        cancel.removeEventListener && cancel.removeEventListener('click', cancel._cancelHandler);
        cancel._cancelHandler = function () {
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

window.onload = function () {
    loadAllData();
    initializeDefaults();
    initializeSupplierMaster(); // New
    refreshAllUI();
};
// ============================================================================
// SUPPLIER MASTER UI
// ============================================================================

function renderSupplierMaster() {
    const list = document.getElementById('supplierMasterList');
    if (!list) return;

    list.innerHTML = '';

    if (Object.keys(supplierMaster).length === 0) {
        list.innerHTML = '<div class="alert alert-info">No supplier sections configured.</div>';
        return;
    }

    for (const [supplier, seriesObj] of Object.entries(supplierMaster)) {
        const supDiv = document.createElement('div');
        supDiv.className = 'supplier-card';
        supDiv.style.border = '1px solid #ddd';
        supDiv.style.padding = '15px';
        supDiv.style.marginBottom = '15px';
        supDiv.style.borderRadius = '8px';
        supDiv.style.background = '#f9f9f9';

        supDiv.innerHTML = `<h4 style="margin-top:0; border-bottom: 2px solid #007bff; padding-bottom:5px;">🏭 ${supplier}</h4>`;

        for (const [series, materials] of Object.entries(seriesObj)) {
            const seriesGroup = document.createElement('div');
            seriesGroup.className = 'series-group';
            seriesGroup.style.marginLeft = '15px';
            seriesGroup.innerHTML = `<h5 style="margin-bottom:10px; color:#555;">${series} Series</h5>`;

            for (const [material, sections] of Object.entries(materials)) {
                const matBlock = document.createElement('div');
                matBlock.className = 'material-block';
                matBlock.innerHTML = `<p><strong>${material}</strong></p>`;

                const table = document.createElement('table');
                table.className = 'stock-table';
                table.style.width = '100%';
                table.style.marginBottom = '15px';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Section No.</th>
                            <th>T (mm)</th>
                            <th>Wt (Kg/12ft)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;

                const tbody = table.querySelector('tbody');
                sections.forEach((sec, idx) => {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td><input type="text" value="${sec.sectionNo}" onchange="editSupplierSection('${supplier}', '${series}', '${material}', ${idx}, 'sectionNo', this.value)" style="width:80px"></td>
                        <td><input type="number" step="0.01" value="${sec.t}" onchange="editSupplierSection('${supplier}', '${series}', '${material}', ${idx}, 't', this.value)" style="width:60px"></td>
                        <td><input type="number" step="0.001" value="${sec.weight}" onchange="editSupplierSection('${supplier}', '${series}', '${material}', ${idx}, 'weight', this.value)" style="width:70px"></td>
                        <td style="text-align:center">
                            <button class="btn-icon btn-danger" onclick="deleteSupplierSection('${supplier}', '${series}', '${material}', ${idx})" title="Delete Section">🗑️</button>
                        </td>
                    `;
                });

                seriesGroup.appendChild(matBlock);
                seriesGroup.appendChild(table);
            }
            supDiv.appendChild(seriesGroup);
        }
        list.appendChild(supDiv);
    }
}

function addNewSupplierSection(event) {
    event.preventDefault();
    const supName = document.getElementById('supName').value.trim();
    const series = document.getElementById('supSeries').value;
    const material = document.getElementById('supMaterial').value.trim();
    const sectionNo = document.getElementById('supSectionNo').value.trim();
    const t = parseFloat(document.getElementById('supT').value);
    const weight = parseFloat(document.getElementById('supWeight').value);

    if (!supplierMaster[supName]) supplierMaster[supName] = {};
    if (!supplierMaster[supName][series]) supplierMaster[supName][series] = {};
    if (!supplierMaster[supName][series][material]) supplierMaster[supName][series][material] = [];

    supplierMaster[supName][series][material].push({ sectionNo, t, weight });

    autoSaveSupplierMaster();
    renderSupplierMaster();
    updateSupplierDatalist();
    event.target.reset();
    showAlert('✅ Section added to ' + supName);
}

function editSupplierSection(supplier, series, material, index, field, value) {
    let finalVal = value;
    if (field === 't' || field === 'weight') finalVal = parseFloat(value);

    supplierMaster[supplier][series][material][index][field] = finalVal;
    autoSaveSupplierMaster();
}

function deleteSupplierSection(supplier, series, material, index) {
    showConfirm('🗑️ Delete this section from ' + supplier + '?', () => {
        supplierMaster[supplier][series][material].splice(index, 1);

        // Cleanup empty structures
        if (supplierMaster[supplier][series][material].length === 0) {
            delete supplierMaster[supplier][series][material];
        }
        if (Object.keys(supplierMaster[supplier][series]).length === 0) {
            delete supplierMaster[supplier][series];
        }
        if (Object.keys(supplierMaster[supplier]).length === 0) {
            delete supplierMaster[supplier];
        }

        autoSaveSupplierMaster();
        renderSupplierMaster();
        updateSupplierDatalist();
    });
}

function updateSupplierDatalist() {
    const list = document.getElementById('supplierList');
    if (!list) return;
    list.innerHTML = '';
    Object.keys(supplierMaster).forEach(sup => {
        const opt = document.createElement('option');
        opt.value = sup;
        list.appendChild(opt);
    });
}
function updateNewStockMaterialOptions() {
    const series = document.getElementById('newStockSeries').value;
    const supplierSelect = document.getElementById('newStockSupplier');
    if (!supplierSelect) return;

    // Reset supplier and section
    supplierSelect.innerHTML = '<option value="">-- No Supplier --</option>';
    document.getElementById('newStockSectionNo').innerHTML = '<option value="">-- Select Section --</option>';

    // Filter suppliers that have data for this series
    Object.keys(supplierMaster).forEach(sup => {
        if (supplierMaster[sup][series]) {
            const opt = document.createElement('option');
            opt.value = sup;
            opt.textContent = sup;
            supplierSelect.appendChild(opt);
        }
    });
}

function updateSupplierSectionOptions() {
    const series = document.getElementById('newStockSeries').value;
    const supplier = document.getElementById('newStockSupplier').value;
    const material = document.getElementById('newStockMaterial').value.trim();
    const sectionSelect = document.getElementById('newStockSectionNo');

    if (!sectionSelect) return;
    sectionSelect.innerHTML = '<option value="">-- Select Section --</option>';

    if (!supplier || !series || !material) return;

    // Look for exact match or partial match in supplier master
    const supSeries = supplierMaster[supplier][series];
    if (supSeries) {
        // Find the material key
        const matKey = Object.keys(supSeries).find(k => k.toLowerCase().includes(material.toLowerCase()));
        if (matKey) {
            supSeries[matKey].forEach(sec => {
                const opt = document.createElement('option');
                opt.value = sec.sectionNo;
                opt.textContent = `${sec.sectionNo} (T:${sec.t}, W:${sec.weight})`;
                sectionSelect.appendChild(opt);
            });
        }
    }
}

function applySupplierDataToStock() {
    const series = document.getElementById('newStockSeries').value;
    const supplier = document.getElementById('newStockSupplier').value;
    const material = document.getElementById('newStockMaterial').value.trim();
    const sectionNo = document.getElementById('newStockSectionNo').value;

    if (!supplier || !series || !material || !sectionNo) return;

    const supSeries = supplierMaster[supplier][series];
    const matKey = Object.keys(supSeries).find(k => k.toLowerCase().includes(material.toLowerCase()));
    if (matKey) {
        const section = supSeries[matKey].find(s => s.sectionNo === sectionNo);
        if (section) {
            tempSupData = { t: section.t, weight: section.weight };
            console.log('Applied supplier data:', tempSupData);
        }
    }
}

// ============================================================================
// SECTION SELECTION MODAL
// ============================================================================

let currentSelectingMaterial = null;
let availableSections = [];

function openSectionSelectModal(materialKey) {
    currentSelectingMaterial = materialKey;
    document.getElementById('selectMaterialName').textContent = materialKey;

    // Get all matching sections
    const [series, materialName] = materialKey.split(' | ');
    availableSections = [];

    Object.entries(supplierMaster).forEach(([supplier, seriesObj]) => {
        if (seriesObj[series]) {
            // Find material matches (partial match)
            const matMatches = Object.keys(seriesObj[series]).filter(k =>
                k.toLowerCase().includes(materialName.toLowerCase()) ||
                materialName.toLowerCase().includes(k.toLowerCase())
            );

            matMatches.forEach(matKey => {
                const sections = seriesObj[series][matKey];
                sections.forEach(sec => {
                    availableSections.push({
                        supplier: supplier,
                        materialKey: matKey,
                        sectionNo: sec.sectionNo,
                        t: sec.t,
                        weight: sec.weight
                    });
                });
            });
        }
    });

    // Populate dropdown
    const dropdown = document.getElementById('thicknessSelect');
    dropdown.innerHTML = '<option value="">-- Select Thickness --</option>';

    availableSections.forEach((sec, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `${sec.t}mm - ${sec.supplier} (Sec: ${sec.sectionNo}, Wt: ${sec.weight}Kg)`;
        dropdown.appendChild(opt);
    });

    // Populate catalogue view
    populateCatalogueList(series, materialName);

    // Hide details initially
    document.getElementById('selectedSectionDetails').style.display = 'none';

    document.getElementById('sectionSelectModal').classList.add('active');
}

function closeSectionSelectModal() {
    document.getElementById('sectionSelectModal').classList.remove('active');
    currentSelectingMaterial = null;
    availableSections = [];
}

function showSelectedSectionDetails() {
    const dropdown = document.getElementById('thicknessSelect');
    const selectedIdx = dropdown.value;
    const detailsDiv = document.getElementById('selectedSectionDetails');
    const contentDiv = document.getElementById('sectionDetailsContent');

    if (selectedIdx === '') {
        detailsDiv.style.display = 'none';
        return;
    }

    const section = availableSections[parseInt(selectedIdx)];

    contentDiv.innerHTML = `
        <div style="line-height: 1.8;">
            <strong>Supplier:</strong> ${section.supplier}<br>
            <strong>Material:</strong> ${section.materialKey}<br>
            <strong>Section Number:</strong> ${section.sectionNo}<br>
            <strong>Thickness (T):</strong> ${section.t} mm<br>
            <strong>Weight per 12ft stick:</strong> ${section.weight} Kg
        </div>
    `;

    detailsDiv.style.display = 'block';
}

function confirmSectionSelection() {
    const dropdown = document.getElementById('thicknessSelect');
    const selectedIdx = dropdown.value;

    if (selectedIdx === '') {
        showAlert('⚠️ Please select a thickness option first!');
        return;
    }

    const section = availableSections[parseInt(selectedIdx)];

    if (!optimizationResults) return;

    if (!optimizationResults.componentSections) {
        optimizationResults.componentSections = {};
    }

    optimizationResults.componentSections[currentSelectingMaterial] = {
        supplier: section.supplier,
        sectionNo: section.sectionNo,
        t: section.t,
        weight: section.weight
    };

    autoSaveResults();
    closeSectionSelectModal();
    if (typeof displayResults === 'function') displayResults();
    showAlert(`✅ Section ${section.sectionNo} (T: ${section.t}mm) selected for ${currentSelectingMaterial}`);
}

function populateCatalogueList(series, materialName) {
    const catalogueDiv = document.getElementById('catalogueList');
    catalogueDiv.innerHTML = '';

    Object.entries(supplierMaster).forEach(([supplier, seriesObj]) => {
        if (seriesObj[series]) {
            const matMatches = Object.keys(seriesObj[series]).filter(k =>
                k.toLowerCase().includes(materialName.toLowerCase()) ||
                materialName.toLowerCase().includes(k.toLowerCase())
            );

            matMatches.forEach(matKey => {
                const sections = seriesObj[series][matKey];

                const groupDiv = document.createElement('div');
                groupDiv.style.marginBottom = '15px';
                groupDiv.style.padding = '10px';
                groupDiv.style.background = '#f8f9fa';
                groupDiv.style.borderRadius = '5px';
                groupDiv.innerHTML = `<h5 style="margin: 0 0 10px 0; color: #2c3e50;">${supplier} - ${matKey}</h5>`;

                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.fontSize = '0.85em';
                table.innerHTML = `
                    <thead>
                        <tr style="background: #34495e; color: white;">
                            <th style="padding: 5px;">Section No.</th>
                            <th style="padding: 5px;">T (mm)</th>
                            <th style="padding: 5px;">Wt (Kg)</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;

                const tbody = table.querySelector('tbody');
                sections.forEach((sec, idx) => {
                    const row = tbody.insertRow();
                    row.style.background = idx % 2 === 0 ? 'white' : '#ecf0f1';
                    row.innerHTML = `
                        <td style="padding: 5px;">${sec.sectionNo}</td>
                        <td style="padding: 5px;">${sec.t}</td>
                        <td style="padding: 5px;">${sec.weight}</td>
                    `;
                });

                groupDiv.appendChild(table);
                catalogueDiv.appendChild(groupDiv);
            });
        }
    });

    if (catalogueDiv.innerHTML === '') {
        catalogueDiv.innerHTML = '<div class="alert alert-warning">No catalogue sections found for this material.</div>';
    }
}
