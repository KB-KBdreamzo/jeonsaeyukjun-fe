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
          :class="{ 'active-button': isShowingSafety }"
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

    <!-- 검색했을 때만 뜨는 사이드바 -->
    <transition name="slide">
      <div v-if="isSidebarOpen" class="sidebar">
        <button class="close-button" @click="closeSidebar">←</button>
        <div class="sidebar-content">
          <!-- 사이드바를 4개 영역으로 나눔 -->
          <div class="sidebar-section section-1">
            <h3>섹션 1</h3>
            <p>여기에 섹션 1의 내용을 넣으세요.</p>
          </div>
          <div class="sidebar-section section-2">
            <h3>섹션 2</h3>
            <p>여기에 섹션 2의 내용을 넣으세요.</p>
          </div>
          <div class="sidebar-section section-3">
            <h3>섹션 3</h3>
            <p>여기에 섹션 3의 내용을 넣으세요.</p>
          </div>
          <div class="sidebar-section section-4">
            <h3>섹션 4</h3>
            <p>여기에 섹션 4의 내용을 넣으세요.</p>
          </div>
        </div>
      </div>
    </transition>
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
    const isShowingPrice = ref(false); // 시세 상태
    const isShowingIncident = ref(false); // 전세사기 건수 상태
    const isShowingSafety = ref(false); // 안전도 상태
    const currentMarker = ref(null);

    const isSidebarOpen = ref(false); // 사이드바 상태 (검색 후에만 열림)
    const sidebarTitle = ref(""); // 사이드바 제목
    const sidebarContent = ref(""); // 사이드바 내용

    const initMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.550964, 126.849533),
        level: 3,
      };
      map = new kakao.maps.Map(container, options);

      // 지도 이동 후 데이터 갱신
      kakao.maps.event.addListener(map, "idle", () => {
        if (isShowingPrice.value) {
          fetchPriceDataForVisibleArea();
        } else if (isShowingIncident.value) {
          fetchIncidentData();
        } else if (isShowingSafety.value) {
          fetchSafetyData();
        }
      });
    };

    const openSidebar = (title, content) => {
      sidebarTitle.value = title;
      sidebarContent.value = content;
      isSidebarOpen.value = true; // 검색 후에만 열림
    };

    const closeSidebar = () => {
      isSidebarOpen.value = false;
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
        // 검색 후 사이드바 열기
        openSidebar("검색 결과", `검색한 위치: ${query}`);
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
            const info = `${incidentCount}건`;

            createTextOverlay(latitude, longitude, regionName, info, color);
          });
        } else {
          console.error("incidentData는 배열이어야 합니다.", incidentData);
        }
      } catch (error) {
        console.error("Incident 정보를 가져오는 데 실패했습니다:", error.response?.data || error.message);
      }
    };

    const fetchSafetyData = async () => {
      try {
        // 이 부분에 실제 안전도 데이터를 가져오는 로직을 추가하세요
        console.log("안전도 데이터를 가져오는 중...");
      } catch (error) {
        console.error("안전도 정보를 불러오는 데 실패했습니다:", error);
      }
    };

    const showJeonsePrices = () => {
      isShowingPrice.value = true;
      isShowingIncident.value = false;
      isShowingSafety.value = false;
      fetchPriceDataForVisibleArea();
    };

    const showSafetyData = () => {
      isShowingPrice.value = false;
      isShowingIncident.value = false;
      isShowingSafety.value = true;
      fetchSafetyData();
    };

    const showIncidentData = () => {
      isShowingPrice.value = false;
      isShowingIncident.value = true;
      isShowingSafety.value = false;
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
      showSafetyData,
      showIncidentData,
      closeSidebar,
      isShowingPrice,
      isShowingIncident,
      isShowingSafety,
      isSidebarOpen,
      sidebarTitle,
      sidebarContent,
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

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 450px;
  height: 100%;
  background-color: white;
  z-index: 2000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
}

.sidebar-content {
  padding: 20px;
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.close-button {
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 50%;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 350px;
  right: -30px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
