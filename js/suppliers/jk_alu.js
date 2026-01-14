/**
 * js/suppliers/jk_alu.js
 * Definitions for JK ALU EXTRUSION
 */

window.registerSupplier("JK ALU EXTRUSION", {
    // 1. SECTION WEIGHTS
    sections: {
        "3/4\"": {
            "3/4\" Handle": [
                { sectionNo: "1101", t: 0.70, weight: 1.000 },
                { sectionNo: "1102", t: 0.80, weight: 1.200 },
                { sectionNo: "1103", t: 0.95, weight: 1.400 },
                { sectionNo: "1104", t: 1.10, weight: 1.600 },
                { sectionNo: "1105", t: 1.25, weight: 1.800 },
                { sectionNo: "1106", t: 1.40, weight: 2.000 },
                { sectionNo: "1107", t: 1.54, weight: 2.200 },
                { sectionNo: "1108", t: 1.66, weight: 2.400 }
            ],
            "3/4\" Interlock": [
                { sectionNo: "1201", t: 0.75, weight: 1.300 },
                { sectionNo: "1202", t: 0.85, weight: 1.400 },
                { sectionNo: "1203", t: 0.94, weight: 1.600 },
                { sectionNo: "1204", t: 1.10, weight: 1.800 },
                { sectionNo: "1205", t: 1.25, weight: 2.000 },
                { sectionNo: "1206", t: 1.31, weight: 2.200 },
                { sectionNo: "1207", t: 1.44, weight: 2.400 },
                { sectionNo: "1208", t: 1.55, weight: 2.600 }
            ],
            "1\" Sash Top/Bottom": [ // Labeled "1" Top Bottom"
                { sectionNo: "1361", t: 0.85, weight: 1.600 }
            ],
            "1\" C-channel": [
                { sectionNo: "PENDING", weight: 0.500, desc: "Mosquito C-channel" }
            ],
            "3/4\" Bearing Bottom": [ // Mapped from "BEARING BOTTOM"
                { sectionNo: "1311", t: 0.85, weight: 1.500 },
                { sectionNo: "1312", t: 1.00, weight: 1.800 },
                { sectionNo: "1313", t: 1.20, weight: 2.200 },
                { sectionNo: "1314", t: 1.50, weight: 2.600 }
            ],
            "3/4\" Middle": [
                { sectionNo: "1401", t: 0.70, weight: 1.100 },
                { sectionNo: "1402", t: 0.85, weight: 1.400 }
            ],
            "3/4\" C-channel": [
                { sectionNo: "PENDING", weight: 0.500, desc: "Mosquito C-channel" }
            ],
            // TRACKS
            "3/4\" 2 Track Top": [
                { sectionNo: "2101", t: 0.80, weight: 1.600 },
                { sectionNo: "2102", t: 0.87, weight: 1.800 },
                { sectionNo: "2103", t: 0.95, weight: 2.000 },
                { sectionNo: "2104", t: 1.05, weight: 2.200 },
                { sectionNo: "2105", t: 1.20, weight: 2.500 },
                { sectionNo: "2106", t: 1.50, weight: 3.000 },
                { sectionNo: "2107", t: 1.60, weight: 3.200 }
            ],
            "3/4\" 2 Track Bottom": [
                { sectionNo: "2201", t: 0.70, weight: 1.800 },
                { sectionNo: "2202", t: 0.80, weight: 2.000 },
                { sectionNo: "2203", t: 0.94, weight: 2.200 },
                { sectionNo: "2204", t: 1.10, weight: 2.500 },
                { sectionNo: "2205", t: 1.50, weight: 3.400 }
            ],
            "3/4\" 3 Track Top": [
                { sectionNo: "2301", t: 0.70, weight: 2.000 },
                { sectionNo: "2302", t: 0.75, weight: 2.200 },
                { sectionNo: "2303", t: 0.85, weight: 2.400 },
                { sectionNo: "2304", t: 0.90, weight: 2.600 },
                { sectionNo: "2305", t: 0.97, weight: 2.800 },
                { sectionNo: "2306", t: 1.04, weight: 3.000 },
                { sectionNo: "2307", t: 1.20, weight: 3.200 },
                { sectionNo: "2308", t: 1.25, weight: 3.600 },
                { sectionNo: "2309", t: 1.40, weight: 3.900 },
                { sectionNo: "2310", t: 1.50, weight: 4.400 }
            ],
            "3/4\" 3 Track Bottom": [
                { sectionNo: "2401", t: 0.70, weight: 2.400 },
                { sectionNo: "2402", t: 0.76, weight: 2.600 },
                { sectionNo: "2403", t: 0.84, weight: 2.800 },
                { sectionNo: "2404", t: 1.00, weight: 3.000 },
                { sectionNo: "2405", t: 1.15, weight: 3.400 },
                { sectionNo: "2406", t: 1.20, weight: 4.000 },
                { sectionNo: "2407", t: 1.32, weight: 4.400 },
                { sectionNo: "2408", t: 1.50, weight: 4.900 }
            ],
            "3/4\" 4 Track Top": [
                { sectionNo: "2501", t: 1.10, weight: 3.500 },
                { sectionNo: "2502", t: 1.20, weight: 4.300 },
                { sectionNo: "2503", t: 1.45, weight: 5.000 }
            ],
            "1\" 4 Track Bottom": [
                { sectionNo: "2651", t: 1.02, weight: 5.200 }
            ]
        },
        "27mm Domal": {
            "DOMAL 2 TRACK": [
                { sectionNo: "4201", t: 1.35, weight: 3.200 },
                { sectionNo: "4202", t: 1.54, weight: 3.500 }
            ],
            "DOMAL 3 TRACK": [
                { sectionNo: "4301", t: 1.40, weight: 5.000 },
                { sectionNo: "4302", t: 1.50, weight: 5.500 }
            ],
            "DOMAL 3 TRACK WITH LEG": [
                { sectionNo: "4310", t: 1.30, weight: 5.500 }
            ],
            "DOMAL 4 TRACK": [
                { sectionNo: "4401", t: 1.41, weight: 7.000 }
            ],
            "DOMAL SHUTTER (27MM)": [
                { sectionNo: "4551", t: 1.21, weight: 2.900 },
                { sectionNo: "4552", t: 1.45, weight: 3.300 }
            ],
            "DOMAL CLIP (27MM)": [
                { sectionNo: "4651", t: 1.20, weight: 1.150 }
            ]
        },
        "Mini Domal": {
            "MINI DOMAL 2 TRACK": [
                { sectionNo: "4211", t: 1.25, weight: 2.800 }
            ],
            "MINI DOMAL 3 TRACK": [
                { sectionNo: "4311", t: 1.25, weight: 4.000 }
            ],
            "MINI DOMAL SHUTTER": [
                { sectionNo: "4511", t: 1.50, weight: 2.900 }
            ],
            "MINI DOMAL CLIP": [
                { sectionNo: "4611", t: 1.00, weight: 1.000 }
            ]
        }
    },

    // 2. SERIES FORMULAS
    formulas: {
        '3/4"': [
            { component: '3/4" Handle', qty: '2', length: 'H-1.5', desc: 'Handles' },
            { component: '3/4" Interlock', qty: '2*S-2', length: 'H-1.5', desc: 'Interlocks' },
            { component: '3/4" Bearing Bottom', qty: '2*S', length: '(W-5-1.5*(S-1))/S', desc: 'Bearing Bottom' },
            { component: '3/4" Sash Top/Bottom', qty: '2*S', length: '(W-5-1.5*(S-1))/S', desc: 'Sash Top' },

            { component: '3/4" 2 Track Top', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Top' },
            { component: '3/4" 2 Track Bottom', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Bottom' },
            { component: '3/4" 2 Track Top', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },

            { component: '3/4" 3 Track Top', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Top' },
            { component: '3/4" 3 Track Bottom', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Bottom' },
            { component: '3/4" 3 Track Top', qty: '2', length: 'T==3 ? H : 0', desc: '3T Track Sides' },

            { component: '3/4" 4 Track Top', qty: '1', length: 'T==4 ? W : 0', desc: '4T Track Top' },
            { component: '3/4" 4 Track Bottom', qty: '1', length: 'T==4 ? W : 0', desc: '4T Track Bottom' },
            { component: '3/4" 4 Track Top', qty: '2', length: 'T==4 ? H : 0', desc: '4T Track Sides' },

            // Mosquito
            { component: '3/4" Handle', qty: '1*MS', length: 'H-1.5', desc: 'MS Handle' },
            { component: '3/4" Interlock', qty: '1*MS', length: 'H-1.5', desc: 'MS Interlock' },
            { component: '3/4" Bearing Bottom', qty: '1*MS', length: '(W-5-1.5*(S-1))/S', desc: 'MS Bottom' },
            { component: '3/4" Sash Top/Bottom', qty: '1*MS', length: '(W-5-1.5*(S-1))/S', desc: 'MS Top' },
            { component: '3/4" C-channel', qty: '2*MS', length: 'H-1.5', desc: 'MS C-channel V' },
            { component: '3/4" C-channel', qty: '2*MS', length: '(W-5-1.5*(S-1))/S', desc: 'MS C-channel H' }
        ],
        '1"': [
            { component: '1" Handle', qty: '2', length: 'H-1.125', desc: 'Handles' },
            { component: '1" Interlock', qty: '2*S-2', length: 'H-1.125', desc: 'Interlocks' },
            { component: '1" Bearing Bottom', qty: '2*S', length: '(W-5-2*(S-1))/S', desc: 'Bearing Bottom' },
            { component: '1" Sash Top/Bottom', qty: '2*S', length: '(W-5-2*(S-1))/S', desc: 'Sash Top' },

            { component: '1" 2 Track Top', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Top' },
            { component: '1" 2 Track Bottom', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Bottom' },
            { component: '1" 2 Track Top', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },

            { component: '1" 3 Track Top', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Top' },
            { component: '1" 3 Track Bottom', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Bottom' },
            { component: '1" 3 Track Top', qty: '2', length: 'T==3 ? H : 0', desc: '3T Track Sides' },

            { component: '1" 4 Track Top', qty: '1', length: 'T==4 ? W : 0', desc: '4T Track Top' },
            { component: '1" 4 Track Bottom', qty: '1', length: 'T==4 ? W : 0', desc: '4T Track Bottom' },
            { component: '1" 4 Track Top', qty: '2', length: 'T==4 ? H : 0', desc: '4T Track Sides' },

            // Mosquito
            { component: '1" Handle', qty: '1*MS', length: 'H-1.125', desc: 'MS Handle' },
            { component: '1" Interlock', qty: '1*MS', length: 'H-1.125', desc: 'MS Interlock' },
            { component: '1" Bearing Bottom', qty: '1*MS', length: '(W-5-2*(S-1))/S', desc: 'MS Bottom' },
            { component: '1" Sash Top/Bottom', qty: '1*MS', length: '(W-5-2*(S-1))/S', desc: 'MS Top' },
            { component: '1" C-channel', qty: '2*MS', length: 'H-1.125', desc: 'MS C-channel V' },
            { component: '1" C-channel', qty: '2*MS', length: '(W-5-2*(S-1))/S', desc: 'MS C-channel H' }
        ],
        '27mm Domal': [
            // Glass Shutter
            { component: 'DOMAL SHUTTER (27MM)', qty: '2*S', length: 'H-2.75', desc: 'Shutter Verticals' },
            { component: 'DOMAL SHUTTER (27MM)', qty: '2*S', length: '(W-3+2.5*(S-1))/S', desc: 'Shutter Horizontals' },
            { component: 'DOMAL CLIP (27MM)', qty: '2*(S-1)', length: 'H-2.75', desc: 'Interlock Clips' },

            // Tracks (Dynamic based on T)
            { component: 'DOMAL 2 TRACK', qty: '1', length: 'T==2 ? W : 0', desc: '2 Track Top' },
            { component: 'DOMAL 2 TRACK', qty: '1', length: 'T==2 ? W : 0', desc: '2 Track Bottom' },
            { component: 'DOMAL 2 TRACK', qty: '2', length: 'T==2 ? H : 0', desc: '2 Track Sides' },

            { component: 'DOMAL 3 TRACK', qty: '1', length: 'T==3 ? W : 0', desc: '3 Track Top' },
            { component: 'DOMAL 3 TRACK', qty: '1', length: 'T==3 ? W : 0', desc: '3 Track Bottom' },
            { component: 'DOMAL 3 TRACK', qty: '2', length: 'T==3 ? H : 0', desc: '3 Track Sides' },

            { component: 'DOMAL 4 TRACK', qty: '1', length: 'T==4 ? W : 0', desc: '4 Track Top' },
            { component: 'DOMAL 4 TRACK', qty: '1', length: 'T==4 ? W : 0', desc: '4 Track Bottom' },
            { component: 'DOMAL 4 TRACK', qty: '2', length: 'T==4 ? H : 0', desc: '4 Track Sides' },

            // Mosquito (MS) - uses same shutter/clip profiles
            { component: 'DOMAL SHUTTER (27MM)', qty: '2*MS', length: 'H-2.75', desc: 'MS Shutter Vert' },
            { component: 'DOMAL SHUTTER (27MM)', qty: '2*MS', length: '(W-3+2.5*(S-1))/S', desc: 'MS Shutter Horiz' },
            { component: 'DOMAL CLIP (27MM)', qty: '1*MS', length: 'H-2.75', desc: 'MS Clip' }
        ],
        'Mini Domal': [
            // Mini Domal Shutter
            { component: 'MINI DOMAL SHUTTER', qty: '2*S', length: 'H-2.5', desc: 'Shutter Verticals' },
            { component: 'MINI DOMAL SHUTTER', qty: '2*S', length: '(W-3)/S', desc: 'Shutter Horizontals' },
            { component: 'MINI DOMAL CLIP', qty: '2*(S-1)', length: 'H-2.5', desc: 'Interlock Clips' },

            // Tracks
            { component: 'MINI DOMAL 2 TRACK', qty: '1', length: 'T==2 ? W : 0', desc: '2 Track Top' },
            { component: 'MINI DOMAL 2 TRACK', qty: '1', length: 'T==2 ? W : 0', desc: '2 Track Bottom' },
            { component: 'MINI DOMAL 2 TRACK', qty: '2', length: 'T==2 ? H : 0', desc: '2 Track Sides' },
            { component: 'MINI DOMAL 3 TRACK', qty: '1', length: 'T==3 ? W : 0', desc: '3 Track Top' },
            { component: 'MINI DOMAL 3 TRACK', qty: '1', length: 'T==3 ? W : 0', desc: '3 Track Bottom' },
            { component: 'MINI DOMAL 3 TRACK', qty: '2', length: 'T==3 ? H : 0', desc: '3 Track Sides' }
        ]
    },

    // 3. STOCK DEFAULTS
    stock: {
        '3/4"': [
            { material: '3/4" Handle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" Interlock', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" Sash Top/Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { component: '3/4" Bearing Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" Middle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" 2 Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" 2 Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" 3 Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" 3 Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" 4 Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '3/4" 4 Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
        ],
        '1"': [
            { material: '1" Handle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" Interlock', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" Sash Top/Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" Bearing Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" Middle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" 2 Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" 2 Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" 3 Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" 3 Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" 4 Track Top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
            { material: '1" 4 Track Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
        ],
        '27mm Domal': [
            { material: 'DOMAL 2 TRACK', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 },
            { material: 'DOMAL 3 TRACK', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 },
            { material: 'DOMAL 3 TRACK WITH LEG', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 },
            { material: 'DOMAL 4 TRACK', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 },
            { material: 'DOMAL SHUTTER (27MM)', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 },
            { material: 'DOMAL CLIP (27MM)', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 }
        ],
        'Mini Domal': [
            { material: 'MINI DOMAL 2 TRACK', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 },
            { material: 'MINI DOMAL 3 TRACK', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 },
            { material: 'MINI DOMAL SHUTTER', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 },
            { material: 'MINI DOMAL CLIP', stock1: 144, stock1Cost: 0, stock2: 192, stock2Cost: 0 }
        ]
    }
});
