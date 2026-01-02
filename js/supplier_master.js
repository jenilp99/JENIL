/**
 * supplier_master.js
 * Manages supplier-specific sectional data (Section No, T, Weight)
 */

let supplierMaster = {};

const DEFAULT_SUPPLIER_DATA = {
    "Windalco Aluminium": {
        "3/4\"": {
            "3/4\" Handle": [
                { sectionNo: "20011", t: 0.60, weight: 0.850 }, // Avg of 0.800-0.900
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
                { sectionNo: "20030", t: 0.84, weight: 1.700 },
                { sectionNo: "20031", t: 0.94, weight: 1.900 },
                { sectionNo: "20032", t: 1.04, weight: 2.100 },
                { sectionNo: "20033", t: 1.14, weight: 2.350 },
                { sectionNo: "20034", t: 1.20, weight: 2.600 },
                { sectionNo: "20035", t: 1.50, weight: 2.800 }
            ],
            "3/4\" 2 Tr Bottom": [
                { sectionNo: "20036", t: 0.85, weight: 1.800 },
                { sectionNo: "20037", t: 1.00, weight: 2.100 },
                { sectionNo: "20038", t: 1.15, weight: 2.400 },
                { sectionNo: "20039", t: 1.50, weight: 3.250 }
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
                { sectionNo: "20057", t: 0.92, weight: 2.400 }
            ],
            "1\" Bearing Bottom": [
                { sectionNo: "20058", t: 0.70, weight: 2.550 },
                { sectionNo: "20059", t: 1.00, weight: 3.050 }
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
            "3/4\" 2 Track Top": [
                { sectionNo: "2101", t: 0.80, weight: 1.500 },
                { sectionNo: "2102", t: 0.87, weight: 1.700 },
                { sectionNo: "2103", t: 0.95, weight: 1.900 },
                { sectionNo: "2104", t: 1.05, weight: 2.100 },
                { sectionNo: "2105", t: 1.20, weight: 2.350 },
                { sectionNo: "2106", t: 1.50, weight: 2.900 },
                { sectionNo: "2107", t: 1.60, weight: 3.100 }
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
            ]
        }
    }
};

function initializeSupplierMaster() {
    if (Object.keys(supplierMaster).length === 0) {
        supplierMaster = JSON.parse(JSON.stringify(DEFAULT_SUPPLIER_DATA));
        autoSaveSupplierMaster();
    }
}

function getSupplierSections(supplier, series, material) {
    if (supplierMaster[supplier] && supplierMaster[supplier][series]) {
        return supplierMaster[supplier][series][material] || [];
    }
    return [];
}
