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

    <transition name="slide">
      <div v-if="isSidebarOpen" class="sidebar">
        <button class="close-button" @click="closeSidebar">←</button>
        <div class="sidebar-content">
          <!-- 검색 결과 상자 -->
          <div class="search-result-box">
            <h3>검색 결과</h3>
            <p class="location">{{ sidebarTitle }}</p>
            <!-- 안전도 -->
            <div class="sidebar-section safety-section">
              <h4>안전도</h4>
              <span class="badge" :style="{ backgroundColor: safetyBadgeClass }">{{ safetyScoreText }}</span>
            </div>

            <!-- 전세 시세 -->
            <div class="sidebar-section price-section">
              <h4>매매 시세</h4>
              <p class="price-info">{{ jeonsePriceInfo }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {onMounted, ref} from "vue";
import SearchBar from "@/components/SearchBar.vue";
import axios from "axios";

export default {
  components: {
    SearchBar,
  },
  setup() {
    let map = ref(null);
    const markers = ref([]);
    const isShowingPrice = ref(false);
    const isShowingIncident = ref(false);
    const isShowingSafety = ref(false);
    const currentMarker = ref(null);

    const isSidebarOpen = ref(false);
    const sidebarTitle = ref("");
    const safetyScoreText = ref("보통");
    const safetyBadgeClass = ref("badge-normal");
    const jeonsePriceInfo = ref("자료가 없습니다");

    const initMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.550964, 126.849533),
        level: 3,
      };
      map.value = new kakao.maps.Map(container, options);

      // 지도 idle 상태에서 다시 데이터를 불러옴
      kakao.maps.event.addListener(map.value, "idle", () => {
        if (isShowingPrice.value) {
          fetchPriceDataForVisibleArea();
        } else if (isShowingIncident.value) {
          fetchIncidentData();
        } else if (isShowingSafety.value) {
          fetchSafetyData();
        }
      });
    };

    const openSidebar = (title, safetyText, safetyClass, priceInfo) => {
      console.log('Sidebar data:', { title, safetyText, safetyClass, priceInfo }); // 디버깅용 로그
      sidebarTitle.value = title;
      safetyScoreText.value = safetyText;
      safetyBadgeClass.value = safetyClass;
      jeonsePriceInfo.value = priceInfo;
      isSidebarOpen.value = true;
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
              params: {query},
              headers: {Authorization: `KakaoAK ${apiKey}`},
            }
        );

        if (response.data.documents.length > 0) {
          const {x, y} = response.data.documents[0];
          return {lat: parseFloat(y), lng: parseFloat(x)};
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

      marker.setMap(map.value);
      currentMarker.value = marker;
    };

    const moveToSearchedLocation = async (query) => {
      const coordinates = await getCoordinatesFromAddress(query);
      if (coordinates) {
        const { lat, lng } = coordinates;
        const locPosition = new kakao.maps.LatLng(lat, lng);
        map.value.setCenter(locPosition);
        placeMarker(lat, lng);

        // 도로명주소를 가져와서 sidebarTitle에 설정
        const roadNameAddress = await getRoadNameAddress(lat, lng);
        if (roadNameAddress) {
          // 법정동 코드를 가져오기 위한 API 호출
          const regionResponse = await axios.get(
              "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
              {
                params: { x: lng, y: lat },
                headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
              }
          );

          if (regionResponse.data.documents.length > 0) {
            const lawCode = regionResponse.data.documents[0].code;

            // 안전도 데이터와 매매 시세 데이터를 동시에 가져옴
            const [safetyResponse, priceResponse] = await Promise.all([
              axios.get("http://localhost:8080/api/safety-data", {
                params: { 법정동코드: lawCode },
              }),
              axios.get("https://api.kbland.kr/land-price/price/fastPriceInfo", {
                params: { 법정동코드: lawCode, 유형: 2, 거래유형: 0 },
              }),
            ]);

            // 안전도 데이터 처리
            let safetyText = "자료가 없습니다";
            let safetyColor = "badge-normal";
            if (safetyResponse.data.length > 0) {
              const safetyData = safetyResponse.data[0];
              const safetyScore = safetyData.safetyScore || 0;
              const { text, color } = categorizeSafetyScore(safetyScore);
              safetyText = text;
              safetyColor = color;
            }

            // 매매 시세 데이터 처리
            let priceInfo = "자료가 없습니다";
            if (priceResponse.data.dataBody?.data.length > 0) {
              const priceData = priceResponse.data.dataBody.data[0];
              const jeonsePrice = priceData.매매[0].일반평균;
              const jeonsePriceInEok = (jeonsePrice / 10000).toFixed(1);
              priceInfo = `매매가: ${jeonsePriceInEok}억`;
            }

            // 안전도와 시세 데이터를 함께 사이드바에 반영
            openSidebar(roadNameAddress, safetyText, safetyColor, priceInfo);
          }
        } else {
          openSidebar("주소를 찾을 수 없습니다", "보통", "badge-normal", "자료가 없습니다");
        }
      }
    };


    const getRoadNameAddress = async (lat, lng) => {
      try {
        const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
        const response = await axios.get(
            "https://dapi.kakao.com/v2/local/geo/coord2address.json",
            {
              params: { x: lng, y: lat },
              headers: { Authorization: `KakaoAK ${apiKey}` },
            }
        );

        if (response.data.documents.length > 0) {
          return response.data.documents[0].road_address.address_name;
        } else {
          console.error("도로명주소를 찾을 수 없습니다.");
          return null;
        }
      } catch (error) {
        console.error("도로명주소를 가져오는 데 실패했습니다:", error);
        return null;
      }
    };



    const removeOverlays = () => {
      markers.value.forEach((marker) => marker.setMap(null));
      markers.value = [];
    };

    const createTextOverlay = (latitude, longitude, address, text, color) => {
      const content = `
        <div class="flex items-center rounded-full shadow-lg overflow-hidden" style="opacity: 0.9;">
          <div class="text-gray-800 font-bold py-1 px-2" style="background-color: rgba(255, 255, 255, 0.9);">
            ${address}
          </div>
          <div class="text-black font-bold py-1 px-2" style="background-color: ${color};">
            ${text}
          </div>
        </div>
      `;
      const position = new kakao.maps.LatLng(latitude, longitude);
      const customOverlay = new kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 1.5,
      });

      customOverlay.setMap(map.value);
      markers.value.push(customOverlay);
    };

    const handleSearch = async (query) => {
      await moveToSearchedLocation(query);
    };

    const fetchPriceDataForVisibleArea = async () => {
      try {
        removeOverlays();
        const center = map.value.getCenter();
        const lat = center.getLat();
        const lng = center.getLng();

        const regionResponse = await axios.get(
            "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
            {
              params: {x: lng, y: lat},
              headers: {Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`},
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
              params: {법정동코드: lawCode, 유형: 2, 거래유형: 0},
            }
        );

        const priceData = priceResponse.data.dataBody?.data;
        if (Array.isArray(priceData)) {
          for (const item of priceData) {
            if (item.매매 && item.매매.length > 0) {
              const address = item.주소;
              const jeonsePrice = item.매매[0].일반평균;
              const coordinates = await getCoordinatesFromAddress(address);
              if (coordinates) {
                const {lat, lng} = coordinates;
                const jeonsePriceInEok = (jeonsePrice / 10000).toFixed(1);
                createTextOverlay(
                    lat,
                    lng,
                    item.단지명,
                    `매매가: ${jeonsePriceInEok}억`,
                    "rgb(16,59,218)"
                );
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

    const fetchIncidentData = async () => {
      try {
        removeOverlays();
        const center = map.value.getCenter();
        const lat = center.getLat();
        const lng = center.getLng();

        const response = await axios.get("http://localhost:8080/api/incidents", {
          params: {x: lng, y: lat},
        });

        const incidentData = response.data;

        if (Array.isArray(incidentData)) {
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
        removeOverlays();
        const center = map.value.getCenter();
        const lat = center.getLat();
        const lng = center.getLng();

        const regionResponse = await axios.get(
            "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
            {
              params: {x: lng, y: lat},
              headers: {Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`},
            }
        );

        if (!regionResponse.data.documents || regionResponse.data.documents.length === 0) {
          console.error("법정동코드가 없습니다.");
          return;
        }

        const lawCode = regionResponse.data.documents[0].code;
        const address = regionResponse.data.documents[0].address_name;

        const safetyResponse = await axios.get(
            "http://localhost:8080/api/safety-data",
            {
              params: {법정동코드: lawCode},
            }
        );

        if (safetyResponse.data.length > 0) {
          const safetyData = safetyResponse.data[0];
          const safetyScore = safetyData.safetyScore || 0;

          const {text, color} = categorizeSafetyScore(safetyScore);
          createTextOverlay(lat, lng, address, text, color);
        } else {
          createTextOverlay(lat, lng, address, "자료가 없습니다", "rgb(128, 128, 128)");
        }
      } catch (error) {
        console.error("안전도 데이터를 불러오는 데 실패했습니다:", error.response?.data || error.message);
        createTextOverlay(center.getLat(), center.getLng(), "현재 위치", "자료가 없습니다", "rgb(128, 128, 128)");
      }
    };

    const categorizeSafetyScore = (score) => {
      if (score >= 0 && score <= 20) {
        return {text: "위험", color: "rgb(255, 99, 71)"};
      } else if (score > 20 && score <= 40) {
        return {text: "주의", color: "rgb(255, 165, 0)"};
      } else if (score > 40 && score <= 60) {
        return {text: "보통", color: "rgb(255, 255, 102)"};
      } else if (score > 60 && score <= 80) {
        return {text: "양호", color: "rgb(144, 238, 144)"};
      } else if (score > 80 && score <= 100) {
        return {text: "안전", color: "rgb(173, 216, 230)"};
      } else {
        return {text: "데이터 없음", color: "rgb(128, 128, 128)"};
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
      safetyScoreText,
      safetyBadgeClass,
      jeonsePriceInfo,
      handleSearch, // 추가
    };
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

.search-result .location {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.safety-section {
  display: flex;
  align-items: center;
}

.safety-section h4 {
  margin-right: 10px;
}

.badge {
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 15px;
}

.badge-normal {
  background-color: #fdd835;
  color: #000;
}

.badge-danger {
  background-color: #f44336;
  color: #fff;
}

.badge-safe {
  background-color: #4caf50;
  color: #fff;
}

.price-section .price-info {
  font-size: 1rem;
  color: #666;
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

/* 검색 결과 상자 */
.search-result-box {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-result-box h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.search-result-box .location {
  font-size: 1.1rem;
  font-weight: bold;
  color: #555;
}

</style>
