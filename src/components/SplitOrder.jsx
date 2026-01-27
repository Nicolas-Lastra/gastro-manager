import { useTablesStore } from "../store/tablesStore"
import { getAssignedQtyForLine, getAssignedQtyForLineInCheck, getCheckNumber } from "../utils/checks"

export default function SplitOrder({ table, onDeleteSelectedCheck }) {

    const assignItemToCheck = useTablesStore((state) => state.assignItemToCheck)
    const unassignItemFromCheck = useTablesStore((state) => state.unassignItemFromCheck)

    return(
        <>
            {table.checks.map((check) =>
                <div key={check.checkId} className="splitOrderCard">
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
                        <h2>Cuenta #{getCheckNumber(table, check.checkId)?? "-"}</h2>
                        <button onClick={() => onDeleteSelectedCheck(check.checkId)} style={{padding: '0rem .5rem'}}>X</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>En cuenta</th>
                            </tr>
                        </thead>

                        <tbody>
                            {table.currentOrder.map((line) => {
                            const assigned = getAssignedQtyForLine(table, line.lineId)
                            const remaining = line.qty - assigned
                            const inThisCheck = getAssignedQtyForLineInCheck(table, check.checkId, line.lineId)

                            return (
                            <tr key={line.lineId}>
                                <td>{line.name}</td>
                                <td>
                                    <div className="small-buttons-container">
                                        <button
                                            type="button"
                                            className="small-button"
                                            disabled={remaining <= 0}
                                            onClick={() => assignItemToCheck(table.id, check.checkId, line.lineId, 1)}
                                        >
                                            +
                                        </button>
                                        {inThisCheck}
                                        <button
                                            type="button"
                                            className="small-button"
                                            disabled={inThisCheck <= 0}
                                            onClick={() => unassignItemFromCheck(table.id, check.checkId, line.lineId, 1)}
                                        >
                                            -
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            )}  
        </>
    )
}