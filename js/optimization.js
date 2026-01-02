// Niruma Aluminum Profile Optimizer - Optimization Algorithms

// ============================================================================
// MAIN OPTIMIZATION ENTRY POINT
// ============================================================================

function runOptimization() {
    const selectedProject = document.getElementById('projectSelector').value;

    if (!selectedProject) {
        showAlert('❌ Please select a project first!');
        return;
    }

    const piecesByMaterial = calculatePieces(selectedProject);

    if (Object.keys(piecesByMaterial).length === 0) {
        showAlert('❌ No pieces calculated for this project!');
        return;
    }

    const results = {};
    let totalSticks = 0;
    let totalUsed = 0;
    let totalWaste = 0;
    let totalCost = 0;

    for (const [compoundKey, pieces] of Object.entries(piecesByMaterial)) {
        const [materialSeries, materialName] = compoundKey.split('|');

        let stockList = stockMaster[materialSeries];

        // Fallback for series name migration
        if (!stockList) {
            if (materialSeries === '1') stockList = stockMaster['1"'];
            else if (materialSeries === '1"') stockList = stockMaster['1'];
        }

        if (!stockList) {
            console.warn('No stock list for series:', materialSeries);
            continue;
        }

        const stockInfo = stockList.find(s => s.material === materialName);

        if (!stockInfo) {
            console.warn(`No stock info for material "${materialName}" in series "${materialSeries}"`);
            continue;
        }

        const plans = optimizeMaterialSmart(pieces, stockInfo, kerf);
        const displayKey = `${materialSeries} | ${materialName}`;
        results[displayKey] = plans;

        plans.forEach(plan => {
            totalSticks++;
            totalUsed += plan.used;
            totalWaste += plan.waste;
            totalCost += plan.cost;
        });
    }

    optimizationResults = {
        project: selectedProject,
        results: results,
        stats: {
            totalSticks: totalSticks,
            totalUsed: totalUsed.toFixed(2),
            totalWaste: totalWaste.toFixed(2),
            totalCost: totalCost.toFixed(0),
            efficiency: ((totalUsed / (totalUsed + totalWaste)) * 100).toFixed(1)
        },
        config: { kerf }
    };

    autoSaveResults();
    displayResults();
    scrollToSection('section-results');
}

// ============================================================================
// PIECE CALCULATION FROM FORMULAS
// ============================================================================

function calculatePieces(selectedProject) {
    const pieces = {};
    const projectWindows = windows.filter(w => w.projectName === selectedProject);

    projectWindows.forEach(win => {
        const W = win.width;
        const H = win.height;
        const S = win.shutters;
        const MS = win.mosquitoShutters;
        const T = win.tracks;
        const id = win.configId;

        let seriesName = win.series;
        let formulas = seriesFormulas[seriesName];

        // Fallback for series name migration (1 vs 1")
        if (!formulas) {
            if (seriesName === '1') formulas = seriesFormulas['1"'];
            else if (seriesName === '1"') formulas = seriesFormulas['1'];
        }

        if (!formulas) return;

        formulas.forEach(formula => {
            try {
                // Safety check for formula existence and contents
                if (!formula.qty || !formula.length) return;

                let qtyVal = eval(formula.qty);
                let lenVal = eval(formula.length);

                const qty = parseInt(qtyVal, 10);
                const length = parseFloat(lenVal);

                if (qty > 0 && length > 0) {
                    addPieces(pieces, seriesName, formula.component, length, id + ' - ' + formula.desc, qty);
                }
            } catch (e) {
                console.error('Formula error in series:', seriesName, 'Component:', formula.component, e);
            }
        });
    });

    return pieces;
}

function addPieces(pieces, series, material, length, label, qty) {
    const key = `${series}|${material}`;
    if (!pieces[key]) {
        pieces[key] = [];
    }

    for (let i = 0; i < qty; i++) {
        pieces[key].push({ length: length, label: label });
    }
}

// ============================================================================
// SMART OPTIMIZATION ALGORITHM
// ============================================================================

function optimizeMaterialSmart(pieces, stockInfo, kerf) {
    pieces.sort((a, b) => b.length - a.length);

    const strategies = [];

    // Strategy 1: Only Stock 1
    strategies.push(solveSpecificStock(pieces, stockInfo.stock1, stockInfo.stock1Cost, kerf));

    // Strategy 2: Only Stock 2 (if different)
    if (stockInfo.stock2 && stockInfo.stock2 !== stockInfo.stock1) {
        strategies.push(solveSpecificStock(pieces, stockInfo.stock2, stockInfo.stock2Cost, kerf));
    }

    // Strategy 3: Smart Cost Focused
    strategies.push(optimizeCostFocused(pieces, stockInfo, kerf));

    // Strategy 4: Greedy Efficiency
    strategies.push(optimizeGreedy(pieces, stockInfo, kerf));

    // Find best strategy (lowest cost)
    let bestPlan = null;
    let minCost = Infinity;

    strategies.forEach(plan => {
        const currentCost = plan.reduce((sum, stick) => sum + stick.cost, 0);

        if (currentCost < minCost) {
            minCost = currentCost;
            bestPlan = plan;
        } else if (Math.abs(currentCost - minCost) < 0.01) {
            if (plan.length < bestPlan.length) {
                bestPlan = plan;
            }
        }
    });

    return bestPlan;
}

