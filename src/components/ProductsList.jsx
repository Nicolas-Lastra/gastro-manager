export default function ProductsList({ products, onAddProduct }) {

  const handleAddButton = (productId) => {
    onAddProduct(productId)
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
                >Agregar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length < 1 && <small>Sin coincidencia</small>}
    </>
  )
}
