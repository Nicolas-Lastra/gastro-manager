export default function ProductsList({ products, onAddProduct, onRemoveProduct }) {

  const handleAddButton = (productId) => {
    onAddProduct(productId)
  }

  const handleRemoveButton = (productId) => {
    onRemoveProduct(productId)
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Products</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr id={product.id} key={`product-${product.id}`}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
                <button
                    onClick={() => handleAddButton(product.id)}
                >+</button>

                <button
                    onClick={() => handleRemoveButton(product.id)}
                >-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length < 1 && <small>Sin coincidencia</small>}
    </>
  )
}
