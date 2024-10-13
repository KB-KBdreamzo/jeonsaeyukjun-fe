<template>
  <div id="map-container" class="w-full relative">
    <div class="w-100 h-[calc(100vh-4rem)] absolute top-0 left-0 flex z-10">
      <button @click="openSideBar" class="ml-5 mt-5 px-3 gap-5 flex flex-row items-center w-80 h-12 bg-white rounded-xl shadow-lg z-10">
        <img src="/src/assets/search.png" class="h-6 w-6">
        <div class="text-base text-gray-600">강서구 가양동</div>
      </button>
      <div v-if="isSidebarOpen" class="flex-col h-full absolute left-0 right-0 bg-white z-20">
        <div class="mt-3 mb-3 w-full grid grid-cols-10 gap-2 items-center bg-white border-gray-300 rounded-2xl">
          <button class="col-span-1 flex justify-center items-center" @click="closeSidebar">
            <img src="/src/assets/back.jpg" class="h-6 w-6">
          </button>
          <button class="col-span-1 flex justify-center items-center" @click="onSearchClick">
            <img src="/src/assets/search.png" class="h-5 w-5">
          </button>
          <input type="text" placeholder="예) 역삼 푸르지오"
            v-model="addressInput"
            class="col-span-8 h-12 text-lg focus:outline-none focus:border-none"
          />
        </div>
        <div class="flex flex-col gap-8 border-t border-gray-200 p-4 gap-4 h-[calc(100vh-8.5rem)] overflow-y-auto">
          <div class="flex flex-col gap-5 w-full bg-gray-100 h-40 rounded-xl p-5"
            v-for="(result, index) in searchResults"
            :key="index"
          >
            <div class="flex font-bold">{{ result.addr }}</div>
            <div class="flex flex-row justify-between items-center">
              <div class="font-semibold">안전도 점수</div>
              <div class="px-4 py-1 rounded-lg" :style="{ backgroundColor: result.score.color }">{{ result.score.text }}</div>
            </div>
            <div class="flex flex-row justify-between">
              <div class="font-semibold">매매가</div>
              <div class="pr-1 rounded-lg">{{ result.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="map" class="w-full h-[calc(100vh-4rem)]"></div>

    <div class="absolute top-5 right-5 flex space-x-2 z-50">
      <button
        class="w-24 h-12 tracking-widest font-semibold text-lg text-black shadow border rounded-2xl cursor-pointer transition duration-300"
        :class="{
          'bg-blue-500 text-white': isShowingPrice,
          'bg-white': !isShowingPrice,
          'hover:bg-blue-500 hover:text-white': !isShowingPrice
        }"
        @click="showJeonsePrices"
      >
        시 세
      </button>
      <button
        class="w-24 h-12 tracking-widest font-semibold text-lg text-black shadow border rounded-2xl cursor-pointer transition duration-300"
        :class="{
          'bg-blue-500 text-white': isShowingSafety,
          'bg-white': !isShowingSafety,
          'hover:bg-blue-500 hover:text-white': !isShowingSafety
        }"
        @click="showSafetyData"
      >
        안전도
      </button>
      <button
        class="w-24 h-12 tracking-widest font-semibold text-lg text-black shadow border rounded-2xl cursor-pointer transition duration-300"
        :class="{
          'bg-blue-500 text-white': isShowingIncident,
          'bg-white': !isShowingIncident,
          'hover:bg-blue-500 hover:text-white': !isShowingIncident
        }"
        @click="showIncidentData"
      >
        위험도
      </button>
    </div>
    <div class="absolute bottom-5 right-5 flex flex-col z-50">
      <button @click="moveToCurrentLocation" class="w-10 h-10 bg-white border rounded-full shadow-md p-1">
        <img src="../assets/locationIcon.png" alt="Current Location" class="w-full h-full" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SearchBar from "@/components/SearchBar.vue";
import axios from "axios";
import { useAddressStore } from '@/stores/addressStore';

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

const addressStore = useAddressStore();
const addressInput = ref('');
const searchResults = ref([]);

const openSideBar = () => {
  isSidebarOpen.value = true;
}

const closeSidebar = () => {
  isSidebarOpen.value = false;
  searchResults.value = [];
  addressInput.value = "";
};

const onSearchClick = async () => {
  if (addressInput.value) {
    await addressStore.fetchAddress(addressInput.value);
    
    if (addressStore.addressResults.length > 0){
      let result = []
      console.log(addressStore.addressResults[0])
      const legalCode = addressStore.addressResults[0].admCd
      const roadName = addressStore.addressResults[0].roadAddrPart1;
      const prices = await fetchPrices(legalCode);
      const scores = await fetchScores(legalCode);

      // 핀 이동
      const latlngResponse =await axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${roadName}`, 
        {
          headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
        }
      );
      
      if (latlngResponse.data.documents.length > 0) {
        const { x, y } = latlngResponse.data.documents[0];
        const locPosition = new kakao.maps.LatLng(y, x);
        map.value.setCenter(locPosition);
        placeMarker(y, x);
      }

      // 결과들 
      addressStore.addressResults.forEach(addr => {
        let tmp = {"addr": addr.roadAddrPart1, "score": categorizeSafetyScore(999), "price": "알 수 없음"}
        if (addr.admCd == legalCode) {
          scores.forEach(s => {
            if((addr.roadAddrPart1).replace(/\s+/g, '') == (s.roadName).replace(/\s+/g, '')) tmp.score = categorizeSafetyScore(s.safetyScore);
          })

          prices.forEach(p => {
            if((addr.jibunAddr).includes(p.주소)) {
              const avg = p.매매.map(item => parseFloat(item.일반평균));
              const result = avg.reduce((acc, curr) => acc + curr, 0)/avg.length;
              tmp.price = (result/10000).toFixed(1) + " 억원";
            }
          });
          result.push(tmp);
        }
      });
      searchResults.value = result
    }
  }
};


const fetchPrices = async(legalCode) => {
  const res = await axios.get(
      "https://api.kbland.kr/land-price/price/fastPriceInfo",
      {
        params: { 법정동코드: legalCode, 유형: 0, 거래유형: 1 },
      }
  ); 
  return res.data.dataBody?.data;
}

const fetchScores = async(legalCode) => {
  const res = await axios.get(`http://localhost:8080/api/map/safetyScores?legalCode=${legalCode}`);
  return res.data;
}

// 현 주소로 위도 경도 설정 및 level 설정하여 지도 셋팅
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

// 현재 위치 lat, lng
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

// query > x(lng),y(lat) 반환 
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

// 핀 꼽기
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

const removeOverlays = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
};

const createTextOverlay = (latitude, longitude, address, text, color) => {
  const content = `
    <div class="flex items-center rounded-full shadow-lg overflow-hidden" style="opacity: 0.9;">
      <div class="text-gray-800 font-bold py-1 px-2" style="background-color: rgba(255, 255, 255, 0.9);">
        ${address.split(" ").slice(2).join(" ")}
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

// 위도, 경도로 도로명 주소 반환
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
        params: { 법정동코드: legalCode, 유형: 1, 거래유형: 0 },
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
        if (latlngResponse.data.documents.length > 0) {
          const { x, y } = latlngResponse.data.documents[0];
          const { text, color } = categorizeSafetyScore(safetyScore); 
          createTextOverlay(y, x, `${roadName}`, text, color);
        } else {
          console.log("도로명 주소 > 위도 경도 변환 불가", roadName)
        }
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
    return { text: "알 수 없음", color: "rgb(180, 180, 180)" };
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