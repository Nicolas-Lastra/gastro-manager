export default function Order({ currentOrder, onIncreaseButton, onDecreaseButton }) {

    // const increaseOrderQty = (itemId) => {
    //     onIncreaseButton(itemId)
    // }
    // const decreaseOrderQty = (itemId) => {
    //     onDecreaseButton(itemId)
    // }

    return(
        <div>
            <h2>Orden Actual</h2>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Acción</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>

                <tbody>
                    {currentOrder.map((item) => (
                        <tr key={`order-item-${item.lineId}`}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.qty}</td>
                            <td>
                                <button
                                    onClick={() => onIncreaseButton(item.lineId)}
                                >+</button>

                                <button
                                    onClick={() => onDecreaseButton(item.lineId)}
                                >-</button>
                            </td>
                            <td>{item.qty * item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}