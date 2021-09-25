// const cctvInfo = [
//     "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50",
//     "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50/%EA%B0%95%EB%82%A8%EA%B5%AC",
//     "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50/%EC%84%9C%EC%B4%88%EA%B5%AC",
//     "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50/%EA%B0%95%EB%8F%99%EA%B5%AC",
//     "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50/%EA%B4%91%EC%A7%84%EA%B5%AC"
// ]

let list = [];
let totalQuantity = 0;
let dongList = [];
let dongCctvList = [];
let crtQtn = 0;
let numbers = 0;


/*
for (let index in cctvInfo) {
    const request = new XMLHttpRequest();
    request.open("GET", cctvInfo[index]);
    request.responseType = "json";
    request.send();

    request.onload = function () {
        //console.log(request.response);
        const cctvData = request.response;
        //console.log(cctvData.safeOpenCCTV.row);
        let datas = cctvData.safeOpenCCTV.row;
        for (let index in datas) {
            let x = parseFloat(datas[index].WGSXPT);
            let y = parseFloat(datas[index].WGSYPT);
            let use = datas[index].CCTVUSE;
            let address = datas[index].ADDR;
            let quantity = datas[index].QTY;
            let gu = datas[index].SVCAREAID;
            console.log(gu);

            const table = document.querySelector('tbody');
            const tr = document.createElement("tr");
            table.appendChild(tr);
            tr.setAttribute('class',`${gu}`);
            tr.setAttribute('id','active');
            tr.innerHTML = `<th class="cell100">${address}</th><td>${quantity}대</td><td>${use}</td>`;


            //console.log(x, y);

            positions.push({
                title: `${use} CCTV`,
                latlng: new kakao.maps.LatLng(x, y)
            });

            list.push({
                x: x,
                y: y,
                add: address
            })
        }

        for (var i = 0; i < positions.length; i++) {

            // 마커 이미지의 이미지 크기 입니다
            var imageSize = new kakao.maps.Size(35, 35);

            // 마커 이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: positions[i].latlng, // 마커를 표시할 위치
                title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                image: markerImage // 마커 이미지
            });
            //console.log(marker);

            marker.setMap(map);
        }

        select();
        selectGu();
    }

    //console.log(list);
}
 */

// ADDR: "서울특별시 중랑구 상봉동 봉화산로44길 16 풍산쉐르빌"
// CCTVUSE: "방범"
// QTY: 1
// SVCAREAID: "중랑구"
// UPDTDATE: "2021-01-12"
// WGSXPT: "37.6020202636719"
// WGSYPT: "127.088043212891"


var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.602020, 127.08804), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };
// console.log('hello');
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var positions = [];

// 마커 이미지의 이미지 주소입니다
var imageSrc = "pin.png";

let geocoder = new kakao.maps.services.Geocoder();
let dong = "";

// 좌표로 주소 정보 가져오기
function searchAddrFromCoords(obj, callback) {
    geocoder.coord2RegionCode(obj.WGSYPT, obj.WGSXPT, callback);
}

// 동 이름 추출, 배열에 넣기
function displayCenterInfo(result, status) {
        for(let i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
                let address = result[i].address_name;
                let arr = address.split(" ");
                if(arr[0]==="서울특별시") {
                    dong = arr[2];
                } else {
                    dong = arr[3];
                }
                // console.log(dong);

                // console.log(dongList);
                //
                // console.log(dongCctvList);
                // infoDiv.innerHTML = result[i].address_name;
                break;
            }
    }
        // if(!dongList.includes(dong)) {
        //     dongList.push(dong);
        // }
        
        function findDong(d) {
            return d.name === dong;
        }

        // dong = '방배동'
        // findDong 함수의 리턴값은
        // { name: '방배동', qtn: 1 }

       if (dongCctvList.find(findDong)!=null) {
           dongCctvList.find(findDong).qtn += crtQtn;
       } else {
           dongCctvList.push({
               name: dong,
               qtn: crtQtn
           });
       }
       console.log(dongCctvList);

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}


