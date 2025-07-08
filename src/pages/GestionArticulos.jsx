import { useEffect, useState } from 'react';
import styles from '../styles/gestionArticulos.module.css';

const API_URL = "http://localhost:8080/api/articulos";

function GestionArticulos() {
  const [articulos, setArticulos] = useState([]);
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagen: ''
  });

  useEffect(() => {
    listarArticulos();
  }, []);

  const listarArticulos = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setArticulos(data))
      .catch(err => console.error("Error al listar artículos:", err));
  };

  const limpiarForm = () => {
    setForm({
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      imagen: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const guardarArticulo = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.precio || Number(form.precio) < 0) {
      alert("Por favor complete correctamente los campos.");
      return;
    }

    const metodo = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${API_URL}/${form.id}` : API_URL;

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        limpiarForm();
        listarArticulos();
      })
      .catch(err => console.error("Error al guardar artículo:", err));
  };

  const editarArticulo = (id) => {
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(data => setForm({
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        precio: data.precio,
        categoria: data.categoria || '',
        imagen: data.imagen || ''
      }))
      .catch(err => console.error("Error al obtener artículo:", err));
  };

  const eliminarArticulo = (id) => {
    if (window.confirm("¿Deseás eliminar este artículo?")) {
      fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error("Error al eliminar");
          listarArticulos();
        })
        .catch(err => console.error("Error al eliminar artículo:", err));
    }
  };

  return (
    <div className={styles.container}>
      <h2 style={{ backgroundColor: '#dcdcdc'}}>Gestión de Artículos</h2>

      <form onSubmit={guardarArticulo} className={styles.form}>
        <input type="hidden" name="id" value={form.id} />

        <div className="mb-3">
          <label className="form-label" htmlFor="nombre">Nombre del Artículo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            className="form-control"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="precio">Precio</label>
          <input
            type="number"
            id="precio"
            name="precio"
            step="0.01"
            className="form-control"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="categoria">Categoría</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            className="form-control"
            value={form.categoria}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="imagen">URL de la Imagen</label>
          <input
            type="text"
            id="imagen"
            name="imagen"
            className="form-control"
            value={form.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">Guardar</button>
        <button type="button" className="btn btn-secondary" onClick={limpiarForm}>Cancelar</button>
      </form>

      <h3>Artículos Registrados</h3>
      <table className={`table table-bordered table-hover ${styles.table}`}>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map(art => (
            <tr key={art.id}>
              <td>{art.id}</td>
              <td>{art.nombre}</td>
              <td>{art.descripcion || ''}</td>
              <td>${art.precio.toFixed(2)}</td>
              <td>{art.categoria || ''}</td>
              <td>
                <img
                  src={art.imagen || 'https://via.placeholder.com/100'}
                  alt={art.nombre}
                  style={{ width: '100px', height: 'auto', borderRadius: '4px' }}
                />
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editarArticulo(art.id)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarArticulo(art.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {articulos.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">No hay artículos para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GestionArticulos;
