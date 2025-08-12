import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CAlert, CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm, CFormCheck, CFormSelect, CInputGroupText, CModal, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"

const Alimentacion=()=>{

    const [cows,setCows]=useState([])
    const [selectCowId,setSelectCowId]=useState(null)
    const [alimentos,setAlimentos]=useState([])
    const [newAlimento, setNewAlimento]=useState({
        nombre: '',
        descripcion: '',
        tipo: '', 
        unidad: ''
    })
    const [suplementos,setSuplementos]=useState([])
    const [newSuplmento,setNewSuplemento]=useState({
        nombre: '',
        descripcion: '',
        tipo: '', 
        unidad: ''
    })
    const [histAlimentos, setHistAlimentos]=useState([])
    const [newHistAlimento, setNewHistAlimento] = useState({
        id_bovino: null,
        id_alimento: null,
        fecha: '',
        etapa: '',
        cantidad: 0,
        notas: '',
    })
    const [histSuplementos, setHistSuplementos]=useState([])
    const [newHistSuplemento, setNewHistSuplemento] = useState({
        id_bovino: null,
        id_suplemento: null,
        fecha: '',
        dosis: 0,
        notas: '',
    })
    const [modalAlim,setModalAlim]=useState(false)
    const [modalSupl,setModalSupl]=useState(false)
    const [search,setSearch]=useState('')
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')

    useEffect(()=>{
        async function fetchData() {
            try{
                const responseBov = await axios.get('http://localhost:5000/bovino')
                const responseAl =  await axios.get('http://localhost:5000/alimentos')
                const responseSupl = await axios.get('http://localhost:5000/suplementos')
                const responseHistAl = await axios.get('http://localhost:5000/historial_alimentacion')
                const responseHistSupl = await axios.get('http://localhost:5000/historial_suplementos')
                setCows(responseBov.data)
                setAlimentos(responseAl.data)
                setSuplementos(responseSupl.data)
                setHistAlimentos(responseHistAl.data)
                setHistSuplementos(responseHistSupl.data)
            }catch{
                setError('Error Cargando Los Datos...')
            }
        }
        fetchData()
    },[])

    const handleBovino=()=>{

    }


    return(
        <div>
            <CCard className="mb-5">
                <CCardHeader>
                    <CFormSelect onChange={handleBovino} value={selectCowId}>
                        <option value=" ">Seleccione</option>
                        {cows.map(cow=>(
                            <option value={cow.id}>{cow.nombre} {cow.raza}</option>
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
                    <div className="d-flex justify-content-center">
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
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {histAlimentos.filter(h => h.id_bovino === selectCowId).map(h => (
                                <CTableRow key={h.id}>
                                    <CTableDataCell>
                                        {cows.find(c => c.id === h.id_bovino)?.nombre || 'N/A'}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {alimentos.find(a => a.id_alimento === h.id_alimento)?.nombre || 'N/A'}
                                    </CTableDataCell>
                                    <CTableDataCell>{h.fecha_inicio}</CTableDataCell>
                                    <CTableDataCell>{h.etapa}</CTableDataCell>
                                    <CTableDataCell>{h.cantidad}</CTableDataCell>
                                    <CTableDataCell>{h.notas || '-'}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
                <CCardFooter className="d-flex justify-content-end">
                    <CButton color="primary" onClick={()=>setModalAlim(true)}>+ Cargar Registro Alimentos</CButton>
                </CCardFooter>
            </CCard>
            
            <CCard className="mb-5">
                <CCardHeader>
                    <div className="d-flex justify-content-center">
                        <h3>Historial De Suplementos</h3>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CTable>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Nombre Bovino</CTableHeaderCell><CTableHeaderCell>Producto</CTableHeaderCell><CTableHeaderCell>Fecha de Uso</CTableHeaderCell><CTableHeaderCell>Dosis</CTableHeaderCell><CTableHeaderCell>Observacion</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {!histSuplementos && (
                                <p>No Se Encontraron Datos Del Bovino...</p>
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>
                <CCardFooter className="d-flex justify-content-end">
                    <CButton color="primary" onClick={()=>setModalSupl(true)}>+ Cargar Registro Suplementos</CButton>
                </CCardFooter>
            </CCard>

            <CModal visible={modalAlim} onClose={()=>setModalAlim(false)}>

            </CModal>

            <CModal visible={modalSupl} onClose={()=>setModalSupl(false)}>

            </CModal>
        </div>
    )
}

export default Alimentacion