<template>
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">우리 동네 공인중개사 찾기</h1>
        <div class="flex space-x-4">
          <!-- 시 드롭다운 -->
          <Menu as="div" class="relative text-left">
            <div>
              <MenuButton class="flex justify-between w-36 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="toggleSidoDropdown">
                {{ selectedSido.codeNm ? selectedSido.codeNm : '시 선택' }}
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>
  
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-for="code in hangjungdong.sido" :key="code.sido" v-slot="{ active }">
                    <a href="#" @click="selectSido(code)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">{{ code.codeNm }}</a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
  
          <!-- 군 드롭다운 -->
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="inline-flex justify-between w-36 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="toggleSigugunDropdown">
                {{ selectedSigugun.codeNm ? selectedSigugun.codeNm : '군 선택' }}
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>
  
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
              <MenuButton class="inline-flex justify-between w-36 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="toggleDongDropdown">
                {{ selectedDong.codeNm ? selectedDong.codeNm : '동 선택' }}
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>
  
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-for="code in filteredDong" :key="code.dong" v-slot="{ active }">
                    <a href="#" @click="selectDong(code)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">{{ code.codeNm }}</a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
          <button @click="fetchAgents" class="w-12 flex items-center bg-black rounded-md px-3 py-1">
            <img src="/src/assets/searchIconWhite.png" alt="Search" class="h-6 w-6" />
          </button>
        </div>
      </div>
      {{ selectedSido}} {{ selectedSigugun  }} {{selectedDong}}
  
      <div v-for="agent in agents" :key="agent.bzmn_conm" class="mb-4 p-4 border rounded-lg shadow-md">
        <div class="flex items-center">
          <div>
            <h2 class="font-semibold">{{ agent.bzmn_conm }}</h2>
            <div class="flex flex-row">
              <img src="/src/assets/locationPin.png" alt="Location Icon" class="w-6 h-6 mr-2" />
              <p class="text-gray-600">{{ agent.addr }}</p>
            </div>
            <p class="text-gray-600">{{ agent.telno }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { hangjungdong } from '@/assets/hangjungdong.js'; // JSON 파일 경로
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
  import { ChevronDownIcon } from '@heroicons/vue/20/solid';
  
  const selectedSido = ref('');
  const selectedSigugun = ref('');
  const selectedDong = ref('');
  
  const filteredSigugun = ref([]);
  const filteredDong = ref([]);
  
  const isSidoDropdownOpen = ref(false);
  const isSigugunDropdownOpen = ref(false);
  const isDongDropdownOpen = ref(false);
  const agents = ref([]);

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
    filteredSigugun.value = hangjungdong.sigugun.filter( sig => sig.sido === selectedSido.value.sido);
    filteredDong.value = [];

  };

  // 동 업데이트
  const onSigugunChange = () => {
    selectedDong.value = '';
    filteredDong.value = hangjungdong.dong.filter(dong => 
      dong.sido === selectedSido.value.sido && dong.sigugun === selectedSigugun.value.sigugun
    );
  };

  const fetchAgents = async () => {
    // 행정동 코드 조합
    const legalCode = 1120011200;
    
    try {
      const response = await axios.get(`http://localhost:8088/api/agent/${legalCode}`);
      console.log(response.data);
      agents.value = response.data; 
    } catch (error) {
      console.error('에이전트 조회 중 오류 발생:', error);
    }
  };

  </script>
  
  <style scoped>
  </style>  