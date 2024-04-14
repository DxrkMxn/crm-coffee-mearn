import React, { useRef, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import AnalyticsService from '../api/services/AnalyticsService';
import LoaderComponent from './LoaderComponent';

Chart.register(...registerables);

function AnalyticsComponent() {
    const [analytics, setAnalytics] = useState({average: '', chart: []});
    const [average, setAverage] = useState(null);
    const [pending, setPending] = useState(true);
    const isAlive = useRef(new Subject());

    const gainRef = useRef(null);
    const orderRef = useRef(null);
    const avgGainRef = useRef(null);
    const avgOrderRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            AnalyticsService.getAnalytics()
                .then(data => {
                    setAverage(prev => prev = data.average);
    
                    const labels = data.chart.map(item => item.label);
                    const gains = data.chart.map(item => item.gain);
                    const orders = data.chart.map(item => item.order);
    
                    const gainDataset = {
                        label: 'Ingresos',
                        data: gains,
                        borderColor: 'rgb(255,99,132)',
                        fill: false,
                        tension: 0.1,
                    };
    
                    const orderDataset = {
                        label: 'Pedidos',
                        data: orders,
                        borderColor: '#03a9f4',
                        fill: false,
                        tension: 0.1,
                    };
    
                    const incomeSlope = (gains[gains.length - 1] - gains[0]) / (gains.length - 1);
                    const incomeSlopeDataset = {
                        label: 'Pendiente de Ingresos',
                        data: gains.map((_, index) => gains[0] + incomeSlope * index),
                        borderColor: '#2691FF',
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5],
                    };
    
                    const orderSlope = (orders[orders.length - 1] - orders[0]) / (orders.length - 1);
                    const orderSlopeDataset = {
                        label: 'Pendiente de Pedidos',
                        data: orders.map((_, index) => orders[0] + orderSlope * index),
                        borderColor: '#FF9126',
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5],
                    };
    
                    const gainContext = gainRef.current?.getContext('2d');
                    const orderContext = orderRef.current?.getContext('2d');
                    const avgGainContext = avgGainRef.current?.getContext('2d');
                    const avgOrderContext = avgOrderRef.current?.getContext('2d');
    
                    if (gainContext && orderContext && avgGainContext && avgOrderContext) {
                        gainContext.canvas.height = '300px';
                        orderContext.canvas.height = '300px';
                        avgGainContext.canvas.height = '300px';
                        avgOrderContext.canvas.height = '300px';
    
                        new Chart(gainContext, generateChartConfig(labels, [gainDataset]));
                        new Chart(orderContext, generateChartConfig(labels, [orderDataset]));
                        new Chart(avgGainContext, generateChartConfig(labels, [gainDataset, incomeSlopeDataset]));
                        new Chart(avgOrderContext, generateChartConfig(labels, [orderDataset, orderSlopeDataset]));
                    }
    
                    setPending(false);
                }).catch(errors => {
                    console.error('Error fetching data:', errors);
                })
        };

        fetchData();

        return () => {
            isAlive.current.next();
            isAlive.current.complete();
        };
    }, []);

    function generateChartConfig(labels, datasets) {
        return {
            type: 'line',
            data: {
                labels,
                datasets,
            },
        };
    }

    return (
        <main className="content">
            <div className="page-title">
                <h4>Análisis</h4>
            </div>
            <div style={{ display: pending ? 'none' : 'block' }}>
                <div className="average-price">
                    <p>Promedio de completos <strong>{average || 0} $</strong></p>
                </div>

                <div className="analytics-block pb3">
                    <h5>Ingresos</h5>
                    <canvas ref={gainRef}></canvas>
                </div>

                <div className="analytics-block pb3">
                    <h5>Pedidos</h5>
                    <canvas ref={orderRef}></canvas>
                </div>

                <div className="analytics-block pb3">
                    <h5>Promedio de Ingresos</h5>
                    <canvas ref={avgGainRef}></canvas>
                </div>

                <div className="analytics-block pb3">
                    <h5>Promedio de Pedidos</h5>
                    <canvas ref={avgOrderRef}></canvas>
                </div>
            </div>
            {pending && <LoaderComponent />}
        </main>
    );
}

export default AnalyticsComponent;