// ============================================================================
// STRATEGY: SPECIFIC STOCK SIZE ONLY
// ============================================================================

function solveSpecificStock(pieces, stockLength, stockCost, kerf) {
    const plan = [];
    const remaining = [...pieces];

    while (remaining.length > 0) {
        const pattern = findBestPattern(remaining, stockLength, kerf);

        if (pattern.pieces.length === 0) {
            break;
        }

        pattern.pieces.forEach(p => {
            const idx = remaining.indexOf(p);
            if (idx !== -1) remaining.splice(idx, 1);
        });

        plan.push({
            stock: stockLength + '"',
            pieces: pattern.pieces,
            used: pattern.used,
            waste: pattern.waste,
            cost: stockCost,
            efficiency: ((pattern.used / stockLength) * 100).toFixed(1)
        });
    }

    return plan;
}

// ============================================================================
// STRATEGY: GREEDY EFFICIENCY
// ============================================================================

function optimizeGreedy(pieces, stockInfo, kerf) {
    const plans = [];
    const remaining = [...pieces];

    while (remaining.length > 0) {
        const strategies = [];

        const fillStock1 = findBestPattern(remaining, stockInfo.stock1, kerf);
        if (fillStock1.pieces.length > 0) {
            strategies.push({
                pattern: fillStock1,
                stock: stockInfo.stock1,
                cost: stockInfo.stock1Cost,
                efficiency: fillStock1.used / stockInfo.stock1,
                costPerInch: stockInfo.stock1Cost / fillStock1.used
            });
        }

        const fillStock2 = findBestPattern(remaining, stockInfo.stock2, kerf);
        if (fillStock2.pieces.length > 0) {
            strategies.push({
                pattern: fillStock2,
                stock: stockInfo.stock2,
                cost: stockInfo.stock2Cost,
                efficiency: fillStock2.used / stockInfo.stock2,
                costPerInch: stockInfo.stock2Cost / fillStock2.used
            });
        }

        if (strategies.length === 0) break;

        strategies.sort((a, b) => {
            if (a.efficiency >= 0.7 && b.efficiency < 0.7) return -1;
            if (b.efficiency >= 0.7 && a.efficiency < 0.7) return 1;
            if (Math.abs(a.costPerInch - b.costPerInch) > 0.01) {
                return a.costPerInch - b.costPerInch;
            }
            return a.pattern.waste - b.pattern.waste;
        });

        const bestStrategy = strategies[0];

        bestStrategy.pattern.pieces.forEach(p => {
            const idx = remaining.findIndex(r => r.length === p.length && r.label === p.label);
            if (idx !== -1) remaining.splice(idx, 1);
        });

        plans.push({
            stock: bestStrategy.stock + '"',
            pieces: bestStrategy.pattern.pieces,
            used: bestStrategy.pattern.used,
            waste: bestStrategy.pattern.waste,
            cost: bestStrategy.cost,
            efficiency: (bestStrategy.efficiency * 100).toFixed(1)
        });
    }

    return plans;
}

// ============================================================================
// STRATEGY: COST FOCUSED
// ============================================================================

