import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { BasketModule } from './modules/basket/basket.module';
import { BrandModule } from './modules/catalog/brands/brand.module';
import { CapasityModule } from './modules/catalog/capacities/capasity.module';
import { SizeModule } from './modules/catalog/sizes/size.module';
import { CommentModule } from './modules/comments/comment.module';
import { AboutUsModule } from './modules/content/about/about_us.module';
import { ContactUsModule } from './modules/content/contacts/contact_us.module';
import { FaqModule } from './modules/content/faq/faq.module';
import { PartnersModule } from './modules/content/partners/partners.module';
import { ShowcaseModule } from './modules/content/showcase/showcase.module';
import { ChatModule } from './modules/chat/chat.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LevelModule } from './modules/geography/levels/level.module';
import { RegionModule } from './modules/geography/regions/region.module';
import { MasterProfilesModule } from './modules/master-profiles/master-profiles.module';
import { MasterModule } from './modules/masters/master/master.module';
import { MasterProfessionModule } from './modules/masters/master-profession/master-profession.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderMasterModule } from './modules/orders/order-master/order-master.module';
import { ProductsModule } from './modules/products/products.module';
import { ProfessionModule } from './modules/professions/profession/profession.module';
import { ProfessionLevelModule } from './modules/professions/profession-level/profession-level.module';
import { ProfessionToolModule } from './modules/professions/profession-tool/profession-tool.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
import { ToolModule } from './modules/tools/tool.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './common/common.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import cloudinaryConfig from './config/cloudinary.config';
import emailConfig from './config/email.config';
import { validationSchema } from './config/validate-env';
import { CloudinaryIntegrationModule } from './integrations/cloudinary/cloudinary.module';
import { EmailModule } from './integrations/email/email.module';
import { TelegramModule } from './integrations/telegram/telegram.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig, authConfig, emailConfig, cloudinaryConfig],
      validationSchema,
    }),
    CommonModule,
    PrismaModule,
    EmailModule,
    TelegramModule,
    CloudinaryIntegrationModule,
    AuthModule,
    UsersModule,
    BasketModule,
    OrdersModule,
    BrandModule,
    CapasityModule,
    SizeModule,
    CommentModule,
    AboutUsModule,
    ContactUsModule,
    FaqModule,
    PartnersModule,
    ShowcaseModule,
    ChatModule,
    DashboardModule,
    LevelModule,
    RegionModule,
    MasterProfilesModule,
    MasterModule,
    MasterProfessionModule,
    OrderMasterModule,
    ProductsModule,
    ProfessionModule,
    ProfessionLevelModule,
    ProfessionToolModule,
    ServiceRequestsModule,
    ToolModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
