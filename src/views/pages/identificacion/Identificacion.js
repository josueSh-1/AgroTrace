import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CAlert, CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormInput, CFormSelect, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from "@coreui/react";
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import QRCode from 'react-qr-code'

const Identificacion=()=>{
    const [search, setSearch]=useState('')
    const [cows,setCows]=useState([])
    const [newCow,setNewCow]=useState({
        nombre:'',
        raza:'',
        fecha_nacimiento:'',
        estado:'',
        sexo:'',
        id_madre:'',
        id_padre:'',
        fecha_registro:'',
        foto_bovino:'',
        cloud_id:''
    })
    const [qr,setQr]=useState(null)
    const [updateCow, setUpdateCow]=useState({})
    const [selectCow, setSelectCow]=useState({})
    const [createModal, setCreateModal]=useState(false)
    const [updateModal,setUpdateModal]=useState(false)
    const [deleteModal,setDeleteModal]=useState(false)
    const [chowModal, setChowModal]=useState(false)
    const [error,setError]=useState('')
    const [succes,setSucces]=useState('')
    const CLOUD_NAME = 'dqswxffsv'
    const UPLOAD_PRESET = 'bovinoPicture_unsign'

    useEffect(()=>{
        async function fetchData() {
            try{
                const response = await axios.get('http://localhost:5000/bovinos')
                setCows(response.data)
            }catch{
                setError('Error Al Cargar La Informacion...')
            }   
        }
        fetchData()
     },[])

    const handleImage=async(e)=>{
        const file =  e.target.files[0]
        if(!file){return}
        if (file.size > 5 * 1024 * 1024){ 
            setError('La imagen excede 5MB.')
            return
        }
        try{
            const newData = new FormData()
            newData.append('file',file)
            newData.append('upload_preset',UPLOAD_PRESET)
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,newData)
            const {secure_url, public_id}=response.data
            setNewCow({...newCow, foto_bovino: secure_url, cloud_id: public_id})
        }catch{
            setError('Error Cargando La Imagen')
        }
    }

    const handleCreateCow=async(e)=>{
        e.preventDefault()
        try{
            const cowData = {...newCow}
            const response= await axios.post('http://localhost:5000/bovinos',cowData)
            const responseGet= await axios.get('http://localhost:5000/bovinos')
    
            setCows(responseGet.data)
            setNewCow({
                nombre:'',
                raza:'',
                fecha_nacimiento:'',
                estado:'',
                sexo:'',
                id_madre:'',
                id_padre:'',
                fecha_registro:'',
                foto_bovino:'',
                cloud_id:''
            })
            setQr(response.data.id)
            setSucces('Nuevo Bovino Agregado...')
        }catch{
            setError('Erro Al Agregar Un Nuevo Bovino...')
        }
    }
    const razas = ["Brahman","Nelore","Lucerna","Braunvieh","Pardo Suizo","Simmental","Holstein","Limonero",'Carora'];
    const searching = cows.filter(cow=>
        cow.nombre.toLowerCase().includes(search.toLowerCase())
    )
    return(
        <div>
            <CCard>
                <CCardHeader>
                    <div className="d-flex justify-content-center">
                        <CForm>
                            <CInputGroupText>
                                <CIcon icon={cilSearch} size="lg"/>
                                <CFormInput placeholder="Buscar Bovino..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
                            </CInputGroupText>
                        </CForm>
                    </div>
                </CCardHeader>
                <CCardBody>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="g-5" style={{cursor:'pointer'}}>
                        <CCol xs>
                            <CCard onClick={()=>setCreateModal(true)}>
                                <CCardHeader><h4>Agregar Un Bovino</h4></CCardHeader>
                                <CCardBody>
                                    <h1>+</h1>
                                </CCardBody>
                                <CCardFooter>
                                </CCardFooter>
                            </CCard>
                        </CCol>
                        {searching.map((cow)=>
                            <CCol>
                                <CCard>
                                    <CCardHeader>
                                    </CCardHeader>
                                    <CCardBody>
                                    </CCardBody>
                                    <CCardFooter>
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        )}
                    </CRow>
                </CCardBody>
            </CCard>
            <CModal visible={createModal} onClose={() => setCreateModal(false)}>
                <CModalHeader><h3>Agregar Un Bovino</h3></CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleCreateCow}>
                        <CFormInput label="Nombre" placeholder="Nombre..." value={newCow.nombre} onChange={(e) => setNewCow({ ...newCow, nombre: e.target.value })} className="mb-3"/>
                        <CFormSelect label="Raza" value={newCow.raza} onChange={(e) => setNewCow({ ...newCow, raza: e.target.value })} className="mb-3">
                            <option value="">Seleccione Una Raza</option>
                            {razas.sort().map((raza, ind) => (
                                <option key={ind} value={raza}>
                                    {raza}
                                </option>
                            ))}
                        </CFormSelect>
                        <CFormInput label="Fecha de Nacimiento" type="date" value={newCow.fecha_nacimiento} onChange={(e) => setNewCow({ ...newCow, fecha_nacimiento: e.target.value })} className="mb-3"/>
                        <CFormSelect label="Estado" value={newCow.estado} onChange={(e) => setNewCow({ ...newCow, estado: e.target.value })} className="mb-3">
                            <option value="">Seleccione Estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Vendido">Vendido</option>
                            <option value="Muerto">Muerto</option>
                        </CFormSelect>
                        <CFormSelect label="Sexo" value={newCow.sexo} onChange={(e) => setNewCow({ ...newCow, sexo: e.target.value })} className="mb-3">
                            <option value="">Seleccione Sexo</option>
                            <option value="Macho">Macho</option>
                            <option value="Hembra">Hembra</option>
                        </CFormSelect>
                        <CFormSelect label="Madre" value={newCow.id_madre} onChange={(e) => setNewCow({ ...newCow, id_madre: e.target.value })} className="mb-3">
                            <option value="">Seleccione Madre</option>
                            {cows.sort().filter((bovino)=>bovino.sexo==='Hembra').map((bovino) => (
                                <option key={bovino.id} value={bovino.id}>
                                    {bovino.nombre}
                                </option>
                            ))}
                        </CFormSelect>
                        <CFormSelect label="Padre" value={newCow.id_padre} onChange={(e) => setNewCow({ ...newCow, id_padre: e.target.value })} className="mb-3">
                            <option value="">Seleccione Padre</option>
                            {cows.sort().filter((bovino)=>bovino.sexo==='Macho').map((bovino) => (
                                <option key={bovino.id} value={bovino.id}>
                                    {bovino.nombre}
                                </option>
                            ))}
                        </CFormSelect>
                        <CFormInput label="Fecha de Registro" type="date" value={newCow.fecha_registro} onChange={(e) => setNewCow({ ...newCow, fecha_registro: e.target.value })} className="mb-3"/>
                        <div className="mb-3">
                            <label >Foto Del Bovino</label>
                            <CFormInput
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                            />
                            {newCow.foto_bovino && (
                                <div style={{ marginTop: 8 }}>
                                    <img src={newCow.foto_bovino} alt="Bovino" style={{ maxWidth: '100%', borderRadius: 8 }} />
                                </div>
                            )}
                        </div>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setCreateModal(false)}>Cerrar</CButton>
                    <CButton color="primary" type="submit" onClick={handleCreateCow}>Guardar</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={updateModal} onClose={()=>setUpdateModal(false)}>

            </CModal>
            <CModal visible={deleteModal} onClose={()=>setDeleteModal(false)}>

            </CModal>
            <CModal visible={chowModal} onClose={()=>setChowModal(false)}>
                <CModalHeader>

                </CModalHeader>
                <CModalBody>
                    {qr && (
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <h5>QR del Bovino ID: {qr}</h5>
                            <QRCode value={`http://localhost:5000/bovino/${qr}`} size={200} />
                        </div>
                    )}
                </CModalBody>
            </CModal>
        </div>
    )
}

export default Identificacion