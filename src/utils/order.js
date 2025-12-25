export function calculateOrderTotal(order) {
    return order.length > 0 
        ? order.reduce((acc, item) => acc + item.price * item.qty, 0) 
        : 0
}