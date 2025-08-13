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
  CFormTextarea,
  CAlert,
  CSpinner,
  CBadge,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';
import axios from 'axios';

const Sanidad = () => {
  const [activeTab, setActiveTab] = useState('registro');
  const [bovinos, setBovinos] = useState([]);
  const [enfermedades, setEnfermedades] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [vacunas, setVacunas] = useState([]);
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
      const [bovinosRes, enfermedadesRes, tratamientosRes, vacunasRes] = await Promise.all([
        axios.get('http://localhost:3001/bovinos'),
        axios.get('http://localhost:3001/enfermedades'),
        axios.get('http://localhost:3001/tratamientos'),
        axios.get('http://localhost:3001/vacunas')
      ]);

      setBovinos(bovinosRes.data);
      setEnfermedades(enfermedadesRes.data);
      setTratamientos(tratamientosRes.data);
      setVacunas(vacunasRes.data);
    } catch (err) {
      setError('Error al cargar los datos de sanidad');
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
        case 'enfermedad':
          endpoint = 'enfermedades';
          break;
        case 'tratamiento':
          endpoint = 'tratamientos';
          break;
        case 'vacuna':
          endpoint = 'vacunas';
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
        const endpoint = tipo === 'enfermedad' ? 'enfermedades' : 
                        tipo === 'tratamiento' ? 'tratamientos' : 'vacunas';
        await axios.delete(`http://localhost:3001/${endpoint}/${id}`);
        cargarDatos();
      } catch (err) {
        setError('Error al eliminar el registro');
      }
    }
  };

  // Filtrar datos
  const filtrarDatos = (datos) => {
    return datos.filter(item => {
      const coincideBovino = !filtroBovino || item.bovinoId?.toString() === filtroBovino;
      const coincideEstado = !filtroEstado || item.estado === filtroEstado;
      return coincideBovino && coincideEstado;
    });
  };

  // Renderizar tabla de enfermedades
  const renderTablaEnfermedades = () => (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Bovino</CTableHeaderCell>
          <CTableHeaderCell>Enfermedad</CTableHeaderCell>
          <CTableHeaderCell>Síntomas</CTableHeaderCell>
          <CTableHeaderCell>Gravedad</CTableHeaderCell>
          <CTableHeaderCell>Fecha Diagnóstico</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {filtrarDatos(enfermedades).map(enfermedad => (
          <CTableRow key={enfermedad.id}>
            <CTableDataCell>
              {bovinos.find(b => b.id === enfermedad.bovinoId)?.nombre || 'N/A'}
            </CTableDataCell>
            <CTableDataCell>{enfermedad.nombre}</CTableDataCell>
            <CTableDataCell>{enfermedad.sintomas}</CTableDataCell>
            <CTableDataCell>
              <CBadge color={enfermedad.gravedad === 'alta' ? 'danger' : 
                           enfermedad.gravedad === 'media' ? 'warning' : 'info'}>
                {enfermedad.gravedad}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>{enfermedad.fechaDiagnostico}</CTableDataCell>
            <CTableDataCell>
              <CBadge color={enfermedad.estado === 'activa' ? 'danger' : 'success'}>
                {enfermedad.estado}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton color="info" size="sm" onClick={() => abrirModal('enfermedad', enfermedad)}>
                Editar
              </CButton>
              <CButton color="danger" size="sm" className="ms-1" 
                onClick={() => eliminarRegistro('enfermedad', enfermedad.id)}>
                Eliminar
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );

  // Renderizar tabla de tratamientos
  const renderTablaTratamientos = () => (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Bovino</CTableHeaderCell>
          <CTableHeaderCell>Medicamento</CTableHeaderCell>
          <CTableHeaderCell>Dosis</CTableHeaderCell>
          <CTableHeaderCell>Frecuencia</CTableHeaderCell>
          <CTableHeaderCell>Duración</CTableHeaderCell>
          <CTableHeaderCell>Fecha Inicio</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {filtrarDatos(tratamientos).map(tratamiento => (
          <CTableRow key={tratamiento.id}>
            <CTableDataCell>
              {bovinos.find(b => b.id === tratamiento.bovinoId)?.nombre || 'N/A'}
            </CTableDataCell>
            <CTableDataCell>{tratamiento.medicamento}</CTableDataCell>
            <CTableDataCell>{tratamiento.dosis}</CTableDataCell>
            <CTableDataCell>{tratamiento.frecuencia}</CTableDataCell>
            <CTableDataCell>{tratamiento.duracion}</CTableDataCell>
            <CTableDataCell>{tratamiento.fechaInicio}</CTableDataCell>
            <CTableDataCell>
              <CBadge color={tratamiento.estado === 'activo' ? 'warning' : 'success'}>
                {tratamiento.estado}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton color="info" size="sm" onClick={() => abrirModal('tratamiento', tratamiento)}>
                Editar
              </CButton>
              <CButton color="danger" size="sm" className="ms-1" 
                onClick={() => eliminarRegistro('tratamiento', tratamiento.id)}>
                Eliminar
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );

  // Renderizar tabla de vacunas
  const renderTablaVacunas = () => (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Bovino</CTableHeaderCell>
          <CTableHeaderCell>Vacuna</CTableHeaderCell>
          <CTableHeaderCell>Tipo</CTableHeaderCell>
          <CTableHeaderCell>Dosis</CTableHeaderCell>
          <CTableHeaderCell>Fecha Aplicación</CTableHeaderCell>
          <CTableHeaderCell>Próxima Dosis</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {filtrarDatos(vacunas).map(vacuna => (
          <CTableRow key={vacuna.id}>
            <CTableDataCell>
              {bovinos.find(b => b.id === vacuna.bovinoId)?.nombre || 'N/A'}
            </CTableDataCell>
            <CTableDataCell>{vacuna.nombre}</CTableDataCell>
            <CTableDataCell>{vacuna.tipo}</CTableDataCell>
            <CTableDataCell>{vacuna.dosis}</CTableDataCell>
            <CTableDataCell>{vacuna.fechaAplicacion}</CTableDataCell>
            <CTableDataCell>{vacuna.proximaDosis}</CTableDataCell>
            <CTableDataCell>
              <CBadge color={vacuna.estado === 'vigente' ? 'success' : 'warning'}>
                {vacuna.estado}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton color="info" size="sm" onClick={() => abrirModal('vacuna', vacuna)}>
                Editar
              </CButton>
              <CButton color="danger" size="sm" className="ms-1" 
                onClick={() => eliminarRegistro('vacuna', vacuna.id)}>
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
      case 'enfermedad':
        return (
          <>
            <CFormSelect name="bovinoId" value={formData.bovinoId || ''} onChange={handleInputChange} className="mb-3">
              <option value="">Seleccione un bovino</option>
              {bovinos.map(bovino => (
                <option key={bovino.id} value={bovino.id}>{bovino.nombre}</option>
              ))}
            </CFormSelect>
            <CFormInput name="nombre" value={formData.nombre || ''} onChange={handleInputChange} 
              placeholder="Nombre de la enfermedad" className="mb-3" />
            <CFormTextarea name="sintomas" value={formData.sintomas || ''} onChange={handleInputChange} 
              placeholder="Síntomas" rows={3} className="mb-3" />
            <CFormSelect name="gravedad" value={formData.gravedad || ''} onChange={handleInputChange} className="mb-3">
              <option value="">Seleccione gravedad</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </CFormSelect>
            <CFormInput type="date" name="fechaDiagnostico" value={formData.fechaDiagnostico || ''} 
              onChange={handleInputChange} placeholder="Fecha diagnóstico" className="mb-3" />
            <CFormSelect name="estado" value={formData.estado || ''} onChange={handleInputChange} className="mb-3">
              <option value="activa">Activa</option>
              <option value="recuperada">Recuperada</option>
            </CFormSelect>
          </>
        );
      case 'tratamiento':
        return (
          <>
            <CFormSelect name="bovinoId" value={formData.bovinoId || ''} onChange={handleInputChange} className="mb-3">
              <option value="">Seleccione un bovino</option>
              {bovinos.map(bovino => (
                <option key={bovino.id} value={bovino.id}>{bovino.nombre}</option>
              ))}
            </CFormSelect>
            <CFormInput name="medicamento" value={formData.medicamento || ''} onChange={handleInputChange} 
              placeholder="Medicamento" className="mb-3" />
            <CFormInput name="dosis" value={formData.dosis || ''} onChange={handleInputChange} 
              placeholder="Dosis" className="mb-3" />
            <CFormInput name="frecuencia" value={formData.frecuencia || ''} onChange={handleInputChange} 
              placeholder="Frecuencia" className="mb-3" />
            <CFormInput name="duracion" value={formData.duracion || ''} onChange={handleInputChange} 
              placeholder="Duración" className="mb-3" />
            <CFormInput type="date" name="fechaInicio" value={formData.fechaInicio || ''} 
              onChange={handleInputChange} placeholder="Fecha inicio" className="mb-3" />
            <CFormSelect name="estado" value={formData.estado || ''} onChange={handleInputChange} className="mb-3">
              <option value="activo">Activo</option>
              <option value="completado">Completado</option>
            </CFormSelect>
          </>
        );
      case 'vacuna':
        return (
          <>
            <CFormSelect name="bovinoId" value={formData.bovinoId || ''} onChange={handleInputChange} className="mb-3">
              <option value="">Seleccione un bovino</option>
              {bovinos.map(bovino => (
                <option key={bovino.id} value={bovino.id}>{bovino.nombre}</option>
              ))}
            </CFormSelect>
            <CFormInput name="nombre" value={formData.nombre || ''} onChange={handleInputChange} 
              placeholder="Nombre de la vacuna" className="mb-3" />
            <CFormSelect name="tipo" value={formData.tipo || ''} onChange={handleInputChange} className="mb-3">
              <option value="">Seleccione tipo</option>
              <option value="preventiva">Preventiva</option>
              <option value="terapéutica">Terapéutica</option>
            </CFormSelect>
            <CFormInput name="dosis" value={formData.dosis || ''} onChange={handleInputChange} 
              placeholder="Dosis" className="mb-3" />
            <CFormInput type="date" name="fechaAplicacion" value={formData.fechaAplicacion || ''} 
              onChange={handleInputChange} placeholder="Fecha aplicación" className="mb-3" />
            <CFormInput type="date" name="proximaDosis" value={formData.proximaDosis || ''} 
              onChange={handleInputChange} placeholder="Próxima dosis" className="mb-3" />
            <CFormSelect name="estado" value={formData.estado || ''} onChange={handleInputChange} className="mb-3">
              <option value="vigente">Vigente</option>
              <option value="vencida">Vencida</option>
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
            <strong>Gestión de Sanidad - Módulo Médico de Bovinos</strong>
          </CCardHeader>
          <CCardBody>
            {/* Filtros */}
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormSelect value={filtroBovino} onChange={(e) => setFiltroBovino(e.target.value)}>
                  <option value="">Todos los bovinos</option>
                  {bovinos.map(bovino => (
                    <option key={bovino.id} value={bovino.id}>{bovino.nombre}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                  <option value="">Todos los estados</option>
                  <option value="activa">Activa</option>
                  <option value="recuperada">Recuperada</option>
                  <option value="activo">Activo</option>
                  <option value="completado">Completado</option>
                  <option value="vigente">Vigente</option>
                  <option value="vencida">Vencida</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <div className="d-flex flex-wrap gap-2">
                  <CButton color="success" size="sm" onClick={() => abrirModal('enfermedad')}>
                    Nueva Enfermedad
                  </CButton>
                  <CButton color="primary" size="sm" onClick={() => abrirModal('tratamiento')}>
                    Nuevo Tratamiento
                  </CButton>
                  <CButton color="info" size="sm" onClick={() => abrirModal('vacuna')}>
                    Nueva Vacuna
                  </CButton>
                </div>
              </CCol>
            </CRow>

            {/* Tabs de navegación */}
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink active={activeTab === 'registro'} onClick={() => setActiveTab('registro')}>
                  Registro Médico
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'enfermedades'} onClick={() => setActiveTab('enfermedades')}>
                  Enfermedades ({enfermedades.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'tratamientos'} onClick={() => setActiveTab('tratamientos')}>
                  Tratamientos ({tratamientos.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'vacunas'} onClick={() => setActiveTab('vacunas')}>
                  Vacunas ({vacunas.length})
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              <CTabPane visible={activeTab === 'registro'}>
                <CRow className="mt-3">
                  <CCol md={4}>
                    <CCard>
                      <CCardHeader>Resumen de Sanidad</CCardHeader>
                      <CCardBody>
                        <p>Total de enfermedades: {enfermedades.length}</p>
                        <p>Tratamientos activos: {tratamientos.filter(t => t.estado === 'activo').length}</p>
                        <p>Vacunas vigentes: {vacunas.filter(v => v.estado === 'vigente').length}</p>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol md={8}>
                    <CCard>
                      <CCardHeader>Alertas de Salud</CCardHeader>
                      <CCardBody>
                        {enfermedades.filter(e => e.estado === 'activa' && e.gravedad === 'alta').length > 0 && (
                          <CAlert color="danger">
                            Hay {enfermedades.filter(e => e.estado === 'activa' && e.gravedad === 'alta').length} 
                            enfermedad(es) de alta gravedad activa(s)
                          </CAlert>
                        )}
                        {vacunas.filter(v => v.estado === 'vencida').length > 0 && (
                          <CAlert color="warning">
                            Hay {vacunas.filter(v => v.estado === 'vencida').length} vacuna(s) vencida(s)
                          </CAlert>
                        )}
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </CTabPane>

              <CTabPane visible={activeTab === 'enfermedades'}>
                <h5 className="mt-3">Listado de Enfermedades</h5>
                {enfermedades.length === 0 ? (
                  <CAlert color="info">No hay enfermedades registradas</CAlert>
                ) : (
                  renderTablaEnfermedades()
                )}
              </CTabPane>

              <CTabPane visible={activeTab === 'tratamientos'}>
                <h5 className="mt-3">Listado de Tratamientos</h5>
                {tratamientos.length === 0 ? (
                  <CAlert color="info">No hay tratamientos registrados</CAlert>
                ) : (
                  renderTablaTratamientos()
                )}
              </CTabPane>

              <CTabPane visible={activeTab === 'vacunas'}>
                <h5 className="mt-3">Listado de Vacunas</h5>
                {vacunas.length === 0 ? (
                  <CAlert color="info">No hay vacunas registradas</CAlert>
                ) : (
                  renderTablaVacunas()
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
            {modalType === 'enfermedad' && 'Registrar Enfermedad'}
            {modalType === 'tratamiento' && 'Registrar Tratamiento'}
            {modalType === 'vacuna' && 'Registrar Vacuna'}
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

export default Sanidad;
