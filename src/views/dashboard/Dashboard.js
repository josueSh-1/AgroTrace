import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
  CWidgetStatsB,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilChartLine,
  cilSpeedometer,
  cilBell,
  cilShieldAlt,
  cilCheckCircle,
  cilWarning,
  cilNotes,
} from '@coreui/icons'

const Dashboard = () => {
  const [data, setData] = useState({
    bovinos: [],
    lactancias: [],
    historial_lactancias: [],
    tratamientos: [],
    vacunas: [],
    enfermedades: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db.json')
        const jsonData = await response.json()
        setData(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const totalAnimals = data.bovinos?.length || 0
  const totalLactancias = data.lactancias?.length || 0
  const lactanciasActivas = data.lactancias?.filter((l) => l.estado === 'activa')?.length || 0
  const produccionTotal = data.historial_lactancias?.reduce((acc, item) => acc + (item.cantidad || 0), 0) || 0
  const promedioProduccion =
    data.historial_lactancias?.length > 0
      ? (produccionTotal / data.historial_lactancias.length).toFixed(1)
      : 0
  const tratamientosActivos = data.tratamientos?.filter((t) => t.estado === 'activo')?.length || 0
  const vacunasAplicadas = data.vacunas?.length || 0
  const enfermedadesActivas = data.enfermedades?.filter((e) => e.estado === 'activa')?.length || 0

  const ultimosRegistros = data.historial_lactancias?.slice(-5).reverse() || []

  return (
    <>
      {/* Header Colorido */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard 
            className="text-center" 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }}
          >
            <CCardBody className="py-4">
              <h1 style={{ 
                color: '#ffffff', 
                fontWeight: 'bold', 
                fontSize: '2.5rem',
                marginBottom: '0.5rem'
              }}>
                Bienvenido a AgroTrace
              </h1>
              <p style={{ 
                color: '#ffffff', 
                fontSize: '1.2rem',
                margin: 0,
                opacity: 0.9
              }}>
                Sistema integral de gestión ganadera inteligente
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* KPI Cards con Colores Vibrantes */}
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6} md={3}>
          <CWidgetStatsA
            color="info"
            title="🐮 Total de Animales"
            value={totalAnimals}
            action={<CIcon icon={cilPeople} height={32} />}
            style={{ 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(23,162,184,0.3)',
              border: 'none'
            }}
          />
        </CCol>
        <CCol sm={6} md={3}>
          <CWidgetStatsA
            color="success"
            title="🥛 Producción Total (L)"
            value={produccionTotal.toFixed(1)}
            action={<CIcon icon={cilChartLine} height={32} />}
            style={{ 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(40,167,69,0.3)',
              border: 'none'
            }}
          />
        </CCol>
        <CCol sm={6} md={3}>
          <CWidgetStatsA
            color="warning"
            title="📊 Promedio por Animal (L)"
            value={promedioProduccion}
            action={<CIcon icon={cilSpeedometer} height={32} />}
            style={{ 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(255,193,7,0.3)',
              border: 'none'
            }}
          />
        </CCol>
        <CCol sm={6} md={3}>
          <CWidgetStatsA
            color="danger"
            title="🔔 Lactancias Activas"
            value={lactanciasActivas}
            action={<CIcon icon={cilBell} height={32} />}
            style={{ 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(220,53,69,0.3)',
              border: 'none'
            }}
          />
        </CCol>
      </CRow>

      {/* Cards de Módulos con Colores Específicos */}
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6} md={4}>
          <CWidgetStatsB
            color="info"
            title="💉 Vacunas Aplicadas"
            value={vacunasAplicadas}
            icon={<CIcon icon={cilShieldAlt} height={40} />}
            style={{ 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
              border: 'none'
            }}
          />
        </CCol>
        <CCol sm={6} md={4}>
          <CWidgetStatsB
            color="success"
            title="💊 Tratamientos Activos"
            value={tratamientosActivos}
            icon={<CIcon icon={cilCheckCircle} height={40} />}
            style={{ 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(40,167,69,0.3)',
              border: 'none'
            }}
          />
        </CCol>
        <CCol sm={6} md={4}>
          <CWidgetStatsB
            color="warning"
            title="⚠️ Enfermedades Activas"
            value={enfermedadesActivas}
            icon={<CIcon icon={cilWarning} height={40} />}
            style={{ 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(255,193,7,0.3)',
              border: 'none'
            }}
          />
        </CCol>
      </CRow>

      {/* Tabla de Producción con Diseño Mejorado */}
      <CRow>
        <CCol xs={12}>
          <CCard 
            style={{ 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          >
            <CCardHeader 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                borderRadius: '15px 15px 0 0',
                border: 'none',
                padding: '1.5rem'
              }}
            >
              <h5 style={{ margin: 0, fontWeight: 'bold' }}>
                📋 Últimos Registros de Producción
              </h5>
            </CCardHeader>
            <CCardBody style={{ padding: '0' }}>
              {ultimosRegistros.length > 0 ? (
                <CTable hover responsive style={{ margin: 0 }}>
                  <CTableHead style={{ backgroundColor: '#info' }}>
                    <CTableRow>
                      <CTableHeaderCell style={{ 
                        color: '#FFFFFF', 
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '1rem'
                      }}>
                        🐄 Bovino ID
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ 
                        color: '#FFFFFF', 
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '1rem'
                      }}>
                        📅 Fecha
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ 
                        color: '#FFFFFF', 
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '1rem'
                      }}>
                        🥛 Cantidad (L)
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ 
                        color: '#FFFFFF', 
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '1rem'
                      }}>
                        🧪 Grasa (%)
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ 
                        color: '#FFFFFF', 
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '1rem'
                      }}>
                        🧬 Proteína (%)
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {ultimosRegistros.map((registro, index) => (
                      <CTableRow key={registro.id} style={{ 
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                      }}>
                        <CTableDataCell style={{ 
                          color: '#FFFFFF',
                          padding: '1rem',
                          border: 'none'
                        }}>
                          <CBadge color="info" style={{ fontSize: '0.9rem' }}>
                            {registro.bovinoId}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell style={{ 
                          color: '#FFFFFF',
                          padding: '1rem',
                          border: 'none'
                        }}>
                          {new Date(registro.fecha).toLocaleDateString('es-ES')}
                        </CTableDataCell>
                        <CTableDataCell style={{ 
                          color: '#FFFFFF',
                          padding: '1rem',
                          border: 'none'
                        }}>
                          <strong style={{ color: '#28a745' }}>{registro.cantidad} L</strong>
                        </CTableDataCell>
                        <CTableDataCell style={{  
                          color: '#FFFFFF',
                          padding: '1rem',
                          border: 'none'
                        }}>
                          {registro.grasa || 'N/A'}%
                        </CTableDataCell>
                        <CTableDataCell style={{ 
                          color: '#FFFFFF',
                          padding: '1rem',
                          border: 'none'
                        }}>
                          {registro.proteina || 'N/A'}%
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center py-5">
                  <p style={{ 
                    color: '#6c757d',
                    fontSize: '1.1rem',
                    margin: 0
                  }}>
                    📊 No hay registros de producción disponibles
                  </p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Footer con Estadísticas Adicionales */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard 
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            className="text-center"
          >
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
