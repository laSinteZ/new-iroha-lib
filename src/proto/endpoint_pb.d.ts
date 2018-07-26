// package: iroha.protocol
// file: endpoint.proto

import * as jspb from "google-protobuf";
import * as transaction_pb from "./transaction_pb";
import * as queries_pb from "./queries_pb";
import * as qry_responses_pb from "./qry_responses_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class ToriiResponse extends jspb.Message {
  getTxStatus(): TxStatus;
  setTxStatus(value: TxStatus): void;

  getTxHash(): Uint8Array | string;
  getTxHash_asU8(): Uint8Array;
  getTxHash_asB64(): string;
  setTxHash(value: Uint8Array | string): void;

  getErrorMessage(): string;
  setErrorMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ToriiResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ToriiResponse): ToriiResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ToriiResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ToriiResponse;
  static deserializeBinaryFromReader(message: ToriiResponse, reader: jspb.BinaryReader): ToriiResponse;
}

export namespace ToriiResponse {
  export type AsObject = {
    txStatus: TxStatus,
    txHash: Uint8Array | string,
    errorMessage: string,
  }
}

export class TxStatusRequest extends jspb.Message {
  getTxHash(): Uint8Array | string;
  getTxHash_asU8(): Uint8Array;
  getTxHash_asB64(): string;
  setTxHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TxStatusRequest): TxStatusRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxStatusRequest;
  static deserializeBinaryFromReader(message: TxStatusRequest, reader: jspb.BinaryReader): TxStatusRequest;
}

export namespace TxStatusRequest {
  export type AsObject = {
    txHash: Uint8Array | string,
  }
}

export class TxList extends jspb.Message {
  clearTransactionsList(): void;
  getTransactionsList(): Array<transaction_pb.Transaction>;
  setTransactionsList(value: Array<transaction_pb.Transaction>): void;
  addTransactions(value?: transaction_pb.Transaction, index?: number): transaction_pb.Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxList.AsObject;
  static toObject(includeInstance: boolean, msg: TxList): TxList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxList;
  static deserializeBinaryFromReader(message: TxList, reader: jspb.BinaryReader): TxList;
}

export namespace TxList {
  export type AsObject = {
    transactionsList: Array<transaction_pb.Transaction.AsObject>,
  }
}

export enum TxStatus {
  STATELESS_VALIDATION_FAILED = 0,
  STATELESS_VALIDATION_SUCCESS = 1,
  STATEFUL_VALIDATION_FAILED = 2,
  STATEFUL_VALIDATION_SUCCESS = 3,
  COMMITTED = 4,
  MST_EXPIRED = 5,
  NOT_RECEIVED = 6,
}

