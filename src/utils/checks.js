export function getAssignedQtyForLine(table, lineId) {
    return table.checks
        .flatMap((c) => c.items)
        .filter((i) => i.lineId === lineId)
        .reduce((sum, i) => sum + i.qty, 0)
}

export function getAssignedQtyForLineInCheck(table, checkId, lineId) {
    const check = table.checks.find((c) => c.checkId === checkId)
    if (!check) return 0
    return check.items
        .filter((i) => i.lineId === lineId)
        .reduce((sum, i) => sum + i.qty, 0)
}

export function getCheckNummber(table, checkId) {
    const checkNumber = table.checks.findIndex(check => check.checkId === checkId)
    return checkNumber >= 0 ? checkNumber + 1 : null
}