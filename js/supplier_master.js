/**
 * supplier_master.js
 * Manages supplier-specific sectional data (Section No, T, Weight)
 */

let supplierMaster = {};

const DEFAULT_SUPPLIER_DATA = {
    "Windalco Aluminium": {
        "3/4\"": {
            "3/4\" Handle": [
                { sectionNo: "20011", t: 0.60, weight: 0.850 },
                { sectionNo: "20012", t: 0.79, weight: 1.100 },
                { sectionNo: "20013", t: 0.92, weight: 1.300 },
                { sectionNo: "20014", t: 1.20, weight: 1.500 },
                { sectionNo: "20015", t: 1.50, weight: 1.875 }
            ],
            "3/4\" Inter Lock": [
                { sectionNo: "20016", t: 0.79, weight: 1.300 },
                { sectionNo: "20017", t: 0.95, weight: 1.475 },
                { sectionNo: "20018", t: 1.20, weight: 1.625 },
                { sectionNo: "20019", t: 1.50, weight: 2.100 }
            ],
            "3/4\" Top Bottom": [
                { sectionNo: "20020", t: 0.73, weight: 1.100 },
                { sectionNo: "20021", t: 0.93, weight: 1.300 },
                { sectionNo: "20022", t: 1.10, weight: 1.500 },
                { sectionNo: "20023", t: 1.20, weight: 1.675 },
                { sectionNo: "20024", t: 1.35, weight: 1.875 }
            ],
            "3/4\" Middle": [
                { sectionNo: "20025", t: 0.60, weight: 0.900 },
                { sectionNo: "20026", t: 1.00, weight: 1.300 }
            ],
            "3/4\" 2 Track Top": [
                { sectionNo: "20030", t: 0.84, weight: 1.600 },
                { sectionNo: "20031", t: 0.94, weight: 1.800 },
                { sectionNo: "20032", t: 1.04, weight: 2.000 },
                { sectionNo: "20033", t: 1.14, weight: 2.200 },
                { sectionNo: "20034", t: 1.20, weight: 2.600 },
                { sectionNo: "20035", t: 1.50, weight: 2.700 }
            ],
            "3/4\" 2 Track Bottom": [
                { sectionNo: "20036", t: 0.85, weight: 1.700 },
                { sectionNo: "20037", t: 1.00, weight: 2.000 },
                { sectionNo: "20038", t: 1.15, weight: 2.300 },
                { sectionNo: "20039", t: 1.50, weight: 3.100 }
            ],
            "3/4\" 3 Track Top": [
                { sectionNo: "20040", t: 0.85, weight: 2.200 },
                { sectionNo: "20041", t: 0.95, weight: 2.700 },
                { sectionNo: "20042", t: 1.30, weight: 3.400 },
                { sectionNo: "20043", t: 1.50, weight: 3.700 }
            ],
            "3/4\" 3 Track Bottom": [
                { sectionNo: "20044", t: 0.80, weight: 2.600 },
                { sectionNo: "20045", t: 1.10, weight: 3.200 },
                { sectionNo: "20046", t: 1.50, weight: 4.500 }
            ],
            "3/4\" 4 Track Top": [
                { sectionNo: "20047", t: 0.97, weight: 3.400 }
            ],
            "3/4\" 4 Track Bottom": [
                { sectionNo: "20048", t: 1.00, weight: 5.100 }
            ]
        },
        "1\"": {
            "1\" Handle": [
                { sectionNo: "20049", t: 0.80, weight: 1.275 },
                { sectionNo: "20050", t: 0.75, weight: 1.325 },
                { sectionNo: "20051", t: 0.80, weight: 1.450 },
                { sectionNo: "20052", t: 0.85, weight: 1.600 },
                { sectionNo: "20053", t: 1.20, weight: 2.200 },
                { sectionNo: "20054", t: 1.40, weight: 2.500 },
                { sectionNo: "20055", t: 1.50, weight: 2.700 },
                { sectionNo: "20056", t: 1.20, weight: 2.900 }
            ],
            "1\" Interlock": [
                { sectionNo: "20101", t: 0.92, weight: 2.400 }
            ],
            "1\" 2 Track Top": [
                { sectionNo: "20077", t: 1.30, weight: 2.500 }
            ],
            "1\" 2 Track Bottom": [
                { sectionNo: "20078", t: 1.15, weight: 2.500 }
            ],
            "1\" 3 Track Top": [
                { sectionNo: "20080", t: 1.20, weight: 3.400 }
            ],
            "1\" 3 Track Bottom": [
                { sectionNo: "20079", t: 1.13, weight: 3.600 }
            ]
        }
    },
    "JK ALU EXTRUSION": {
        "3/4\"": {
            "3/4\" Handle": [
                { sectionNo: "1101", t: 0.70, weight: 0.950 },
                { sectionNo: "1102", t: 0.80, weight: 1.100 },
                { sectionNo: "1103", t: 0.95, weight: 1.300 },
                { sectionNo: "1104", t: 1.10, weight: 1.500 },
                { sectionNo: "1105", t: 1.25, weight: 1.700 },
                { sectionNo: "1106", t: 1.40, weight: 1.900 },
                { sectionNo: "1107", t: 1.54, weight: 2.100 },
                { sectionNo: "1108", t: 1.66, weight: 2.300 }
            ],
            "3/4\" Interlock": [
                { sectionNo: "1201", t: 0.75, weight: 1.200 },
                { sectionNo: "1202", t: 0.85, weight: 1.350 },
                { sectionNo: "1203", t: 0.94, weight: 1.500 },
                { sectionNo: "1204", t: 1.10, weight: 1.700 },
                { sectionNo: "1205", t: 1.25, weight: 1.900 },
                { sectionNo: "1206", t: 1.31, weight: 2.100 },
                { sectionNo: "1207", t: 1.44, weight: 2.300 },
                { sectionNo: "1208", t: 1.55, weight: 2.500 }
            ],
            "3/4\" Single Track Top": [
                { sectionNo: "1901", t: 0.90, weight: 1.000 }
            ],
            "3/4\" Single Track Bottom": [
                { sectionNo: "2001", t: 0.90, weight: 1.100 }
            ],
            "3/4\" 2 Track Top": [
                { sectionNo: "2101", t: 0.80, weight: 1.400 },
                { sectionNo: "2102", t: 0.87, weight: 1.600 },
                { sectionNo: "2103", t: 0.95, weight: 1.800 },
                { sectionNo: "2104", t: 1.05, weight: 2.000 },
                { sectionNo: "2105", t: 1.20, weight: 2.200 },
                { sectionNo: "2106", t: 1.50, weight: 2.800 },
                { sectionNo: "2107", t: 1.60, weight: 3.000 }
            ],
            "3/4\" 2 Track Bottom": [
                { sectionNo: "2201", t: 0.70, weight: 1.600 },
                { sectionNo: "2202", t: 0.80, weight: 1.800 },
                { sectionNo: "2203", t: 0.94, weight: 2.000 },
                { sectionNo: "2204", t: 1.10, weight: 2.200 },
                { sectionNo: "2205", t: 1.50, weight: 3.000 }
            ],
            "3/4\" 3 Track Top": [
                { sectionNo: "2301", t: 0.70, weight: 1.800 },
                { sectionNo: "2302", t: 0.75, weight: 2.000 },
                { sectionNo: "2303", t: 0.85, weight: 2.200 },
                { sectionNo: "2304", t: 0.90, weight: 2.400 },
                { sectionNo: "2305", t: 0.97, weight: 2.600 },
                { sectionNo: "2306", t: 1.04, weight: 2.800 },
                { sectionNo: "2307", t: 1.20, weight: 3.000 },
                { sectionNo: "2308", t: 1.25, weight: 3.200 },
                { sectionNo: "2309", t: 1.40, weight: 3.600 },
                { sectionNo: "2310", t: 1.50, weight: 3.900 }
            ],
            "3/4\" 3 Track Bottom": [
                { sectionNo: "2401", t: 0.70, weight: 2.200 },
                { sectionNo: "2402", t: 0.76, weight: 2.400 },
                { sectionNo: "2403", t: 0.84, weight: 2.600 },
                { sectionNo: "2404", t: 1.00, weight: 2.800 },
                { sectionNo: "2405", t: 1.15, weight: 3.000 },
                { sectionNo: "2406", t: 1.20, weight: 3.800 },
                { sectionNo: "2407", t: 1.32, weight: 4.000 },
                { sectionNo: "2408", t: 1.50, weight: 4.400 }
            ],
            "3/4\" 4 Track Top": [
                { sectionNo: "2501", t: 1.10, weight: 3.200 },
                { sectionNo: "2502", t: 1.20, weight: 3.800 },
                { sectionNo: "2503", t: 1.45, weight: 4.800 }
            ],
            "3/4\" 4 Track Bottom": [
                { sectionNo: "2601", t: 1.00, weight: 4.000 },
                { sectionNo: "2602", t: 1.28, weight: 4.800 }
            ]
        },
        "1\"": {
            "1\" Handle": [
                { sectionNo: "1151", t: 0.78, weight: 1.500 },
                { sectionNo: "1152", t: 0.93, weight: 1.700 },
                { sectionNo: "1153", t: 1.08, weight: 1.900 },
                { sectionNo: "1154", t: 1.23, weight: 2.100 },
                { sectionNo: "1155", t: 1.38, weight: 2.300 },
                { sectionNo: "1156", t: 1.53, weight: 2.500 }
            ],
            "1\" 2 Track Top": [
                { sectionNo: "2151", t: 1.20, weight: 2.000 },
                { sectionNo: "2152", t: 1.30, weight: 2.300 }
            ],
            "1\" 2 Track Bottom": [
                { sectionNo: "2251", t: 1.20, weight: 2.400 },
                { sectionNo: "2252", t: 1.30, weight: 2.600 }
            ],
            "1\" 3 Track Top": [
                { sectionNo: "2351", t: 1.25, weight: 3.200 },
                { sectionNo: "2352", t: 1.35, weight: 3.500 }
            ],
            "1\" 3 Track Bottom": [
                { sectionNo: "2451", t: 1.18, weight: 3.600 },
                { sectionNo: "2452", t: 1.30, weight: 4.000 }
            ],
            "1\" 4 Track Top": [
                { sectionNo: "2551", t: 1.20, weight: 4.500 }
            ],
            "1\" 4 Track Bottom": [
                { sectionNo: "2651", t: 1.02, weight: 4.700 }
            ]
        }
    },
    "Vitco": {
        "19mm UMA Series": {
            "Track (Horiz)": [
                { sectionNo: "UMA-01 (2T)", t: 1.20, weight: 3.018 },
                { sectionNo: "UMA-02 (3T)", t: 1.20, weight: 4.462 }
            ],
            "Handle (Vert)": [
                { sectionNo: "UMA-11", t: 1.20, weight: 1.554 },
                { sectionNo: "UMA-21", t: 1.20, weight: 2.103 }
            ],
            "Interlock (Vert)": [
                { sectionNo: "UMA-13 (Slim)", t: 1.20, weight: 1.353 },
                { sectionNo: "UMA-14 (Reinf)", t: 1.20, weight: 2.260 },
                { sectionNo: "UMA-22 (Univ)", t: 1.25, weight: 1.847 }
            ],
            "Top/Bottom (Horiz)": [
                { sectionNo: "UMA-12", t: 1.20, weight: 1.756 }
            ],
            "Auxiliary": [
                { sectionNo: "UMA-19 (Rail Clip)", t: 1.20, weight: 0.501 },
                { sectionNo: "UMA-16 (Adapter)", t: 1.20, weight: 0.549 },
                { sectionNo: "UMA-15 (Mosquito Adp)", t: 1.20, weight: 0.658 },
                { sectionNo: "UMA-18 (Mosquito Sht)", t: 1.20, weight: 2.396 }
            ]
        },
        "25mm Gulf (Frame)": {
            "Track (Horiz)": [
                { sectionNo: "V-2545 (2T-1.2)", t: 1.20, weight: 3.731 },
                { sectionNo: "V-2536 (2T-1.4)", t: 1.40, weight: 3.694 },
                { sectionNo: "V-2541 (3T-1.2)", t: 1.20, weight: 5.377 },
                { sectionNo: "V-2537 (3T-1.4)", t: 1.40, weight: 5.347 },
                { sectionNo: "V-2547 (4T-1.2)", t: 1.20, weight: 6.744 }
            ],
            "Frame (Vert)": [
                { sectionNo: "V-2546 (2T)", t: 1.20, weight: 2.560 },
                { sectionNo: "V-2542 (3T)", t: 1.20, weight: 3.603 },
                { sectionNo: "V-2938 (2T-Premium)", t: 1.20, weight: 3.072 },
                { sectionNo: "V-2939 (3T-Premium)", t: 1.20, weight: 4.045 },
                { sectionNo: "V-2548 (4T)", t: 1.20, weight: 4.791 }
            ],
            "Auxiliary": [
                { sectionNo: "V-2543 (Lock Adp)", t: 1.20, weight: 0.530 },
                { sectionNo: "V-2544 (Top Guide)", t: 1.20, weight: 0.658 }
            ]
        },
        "25mm High-End (Frame)": {
            "Track (Horiz)": [
                { sectionNo: "V-2562 (2T)", t: 1.10, weight: 2.849 },
                { sectionNo: "V-2563 (3T)", t: 1.10, weight: 4.996 },
                { sectionNo: "V-2501 (2T-Basic)", t: 1.40, weight: 3.182 },
                { sectionNo: "V-2502 (3T-Basic)", t: 1.40, weight: 5.121 },
                { sectionNo: "V-2503 (2T-Prem)", t: 1.40, weight: 3.947 },
                { sectionNo: "V-2504 (3T-Prem)", t: 1.40, weight: 6.031 },
                { sectionNo: "V-2509 (2in1 Grill)", t: 1.40, weight: 5.249 }
            ],
            "Auxiliary": [
                { sectionNo: "V-2560 (Rain Cover)", t: 1.25, weight: 0.578 }
            ]
        },
        "25mm Series (Shutter)": {
            "Sash Component": [
                { sectionNo: "GENERIC-25-H (Handle)", t: 1.20, weight: 1.646 },
                { sectionNo: "GENERIC-25-I (Interlock)", t: 1.20, weight: 1.829 },
                { sectionNo: "GENERIC-25-TB (Top/Bottom)", t: 1.20, weight: 1.756 }
            ]
        },
        "Auxiliary (Global)": {
            "Hardware": [
                { sectionNo: "V-3535 (Rail Cap)", t: 1.50, weight: 0.596 },
                { sectionNo: "UMA-17 (Angle 63)", t: 4.70, weight: 6.174 }
            ]
        },
        "27mm Gulf": {
            "2 Track Top/Bottom": [
                { sectionNo: "V-2755", t: 1.2, weight: 1.020 },
                { sectionNo: "V-2736", t: 1.2, weight: 1.010 }
            ],
            "3 Track Top/Bottom": [
                { sectionNo: "V-2751", t: 1.2, weight: 1.470 },
                { sectionNo: "V-2737", t: 1.2, weight: 1.462 }
            ],
            "2 Track Vertical": [
                { sectionNo: "V-2756", t: 1.2, weight: 0.700 },
                { sectionNo: "V-2938", t: 1.2, weight: 0.840 }
            ],
            "3 Track Vertical": [
                { sectionNo: "V-2752", t: 1.2, weight: 0.985 },
                { sectionNo: "V-2939", t: 1.2, weight: 1.106 }
            ],
            "4 Track Top/Bottom": [{ sectionNo: "V-2757", t: 1.2, weight: 1.844 }],
            "4 Track Vertical": [{ sectionNo: "V-2758", t: 1.2, weight: 1.310 }],
            "27mm Shutter Handle": [{ sectionNo: "GENERIC-27-H", t: 1.2, weight: 0.470 }],
            "27mm Shutter Interlock": [{ sectionNo: "GENERIC-27-I", t: 1.2, weight: 0.520 }]
        },
        "29mm Gulf": {
            "2 Track Top/Bottom": [
                { sectionNo: "V-2940", t: 1.2, weight: 1.020 },
                { sectionNo: "V-2969", t: 1.4, weight: 1.010 }
            ],
            "3 Track Top/Bottom": [
                { sectionNo: "V-2942", t: 1.2, weight: 1.470 },
                { sectionNo: "V-2970", t: 1.4, weight: 1.462 }
            ],
            "2 Track Vertical": [
                { sectionNo: "V-2941", t: 1.2, weight: 0.700 },
                { sectionNo: "V-2938", t: 1.2, weight: 0.840 },
                { sectionNo: "V-2990", t: 1.2, weight: 0.676 }
            ],
            "3 Track Vertical": [
                { sectionNo: "V-2943", t: 1.2, weight: 0.985 },
                { sectionNo: "V-2939", t: 1.2, weight: 1.106 }
            ],
            "4 Track Top/Bottom": [{ sectionNo: "V-2944", t: 1.2, weight: 1.844 }],
            "4 Track Vertical": [{ sectionNo: "V-2945", t: 1.2, weight: 1.310 }]
        },
        "31mm Gulf": {
            "Two Track Top & Bottom": [
                { sectionNo: "V-3103", t: 1.45, weight: 1.640 },
                { sectionNo: "V-3108", t: 1.4, weight: 1.350 },
                { sectionNo: "V-3146", t: 1.4, weight: 1.361 }
            ],
            "Two Track Vertical": [
                { sectionNo: "V-3102", t: 1.2, weight: 1.040 },
                { sectionNo: "V-3127", t: 1.35, weight: 0.872 },
                { sectionNo: "V-3147", t: 1.4, weight: 0.853 }
            ],
            "Three Track Top & Bottom": [
                { sectionNo: "V-3104", t: 1.45, weight: 2.267 },
                { sectionNo: "V-3110", t: 1.2, weight: 2.000 },
                { sectionNo: "V-3148", t: 1.4, weight: 1.913 }
            ],
            "Three Track Vertical": [
                { sectionNo: "V-3105", t: 1.2, weight: 1.756 },
                { sectionNo: "V-3107", t: 1.2, weight: 1.220 },
                { sectionNo: "V-3149", t: 1.4, weight: 1.161 }
            ],
            "31mm Shutter Handle": [{ sectionNo: "GENERIC-31-H", t: 1.4, weight: 0.650 }],
            "31mm Shutter Interlock": [{ sectionNo: "GENERIC-31-I", t: 1.4, weight: 0.700 }]
        },
        "32mm Gulf": {
            "2 Track Top/Bottom": [{ sectionNo: "V-3241", t: 1.4, weight: 1.300 }],
            "2 Track Vertical": [{ sectionNo: "V-3242", t: 1.5, weight: 0.850 }],
            "3 Track Top/Bottom": [{ sectionNo: "V-3243", t: 1.4, weight: 1.750 }],
            "3 Track Vertical": [{ sectionNo: "V-3244", t: 1.5, weight: 1.250 }]
        },
        "35mm Gulf": {
            "Two Track Vertical": [{ sectionNo: "V-3501", t: 1.4, weight: 1.134 }],
            "Two Track Top & Bottom": [{ sectionNo: "V-3502", t: 1.4, weight: 1.544 }],
            "Three Track Vertical": [
                { sectionNo: "V-3503", t: 1.4, weight: 1.566 },
                { sectionNo: "V-3510", t: 1.4, weight: 1.566 },
                { sectionNo: "V-3520", t: 1.4, weight: 1.404 }
            ],
            "Three Track Top & Bottom": [
                { sectionNo: "V-3505", t: 1.4, weight: 2.073 },
                { sectionNo: "V-3591", t: 1.35, weight: 2.328 }
            ],
            "35mm Shutter Handle": [{ sectionNo: "GENERIC-35-H", t: 1.4, weight: 0.850 }],
            "35mm Shutter Interlock": [{ sectionNo: "GENERIC-35-I", t: 1.4, weight: 0.900 }]
        },
        "40mm Pro": {
            "Two Track Top Bottom": [{ sectionNo: "V-4151", t: 1.8, weight: 2.401 }],
            "Two Track Premium Type": [{ sectionNo: "V-4152", t: 1.8, weight: 0.902 }],
            "Three Track Top Bottom": [{ sectionNo: "V-4154", t: 1.8, weight: 2.099 }],
            "40mm Shutter Handle": [{ sectionNo: "GENERIC-40-H", t: 1.8, weight: 1.100 }],
            "40mm Shutter Interlock": [{ sectionNo: "GENERIC-40-I", t: 1.8, weight: 1.200 }]
        }
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeSupplierMaster() {
    if (Object.keys(supplierMaster).length === 0) {
        supplierMaster = JSON.parse(JSON.stringify(DEFAULT_SUPPLIER_DATA));
        autoSaveSupplierMaster();
    }
}

function initializeProjectSupplierSelector() {
    const selector = document.getElementById('projectSupplierSelector');
    if (!selector) return;

    const suppliers = Object.keys(supplierMaster);
    selector.innerHTML = '<option value="">-- Generic (Automatic) --</option>';
    suppliers.forEach(s => {
        selector.innerHTML += `<option value="${s}">${s}</option>`;
    });
}

function getSupplierSections(supplier, series, material) {
    if (supplierMaster[supplier] && supplierMaster[supplier][series]) {
        return supplierMaster[supplier][series][material] || [];
    }
    return [];
}

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
        const supDetails = document.createElement('details');
        supDetails.className = 'supplier-details';
        // supDetails.open = true; // Optional: keep first one open?

        const supSummary = document.createElement('summary');
        supSummary.className = 'supplier-summary';
        supSummary.innerHTML = `<span>🏭 ${supplier}</span>`;
        supDetails.appendChild(supSummary);

        const supContent = document.createElement('div');
        supContent.className = 'supplier-content';

        for (const [series, materials] of Object.entries(seriesObj)) {
            const seriesDetails = document.createElement('details');
            seriesDetails.className = 'series-details';

            const seriesSummary = document.createElement('summary');
            seriesSummary.className = 'series-summary';
            seriesSummary.textContent = `${series} Series`;
            seriesDetails.appendChild(seriesSummary);

            const seriesContent = document.createElement('div');
            seriesContent.className = 'series-content';

            for (const [material, sections] of Object.entries(materials)) {
                const matBlock = document.createElement('div');
                matBlock.className = 'material-block';
                matBlock.innerHTML = `<h6>${material}</h6>`;

                const table = document.createElement('table');
                table.className = 'stock-table';
                table.style.width = '100%';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Section No.</th>
                            <th>T (mm)</th>
                            <th>Wt (Kg/12ft)</th>
                            <th style="width: 80px; text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;

                const tbody = table.querySelector('tbody');
                sections.forEach((sec, idx) => {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td><input type="text" value="${sec.sectionNo}" onchange="editSupplierSection('${supplier}', '${series}', '${material}', ${idx}, 'sectionNo', this.value)" style="width:100%"></td>
                        <td><input type="number" step="0.01" value="${sec.t}" onchange="editSupplierSection('${supplier}', '${series}', '${material}', ${idx}, 't', this.value)" style="width:100%"></td>
                        <td><input type="number" step="0.001" value="${sec.weight}" onchange="editSupplierSection('${supplier}', '${series}', '${material}', ${idx}, 'weight', this.value)" style="width:100%"></td>
                        <td style="text-align:center">
                            <button class="btn-icon btn-danger" onclick="deleteSupplierSection('${supplier}', '${series}', '${material}', ${idx})" title="Delete Section">🗑️</button>
                        </td>
                    `;
                });

                matBlock.appendChild(table);
                seriesContent.appendChild(matBlock);
            }
            seriesDetails.appendChild(seriesContent);
            supContent.appendChild(seriesDetails);
        }
        supDetails.appendChild(supContent);
        list.appendChild(supDetails);
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

    // Get project filter
    const project = document.getElementById('projectSelector').value;
    const prefSupplier = (project && projectSettings[project]) ? projectSettings[project].preferredSupplier : null;

    // Get all matching sections
    const [series, materialName] = materialKey.split(' | ');
    availableSections = [];

    Object.entries(supplierMaster).forEach(([supplier, seriesObj]) => {
        // Apply preference filter
        if (prefSupplier && supplier !== prefSupplier) return;

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
    document.body.style.overflow = 'hidden';
}

function closeSectionSelectModal() {
    document.getElementById('sectionSelectModal').classList.remove('active');
    document.body.style.overflow = '';
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

    const project = document.getElementById('projectSelector').value;
    const prefSupplier = (project && projectSettings[project]) ? projectSettings[project].preferredSupplier : null;

    Object.entries(supplierMaster).forEach(([supplier, seriesObj]) => {
        // Apply preference filter
        if (prefSupplier && supplier !== prefSupplier) return;

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
