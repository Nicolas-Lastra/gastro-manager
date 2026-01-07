import { useTablesStore } from "../store/tablesStore"
import { getAssignedQtyForLine, getAssignedQtyForLineInCheck, getCheckNummber } from "../utils/checks"

export default function SplitOrder({ table, selectedCheckId, onDeleteSelectedCheck }) {

    const assignItemToCheck = useTablesStore((state) => state.assignItemToCheck)
    const unassignItemFromCheck = useTablesStore((state) => state.unassignItemFromCheck)
    const checkNummber = getCheckNummber(table, selectedCheckId)

    return(
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
                <h2>Cuenta #{checkNummber ?? "-"}</h2>
                <button onClick={() => selectedCheckId && onDeleteSelectedCheck(selectedCheckId)} style={{padding: '0rem .5rem'}}>X</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        {/* <th>Precio</th> */}
                        {/* <th>Total</th> */}
                        {/* <th>Asignado</th> */}
                        {/* <th>Restante</th> */}
                        <th>En cuenta</th>
                    </tr>
                </thead>

                <tbody>
                    {table.currentOrder.map((line) => {
                    const assigned = getAssignedQtyForLine(table, line.lineId)
                    const remaining = line.qty - assigned
                    const inThisCheck = getAssignedQtyForLineInCheck(table, selectedCheckId, line.lineId)

                    return (
                    <tr key={line.lineId}>
                        <td>{line.name}</td>
                        {/* <td>{line.price}</td> */}
                        {/* <td>{line.qty}</td> */}
                        {/* <td>{assigned}</td> */}
                        {/* <td>{remaining}</td> */}
                        <td>
                            <div className="small-buttons-container">
                                <button
                                    className="small-button"
                                    disabled={remaining <= 0}
                                    onClick={() => assignItemToCheck(table.id, selectedCheckId, line.lineId, 1)}
                                >
                                    +
                                </button>
                                {inThisCheck}
                                <button
                                    className="small-button"
                                    disabled={inThisCheck <= 0}
                                    onClick={() => unassignItemFromCheck(table.id, selectedCheckId, line.lineId, 1)}
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
    )
}