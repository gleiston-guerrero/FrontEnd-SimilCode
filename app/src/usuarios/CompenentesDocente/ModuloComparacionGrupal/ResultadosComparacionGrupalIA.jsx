import React from 'react';
import { Card, Typography, Table, Tag, Alert, Divider } from 'antd';
import { FireOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import '../../Estilos/Css_Comparacion_Grupal/CodeComparisonGroupResults.css';

const { Title, Text, Paragraph } = Typography;

const monacoLangMap = {
    'python': 'python',
    'javascript': 'javascript',
    'typescript': 'typescript',
    'java': 'java',
    'cpp': 'cpp',
    'c++': 'cpp',
    'csharp': 'csharp',
    'c#': 'csharp',
    'go': 'go',
    'rust': 'rust',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'sql': 'sql'
};

const CodeComparisonGroupResults = ({ result, model, loading = false }) => {
    if (loading) {
        return (
            <div className="loading-message">
                <div className="loading-message-icon">🤖</div>
                <div className="loading-message-text">
                    Analizando códigos con IA...
                </div>
                <div className="loading-message-subtext">
                    Esto puede tomar unos momentos
                </div>
            </div>
        );
    }

    if (!result) {
        return null;
    }

    const getNivelColor = (nivel) => {
        const colores = {
            'muy_alta': '#f5222d',
            'alta': '#fa8c16',
            'media': '#faad14',
            'baja': '#52c41a',
            'muy_baja': '#1890ff'
        };
        return colores[nivel] || '#d9d9d9';
    };

    const getNivelTag = (nivel, similitud) => {
        const configs = {
            'muy_alta': { color: 'red', icon: <FireOutlined />, text: 'Muy Alta' },
            'alta': { color: 'orange', icon: <WarningOutlined />, text: 'Alta' },
            'media': { color: 'gold', icon: <InfoCircleOutlined />, text: 'Media' },
            'baja': { color: 'green', icon: <CheckCircleOutlined />, text: 'Baja' },
            'muy_baja': { color: 'blue', icon: <CheckCircleOutlined />, text: 'Muy Baja' }
        };

        const config = configs[nivel] || configs['muy_baja'];

        return (
            <Tag color={config.color} icon={config.icon}>
                {similitud}% - {config.text}
            </Tag>
        );
    };

    const getCodigosUnicos = () => {
        if (!result.matriz_similitud || result.matriz_similitud.length === 0) {
            return [];
        }

        const codigosMap = new Map();

        result.matriz_similitud.forEach(item => {
            if (!codigosMap.has(item.orden_a)) {
                codigosMap.set(item.orden_a, {
                    orden: item.orden_a,
                    nombre_archivo: item.codigo_a_nombre
                });
            }
            if (!codigosMap.has(item.orden_b)) {
                codigosMap.set(item.orden_b, {
                    orden: item.orden_b,
                    nombre_archivo: item.codigo_b_nombre
                });
            }
        });

        return Array.from(codigosMap.values()).sort((a, b) => a.orden - b.orden);
    };

    const codigos = getCodigosUnicos();

    const buildMatrizTable = () => {
        if (!result.matriz_tabla || codigos.length === 0) {
            return [];
        }

        const tableData = [];

        codigos.forEach((codigoA, indexA) => {
            const row = {
                key: `row_${indexA}`,
                codigo: codigoA.nombre_archivo,
                orden: codigoA.orden
            };

            codigos.forEach((codigoB, indexB) => {
                if (indexA === indexB) {
                    row[`col_${indexB}`] = { similitud: '-', nivel: null };
                } else {
                    const key = `${codigoA.orden}-${codigoB.orden}`;
                    const data = result.matriz_tabla[key];
                    row[`col_${indexB}`] = data || { similitud: 0, nivel: 'muy_baja' };
                }
            });

            tableData.push(row);
        });

        return tableData;
    };

    const buildMatrizColumns = () => {
        if (codigos.length === 0) {
            return [];
        }

        const columns = [
            {
                title: 'Código',
                dataIndex: 'codigo',
                key: 'codigo',
                fixed: 'left',
                width: 200,
                render: (text) => (
                    <div className="codigo-cell" title={text}>
                        <Text strong className="codigo-name">
                            {text}
                        </Text>
                    </div>
                )
            }
        ];

        codigos.forEach((codigo, index) => {
            columns.push({
                title: codigo.nombre_archivo,
                dataIndex: `col_${index}`,
                key: `col_${index}`,
                width: 120,
                align: 'center',
                render: (data) => {
                    if (!data) {
                        return <Text style={{ color: '#666' }}>?</Text>;
                    }
                    if (data.similitud === '-') {
                        return (
                            <div className="similarity-cell diagonal">
                                <Text className="diagonal-text">—</Text>
                            </div>
                        );
                    }
                    return (
                        <div
                            className={`similarity-cell ${data.nivel || 'muy_baja'}`}
                            style={{
                                background: `${getNivelColor(data.nivel)}20`,
                                borderLeft: `3px solid ${getNivelColor(data.nivel)}`
                            }}
                        >
                            <Text
                                strong
                                className="similarity-value"
                                style={{ color: getNivelColor(data.nivel) }}
                            >
                                {data.similitud}%
                            </Text>
                        </div>
                    );
                }
            });
        });

        return columns;
    };

    const matrizData = buildMatrizTable();
    const matrizColumns = buildMatrizColumns();

    const haySimilitudes = result.codigos_mas_similares &&
        result.codigos_mas_similares.length > 0 &&
        result.codigos_mas_similares[0]?.par !== 'Ninguno';

    // Código base que viene del resultado
    const codigoBase = result.codigo_base || null;

    return (
        <div className="results-container">

            {/* ── CÓDIGO BASE DE REFERENCIA ── */}
            {codigoBase && (
                <Card className="results-card" style={{ marginBottom: '16px' }}>
                    <div className="card-header" style={{ marginBottom: '10px' }}>
                        <ThunderboltOutlined style={{ color: '#667eea', fontSize: '20px' }} />
                        <Title level={4} className="card-title" style={{ margin: '0 0 0 10px' }}>
                            Código Base de Referencia
                        </Title>
                    </div>

                    <Paragraph style={{ color: '#808080', fontSize: '13px', marginBottom: '12px' }}>
                        {codigoBase.descripcion || 'Solución estándar canónica del problema detectado.'}
                    </Paragraph>

                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                        <div style={{
                            background: '#1a1a2e',
                            padding: '8px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #333'
                        }}>
                            <span style={{
                                color: '#667eea',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {codigoBase.lenguaje || 'código'}
                            </span>
                            <span style={{ color: '#555', fontSize: '11px' }}>
                                Solo lectura · Referencia canónica
                            </span>
                        </div>

                        <Editor
                            height="280px"
                            language={monacoLangMap[codigoBase.lenguaje?.toLowerCase()] || 'plaintext'}
                            value={codigoBase.codigo}
                            theme="vs-dark"
                            options={{
                                readOnly: true,
                                domReadOnly: true,
                                minimap: { enabled: false },
                                fontSize: 13,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on',
                                cursorStyle: 'line',
                                renderLineHighlight: 'none',
                                contextmenu: false,
                                scrollbar: {
                                    verticalScrollbarSize: 6,
                                    horizontalScrollbarSize: 6
                                }
                            }}
                        />
                    </div>

                    <Divider style={{ borderColor: '#333', marginBottom: 0 }} />
                </Card>
            )}

            {/* Resumen General */}
            {result.resumen_general && (
                <Card className="results-card resumen-card">
                    <div className="card-header">
                        <span className="card-icon">📋</span>
                        <Title level={4} className="card-title">Resumen General</Title>
                    </div>
                    <Paragraph className="resumen-text">
                        {result.resumen_general}
                    </Paragraph>
                </Card>
            )}

            {/* Códigos Más Similares */}
            <Card className="results-card similares-card">
                <div className="card-header">
                    <span className="card-icon">🔥</span>
                    <Title level={4} className="card-title">Códigos Más Similares</Title>
                </div>

                {haySimilitudes ? (
                    <div className="similares-list">
                        {result.codigos_mas_similares.map((item, index) => (
                            <Card key={index} className="similar-item-card">
                                <div className="similar-item-content">
                                    <div className="similar-item-info">
                                        <Text strong className="similar-par">
                                            {item.par}
                                        </Text>
                                        <Paragraph className="similar-razon">
                                            {item.razon}
                                        </Paragraph>
                                    </div>
                                    <div className="similar-tag-wrapper">
                                        {getNivelTag(
                                            item.similitud >= 91 ? 'muy_alta' :
                                                item.similitud >= 70 ? 'alta' : 'media',
                                            item.similitud
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Alert
                        message="No se encontraron similitudes notables"
                        description="No se detectaron códigos con similitud superior al 40%"
                        type="info"
                        showIcon
                        className="no-similitudes-alert"
                    />
                )}
            </Card>

            {/* Matriz de Similitud */}
            {codigos.length > 0 && (
                <Card className="results-card matriz-card">
                    <div className="card-header">
                        <span className="card-icon">📊</span>
                        <Title level={4} className="card-title">
                            Matriz de Similitud Completa ({codigos.length} códigos)
                        </Title>
                    </div>

                    <div className="legend-container">
                        <Tag color="red" icon={<FireOutlined />} className="legend-tag">
                            91-100% Muy Alta
                        </Tag>
                        <Tag color="orange" icon={<WarningOutlined />} className="legend-tag">
                            70-90% Alta
                        </Tag>
                        <Tag color="gold" icon={<InfoCircleOutlined />} className="legend-tag">
                            40-69% Media
                        </Tag>
                        <Tag color="green" icon={<CheckCircleOutlined />} className="legend-tag">
                            20-39% Baja
                        </Tag>
                        <Tag color="blue" icon={<CheckCircleOutlined />} className="legend-tag">
                            0-19% Muy Baja
                        </Tag>
                    </div>

                    <div className="table-wrapper">
                        <Table
                            columns={matrizColumns}
                            dataSource={matrizData}
                            pagination={false}
                            scroll={{ x: true }}
                            bordered
                            size="middle"
                            className="matriz-similitud-table"
                            sticky={false}
                        />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CodeComparisonGroupResults;