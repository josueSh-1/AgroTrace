import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CAlert,
  CSpinner,
  CBadge,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CProgress
} from '@coreui/react';
import axios from 'axios';

const Produccion = () => {
  const [activeTab, setActiveTab] = useState('registro');
  const [bovinos, setBovinos] = useState([]);
  const [lactancias, setLactancias] = useState([]);
  const [historialLactancias, setHistorialLactancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});

  // Estados para filtros
  const [filtroBovino, setFiltroBovino] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [bovinosRes, lactanciasRes, historialRes] = await Promise.all([
        axios.get('http://localhost:3001/bovinos'),
        axios.get('http://localhost:3001/lactancias'),
        axios.get('http://localhost:3001/historial_lactancias')
      ]);

      setBovinos(bovinosRes.data);
      setLactancias(lactanciasRes.data);
      setHistorialLactancias(historialRes.data);
    } catch (err) {
      setError('Error al cargar los datos de producción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Abrir modal según tipo
  const abrirModal = (tipo, item = null) => {
    setModalType(tipo);
    setFormData(item || {});
    setShowModal(true);
  };

  // Guardar datos
  const guardarDatos = async () => {
    try {
      let endpoint = '';
      switch (modalType) {
        case 'lactancia':
          endpoint = 'lactancias';
          break;
        case 'historial':
          endpoint = 'historial_lactancias';
          break;
        default:
          return;
      }

      if (formData.id) {
        await axios.put(`http://localhost:3001/${endpoint}/${formData.id}`, formData);
      } else {
        await axios.post(`http://localhost:3001/${endpoint}`, formData);
      }

      setShowModal(false);
      cargarDatos();
    } catch (err) {
      setError('Error al guardar los datos');
      console.error(err);
    }
  };

  // Eliminar registro
  const eliminarRegistro = async (tipo, id) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      try {
        const endpoint = tipo === 'lactancia' ? 'lactancias' : 'historial_lactancias';
        await axios.delete(`http://localhost:3001/${endpoint}/${id}`);
        cargarDatos();
      } catch (err) {
        setError('Error al eliminar el registro');
      }
    }
  };

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const totalLeche = lactancias.reduce((acc, l) => acc + (Number(l.cantidad) || 0), 0);
    const promedioDiario = lactancias.length > 0 ? totalLeche / lactancias.length : 0;
    const lactanciasActivas = lactancias.filter(l => l.estado === 'activa').length;
    
    return { totalLeche, promedioDiario, lactanciasActivas };
  };

  const estadisticas = calcularEstadisticas();

  // Filtrar datos
  const filtrarDatos = (datos) => {
    return datos.filter(item => {
      const coincideBovino = !filtroBovino || item.bovinoId?.toString() === filtroBovino;
      const coincideEstado = !filtroEstado || item.estado === filtroEstado;
      return coincideBovino && coincideEstado;
    });
  };

  // Renderizar tabla de lactancias
  const renderTablaLactancias = () => (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Bovino</CTableHeaderCell>
          <CTableHeaderCell>Fecha Inicio</CTableHeaderCell>
          <CTableHeaderCell>Fecha Fin</CTableHeaderCell>
          <CTableHeaderCell>Producción Diaria (L)</CTableHeaderCell>
          <CTableHeaderCell>Total Leche (L)</CTableHeaderCell>
          <CTableHeaderCell>Calidad</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {filtrarDatos(lactancias).map(lactancia => (
          <CTableRow key={lactancia.id}>
            <CTableDataCell>
              {bovinos.find(b => b.id === lactancia.bovinoId)?.nombre || 'N/A'}
            </CTableDataCell>
            <CTableDataCell>{lactancia.fechaInicio}</CTableDataCell>
            <CTableDataCell>{lactancia.fechaFin || 'En curso'}</CTableDataCell>
            <CTableDataCell>{lactancia.produccionDiaria || 0} L</CTableDataCell>
            <CTableDataCell>{lactancia.cantidad || 0} L</CTableDataCell>
            <CTableDataCell>
              <CBadge color={lactancia.calidad === 'excelente' ? 'success' : 
                           lactancia.calidad === 'buena' ? 'info' : 'warning'}>
                {lactancia.calidad || 'Sin calificar'}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CBadge color={lactancia.estado === 'activa' ? 'success' : 'secondary'}>
                {lactancia.estado}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton color="info" size="sm" onClick={() => abrirModal('lactancia', lactancia)}>
                Editar
              </CButton>
              <CButton color="danger" size="sm" className="ms-1" 
                onClick={() => eliminarRegistro('lactancia', lactancia.id)}>
                Eliminar
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );

  // Renderizar tabla de historial
  const renderTablaHistorial = () => (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Bovino</CTableHeaderCell>
          <CTableHeaderCell>Fecha</CTableHeaderCell>
          <CTableHeaderCell>Producción (L)</CTableHeaderCell>
          <CTableHeaderCell>Grasa (%)</CTableHeaderCell>
          <CTableHeaderCell>Proteína (%)</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {filtrarDatos(historialLactancias).map(historial => (
          <CTableRow key={historial.id}>
            <CTableDataCell>
              {bovinos.find(b => b.id === historial.bovinoId)?.nombre || 'N/A'}
            </CTableDataCell>
            <CTableDataCell>{historial.fecha}</CTableDataCell>
            <CTableDataCell>{historial.cantidad || 0} L</CTableDataCell>
            <CTableDataCell>{historial.grasa || 0}%</CTableDataCell>
            <CTableDataCell>{historial.proteina || 0}%</CTableDataCell>
            <CTableDataCell>
              <CBadge color={historial.estado === 'registrado' ? 'success' : 'secondary'}>
                {historial.estado || 'registrado'}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton color="info" size="sm" onClick={() => abrirModal('historial', historial)}>
                Editar
              </CButton>
              <CButton color="danger" size="sm" className="ms-1" 
                onClick={() => eliminarRegistro('historial', historial.id)}>
                Eliminar
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );

  // Renderizar formulario según tipo
  const renderFormulario = () => {
    switch (modalType) {
      case 'lactancia':
        return (
          <>
            <CFormSelect name="bovinoId" value={formData.bovinoId || ''} onChange={handleInputChange} className="mb-3">
              <option value="">Seleccione un bovino</option>
              {bovinos.map(bovino => (
                <option key={bovino.id} value={bovino.id}>{bovino.nombre}</option>
              ))}
            </CFormSelect>
            <CFormInput type="date" name="fechaInicio" value={formData.fechaInicio || ''} 
              onChange={handleInputChange} placeholder="Fecha inicio" className="mb-3" />
            <CFormInput type="date" name="fechaFin" value={formData.fechaFin || ''} 
              onChange={handleInputChange} placeholder="Fecha fin (opcional)" className="mb-3" />
            <CFormInput type="number" name="produccionDiaria" value={formData.produccionDiaria || ''} 
              onChange={handleInputChange} placeholder="Producción diaria (L)" className="mb-3" />
            <CFormInput type="number" name="cantidad" value={formData.cantidad || ''} 
              onChange={handleInputChange} placeholder="Total leche (L)" className="mb-3" />
            <CFormSelect name="calidad" value={formData.calidad || ''} onChange={handleInputChange} className="mb-3">
              <option value="">Seleccione calidad</option>
              <option value="excelente">Excelente</option>
              <option value="buena">Buena</option>
              <option value="regular">Regular</option>
            </CFormSelect>
            <CFormSelect name="estado" value={formData.estado || ''} onChange={handleInputChange} className="mb-3">
              <option value="activa">Activa</option>
              <option value="completada">Completada</option>
            </CFormSelect>
          </>
        );
      case 'historial':
        return (
          <>
            <CFormSelect name="bovinoId" value={formData.bovinoId || ''} onChange={handleInputChange} className="mb-3">
              <option value="">Seleccione un bovino</option>
              {bovinos.map(bovino => (
                <option key={bovino.id} value={bovino.id}>{bovino.nombre}</option>
              ))}
            </CFormSelect>
            <CFormInput type="date" name="fecha" value={formData.fecha || ''} 
              onChange={handleInputChange} placeholder="Fecha" className="mb-3" />
            <CFormInput type="number" name="cantidad" value={formData.cantidad || ''} 
              onChange={handleInputChange} placeholder="Cantidad (L)" className="mb-3" />
            <CFormInput type="number" name="grasa" value={formData.grasa || ''} 
              onChange={handleInputChange} placeholder="Grasa (%)" className="mb-3" />
            <CFormInput type="number" name="proteina" value={formData.proteina || ''} 
              onChange={handleInputChange} placeholder="Proteína (%)" className="mb-3" />
            <CFormSelect name="estado" value={formData.estado || ''} onChange={handleInputChange} className="mb-3">
              <option value="registrado">Registrado</option>
              <option value="procesado">Procesado</option>
            </CFormSelect>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) return <CSpinner color="primary" />;
  if (error) return <CAlert color="danger">{error}</CAlert>;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Gestión de Producción - Módulo de Lactancias</strong>
          </CCardHeader>
          <CCardBody>
            {/* Estadísticas */}
            <CRow className="mb-4">
              <CCol xs={12} sm={6} lg={3} className="mb-3">
                <CCard className="h-100">
                  <CCardBody className="text-center">
                    <div className="text-primary fs-2 fw-bold">{estadisticas.totalLeche.toLocaleString()}</div>
                    <div className="text-muted">Total Leche (L)</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} sm={6} lg={3} className="mb-3">
                <CCard className="h-100">
                  <CCardBody className="text-center">
                    <div className="text-info fs-2 fw-bold">{estadisticas.promedioDiario.toFixed(2)}</div>
                    <div className="text-muted">Promedio Diario (L)</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} sm={6} lg={3} className="mb-3">
                <CCard className="h-100">
                  <CCardBody className="text-center">
                    <div className="text-success fs-2 fw-bold">{estadisticas.lactanciasActivas}</div>
                    <div className="text-muted">Lactancias Activas</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} sm={6} lg={3} className="mb-3">
                <CCard className="h-100">
                  <CCardBody className="text-center">
                    <div className="text-warning fs-2 fw-bold">{lactancias.length}</div>
                    <div className="text-muted">Total Lactancias</div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Filtros y Acciones */}
            <CRow className="mb-3 align-items-end">
              <CCol xs={12} md={4} className="mb-2 mb-md-0">
                <label className="form-label">Filtrar por Bovino</label>
                <CFormSelect value={filtroBovino} onChange={(e) => setFiltroBovino(e.target.value)}>
                  <option value="">Todos los bovinos</option>
                  {bovinos.map(bovino => (
                    <option key={bovino.id} value={bovino.id}>{bovino.nombre}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={4} className="mb-2 mb-md-0">
                <label className="form-label">Filtrar por Estado</label>
                <CFormSelect value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                  <option value="">Todos los estados</option>
                  <option value="activa">Activa</option>
                  <option value="completada">Completada</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={4}>
                <label className="form-label">Acciones</label>
                <div className="d-flex flex-wrap gap-2">
                  <CButton color="success" size="sm" className="flex-fill" onClick={() => abrirModal('lactancia')}>
                    Nueva Lactancia
                  </CButton>
                  <CButton color="primary" size="sm" className="flex-fill" onClick={() => abrirModal('historial')}>
                    Nuevo Registro
                  </CButton>
                </div>
              </CCol>
            </CRow>

            {/* Tabs de navegación */}
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink active={activeTab === 'registro'} onClick={() => setActiveTab('registro')}>
                  Resumen
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'lactancias'} onClick={() => setActiveTab('lactancias')}>
                  Lactancias ({lactancias.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'historial'} onClick={() => setActiveTab('historial')}>
                  Historial ({historialLactancias.length})
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              <CTabPane visible={activeTab === 'registro'}>
                <CRow className="mt-3">
                  <CCol md={6}>
                    <CCard>
                      <CCardHeader>Producción Mensual</CCardHeader>
                      <CCardBody>
                        <CProgress className="mb-3" color="success" value={75}>
                          75% Meta Mensual
                        </CProgress>
                        <p>Meta: 10,000 L</p>
                        <p>Actual: 7,500 L</p>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol md={6}>
                    <CCard>
                      <CCardHeader>Alertas de Producción</CCardHeader>
                      <CCardBody>
                        {lactancias.filter(l => l.estado === 'activa' && !l.fechaFin).length > 0 && (
                          <CAlert color="info">
                            Hay {lactancias.filter(l => l.estado === 'activa' && !l.fechaFin).length} lactancia(s) activa(s)
                          </CAlert>
                        )}
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </CTabPane>

              <CTabPane visible={activeTab === 'lactancias'}>
                <h5 className="mt-3">Listado de Lactancias</h5>
                {lactancias.length === 0 ? (
                  <CAlert color="info">No hay lactancias registradas</CAlert>
                ) : (
                  renderTablaLactancias()
                )}
              </CTabPane>

              <CTabPane visible={activeTab === 'historial'}>
                <h5 className="mt-3">Historial de Producción</h5>
                {historialLactancias.length === 0 ? (
                  <CAlert color="info">No hay registros de producción</CAlert>
                ) : (
                  renderTablaHistorial()
                )}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para formularios */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {modalType === 'lactancia' && 'Registrar Lactancia'}
            {modalType === 'historial' && 'Registrar Producción'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {renderFormulario()}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={guardarDatos}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default Produccion;
