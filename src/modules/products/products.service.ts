import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ListProductsQueryDto } from './dto/list-products-query.dto';

const productInclude = {
  brand: true,
  capacity: true,
  size: true,
  professionTools: {
    include: {
      profession: true,
    },
  },
} satisfies Prisma.ToolInclude;

type ProductRecord = Prisma.ToolGetPayload<{ include: typeof productInclude }>;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListProductsQueryDto) {
    const where: Prisma.ToolWhereInput = {
      ...(query.availableOnly === 'false' ? {} : { isAvailable: true }),
      ...(query.search
        ? {
            OR: [
              { nameUz: { contains: query.search, mode: 'insensitive' } },
              { nameRu: { contains: query.search, mode: 'insensitive' } },
              { nameEn: { contains: query.search, mode: 'insensitive' } },
              {
                descriptionUz: { contains: query.search, mode: 'insensitive' },
              },
            ],
          }
        : {}),
      ...(query.brand
        ? {
            brand: {
              OR: [
                { nameUz: { contains: query.brand, mode: 'insensitive' } },
                { nameRu: { contains: query.brand, mode: 'insensitive' } },
                { nameEn: { contains: query.brand, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.tool.findMany({
        where,
        include: productInclude,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.tool.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toProduct(item)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.tool.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toProduct(product);
  }

  private toProduct(tool: ProductRecord) {
    const title = tool.nameUz || tool.nameEn || tool.nameRu;
    const description =
      tool.descriptionUz || tool.descriptionEn || tool.descriptionRu || '';

    return {
      id: tool.id,
      title,
      slug: `${title
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')}-${tool.id.slice(0, 8)}`,
      description,
      category:
        tool.brand?.nameUz ??
        tool.professionTools[0]?.profession.nameUz ??
        tool.size?.nameUz ??
        'Instrument',
      price: Number(tool.price),
      stock: tool.quantity,
      imageUrl: tool.image,
      isActive: tool.isAvailable,
      code: tool.code,
      brand: tool.brand
        ? {
            id: tool.brand.id,
            name: tool.brand.nameUz,
          }
        : null,
      size: tool.size
        ? {
            id: tool.size.id,
            name: tool.size.nameUz,
          }
        : null,
      capacity: tool.capacity
        ? {
            id: tool.capacity.id,
            name: tool.capacity.nameUz,
          }
        : null,
      createdAt: tool.createdAt,
      updatedAt: tool.updatedAt,
    };
  }
}
