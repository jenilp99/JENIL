/**
 * js/suppliers/jk_alu.js
 * Definitions for JK ALU EXTRUSION
 */

window.registerSupplier("JK ALU EXTRUSION", {
    // 1. SECTION WEIGHTS
    sections: {
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
    }
});
