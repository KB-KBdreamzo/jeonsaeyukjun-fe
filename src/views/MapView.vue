<template>
  <div id="map-container" class="relative w-full h-screen overflow-hidden">
    <SearchBar @search="handleSearch" />
    <div id="map" class="w-full h-full"></div>

    <div class="absolute top-11 right-5 flex space-x-2 z-50">
      <button
        class="bg-white py-2 px-4 font-bold text-black shadow border rounded-lg cursor-pointer transition duration-300 hover:bg-blue-500 hover:text-white"
        :class="{ 'active-button': isShowingPrice }"
        @click="showJeonsePrices"
      >
        시세
      </button>
      <button
        class="bg-white py-2 px-4 font-bold text-black shadow border rounded-lg cursor-pointer transition duration-300 hover:bg-blue-500 hover:text-white"
        :class="{ 'active-button': isShowingSafety }"
        @click="showSafetyData"
      >
        안전도
      </button>
      <button
        class="bg-white py-2 px-4 font-bold text-black shadow border rounded-lg cursor-pointer transition duration-300 hover:bg-blue-500 hover:text-white"
        :class="{ 'active-button': isShowingIncident }"
        @click="showIncidentData"
      >
        전세사기 건수
      </button>
    </div>

    <div class="absolute bottom-16 right-5 flex flex-col z-50">
      <button @click="moveToCurrentLocation" class="w-10 h-10 bg-white border rounded-full shadow-md p-1">
        <img src="../assets/locationIcon.png" alt="Current Location" class="w-full h-full"/>
      </button>
    </div>

    <transition name="slide">
      <div v-if="isSidebarOpen" class="sidebar fixed top-0 left-0 w-96 h-full bg-white shadow-lg z-2000">
        <button class="bg-gray-200 text-lg p-2 rounded-full absolute top-4 right-4" @click="closeSidebar">←</button>
        <div class="sidebar-search">
          <SearchBar @search="handleSidebarSearch" />
        </div>

        <div class="sidebar-content p-8">
          <div class="search-result-box mb-4">
            <h3 class="text-xl font-bold">검색 결과</h3>
            <p class="location text-lg">{{ sidebarTitle }}</p>
            <div class="sidebar-section safety-section mt-2">
              <h4 class="font-bold">안전도</h4>
              <span class="badge" :style="{ backgroundColor: safetyBadgeClass }">{{ safetyScoreText }}</span>
            </div>

            <div class="sidebar-section price-section mt-2">
              <p class="price-info">{{ jeonsePriceInfo }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import SearchBar from "@/components/SearchBar.vue";
import axios from "axios";

const map = ref(null);
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

const initMap = async () => {
  const container = document.getElementById("map");
  try {
    const { lat, lng } = await getCurrentLocation();
    const options = {
      center: new kakao.maps.LatLng(lat, lng), 
      level: 3,
    };

    map.value = new kakao.maps.Map(container, options);

    kakao.maps.event.addListener(map.value, "idle", () => {
      if (isShowingPrice.value) {
        fetchPriceDataForVisibleArea();
      } else if (isShowingIncident.value) {
        fetchIncidentData();
      } else if (isShowingSafety.value) {
        fetchSafetyData();
      }
    });
  } catch (error) {
    console.error("현재 위치를 가져오는 데 실패했습니다:", error);
    const defaultOptions = {
      center: new kakao.maps.LatLng(37.550964, 126.849533),
      level: 3,
    };
    map.value = new kakao.maps.Map(container, defaultOptions);
  }
};

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;  
          const lng = position.coords.longitude;  
          resolve({ lat, lng });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("이 브라우저에서는 Geolocation을 지원하지 않습니다."));
    }
  });
};

