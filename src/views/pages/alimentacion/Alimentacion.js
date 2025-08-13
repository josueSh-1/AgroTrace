import { cilSearch, cilPencil, cilTrash } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import {CAlert,CButton,CCard,CCardBody,CCardFooter,CCardHeader,CForm,CFormInput,CFormSelect,CModal,CModalBody,CModalFooter,CModalHeader,CModalTitle,CTable,CTableBody,CTableHead,CTableHeaderCell,CTableRow,CTableDataCell} from "@coreui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"

const Alimentacion = () => {
  const [cows, setCows] = useState([])
  const [selectCowId, setSelectCowId] = useState(null)
  const [alimentos, setAlimentos] = useState([])
  const [newAlimento, setNewAlimento] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    unidad: ''
  })
  const [suplementos, setSuplementos] = useState([])
  const [newSuplemento, setNewSuplemento] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    unidad: ''
  })
  const [histAlimentos, setHistAlimentos] = useState([])
  const [newHistAlimento, setNewHistAlimento] = useState({
    id_bovino: null,
    id_alimento: null,
    fecha: '',
    etapa: '',
    cantidad: 0,
    notas: ''
  })
  const [histSuplementos, setHistSuplementos] = useState([])
  const [newHistSuplemento, setNewHistSuplemento] = useState({
    id_bovino: null,
    id_suplemento: null,
    fecha: '',
    dosis: 0,
    notas: ''
  })
  const [editHistAlimento, setEditHistAlimento] = useState(null)
  const [editHistSuplemento, setEditHistSuplemento] = useState(null)
  const [modalAlim, setModalAlim] = useState(false)
  const [modalSupl, setModalSupl] = useState(false)
  const [modalNewAlim, setModalNewAlim] = useState(false)
  const [modalNewSupl, setModalNewSupl] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const responseBov = await axios.get('http://localhost:5000/bovinos')
        const responseAl = await axios.get('http://localhost:5000/alimentos')
        const responseSupl=await axios.get('http://localhost:5000/suplementos')
        const responseHistAl=await axios.get('http://localhost:5000/historial_alimentacion')
        const responseHistSupl=await axios.get('http://localhost:5000/historial_suplementos')
        setCows(responseBov.data)
        setAlimentos(responseAl.data)
        setSuplementos(responseSupl.data)
        setHistAlimentos(responseHistAl.data)
        setHistSuplementos(responseHistSupl.data)
      } catch {
        setError('Error Cargando Los Datos...')
      }
    }
    fetchData()
  }, [])

  const handleBovino = (e) => {
    setSelectCowId(e.target.value || null)
    setNewHistAlimento(prev => ({ ...prev, id_bovino: e.target.value }))
    setNewHistSuplemento(prev => ({ ...prev, id_bovino: e.target.value }))
  }

  const handleAddAlimento = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/alimentos', newAlimento)
      setAlimentos([...alimentos, response.data])
      setNewAlimento({ nombre: '', descripcion: '', tipo: '', unidad: '' })
      setSuccess('Alimento agregado exitosamente')
      setModalNewAlim(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Error al agregar el alimento')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleAddSuplemento = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/suplementos', newSuplemento)
      setSuplementos([...suplementos, response.data])
      setNewSuplemento({ nombre: '', descripcion: '', tipo: '', unidad: '' })
      setSuccess('Suplemento agregado exitosamente')
      setModalNewSupl(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Error al agregar el suplemento')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleAddHistAlimento = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/historial_alimentacion', {
        ...newHistAlimento,
        id_bovino: selectCowId
      })
      setHistAlimentos([...histAlimentos, response.data])
      setNewHistAlimento({
        id_bovino: selectCowId,
        id_alimento: null,
        fecha: '',
        etapa: '',
        cantidad: 0,
        notas: ''
      })
      setSuccess('Registro de alimento agregado exitosamente')
      setModalAlim(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Error al agregar el registro de alimento')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleAddHistSuplemento = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/historial_suplementos', {
        ...newHistSuplemento,
        id_bovino: selectCowId
      })
      setHistSuplementos([...histSuplementos, response.data])
      setNewHistSuplemento({
        id_bovino: selectCowId,
        id_suplemento: null,
        fecha: '',
        dosis: 0,
        notas: ''
      })
      setSuccess('Registro de suplemento agregado exitosamente')
      setModalSupl(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Error al agregar el registro de suplemento')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleEditHistAlimento = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`http://localhost:5000/historial_alimentacion/${editHistAlimento.id}`, editHistAlimento)
      setHistAlimentos(histAlimentos.map(h => h.id === editHistAlimento.id ? response.data : h))
      setEditHistAlimento(null)
      setSuccess('Registro de alimento actualizado exitosamente')
      setModalAlim(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Error al actualizar el registro de alimento')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleEditHistSuplemento = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`http://localhost:5000/historial_suplementos/${editHistSuplemento.id}`, editHistSuplemento)
      setHistSuplementos(histSuplementos.map(h => h.id === editHistSuplemento.id ? response.data : h))
      setEditHistSuplemento(null)
      setSuccess('Registro de suplemento actualizado exitosamente')
      setModalSupl(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Error al actualizar el registro de suplemento')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleDeleteHistAlimento = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/historial_alimentacion/${id}`)
      setHistAlimentos(histAlimentos.filter(h => h.id !== id))
      setSuccess('Registro de alimento eliminado exitosamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Error al eliminar el registro de alimento')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleDeleteHistSuplemento = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/historial_suplementos/${id}`)
      setHistSuplementos(histSuplementos.filter(h => h.id !== id))
      setSuccess('Registro de suplemento eliminado exitosamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Error al eliminar el registro de suplemento')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleAlimentoChange = (e) => {
    const { name, value } = e.target
    setNewHistAlimento(prev => ({ ...prev, [name]: value }))
  }

  const handleSuplementoChange = (e) => {
    const { name, value } = e.target
    setNewHistSuplemento(prev => ({ ...prev, [name]: value }))
  }

  const handleNewAlimentoChange = (e) => {
    const { name, value } = e.target
    setNewAlimento(prev => ({ ...prev, [name]: value }))
  }

  const handleNewSuplementoChange = (e) => {
    const { name, value } = e.target
    setNewSuplemento(prev => ({ ...prev, [name]: value }))
  }

  const handleEditAlimentoChange = (e) => {
    const { name, value } = e.target
    setEditHistAlimento(prev => ({ ...prev, [name]: value }))
  }

  const handleEditSuplementoChange = (e) => {
    const { name, value } = e.target
    setEditHistSuplemento(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <CCard className="mb-5">
        <CCardHeader>
          <CFormSelect onChange={handleBovino} value={selectCowId || ''}>
            <option value="">Seleccione Bovino</option>
            {cows.map(cow => (
              <option key={cow.id} value={cow.id}>{cow.nombre} {cow.raza}</option>
            ))}
          </CFormSelect>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="primary">{success}</CAlert>}
        </CCardBody>
      </CCard>

      <CCard className="mb-5">
        <CCardHeader>
          <div className="d-flex justify-content-center align-items-center">
            <h3>Historial De Alimentación</h3>
          </div>
        </CCardHeader>
        <CCardBody style={{ maxHeight: "300px", overflowY: "auto", padding: 0 }}>
          <CTable hover small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre Bovino</CTableHeaderCell>
                <CTableHeaderCell>Producto</CTableHeaderCell>
                <CTableHeaderCell>Fecha de Uso</CTableHeaderCell>
                <CTableHeaderCell>Etapa Bovino</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Observación</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {histAlimentos.filter(h => h.id_bovino === selectCowId).map(h => (
                <CTableRow key={h.id}>
                  <CTableDataCell>{cows.find(c => c.id === h.id_bovino)?.nombre || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{alimentos.find(a => a.id === h.id_alimento)?.nombre || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{h.fecha}</CTableDataCell>
                  <CTableDataCell>{h.etapa}</CTableDataCell>
                  <CTableDataCell>{h.cantidad}</CTableDataCell>
                  <CTableDataCell>{h.notas || '-'}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" className="me-2" onClick={() => { setEditHistAlimento(h); setModalAlim(true); }}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
            {histAlimentos.filter(h => h.id_bovino === selectCowId).length === 0 && (
                <CAlert color="danger">No Se Encontraron Registros...</CAlert>
            )}
        </CCardBody>
        <CCardFooter className="d-flex justify-content-end">
            <CButton color="primary" onClick={() => setModalNewAlim(true)}>Nuevo Alimento</CButton>
            <CButton color="primary" className="ms-4" onClick={() => setModalAlim(true)} disabled={!selectCowId}>
            + Cargar Registro Alimentos
          </CButton>
        </CCardFooter>
      </CCard>

      <CCard className="mb-5">
        <CCardHeader>
          <div className="d-flex justify-content-center align-items-center">
            <h3>Historial De Suplementos</h3>
          </div>
        </CCardHeader>
        <CCardBody style={{ maxHeight: "300px", overflowY: "auto", padding: 0 }}>
          <CTable hover small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre Bovino</CTableHeaderCell>
                <CTableHeaderCell>Producto</CTableHeaderCell>
                <CTableHeaderCell>Fecha de Uso</CTableHeaderCell>
                <CTableHeaderCell>Dosis</CTableHeaderCell>
                <CTableHeaderCell>Observación</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {histSuplementos.filter(h => h.id_bovino === selectCowId).map(h => (
                <CTableRow key={h.id}>
                  <CTableDataCell>{cows.find(c => c.id === h.id_bovino)?.nombre || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{suplementos.find(s => s.id === h.id_suplemento)?.nombre || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{h.fecha}</CTableDataCell>
                  <CTableDataCell>{h.dosis}</CTableDataCell>
                  <CTableDataCell>{h.notas || '-'}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" className="me-2" onClick={() => { setEditHistSuplemento(h); setModalSupl(true); }}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
           {histSuplementos.filter(h => h.id_bovino === selectCowId).length === 0 && (
                <CAlert color="danger">No Se Encontraron Registros...</CAlert>
            )}
        </CCardBody>
        <CCardFooter className="d-flex justify-content-end">
            <CButton color="primary" onClick={() => setModalNewSupl(true)}>Nuevo Suplemento</CButton>
            <CButton color="primary" className='ms-4' onClick={() => setModalSupl(true)} disabled={!selectCowId}>
            + Cargar Registro Suplementos
          </CButton>
        </CCardFooter>
      </CCard>

    <CModal visible={modalNewAlim} onClose={() => setModalNewAlim(false)}>
        <CModalHeader>
            <CModalTitle>Nuevo Alimento</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CForm onSubmit={handleAddAlimento}>
                <CFormInput type="text" name="nombre" value={newAlimento.nombre} onChange={handleNewAlimentoChange} label="Nombre" className="mb-3" required/>
                <CFormInput type="text" name="descripcion" value={newAlimento.descripcion} onChange={handleNewAlimentoChange} label="Descripción" className="mb-3"/>
                <CFormSelect name="tipo" value={newAlimento.tipo} onChange={handleNewAlimentoChange} label="Tipo" className="mb-3" required>
                    <option value="">Seleccione Tipo</option>
                    <option value="Forraje">Forraje</option>
                    <option value="Concentrado">Concentrado</option>
                    <option value="Silaje">Silaje</option>
                    <option value="Otros">Otros</option>
                </CFormSelect>
                <CFormSelect name="unidad" value={newAlimento.unidad} onChange={handleNewAlimentoChange} label="Unidad" className="mb-3" required>
                    <option value="">Seleccione Unidad</option>
                    <option value="Kilogramos">Kilogramos</option>
                    <option value="Litros">Litros</option>
                    <option value="Unidades">Unidades</option>
                </CFormSelect>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalNewAlim(false)}>Cancelar</CButton>
                    <CButton color="primary" type="submit">Guardar</CButton>
                </CModalFooter>
            </CForm>
        </CModalBody>
    </CModal>

    <CModal visible={modalNewSupl} onClose={() => setModalNewSupl(false)}>
        <CModalHeader>
            <CModalTitle>Nuevo Suplemento</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CForm onSubmit={handleAddSuplemento}>
                <CFormInput type="text" name="nombre" value={newSuplemento.nombre} onChange={handleNewSuplementoChange} label="Nombre" className="mb-3" required/>
                <CFormInput type="text" name="descripcion" value={newSuplemento.descripcion} onChange={handleNewSuplementoChange} label="Descripción" className="mb-3"/>
                <CFormSelect name="tipo" value={newSuplemento.tipo} onChange={handleNewSuplementoChange} label="Tipo" className="mb-3" required>
                    <option value="">Seleccione Tipo</option>
                    <option value="Vitamínico">Vitamínico</option>
                    <option value="Mineral">Mineral</option>
                    <option value="Energético">Energético</option>
                    <option value="Otros">Otros</option>
                </CFormSelect>
                <CFormSelect name="unidad" value={newSuplemento.unidad} onChange={handleNewSuplementoChange} label="Unidad" className="mb-3" required>
                    <option value="">Seleccione Unidad</option>
                    <option value="Gramos">Gramos</option>
                    <option value="Mililitros">Mililitros</option>
                    <option value="Unidades">Unidades</option>
                </CFormSelect>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalNewSupl(false)}>Cancelar</CButton>
                    <CButton color="primary" type="submit">Guardar</CButton>
                </CModalFooter>
            </CForm>
        </CModalBody>
    </CModal>

      <CModal visible={modalAlim} onClose={() => { setModalAlim(false); setEditHistAlimento(null); }}>
        <CModalHeader>
          <CModalTitle>{editHistAlimento ? 'Editar' : 'Agregar'} Registro de Alimento</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={editHistAlimento ? handleEditHistAlimento : handleAddHistAlimento}>
            <CFormSelect name="id_alimento" value={editHistAlimento ? editHistAlimento.id_alimento : newHistAlimento.id_alimento || ''} onChange={editHistAlimento ? handleEditAlimentoChange : handleAlimentoChange} label="Alimento" className="mb-3" required>
              <option value="">Seleccione Alimento</option>
              {alimentos.map(alimento => (
                <option key={alimento.id} value={alimento.id}>{alimento.nombre}</option>
                ))}
            </CFormSelect>
            <CFormInput type="date" name="fecha" value={editHistAlimento ? editHistAlimento.fecha : newHistAlimento.fecha} onChange={editHistAlimento ? handleEditAlimentoChange : handleAlimentoChange} label="Fecha" className="mb-3" required/>
            <CFormSelect name="etapa" value={editHistAlimento ? editHistAlimento.etapa : newHistAlimento.etapa} onChange={editHistAlimento ? handleEditAlimentoChange : handleAlimentoChange} label="Etapa" className="mb-3" required>
              <option value="">Seleccione Etapa</option>
              <option value="Ternero">Ternero</option>
              <option value="Crecimiento">Crecimiento</option>
              <option value="Engorde">Engorde</option>
              <option value="Producción">Producción</option>
            </CFormSelect>
            <CFormInput type="number" name="cantidad" value={editHistAlimento ? editHistAlimento.cantidad : newHistAlimento.cantidad} onChange={editHistAlimento ? handleEditAlimentoChange : handleAlimentoChange} label="Cantidad" className="mb-3" required/>
            <CFormInput type="text" name="notas" value={editHistAlimento ? editHistAlimento.notas : newHistAlimento.notas} onChange={editHistAlimento ? handleEditAlimentoChange : handleAlimentoChange} label="Notas" className="mb-3"/>
            <CModalFooter>
              <CButton color="secondary" onClick={() => { setModalAlim(false); setEditHistAlimento(null); }}>
                Cancelar
              </CButton>
              <CButton color="primary" type="submit">Guardar</CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      <CModal visible={modalSupl} onClose={() => { setModalSupl(false); setEditHistSuplemento(null); }}>
        <CModalHeader>
          <CModalTitle>{editHistSuplemento ? 'Editar' : 'Agregar'} Registro de Suplemento</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={editHistSuplemento ? handleEditHistSuplemento : handleAddHistSuplemento}>
            <CFormSelect name="id_suplemento" value={editHistSuplemento ? editHistSuplemento.id_suplemento : newHistSuplemento.id_suplemento || ''} onChange={editHistSuplemento ? handleEditSuplementoChange : handleSuplementoChange} label="Suplemento" className="mb-3" required>
              <option value="">Seleccione Suplemento</option>
              {suplementos.map(suplemento => (
                <option key={suplemento.id} value={suplemento.id}>{suplemento.nombre}</option>
              ))}
            </CFormSelect>
            <CFormInput type="date" name="fecha" value={editHistSuplemento ? editHistSuplemento.fecha : newHistSuplemento.fecha} onChange={editHistSuplemento ? handleEditSuplementoChange : handleSuplementoChange} label="Fecha" className="mb-3" required/>
            <CFormInput type="number"name="dosis"value={editHistSuplemento ? editHistSuplemento.dosis : newHistSuplemento.dosis} onChange={editHistSuplemento ? handleEditSuplementoChange : handleSuplementoChange} label="Dosis" className="mb-3" required/>
            <CFormInput ntype="text" name="notas" value={editHistSuplemento ? editHistSuplemento.notas : newHistSuplemento.notas} onChange={editHistSuplemento ? handleEditSuplementoChange : handleSuplementoChange} label="Notas" className="mb-3"/>
            <CModalFooter>
              <CButton color="secondary" onClick={() => { setModalSupl(false); setEditHistSuplemento(null); }}>
                Cancelar
              </CButton>
              <CButton color="primary" type="submit">Guardar</CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Alimentacion