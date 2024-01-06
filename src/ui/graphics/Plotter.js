const accent1 = getComputedStyle(document.body).getPropertyValue("--accent-1");

Chart.register(ChartStreaming);
Chart.defaults.color = accent1;

export class Plotter {
    constructor() {
        this.context;
        this.chart;
        this.y1 = 0;
        this.y2 = 0;
    }

    start() {
        this.context = document.getElementById("plot1");
        this.chart = new Chart(this.context, {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "D1",
                        backgroundColor: "#3787ac",
                        borderColor: "#4ab1e0",
                        data: []
                    },
                    {
                        label: "D2",
                        backgroundColor: "#ac374e",
                        borderColor: "#e04a68",
                        data: []
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
                            duration: 5000,
                            refresh: 100,
                            delay: 0,
                            onRefresh: c => {
                                c.data.datasets[0].data.push({
                                    x: Date.now(),
                                    y: this.y1
                                });

                                c.data.datasets[1].data.push({
                                    x: Date.now(),
                                    y: this.y2
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
        // setInterval(() => {
        //     //this.data.push(Math.random() * 100);
        // }, 1000);
    }
}