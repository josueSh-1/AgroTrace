import { useParams } from 'react-router-dom';
import react, { useState, useEffect } from 'react';
import axios from 'axios';
import { CCard, CCol, CRow,CImage } from '@coreui/react';


const QrShowData=()=>{
    const { id } = useParams();
    const [cow, setCow]=useState({})
    const [cowAlimentacion, setCowAlimentacion]=useState({})
    const [cowSuplementos, setCowSuplementos]=useState({})
    const [cowEnfermedades,setCowEnfermedades]=useState({})
    const [cowAlergias,setCowAlergias]=useState({})
    const [cowVacunas,setCowVacunas]=useState({})
    const [cowTratamientos,setCowTratamientos]=useState({})
    const [cowLactancias,setCowLactancias]=useState({})
    const [error,setError]=useState('')
    const ngrok = 'http://:5000'
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseBov = await axios.get(`${ngrok}/bovinos/${id}`);
                const responsehAl = await axios.get(`${ngrok}/historial_alimentacion?id_bovino=${id}`);
                const responsehSp = await axios.get(`${ngrok}/historial_suplementos?id_bovino=${id}`);
                const responsehEn = await axios.get(`${ngrok}/historial_enfermedades?id_bovino=${id}`);
                const responsehAlg = await axios.get(`${ngrok}/historial_alergias?id_bovino=${id}`);
                const responsehVa = await axios.get(`${ngrok}/historial_vacunas?id_bovino=${id}`);
                const responsehTr = await axios.get(`${ngrok}/historial_tratamientos?id_bovino=${id}`);
                const responsehLa = await axios.get(`${ngrok}/historial_lactancias?id_bovino=${id}`);

                setCow(responseBov.data);
                setCowAlimentacion(responsehAl.data);
                setCowSuplementos(responsehSp.data);
                setCowEnfermedades(responsehEn.data);
                setCowAlergias(responsehAlg.data);
                setCowVacunas(responsehVa.data);
                setCowTratamientos(responsehTr.data);
                setCowLactancias(responsehLa.data);
            }catch{
                setError('Error Cargando La Informacion...')
            }
        }
        fetchData()
    }, [id]);


    return(
        <div>
            {cow && (
                <div>
                    <CCard>
                        <CRow className='mb-2 mt-2'>
                            <CCol>
                                <div className="d-flex justify-content-center aling-items-center ">
                                    <CImage src={cow.foto_bovino} className="border border-3 border-primary" style={{ width: '180px', height: '180px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>
                                </div>
                            </CCol>
                            <CCol>
                                <h4>Bovino: {cow.nombre} {cow.raza}</h4>
                                <h6>Nacimiento: {cow.fecha_nacimiento}</h6>
                                <h6>Sexo: {cow.sexo}</h6>
                                <h6>Estado: {cow.estado}</h6>
                                <h6>Registro: {cow.fecha_registro}</h6>
                            </CCol>
                        </CRow>
                    </CCard>
                    <CCard>

                    </CCard>
                </div>
            )}
        </div>
    )
}

export default QrShowData