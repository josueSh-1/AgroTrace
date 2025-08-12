import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CAlert, CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCardImage, CCol, CForm, CFormInput, CFormSelect, CImage, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from "@coreui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCode from 'react-qr-code'

const Identificacion=()=>{

    function formatDate(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d)) return dateString;
        return d.toISOString().slice(0, 10);
    }

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
    const [copySelect, setCopySelect]=useState({})
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
            setSucces('Nuevo Bovino Agregado...')
        }catch{
            setError('Erro Al Agregar Un Nuevo Bovino...')
        }
    }

    const handleShowInfo=(cow)=>{
        setChowModal(true)
        setSelectCow(cow)
        setQr(cow.id)
    }

    const handleDeleteAction=async(id)=>{
        if(!id){return}
        try{
            await axios.delete(`http://localhost:5000/bovinos/${id}`)
            setCows(prev=>prev.filter(cow=>cow.id!==id))
            setDeleteModal(false)
            setSelectCow({})
            setQr(null)
            setSucces('Eliminacion Completada...')
        }catch{
            setError('Error Eliminando Al Bovino...')
            setDeleteModal(false)
        }
    }

    const handleUpdateAction=async(id)=>{
        try{
            await axios.put(`http://localhost:5000/bovinos/${id}`,selectCow)
            const response = await axios.get('http://localhost:5000/bovinos')
            setCows(response.data)
            setUpdateModal(false)
            setSucces('Bovino Actualizado Correctamente...')
            setSelectCow({})
        }catch{
            setError('Error Actualizando El Bovino...')
            setUpdateModal(false)
        }
    }

    const handleQRDownload=(qrid)=>{
        if(!qrid){return}
        const svgElement = document.querySelector('#qr_Download svg')
        if(!svgElement){return}

        const svgData= new XMLSerializer().serializeToString(svgElement)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const imagen = new Image()
        imagen.onload=()=>{
            canvas.width = imagen.width;
            canvas.height = imagen.height;
            ctx.drawImage(imagen, 0, 0);
            const png = canvas.toDataURL('image/png');

            const download = document.createElement('a');
            download.download = `Bovino_${qrid}_QR.png`;
            download.href = png;
            download.click();
        }
        const base64Data = btoa(encodeURIComponent(svgData).replace(/%([0-9A-F]{2})/g,(_, p1) => String.fromCharCode(parseInt(p1, 16))));
        imagen.src = `data:image/svg+xml;base64,${base64Data}`
    }


    const razas = ["Brahman","Nelore","Lucerna","Braunvieh","Pardo Suizo","Simmental","Holstein","Limonero",'Carora'];
    const searching = cows.filter(cow=>
        cow.nombre.toLowerCase().includes(search.toLowerCase())
    )
    const madre = cows.find(cow=>cow.id===selectCow.id_madre)
    const padre = cows.find(cow=>cow.id===selectCow.id_padre)

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
                    {succes && <CAlert color="primary">{succes}</CAlert>}
                    <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="g-5">
                        <CCol xs>
                            <CCard onClick={()=>setCreateModal(true)} style={{cursor:'pointer'}}>
                                <CCardHeader><h4>Agregar Un Bovino</h4></CCardHeader>
                                <CCardBody>
                                    <h1>+</h1>
                                </CCardBody>
                                <CCardFooter>
                                </CCardFooter>
                            </CCard>
                        </CCol>
                        {searching.map((cow)=>
                            <CCol xs key={cow.id}>
                                <CCard onClick={()=>handleShowInfo(cow)} style={{cursor:'pointer'}}>
                                    <CCardHeader>
                                        <h4>{cow.nombre}</h4>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CCardImage src={cow.foto_bovino} style={{ height: '200px', objectFit: 'cover' }}/>
                                    </CCardBody>
                                    <CCardFooter>
                                        <small className="text-body-secondary">Fecha de Registro: {formatDate(cow.fecha_registro)}</small>
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
                <CCard>
                    <CCardHeader>
                        <h4>Editando La Informacion De: {selectCow.nombre}</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CForm>
                        <CFormInput label="Nombre" placeholder="Nombre..." value={selectCow.nombre} onChange={(e) => setSelectCow({ ...selectCow, nombre: e.target.value })} className="mb-3"/>
                        <CFormSelect label="Raza" value={selectCow.raza} onChange={(e) => setSelectCow({ ...selectCow, raza: e.target.value })} className="mb-3">
                            <option value="">Seleccione Una Raza</option>
                            {razas.sort().map((raza, ind) => (
                                <option key={ind} value={raza}>
                                    {raza}
                                </option>
                            ))}
                        </CFormSelect>
                        <CFormInput label="Fecha de Nacimiento" type="date" value={selectCow.fecha_nacimiento} onChange={(e) => setSelectCow({ ...selectCow, fecha_nacimiento: e.target.value })} className="mb-3"/>
                        <CFormSelect label="Estado" value={selectCow.estado} onChange={(e) => setSelectCow({ ...selectCow, estado: e.target.value })} className="mb-3">
                            <option value="">Seleccione Estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Vendido">Vendido</option>
                            <option value="Muerto">Muerto</option>
                        </CFormSelect>
                        <CFormSelect label="Sexo" value={selectCow.sexo} onChange={(e) => setSelectCow({ ...selectCow, sexo: e.target.value })} className="mb-3">
                            <option value="">Seleccione Sexo</option>
                            <option value="Macho">Macho</option>
                            <option value="Hembra">Hembra</option>
                        </CFormSelect>
                        <CFormSelect label="Madre" value={selectCow.id_madre} onChange={(e) => setSelectCow({ ...selectCow, id_madre: e.target.value })} className="mb-3">
                            <option value="">Seleccione Madre</option>
                            {cows.sort().filter((bovino)=>bovino.sexo==='Hembra').map((bovino) => (
                                <option key={bovino.id} value={bovino.id}>
                                    {bovino.nombre}
                                </option>
                            ))}
                        </CFormSelect>
                        <CFormSelect label="Padre" value={selectCow.id_padre} onChange={(e) => setSelectCow({ ...selectCow, id_padre: e.target.value })} className="mb-3">
                            <option value="">Seleccione Padre</option>
                            {cows.sort().filter((bovino)=>bovino.sexo==='Macho').map((bovino) => (
                                <option key={bovino.id} value={bovino.id}>
                                    {bovino.nombre}
                                </option>
                            ))}
                        </CFormSelect>
                        <CFormInput label="Fecha de Registro" type="date" value={selectCow.fecha_registro} onChange={(e) => setSelectCow({ ...selectCow, fecha_registro: e.target.value })} className="mb-3"/>
                    </CForm>
                    </CCardBody>
                    <CCardFooter>
                        <CButton onClick={()=>handleUpdateAction(selectCow.id)}>Guardar</CButton>
                    </CCardFooter>
                </CCard>
            </CModal>

            <CModal visible={deleteModal} onClose={()=>setDeleteModal(false)}>
                <CCard>
                    <CCardHeader>
                        <h4>¿Desea Eliminar Este Bovino?</h4>
                    </CCardHeader>
                    <CCardBody>
                        {selectCow && (
                             <div className="text-center px-4 py-3">
                                <div className="mb-4">
                                    <CImage src={selectCow.foto_bovino} className="rounded-circle border border-3 border-danger" style={{ width: '150px', height: '150px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
                                </div>
                                <div>
                                    <h5 className="mb-3">{selectCow.nombre}</h5>
                                </div>
                                <CAlert color="warning" className="mt-3">
                                    Esta Accion Eliminara Completamente Al Bovino <strong>{selectCow.nombre}</strong>. 
                                </CAlert>
                             </div>
                        )}
                    </CCardBody>
                    <CCardFooter>
                        <CButton onClick={()=>handleDeleteAction(selectCow.id)}>Eliminar</CButton>
                    </CCardFooter>
                </CCard>
            </CModal>

            <CModal visible={chowModal} onClose={()=>setChowModal(false)} alignment="center">
                <CModalHeader>
                    <h4>Informacion De {selectCow.nombre}</h4>
                </CModalHeader>
                <CModalBody>
                    {selectCow && (
                        <div className="text-center px-4 py-3">
                            <div className="mb-4">
                                <CImage src={selectCow.foto_bovino} className="rounded-circle border border-3 border-primary" style={{ width: '180px', height: '180px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>
                            </div>
                            <div>
                                <h4 className="mb-4"> {selectCow.nombre} </h4>
                            </div>
                            <div className="text-start mx-auto" style={{ maxWidth: '400px' }}>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="fw-bold">Raza:</span>
                                    <p>{selectCow.raza}</p>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="fw-bold">Estado:</span>
                                    <p>{selectCow.estado}</p>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="fw-bold">Sexo:</span>
                                    <p>{selectCow.sexo}</p>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="fw-bold">Fecha Nacimiento:</span>
                                    <p>{formatDate(selectCow.fecha_nacimiento)}</p>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="fw-bold">Madre:</span>
                                    <p>{madre ? madre.nombre : 'Desconocida'}</p>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="fw-bold">Padre:</span>
                                    <p>{padre ? padre.nombre : 'Desconocido'}</p>
                                </div>
                                <div className="mt-3">
                                    <h6 className="fw-bold">Fecha de Registro:</h6>
                                    <p className="text-muted">
                                        {formatDate(selectCow.fecha_registro)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {qr && (
                        <div id="qr_Download" style={{ textAlign: 'center', marginTop: 20 }}>
                            <h5>QR del Bovino ID: {qr}</h5>
                            <QRCode value={`http://localhost:5000/bovino/${qr}`} size={200} />
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton onClick={()=>setUpdateModal(true)}>Editar</CButton>
                    <CButton onClick={()=>setDeleteModal(true)}>Eliminar</CButton>
                    <CButton onClick={()=>handleQRDownload(qr)}>Descargar QR</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default Identificacion