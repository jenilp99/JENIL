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
            "3/4\" 2 or 3 track top and bottom": [
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
            ],
            "1\" 2 or 3 track top and bottom": [
                { sectionNo: "2151", t: 0.80, weight: 2.000 },
                { sectionNo: "2152", t: 1.00, weight: 2.400 },
                { sectionNo: "2153", t: 1.20, weight: 2.800 }
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
            "3/4\" 2 or 3 track top and bottom": [
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
            ],
            "1\" 2 or 3 track top and bottom": [
                { sectionNo: "3101", t: 0.80, weight: 2.200 },
                { sectionNo: "3102", t: 1.00, weight: 2.600 }
            ]
        }
    },
    "Vitco": {
        "19mm UMA": {
            "Two Track Premium Type": [{ sectionNo: "UMA-01", t: 1.2, weight: 0.825 }],
            "Three Track Premium Type": [{ sectionNo: "UMA-02", t: 1.2, weight: 1.220 }],
            "Handle Profile": [
                { sectionNo: "UMA-11", t: 1.2, weight: 0.425 },
                { sectionNo: "UMA-21", t: 1.2, weight: 0.575 },
                { sectionNo: "UMA-28", t: 1.5, weight: 0.732 }
            ],
            "Top Bottom Profile": [{ sectionNo: "UMA-12", t: 1.2, weight: 0.480 }],
            "Slim Interlock Shutter": [{ sectionNo: "UMA-13", t: 1.2, weight: 0.370 }],
            "Reinforcement Interlock": [{ sectionNo: "UMA-14", t: 1.2, weight: 0.618 }],
            "Mosquito Adapter": [{ sectionNo: "UMA-15", t: 1.2, weight: 0.180 }],
            "Adapter Roller": [{ sectionNo: "UMA-16", t: 1.2, weight: 0.150 }],
            "Corner Joint Angle": [{ sectionNo: "UMA-17", t: 1.2, weight: 1.688 }],
            "Mosquito Shutter": [{ sectionNo: "UMA-18", t: 1.2, weight: 0.655 }],
            "U Type Track Rail Clip": [{ sectionNo: "UMA-19", t: 1.2, weight: 0.137 }],
            "Universal Interlock": [{ sectionNo: "UMA-22", t: 1.2, weight: 0.505 }]
        },
        "25mm Gulf": {
            "2 Track Top/Bottom": [
                { sectionNo: "V-2545", t: 1.2, weight: 1.020 },
                { sectionNo: "V-2536", t: 1.4, weight: 1.010 }
            ],
            "3 Track Top/Bottom": [
                { sectionNo: "V-2541", t: 1.2, weight: 1.470 },
                { sectionNo: "V-2537", t: 1.4, weight: 1.462 }
            ],
            "2 Track Vertical": [
                { sectionNo: "V-2546", t: 1.2, weight: 0.700 },
                { sectionNo: "V-2938", t: 1.2, weight: 0.840 }
            ],
            "3 Track Vertical": [
                { sectionNo: "V-2542", t: 1.2, weight: 0.985 },
                { sectionNo: "V-2939", t: 1.2, weight: 1.106 }
            ],
            "4 Track Top/Bottom": [{ sectionNo: "V-2547", t: 1.2, weight: 1.844 }],
            "4 Track Vertical": [{ sectionNo: "V-2548", t: 1.2, weight: 1.310 }],
            "25mm Shutter Handle": [{ sectionNo: "GENERIC-25-H", t: 1.2, weight: 0.450 }],
            "25mm Shutter Interlock": [{ sectionNo: "GENERIC-25-I", t: 1.2, weight: 0.500 }],
            "25mm Shutter Horizontal": [{ sectionNo: "GENERIC-25-TB", t: 1.2, weight: 0.480 }]
        },
        "25mm Basic": {
            "Two Track Basic Type": [{ sectionNo: "V-2501", t: 1.4, weight: 0.870 }],
            "Three Track Basic Type": [{ sectionNo: "V-2502", t: 1.4, weight: 1.400 }],
            "Two Track Premium Type": [{ sectionNo: "V-2503", t: 1.4, weight: 1.079 }],
            "Three Track Premium Type": [{ sectionNo: "V-2504", t: 1.4, weight: 1.649 }],
            "2 in 1 Frame With Grill": [{ sectionNo: "V-2509", t: 1.4, weight: 1.435 }]
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
