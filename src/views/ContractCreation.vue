<template>
    <!-- <main class="flex overflow-hidden flex-row items-start bg-white"> -->
    <!-- <main class="grid grid-cols-1 md:grid-cols-[480px_1fr] h-screen bg-white"> -->
    <main class="grid grid-cols-[480px_1fr] hscreen">

        <!-- Left Side: 계약서 작성 섹션 -->
        <!-- <section class="flex left-0 flex-col justify-between items-center p-5 max-w-full bg-white shadow-[4px_0px_15px_rgba(0,0,0,0.15)] w-[480px]"> -->
        <section class="fixed left-0 top-0 md:w-[calc(50%-80px)] h-full p-4 border border-gray-300 overflow-y-auto ml-[80px]">

            <div class="flex flex-col flex-1 max-w-full w-[378px]">
                <header class="flex gap-10 items-center py-8 w-full font-bold">
                    <h1 class="self-stretch my-auto text-5xl tracking-tighter leading-none text-zinc-800 max-md:text-4xl whitespace-nowrap">
                        계약서 작성
                    </h1>
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
                />
            </div>
        </section>
        
        <!-- Right Side: Contract Display 섹션 -->
        <!-- <section class="w-full p-4 border border-gray-300 h-screen"> -->
        <section class="fixed right-0 top-0 md:w-1/2 h-full p-4 border border-gray-300 overflow-y-auto">
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
                :landArea="landArea"
                :buildingStructure="buildingStructure"
                :buildingArea="buildingArea"
                :rentalPortion="rentalPortion"
                :rentalArea="rentalArea"
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
            />
            </div>
        </section>
    </main>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, toRaw } from 'vue';
import axios from 'axios';
import LandlordTenantInfo from '@/components/contract/LandlordTenantInfo.vue';
import PropertyDescription from '@/components/contract/PropertyDescription.vue';
import LeaseContractContent from '@/components/contract/LeaseContractContent.vue';
import ContractContent from '@/components/contract/ContractContent.vue';
import SpecialContractContent from '@/components/contract/SpecialContractContent.vue';
import ContractDisplay from '@/components/contract/ContractDisplay.vue';

export default defineComponent({
    name: 'ContractCreation',
    components: {
        ContractDisplay,
        LandlordTenantInfo,
        PropertyDescription,
        LeaseContractContent,
        ContractContent,
        SpecialContractContent
    },
    setup() {
        // 상태 관리
        const landlordName = ref('');
        const landlordAddress = ref('');
        const landlordResidentId = ref('');
        const tenantName = ref('');
        const tenantAddress = ref('');
        const tenantResidentId = ref('');
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
        const unpaidNationalAndLocalTax = ref('');
        const priorityConfirmedDateDetails = ref('');
        const contractConfirmationDate = ref('');
        const paymentAccount = ref('');
        const downPayment = ref('');
        const interimPayment = ref('');
        const interimPaymentDate = ref('');
        const finalPayment = ref('');
        const finalPaymentDate = ref('');
        const managementFee = ref('');
        const repairDetails = ref('');

        const reportId = 1;
        const hasAuctionRecord = ref(false); // 경매 넘어간 횟수 기록 여부
        const hasRegistrationRecord = ref(false); // 소유권이전청구권가등기 기록 여부
        const hasTrustRegistrationRecord = ref(false); // 신탁 등기 기록 여부
        const hasRedemptionRecord = ref(false); // 환매 특약 내역 기록 여부
        const hasInjuctionRecord = ref(false); // 가처분 내역 기록 여부

        const ownershipInfoDto = ref({});

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
            todayYear: '',
            todayMonth: '',
            todayDay: '' 
        });

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
            // 날짜 형식이 'YYYY-MM-DD'라고 가정하고 나누기
            const today = new Date();
            const year = today.getFullYear(); // 연도
            const month = today.getMonth() + 1; // 월 (0부터 시작하므로 1 더해줌)
            const day = today.getDate(); // 일

            // contractDto에 할당
            firstContractDto.value.todayYear = year;
            firstContractDto.value.todayMonth = month;
            firstContractDto.value.todayDay = day;
        };
        // 함수들
        const sendContractData = () => {
            updateLeasedStartDto();
            updateLeasedEndDto();
            updateInterimDateDto();
            updatefinalDateDto();
            setTodayDateDto();
            // const contractDto = {
            //     landlordName: landlordName.value,
            //     tenantName: tenantName.value,
            // }

            // const requestData = {
            //     contractDto,
            //     ownershipInfoDto: ownershipInfoDto.value
            // }
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
                    paymentAccount: paymentAccount.value._rawValue,
                    depositAmount: depositAmount.value,
                    downPayment: downPayment.value._rawValue,
                    interimPayment: interimPayment.value._rawValue,
                    interYear: firstContractDto.value.interYear,
                    interMonth: firstContractDto.value.interMonth,
                    interDay: firstContractDto.value.interDay,
                    finalPayment: finalPayment.value._rawValue,
                    finalYear: firstContractDto.value.finalYear,
                    finalMonth: firstContractDto.value.finalMonth,
                    finalDay: firstContractDto.value.finalDay,
                    managementFee: managementFee.value._rawValue,
                    repairDetails: repairDetails.value._rawValue,
                    taxAmount: depositAmount.value / 10,
                    landlordAddress: landlordAddress.value,
                    landlordResidentId: landlordResidentId.value,
                    tenantAddress: tenantAddress.value,
                    tenantResidentId: tenantResidentId.value,
                    todayYear: firstContractDto.value.todayYear,
                    todayMonth: firstContractDto.value.todayMonth,
                    todayDay: firstContractDto.value.todayDay,
                },
                ownershipInfoDto: ownershipInfoDto.value,
            };
            console.log('ownershipInfoData.value: ', ownershipInfoDto.value);
            axios.post('http://localhost:8787/contract/generate', requestData)
                .then(response => {
                    console.log('성공적으로 보냈습니다:', response.data);
                })
                .catch(error => {
                    console.error('데이터 전송 중 오류 발생:', error);
                });
        };

        const fetchAuctionRecord = async () => {
            try {
                const response = await axios.get(`http://localhost:8787/contract/ownership-info/${reportId}`);
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
                landArea.value = value;
            } else if (type === 'buildingStructure') {
                buildingStructure.value = value;
            } else if (type === 'buildingArea') {
                buildingArea.value = value;
            } else if (type === 'rentalPortion') {
                rentalPortion.value = value;
            } else if (type === 'rentalArea') {
                rentalArea.value = value;
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
            unpaidNationalAndLocalTax.value = value;
        };

        const handlePriorityUpdate = (value: string) => {
            priorityConfirmedDateDetails.value = value;
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
            hasAuctionRecord,
            hasRegistrationRecord,
            hasTrustRegistrationRecord,
            hasRedemptionRecord,
            hasInjuctionRecord,
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