function optimizeCostFocused(pieces, stockInfo, kerf) {
    const plans = [];
    const remaining = [...pieces];

    while (remaining.length > 0) {
        const scenarios = [];

        // Single stock 1
        const s1Result = findBestPattern(remaining, stockInfo.stock1, kerf);
        if (s1Result.pieces.length > 0) {
            const s1Remaining = remaining.filter(r => !s1Result.pieces.includes(r));
            scenarios.push({
                firstCut: {
                    pattern: s1Result,
                    stock: stockInfo.stock1,
                    cost: stockInfo.stock1Cost
                },
                remaining: s1Remaining,
                twoStocks: false
            });
        }

        // Single stock 2
        const s2Result = findBestPattern(remaining, stockInfo.stock2, kerf);
        if (s2Result.pieces.length > 0) {
            const s2Remaining = remaining.filter(r => !s2Result.pieces.includes(r));
            scenarios.push({
                firstCut: {
                    pattern: s2Result,
                    stock: stockInfo.stock2,
                    cost: stockInfo.stock2Cost
                },
                remaining: s2Remaining,
                twoStocks: false
            });
        }

        // Two stock 1s (if smaller than stock 2)
        if (stockInfo.stock1 < stockInfo.stock2) {
            const firstStock1 = findBestPattern(remaining, stockInfo.stock1, kerf);
            if (firstStock1.pieces.length > 0) {
                const temp1Remaining = remaining.filter(r => !firstStock1.pieces.includes(r));
                const secondStock1 = findBestPattern(temp1Remaining, stockInfo.stock1, kerf);

                if (secondStock1.pieces.length > 0) {
                    const totalCost = stockInfo.stock1Cost * 2;
                    const totalUsed = firstStock1.used + secondStock1.used;
                    const finalRemaining = temp1Remaining.filter(r => !secondStock1.pieces.includes(r));
                    const avgEfficiency = totalUsed / (stockInfo.stock1 * 2);

                    if (avgEfficiency > 0.5) {
                        scenarios.push({
                            twoStocks: true,
                            cuts: [
                                {
                                    pattern: firstStock1,
                                    stock: stockInfo.stock1,
                                    cost: stockInfo.stock1Cost
                                },
                                {
                                    pattern: secondStock1,
                                    stock: stockInfo.stock1,
                                    cost: stockInfo.stock1Cost
                                }
                            ],
                            totalCost: totalCost,
                            avgEfficiency: avgEfficiency,
                            remaining: finalRemaining
                        });
                    }
                }
            }
        }

        if (scenarios.length === 0) break;

        // Find best scenario
        let bestScenario = null;
        let bestScore = Infinity;

        scenarios.forEach(scenario => {
            let cost, efficiency;

            if (scenario.twoStocks) {
                cost = scenario.totalCost;
                efficiency = scenario.avgEfficiency;
            } else {
                cost = scenario.firstCut.cost;
                efficiency = scenario.firstCut.pattern.used / scenario.firstCut.stock;
            }

            let score = cost;
            if (efficiency < 0.5) score *= 1.5;
            if (efficiency < 0.3) score *= 2.0;

            if (score < bestScore) {
                bestScore = score;
                bestScenario = scenario;
            }
        });

        // Apply best scenario
        if (bestScenario.twoStocks) {
            bestScenario.cuts.forEach(cut => {
                plans.push({
                    stock: cut.stock + '"',
                    pieces: cut.pattern.pieces,
                    used: cut.pattern.used,
                    waste: cut.pattern.waste,
                    cost: cut.cost,
                    efficiency: ((cut.pattern.used / cut.stock) * 100).toFixed(1)
                });
            });
            remaining.length = 0;
            remaining.push(...bestScenario.remaining);
        } else {
            const cut = bestScenario.firstCut;
            plans.push({
                stock: cut.stock + '"',
                pieces: cut.pattern.pieces,
                used: cut.pattern.used,
                waste: cut.pattern.waste,
                cost: cut.cost,
                efficiency: ((cut.pattern.used / cut.stock) * 100).toFixed(1)
            });
            remaining.length = 0;
            remaining.push(...bestScenario.remaining);
        }
    }

    return plans;
}

// ============================================================================
// PATTERN FINDING (FIRST FIT DECREASING)
// ============================================================================

function findBestPattern(pieces, stockLen, kerf) {
    let bestPattern = { pieces: [], used: 0, waste: stockLen };
    let used = 0;
    let pattern = [];

    for (const piece of pieces) {
        const needed = piece.length + (pattern.length > 0 ? kerf : 0);

        if (used + needed <= stockLen) {
            pattern.push(piece);
            used += needed;
        }
    }

    if (used > bestPattern.used) {
        bestPattern = {
            pieces: pattern,
            used: used,
            waste: stockLen - used
        };
    }

    return bestPattern;
}

// ============================================================================
// CUTTING DIAGRAM GENERATOR
// ============================================================================

function generateCuttingDiagram(plan, maxLength) {
    const svgWidth = 800;
    const svgHeight = 60;
    const scale = svgWidth / maxLength;

    let svg = `<svg width="${svgWidth}" height="${svgHeight}" style="border: 1px solid #ddd; background: white;">`;
    svg += `<rect x="0" y="10" width="${maxLength * scale}" height="40" fill="#ecf0f1" stroke="#95a5a6" stroke-width="2"/>`;

    let currentX = 0;
    const colors = ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'];

    plan.pieces.forEach((piece, idx) => {
        const pieceWidth = piece.length * scale;
        const color = colors[idx % colors.length];

        svg += `<rect x="${currentX}" y="10" width="${pieceWidth}" height="40" fill="${color}" opacity="0.7" stroke="white" stroke-width="1"/>`;

        const label = `${piece.length.toFixed(1)}"`;
        const windowId = piece.label.split(' - ')[0];

        svg += `<text x="${currentX + pieceWidth / 2}" y="25" font-size="10" fill="white" text-anchor="middle" font-weight="bold">${windowId}</text>`;
        svg += `<text x="${currentX + pieceWidth / 2}" y="40" font-size="9" fill="white" text-anchor="middle">${label}</text>`;

        currentX += pieceWidth;

        if (idx < plan.pieces.length - 1) {
            svg += `<rect x="${currentX}" y="10" width="${kerf * scale}" height="40" fill="#e74c3c"/>`;
            currentX += kerf * scale;
        }
    });

    if (plan.waste > 0) {
        const wasteWidth = plan.waste * scale;
        svg += `<rect x="${currentX}" y="10" width="${wasteWidth}" height="40" fill="#95a5a6" opacity="0.5"/>`;
        svg += `<text x="${currentX + wasteWidth / 2}" y="35" font-size="10" fill="#2c3e50" text-anchor="middle">Waste: ${plan.waste.toFixed(1)}"</text>`;
    }

    svg += '</svg>';
    return svg;
}
