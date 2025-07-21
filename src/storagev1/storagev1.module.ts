import { Module } from "@nestjs/common";
import { StorageV1Service } from "./service/storagev1.service";
import { LogDbModule } from "../logdb/logdb.module";

@Module({
  imports: [LogDbModule],
  providers: [StorageV1Service],
  exports: [StorageV1Service],
})
export class StorageV1Module {}
