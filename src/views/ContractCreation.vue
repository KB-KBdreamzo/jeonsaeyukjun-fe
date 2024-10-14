<template>
    <main class="flex h-screen overflow-hidden">
    <!-- flex: 요소를 Flexbox 레이아웃 설정, h-screen: 요소의 높이를 화면 전체 높이(100vh)로 설정, overflow-hidden: 요소가 화면을 벗어나는 내용이 있을 때 이를 숨김(스크롤이 생기지 않음)-->
        <!-- Left Side: 계약서 작성 섹션 -->
        <section class="border-gray-300 h-full overflow-y-auto overflow-x-hidden w-[480px] lg:w-[480px] sm:w-full shadow-lg">
            <div class="flex flex-col flex-1 max-w-full w-[378px]">
                <header class="flex gap-10 items-center py-8 w-full font-bold">
                    <h1 class="self-stretch my-auto text-5xl tracking-tighter leading-none text-zinc-800 max-md:text-4xl whitespace-nowrap">
                        계약서 작성
                    </h1>
                    <img loading="lazy" 
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/418aa1bebc961b980e6f98c975a408ee93fde73ca20753cda4df25836b836210?apiKey=d111ac40a5bb4ce79c76d09fec0749df&"
                    class="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
                    alt=""
                    @click="openContractModal"
                    style="cursor: pointer;"
                    />
                    <ContractModal v-if="isContractModalOpen" @close="closeContractModal" />
                    <button class="gap-3 self-stretch px-6 py-4 my-auto text-base leading-none text-center text-gray-50 whitespace-nowrap bg-neutral-900 rounded-[90px] max-md:px-5"
                            @click="sendContractData">
                        저장하기
                    </button>
                </header>
                <!-- 입력받은 이름을 LandlordTenantInfo로 전달 -->
                <LandlordTenantInfo 
                    title="집주인 및 세입자"
                    :landlordName="landlordName"
                    :tenantName="tenantName"
                    @update-input="handleInput"
                />
                <PropertyDescription 
                    title="부동산의 표시" 
                    @update-property="handlePropertyInput"
                />
                <LeaseContractContent
                    title="임대차계약의 내용"
                    :leaseStartDate="leaseStartDate"
                    :leaseEndDate="leaseEndDate"
                    @update-lease-dates="handleLeaseDateUpdate"
                    @update-deposit="handleDepositUpdate"
                    @update-unpaid="handleUnpaidUpdate"
                    @update-priority="handlePriorityUpdate"
                />
                <ContractContent
                    title="계약 내용"
                    :depositAmount="depositAmount"
                    @update-payment-dates="handleFinancialDateUpdate"
                    @update-payment-account="handleFinancialInfoUpdate"
                    @update-down-payment="handleFinancialInfoUpdate"
                    @update-interim-payment="handleFinancialInfoUpdate"
                    @update-final-payment="handleFinancialInfoUpdate"
                    @update-management-fee="handleFinancialInfoUpdate"
                    @update-repair-details="handleRepairDetailsUpdate"
                />
                <SpecialContractContent
                    title="특약 사항"
                    :agreement="agreement"
                    :constructionPlan="constructionPlan"
                    :constructionTime="constructionTime"
                    :constructionDuration="constructionDuration"
                    :addressAgreement="addressAgreement"
                />
                
            </div>
        </section>
        
        <!-- Right Side: Contract Display 섹션 -->
        <section class="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden hidden sm:block">
            <div class="sticky top-0 bg-white z-10 border-b border-gray-300 overflow-y-auto h-full">
            <!-- LandlordTenantInfo의 이름을 ContractDisplay에 전달 -->
            <ContractDisplay 
                :landlordName="landlordName" 
                :landlordAddress="landlordAddress"
                :landlordResidentId="landlordResidentId"
                :tenantName="tenantName"
                :tenantAddress="tenantAddress"
                :tenantResidentId="tenantResidentId"
                :propertyAddress="propertyAddress"
                :landUsage="landUsage"
                :landArea=landArea.toString()
                :buildingStructure="buildingStructure"
                :buildingArea=buildingArea.toString()
                :rentalPortion="rentalPortion"
                :rentalArea=rentalArea.toString()
                :leaseStartDate="leaseStartDate"
                :leaseEndDate="leaseEndDate"
                :depositAmount="depositAmount"
                :unpaidNationalAndLocalTax="unpaidNationalAndLocalTax"
                :priorityConfirmedDateDetails="priorityConfirmedDateDetails"
                :paymentAccount="paymentAccount"
                :downPayment="downPayment"
                :interimPayment="interimPayment"
                :interimPaymentDate="interimPaymentDate"
                :finalPayment="finalPayment"
                :finalPaymentDate="finalPaymentDate"
                :managementFee="managementFee"
                :repairDetails="repairDetails"
                :hasAuctionRecord="hasAuctionRecord"
                :hasRegistrationRecord="hasRegistrationRecord"
                :hasTrustRegistrationRecord="hasTrustRegistrationRecord"
                :hasRedemptionRecord="hasRedemptionRecord"
                :hasInjuctionRecord="hasInjuctionRecord"
                :agreement="agreement"
                :constructionPlan="constructionPlan"
                :constructionTime="constructionTime"
                :constructionDuration="constructionDuration"
                :addressAgreement="addressAgreement"
            />
            </div>
        </section>
    </main>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ContractModal from '@/components/contract/ContractModal.vue'
