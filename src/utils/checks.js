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

export function getCheckNumber(table, checkId) {
    const checkNumber = table.checks.findIndex(check => check.checkId === checkId)
    return checkNumber >= 0 ? checkNumber + 1 : null
}

export function getAssignedAmountTotal(table) {
    const priceByLineId = new Map(
        table.currentOrder.map((line) => [line.lineId, line.price])
    )

    return table.checks
        .flatMap((c) => c.items)
        .reduce((sum, item) => {
            const price = priceByLineId.get(item.lineId) ?? 0
            return sum + price * item.qty
        }, 0) ?? 0
}