import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    return this.appService.getHello();
  }

  @Put()
  async createPatient(@Body() body: any): Promise<void> {
    await this.appService.createPatient(body)
  }

  @Post()
  async webhook(@Body() body: any): Promise<void> {
    await this.appService.processRequest(body)
  }

  
}
