import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { StockService } from '../services/stock.service';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

const createStockSchema = z.object({
  name: z.string(),
  quantity: z.coerce.number(),
  relationId: z.string(),
});

const updateStockSchema = z.object({
  quantity: z.coerce.number(),
});

type CreateStock = z.infer<typeof createStockSchema>;
type UpdateStock = z.infer<typeof updateStockSchema>;

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @UseInterceptors(LoggingInterceptor)
  @Get()
  async getAllStock(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.stockService.getAllStock(limit, page);
  }

  @Get(':productId')
  async getStock(@Param('productId') productId: string) {
    const product = await this.stockService.getStock(productId);
    if (!product) throw new NotFoundException();
    return product;
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createStockSchema))
  @Post()
  async createStock(@Body() { name, quantity, relationId }: CreateStock) {
    return this.stockService.createStock({ name, quantity, relationId });
  }

  @Patch(':productId')
  async updateStock(
    @Param('productId') productId: string,
    @Body(new ZodValidationPipe(updateStockSchema)) { quantity }: UpdateStock,
  ) {
    return this.stockService.updateStock(productId, quantity);
  }

  @UseGuards(AuthGuard)
  @Delete(':productId')
  async deleteStock(@Param('productId') productId: string) {
    return this.stockService.deleteStock(productId);
  }
}
