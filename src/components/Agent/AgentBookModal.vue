<template>
    <div class="modal-container">
      <div class="modal-content">
        <h2 class="modal-title">예약하기</h2>
        <button class="modal-close-btn" @click="closeModal">X</button>
  
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
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        phone: '',
        date: '',
        time: '',
        phoneError: null,
      };
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      validatePhone() {
        const phoneRegex = /^[0-9]*$/;
        if (!phoneRegex.test(this.phone)) {
          this.phoneError = '숫자 이외의 다른 문자는 입력할 수 없습니다.';
        } else {
          this.phoneError = null;
        }
      },
      reserve() {
        if (!this.phoneError) {
          // 예약 로직 추가
          console.log('예약 정보:', {
            name: this.name,
            phone: this.phone,
            date: this.date,
            time: this.time,
          });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    width: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
  }
  
  .modal-title {
    font-size: 18px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .modal-close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
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
  