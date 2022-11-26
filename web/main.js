
const socket = io();
const colorTempArray = ['#FCE1DA', '#FFC1B8', '#FDBBB1', '#FF9B90', '#FF7F74', '#FF6859', '#FF4C40', '#FF4133', '#FF3424', '#FF2D1B'];
const colorHumArray = ['#D2F2FF', '#BFE1FF', '#AFD5FF', '#95BFFF', '#80B9FF', '#6EAEFF', '#5EA7FF', '#50A8FF', '#409EFF', '#228AFF'];
const colorLightArray = ['#F9F6CD', '#FAF6B6', '#FAF3A3', '#FAF28B', '#FAF174', '#FAF55C', '#FAF54D', '#FAF837', '#FAF826', '#FAF71B'];
function doimau1(temp,array) {
    switch (Math.trunc(temp/10)) {
        case 0:
            document.querySelector('#temp').style.backgroundColor = array[0];
            break;
        case 1:
            document.querySelector('#temp').style.backgroundColor = array[1];
            break;
        case 2:
            document.querySelector('#temp').style.backgroundColor = array[2];
            break;
        case 3:
            document.querySelector('#temp').style.backgroundColor = array[3];
            break;
        case 4:
            document.querySelector('#temp').style.backgroundColor = array[4];
            break;
        case 5:
            document.querySelector('#temp').style.backgroundColor = array[5];
            break;
        case 6:
            document.querySelector('#temp').style.backgroundColor = array[6];
            break;
        case 7:
            document.querySelector('#temp').style.backgroundColor = array[7];
            break;
        case 8:
            document.querySelector('#temp').style.backgroundColor = array[8];
            break;
        default:
            document.querySelector('#temp').style.backgroundColor = array[9];
    }
}
function doimau2(hum,array) {
    switch (Math.trunc(hum/10)) {
        case 0:
            document.querySelector('#hum').style.backgroundColor = array[0];
            break;
        case 1:
            document.querySelector('#hum').style.backgroundColor = array[1];
            break;
        case 2:
            document.querySelector('#hum').style.backgroundColor = array[2];
            break;
        case 3:
            document.querySelector('#hum').style.backgroundColor = array[3];
            break;
        case 4:
            document.querySelector('#hum').style.backgroundColor = array[4];
            break;
        case 5:
            document.querySelector('#hum').style.backgroundColor = array[5];
            break;
        case 6:
            document.querySelector('#hum').style.backgroundColor = array[6];
            break;
        case 7:
            document.querySelector('#hum').style.backgroundColor = array[7];
            break;
        case 8:
            document.querySelector('#hum').style.backgroundColor = array[8];
            break;
        default:
            document.querySelector('#hum').style.backgroundColor = array[9];
    }
}
function doimau3(light,array) {
    switch (Math.trunc(light/300)) {
        case 0:
            document.querySelector('#light').style.backgroundColor = array[0];
            break;
        case 1:
            document.querySelector('#light').style.backgroundColor = array[1];
            break;
        case 2:
            document.querySelector('#light').style.backgroundColor = array[2];
            break;
        case 3:
            document.querySelector('#light').style.backgroundColor = array[3];
            break;
        case 4:
            document.querySelector('#light').style.backgroundColor = array[4];
            break;
        case 5:
            document.querySelector('#light').style.backgroundColor = array[5];
            break;
        case 6:
            document.querySelector('#light').style.backgroundColor = array[6];
            break;
        case 7:
            document.querySelector('#light').style.backgroundColor = array[7];
            break;
        case 8:
            document.querySelector('#light').style.backgroundColor = array[8];
            break;
        default:
            document.querySelector('#light').style.backgroundColor = array[9];
    }
}
const ctx = document.getElementById('myChart').getContext('2d');
const data = {
    labels: [],
    datasets: [
        {
            type: 'line',
            label: 'Temp',
            data: [],
            backgroundColor: '#FF9F9F',
            borderColor: '#FF9F9F',
            yAxisID: 'y'
        },
        {
            type: 'line',
            label: 'Hum',
            data: [],
            backgroundColor: '#8D9EFF',
            borderColor: '#8D9EFF',
            yAxisID: 'y'
        },
        {
            type: 'bar',
            label: 'Light',
            data: [],
            backgroundColor: '#FCDDB0',
            borderColor: '#FCDDB0',
            yAxisID: 'y1'
        },
    ],
};

