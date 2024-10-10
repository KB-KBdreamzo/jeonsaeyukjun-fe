// store/contractStore.ts
import { defineStore } from 'pinia';

export const useContractStore = defineStore('contract', {
    state: () => ({
        landlordName: '',
        tenantName: '',
        propertyAddress: '',
        landUsage: '',
        landArea: '',
        buildingStructure: '',
        buildingArea: '',
        rentalPortion: '',
        rentalArea: '',
        leaseStartDate: '',
        leaseEndDate: '',
        depositAmount: '',
        unpaidNationalAndLocalTax: '',
        priorityConfirmedDateDetails: '',
        paymentAccount: '',
        downPayment: '',
        interimPayment: '',
        interimPaymentDate: '',
        finalPayment: '',
        finalPaymentDate: '',
        managementFee: '',
        repairDetails: '',
    }),
    actions: {
        updateField(field, value) {
            this[field] = value;
        }
    }
});