import LandlordTenantInfo from '@/components/contract/LandlordTenantInfo.vue';
import PropertyDescription from '@/components/contract/PropertyDescription.vue';
import LeaseContractContent from '@/components/contract/LeaseContractContent.vue';
import ContractContent from '@/components/contract/ContractContent.vue';
import SpecialContractContent from '@/components/contract/SpecialContractContent.vue';
import ContractDisplay from '@/components/contract/ContractDisplay.vue';

export default defineComponent({
    name: 'ContractCreation',
    components: {
        ContractModal,
        ContractDisplay,
        LandlordTenantInfo,
        PropertyDescription,
        LeaseContractContent,
        ContractContent,
        SpecialContractContent
    },
    setup() {
        // 상태 관리
        const isContractModalOpen = ref(false);

        const landlordName = ref('');
        const landlordAddress = ref('');
        const landlordResidentId = ref('_ _ _ _ _ _ - _ _ _ _ _ _ _');
        const tenantName = ref('');
        const tenantAddress = ref('');
        const tenantResidentId = ref('_ _ _ _ _ _ - _ _ _ _ _ _ _');
        const propertyAddress = ref('');
        const landUsage = ref('');
        const landArea = ref(0.0);
        const buildingStructure = ref('');
        const buildingArea = ref(0.0);
        const rentalPortion = ref('');
        const rentalArea = ref(0.0);
        const contractType = ref('신규 계약')
        const leaseStartDate = ref('');
        const leaseEndDate = ref('');
        const depositAmount = ref(0);
        const unpaidNationalAndLocalTax = ref('없음 (임대인 서명 혹은 날인)');
        const priorityConfirmedDateDetails = ref('없음 (임대인 서명 혹은 날인)');
        const contractConfirmationDate = ref('');
        const paymentAccount = ref('');
        const downPayment = ref('');
        const interimPayment = ref('');
        const interimPaymentDate = ref('');
        const finalPayment = ref('');
        const finalPaymentDate = ref('');
        const managementFee = ref('');
        const repairDetails = ref('');
        const landlordPhone = ref('010 - _ _ _ _ - _ _ _ _')
        const tenantPhone = ref('010 - _ _ _ _ - _ _ _ _')
        const agreement = ref('');
        const constructionPlan = ref('');
        const constructionTime = ref('');
        const constructionDuration = ref(0);
        const addressAgreement = ref('');

        const route = useRoute();
        const reportId = route.params.reportId || 0;

        const hasAuctionRecord = ref(false); // 경매 넘어간 횟수 기록 여부
        const hasRegistrationRecord = ref(false); // 소유권이전청구권가등기 기록 여부
        const hasTrustRegistrationRecord = ref(false); // 신탁 등기 기록 여부
        const hasRedemptionRecord = ref(false); // 환매 특약 내역 기록 여부
        const hasInjuctionRecord = ref(false); // 가처분 내역 기록 여부

        const ownershipInfoDto = ref({});

        const today = new Date();            
        const year = today.getFullYear();    
        const month = today.getMonth() + 1;  
        const day = today.getDate();         

        const firstContractDto = ref({
            landlordName: landlordName.value,
            tenantName: tenantName.value,
            address: propertyAddress.value,
            landType: landUsage.value,
            landArea: landArea.value,
            structurePurpose: buildingStructure.value,
            buildingArea: buildingArea.value,
            leasedPortion: rentalPortion.value,
            leasedPortionArea: rentalArea.value,
            contractType: contractType.value,
            lsSY: '',
            lsSM: '',
            lsSD: '',
            lsEY: '',
            lsEM: '',
            lsED: '',
            unpaidNationalAndLocalTax: unpaidNationalAndLocalTax.value,
            priorityConfirmedDateDetails: priorityConfirmedDateDetails.value,
            contractConfirmationDate: contractConfirmationDate.value,
            paymentAccount: paymentAccount.value,
            depositAmount: depositAmount.value,
            downPayment: downPayment.value,
            interimPayment: interimPayment.value,
            interYear: '',
            interMonth: '',
            interDay: '',
            finalPayment: finalPayment.value,
            finalYear: '',
            finalMonth: '',
            finalDay: '',
            managementFee: managementFee.value,
            repairDetails: repairDetails.value,
            taxAmount: depositAmount.value / 10,
            landlordAddress: landlordAddress.value,
            landlordResidentId: landlordResidentId.value,
            tenantAddress: tenantAddress.value,
            tenantResidentId: tenantResidentId.value,
            todayYear: year,
            todayMonth: month,
            todayDay: day,
            landlordPhone: '010 - _ _ _ _ - _ _ _ _',
            tenantPhone: '010 - _ _ _ _ - _ _ _ _'
        });

        const openContractModal = () => {
            isContractModalOpen.value = true;
        };

        const closeContractModal = () => {
            isContractModalOpen.value = false;
        };

        const updateLeasedStartDto = () => {
            // 날짜 형식이 'YYYY-MM-DD'라고 가정하고 나누기
            const [year, month, day] = leaseStartDate.value.split('-');

            // contractDto에 할당
            firstContractDto.value.lsSY = year;
            firstContractDto.value.lsSM = month;
            firstContractDto.value.lsSD = day;
        };
        const updateLeasedEndDto = () => {
            // 날짜 형식이 'YYYY-MM-DD'라고 가정하고 나누기
            const [year, month, day] = leaseEndDate.value.split('-');

            // contractDto에 할당
            firstContractDto.value.lsEY = year;
            firstContractDto.value.lsEM = month;
            firstContractDto.value.lsED = day;
        };
        const updateInterimDateDto = () => {
            // 날짜 형식이 'YYYY-MM-DD'라고 가정하고 나누기
            const [year, month, day] = interimPaymentDate.value.split('-');

            // contractDto에 할당
            firstContractDto.value.interYear = year;
            firstContractDto.value.interMonth = month;
            firstContractDto.value.interDay = day;
        };
        const updatefinalDateDto = () => {
            // 날짜 형식이 'YYYY-MM-DD'라고 가정하고 나누기
            const [year, month, day] = finalPaymentDate.value.split('-');

            // contractDto에 할당
            firstContractDto.value.finalYear = year;
            firstContractDto.value.finalMonth = month;
            firstContractDto.value.finalDay = day;
        };
        const setTodayDateDto = () => {
            // contractDto에 할당
            firstContractDto.value.todayYear = year;
            firstContractDto.value.todayMonth = month;
            firstContractDto.value.todayDay = day;
        };
        
        const sendContractData = () => {
            updateLeasedStartDto();
            updateLeasedEndDto();
            updateInterimDateDto();
            updatefinalDateDto();
            setTodayDateDto();

            console.log('paymentAccount: ', landArea.value);
            console.log('landlordName: ', landlordName.value);
            const requestData = {
                contractDto: {
                    landlordName: landlordName.value,
                    tenantName: tenantName.value,
                    address: propertyAddress.value,
                    landType: landUsage.value,
                    landArea: landArea.value,
                    structurePurpose: buildingStructure.value,
                    buildingArea: buildingArea.value,
                    leasedPortion: rentalPortion.value,
                    leasedPortionArea: rentalArea.value,
                    contractType: contractType.value,
                    lsSY: firstContractDto.value.lsSY,
                    lsSM: firstContractDto.value.lsSM,
                    lsSD: firstContractDto.value.lsSD,
                    lsEY: firstContractDto.value.lsEY,
                    lsEM: firstContractDto.value.lsEM,
                    lsED: firstContractDto.value.lsED,
                    unpaidNationalAndLocalTax: unpaidNationalAndLocalTax.value,
                    priorityConfirmedDateDetails: priorityConfirmedDateDetails.value,
                    contractConfirmationDate: contractConfirmationDate.value,
                    paymentAccount: paymentAccount.value.valueOf,
                    depositAmount: depositAmount.value,
                    downPayment: downPayment.value.valueOf,
                    interimPayment: interimPayment.value.valueOf,
                    interYear: firstContractDto.value.interYear,
                    interMonth: firstContractDto.value.interMonth,
                    interDay: firstContractDto.value.interDay,
                    finalPayment: finalPayment.value.valueOf,
                    finalYear: firstContractDto.value.finalYear,
                    finalMonth: firstContractDto.value.finalMonth,
                    finalDay: firstContractDto.value.finalDay,
                    managementFee: managementFee.value.valueOf,
                    repairDetails: repairDetails.value.valueOf,
                    taxAmount: depositAmount.value / 10,
                    landlordAddress: landlordAddress.value,
                    landlordResidentId: landlordResidentId.value,
                    tenantAddress: tenantAddress.value,
                    tenantResidentId: tenantResidentId.value,
                    todayYear: firstContractDto.value.todayYear,
                    todayMonth: firstContractDto.value.todayMonth,
                    todayDay: firstContractDto.value.todayDay,
                    landlordPhone: landlordPhone.value,
                    tenantPhone: tenantPhone.value
                },
                ownershipInfoDto: reportId !== 0 ? ownershipInfoDto.value : null
            };
            console.log('ownershipInfoData.value: ', ownershipInfoDto.value);
            axios.post('http://localhost:8080/api/contract/generate', requestData)
                .then(response => {
                    console.log('성공적으로 보냈습니다:', response.data);
                })
                .catch(error => {
                    console.error('데이터 전송 중 오류 발생:', error);
                });
        };

        const fetchAuctionRecord = async () => {
            try {
                if (reportId == 0) {
                    console.log("reportId가 0이므로 GET 요청을 생략합니다.");
                    return; // reportId가 0이면 API 호출 생략
                }
                
                console.log('start get ownership-info');
                const response = await axios.get(`http://localhost:8080/api/contract/ownership-info/${reportId}`);
                console.log('Response data: ', response.data);
                hasAuctionRecord.value = response.data.auctionRecord;
                hasRegistrationRecord.value = response.data.registrationRecord;
                hasTrustRegistrationRecord.value = response.data.trustRegistrationRecord;
                hasRedemptionRecord.value = response.data.redemptionRecord;
                hasInjuctionRecord.value = response.data.injuctionRecord;
                console.log('hasAuctionRecord: ', hasAuctionRecord.value)
                console.log('hasRegistrationRecord: ', hasRegistrationRecord.value)
                console.log('hasTrustRegistrationRecord: ', hasTrustRegistrationRecord.value)
                console.log('hasRedemptionRecord: ', hasRedemptionRecord.value)
                console.log('hasInjuctionRecord: ', hasInjuctionRecord.value)

                ownershipInfoDto.value = {
                    reportId: reportId,
                    auctionRecord: response.data.auctionRecord,
                    registrationRecord: response.data.registrationRecord,
                    trustRegistrationRecord: response.data.trustRegistrationRecord,
                    redemptionRecord: response.data.redemptionRecord,
                    injuctionRecord: response.data.injuctionRecord,
                    seizureCount: 0,
                    provisionalSeizureCount: 0
                }
                console.log('end get ownershipInfoDto: ', ownershipInfoDto.value);

            } catch (error) {
                console.error('error fetching auction record:', error);
            }
        };

        onMounted(() => {
            fetchAuctionRecord();
        })

        const handleInput = (type: string, value: string) => {
            if (type === 'landlord') {
                landlordName.value = value;
            } else if (type === 'landlordAddress') {
                landlordAddress.value = value;
            } else if (type === 'landlordResidentId') {
                landlordResidentId.value = value;
            } else if (type === 'tenant') {
                tenantName.value = value;
            } else if (type === 'tenantAddress') {
                tenantAddress.value = value;
            } else if (type === 'tenantResidentId') {
                tenantResidentId.value = value;
            }
        };

        const handlePropertyInput = (type: string, value: string) => {
            if (type === 'propertyAddress') {
                propertyAddress.value = value;
            } else if (type === 'landUsage') {
                landUsage.value = value;
            } else if (type === 'landArea') {
                landArea.value = Number(value);
            } else if (type === 'buildingStructure') {
                buildingStructure.value = value;
            } else if (type === 'buildingArea') {
                buildingArea.value = Number(value);
            } else if (type === 'rentalPortion') {
                rentalPortion.value = value;
            } else if (type === 'rentalArea') {
                rentalArea.value = Number(value);
            }
        };

        const handleLeaseDateUpdate = ({type, value}: {type: string, value: string}) => {
            if (type === 'leaseStartDate') {
                leaseStartDate.value = value;
            } else if (type === 'leaseEndDate') {
                leaseEndDate.value = value;
            }
        };

        const handleDepositUpdate = (value: number) => {
            depositAmount.value = value;
        };

        const handleUnpaidUpdate = (value: string) => {
            unpaidNationalAndLocalTax.value = value === '' ? '없음 (임대인 서명 또는 날인)' : value;
        };

        const handlePriorityUpdate = (value: string) => {
            priorityConfirmedDateDetails.value = value === '' ? '없음 (임대인 서명 또는 날인)' : value;
        };

        const handleFinancialDateUpdate = ({type, value}: {type: string, value: string}) => {
            if (type === 'interimPaymentDate') {
                interimPaymentDate.value = value;
            } else if (type === 'finalPaymentDate') {
                finalPaymentDate.value = value;
            }
        };

        const handleFinancialInfoUpdate = ({type, value}: {type: string, value: string}) => {
            if (type === 'paymentAccount') {
                paymentAccount.value = value;
            } else if (type === 'downPayment') {
                downPayment.value = value;
            } else if (type === 'interimPayment') {
                interimPayment.value = value;
            } else if (type === 'finalPayment') {
                finalPayment.value = value;
            } else if (type === 'managementFee') {
                managementFee.value = value;
            }
        };

        const handleRepairDetailsUpdate = ({type, value}: {type: string, value: string}) => {
            if (type === 'repairDetails') {
                repairDetails.value = value;
            }
        };

        return {
            isContractModalOpen,
            landlordName,
            landlordAddress,
            landlordResidentId,
            tenantName,
            tenantAddress,
            tenantResidentId,
            propertyAddress,
            landUsage,
            landArea,
            buildingStructure,
            buildingArea,
            rentalPortion,
            rentalArea,
            leaseStartDate,
            leaseEndDate,
            depositAmount,
            unpaidNationalAndLocalTax,
            priorityConfirmedDateDetails,
            paymentAccount,
            downPayment,
            interimPayment,
            interimPaymentDate,
            finalPayment,
            finalPaymentDate,
            managementFee,
            repairDetails,
            landlordPhone,
            tenantPhone,
            agreement,
            constructionPlan,
            constructionTime,
            constructionDuration,
            addressAgreement,
            hasAuctionRecord,
            hasRegistrationRecord,
            hasTrustRegistrationRecord,
            hasRedemptionRecord,
            hasInjuctionRecord,
            openContractModal,
            closeContractModal,
            sendContractData,
            handleInput,
            handlePropertyInput,
            handleLeaseDateUpdate,
            handleDepositUpdate,
            handleUnpaidUpdate,
            handlePriorityUpdate,
            handleFinancialDateUpdate,
            handleFinancialInfoUpdate,
            handleRepairDetailsUpdate
        };
    }
});
</script>