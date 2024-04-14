import React, { useEffect, useState, useRef } from 'react';
import AnalyticsService from '../api/services/AnalyticsService';
import MaterialService from '../api/services/MaterialService';
import LoaderComponent from './LoaderComponent';
import moment from 'moment';

function OverviewComponent() {
    const [overview, setOverview] = useState(null);
    const [tapTarget, setTapTarget] = useState(null);
    const tapTargetRef = useRef(null);

    const yesterday = new Date()

    const openTabTarget = () => {
        tapTarget?.open();
    };

    useEffect(() => {
        AnalyticsService.getOverview()
            .then(response => {
                setOverview(response)
            }).catch(errors => {
                console.error(errors)
            });
    }, []);

    useEffect(() => {
        if (tapTargetRef.current) {
            setTapTarget(MaterialService.initTapTarget(tapTargetRef.current));
        }
    }, [tapTargetRef]);

    return (
        <main className="content">
            <div className="page-title">
                <h4>
                    Resumen de ayer ({moment(yesterday).subtract(1,'days').format('DD.MM.YYYY')})
                    <i className="material-icons black-text pointer" onClick={openTabTarget}>
                        info_outline
                    </i>
                </h4>
            </div>
            {overview ? (
                <div className="row">
                    <div className="col s12 l6">
                        <div className="card light-blue lighten-2 white-text">
                            <div className="card-content">
                                <span className="card-title">Ganancias:</span>
                                <h3>{overview.gain.yesterday}$</h3>
                                <h3
                                    className={`m0 mb1 ${!overview.gain.isHigher ? 'red-text' : 'green-text text-darken-2'
                                        }`}
                                >
                                    <i className="material-icons">
                                        {overview.gain.isHigher ? 'arrow_upward' : 'arrow_downward'}
                                    </i>
                                    {overview.gain.percent || 100}%
                                </h3>
                                <p>
                                    Tus ingresos comerciales de ayer fueron {overview.gain.percent || 100}%
                                    {overview.gain.isHigher ? 'mayores' : 'menores'} con promedio:{' '}
                                    {overview.gain.compare || 0} $. Por día.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 l6">
                        <div className="card orange lighten-2 white-text">
                            <div className="card-content">
                                <span className="card-title">Pedidos:</span>
                                <h3>{overview.orders.yesterday} artículos</h3>
                                <h3
                                    className={`m0 mb1 ${!overview.orders.isHigher ? 'red-text' : 'green-text text-darken-2'
                                        }`}
                                >
                                    <i className="material-icons">
                                        {overview.orders.isHigher ? 'arrow_upward' : 'arrow_downward'}
                                    </i>
                                    {overview.orders.percent}%
                                </h3>
                                <p>
                                    El número de pedidos de ayer fue {overview.orders.percent}%
                                    {overview.orders.isHigher ? 'mayor' : 'menor'} con valor promedio:{' '}
                                    {overview.orders.compare} pedido. Diario
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <LoaderComponent/>
            )}

            <div ref={tapTargetRef} className="tap-target" data-target="menu">
                <div className="tap-target-content">
                    <h5>¿Por qué se necesita esta página?</h5>
                    <p>
                        La página de "Resumen" mostrará la dinámica de las ventas del día anterior. La comparación con los
                        promedios te ayuda a entender cómo está funcionando tu negocio.
                    </p>
                </div>
            </div>
        </main>
    );
}

export default OverviewComponent;
