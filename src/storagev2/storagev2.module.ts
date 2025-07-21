import { forwardRef, Module } from "@nestjs/common";
import { StorageV2Service } from "./service/storagev2.service";
import { StorageV2Controller } from "./controller/storagev2.controller";
import { LogDbModule } from "../logdb/logdb.module";

@Module({
  controllers: [StorageV2Controller],
  imports: [
      forwardRef(() => LogDbModule),
  ],
  providers: [StorageV2Service],
  exports: [StorageV2Service],
})
export class StorageV2Module {}
