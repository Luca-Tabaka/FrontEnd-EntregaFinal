import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import catalogoStyle from '../styles/catalogo.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function CatalogoProductos() {
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/articulos')
      .then((response) => {
        if (!response.ok) throw new Error('Producto no encontrado');
        return response.json();
      })
      .then((data) => setProductosDisponibles(data))
      .catch((err) => {
        console.error('Error al cargar los productos:', err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    calcularPrecioTotal();
  }, [productosSeleccionados]);

  const agregarProducto = (producto) => {
    setProductosSeleccionados((prev) => {
      const existente = prev.find((p) => p.id === producto.id);
      if (existente) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    setProductosSeleccionados((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, cantidad: Math.max(nuevaCantidad, 1) } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const calcularPrecioTotal = () => {
    const total = productosSeleccionados.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidad,
      0
    );
    setPrecioTotal(total);
  };

  const finalizarPedido = () => {
    if (productosSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un producto.');
      return;
    }

    const pedido = {
      fechaPedido: new Date().toISOString().slice(0, 10),
      fechaEntrega: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      estado: "PENDIENTE",
      pedidoArticulos: productosSeleccionados.map((producto) => ({
        articulo: { id: producto.id },
        cantidad: producto.cantidad
      }))
    };

    fetch('http://localhost:8080/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al guardar el pedido');
        return res.json();
      })
      .then((data) => {
        console.log('Pedido guardado:', data);
        alert('Pedido realizado correctamente');
        setProductosSeleccionados([]);
        setPrecioTotal(0);
      })
      .catch((err) => {
        console.error('Error al finalizar pedido:', err);
        alert('Hubo un error al guardar el pedido');
      });
  };

  if (error) {
    return (
      <div className="text-center mt-5">
        <h1>Recurso No Encontrado</h1>
        <img src="/images/error.png" alt="Error" style={{ maxWidth: '400px' }} />
      </div>
    );
  }

  return (
    <div>
      <div className={catalogoStyle.titulo}>
        <h1>Catálogo de Productos</h1>
      </div>

      <div className="d-flex flex-wrap justify-content-center w-80 mt-3" style={{ gap: '20px' }}>
        {productosDisponibles.map((producto) => (
          <div key={producto.id} className="card" style={{ width: '300px' }}>
            <img src={producto.imagen || producto.pathImg} className="card-img-top" alt={producto.nombre} />
            <div className="card-body">
              <h5 className="card-title">{producto.nombre}</h5>
              <p className="card-text">{producto.descripcion}</p>
              <p className="card-text">
                <small className="text-muted"><strong>Precio:</strong> ${producto.precio}</small>
              </p>
              <div className="d-flex justify-content-center align-items-center">
                <button className="btn btn-dark w-50 ms-1 mb-2" onClick={() => agregarProducto(producto)}>Seleccionar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carrito */}
      <div className="d-flex justify-content-end align-items sticky-bottom mt-4">
        <div className="btn-group dropup">
          <button className="btn btn-dark mb-2" disabled>Precio Total: ${precioTotal}</button>
          <button className="btn btn-primary dropdown-toggle ms-1 mb-2" data-bs-toggle="dropdown">
            Ir al carrito
          </button>
          <ul className="dropdown-menu list-inline text-light w-100" style={{ backgroundColor: 'rgba(128, 128, 128, 0.8)' }}>
            {productosSeleccionados.map((producto) => (
              <div key={producto.id} className="p-2">
                <li className="list-inline-item">{producto.nombre} (x{producto.cantidad})</li>
                <div className="input-group mt-1">
                  <button className="btn btn-outline-secondary" onClick={() => cambiarCantidad(producto.id, producto.cantidad - 1)}>-</button>
                  <input type="text" className="form-control text-center" value={producto.cantidad} readOnly />
                  <button className="btn btn-outline-secondary" onClick={() => cambiarCantidad(producto.id, producto.cantidad + 1)}>+</button>
                </div>
                <hr />
              </div>
            ))}
          </ul>
        </div>
        <button className="btn btn-success ms-2 mb-2" onClick={finalizarPedido}>
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
}

export default CatalogoProductos;
