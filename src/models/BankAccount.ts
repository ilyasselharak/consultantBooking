import { model, Schema } from "mongoose";

const bankAccountSchema = new Schema({
  accountNumber: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  bankName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // يمكنك إضافة المزيد من الحقول حسب الحاجة
}, {
  timestamps: true
});

const BankAccount = model("BankAccount", bankAccountSchema);

export default BankAccount;

/** 
 * -1- post payment
 *  == {
 * infrometion: {
 *  amount: number,
 * IBAN: string
 * 
 * }
 * -2- post booking BY PAYMENT ID
 * -3- confirm or cancel booking */