const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: true,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          Text: 'Data sensor'
        }
      },
      scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
    
            // grid line settings
            grid: {
              drawOnChartArea: true, // only want the grid lines for one axis to show up
            },
          },
        }
    },
}
function auto(x){
    if(x>=1500){
        socket.emit('led2control', 'on')
        document.querySelector('input').checked= true
    }
    else if(x<1500){
        socket.emit('led2control', 'off')
        document.querySelector('input').checked= false
    }
}
Chart.defaults.color = '#000';
const sensorsChart = new Chart(ctx, config);
const handlingData = arr => {
    const dataSS = arr.map(data => Number(data));
    // (dataSS[0] >= 35 && !light0On) || (dataSS[0] >= 35 && !toggle.classList.contains('act') && showReport(warning));
    // dataSS >= 15 && dataSS < 35 && showReport(good);
    data.datasets[0].data.push(dataSS[0])
    data.datasets[0].data.length === 13 && data.datasets[0].data.shift();
    data.datasets[1].data.push(dataSS[1]);
    data.datasets[1].data.length === 13 && data.datasets[1].data.shift();
    data.datasets[2].data.push(dataSS[2]);
    data.datasets[2].data.length === 13 && data.datasets[2].data.shift();
    document.getElementById("hienthi1").innerHTML = dataSS[0] +'&degC'
    document.getElementById("hienthi2").innerHTML = dataSS[1] + '%'
    document.getElementById("hienthi3").innerHTML = dataSS[2] +'lux'
    doimau1(dataSS[0],colorTempArray)
    doimau2(dataSS[1],colorHumArray)
    doimau3(dataSS[2],colorLightArray)
    const day = new Date();
    auto(dataSS[1])
    let time = `${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
    data.labels.push(time);
    data.labels.length === 13 && data.labels.shift();
    sensorsChart.update()
};
let thongbaobat='bạn có muốn bật đèn không'
let thongbaotat='bạn có muốn tắt đèn không'
document.querySelector('#but1').addEventListener('click',()=> {
    if (confirm(thongbaobat)){
        socket.emit('led1control', 'on')
        document.getElementById("but1").style.background="blue"
        document.getElementById("but2").style.background="gray"
        document.querySelector('#anh1').src='electric-bulb (2).png'
    }
})
document.querySelector('#but2').addEventListener('click',()=> {
    if (confirm(thongbaotat)){
        socket.emit('led1control', 'off')
        document.getElementById("but2").style.background="red"
        document.getElementById("but1").style.background="gray"
        document.querySelector('#anh1').src='electric-bulb (1).png'
    }
})
document.querySelector('input').onclick = function(e){
    if (this.checked){
        if (confirm(thongbaobat)){
            socket.emit('led2control', 'on')
            document.querySelector('#anh2').src='electric-bulb (2).png'
            document.querySelector('input').checked= true
        }
        else{
            document.querySelector('input').checked= false
            document.querySelector('#anh2').src='electric-bulb (1).png'
        }
    }
    else{
        if (confirm(thongbaotat)){
            socket.emit('led2control', 'off')
            document.querySelector('#anh2').src='electric-bulb (1).png'
            document.querySelector('input').checked= false
        }
        else{
            document.querySelector('input').checked= true
            document.querySelector('#anh2').src='electric-bulb (2).png'
        }
    }
}
socket.on('data-sensors', msg => {
    console.log(msg);
    handlingData(msg);
});

socket.on('led1control', msg => {
    if (msg === 'on') {
        document.querySelector('#anh1').src = 'electric-bulb (2).png';
    }
    if (msg === 'off') {
        document.querySelector('#anh1').src = 'electric-bulb (1).png';
    }
    console.log(`led 1 ${msg}`);
});

socket.on('led2control', msg => {
    if (msg === 'on') {
        document.querySelector('#anh2').src = 'electric-bulb (2).png';
    }
    if (msg === 'off') {
        document.querySelector('#anh2').src = 'electric-bulb (1).png';
    }
    console.log(`led 2 ${msg}`);
});