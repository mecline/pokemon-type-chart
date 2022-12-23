export default function damageCalculator(typeChart, damageCalcs, offense) {
    // let listOfDamageTypes = ['double_damage_from', 'double_damage_to', 'half_damage_from', 'half_damage_to', 'no_damage_from', 'no_damage_to'];
    let calculatedTypeChart = typeChart;

    damageCalcs.map(typeCalcs => {
        if (!offense) {
            typeCalcs.damageCalcs.double_damage_from.map(typing => {
                return (applyTypeChange(calculatedTypeChart, typing, 2));
            })
            typeCalcs.damageCalcs.half_damage_from.map(typing => {
                return (applyTypeChange(calculatedTypeChart, typing, 0.5));
            })
            typeCalcs.damageCalcs.no_damage_from.map(typing => {
                return (applyTypeChange(calculatedTypeChart, typing, 0));
            })
        }
        else {
            typeCalcs.damageCalcs.double_damage_to.map(typing => {
                return (applyTypeChange(calculatedTypeChart, typing, 2));
            })
            typeCalcs.damageCalcs.half_damage_to.map(typing => {
                return (applyTypeChange(calculatedTypeChart, typing, 0.5));
            })
            typeCalcs.damageCalcs.no_damage_to.map(typing => {
                return (applyTypeChange(calculatedTypeChart, typing, 0));
            })
        }
        return (typeCalcs);
    })
    return (calculatedTypeChart);
}


function applyTypeChange(calculatedTypeChart, typing, damageAmount) {
    let prevDamage = calculatedTypeChart.get(typing.name);
    let newDamage = prevDamage * damageAmount;
    calculatedTypeChart.set(typing.name, newDamage)
    return (calculatedTypeChart);
}

export function generateTableData(calculatedTypeChart) {
    let doubleDamage = [];
    let halfDamage = [];
    let noDamage = [];
    calculatedTypeChart.forEach((value, key) => {
        if (value === 2) {
            doubleDamage.push(key);
        }
        else if (value === 0.5) {
            halfDamage.push(key);
        }
        else if (value === 0) {
            noDamage.push(key);
        }
    })
    let damageTableData = [{ 'doubleDamage': doubleDamage.toString(), 'halfDamage': halfDamage.toString(), 'noDamage': noDamage.toString() }];
    return (damageTableData)
}