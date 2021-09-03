const cctvInfo = [
    "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50",
    "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50/%EA%B0%95%EB%82%A8%EA%B5%AC",
    "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50/%EC%84%9C%EC%B4%88%EA%B5%AC",
    "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50/%EA%B0%95%EB%8F%99%EA%B5%AC",
    "http://openapi.seoul.go.kr:8088/70784a446a6368693436666c586d44/json/safeOpenCCTV/1/50/%EA%B4%91%EC%A7%84%EA%B5%AC"
]

let list = [];

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
console.log('hello');
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var positions = [];

// 마커 이미지의 이미지 주소입니다
var imageSrc = "pin.png";

select = () => {
    const tds = document.querySelectorAll('.cell100');
    console.log(tds.length);
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
            console.log(moveLatLon);

            // 지도 중심을 이동 시킵니다
            map.panTo(moveLatLon);
        });
    });
}

selectGu = () => {
    const tables = document.querySelectorAll('tbody tr');
    const items = document.querySelectorAll('.dropdown-item');

    items.forEach((currentValue)=>{
        currentValue.addEventListener('click',()=>{
            for (let index in tables)
                if (currentValue.innerHTML===tables[index].className) {
                    console.log(currentValue.innerHTML,tables[index].className);
                    tables[index].setAttribute('id','active');
                } else {
                    console.log(currentValue.innerHTML,tables[index].className);
                    tables[index].setAttribute('id','');
                }
        })
    })
}

