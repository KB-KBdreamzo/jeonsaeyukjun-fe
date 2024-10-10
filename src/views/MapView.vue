<template>
  <div id="map-container">
    <SearchBar @search="handleSearch" />
    <div id="map"></div>

    <div class="top-right-buttons">
      <button
          class="top-button"
          :class="{ 'active-button': isShowingPrice }"
          @click="showJeonsePrices"
      >
        시세
      </button>
      <button
          class="top-button"
          :class="{ 'active-button': !isShowingPrice && !isShowingIncident }"
          @click="showSafetyData"
      >
        안전도
      </button>
      <button
          class="top-button"
          :class="{ 'active-button': isShowingIncident }"
          @click="showIncidentData"
      >
        전세사기 건수
      </button>
    </div>

    <div class="map-controls">
      <button @click="moveToCurrentLocation" class="control-button">
        <img src="../assets/locationIcon.png" />
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import SearchBar from "@/components/SearchBar.vue";
import axios from "axios";

export default {
  components: {
    SearchBar,
  },
  setup() {
    let map;
    const markers = ref([]);
    const isShowingPrice = ref(false);
    const isShowingIncident = ref(false);
    const currentMarker = ref(null);

    const initMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.550964, 126.849533),
        level: 3,
      };
      map = new kakao.maps.Map(container, options);

      kakao.maps.event.addListener(map, "idle", () => {
        if (isShowingPrice.value) {
          fetchPriceDataForVisibleArea();
        } else if (isShowingIncident.value) {
          fetchIncidentData();
        }
      });
    };

    const getCoordinatesFromAddress = async (query) => {
      try {
        const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
        const response = await axios.get(
            "https://dapi.kakao.com/v2/local/search/address.json",
            {
              params: { query },
              headers: { Authorization: `KakaoAK ${apiKey}` },
            }
        );

        if (response.data.documents.length > 0) {
          const { x, y } = response.data.documents[0];
          return { lat: parseFloat(y), lng: parseFloat(x) };
        } else {
          console.error("주소로 좌표를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("주소를 좌표로 변환하는 데 실패했습니다:", error);
      }
      return null;
    };

    const placeMarker = (lat, lng) => {
      if (currentMarker.value) {
        currentMarker.value.setMap(null);
      }

      const position = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({
        position,
      });

      marker.setMap(map);
      currentMarker.value = marker;
    };

    const moveToSearchedLocation = async (query) => {
      const coordinates = await getCoordinatesFromAddress(query);
      if (coordinates) {
        const { lat, lng } = coordinates;
        const locPosition = new kakao.maps.LatLng(lat, lng);
        map.setCenter(locPosition);
        placeMarker(lat, lng);
      }
    };

    const fetchPriceDataForVisibleArea = async () => {
      try {
        const center = map.getCenter();
        const lat = center.getLat();
        const lng = center.getLng();

        const regionResponse = await axios.get(
            "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
            {
              params: { x: lng, y: lat },
              headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
            }
        );

        if (!regionResponse.data.documents || regionResponse.data.documents.length === 0) {
          console.error("법정동코드가 없습니다.");
          return;
        }

        const lawCode = regionResponse.data.documents[0].code;
        const priceResponse = await axios.get(
            "https://api.kbland.kr/land-price/price/fastPriceInfo",
            {
              params: { 법정동코드: lawCode, 유형: 2, 거래유형: 0 },
            }
        );

        const priceData = priceResponse.data.dataBody?.data;
        if (Array.isArray(priceData)) {
          removeOverlays();
          for (const item of priceData) {
            if (item.매매 && item.매매.length > 0) {
              const address = item.주소;
              const jeonsePrice = item.매매[0].일반평균;
              const coordinates = await getCoordinatesFromAddress(address);
              if (coordinates) {
                const { lat, lng } = coordinates;
                const jeonsePriceInEok = (jeonsePrice / 10000).toFixed(1);
                createTextOverlay(lat, lng, item.단지명, `매매가: ${jeonsePriceInEok}억`, "rgb(16,59,218)");
              }
            }
          }
        } else {
          console.error("priceData는 배열이어야 합니다.", priceData);
        }
      } catch (error) {
        console.error("시세 정보를 불러오는 데 실패했습니다:", error.response?.data || error.message);
      }
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
        position,
        content,
        yAnchor: 1.5,
      });

      customOverlay.setMap(map);
      markers.value.push(customOverlay);
    };

    const removeOverlays = () => {
      markers.value.forEach((marker) => marker.setMap(null));
      markers.value = [];
    };

    const fetchIncidentData = async () => {
      try {
        const center = map.getCenter();
        const lat = center.getLat();
        const lng = center.getLng();

        const response = await axios.get("http://localhost:8080/api/incidents", {
          params: { x: lng, y: lat },
        });

        const incidentData = response.data;

        if (Array.isArray(incidentData)) {
          removeOverlays();

          const totalIncidentCount = incidentData.reduce(
              (sum, item) => sum + item.incidentCount,
              0
          );
          const averageIncidentCount = totalIncidentCount / incidentData.length;

          incidentData.forEach((item) => {
            const latitude = item.latitude;
            const longitude = item.longitude;
            const regionName = item.regionName || "Unknown";
            const incidentCount = item.incidentCount;
            const color =
                incidentCount > averageIncidentCount
                    ? "rgba(255, 0, 0, 0.9)"
                    : "rgb(255,127,0)";
            const info = ` ${incidentCount}건`;

            createTextOverlay(latitude, longitude, regionName, info, color);
          });
        } else {
          console.error("incidentData는 배열이어야 합니다.", incidentData);
        }
      } catch (error) {
        console.error("Incident 정보를 가져오는 데 실패했습니다:", error.response?.data || error.message);
      }
    };

    const showJeonsePrices = () => {
      isShowingPrice.value = true;
      isShowingIncident.value = false;
      fetchPriceDataForVisibleArea();
    };

    const showIncidentData = () => {
      isShowingPrice.value = false;
      isShowingIncident.value = true;
      fetchIncidentData();
    };

    onMounted(() => {
      const script = document.createElement("script");
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
      moveToSearchedLocation,
      showJeonsePrices,
      showIncidentData,
      isShowingPrice,
      isShowingIncident,
    };
  },
  methods: {
    async handleSearch(searchQuery) {
      await this.moveToSearchedLocation(searchQuery);
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
}

.top-right-buttons {
  position: absolute;
  top: 44px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.top-button {
  background-color: #ffffff;
  padding: 7px 15px;
  font-size: 16px;
  font-weight: bold;
  color: #0a0a0a;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  z-index: 1001;
}

.top-button:hover {
  background-color: #1d4ed8;
}

.top-button.active-button {
  background-color: #1d4ed8;
  color: #ffffff;
}

.map-controls {
  position: absolute;
  bottom: 70px;
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
