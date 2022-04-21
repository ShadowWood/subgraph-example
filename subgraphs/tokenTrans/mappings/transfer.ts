import {} from "@graphprotocol/graph-ts";
import { TransferRecord } from "../types/schema";
import { Transfer } from "../types/ERC20TokenTransfer/ERC20";
import { loadToken, loadUser, convertTokenToDecimal } from "./helper";

export function handleTransfer(event: Transfer): void {
  let from = event.params.from;
  let to = event.params.to;

  let fromUser = loadUser(from);
  let toUser = loadUser(to);

  let transToken = loadToken(event.address);

  let newRecord = new TransferRecord(event.transaction.hash.toHexString().concat(event.logIndex.toHexString()));

  newRecord.transactionHash = event.transaction.hash.toHexString();
  newRecord.from = fromUser.id;
  newRecord.to = toUser.id;
  newRecord.token = transToken.id;
  newRecord.block = event.block.number;
  newRecord.timestamp = event.block.timestamp;
  newRecord.amount = convertTokenToDecimal(event.params.value, transToken.decimals);

  newRecord.save();
  fromUser.tranferRecords = fromUser.tranferRecords.concat([newRecord.id]);
  fromUser.save();
}