const openSidebar = (title, safetyText, safetyClass, priceInfo) => {
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
        params: { query },
        headers: { Authorization: `KakaoAK ${apiKey}` },
      }
    );

    if (response.data.documents.length > 0) {
      const { x, y } = response.data.documents[0];
      return { lat: parseFloat(y), lng: parseFloat(x) };
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
      const regionResponse = await axios.get(
        "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
        {
          params: { x: lng, y: lat },
          headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
        }
      );

      if (regionResponse.data.documents.length > 0) {
        const legalCode = regionResponse.data.documents[0].code;

        // 안전도 데이터와 매매 시세 데이터를 동시에 가져옴
        const [safetyResponse, priceResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/map/safetyScores", {
            params: { legalCode: legalCode },
          }),
          axios.get("https://api.kbland.kr/land-price/price/fastPriceInfo", {
            params: { 법정동코드: legalCode, 유형: 2, 거래유형: 0 },
          }),
        ]);

        let safetyText = "자료가 없습니다";
        let safetyColor = "badge-normal";
        if (safetyResponse.data.length > 0) {
          const safetyData = safetyResponse.data[0];
          const safetyScore = safetyData.safetyScore || 0;
          const { text, color } = categorizeSafetyScore(safetyScore);
          safetyText = text;
          safetyColor = color;
        }

        let priceInfo = "자료가 없습니다";
        if (priceResponse.data.dataBody?.data.length > 0) {
          const priceData = priceResponse.data.dataBody.data[0];
          const jeonsePrice = priceData.매매[0].일반평균;
          const jeonsePriceInEok = (jeonsePrice / 10000).toFixed(1);
          priceInfo = `매매가: ${jeonsePriceInEok}억`;
        }

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
    }
  } catch (error) {
    console.error("도로명주소를 가져오는 데 실패했습니다:", error);
  }
  return null;
};

const removeOverlays = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
};

const createTextOverlay = (latitude, longitude, address, text, color) => {
  console.log(latitude, longitude)
  const content = `
    <div class="flex items-center rounded-full shadow-lg overflow-hidden" style="opacity: 0.9;">
      <div class="text-gray-800 font-bold py-1 px-2" style="background-color: rgba(255, 255, 255, 0.9);">
        ${address}
      </div>
      <div class="text-white font-bold py-1 px-2" style="background-color: ${color};">
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

const handleSidebarSearch = async (query) => {
  await moveToSearchedLocation(query);
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
        params: { x: lng, y: lat },
        headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
      }
    );

    if (!regionResponse.data.documents || regionResponse.data.documents.length === 0) {
      console.error("법정동코드가 없습니다.");
      return;
    }

    const legalCode = regionResponse.data.documents[0].code;
    const priceResponse = await axios.get(
      "https://api.kbland.kr/land-price/price/fastPriceInfo",
      {
        params: { 법정동코드: legalCode, 유형: 2, 거래유형: 0 },
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
            const { lat, lng } = coordinates;
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

    const response = await axios.get("http://localhost:8080/api/map/incidents", {
      params: { x: lng, y: lat },
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

    const response = await axios.get(
        "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json", 
        {
        params: { x: lng, y: lat },
        headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
        });

    const legalCode = response.data.documents[0].code;
 
    // 안전도 관련 조회 -> 법정동 코드 말고 해당 좌표의 구를 받아서 검색 ㄱㄱㄱ
    const safetyResponse = await axios.get(`http://localhost:8080/api/map/safetyScores?legalCode=${legalCode}`);
    if (safetyResponse.data.length > 0) {
      safetyResponse.data.forEach( async (data) => {
        const safetyScore = data.safetyScore 
        const roadName = data.roadName

        const latlngResponse =await axios.get(
          `https://dapi.kakao.com/v2/local/search/address.json?query=${roadName}`, 
          {
            headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
          }
        );
        const { x, y } = latlngResponse.data.documents[0].road_address;
        const { text, color } = categorizeSafetyScore(safetyScore); 
        createTextOverlay(y, x, `${roadName}`, text, color);
      });
    } else {
      console.log("조회되는 안전도 점수가 없습니다.")
    }
  } catch (error) {
    console.error("안전도 데이터를 불러오는 데 실패했습니다:", error.response?.data || error.message);
  }
};

const categorizeSafetyScore = (score) => {
  if (score >= 0 && score <= 20) {
    return { text: "위험", color: "rgb(255, 99, 71)" };
  } else if (score > 20 && score <= 40) {
    return { text: "주의", color: "rgb(255, 165, 0)" };
  } else if (score > 40 && score <= 60) {
    return { text: "보통", color: "rgb(255, 255, 102)" };
  } else if (score > 60 && score <= 80) {
    return { text: "양호", color: "rgb(78,234,78)" };
  } else if (score > 80 && score <= 100) {
    return { text: "안전", color: "rgb(0,185,241)" };
  } else {
    return { text: "데이터 없음", color: "rgb(128, 128, 128)" };
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
</script>

<style scoped>
</style>
