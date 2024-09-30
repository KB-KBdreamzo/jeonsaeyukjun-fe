<template>
  <div id="map-container">
    <SearchBar @search="handleSearch" />
    <div id="map"></div>

    <div class="map-controls">
      <button @click="moveToCurrentLocation" class="control-button"><img src="../assets/locationIcon.png"></button>
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
    const incidentData = ref([]);

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
    };

    const fetchIncidentData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/incidents');
        incidentData.value = response.data;

        const totalIncidents = incidentData.value.reduce((acc, item) => acc + item.incidentCount, 0);
        const avgIncidentCount = totalIncidents / incidentData.value.length;

        incidentData.value.forEach(item => {
          if (item.latitude !== 0 && item.longitude !== 0) {
            createTextOverlay(item.latitude, item.longitude, item.regionName, item.incidentCount, avgIncidentCount);
          }
        });
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
      }
    };

    const createTextOverlay = (latitude, longitude, regionName, incidentCount, avgIncidentCount) => {
      // 평균보다 많으면 진한 빨간색, 적으면 옅은 빨간색
      const backgroundColor = incidentCount > avgIncidentCount ? 'rgb(219,22,0)' : 'rgba(255, 99, 71, 0.7)';

      const content = `
        <div class="flex items-center rounded-full shadow-lg overflow-hidden" style="opacity: 0.9;">
          <div class="text-gray-800 font-bold py-1 px-2" style="background-color: rgba(255, 255, 255, 0.9);">
            ${regionName}
          </div>
          <div class="text-white font-bold py-1 px-2" style="background-color: ${backgroundColor};">
            ${incidentCount}건
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

    onMounted(() => {
      const script = document.createElement('script');
      const apikey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apikey}&autoload=false`;
      script.onload = () => {
        kakao.maps.load(() => {
          initMap();
          fetchIncidentData();
        });
      };
      document.head.appendChild(script);
    });

    return {
      markers,
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
