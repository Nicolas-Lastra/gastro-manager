export default function Order({ currentOrder, onIncreaseButton, onDecreaseButton }) {

    const increaseOrderQty = (itemId) => {
        onIncreaseButton(itemId)
    }
    const decreaseOrderQty = (itemId) => {
        onDecreaseButton(itemId)
    }

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
                        <tr key={`order-item-${item.productId}`}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.qty}</td>
                            <td>
                                <button
                                    onClick={() => increaseOrderQty(item.productId)}
                                >+</button>

                                <button
                                    onClick={() => decreaseOrderQty(item.productId)}
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