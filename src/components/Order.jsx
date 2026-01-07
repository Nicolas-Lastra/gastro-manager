export default function Order({ currentOrder, onIncreaseButton, onDecreaseButton }) {

    // const increaseOrderQty = (itemId) => {
    //     onIncreaseButton(itemId)
    // }
    // const decreaseOrderQty = (itemId) => {
    //     onDecreaseButton(itemId)
    // }

    if (!currentOrder || currentOrder.length === 0) {
        return (
            <div>
                <p>Agregue productos a la orden ...</p>
            </div>
        )
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
                        <th>Subtotal</th>
                    </tr>
                </thead>

                <tbody>
                    {currentOrder.map((item) => (
                        <tr key={`order-item-${item.lineId}`}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>
                                <div className="small-buttons-container">
                                    <button
                                            className="small-button"
                                            onClick={() => onIncreaseButton(item.lineId)}
                                    >+</button>
                                    {item.qty}
                                    <button
                                        className="small-button"
                                        onClick={() => onDecreaseButton(item.lineId)}
                                    >-</button>
                                </div>
                            </td>
                            <td>{item.qty * item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}