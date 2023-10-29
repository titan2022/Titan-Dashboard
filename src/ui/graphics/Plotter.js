const accent1 = getComputedStyle(document.body).getPropertyValue("--accent-1");

Chart.register(ChartStreaming);
Chart.defaults.color = accent1;

export class Plotter {
    constructor() {
        this.context;
        this.chart;
        this.data = [];
    }

    start() {
        this.context = document.getElementById("plot1");
        this.chart = new Chart(this.context, {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Dataset 1",
                        backgroundColor: "#3787ac",
                        borderColor: "#4ab1e0",
                        data: this.data
                    }
                ]
            },
            options: {
                plugins: {
                    streaming: {
                        duration: 20000,
                    }
                },
                scales: {
                    x: {
                        type: "realtime",
                        realtime: {
                            duration: 20000,
                            refresh: 1000,
                            delay: 2000,
                            onRefresh: c => {
                                c.data.datasets.forEach(dataset => {
                                    dataset.data.push({
                                        x: Date.now(),
                                        y: Math.random() * 100
                                    });
                                });
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Value"
                        }
                    }
                },
                interaction: {
                    intersect: false
                }
            }
        });


        // test
        setInterval(() => {
            //this.data.push(Math.random() * 100);
        }, 1000);
    }
}