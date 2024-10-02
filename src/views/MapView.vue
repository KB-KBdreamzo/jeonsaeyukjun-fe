<template>
  <div id="map-container">
    <SearchBar @search="handleSearch"/>
    <div id="map"></div>

    <div class="top-right-buttons">
      <button class="top-button" @click="showJeonsePrices">시세</button>
      <button class="top-button" @click="showIncidentData">안전도</button>
      <button class="top-button">경매</button>
    </div>

    <div class="map-controls">
      <button @click="moveToCurrentLocation" class="control-button">
        <img src="../assets/locationIcon.png">
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import axios from 'axios';

export default {
  components: {
    SearchBar,
  },
  setup() {
    let map;
    const markers = ref([]);
    const isShowingPrice = ref(false);


    const initMap = () => {
      const container = document.getElementById('map');

      const options = {
        center: new kakao.maps.LatLng(37.550964, 126.849533),
        level: 3,
      };
      map = new kakao.maps.Map(container, options);

      var mapTypeControl = new kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

      var zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      kakao.maps.event.addListener(map, 'idle', () => {
        if (isShowingPrice.value) {
          fetchPriceDataForVisibleArea();
        } else {
          fetchIncidentData();
        }
      });
    };

    const createTextOverlay = (latitude, longitude, regionName, info, color) => {
      const content = `
        <div class="flex items-center rounded-full shadow-lg overflow-hidden" style="opacity: 0.9;">
          <div class="text-gray-800 font-bold py-1 px-2" style="background-color: rgba(255, 255, 255, 0.9);">
            ${regionName}
          </div>
          <div class="text-white font-bold py-1 px-2" style="background-color: ${color};">
            ${info}
          </div>
        </div>
      `;

      const position = new kakao.maps.LatLng(latitude, longitude);

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1.5,
      });

      customOverlay.setMap(map);
      markers.value.push(customOverlay);
    };

    // 기존 오버레이 제거 함수
    const removeOverlays = () => {
      markers.value.forEach(marker => marker.setMap(null));
      markers.value = [];
    };

    const fetchIncidentData = async () => {
      try {
        const bounds = map.getBounds();
        const center = map.getCenter();
        const lat = center.getLat();
        const lng = center.getLng();

        const response = await axios.get('http://localhost:8080/api/incidents', {
          params: {
            x: lng,
            y: lat,
          },
        });

        const incidentData = response.data;

        if (Array.isArray(incidentData)) {
          removeOverlays();

          const totalIncidentCount = incidentData.reduce((sum, item) => sum + item.incidentCount, 0);

          const averageIncidentCount = totalIncidentCount / incidentData.length;

          incidentData.forEach(item => {
            const latitude = item.latitude;
            const longitude = item.longitude;
            const regionName = item.regionName || 'Unknown';
            const incidentCount = item.incidentCount;
            const color = incidentCount > averageIncidentCount ? 'rgba(255, 0, 0, 0.9)' : 'rgba(255, 99, 71, 0.6)';
            const info = `전세사기: ${incidentCount}건`;

            createTextOverlay(latitude, longitude, regionName, info, color);
          });
        } else {
          console.error('incidentData는 배열이어야 합니다.', incidentData);
        }
      } catch (error) {
        console.error('Incident 정보를 가져오는 데 실패했습니다:', error.response?.data || error.message);
      }
    };

    const fetchPriceDataForVisibleArea = async () => {
      try {
        const bounds = map.getBounds();
        const center = map.getCenter();
        const lat = center.getLat();
        const lng = center.getLng();

        const regionResponse = await axios.get('https://dapi.kakao.com/v2/local/geo/coord2regioncode.json', {
          params: { x: lng, y: lat }, // x는 경도, y는 위도
          headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
        });

        const lawCode = regionResponse.data.documents[0].code;

        if (!lawCode) {
          console.error('법정동코드가 없습니다.');
          return;
        }

        const priceResponse = await axios.get('https://api.kbland.kr/land-price/price/fastPriceInfo', {
          params: {
            법정동코드: lawCode,
            유형: 2,
            거래유형: 0,
          },
        });

        const priceData = priceResponse.data.dataBody.data;

        if (Array.isArray(priceData)) {
          removeOverlays();
          for (const item of priceData) {
            if (item.매매 && item.매매.length > 0) {
              const address = item.주소;
              const jeonsePrice = item.매매[0].일반평균;
              const coordinates = await getCoordinatesFromAddress(address);

              if (coordinates) {
                const { lat, lng } = coordinates;
                createTextOverlay(lat, lng, item.단지명, `매매가: ${jeonsePrice}만원`, 'rgba(255, 99, 71, 0.7)');
              }
            }
          }
        } else {
          console.error('priceData는 배열이어야 합니다.', priceData);
        }
      } catch (error) {
        console.error('시세 정보를 불러오는 데 실패했습니다:', error.response?.data || error.message);
      }
    };

    // 주소를 위도와 경도로 변환하는 함수
    const getCoordinatesFromAddress = async (address) => {
      try {
        const response = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
          params: { query: address },
          headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
        });

        if (response.data.documents.length > 0) {
          const { x, y } = response.data.documents[0];
          return { lat: parseFloat(y), lng: parseFloat(x) };
        } else {
          console.error('주소로 좌표를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('주소를 좌표로 변환하는 데 실패했습니다.', error);
      }
      return null;
    };

    const showJeonsePrices = () => {
      isShowingPrice.value = true;
      fetchPriceDataForVisibleArea();
    };

    // 안전도 버튼 클릭 시 호출되는 함수
    const showIncidentData = () => {
      isShowingPrice.value = false;
      fetchIncidentData();
    };

    onMounted(() => {
      const script = document.createElement('script');
      const apikey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apikey}&autoload=false`;
      script.onload = () => {
        kakao.maps.load(() => {
          initMap();
        });
      };
      document.head.appendChild(script);
    });

    return {
      markers,
      showJeonsePrices,
      showIncidentData,
      moveToCurrentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locPosition = new kakao.maps.LatLng(lat, lon);
            map.setCenter(locPosition);
          });
        } else {
          alert("현재 위치를 찾을 수 없습니다.");
        }
      },
    };
  },

  methods: {
    handleSearch(searchQuery) {
      console.log("입력된 검색어:", searchQuery);
    },
  },
};
</script>

<style scoped>
#map-container {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.top-right-buttons {
  position: absolute;
  top: 3px;
  right: 130px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.top-button {
  background-color: #ffffff;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  color: #103bda;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
}

.top-button:hover {
  background-color: #FFC107;
}

.map-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.control-button {
  width: 40px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 6px;
  margin-bottom: 5px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.control-button:hover {
  background-color: #f0f0f0;
}
</style>
