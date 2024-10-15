<template>
    <div class="flex flex-col p-10 gap-5">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">우리 동네 공인중개사 찾기</h1>
        <div class="flex space-x-4">
          <!-- 시 드롭다운 -->
          <Menu as="div" class="relative text-left">
            <div>
              <MenuButton class="flex justify-between w-36 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {{ selectedSido.codeNm ? selectedSido.codeNm : '시 선택' }}
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>
  
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute max-h-[33vh] overflow-y-auto right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-for="code in legalCode.sido" :key="code.sido" v-slot="{ active }">
                    <a href="#" @click="selectSido(code)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">{{ code.codeNm }}</a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
  
          <!-- 군 드롭다운 -->
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="inline-flex justify-between w-36 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {{ selectedSigugun.codeNm ? selectedSigugun.codeNm : '군 선택' }}
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>
  
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute max-h-[33vh] overflow-y-auto right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-for="code in filteredSigugun" :key="code.sigugun" v-slot="{ active }">
                    <a href="#" @click="selectSigugun(code)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">{{ code.codeNm }}</a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
  
          <!-- 동 드롭다운 -->
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="inline-flex justify-between w-36 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {{ selectedDong.codeNm ? selectedDong.codeNm : '동 선택' }}
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>
  
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute max-h-[33vh] overflow-y-auto right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-for="code in filteredDong" :key="code.dong" v-slot="{ active }">
                    <a href="#" @click="selectDong(code)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">{{ code.codeNm }}</a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
          
          <button @click="onSearchClick" class="w-12 flex items-center bg-black rounded-md px-3 py-1">
            <img src="/src/assets/searchIconWhite.png" alt="Search" class="h-6 w-6" />
          </button>
        </div>
      </div>
  
      <div class="h-[65vh] flex flex-col gap-8">
        <div v-for="(agent, index) in agents" :key="agent.bzmn_conm" class="flex flex-row items-center justify-between p-4 pb-6"
          :class="index === agents.length - 1 ? '' : 'border-b-2 border-gray-100'">
          <div class="flex flex-col ">
            <h2 class="font-semibold text-xl tracking-wider">{{ agent.bzmn_conm }}</h2>
            <div class="flex flex-row items-center">
              <img src="/src/assets/locationPin.jpg" alt="Location Icon" class="w-5 h-5 mr-2" />
              <p class="font-light text-gray-600">{{ agent.addr }}</p>
            </div>
            <p class="font-light text-gray-600">{{ agent.telno ? agent.telno.split(',')[0] : "알 수 없음" }}</p>
          </div>
          <div>
            <button @click="reserveAgent" class="flex items-center bg-black text-white rounded-md px-3 py-1"> 예약하기 </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button
          @click="goToPage(page)"
          v-for="page in totalPages"
          :key="page"
          :class="[
            'px-3 py-1 border rounded-lg',
            page === currentPage
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-800',
          ]"
          class="hover:bg-gray-200"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { legalCode } from '@/assets/logalCode'; // JSON 파일 경로
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
  import { ChevronDownIcon } from '@heroicons/vue/20/solid';
  
  const router = useRouter();

  const selectedSido = ref('');
  const selectedSigugun = ref('');
  const selectedDong = ref('');
  
  const filteredSigugun = ref([]);
  const filteredDong = ref([]);
  
  const isSidoDropdownOpen = ref(false);
  const isSigugunDropdownOpen = ref(false);
  const isDongDropdownOpen = ref(false);

  const currentPage = ref(1); 
  const perPage = ref(4); 
  const totalPages = ref(1); 

  const agents = ref([]);

  const reserveAgent = (agent) => {
  router.push({
    name: 'AgentBookPage', 
  });
};

  const selectSido = (code) => {
    selectedSido.value = code;
    onSidoChange();
    isSidoDropdownOpen.value = false; 
  };

  const selectSigugun = (code) => {
    selectedSigugun.value = code;
    onSigugunChange();
    isSigugunDropdownOpen.value = false; 
  };

  const selectDong = (code) => {
    selectedDong.value = code;
    isDongDropdownOpen.value = false; 
  };

  // 시 군 업데이트
  const onSidoChange = () => {
    selectedSigugun.value = '';
    selectedDong.value = '';
    filteredSigugun.value = legalCode.sigugun.filter( sig => sig.sido === selectedSido.value.sido);
    filteredDong.value = [];

  };

  // 동 업데이트
  const onSigugunChange = () => {
    selectedDong.value = '';
    filteredDong.value = legalCode.dong.filter(dong => 
      dong.sido === selectedSido.value.sido && dong.sigugun === selectedSigugun.value.sigugun
    );
  };

  const onSearchClick = () => {
    currentPage.value = 1
    fetchAgents();
  }

  const fetchAgents = async () => {
    const legalCode = parseInt(selectedSido.value.sido + selectedSigugun.value.sigugun + selectedDong.value.dong + "00");
    try {
      const response = await axios.get(`http://localhost:8080/api/agent/${legalCode}`, {
        params: {
          page: currentPage.value, 
          size: perPage.value, 
        },
        withCredentials: false,
      });
      agents.value = response.data.agents; 
      totalPages.value = response.data.totalPages;
    } catch (error) {
      console.error('에이전트 조회 중 오류 발생:', error);
    }
  };

  const goToPage = async (page) => {
    currentPage.value = page;
    fetchAgents();
  };
  </script>
  
  <style scoped>
  </style>  