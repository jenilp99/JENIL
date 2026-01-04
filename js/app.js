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
let projectSettings = {}; // Global per-project configuration
let kerf = 0.125;
let aluminumRate = 280;
let unitMode = 'inch';

// New: Rate & Price configuration
let ratesConfig = {
    glass: {
        'toughened_5mm': 85,
        'non_toughened_5mm': 65
    },
    powderCoating: {
        '3/4" Handle': 27.66,
        '3/4" Interlock': 34.62,
        '3/4" Bearing Bottom': 21.94,
        '3/4" Middle': 32.48,
        '3/4" 2 track bottom': 69.48,
        '3/4" 2 track top': 62.46,
        '3/4" 3 track bottom': 93.78,
        '3/4" 3 track top': 79.8,
        '3/4" 4 track bottom': 117.96,
        '3/4" 4 track top': 100.62,
        '1" Handle': 34.44,
        '1" Interlock': 41.67,
        '1" Bearing Bottom': 34.44,
        '1" Middle': 35.0,
        '1" 2 track top': 72.69,
        '1" 2 track bottom': 76.44,
        '1" 3 track top': 90.36,
        '1" 3 track bottom': 97.08,
        '1" 4 track top': 122.16,
        '1" 4 track bottom': 122.91,
        'Domal Shutter': 33.0,
        'Domal Clip': 25.8,
        'Domal 2 Track': 50.4,
        'Domal 3 Track': 69.0,
        'Domal 4 Track': 87.0,
        'Single Track Top': 33.0,
        'Single Track Bottom': 36.0,
        'Vitco 19mm': 35.0,
        'Vitco 25mm': 45.0
    },
    global: {
        'glassOffset': 1.5,
        'rubberRate': 5
    }
};

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
                { component: 'Domal 2 Track', qty: '1', length: 'T==2 ? W : 0', desc: 'Track Top' },
                { component: 'Domal 2 Track', qty: '1', length: 'T==2 ? W : 0', desc: 'Track Bottom' },
                { component: 'Domal 2 Track', qty: '2', length: 'T==2 ? H : 0', desc: 'Track Sides' },
                { component: 'Domal 3 Track', qty: '1', length: 'T==3 ? W : 0', desc: 'Track Top' },
                { component: 'Domal 3 Track', qty: '1', length: 'T==3 ? W : 0', desc: 'Track Bottom' },
                { component: 'Domal 3 Track', qty: '2', length: 'T==3 ? H : 0', desc: 'Track Sides' },
                { component: 'Domal 4 Track', qty: '1', length: 'T==4 ? W : 0', desc: 'Track Top' },
                { component: 'Domal 4 Track', qty: '1', length: 'T==4 ? W : 0', desc: 'Track Bottom' },
                { component: 'Domal 4 Track', qty: '2', length: 'T==4 ? H : 0', desc: 'Track Sides' },
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
                { component: '3/4" 2 track top', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Top' },
                { component: '3/4" 2 track bottom', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Bottom' },
                { component: '3/4" 2 track top', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },
                { component: '3/4" 3 track top', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Top' },
                { component: '3/4" 3 track bottom', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Bottom' },
                { component: '3/4" 3 track top', qty: '2', length: 'T==3 ? H : 0', desc: '3T Track Sides' },
                { component: '3/4" 4 track top', qty: '1', length: 'T==4 ? W : 0', desc: '4T Track Top' },
                { component: '3/4" 4 track bottom', qty: '1', length: 'T==4 ? W : 0', desc: '4T Track Bottom' },
                { component: '3/4" 4 track top', qty: '2', length: 'T==4 ? H : 0', desc: '4T Track Sides' },
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
                { component: '1" 2 track top', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Top' },
                { component: '1" 2 track bottom', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Bottom' },
                { component: '1" 2 track top', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },
                { component: '1" 3 track top', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Top' },
                { component: '1" 3 track bottom', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Bottom' },
                { component: '1" 3 track top', qty: '2', length: 'T==3 ? H : 0', desc: '3T Track Sides' },
                { component: '1" 4 track top', qty: '1', length: 'T==4 ? W : 0', desc: '4T Track Top' },
                { component: '1" 4 track bottom', qty: '1', length: 'T==4 ? W : 0', desc: '4T Track Bottom' },
                { component: '1" 4 track top', qty: '2', length: 'T==4 ? H : 0', desc: '4T Track Sides' },
                { component: '1" Handle', qty: '1*MS', length: 'H-1.125', desc: 'MS Handle' },
                { component: '1" Interlock', qty: '1*MS', length: 'H-1.125', desc: 'MS Interlock' },
                { component: '1" Bearing Bottom', qty: '2*MS', length: '(W-5-2*(S-1))/S', desc: 'MS Bearing Bottom' },
                { component: '1" C-channel', qty: '2*MS', length: 'H-1.125', desc: 'MS C-channel Vertical' },
                { component: '1" C-channel', qty: '2*MS', length: '(W-5-2*(S-1))/S', desc: 'MS C-channel Horizontal' }
            ],
            '19mm UMA': [
                { component: 'Handle Profile', qty: '(2*(S/S))+(1*MS)', length: 'H-1.5', desc: 'Shutter Handle' },
                { section: 'UMA-11', component: 'Handle Profile', qty: '2', length: 'H-1.5', desc: 'Handles' },
                { section: 'UMA-13', component: 'Slim Interlock Shutter', qty: '2*S-2', length: 'H-1.5', desc: 'Interlocks' },
                { section: 'UMA-12', component: 'Top Bottom Profile', qty: '2*S', length: '(W-5-1.5*(S-1))/S', desc: 'Sash Top/Bottom' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Top' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Bottom' },
                { component: 'Track (Horiz)', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Top' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Bottom' },
                { component: 'Track (Horiz)', qty: '2', length: 'T==3 ? H : 0', desc: '3T Track Sides' },
                { section: 'UMA-19', component: 'Auxiliary', qty: 'T', length: 'W', desc: 'U-Type Rail Clip (Bottom)' }
            ],
            'Vitco 25mm Gulf': [
                { component: 'Track (Horiz)', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Top' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Bottom' },
                { component: 'Frame (Vert)', qty: '2', length: 'T==2 ? H : 0', desc: '2T Vertical Frame' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Top' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Bottom' },
                { component: 'Frame (Vert)', qty: '2', length: 'T==3 ? H : 0', desc: '3T Vertical Frame' },
                { component: 'Sash Component', qty: '2', length: 'H-1.125', desc: 'Shutter Handles' },
                { component: 'Sash Component', qty: '2*S-2', length: 'H-1.125', desc: 'Interlocks' },
                { component: 'Sash Component', qty: '2*S', length: '(W-5-2*(S-1))/S', desc: 'Sash Top/Bottom' },
                { section: 'V-3535', component: 'Hardware', qty: 'T', length: 'W', desc: 'Rail Cap (Bottom)' },
                { section: 'V-2544', component: 'Auxiliary', qty: 'T', length: 'W', desc: 'Top Track Guide' }
            ],
            'Vitco 25mm High-End': [
                { component: 'Track (Horiz)', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Top' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==2 ? W : 0', desc: '2T Track Bottom' },
                { component: 'Frame (Vert)', qty: '2', length: 'T==2 ? H : 0', desc: '2T Vertical Frame' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Top' },
                { component: 'Track (Horiz)', qty: '1', length: 'T==3 ? W : 0', desc: '3T Track Bottom' },
                { component: 'Frame (Vert)', qty: '2', length: 'T==3 ? H : 0', desc: '3T Vertical Frame' },
                { component: 'Sash Component', qty: '2', length: 'H-1.125', desc: 'Shutter Handles' },
                { component: 'Sash Component', qty: '2*S-2', length: 'H-1.125', desc: 'Interlocks' },
                { component: 'Sash Component', qty: '2*S', length: '(W-5-2*(S-1))/S', desc: 'Sash Top/Bottom' },
                { section: 'V-3535', component: 'Hardware', qty: 'T', length: 'W', desc: 'Rail Cap (Bottom)' },
                { section: 'V-2560', component: 'Auxiliary', qty: '1', length: 'W', desc: 'Rain Cover (Bottom)' }
            ],
            '27mm Gulf': [
                { component: '2 Track Top/Bottom', qty: '2', length: 'T==2 ? W : 0', desc: '2T Track Top/Bottom' },
                { component: '3 Track Top/Bottom', qty: '2', length: 'T==3 ? W : 0', desc: '3T Track Top/Bottom' },
                { component: '2 Track Vertical', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },
                { component: '3 Track Vertical', qty: '2', length: 'T==3 ? H : 0', desc: '3T Track Sides' },
                { component: '27mm Shutter Handle', qty: '(2*(S/S))+(1*MS)', length: 'H-1.125', desc: 'Shutter Handle' },
                { component: '27mm Shutter Interlock', qty: '(2*S-2)+(1*MS)', length: 'H-1.125', desc: 'Interlock' }
            ],
            '31mm Gulf': [
                { component: 'Two Track Top & Bottom', qty: '2', length: 'T==2 ? W : 0', desc: '2T Track Top/Bottom' },
                { component: 'Three Track Top & Bottom', qty: '2', length: 'T==3 ? W : 0', desc: '3T Track Top/Bottom' },
                { component: 'Two Track Vertical', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },
                { component: 'Three Track Vertical', qty: '2', length: 'T==3 ? H : 0', desc: '3T Track Sides' },
                { component: '31mm Shutter Handle', qty: '(2*(S/S))+(1*MS)', length: 'H-1.125', desc: 'Shutter Handle' },
                { component: '31mm Shutter Interlock', qty: '(2*S-2)+(1*MS)', length: 'H-1.125', desc: 'Interlock' }
            ],
            '35mm Gulf': [
                { component: 'Two Track Top & Bottom', qty: '2', length: 'T==2 ? W : 0', desc: '2T Track Top/Bottom' },
                { component: 'Three Track Top & Bottom', qty: '2', length: 'T==3 ? W : 0', desc: '3T Track Top/Bottom' },
                { component: 'Two Track Vertical', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },
                { component: 'Three Track Vertical', qty: '2', length: 'T==3 ? H : 0', desc: '3T Track Sides' },
                { component: '35mm Shutter Handle', qty: '(2*(S/S))+(1*MS)', length: 'H-2.75', desc: 'Shutter Handle' },
                { component: '35mm Shutter Interlock', qty: '(2*S-2)+(1*MS)', length: 'H-2.75', desc: 'Interlock' }
            ],
            '40mm Pro': [
                { component: 'Two Track Top Bottom', qty: '2', length: 'T==2 ? W : 0', desc: '2T Track Top/Bottom' },
                { component: 'Three Track Top Bottom', qty: '2', length: 'T==3 ? W : 0', desc: '3T Track Top/Bottom' },
                { component: 'Two Track Premium Type', qty: '2', length: 'T==2 ? H : 0', desc: '2T Track Sides' },
                { component: '40mm Shutter Handle', qty: '(2*(S/S))+(1*MS)', length: 'H-2.75', desc: 'Shutter Handle' },
                { component: '40mm Shutter Interlock', qty: '(2*S-2)+(1*MS)', length: 'H-2.75', desc: 'Interlock' }
            ]
        };
    }

    if (Object.keys(stockMaster).length === 0) {
        stockMaster = {
            'Domal': [
                { material: 'Domal Shutter', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: 'Domal Clip', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: 'Domal 2 Track', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: 'Domal 3 Track', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: 'Domal 4 Track', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: 'Domal C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
            ],
            '3/4"': [
                { material: '3/4" Handle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" Interlock', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" Bearing Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" 2 track top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" 2 track bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" 3 track top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" 3 track bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" 4 track top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" 4 track bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '3/4" C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
            ],
            '1"': [
                { material: '1" Handle', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Interlock', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" Bearing Bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" 2 track top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" 2 track bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" 3 track top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" 3 track bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" 4 track top', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" 4 track bottom', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 },
                { material: '1" C-channel', stock1: 141, stock1Cost: 100, stock2: 177, stock2Cost: 125 }
            ],
            '19mm UMA': [
                { material: 'Handle Profile', stock1: 189, stock1Cost: 100 },
                { material: 'Top Bottom Profile', stock1: 189, stock1Cost: 100 },
                { material: 'Track (Horiz)', stock1: 189, stock1Cost: 100 },
                { material: 'Interlock (Vert)', stock1: 189, stock1Cost: 100 },
                { material: 'Auxiliary', stock1: 189, stock1Cost: 100 }
            ],
            'Vitco 25mm Gulf': [
                { material: 'Track (Horiz)', stock1: 189, stock1Cost: 100 },
                { material: 'Frame (Vert)', stock1: 189, stock1Cost: 100 },
                { material: 'Sash Component', stock1: 189, stock1Cost: 100 },
                { material: 'Hardware', stock1: 189, stock1Cost: 100 }
            ],
            'Vitco 25mm High-End': [
                { material: 'Track (Horiz)', stock1: 189, stock1Cost: 100 },
                { material: 'Frame (Vert)', stock1: 189, stock1Cost: 100 },
                { material: 'Sash Component', stock1: 189, stock1Cost: 100 }
            ],
            '27mm Gulf': [
                { material: '2 Track Top/Bottom', stock1: 189, stock1Cost: 100 },
                { material: '3 Track Top/Bottom', stock1: 189, stock1Cost: 100 },
                { material: '27mm Shutter Handle', stock1: 189, stock1Cost: 100 }
            ],
            '31mm Gulf': [
                { material: 'Two Track Top & Bottom', stock1: 189, stock1Cost: 100 },
                { material: 'Three Track Top & Bottom', stock1: 189, stock1Cost: 100 },
                { material: '31mm Shutter Handle', stock1: 189, stock1Cost: 100 }
            ],
            '35mm Gulf': [
                { material: 'Two Track Top & Bottom', stock1: 189, stock1Cost: 100 },
                { material: 'Three Track Top & Bottom', stock1: 189, stock1Cost: 100 },
                { material: '35mm Shutter Handle', stock1: 189, stock1Cost: 100 }
            ],
            '40mm Pro': [
                { material: 'Two Track Top Bottom', stock1: 189, stock1Cost: 100 },
                { material: 'Three Track Top Bottom', stock1: 189, stock1Cost: 100 },
                { material: '40mm Shutter Handle', stock1: 189, stock1Cost: 100 }
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

    // Initialize windows array if empty
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
            description: 'Living Room Main',
            glassType: 'toughened_5mm'
        }];
    }

    // Initialize Rates if not loaded
    if (!localStorage.getItem('ratesConfig')) {
        autoSaveRates();
    } else {
        ratesConfig = JSON.parse(localStorage.getItem('ratesConfig'));
    }

    refreshAllUI();
}

// ============================================================================
// RATE MANAGEMENT
// ============================================================================

function refreshRatesDisplay() {
    const pcContainer = document.getElementById('powderCoatingRatesList');
    if (!pcContainer) return;

    // Grouping powder coating rates by series
    const groups = {
        '3/4" Series': [],
        '1" Series': [],
        'Domal Series': [],
        'Others': []
    };

    // Get all unique components across all series to show rate inputs
    Object.entries(ratesConfig.powderCoating).forEach(([comp, rate]) => {
        if (comp.startsWith('3/4"')) groups['3/4" Series'].push({ comp, rate });
        else if (comp.startsWith('1"')) groups['1" Series'].push({ comp, rate });
        else if (comp.startsWith('Domal')) groups['Domal Series'].push({ comp, rate });
        else groups['Others'].push({ comp, rate });
    });

    let html = '';
    Object.entries(groups).forEach(([groupName, items]) => {
        if (items.length === 0) return;
        html += `
            <details class="rate-group" style="margin-bottom: 10px; border: 1px solid #ddd; border-radius: 8px; background: white;">
                <summary style="padding: 12px 15px; cursor: pointer; font-weight: bold; background: #f8f9fa; border-radius: 8px; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                    <span>✨ ${groupName}</span>
                    <span style="font-size: 0.8em; color: #666;">(${items.length} items)</span>
                </summary>
                <div class="rates-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; padding: 15px; border-top: 1px solid #eee;">
        `;
        items.forEach(item => {
            html += `
                <div class="form-group" style="background: #fdfdfd; padding: 10px; border: 1px solid #f0f0f0; border-radius: 6px;">
                    <label style="font-size: 0.85em; display: block; margin-bottom: 6px; color: #444; font-weight: 500;">${item.comp}</label>
                    <div style="position: relative;">
                        <span style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #888; font-size: 0.9em;">₹</span>
                        <input type="number" step="0.01" class="pc-rate-input" data-component="${item.comp}" value="${item.rate}" style="width: 100%; padding: 6px 6px 6px 20px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                </div>`;
        });
        html += `</div></details>`;
    });

    pcContainer.innerHTML = html;

    // Set other global and glass rates
    if (document.getElementById('rateGlassToughened')) {
        document.getElementById('rateGlassToughened').value = ratesConfig.glass['toughened_5mm'];
        document.getElementById('rateGlassNonToughened').value = ratesConfig.glass['non_toughened_5mm'];
        document.getElementById('glassOffset').value = ratesConfig.global['glassOffset'];
        document.getElementById('rateRubber').value = ratesConfig.global['rubberRate'];
    }
}

function saveAllRates() {
    // Collect powder coating rates
    const pcInputs = document.querySelectorAll('.pc-rate-input');
    pcInputs.forEach(input => {
        const comp = input.getAttribute('data-component');
        ratesConfig.powderCoating[comp] = parseFloat(input.value);
    });

    // Collect glass and global rates
    ratesConfig.glass['toughened_5mm'] = parseFloat(document.getElementById('rateGlassToughened').value);
    ratesConfig.glass['non_toughened_5mm'] = parseFloat(document.getElementById('rateGlassNonToughened').value);
    ratesConfig.global['glassOffset'] = parseFloat(document.getElementById('glassOffset').value);
    ratesConfig.global['rubberRate'] = parseFloat(document.getElementById('rateRubber').value);

    autoSaveRates();
    showAlert('✅ All rates saved successfully!');
}

function autoSaveRates() {
    localStorage.setItem('ratesConfig', JSON.stringify(ratesConfig));
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
    } else if (sectionName === 'supplier') {
        renderSupplierMaster();
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
    updateSupplierDatalist(); // New
    initializeAddWindowVendorSelector(); // New
    refreshRatesDisplay(); // New
    renderSupplierMaster(); // New
}

function refreshSeriesDropdown() {
    const select = document.getElementById('newStockSeries');
    if (select) {
        select.innerHTML = '';
        Object.keys(seriesFormulas).forEach(series => {
            select.innerHTML += `<option value="${series}">${series} Series</option>`;
        });
    }
}

function initializeAddWindowVendorSelector() {
    const selector = document.getElementById('windowVendor');
    const editSelector = document.getElementById('editWindowVendor');

    if (selector) {
        const suppliers = Object.keys(supplierMaster);
        selector.innerHTML = '<option value="">-- Select Vendor --</option>';
        suppliers.forEach(s => {
            selector.innerHTML += `<option value="${s}">${s}</option>`;
        });

        // If a project is selected and has a preferred supplier, pre-select it
        const activeProject = document.getElementById('projectName').value;
        if (activeProject && projectSettings[activeProject] && projectSettings[activeProject].preferredSupplier) {
            selector.value = projectSettings[activeProject].preferredSupplier;
            filterSeriesByVendor();
        }
    }

    if (editSelector) {
        const suppliers = Object.keys(supplierMaster);
        editSelector.innerHTML = '<option value="">-- Select Vendor --</option>';
        suppliers.forEach(s => {
            editSelector.innerHTML += `<option value="${s}">${s}</option>`;
        });
    }
}

function filterSeriesByVendor() {
    const vendor = document.getElementById('windowVendor').value;
    const seriesSelect = document.getElementById('series');

    if (!vendor) {
        seriesSelect.innerHTML = '<option value="">-- Select Vendor First --</option>';
        return;
    }

    const availableSeries = Object.keys(supplierMaster[vendor] || {});
    seriesSelect.innerHTML = '';

    if (availableSeries.length === 0) {
        seriesSelect.innerHTML = '<option value="">No Series Found</option>';
        return;
    }

    availableSeries.forEach(s => {
        seriesSelect.innerHTML += `<option value="${s}">${s}</option>`;
    });
}

function filterEditSeriesByVendor() {
    const vendor = document.getElementById('editWindowVendor').value;
    const seriesSelect = document.getElementById('editSeries');

    if (!vendor) {
        seriesSelect.innerHTML = '<option value="">-- Select Vendor First --</option>';
        return;
    }

    const availableSeries = Object.keys(supplierMaster[vendor] || {});
    seriesSelect.innerHTML = '';

    if (availableSeries.length === 0) {
        seriesSelect.innerHTML = '<option value="">No Series Found</option>';
        return;
    }

    availableSeries.forEach(s => {
        seriesSelect.innerHTML += `<option value="${s}">${s}</option>`;
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
        vendor: document.getElementById('windowVendor').value,
        width: convertToInches(widthRaw),
        height: convertToInches(heightRaw),
        tracks: tracks,
        shutters: shutters,
        mosquitoShutters: parseInt(document.getElementById('mosquitoShutters').value),
        series: document.getElementById('series').value,
        description: document.getElementById('description').value,
        glassType: document.getElementById('glassType').value
    };

    windows.push(window);
    autoSaveWindows();

    const lastNum = parseInt(window.configId.substring(1));
    document.getElementById('configId').value = 'W' + String(lastNum + 1).padStart(2, '0');

    showAlert('✅ Window ' + window.configId + ' added successfully!');
    refreshProjectSelector();
    displayWindows(); // Refresh the list
}

function clearForm() {
    document.getElementById('windowForm').reset();
    document.getElementById('configId').value = 'W01';
    document.getElementById('projectName').value = 'check';
    initializeAddWindowVendorSelector();
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
                    <div><strong>Vendor:</strong> ${w.vendor || 'Not Set'}</div>
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

    // Set Vendor and filter series
    const vendorSelector = document.getElementById('editWindowVendor');
    vendorSelector.value = win.vendor || '';
    filterEditSeriesByVendor();

    document.getElementById('editSeries').value = win.series;
    document.getElementById('editDescription').value = win.description;
    document.getElementById('editWindowModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditWindowModal() {
    document.getElementById('editWindowModal').classList.remove('active');
    document.body.style.overflow = '';
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
        vendor: document.getElementById('editWindowVendor').value,
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
    if (!container) return;
    let html = '';

    Object.entries(seriesFormulas).forEach(([series, formulas]) => {
        html += `
        <details class="formula-card" style="margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <summary style="padding: 15px; background: #f8f9fa; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 1.1em; border-bottom: 1px solid #eee;">
                <span>🧪 ${series} Series</span>
                <div onclick="event.preventDefault();">
                    <button class="btn btn-success btn-sm" onclick="showAddComponentModal('${series}')">➕ Add Component</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSeries('${series}')">🗑️ Delete Series</button>
                    <span style="font-size: 0.8em; color: #666; margin-left: 10px;">(${formulas.length} items)</span>
                </div>
            </summary>
            <div style="padding: 15px;">`;

        formulas.forEach((f, idx) => {
            html += `
                <div class="formula-item" style="border-bottom: 1px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 15px; last-child { border-bottom: none; }">
                    <div class="formula-content">
                        <strong>${f.desc}:</strong><br>
                        Component: <code>${f.component}</code><br>
                        Quantity: <code>${f.qty}</code> pieces<br>
                        Length: <code>${f.length}</code> inches
                    </div>
                    <div class="formula-actions" style="margin-top: 10px;">
                        <button class="btn btn-warning btn-sm" onclick="editFormula('${series}', ${idx})">✏️ Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteFormula('${series}', ${idx})">🗑️</button>
                    </div>
                </div>`;
        });

        if (formulas.length === 0) {
            html += `<p style="color: #666; font-style: italic;">No components added for this series yet.</p>`;
        }

        html += `
            </div>
        </details>`;
    });

    container.innerHTML = html || '<p class="alert alert-warning">No series formulas configured yet.</p>';
}

function showAddComponentModal(series) {
    document.getElementById('addComponentSeries').value = series;
    document.getElementById('modalComponentName').value = '';
    document.getElementById('modalComponentQty').value = '';
    document.getElementById('modalComponentLength').value = '';
    document.getElementById('modalComponentDesc').value = '';
    document.getElementById('addComponentModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAddComponentModal() {
    document.getElementById('addComponentModal').classList.remove('active');
    document.body.style.overflow = '';
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
    document.body.style.overflow = 'hidden';
}

function closeEditFormulaModal() {
    document.getElementById('editFormulaModal').classList.remove('active');
    document.body.style.overflow = '';
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
        const details = document.createElement('details');
        details.className = 'rate-group';
        details.style.marginBottom = '10px';
        details.style.border = '1px solid #ddd';
        details.style.borderRadius = '8px';
        details.style.background = 'white';

        details.innerHTML = `
            <summary style="padding: 12px 15px; cursor: pointer; font-weight: bold; background: #f8f9fa; border-radius: 8px; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                <span>📦 ${series} Series Materials</span>
                <span style="font-size: 0.8em; color: #666;">(${stocks.length} items)</span>
            </summary>
            <div style="padding: 15px; border-top: 1px solid #eee; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid #eee; text-align: left;">
                            <th style="padding: 8px;">Material</th>
                            <th style="padding: 8px;">Supplier / Section</th>
                            <th style="padding: 8px;">Stock 1 (in)</th>
                            <th style="padding: 8px;">Cost (₹)</th>
                            <th style="padding: 8px;">Stock 2 (in)</th>
                            <th style="padding: 8px;">Cost (₹)</th>
                            <th style="padding: 8px; text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;

        const tbody = details.querySelector('tbody');
        stocks.forEach((stock, idx) => {
            const row = tbody.insertRow();
            row.style.borderBottom = '1px solid #f0f0f0';
            row.innerHTML = `
                <td style="padding: 8px; font-weight: 500;">${stock.material}</td>
                <td style="padding: 8px; font-size: 0.8em; color: #666;">
                    ${stock.supplier || 'N/A'}<br>
                    ${stock.sectionNo || 'N/A'}
                </td>
                <td style="padding: 8px;"><input type="number" value="${stock.stock1}" onchange="updateStock('${series}', ${idx}, 'stock1', this.value)" style="width: 70px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td style="padding: 8px;"><input type="number" value="${stock.stock1Cost}" onchange="updateStock('${series}', ${idx}, 'stock1Cost', this.value)" style="width: 70px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td style="padding: 8px;"><input type="number" value="${stock.stock2}" onchange="updateStock('${series}', ${idx}, 'stock2', this.value)" style="width: 70px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td style="padding: 8px;"><input type="number" value="${stock.stock2Cost}" onchange="updateStock('${series}', ${idx}, 'stock2Cost', this.value)" style="width: 70px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td style="padding: 8px; text-align:center">
                    <button class="btn btn-danger btn-sm" onclick="deleteStock('${series}', ${idx})" style="padding: 4px 8px;">🗑️</button>
                </td>
            `;
        });

        container.appendChild(details);
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

function updateAluminumRate() {
    aluminumRate = parseFloat(document.getElementById('aluminumRate').value);
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
    document.body.style.overflow = 'hidden';
}

function closeAddHardwareModal() {
    document.getElementById('addHardwareModal').classList.remove('active');
    document.body.style.overflow = '';
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
        const supplierSelect = document.getElementById('projectSupplierSelector');

        if (this.value) {
            const count = windows.filter(w => w.projectName === this.value).length;
            const seriesTypes = [...new Set(windows.filter(w => w.projectName === this.value).map(w => w.series))];
            info.innerHTML = `<strong>${count}</strong> windows | Series: <strong>${seriesTypes.join(', ')}</strong>`;

            // Load saved supplier for this project
            if (projectSettings[this.value] && projectSettings[this.value].preferredSupplier) {
                supplierSelect.value = projectSettings[this.value].preferredSupplier;
            } else {
                supplierSelect.value = '';
            }
        } else {
            info.innerHTML = 'No project selected';
            supplierSelect.value = '';
        }
    };
}

// (initializeProjectSupplierSelector removed, moved to js/supplier_master.js)

function saveProjectSupplier() {
    const project = document.getElementById('projectSelector').value;
    const supplier = document.getElementById('projectSupplierSelector').value;

    if (!project) {
        showAlert('⚠️ Please select a project first!');
        document.getElementById('projectSupplierSelector').value = '';
        return;
    }

    if (!projectSettings[project]) {
        projectSettings[project] = {};
    }

    projectSettings[project].preferredSupplier = supplier;
    autoSaveProjectSettings();
    showAlert(`✅ Preferred supplier for ${project} set to: ${supplier || 'Automatic'}`);
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
    document.body.style.overflow = 'hidden';
}

function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
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
    document.body.style.overflow = 'hidden';
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
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
    initializeProjectSupplierSelector(); // New
    refreshAllUI();
};
// ============================================================================
// (Supplier Master UI and Modal Logic removed, moved to js/supplier_master.js)
