<template>
  <div class="reservation-container">
    <h2 class="page-title">예약하기</h2>
    <form class="reservation-form" @submit.prevent="reserve">
      <div class="form-group">
        <label for="name">예약자명</label>
        <input type="text" id="name" v-model="name" placeholder="성함" />
      </div>
      <div class="form-group">
        <label for="phone">예약자 번호</label>
        <input
          type="tel"
          id="phone"
          v-model="phone"
          placeholder="전화번호"
          @input="validatePhone"
        />
        <span v-if="phoneError" class="error-message">{{ phoneError }}</span>
      </div>
      <div class="form-group date-time-group">
        <div class="form-half">
          <label for="date">예약자 일자</label>
          <input type="date" id="date" v-model="date" />
        </div>
        <div class="form-half">
          <label for="time">시간</label>
          <input type="time" id="time" v-model="time" />
        </div>
      </div>
      <button class="reserve-btn" type="submit">
        예약 하기
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const name = ref('');
const phone = ref('');
const date = ref('');
const time = ref('');
const phoneError = ref(null);
const accessToken = ref(null);
const router = useRouter();

const validatePhone = () => {
  const phoneRegex = /^[0-9]*$/;
  phoneError.value = !phoneRegex.test(phone.value)
    ? '숫자 이외의 다른 문자는 입력할 수 없습니다.'
    : null;
};

const handleBooking = async () => {
  try {
    const clientId = import.meta.env.VITE_KAKAO_API_KEY;
    const redirectUri = 'http://localhost:8080/kakao/callback';
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code`;

    // 사용자 정보를 로컬 스토리지에 저장
    localStorage.setItem('userName', name.value);
    localStorage.setItem('userPhone', phone.value);
    localStorage.setItem('bookingDate', date.value);
    localStorage.setItem('bookingTime', time.value);

    window.location.href = kakaoAuthUrl;
  } catch (error) {
    console.error('Booking handling failed', error);
  }
};

const sendMessage = async () => {
  try {
    const token = accessToken.value || localStorage.getItem('kakaoAccessToken');
    const userName = localStorage.getItem('userName');

    if (!token) {
      alert('Access token is missing.');
      return;
    }

    const response = await axios.post(
      'http://localhost:8080/kakao/send-message',
      { userName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert('메시지 전송이 완료되었습니다.');
    router.push('/booking-confirm');
  } catch (error) {
    console.error('메시지 전송 실패:', error);
    alert('메시지 전송에 실패했습니다.');
  }
};

const reserve = () => {
  if (!name.value || !phone.value || !date.value || !time.value || phoneError.value) {
    alert('모든 필드를 올바르게 입력해주세요.');
    return;
  }
  handleBooking();
};

onMounted(() => {
  name.value = localStorage.getItem('userName') || '';

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('accessToken');

  if (token) {
    accessToken.value = token;
    localStorage.setItem('kakaoAccessToken', token);
    sendMessage();
  }
});
</script>

<style scoped>
.reservation-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.reservation-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.date-time-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.form-half {
  flex: 1;
}

.form-half label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-half input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.reserve-btn {
  background: black;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.reserve-btn:hover {
  background: #444;
}
</style>
