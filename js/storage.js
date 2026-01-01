// storage.js - Local Storage Manager for Niruma Optimizer
// Add this as a new file: js/storage.js

const StorageManager = {
    // Storage keys
    KEYS: {
        WINDOWS: 'niruma_windows',
        FORMULAS: 'niruma_formulas',
        STOCK: 'niruma_stock',
        KERF: 'niruma_kerf',
        UNIT: 'niruma_unit',
        RESULTS: 'niruma_results'
    },

    // Save data to localStorage
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },

    // Load data from localStorage
    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    },

    // Delete specific key
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    // Clear all app data
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    // Auto-save windows
    saveWindows(windows) {
        return this.save(this.KEYS.WINDOWS, windows);
    },

    // Load windows
    loadWindows() {
        return this.load(this.KEYS.WINDOWS, []);
    },

    // Auto-save formulas
    saveFormulas(formulas) {
        return this.save(this.KEYS.FORMULAS, formulas);
    },

    // Load formulas
    loadFormulas() {
        return this.load(this.KEYS.FORMULAS, null);
    },

    // Auto-save stock
    saveStock(stock) {
        return this.save(this.KEYS.STOCK, stock);
    },

    // Load stock
    loadStock() {
        return this.load(this.KEYS.STOCK, null);
    },

    // Save settings
    saveSettings(kerf, unit) {
        this.save(this.KEYS.KERF, kerf);
        this.save(this.KEYS.UNIT, unit);
    },

    // Load settings
    loadSettings() {
        return {
            kerf: this.load(this.KEYS.KERF, 0.125),
            unit: this.load(this.KEYS.UNIT, 'inch')
        };
    },

    // Save optimization results
    saveResults(results) {
        return this.save(this.KEYS.RESULTS, results);
    },

    // Load optimization results
    loadResults() {
        return this.load(this.KEYS.RESULTS, null);
    },

    // Export all data as JSON
    exportAll() {
        return {
            windows: this.loadWindows(),
            formulas: this.loadFormulas(),
            stock: this.loadStock(),
            settings: this.loadSettings(),
            results: this.loadResults(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    },

    // Import data from JSON
    importAll(data) {
        try {
            if (data.windows) this.saveWindows(data.windows);
            if (data.formulas) this.saveFormulas(data.formulas);
            if (data.stock) this.saveStock(data.stock);
            if (data.settings) {
                this.saveSettings(data.settings.kerf, data.settings.unit);
            }
            if (data.results) this.saveResults(data.results);
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
};

// Auto-save wrapper functions
function autoSaveWindows() {
    StorageManager.saveWindows(windows);
    console.log('✅ Windows auto-saved');
}

function autoSaveFormulas() {
    StorageManager.saveFormulas(seriesFormulas);
    console.log('✅ Formulas auto-saved');
}

function autoSaveStock() {
    StorageManager.saveStock(stockMaster);
    console.log('✅ Stock auto-saved');
}

function autoSaveSettings() {
    StorageManager.saveSettings(kerf, unitMode);
    console.log('✅ Settings auto-saved');
}

function autoSaveResults() {
    if (optimizationResults) {
        StorageManager.saveResults(optimizationResults);
        console.log('✅ Results auto-saved');
    }
}

// Load all data on startup
function loadAllData() {
    const loadedWindows = StorageManager.loadWindows();
    const loadedFormulas = StorageManager.loadFormulas();
    const loadedStock = StorageManager.loadStock();
    const settings = StorageManager.loadSettings();
    const loadedResults = StorageManager.loadResults();

    // Only load if data exists, otherwise keep defaults
    if (loadedWindows.length > 0) {
        windows = loadedWindows;
        console.log(`✅ Loaded ${windows.length} windows from storage`);
    }

    if (loadedFormulas) {
        seriesFormulas = loadedFormulas;
        console.log('✅ Loaded formulas from storage');
    }

    if (loadedStock) {
        stockMaster = loadedStock;
        console.log('✅ Loaded stock from storage');
    }

    kerf = settings.kerf;
    unitMode = settings.unit;
    
    // Update kerf if element exists
    const kerfElement = document.getElementById('kerfGlobal');
    if (kerfElement) {
        kerfElement.value = kerf;
    }
    
    // Update all unit toggle checkboxes
    const isMetric = (unitMode === 'mm');
    const unitToggles = document.querySelectorAll('input[id*="unitToggle"]');
    unitToggles.forEach(toggle => {
        if (toggle) {
            toggle.checked = isMetric;
        }
    });
    
    console.log('✅ Loaded settings from storage');

    if (loadedResults) {
        optimizationResults = loadedResults;
        console.log('✅ Loaded previous results');
    }
}
