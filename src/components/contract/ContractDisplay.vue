<template>
    <div class="p-4 border border-gray-300">
        <h2 class="text-xl font-bold mb-4 text-center">주택임대차표준계약서(전세)</h2>
        <div v-if="landlordName || tenantName" class="text-center">
            <p>임대인({{ landlordName || "______" }})와(과) 임차인({{ tenantName || "______" }})은(는) 아래와 같이 임대차 계약을 체결한다.</p>
        </div>
        <div v-if="propertyAddress || landUsage || landArea || buildingStructure || buildingArea || rentalPortion || rentalArea" class="mt-4">
            <h3 class="text-lg font-semibold">임차주택의 표시</h3>
            <p>소재지 : {{ propertyAddress || "______" }}</p>
            <p>토지 - 지목 : {{ landUsage || "______" }}, 면적 : {{ landArea || "______" }}</p>
            <p>건물 - 구조/용도: {{ buildingStructure || "______" }}, 면적 : {{ buildingArea || "______" }}</p>
            <p>임차할 부분 : {{ rentalPortion || "______" }}, 면적 : {{ rentalArea || "______" }}</p>
            <p>계약의 종류 : 신규 계약</p>
        </div>
        <div v-if="leaseStartDate || leaseEndDate || depositAmount || unpaidNationalAndLocalTax || priorityConfirmedDateDetails">
            <p>* 갱신 전 임대차계약 기간 및 금액</p>
            <p>계약 기간 : {{ leaseStartDate || "______" }} ~ {{ leaseEndDate || "______" }}, 보증금 : {{ depositAmount || "______" }}원 </p>
            <p>미납 국세/지방세 : {{ unpaidNationalAndLocalTax || "없음" }} (임대인 서명 또는 날인)</p>
            <p>선순위 확정일자 현황 : {{ priorityConfirmedDateDetails || "없음" }} (임대인 서명 또는 날인)</p>
            <p>확정일자 부여란 :</p>
        </div>
        <div v-if="paymentAccount || downPayment || interimPayment || interimPaymentDate || finalPayment || finalPaymentDate || managementFee || repairDetails" class="mt-4">
            <h3 class="text-lg font-semibold">계약 내용</h3>
            <p>제1조(보증금과 차임 및 관리비) : 위 부동산의 임대차에 관하여 임대인과 임차인은 합의에 의하여 보증금과 차임 및 관리비를 아래와 같이 지불하기로 한다.</p>
            <p>보증금 : 금 {{ depositAmount || "______" }} 원정 (입금계좌 : {{ paymentAccount || "______" }})</p>
            <p>계약금 : 금 {{ downPayment || "______" }} 원정은 계약시에 지불하고 영수함. 영수자 ({{ landlordName || "______" }} 인)</p>
            <p>중도금 : 금 {{ interimPayment || "______" }} 원정은 {{ interimPaymentDate || "______" }} 에 지불하며</p>
            <p>잔  금 : 금 {{ finalPayment || "______" }} 원정은 {{ finalPaymentDate || "______" }} 에 지불한다.</p>
            <p>관리비 : 금 {{ managementFee || "______" }} 원정</p>
            <br>
            <p>제2조(임대차기간) : 임대인은 임차주택을 임대차 목적대로 사용/수익할 수 있는 상태로</p>
            <p>{{ leaseStartDate || "______" }} 까지 임차인에게 인도하고, 임대차기간은 인도일로부터</p>
            <p>{{ leaseEndDate || "______" }} 까지로 한다.</p>
            <br>
            <p>제3조(입주 전 수리) : 임대인과 임차인은 임차주택의 수리가 필요한 시설물 및 비용부담에 관하여 다음과 같이 합의한다.</p>
            <p>수리 필요 시설 : 수리할 내용 : {{ repairDetails || "없음" }}</p>
            <p>수리 완료 시기 : 잔금지급 기일인 {{ finalPaymentDate || "______" }} 까지</p>
            <p>약정한 수리 완료 시기까지 미 수리한 경우 : 수리비를 임차인이 임대인에게 지급하여야 할 보증금 또는 차임에서 공제하고 수리완료 기한까지 수리가 이루어지지 않는 경우, 임차인은 전세금의 0.1%에 해당하는 금액을 하루 단위로 손해배상금으로 청구할 수 있으며, 이는 매일 계산된다.</p>
            <br>
            <p>제4조(임차주택의 사용/관리/수선) : ① 임차인은 임대인의 동의 없이 임차주택의 구조변경 및 전대나 임차권 양도를 할 수 없으며, 임대차 목적인 주거 이외의 용도로 사용할 수 없다.</p>
            <p>② 임대인은 계약 존속 중 임차주택을 사용/수익에 필요한 상태로 유지하여야 하고, 임차인은 임대인이 임차주택의 보존에 필요한 행위를 하는 때 이를 거절하지 못한다.</p>
            <p>③ 임대인과 임차인은 계약 존속 중에 발생하는 임차주택의 수리 및 비용부담에 관하여 다음과 같이 합의한다. 다만, 합의되지 아니한 기타 수선비용에 관한 부담은 민법, 판례 기타 관습에 따른다.</p>
            <p>임대인 부담 : 난방, 상/하수도, 전기시설 등 임차주택의 주요설비에 대한 노후/불량으로 인한 수선은 민법 제 623조 판례상 임대인이 부담한다.</p>
            <p>임차인 부담 : 임차인의 고의/과실에 기한 파손, 전구 등 통상의 간단한 수선, 소모품 교체 비용은 민법제 623조 판례상 임차인이 부담한다.</p>
            <p>④ 임차인이 임대인의 부담에 속하는 수선비용을 지출할 때에는 임대인에게 그 상환을 청구할 수 있다.</p>
            <br>
            <p>제5조(계약의 해제) : 임차인이 임대인에게 중도금(중도금이 없을 때는 잔금)을 지급하기 전까지, 임대인은 계약금의 배액을 상환하고, 임차인은 계약금을 포기하고 이 계약을 해제할 수 있다.</p>
            <br>
            <p>제6조(채무불이행과 손해배상) : 당사자 일방이 채무를 이행하지 아니하는 때에는 상대방은 상당한 기간을 정하여 그 이행을 최고하고 계약을 해제할 수 있으며, 그로 인한 손해배상을 청구할 수 있다. 다만,채무자가 미리 이행하지 아니할 의사를 표시한 경우의 계약해제는 최고를 요하지 아니한다.</p>
            <br>
            <p>제7조(계약의 해지) : ① 임차인은 본인의 과실 없이 임차주택의 일부가 멸실 기타 사유로 인하여 임대차의 목적대로 사용할 수 없는 경우에는 계약을 해지할 수 있다.</p>
            <p>② 임대인은 임차인이 2기의 차임액에 달하도록 연체하거나, 제 4조 제1항을 위반한 경우 계약을 해지할수 있다.</p>
            <br>
            <p>제8조(갱신요구와 거절) : ① 임차인은 임대차기간이 끝나기 6개월 전부터 2개월 전까지의 기간에 계약갱신을 요구할 수 있다. 다만, 임대인은 자신 또는 그 직계존속/직계비속의 실거주 등 주택임대차보호법제 6조의3 제1항 각 호의 사유가 있는 경우에 한하여 계약갱신의 요구를 거절할 수 있다.</p>
            <p>② 임대인이 주택임대차보호법 제 6조의3 제1항 제8호에 따른 실거주를 사유로 갱신을 거절하였음에도 불구하고 갱신요구가 거절되지 아니하였더라면 갱신되었을 기간이 만료되기 전에 정당한 사유 없이 제3자에게 주택을 임대한 경우, 임대인은 갱신거절로 인하여 임차인이 입은 손해를 배상하여야 한다.</p>
            <p>③ 제2항에 따른 손해배상액은 주택임대차보호법 제 6조의3 제6항에 의한다.</p>
            <br>
            <p>제9조(계약의 종료) 임대차계약이 종료된 경우에 임차인은 임차주택을 원래의 상태로 복구하여 임대인에게 반환하고, 이와 동시에 임대인은 보증금을 임차인에게 반환하여야 한다. 다만, 시설물의 노후화나 통상 생길 수 있는 파손 등은 임차인의 원상복구의무에 포함되지 아니한다.</p>
            <br>
            <p>제10조(비용의 정산) ① 임차인은 계약종료 시 공과금과 관리비를 정산하여야 한다.</p>
            <p>② 임차인은 이미 납부한 관리비 중 장기수선충당금을 임대인(소유자인 경우)에게 반환 청구할 수 있다. 다만, 관리사무소 등 관리주체가 장기수선충당금을 정산하는 경우에는 그 관리주체에게 청구할 수 있다.</p>
            <br>
            <p>제11조(분쟁의 해결) 임대인과 임차인은 본 임대차계약과 관련한 분쟁이 발생하는 경우, 당사자 간의 협의 또는 주택임대차분쟁조정위원회의 조정을 통해 호혜적으로 해결하기 위해 노력한다.</p>
        </div>
        <!-- <p>hasAuctionRecord: {{ hasAuctionRecord }}</p>
        <p>hasRegistrationRecord: {{ hasRegistrationRecord }}</p> -->
        <div v-if="hasAuctionRecord || hasRegistrationRecord || hasTrustRegistrationRecord || hasRedemptionRecord || hasInjuctionRecord" class="mt-4 mb-4">
            <h3 class="text-lg font-semibold">특약 사항</h3>
        </div>
        <div v-if="finalPaymentDate">
            <p>- 주택을 인도받은 임차인은 {{ finalPaymentDate || "______" }}일까지 주민등록(전입신고)과 주택임대차계약서상 확정일자를 받기로 하고, 임대인은 위 약정일자의 다음날까지 임차주택에 저당권 등 담보권을 설정할 수 없다.</p>
            <br>
            <p>- 임대인이 위 특약에 위반하여 임차주택에 저당권 등 담보권을 설정한 경우에는 임차인은 임대차 계약을 해제 또는 해지할 수 있다. 이 경우 임대인은 임차인에게 위 특약 위반으로 인한 손해를 배상하여야 한다.</p>
            <br>
            <p>- 임대차계약을 체결한 임차인은 임대차계약 체결 시를 기준으로 임대인이 사전에 고지하지 않은 선순위 임대차정보(주택임대차보호법 제 3조의6 제3항)가 있거나 미납 또는 체납한 국세/지방세가 {{ taxAmount || "______"}}원을 초과하는 것을 확인한 경우 임대차기간이 시작하는 날까지 제 5조에도 불구하고 계약금 등의 명목으로 임대인에게 교부한 금전 기타 물건을 포기하지 않고 임대차계약을 해제할 수 있다.</p>
            <br>
            <p>- 주택 임대차 계약과 관련하여 분쟁이 있는 경우 임대인 또는 임차인은 법원에 소를 제기하기 전에 먼저 임대차분쟁조정위원회에 조정을 신청한다 ( □ 동의 □ 미동의)</p>
            <p>  ※ 주택임대차분쟁조정위원회 조정을 통할 경우 60일(최대 90일) 이내 신속하게 조정 결과를 받아볼 수 있습니다.</p>
            <br>
            <p>- 주택의 철거 또는 재건축에 관한 구체적 계획</p>
            <p>  ( □ 없음 □ 있음 ※공사시기 : ※ 소요기간 : 개월)</p>
            <br>
            <p>- 상세주소가 없는 경우 임차인의 상세주소부여 신청에 대한 소유자 동의여부 ( □ 동의 □ 미동의)</p>
            <br>
        </div>
        <div v-if="hasAuctionRecord">
            <p>- 임대인은 계약 체결 후 7일 이내에 부동산의 상태를 전문가를 통해 진단하고 점검해야 하며, 그 결과를 임차인에게 서면으로 제공해야 한다. 만약 임대인이 최근에 이미 진단하고 점검한 내역이 있을 경우, 해당 내역을 서면으로 임차인에게 제공해야 하며, 이 내역은 계약서의 부속 문서로 참조될 수 있다. 진단 및 점검에 소요되는 비용은 임대인이 부담한다.</p>
            <br>
            <p>- 임대인은 하자 보수 작업을 완료한 후, 보수 작업의 적절함을 보증하며, 추가 문제가 발생할 경우 즉시 추가 보수를 실시해야 한다.</p>
            <br>
        </div>
        <div v-if="hasRegistrationRecord">
            <p>- 임대인은 본 계약 체결일로부터 30일 이내에 순위보전 가등기를 완료해야 합니다. 임대인이 이 기한을 초과할 경우, 임차인은 본 계약을 해제할 수 있으며, 임대인은 임차인에게 추가 비용 및 손해를 보상할 책임이 있습니다.</p>
            <br>
            <p>- 임대인이 본등기 완료를 위한 사유로 기한 연장을 요청하는 경우, 임차인은 합리적인 사유가 있을 때 이를 승인할 수 있으며, 연장된 기한 내에 본등기가 완료되어야 합니다.</p>
            <br>
        </div>
        <div v-if="hasTrustRegistrationRecord">
            <p>- 임대인은 임차인의 잔금과 동시에 신탁등기 말소 신청을 완료하며, 말소 완료 서류를 임차인에게 제출해야 한다.</p>
            <br>
            <p>- 임대인이 입주일 당일 말소 신청을 완료하지 않을 경우 계약은 해지되며, 임대인은 해지 통보일로부터 30일 이내에 임차인의 보증금 전액을 반환하고, 이에 대한 손해배상금을 지급한다. 손해배상금은 임차인의 실제 손해액(입주 지연으로 인한 주거비 및 이전 비용 등)을 기준으로 한다.</p>
            <br>
        </div>
        <div v-if="hasRedemptionRecord">
            <p>- 매도인은 환매 권리를 행사할 경우, 임대인은 해지 통보일로부터 30일 이내에 임차인에게 서면으로 통보해야 합니다. 통보는 환매 권리 행사 후 7일 이내에 이루어져야 하며, 통보를 받은 날로부터 30일 이내에 전세 계약은 해지됩니다.</p>
            <br>
            <p>- 환매 권리 행사로 인해 계약이 해지될 경우, 임대인은 해지 통보일로부터 30일 이내에 임차인에게 보증금 전액을 반환해야 합니다. 보증금 반환 시, 반환 지연이 발생할 경우 일일 이자율을 적용한 지연손해금을 추가로 지급해야 합니다.</p>
            <br>
            <p>- 보증금 반환 외에, 환매 권리 행사로 인해 임차인이 입주 지연으로 인한 주거비 및 이전 비용 등 실제 손해를 입은 경우, 임대인은 이 입증된 손해를 기준으로 추가 손해배상금을 지급해야 합니다. 손해배상금의 지급 기준과 금액은 임차인이 입증한 손해액에 따라 결정됩니다.</p>
            <br>
        </div>
        <div v-if="hasInjuctionRecord">
            <p>- 임대인은 전세 계약 체결 전에 부동산에 설정된 가처분을 해제해야 하며, 가처분 해제 증명서를 임차인에게 제공해야 합니다. 만약 가처분이 해제되지 않는 경우, 임대인은 가처분에 대한 내용을 계약서에 명시하고 임차인의 동의를 받아야 합니다.</p>
            <br>
            <p>- 만약 계약 체결 후 가처분이 새로 설정되거나 기존 가처분이 해제되지 않는 경우, 임차인은 계약 해지를 요구할 수 있습니다. 이 경우 임대인은 해지 통보일로부터 30일 이내에 임차인에게 보증금을 전액 반환해야 합니다. 반환 지연 시 일일 이자율을 적용한 지연손해금을 추가로 지급해야 합니다.</p>
            <br>
            <p>- 가처분으로 인해 임차인이 입주 지연, 주거비 발생, 이전 비용 등 실제 손해를 입은 경우, 임대인은 이 손해를 입증한 금액에 대해 손해배상금을 지급해야 합니다. 손해배상금은 입증된 손해액에 따라 결정되며, 임대인은 손해배상과 관련된 서류를 임차인에게 제공해야 합니다.</p>
            <br>
        </div>
        <div class="mt-4">
            <p>본 계약을 증명하기 위하여 계약 당사자가 이의 없음을 확인하고 각각 서명/날인 후 임대인, 임차인은 매 장마다 간인하여, 각각 1통씩 보관한다.</p>
            <br>
        </div>
        <div v-if="landlordAddress || landlordResidentId || tenantAddress || tenantResidentId" class="mt-4">
            <p>임대인 - 주소 : {{ landlordAddress || "______"}} , 서명 또는 날인</p>
            <br>
            <p>주민등록번호 : {{ landlordResidentId || "_ _ _ _ _ _"}} - _ _ _ _ _ _ _, 전화 : 010 - _ _ _ _ - _ _ _ _, 성명 : {{ landlordName }}</p>
            <br>
            <p>임차인 - 주소 : {{ tenantAddress || "______"}} , 서명 또는 날인</p>
            <br>
            <p>주민등록번호 : {{ tenantResidentId || "_ _ _ _ _ _"}} - _ _ _ _ _ _ _, 전화 : 010 - _ _ _ _ - _ _ _ _, 성명 : {{ tenantName }}</p>
            <br>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
        landlordName: {
            type: String,
            default: ''
        },
        landlordAddress: {
            type: String,
            default: ''
        },
        landlordResidentId: {
            type: String,
            default: ''
        },
        tenantName: {
            type: String,
            default: ''
        },
        tenantAddress: {
            type: String,
            default: ''
        },
        tenantResidentId: {
            type: String,
            default: ''
        },
        propertyAddress: {
            type: String,
            default: ''
        },
        landUsage: {
            type: String,
            default: ''
        },
        landArea: {
            type: String,
            default: ''
        },
        buildingStructure: {
            type: String,
            default: ''
        },
        buildingArea: {
            type: String,
            default: ''
        },
        rentalPortion: {
            type: String,
            default: ''
        },
        rentalArea: {
            type: String,
            default: ''
        },
        leaseStartDate: {
            type: String,
            default: ''
        },
        leaseEndDate: {
            type: String,
            default: ''
        },
        depositAmount: {
            type: Number,
            default: 0
        },
        unpaidNationalAndLocalTax: {
            type: String,
            default: '없음'
        },
        priorityConfirmedDateDetails: {
            type: String,
            default: '없음'
        },
        paymentAccount: {
            type: String,
            default: ''
        },
        downPayment: {
            type: String,
            default: ''
        },
        interimPayment: {
            type: String,
            default: ''
        },
        interimPaymentDate: {
            type: String,
            default: ''
        },
        finalPayment: {
            type: String,
            default: ''
        },
        finalPaymentDate: {
            type: String,
            default: ''
        },
        managementFee: {
            type: String,
            default: ''
        },
        repairDetails: {
            type: String,
            default: ''
        },
        hasAuctionRecord: {
            type: Boolean,
            default: false
        },
        hasRegistrationRecord: {
            type: Boolean,
            default: false
        },
        hasTrustRegistrationRecord: {
            type: Boolean,
            default: false
        },
        hasRedemptionRecord: {
            type: Boolean,
            default: false
        },
        hasInjuctionRecord: {
            type: Boolean,
            default: false
        }
    }
  }
  </script>
  