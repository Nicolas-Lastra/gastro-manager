import { useTablesStore } from "../store/tablesStore"
import { getAssignedQtyForLine, getAssignedQtyForLineInCheck } from "../utils/checks"

export default function SplitOrder({ table, selectedCheckId }) {

    const assignItemToCheck = useTablesStore((state) => state.assignItemToCheck)
    const unassignItemFromCheck = useTablesStore((state) => state.unassignItemFromCheck)

    return(
        <div>
            <h2>Asignar</h2>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Total</th>
                        <th>Asignado</th>
                        <th>Restante</th>
                        <th>En cuenta</th>
                        <th>Acción</th>
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
                        <td>{line.price}</td>
                        <td>{line.qty}</td>
                        <td>{assigned}</td>
                        <td>{remaining}</td>
                        <td>{inThisCheck}</td>
                        <td>
                        <button
                            disabled={remaining <= 0}
                            onClick={() => assignItemToCheck(table.id, selectedCheckId, line.lineId, 1)}
                        >
                            +
                        </button>

                        <button
                            disabled={inThisCheck <= 0}
                            onClick={() => unassignItemFromCheck(table.id, selectedCheckId, line.lineId, 1)}
                        >
                            -
                        </button>
                        </td>
                    </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}