$(function () {
    $('#btn').click(function () {
        let link = "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50";
        let gu = $('#search').val();
        let api = link+"/"+gu;

        $.getJSON(api,function (data){
            let datas = data.safeOpenCCTV.row;
            console.log(datas);
            // $('#datas').empty();
            const table = $('tbody');
            table.empty();
            let mapX = 0;
            let mapY = 0;
            $.each(datas,function (index, obj) {
                searchAddrFromCoords(obj, displayCenterInfo);

                let x = parseFloat(obj.WGSXPT);
                mapX = x;
                let y = parseFloat(obj.WGSYPT);
                mapY = y;
                let use = obj.CCTVUSE;
                let address = obj.ADDR;
                let quantity = obj.QTY;
                crtQtn = quantity;
                let gu = obj.SVCAREAID;

                // console.log(obj.ADDR);
                table.append("<tr class='"+gu+"' id='active'>" +
                    "<th class=\"cell100\">"+address+"</th><td>"+quantity+"대</td><td>"+use+"</td></tr>");

                positions.push({
                    title: `${use} CCTV`,
                    latlng: new kakao.maps.LatLng(x, y)
                });

                list.push({
                    x: x,
                    y: y,
                    add: address
                });

                for (var i = 0; i < positions.length; i++) {
                    // 마커 이미지의 이미지 크기 입니다
                    var imageSize = new kakao.maps.Size(30, 30);

                    // 마커 이미지를 생성합니다
                    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                    // 마커를 생성합니다
                    var marker = new kakao.maps.Marker({
                        map: map, // 마커를 표시할 지도
                        position: positions[i].latlng, // 마커를 표시할 위치
                        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                        image: markerImage // 마커 이미지
                    });
                    //console.log(marker);
                    marker.setMap(map);
                }
                select();
                // 여기까지가 지도 마커 생성
                totalQuantity+= quantity;

            });

            // 이동할 위도 경도 위치를 생성합니다
            var moveLatLon = new kakao.maps.LatLng(mapX, mapY);
            console.log(moveLatLon);

            // 지도 중심을 이동 시킵니다
            map.panTo(moveLatLon);
        });
    });
});

function drawChart() {
    let arr = [
        ['동 이름', 'CCTV 대수']
    ];
    for (let i = 0 ; i < dongCctvList.length; i++) {
        arr.push(Object.values(dongCctvList[i]));
    }
        var data = google.visualization.arrayToDataTable(arr);

        var options = {
            pieHole: 0.4,
            backgroundColor: 'transparent',
            legend: 'none',
            colors: ['#845EC2','#D65DB1','#FF6F91','#FF9671','#FFC75F','#F9F871','#008F7A','#0089BA','#B39CD0','#C34A36','#FF8066'],
            pieSliceText: 'none',
            chartArea: {left:50,top:20,width:'50%',height:'75%'}
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
}


// selectGu = () => {
//     const tables = document.querySelectorAll('tbody tr');
//     const items = document.querySelectorAll('.dropdown-item');
//
//     items.forEach((currentValue)=>{
//         currentValue.addEventListener('click',()=>{
//             for (let index in tables)
//                 if (currentValue.innerHTML===tables[index].className) {
//                     console.log(currentValue.innerHTML,tables[index].className);
//                     tables[index].setAttribute('id','active');
//                 } else {
//                     console.log(currentValue.innerHTML,tables[index].className);
//                     tables[index].setAttribute('id','');
//                 }
//         })
//     })
// }




select = () => {
    const tds = document.querySelectorAll('.cell100');
    // console.log(tds.length);
    tds.forEach((currentValue) => {
        currentValue.addEventListener('click',()=>{
            //console.log(currentValue.innerHTML, index, array);
            //console.log('click');
            let x, y;

            for (let index = 0; index < list.length ; index++) {
                if (list[index].add===currentValue.innerHTML) {
                    x = list[index].x;
                    //console.log(x);
                    y = list[index].y;
                    break;
                }
            }
            // 이동할 위도 경도 위치를 생성합니다
            var moveLatLon = new kakao.maps.LatLng(x, y);
            // console.log(moveLatLon);

            // 지도 중심을 이동 시킵니다
            map.panTo(moveLatLon);
        });
    });
}



