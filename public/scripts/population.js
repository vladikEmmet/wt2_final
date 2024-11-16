document.addEventListener('DOMContentLoaded', () => {
    const filtersForm = document.getElementById('filters-form');
    const chartCanvas = document.getElementById('population-chart');
    let chartInstance = null;

    const fetchData = async (country, indicator, startYear, endYear) => {
        try {
            const response = await fetch(
                `/population/indicator?countryCode=${country}&indicator=${indicator}&startYear=${startYear}&endYear=${endYear}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            return data.data; // Возвращаем только массив данных
        } catch (error) {
            console.error('Error fetching data:', error.message);
            return [];
        }
    };

    const renderChart = (data) => {
        const labels = data.map(item => item.year); // Года
        const values = data.map(item => item.value); // Значения

        if (chartInstance) {
            chartInstance.destroy(); // Удаляем предыдущий график перед созданием нового
        }

        chartInstance = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Population Data',
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        });
    };

    const loadAndRenderData = async () => {
        const country = document.getElementById('country').value;
        const indicator = document.getElementById('indicator').value;
        const startYear = document.getElementById('startYear').value;
        const endYear = document.getElementById('endYear').value;

        const data = await fetchData(country, indicator, startYear, endYear);

        if (data.length === 0) {
            alert('No data available for the selected filters');
            return;
        }

        renderChart(data);
    };

    // Загрузка данных при первом рендере страницы
    loadAndRenderData();

    // Применение фильтров
    filtersForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Отменяем перезагрузку страницы
        if(role !== 'admin' && role !== 'editor') {
            return;
        }
        loadAndRenderData();
    });
});
